import path from 'path';
import fse from 'fs-extra';
import {v4 as uuidv4} from 'uuid';
import {from} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {List, Maybe, None, Str} from '@relate/types';

import {IFile, IProject, ProjectModel, IProjectManifest, IProjectDbms, IDbms} from '../../models';
import {ProjectsAbstract} from './projects.abstract';
import {LocalEnvironment} from '../environments';
import {PROJECTS_MANIFEST_FILE, PROJECTS_PREFIX} from '../../constants';
import {ErrorAbstract, InvalidArgumentError, NotFoundError} from '../../errors';
import {getNormalizedProjectPath, mapFileToModel} from '../../utils/files';

export class LocalProjects extends ProjectsAbstract<LocalEnvironment> {
    async create(manifest: IProjectManifest): Promise<IProject> {
        const exists = await this.resolveProject(manifest.name);

        if (!exists.isEmpty) {
            throw new InvalidArgumentError(`Project ${manifest.name} already exists`);
        }

        const newId = uuidv4();
        const targetDir = path.join(this.environment.dirPaths.projectsData, `${PROJECTS_PREFIX}${newId}`);
        const targetManifest = path.join(targetDir, PROJECTS_MANIFEST_FILE);

        await fse.mkdir(targetDir);
        await fse.writeJSON(targetManifest, manifest);

        return this.get(newId);
    }

    async get(nameOrId: string): Promise<IProject> {
        const project = await this.resolveProject(nameOrId);

        return project.getOrElse(() => {
            throw new NotFoundError(`Could not find project ${nameOrId}`);
        });
    }

    async list(): Promise<List<IProject>> {
        const projects = await List.from(await fse.readdir(this.environment.dirPaths.projectsData))
            .mapEach(Str.from)
            .filter((file) => file.startsWith(PROJECTS_PREFIX))
            .mapEach((projectDir) =>
                projectDir.flatMap((dir) => {
                    const projectPath = path.join(this.environment.dirPaths.projectsData, projectDir.get());

                    return this.getManifest(projectPath)
                        .then(
                            (manifest) =>
                                new ProjectModel({
                                    ...manifest,
                                    root: projectPath,
                                    id: dir.replace(PROJECTS_PREFIX, ''),
                                }),
                        )
                        .catch(() => null);
                }),
            )
            .unwindPromises();

        return projects.compact();
    }

    async link(projectPath: string): Promise<IProject> {
        try {
            const manifest = await this.getManifest(projectPath);
            const exists = await this.resolveProject(manifest.name);

            if (!exists.isEmpty) {
                throw new InvalidArgumentError(`Project ${manifest.name} already exists`);
            }

            const newId = uuidv4();
            const target = path.join(this.environment.dirPaths.projectsData, `${PROJECTS_PREFIX}${newId}`);

            await fse.symlink(projectPath, target);

            return this.get(newId);
        } catch (e) {
            if (e instanceof ErrorAbstract) {
                throw e;
            }

            throw new InvalidArgumentError(`Failed to link ${projectPath}`);
        }
    }

    async addFile(nameOrId: string, source: string, destination?: string): Promise<IFile> {
        if (Str.from(destination).includes('..')) {
            throw new InvalidArgumentError('Project files cannot be added outside of project');
        }

        const project = await this.get(nameOrId);
        const fileName = path.basename(destination || source);
        const projectDestination = destination || fileName;
        const projectDir = getNormalizedProjectPath(path.dirname(projectDestination));
        const existingFiles = await this.listFiles(project.id);
        const filePredicate = ({name, directory}: IFile) => name === fileName && directory === projectDir;

        if (!existingFiles.find(filePredicate).isEmpty) {
            throw new InvalidArgumentError(`File ${fileName} already exists at that destination`);
        }

        const target = path.join(project.root, projectDestination);

        await fse.ensureDir(path.dirname(target));
        await fse.copyFile(source, target);

        const afterCopy = await this.listFiles(project.id);

        return afterCopy.find(filePredicate).getOrElse(() => {
            throw new NotFoundError(`Unable to add ${fileName} to project`);
        });
    }

