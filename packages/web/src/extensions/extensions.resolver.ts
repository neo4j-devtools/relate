import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Inject, UseGuards, UseInterceptors} from '@nestjs/common';
import {PUBLIC_GRAPHQL_METHODS, SystemProvider, Environment, STATIC_APP_BASE_ENDPOINT} from '@relate/common';
import {List} from '@relate/types';

import {
    AppData,
    AppLaunchData,
    AppLaunchToken,
    ExtensionData,
    ExtensionVersion,
    CreateLaunchTokenArgs,
    LaunchDataArgs,
    ExtensionArgs,
    InstallExtensionArgs,
} from './extensions.types';
import {createAppLaunchUrl} from './extensions.utils';
import {EnvironmentGuard} from '../guards/environment.guard';
import {EnvironmentInterceptor} from '../interceptors/environment.interceptor';
import {EnvironmentArgs, FilterArgs} from '../global.types';

@Resolver(() => String)
@UseGuards(EnvironmentGuard)
@UseInterceptors(EnvironmentInterceptor)
export class ExtensionsResolver {
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
            environmentId: environment.id,
            ...rest,
        };
    }

    @Query(() => [AppData])
    async [PUBLIC_GRAPHQL_METHODS.LIST_APPS](
        @Context('environment') environment: Environment,
        @Args() _env: EnvironmentArgs,
        @Args() {filters}: FilterArgs,
    ): Promise<List<AppData>> {
        const installedApps = await environment.extensions.listApps(filters);

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
        @Context('environment') environment: Environment,
        @Args() {name, version}: InstallExtensionArgs,
    ): Promise<ExtensionData> {
        return environment.extensions.install(name, version);
    }

    @Mutation(() => [ExtensionData])
    async [PUBLIC_GRAPHQL_METHODS.UNINSTALL_EXTENSION](
        @Context('environment') environment: Environment,
        @Args() {name}: ExtensionArgs,
    ): Promise<List<ExtensionData>> {
        return environment.extensions.uninstall(name);
    }

    @Query(() => [ExtensionVersion])
    async [PUBLIC_GRAPHQL_METHODS.LIST_EXTENSION_VERSIONS](
        @Context('environment') environment: Environment,
        @Args() {filters}: FilterArgs,
        @Args() _env: EnvironmentArgs,
    ): Promise<List<ExtensionVersion>> {
        return environment.extensions.list(filters);
    }

    @Query(() => [AppData])
    async [PUBLIC_GRAPHQL_METHODS.LIST_EXTENSIONS](
        @Context('environment') environment: Environment,
        @Args() {filters}: FilterArgs,
        @Args() _env: EnvironmentArgs,
    ): Promise<List<ExtensionData>> {
        return environment.extensions.list(filters);
    }
}
