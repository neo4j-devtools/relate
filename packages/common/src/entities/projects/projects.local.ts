import path from 'path';
import fse from 'fs-extra';
import {from} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {List, Maybe, None, Str} from '@relate/types';
import {v4 as uuidv4} from 'uuid';

import {
    IProject,
    IProjectDbms,
    IProjectInput,
    IProjectManifest,
    IRelateFile,
    ProjectModel,
    WriteFileFlag,
} from '../../models';
import {ProjectsAbstract} from './projects.abstract';
import {LocalEnvironment} from '../environments';
import {ENTITY_TYPES, PROJECT_MANIFEST_FILE} from '../../constants';
import {ErrorAbstract, InvalidArgumentError, NotFoundError} from '../../errors';
import {getAbsoluteProjectPath, getRelativeProjectPath, mapFileToModel} from '../../utils/files';
import {applyEntityFilters, IRelateFilter} from '../../utils/generic';

export class LocalProjects extends ProjectsAbstract<LocalEnvironment> {
    async create(manifest: IProjectInput, targetDir?: string): Promise<IProject> {
        const newId = uuidv4();
        const defaultDir = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, newId);
        const projectDir = targetDir || defaultDir;
        const exists = await this.resolveProject(manifest.name);

        if (!exists.isEmpty) {
            throw new InvalidArgumentError(`Project ${manifest.name} already exists`);
        }

        if (projectDir !== defaultDir) {
            const {id} = await this.link(projectDir);
            await this.updateManifest(id, manifest);

            return this.get(manifest.name);
        }

        await fse.ensureDir(projectDir);
        await this.updateManifest(newId, manifest);

        return this.get(manifest.name);
    }

    async get(nameOrId: string): Promise<IProject> {
        const project = await this.resolveProject(nameOrId);

        return project.getOrElse(() => {
            throw new NotFoundError(`Could not find project ${nameOrId}`);
        });
    }

    async list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>> {
        const projects = await List.from(await fse.readdir(this.environment.dirPaths.projectsData))
            .mapEach(Str.from)
            .filter((name) => name.startsWith(`${ENTITY_TYPES.PROJECT}-`))
            .mapEach((name) => name.replace(`${ENTITY_TYPES.PROJECT}-`, ''))
            .mapEach((projectId) =>
                projectId.flatMap((id) => {
                    const projectPath = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, id);

                    return this.getManifest(id)
                        .then(
                            (manifest) =>
                                new ProjectModel({
                                    ...manifest,
                                    root: projectPath,
                                    id,
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
            const newId = uuidv4();
            const manifest = await this.getManifest(newId);
            const exists = await this.resolveProject(manifest.name);

            if (!exists.isEmpty) {
                throw new InvalidArgumentError(`Project ${manifest.name} already exists`);
            }

            const target = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, newId);

            await fse.symlink(path.normalize(projectPath), target, 'junction');
            await this.updateManifest(newId, {
                id: newId,
            });

            return this.get(newId);
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
        const fileName = path.basename(filePath);

        await fse.writeFile(filePath, data, {
            encoding: 'utf-8',
            flag: writeFlag || WriteFileFlag.OVERWRITE,
        });

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
        dbmsId: string,
        principal?: string,
        accessToken?: string,
    ): Promise<IProjectDbms> {
        const project = await this.get(nameOrId);
        const dbms = await this.environment.dbmss.get(dbmsId);
        const manifest = await this.getManifest(project.id);
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

            return this.updateManifest(project.id, {
                dbmss: existing.concat(newDbms).toArray(),
            });
        });

        return newDbms;
    }

    async removeDbms(projectName: string, dbmsName: string): Promise<IProjectDbms> {
        const project = await this.get(projectName);
        const manifest = await this.getManifest(project.id);
        const existing = List.from(manifest.dbmss);

        return existing
            .find(({name}) => name === dbmsName)
            .flatMap(async (found) => {
                if (None.isNone(found)) {
                    throw new InvalidArgumentError(`Dbms "${dbmsName}" not found`);
                }

                const without = existing.without(found).toArray();

                await this.updateManifest(project.id, {
                    dbmss: without,
                });

                return found;
            });
    }

    private async getManifest(projectId: string): Promise<IProjectManifest> {
        const root = await this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, projectId);
        const projectManifestFile = path.join(root, PROJECT_MANIFEST_FILE);
        const defaults: IProjectManifest = {
            dbmss: [],
            id: projectId,
            name: '',
        };

        if (!(await fse.pathExists(projectManifestFile))) {
            return defaults;
        }

        const manifest = await fse.readJSON(projectManifestFile);

        return {
            ...defaults,
            ...manifest,
            id: projectId,
        };
    }

    private async updateManifest(projectId: string, update: Partial<IProjectManifest>): Promise<IProjectManifest> {
        const root = await this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, projectId);
        const projectManifestFile = path.join(root, PROJECT_MANIFEST_FILE);
        const manifest = await this.getManifest(projectId);
        const updated = {
            ...manifest,
            ...update,
            id: projectId,
        };

        await fse.writeJSON(projectManifestFile, updated);

        return updated;
    }

    private async resolveProject(projectId: string | Str): Promise<Maybe<IProject>> {
        const nameToUse = Str.from(projectId);
        const allProjects = await this.list();

        return allProjects.find(
            ({id, name}) => nameToUse.equals(id) || (!Str.EMPTY.equals(name) && nameToUse.equals(name)),
        );
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
