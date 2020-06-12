import {Resolver, Args, Query, ResolveField, Parent, Context, Mutation} from '@nestjs/graphql';
import {Inject, UseGuards, UseInterceptors} from '@nestjs/common';
import {Environment, SystemProvider, PUBLIC_GRAPHQL_METHODS} from '@relate/common';
import {List} from '@relate/types';

import {
    AddProjectDbmsArgs,
    AddProjectFileArgs,
    InitProjectArgs,
    Project,
    ProjectDbms,
    RemoveProjectDbmsArgs,
    RemoveProjectFileArgs,
} from './project.types';
import {EnvironmentArgs, RelateFile} from '../global.types';
import {EnvironmentGuard} from '../guards/environment.guard';
import {EnvironmentInterceptor} from '../interceptors/environment.interceptor';

@Resolver(() => Project)
@UseGuards(EnvironmentGuard)
@UseInterceptors(EnvironmentInterceptor)
export class ProjectResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Query(() => [Project])
    async [PUBLIC_GRAPHQL_METHODS.LIST_PROJECTS](
        @Context('environment') environment: Environment,
        @Args() _env: EnvironmentArgs,
    ): Promise<List<Project>> {
        const projects = await environment.projects.list();

        return projects.mapEach((project) => ({
            ...project,
            files: [],
        }));
    }

    @ResolveField()
    files(@Context('environment') environment: Environment, @Parent() project: Project): Promise<List<RelateFile>> {
        return environment.projects.listFiles(project.id);
    }

    @ResolveField()
    dbmss(@Context('environment') environment: Environment, @Parent() project: Project): Promise<List<ProjectDbms>> {
        return environment.projects.listDbmss(project.id);
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

    @Mutation(() => Project)
    async [PUBLIC_GRAPHQL_METHODS.ADD_PROJECT_DBMS](
        @Context('environment') environment: Environment,
        @Args() {projectId, dbmsName, dbmsId, user, accessToken}: AddProjectDbmsArgs,
    ): Promise<ProjectDbms> {
        const dbms = await environment.dbmss.get(dbmsId);

        return environment.projects.addDbms(projectId, dbmsName, dbms, user, accessToken);
    }

    @Mutation(() => Project)
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_PROJECT_DBMS](
        @Context('environment') environment: Environment,
        @Args() {projectId, dbmsName}: RemoveProjectDbmsArgs,
    ): Promise<ProjectDbms> {
        return environment.projects.removeDbms(projectId, dbmsName);
    }

    @Mutation(() => RelateFile)
    async [PUBLIC_GRAPHQL_METHODS.ADD_PROJECT_FILE](
        @Context('environment') environment: Environment,
        @Args() {projectId, fileUpload, destination}: AddProjectFileArgs,
    ): Promise<RelateFile> {
        const {filename, createReadStream} = await fileUpload;
        const uploadedPath = await this.systemProvider.handleFileUpload(filename, createReadStream());

        return environment.projects.addFile(projectId, uploadedPath, destination);
    }

    @Mutation(() => RelateFile)
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_PROJECT_FILE](
        @Context('environment') environment: Environment,
        @Args() {projectId, filePath}: RemoveProjectFileArgs,
    ): Promise<RelateFile> {
        return environment.projects.removeFile(projectId, filePath);
    }
}
