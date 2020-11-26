import {Resolver, Args, Query, ResolveField, Parent, Context, Mutation} from '@nestjs/graphql';
import {Inject, UseGuards, UseInterceptors} from '@nestjs/common';
import {Environment, SystemProvider, PUBLIC_GRAPHQL_METHODS} from '@relate/common';
import {List} from '@relate/types';

import {
    AddProjectDbmsArgs,
    AddProjectFileArgs,
    AddProjectMetadataArgs,
    AddProjectTagsArgs,
    InitProjectArgs,
    Project,
    ProjectArgs,
    ProjectDbms,
    RemoveProjectDbmsArgs,
    RemoveProjectFileArgs,
    RemoveProjectMetadataArgs,
    RemoveProjectTagsArgs,
} from './project.types';
import {EnvironmentArgs, FilterArgs, RelateFile} from '../../global.types';
import {EnvironmentGuard} from '../../guards/environment.guard';
import {EnvironmentInterceptor} from '../../interceptors/environment.interceptor';

@Resolver(() => Project)
@UseGuards(EnvironmentGuard)
@UseInterceptors(EnvironmentInterceptor)
export class ProjectResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Query(() => [Project])
    async [PUBLIC_GRAPHQL_METHODS.LIST_PROJECTS](
        @Context('environment') environment: Environment,
        @Args() _env: EnvironmentArgs,
        @Args() {filters}: FilterArgs,
    ): Promise<List<Project>> {
        const projects = await environment.projects.list(filters);

        return projects.mapEach((project) => ({
            ...project,
            files: [],
        }));
    }

    @Query(() => Project)
    async [PUBLIC_GRAPHQL_METHODS.GET_PROJECT](
        @Context('environment') environment: Environment,
        @Args() {name}: ProjectArgs,
    ): Promise<Project> {
        const project = await environment.projects.get(name);

        return {
            ...project,
            files: [],
        };
    }

    @ResolveField()
    files(
        @Context('environment') environment: Environment,
        @Parent() project: Project,
        @Args() {filters}: FilterArgs,
    ): Promise<List<RelateFile>> {
        return environment.projects.listFiles(project.name, filters);
    }

    @ResolveField()
    dbmss(
        @Context('environment') environment: Environment,
        @Parent() project: Project,
        @Args() {filters}: FilterArgs,
    ): Promise<List<ProjectDbms>> {
        return environment.projects.listDbmss(project.name, filters);
    }

    @Mutation(() => Project)
    async [PUBLIC_GRAPHQL_METHODS.INIT_PROJECT](
        @Context('environment') environment: Environment,
        @Args() {name}: InitProjectArgs,
    ): Promise<Project> {
        const project = await environment.projects.create({
            name,
            dbmss: [],
        });

        return {
            ...project,
            files: [],
        };
    }

    @Mutation(() => ProjectDbms)
    async [PUBLIC_GRAPHQL_METHODS.ADD_PROJECT_DBMS](
        @Context('environment') environment: Environment,
        @Args() {name, dbmsName, dbmsId, user, accessToken}: AddProjectDbmsArgs,
    ): Promise<ProjectDbms> {
        const dbms = await environment.dbmss.get(dbmsId);

        return environment.projects.addDbms(name, dbmsName, dbms.id, user, accessToken);
    }

    @Mutation(() => ProjectDbms)
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_PROJECT_DBMS](
        @Context('environment') environment: Environment,
        @Args() {name, dbmsName}: RemoveProjectDbmsArgs,
    ): Promise<ProjectDbms> {
        return environment.projects.removeDbms(name, dbmsName);
    }

    @Mutation(() => RelateFile)
    async [PUBLIC_GRAPHQL_METHODS.ADD_PROJECT_FILE](
        @Context('environment') environment: Environment,
        @Args() {name, fileUpload, destination, overwrite}: AddProjectFileArgs,
    ): Promise<RelateFile> {
        const {filename, createReadStream} = await fileUpload;
        const uploadedPath = await this.systemProvider.handleFileUpload(filename, createReadStream());

        return environment.projects.addFile(name, uploadedPath, destination, overwrite);
    }

    @Mutation(() => RelateFile)
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_PROJECT_FILE](
        @Context('environment') environment: Environment,
        @Args() {name, filePath}: RemoveProjectFileArgs,
    ): Promise<RelateFile> {
        return environment.projects.removeFile(name, filePath);
    }

    @Mutation(() => Project)
    async [PUBLIC_GRAPHQL_METHODS.ADD_PROJECT_TAGS](
        @Context('environment') environment: Environment,
        @Args() {name, tags}: AddProjectTagsArgs,
    ): Promise<Project> {
        const project = await environment.projects.manifest.addTags(name, tags);

        return {
            ...project,
            files: [],
        };
    }

    @Mutation(() => Project)
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_PROJECT_TAGS](
        @Context('environment') environment: Environment,
        @Args() {name, tags}: RemoveProjectTagsArgs,
    ): Promise<Project> {
        const project = await environment.projects.manifest.removeTags(name, tags);

        return {
            ...project,
            files: [],
        };
    }

    @Mutation(() => Project)
    async [PUBLIC_GRAPHQL_METHODS.SET_PROJECT_METADATA](
        @Context('environment') environment: Environment,
        @Args() {name, key, value}: AddProjectMetadataArgs,
    ): Promise<Project> {
        const project = await environment.projects.manifest.setMetadata(name, key, value);

        return {
            ...project,
            files: [],
        };
    }

    @Mutation(() => Project)
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_PROJECT_METADATA](
        @Context('environment') environment: Environment,
        @Args() {name, keys}: RemoveProjectMetadataArgs,
    ): Promise<Project> {
        const project = await environment.projects.manifest.removeMetadata(name, ...keys);

        return {
            ...project,
            files: [],
        };
    }
}
