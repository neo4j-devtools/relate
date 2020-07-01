import path from 'path';
import fse from 'fs-extra';
import {from} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {List, Maybe, None, Str} from '@relate/types';

import {IRelateFile, IProject, ProjectModel, IProjectManifest, IProjectDbms, IDbms, WriteFileFlag} from '../../models';
import {ProjectsAbstract} from './projects.abstract';
import {LocalEnvironment} from '../environments';
import {PROJECTS_MANIFEST_FILE, PROJECTS_DIR_NAME} from '../../constants';
import {ErrorAbstract, InvalidArgumentError, NotFoundError} from '../../errors';
import {getRelativeProjectPath, mapFileToModel, getAbsoluteProjectPath} from '../../utils/files';
import {envPaths} from '../../utils/env-paths';
import {IRelateFilter, applyEntityFilters} from '../../utils/generic';

export class LocalProjects extends ProjectsAbstract<LocalEnvironment> {
    async create(manifest: IProjectManifest, targetDir?: string): Promise<IProject> {
        const defaultDir = path.join(envPaths().data, PROJECTS_DIR_NAME, manifest.name);
        const projectDir = targetDir || defaultDir;
        const exists = await this.resolveProject(manifest.name);

        if (!exists.isEmpty) {
            throw new InvalidArgumentError(`Project ${manifest.name} already exists`);
        }

        const targetManifest = path.join(projectDir, PROJECTS_MANIFEST_FILE);

        await fse.ensureDir(projectDir);
        await fse.writeJSON(targetManifest, manifest);

        if (projectDir !== defaultDir) {
            return this.link(projectDir);
        }

        return this.get(manifest.name);
    }

    async get(name: string): Promise<IProject> {
        const project = await this.resolveProject(name);

        return project.getOrElse(() => {
            throw new NotFoundError(`Could not find project ${name}`);
        });
    }

    async list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>> {
        const projects = await List.from(await fse.readdir(this.environment.dirPaths.projectsData))
            .mapEach(Str.from)
            .mapEach((projectDir) =>
                projectDir.flatMap((dir) => {
                    const projectPath = path.join(this.environment.dirPaths.projectsData, dir);

                    return this.getManifest(projectPath)
                        .then(
                            (manifest) =>
                                new ProjectModel({
                                    ...manifest,
                                    root: projectPath,
                                }),
                        )
                        .catch(() => null);
                }),
            )
            .unwindPromises();

        return applyEntityFilters(projects.compact(), filters);
    }

    async link(projectPath: string): Promise<IProject> {
        try {
            const manifest = await this.getManifest(projectPath);
            const exists = await this.resolveProject(manifest.name);

            if (!exists.isEmpty) {
                throw new InvalidArgumentError(`Project ${manifest.name} already exists`);
            }

            const target = path.join(this.environment.dirPaths.projectsData, manifest.name);

            await fse.symlink(projectPath, target);

            return this.get(manifest.name);
        } catch (e) {
            if (e instanceof ErrorAbstract) {
                throw e;
            }

            throw new InvalidArgumentError(`Failed to link ${projectPath}`);
        }
    }

    private async getFile(project: IProject, filePath: string): Promise<Maybe<IRelateFile>> {
        const target = getRelativeProjectPath(project, filePath);
        const fileName = path.basename(target);
        const projectDir = path.dirname(target);

        const files = await this.listFiles(project.name);
        return files.find(({name, directory}) => name === fileName && directory === projectDir);
    }

    async addFile(projectName: string, source: string, destination?: string): Promise<IRelateFile> {
        const project = await this.get(projectName);

        const target = getAbsoluteProjectPath(project, destination || path.basename(source));
        const projectDir = path.dirname(target);
        const fileName = path.basename(target);

        const fileExists = await this.getFile(project, target);
        fileExists.flatMap((file) => {
            if (!None.isNone(file)) {
                throw new InvalidArgumentError(`File ${file.name} already exists at that destination`);
            }
        });

        await fse.ensureDir(path.dirname(projectDir));
        await fse.copy(source, target);

        const afterCopy = await this.getFile(project, target);
        return afterCopy.getOrElse(() => {
            throw new NotFoundError(`Unable to add ${fileName} to project`);
        });
    }

    async writeFile(
        projectName: string,
        destination: string,
        data: string | Buffer,
        writeFlag?: WriteFileFlag,
    ): Promise<IRelateFile> {
        const project = await this.get(projectName);

        const filePath = getAbsoluteProjectPath(project, destination);
        await fse.writeFile(filePath, data, {
            encoding: 'utf-8',
            flag: writeFlag || WriteFileFlag.OVERWRITE,
        });
        const fileName = path.basename(filePath);

        const afterWrite = await this.getFile(project, filePath);
        return afterWrite.getOrElse(() => {
            throw new NotFoundError(`Unable to write to file "${fileName}"`);
        });
    }

    async removeFile(projectName: string, relativePath: string): Promise<IRelateFile> {
        const project = await this.get(projectName);
        const maybeFile = await this.getFile(project, relativePath);

        return maybeFile.flatMap(async (file) => {
            if (None.isNone(file)) {
                throw new InvalidArgumentError(`File ${relativePath} does not exists`);
            }

            await fse.unlink(path.join(project.root, file.directory, file.name));
            return file;
        });
    }

    async listFiles(nameOrId: string, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IRelateFile>> {
        const project = await this.get(nameOrId);
        const allFiles = await this.findAllFilesRecursive(project.root);
        const mapped = await allFiles.mapEach((file) => mapFileToModel(file, project)).unwindPromises();

        return applyEntityFilters(mapped.compact(), filters);
    }

    async listDbmss(nameOrId: string, filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProjectDbms>> {
        const project = await this.get(nameOrId);

        return applyEntityFilters(List.from(project.dbmss), filters);
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

    async removeDbms(projectName: string, dbmsName: string): Promise<IProjectDbms> {
        const project = await this.get(projectName);
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

    private async resolveProject(projectName: string | Str): Promise<Maybe<IProject>> {
        const nameToUse = Str.from(projectName);
        const allProjects = await this.list();

        return allProjects.find(({name}) => nameToUse.equals(name));
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
