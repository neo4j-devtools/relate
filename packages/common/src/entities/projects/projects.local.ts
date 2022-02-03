import url from 'url';
import path from 'path';
import fse from 'fs-extra';
import semver from 'semver';
import Plimit from 'p-limit';
import {v4 as uuidv4} from 'uuid';
import {Dict, List, Maybe, None, Str} from '@relate/types';

import {
    IProject,
    IProjectDbms,
    IProjectInput,
    IRelateFile,
    ProjectManifestModel,
    ProjectInstallManifestModel,
    WriteFileFlag,
    ISampleProjectDbms,
    ISampleProjectInput,
    IDbmsInfo,
    IDbmsVersion,
    ISampleProjectRest,
} from '../../models';
import {ProjectsAbstract} from './projects.abstract';
import {LocalEnvironment} from '../environments';
import {ManifestLocal} from '../manifest';
import {ENTITY_TYPES, FILTER_COMPARATORS, PROJECT_MANIFEST_FILE} from '../../constants';
import {AmbiguousTargetError, FetchError, InvalidArgumentError, NotFoundError} from '../../errors';
import {getAbsoluteProjectPath, getRelativeProjectPath, isSymlink, mapFileToModel} from '../../utils/files';
import {applyEntityFilters, IRelateFilter} from '../../utils/generic';
import {download, extract} from '../../utils';
import {requestJson} from '../../utils/download';

export class LocalProjects extends ProjectsAbstract<LocalEnvironment> {
    public readonly manifest = new ManifestLocal(
        this.environment,
        ENTITY_TYPES.PROJECT,
        ProjectManifestModel,
        (nameOrId: string) => this.get(nameOrId),
    );

    public readonly manifestSampleProject = new ManifestLocal(
        this.environment,
        ENTITY_TYPES.PROJECT_INSTALL,
        ProjectInstallManifestModel,
        (nameOrId: string) => this.get(nameOrId),
    );

    async create(manifest: Omit<IProjectInput, 'id'>): Promise<IProject> {
        const newId = uuidv4();
        const projectDir = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, newId);

        const exists = await this.get(manifest.name).catch(() => null);
        if (exists) {
            throw new InvalidArgumentError(`Project ${manifest.name} already exists`);
        }

        await fse.ensureDir(projectDir);
        await this.manifest.update(newId, manifest);

