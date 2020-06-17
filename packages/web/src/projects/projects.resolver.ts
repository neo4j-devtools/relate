import {Resolver, Args, Query, ResolveField, Parent, Context, Mutation} from '@nestjs/graphql';
import {Inject, UseGuards, UseInterceptors} from '@nestjs/common';
import {Environment, SystemProvider, PUBLIC_GRAPHQL_METHODS} from '@relate/common';
import {List} from '@relate/types';

import {
    AddProjectDbmsArgs,
    AddProjectFileArgs,
    InitProjectArgs,
    Project,
    ProjectArgs,
    ProjectDbms,
    RemoveProjectDbmsArgs,
    RemoveProjectFileArgs,
} from './projects.types';
import {EnvironmentArgs, RelateFile} from '../global.types';
import {EnvironmentGuard} from '../guards/environment.guard';
import {EnvironmentInterceptor} from '../interceptors/environment.interceptor';

@Resolver(() => Project)
@UseGuards(EnvironmentGuard)
@UseInterceptors(EnvironmentInterceptor)
export class ProjectsResolver {
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
    files(@Context('environment') environment: Environment, @Parent() project: Project): Promise<List<RelateFile>> {
        return environment.projects.listFiles(project.name);
    }

    @ResolveField()
    dbmss(@Context('environment') environment: Environment, @Parent() project: Project): Promise<List<ProjectDbms>> {
        return environment.projects.listDbmss(project.name);
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

        return environment.projects.addDbms(name, dbmsName, dbms, user, accessToken);
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
        @Args() {name, fileUpload, destination}: AddProjectFileArgs,
    ): Promise<RelateFile> {
        const {filename, createReadStream} = await fileUpload;
        const uploadedPath = await this.systemProvider.handleFileUpload(filename, createReadStream());

        return environment.projects.addFile(name, uploadedPath, destination);
    }

    @Mutation(() => RelateFile)
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_PROJECT_FILE](
        @Context('environment') environment: Environment,
        @Args() {name, filePath}: RemoveProjectFileArgs,
    ): Promise<RelateFile> {
        return environment.projects.removeFile(name, filePath);
    }
}
