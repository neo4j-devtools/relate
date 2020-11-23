import path from 'path';
import fse from 'fs-extra';
import {from} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {List, Maybe, None, Str} from '@relate/types';
import {v4 as uuidv4} from 'uuid';

import {IProject, IProjectDbms, IProjectInput, IRelateFile, ProjectManifestModel, WriteFileFlag} from '../../models';
import {ProjectsAbstract} from './projects.abstract';
import {LocalEnvironment} from '../environments';
import {ManifestLocal} from '../manifest';
import {ENTITY_TYPES, PROJECT_MANIFEST_FILE} from '../../constants';
import {InvalidArgumentError, NotFoundError} from '../../errors';
import {getAbsoluteProjectPath, getRelativeProjectPath, isSymlink, mapFileToModel} from '../../utils/files';
import {applyEntityFilters, IRelateFilter} from '../../utils/generic';

export class LocalProjects extends ProjectsAbstract<LocalEnvironment> {
    public readonly manifest = new ManifestLocal(
        this.environment,
        ENTITY_TYPES.PROJECT,
        ProjectManifestModel,
        (nameOrId: string) => this.get(nameOrId),
    );

    async create(manifest: Omit<IProjectInput, 'id'>): Promise<IProject> {
        const newId = uuidv4();
        const projectDir = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, newId);
        const exists = await this.resolveProject(manifest.name);

        if (!exists.isEmpty) {
            throw new InvalidArgumentError(`Project ${manifest.name} already exists`);
        }

        await fse.ensureDir(projectDir);
        await this.manifest.update(newId, manifest);

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
                projectId.flatMap(async (id) => {
                    const projectExists = await this.environment.entityExists(ENTITY_TYPES.PROJECT, id);
                    if (!projectExists) {
                        return null;
                    }

                    const projectPath = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, id);
                    const manifest = await this.manifest.get(id);

                    return {
                        ...manifest,
                        root: projectPath,
                    };
                }),
            )
            .unwindPromises();

        return applyEntityFilters(projects.compact(), filters);
    }

    async link(externalPath: string, name: string): Promise<IProject> {
        // Make sure the path we're getting exists
        const externalPathExists = await fse.pathExists(externalPath);
        if (!externalPathExists) {
            throw new InvalidArgumentError(`Path "${externalPath}" does not exist`, ['Use a valid path']);
        }

        const manifestPath = path.join(externalPath, PROJECT_MANIFEST_FILE);
        const manifestExists = await fse.pathExists(manifestPath);

        // If a manifest exists in the target path use it
        /* eslint-disable indent */
        const rawManifest = manifestExists
            ? await fse.readJSON(manifestPath, {encoding: 'utf-8'})
            : {
                  name,
                  id: uuidv4(),
              };
        /* eslint-enable indent */
        const manifestModel = new ProjectManifestModel(rawManifest);

        // Don't override existing data
        const projectExists = await this.environment.entityExists(ENTITY_TYPES.PROJECT, manifestModel.id);
        if (projectExists) {
            throw new InvalidArgumentError(`Project "${manifestModel.name}" already managed by relate`);
        }

        // Replace broken symlinks
        const projectPath = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, manifestModel.id);
        if (await isSymlink(projectPath)) {
            await fse.unlink(projectPath);
        }

        // Enforce unique names
        const projectNameExists = await this.list([
            {
                field: 'name',
                value: manifestModel.name,
            },
        ]);
        if (!projectNameExists.isEmpty) {
            throw new InvalidArgumentError(`Project "${manifestModel.name}" already exists`, ['Use a unique name']);
        }

        await fse.symlink(externalPath, projectPath, 'junction');
        await this.manifest.update(manifestModel.id, manifestModel);

        return this.get(manifestModel.id);
    }

    async unlink(nameOrId: string): Promise<IProject> {
        const project = await this.get(nameOrId);
        const projectPath = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, project.id);

        await fse.unlink(projectPath);

        return project;
    }

    private async getFile(project: IProject, filePath: string): Promise<Maybe<IRelateFile>> {
        const target = getRelativeProjectPath(project, filePath);
        const fileName = path.basename(target);
        const projectDir = path.dirname(target);
        const files = await this.listFiles(project.name);

        return files.find(({name, directory}) => name === fileName && directory === projectDir);
    }

    async addFile(nameOrId: string, source: string, destination?: string, overwrite?: boolean): Promise<IRelateFile> {
        const project = await this.get(nameOrId);
        const target = getAbsoluteProjectPath(project, destination || path.basename(source));
        const projectDir = path.dirname(target);
        const fileName = path.basename(target);
        const fileExists = await this.getFile(project, target);

        fileExists.flatMap((file) => {
            if (!overwrite && !None.isNone(file)) {
                throw new InvalidArgumentError(`File ${file.name} already exists at that destination`);
            }
            if (overwrite && None.isNone(file)) {
                throw new InvalidArgumentError(`File does not exist at that destination`);
            }
        });

        await fse.ensureDir(path.dirname(projectDir));
        await fse.copy(source, target, {overwrite});

        const afterCopy = await this.getFile(project, target);

        return afterCopy.getOrElse(() => {
            throw new NotFoundError(`Unable to add ${fileName} to project`);
        });
    }

    async writeFile(
        nameOrId: string,
        destination: string,
        data: string | Buffer,
        writeFlag?: WriteFileFlag,
    ): Promise<IRelateFile> {
        const project = await this.get(nameOrId);
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

    async removeFile(nameOrId: string, relativePath: string): Promise<IRelateFile> {
        const project = await this.get(nameOrId);
        const maybeFile = await this.getFile(project, relativePath);

        return maybeFile.flatMap(async (file) => {
            if (None.isNone(file)) {
                throw new InvalidArgumentError(`File ${relativePath} does not exist`);
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
        const manifest = await this.manifest.get(project.id);
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

            return this.manifest.update(project.id, {
                dbmss: existing.concat(newDbms).toArray(),
            });
        });

        return newDbms;
    }

    async removeDbms(nameOrId: string, dbmsName: string): Promise<IProjectDbms> {
        const project = await this.get(nameOrId);
        const manifest = await this.manifest.get(project.id);
        const existing = List.from(manifest.dbmss);

        return existing
            .find(({name}) => name === dbmsName)
            .flatMap(async (found) => {
                if (None.isNone(found)) {
                    throw new InvalidArgumentError(`Dbms "${dbmsName}" not found`);
                }

                const without = existing.without(found).toArray();

                await this.manifest.update(project.id, {
                    dbmss: without,
                });

                return found;
            });
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
