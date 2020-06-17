import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Inject, UseGuards, UseInterceptors} from '@nestjs/common';
import {
    EXTENSION_TYPES,
    PUBLIC_GRAPHQL_METHODS,
    SystemProvider,
    Environment,
    STATIC_APP_BASE_ENDPOINT,
} from '@relate/common';
import {List} from '@relate/types';

import {
    AppData,
    AppLaunchData,
    AppLaunchToken,
    ExtensionData,
    ExtensionVersion,
    CreateLaunchTokenArgs,
    LaunchDataArgs,
} from './app.types';
import {createAppLaunchUrl} from './apps.utils';
import {EnvironmentGuard} from '../guards/environment.guard';
import {EnvironmentInterceptor} from '../interceptors/environment.interceptor';
import {EnvironmentArgs, FilterArgs} from '../global.types';

@Resolver(() => String)
@UseGuards(EnvironmentGuard)
@UseInterceptors(EnvironmentInterceptor)
export class AppsResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Query(() => AppLaunchData)
    async [PUBLIC_GRAPHQL_METHODS.APP_LAUNCH_DATA](
        @Context('environment') environment: Environment,
        @Args() {appName, launchToken}: LaunchDataArgs,
    ): Promise<AppLaunchData> {
        const {dbmsId, ...rest} = await this.systemProvider.parseAppLaunchToken(appName, launchToken);
        const dbms = await environment.dbmss.get(dbmsId);

        return {
            dbms,
            environmentNameOrId: environment.id,
            ...rest,
        };
    }

    @Query(() => [AppData])
    async [PUBLIC_GRAPHQL_METHODS.INSTALLED_APPS](
        @Context('environment') environment: Environment,
        @Args() _env: EnvironmentArgs,
        @Args() {filters}: FilterArgs,
    ): Promise<List<AppData>> {
        const installedApps = (await environment.extensions.list(filters)).filter(
            ({type}) => type === EXTENSION_TYPES.STATIC,
        );

        return installedApps
            .mapEach(async (app) => {
                const appPath = await environment.extensions.getAppPath(app.name, STATIC_APP_BASE_ENDPOINT);

                return {
                    ...app,
                    path: appPath,
                };
            })
            .unwindPromises();
    }

    @Mutation(() => AppLaunchToken)
    async [PUBLIC_GRAPHQL_METHODS.CREATE_APP_LAUNCH_TOKEN](
        @Context('environment') environment: Environment,
        @Args() {appName, dbmsId, principal, accessToken}: CreateLaunchTokenArgs,
    ): Promise<AppLaunchToken> {
        const token = await this.systemProvider.createAppLaunchToken(
            environment.id,
            appName,
            dbmsId,
            principal,
            accessToken,
        );
        const appBasePath = await environment.extensions.getAppPath(appName, STATIC_APP_BASE_ENDPOINT);

        return {
            path: createAppLaunchUrl(appBasePath, token),
            token,
        };
    }

    // @todo: need to add tests here and in common for:
    // INSTALL_EXTENSION, UNINSTALL_EXTENSION, LIST_EXTENSION_VERSIONS, INSTALLED_EXTENSIONS
    @Mutation(() => AppData)
    async [PUBLIC_GRAPHQL_METHODS.INSTALL_EXTENSION](
        @Args('name') name: string,
        @Args('version') version: string,
        @Args('environmentNameOrId', {nullable: true}) environmentNameOrId?: string,
    ): Promise<AppData> {
        const environment = await this.systemProvider.getEnvironment(environmentNameOrId);
        const installedApp = await environment.extensions.install(name, version);

        return {
            ...installedApp,
            path: await environment.extensions.getAppPath(installedApp.name, STATIC_APP_BASE_ENDPOINT),
        };
    }

    @Mutation(() => [ExtensionData])
    async [PUBLIC_GRAPHQL_METHODS.UNINSTALL_EXTENSION](
        @Args('name') name: string,
        @Args('environmentNameOrId', {nullable: true}) environmentNameOrId?: string,
    ): Promise<ExtensionData[]> {
        const environment = await this.systemProvider.getEnvironment(environmentNameOrId);
        return (await environment.extensions.uninstall(name)).toArray();
    }

    @Query(() => [ExtensionVersion])
    async [PUBLIC_GRAPHQL_METHODS.LIST_EXTENSION_VERSIONS](
        @Args() {filters}: FilterArgs,
        @Args('environmentNameOrId', {nullable: true}) environmentNameOrId?: string,
    ): Promise<ExtensionVersion[]> {
        const environment = await this.systemProvider.getEnvironment(environmentNameOrId);
        return (await environment.extensions.list(filters)).toArray();
    }

    @Query(() => [AppData])
    async [PUBLIC_GRAPHQL_METHODS.INSTALLED_EXTENSIONS](
        @Args() {filters}: FilterArgs,
        @Args('environmentNameOrId', {nullable: true}) environmentNameOrId?: string,
    ): Promise<AppData[]> {
        const environment = await this.systemProvider.getEnvironment(environmentNameOrId);
        const installedExtensions = await environment.extensions.list(filters);

        const mapped = await installedExtensions
            .mapEach(async (extension) => {
                const extensionPath = await environment.extensions.getAppPath(extension.name, STATIC_APP_BASE_ENDPOINT);

                return {
                    ...extension,
                    path: extensionPath,
                };
            })
            .unwindPromises();

        return mapped.toArray();
    }
}
