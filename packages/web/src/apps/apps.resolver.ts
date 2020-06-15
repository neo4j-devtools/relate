import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Inject, UseGuards} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {EXTENSION_TYPES, PUBLIC_GRAPHQL_METHODS, SystemProvider} from '@relate/common';

import {IWebModuleConfig} from '../web.module';

import {AppData, AppLaunchData, AppLaunchToken, ExtensionData, ExtensionVersion} from './models';
import {createAppLaunchUrl} from './apps.utils';
import {EnvironmentMethodGuard} from '../guards/environment-method.guard';

@Resolver(() => String)
@UseGuards(EnvironmentMethodGuard)
export class AppsResolver {
    constructor(
        @Inject(ConfigService) protected readonly configService: ConfigService<IWebModuleConfig>,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    @Query(() => AppLaunchData)
    async [PUBLIC_GRAPHQL_METHODS.APP_LAUNCH_DATA](
        @Args('appName') appName: string,
        @Args('launchToken') launchToken: string,
        @Args('environmentId', {nullable: true}) environmentId?: string,
    ): Promise<AppLaunchData> {
        const {dbmsId, ...rest} = await this.systemProvider.parseAppLaunchToken(appName, launchToken);
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const dbms = await environment.dbmss.get(dbmsId);

        return {
            dbms,
            environmentId: environment.id,
            ...rest,
        };
    }

    @Query(() => [AppData])
    async [PUBLIC_GRAPHQL_METHODS.INSTALLED_APPS](
        @Args('environmentId', {nullable: true}) environmentId?: string,
    ): Promise<AppData[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installedApps = (await environment.extensions.list()).filter(({type}) => type === EXTENSION_TYPES.STATIC);

        const mapped = await installedApps
            .mapEach(async (app) => {
                const appPath = await environment.extensions.getAppPath(app.name, this.configService.get('appRoot'));

                return {
                    ...app,
                    path: appPath,
                };
            })
            .unwindPromises();

        return mapped.toArray();
    }

    @Mutation(() => AppLaunchToken)
    async [PUBLIC_GRAPHQL_METHODS.CREATE_APP_LAUNCH_TOKEN](
        @Args('appName') appName: string,
        @Args('dbmsId') dbmsId: string,
        @Args('principal', {nullable: true}) principal?: string,
        @Args('accessToken', {nullable: true}) accessToken?: string,
        @Args('environmentId', {nullable: true}) environmentId?: string,
    ): Promise<AppLaunchToken> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const token = await this.systemProvider.createAppLaunchToken(
            environment.id,
            appName,
            dbmsId,
            principal,
            accessToken,
        );
        const appBasePath = await environment.extensions.getAppPath(appName, this.configService.get('appRoot'));

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
        @Args('environmentId', {nullable: true}) environmentId?: string,
    ): Promise<AppData> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installedApp = await environment.extensions.install(name, version);

        return {
            ...installedApp,
            path: await environment.extensions.getAppPath(installedApp.name, this.configService.get('appRoot')),
        };
    }

    @Mutation(() => [ExtensionData])
    async [PUBLIC_GRAPHQL_METHODS.UNINSTALL_EXTENSION](
        @Args('name') name: string,
        @Args('environmentId', {nullable: true}) environmentId?: string,
    ): Promise<ExtensionData[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return (await environment.extensions.uninstall(name)).toArray();
    }

    @Query(() => [ExtensionVersion])
    async [PUBLIC_GRAPHQL_METHODS.LIST_EXTENSION_VERSIONS](
        @Args('environmentId', {nullable: true}) environmentId?: string,
    ): Promise<ExtensionVersion[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return (await environment.extensions.list()).toArray();
    }

    @Query(() => [AppData])
    async [PUBLIC_GRAPHQL_METHODS.INSTALLED_EXTENSIONS](
        @Args('environmentId', {nullable: true}) environmentId?: string,
    ): Promise<AppData[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installedExtensions = await environment.extensions.list();

        const mapped = await installedExtensions
            .mapEach(async (extension) => {
                const extensionPath = await environment.extensions.getAppPath(
                    extension.name,
                    this.configService.get('appRoot'),
                );

                return {
                    ...extension,
                    path: extensionPath,
                };
            })
            .unwindPromises();

        return mapped.toArray();
    }
}