    async removeFile(nameOrId: string, relativePath: string): Promise<IFile> {
        const project = await this.get(nameOrId);
        const fileName = path.basename(relativePath);
        const projectDir = getNormalizedProjectPath(path.dirname(relativePath));
        const existingFiles = await this.listFiles(project.id);
        const filePredicate = ({name, directory}: IFile) => name === fileName && directory === projectDir;

        return existingFiles.find(filePredicate).flatMap(async (found) => {
            if (None.isNone(found)) {
                throw new InvalidArgumentError(`File ${relativePath} does not exists`);
            }

            await fse.unlink(path.join(project.root, relativePath));

            return found;
        });
    }

    async listFiles(nameOrId: string): Promise<List<IFile>> {
        const project = await this.get(nameOrId);
        const projectDir = path.join(this.environment.dirPaths.projectsData, `${PROJECTS_PREFIX}${project.id}`);

        const allFiles = await this.findAllFilesRecursive(projectDir);

        return allFiles.mapEach((file) => mapFileToModel(file, projectDir)).compact();
    }

    async listDbmss(nameOrId: string): Promise<List<IProjectDbms>> {
        const project = await this.get(nameOrId);

        return List.from(project.dbmss);
    }

    async addDbms(
        nameOrId: string,
        dbmsName: string,
        dbms: IDbms,
        principal?: string,
        accessToken?: string,
    ): Promise<IProjectDbms> {
        const project = await this.get(nameOrId);
        const manifest = await this.getManifest(project.root);
        const existing = List.from(manifest.dbmss);
        const newDbms: IProjectDbms = {
            name: dbmsName,
            connectionUri: dbms.connectionUri,
            user: principal,
            accessToken,
        };
        const dbmsPredicate = ({name, connectionUri}: IProjectDbms) =>
            name === newDbms.name || connectionUri === newDbms.connectionUri;

        await existing.find(dbmsPredicate).flatMap((found) => {
            if (!None.isNone(found)) {
                throw new InvalidArgumentError(`Dbms "${found.name}" already exists in project`);
            }

            return this.updateManifest(project.root, {
                dbmss: existing.concat(newDbms).toArray(),
            });
        });

        return newDbms;
    }

    async removeDbms(nameOrId: string, dbmsName: string): Promise<IProjectDbms> {
        const project = await this.get(nameOrId);
        const manifest = await this.getManifest(project.root);
        const existing = List.from(manifest.dbmss);

        return existing
            .find(({name}) => name === dbmsName)
            .flatMap(async (found) => {
                if (None.isNone(found)) {
                    throw new InvalidArgumentError(`Dbms "${dbmsName}" not found`);
                }

                const without = existing.without(found).toArray();

                await this.updateManifest(project.root, {
                    dbmss: without,
                });

                return found;
            });
    }

    private async getManifest(projectDir: string): Promise<IProjectManifest> {
        const projectManifestFile = path.join(projectDir, PROJECTS_MANIFEST_FILE);

        if (!(await fse.pathExists(projectManifestFile))) {
            throw new InvalidArgumentError(`Directory does not contain a project manifest.`);
        }

        return fse.readJSON(projectManifestFile);
    }

    private async updateManifest(projectDir: string, update: Partial<IProjectManifest>): Promise<IProjectManifest> {
        const projectManifestFile = path.join(projectDir, PROJECTS_MANIFEST_FILE);

        if (!(await fse.pathExists(projectManifestFile))) {
            throw new InvalidArgumentError(`Directory does not contain a project manifest.`);
        }

        const manifest = await fse.readJSON(projectManifestFile);
        const updated = {
            ...manifest,
            ...update,
        };

        await fse.writeJSON(projectManifestFile, updated);

        return updated;
    }

    private async resolveProject(nameOrId: string | Str): Promise<Maybe<IProject>> {
        const nameOrIdToUse = Str.from(nameOrId);
        const allProjects = await this.list();

        return allProjects.find(({name, id}) => nameOrIdToUse.equals(name) || nameOrIdToUse.equals(id));
    }

    private findAllFilesRecursive(root: string): Promise<List<string>> {
        return from(fse.readdir(root))
            .pipe(
                flatMap((files) =>
                    List.from(files)
                        .mapEach(async (file) => {
                            const fullPath = path.join(root, file);
                            const stat = await fse.stat(fullPath);

                            if (!stat.isDirectory()) {
                                return List.from([fullPath]);
                            }

                            return this.findAllFilesRecursive(fullPath);
                        })
                        .unwindPromises(),
                ),
                map((l) => l.flatten()),
            )
            .toPromise();
    }
}