        return this.get(manifest.name);
    }

    async get(nameOrId: string): Promise<IProject> {
        await this.discoverProjects();
        return this.resolveProject(this.projects, nameOrId);
    }

    async discoverProjects(): Promise<void> {
        const projects: Record<string, IProject> = {};

        await List.from(await fse.readdir(this.environment.dirPaths.projectsData))
            .mapEach(Str.from)
            .filter((name) => name.startsWith(`${ENTITY_TYPES.PROJECT}-`))
            .mapEach((name) => name.replace(`${ENTITY_TYPES.PROJECT}-`, ''))
            .mapEach((projectId) =>
                projectId.flatMap(async (id) => {
                    const projectExists = await this.environment.entityExists(ENTITY_TYPES.PROJECT, id);
                    if (!projectExists) {
                        return;
                    }

                    const projectPath = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, id);
                    const manifest = await this.manifest.get(id);

                    projects[id] = {
                        ...manifest,
                        root: projectPath,
                    };
                }),
            )
            .unwindPromises();

        this.projects = projects;
    }

    async list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IProject>> {
        await this.discoverProjects();

        return applyEntityFilters(Dict.from(this.projects).values, filters);
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
        await this.discoverProjects();

        return this.get(manifestModel.id);
    }

    async unlink(nameOrId: string): Promise<IProject> {
        const project = await this.get(nameOrId);
        const projectPath = this.environment.getEntityRootPath(ENTITY_TYPES.PROJECT, project.id);

        await fse.unlink(projectPath);
        delete this.projects[project.id];

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

        // eslint-disable-next-line array-callback-return
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
        const ignoredDirectories = List.from(filters)
            .filter((filter) => filter.field === 'directory' && filter.type === FILTER_COMPARATORS.NOT_CONTAINS)
            .mapEach((filter) => filter.value)
            .toArray();

        const project = await this.get(nameOrId);
        const allFiles = await this.findAllFiles(project.root, ignoredDirectories);

        // Needed to avoid the process running out of memory when listing files
        // in big folders (ie. 100k + files).
        const limit = Plimit(100);
        const mapped = await allFiles.mapEach((file) => limit(mapFileToModel, file, project)).unwindPromises();
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
        const dbmsPredicate = ({name, connectionUri}: IProjectDbms): boolean =>
            name === newDbms.name || connectionUri === newDbms.connectionUri;

        await existing.find(dbmsPredicate).flatMap((found) => {
            if (!None.isNone(found)) {
                throw new InvalidArgumentError(`Dbms "${found.name}" already exists in project`);
            }

            return this.manifest.update(project.id, {dbmss: existing.concat(newDbms).toArray()}, false);
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

                await this.manifest.update(project.id, {dbmss: without}, false);

                return found;
            });
    }

    async listSampleProjects(): Promise<List<ISampleProjectRest>> {
        try {
            const response = await requestJson(
                'https://api.github.com/search/repositories?q=topic:neo4j-approved+org:neo4j-graph-examples',
            );

            return List.from(
                response.items.map(
                    /* eslint-disable-next-line camelcase */
                    ({name, description, default_branch}: ISampleProjectRest) => ({
                        name,
                        description,
                        /* eslint-disable-next-line camelcase */
                        default_branch,
                        /* eslint-disable-next-line camelcase */
                        downloadUrl: `https://github.com/neo4j-graph-examples/${name}/archive/${default_branch}.zip`,
                    }),
                ),
            );
        } catch (error) {
            throw new FetchError(`Unable to fetch Sample Projects from GitHub. ${error}`);
        }
    }

    async downloadSampleProject(
        downloadUrl: string,
        name: string,
        destPath?: string,
    ): Promise<{path: string; temp: boolean}> {
        const {tmp} = this.environment.dirPaths;

        const diskPath = destPath || path.join(tmp, uuidv4());
        const sampleProject = await download(downloadUrl, destPath ? destPath : path.join(diskPath, name));

        const extractedPath = await extract(sampleProject, diskPath);

        return {
            path: extractedPath,
            temp: !destPath,
        };
    }

    async prepareSampleProject(
        srcPath: string,
        args: {
            name?: string;
            projectId?: string;
            temp?: boolean;
        },
    ): Promise<{project: IProjectInput; install?: ISampleProjectInput}> {
        const {name, projectId} = args;
        let {temp} = args;

        let project;

        if (projectId) {
            project = await this.get(projectId);
        } else if (!projectId && !temp && name) {
            project = await this.link(srcPath, name);
        }

        if (!project) {
            temp = true;
            project = await this.create({
                name: name || 'Sample Project',
                dbmss: [],
            });
        }

        if (temp) {
            await fse.copy(srcPath, project.root, {filter: (src) => !src.includes('relate.project.json')});
        }

        return {
            project: await this.manifest.get(project.id),
            install: await this.manifestSampleProject.get(project.id),
        };
    }

    async importSampleDbms(
        projectId: string,
        dbms: ISampleProjectDbms,
        credentials: string,
    ): Promise<{created: IDbmsInfo; dump?: string; script?: string}> {
        const versions = (await this.environment.dbmss.versions()).toArray();
        const semverVersion = semver.maxSatisfying(
            versions.map((v: IDbmsVersion) => v.version),
            dbms.targetNeo4jVersion,
        );

        if (!semverVersion) {
            throw new Error("Couldn't find a suitable DBMS version to install.");
        }

        const version = versions.find((v: IDbmsVersion) => v.version === semverVersion);
        if (!version) {
            throw new Error("Couldn't find a suitable DBMS version to install.");
        }

        const {edition} = version;

        const created = await this.environment.dbmss.install(
            dbms.name || 'Sample DBMS',
            `${semverVersion}`,
            edition,
            credentials,
        );

        const project = await this.get(projectId);

        const handleProjectFile = async ({
            file,
            pathPrefix = '',
            projectPath,
        }: {
            file: string;
            pathPrefix: string;
            projectPath: string;
        }): Promise<string> => {
            if (!file.startsWith('http')) {
                return file;
            }

            const parsed = url.parse(file);
            const fileName = path.basename(parsed.pathname || file);
            const outputPath = path.join(projectPath, pathPrefix, fileName);

            const downloadFilePath = await download(file, projectPath).catch((error) => {
                throw new FetchError(`Unable to download project file: ${file} - (${error})`);
            });

            if (downloadFilePath) {
                await fse.move(downloadFilePath, outputPath);
            }

            return outputPath;
        };

        let dump;
        if (created.id && dbms.dumpFile) {
            const dumpFile = await handleProjectFile({
                file: dbms.dumpFile,
                pathPrefix: 'data',
                projectPath: project.root,
            });
            dump = await this.environment.dbs.load(created.id, 'neo4j', dumpFile);
        }

        let script;
        if (created.id && !dbms.dumpFile && dbms.scriptFile) {
            const scriptFile = await handleProjectFile({
                file: dbms.scriptFile,
                pathPrefix: 'scripts',
                projectPath: project.root,
            });
            script = await this.environment.dbs.exec(created.id, scriptFile, {
                user: 'neo4j',
                database: 'neo4j',
                accessToken: credentials,
            });
        }

        return {
            created,
            dump,
            script,
        };
    }

    private resolveProject(projects: Record<string, IProject>, nameOrId: string): IProject {
        if (projects[nameOrId]) {
            return projects[nameOrId];
        }

        const projectsWithTargetName = Object.values(projects).filter((project) => project.name === nameOrId);

        if (projectsWithTargetName.length === 0) {
            throw new NotFoundError(`Project "${nameOrId}" not found`);
        }

        if (projectsWithTargetName.length > 1) {
            const ids = projectsWithTargetName.map((project) => project.id).join('\n');
            throw new AmbiguousTargetError(`Multiple projects found with name "${nameOrId}": \n${ids}`);
        }

        return projectsWithTargetName[0];
    }

    private async findAllFiles(root: string, ignoredDirs: string[] = []): Promise<List<string>> {
        let dirsToRead = [root];
        const allFiles: string[] = [];

        while (dirsToRead.length) {
            // Read in chunks to avoid hogging memory.
            const currentDirs = dirsToRead.slice(0, 100);
            dirsToRead = dirsToRead.slice(100);

            // eslint-disable-next-line no-await-in-loop
            await List.from(currentDirs)
                // eslint-disable-next-line no-loop-func
                .mapEach(async (dir) => {
                    if (ignoredDirs.includes(path.basename(dir))) {
                        return;
                    }

                    try {
                        const files = await fse.readdir(dir);
                        await List.from(files)
                            .mapEach(async (file) => {
                                const fullPath = path.join(dir, file);
                                const stat = await fse.stat(fullPath);

                                if (stat.isDirectory()) {
                                    dirsToRead.push(fullPath);
                                } else {
                                    allFiles.push(fullPath);
                                }
                            })
                            .unwindPromises();
                    } catch {
                        // User has no permission to read this folder.
                    }
                })
                .unwindPromises();
        }

        return List.from(allFiles);
    }
}
