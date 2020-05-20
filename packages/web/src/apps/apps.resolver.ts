import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';
import {EXTENSION_TYPES, getAppBasePath, SystemProvider} from '@relate/common';
import {ConfigService} from '@nestjs/config';
import _ from 'lodash';

import {AppData, AppLaunchData, AppLaunchToken} from './models';
import {IWebModuleConfig} from '../web.module';
import {createAppLaunchUrl} from './apps.utils';

@Resolver(() => String)
export class AppsResolver {
    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService<IWebModuleConfig>,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    @Query(() => AppLaunchData)
    async appLaunchData(
        @Args('appName') appName: string,
        @Args('launchToken') launchToken: string,
    ): Promise<AppLaunchData> {
        const {environmentId, dbmsId, ...rest} = await this.systemProvider.parseAppLaunchToken(appName, launchToken);
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const dbms = await environment.getDbms(dbmsId);

        return {
            dbms,
            environmentId: environment.id,
            ...rest,
        };
    }

    @Query(() => [AppData])
    async installedApps(): Promise<AppData[]> {
        const installedExtensions = await this.systemProvider.listInstalledExtensions();
        const protocol = this.configService.get('protocol');
        const host = this.configService.get('host');
        const port = this.configService.get('port');
        const appRoot = this.configService.get('appRoot');

        return _.map(
            _.filter(installedExtensions, ({type}) => type === EXTENSION_TYPES.STATIC),
            (app) => {
                const url = `${protocol}${host}:${port}${appRoot}/${app.name}`;

                return {
                    ...app,
                    url,
                };
            },
        );
    }

    @Mutation(() => AppLaunchToken)
    async createAppLaunchToken(
        @Args('environmentId') environmentId: string,
        @Args('appName') appName: string,
        @Args('dbmsId') dbmsId: string,
        @Args('principal', {nullable: true}) principal?: string,
        @Args('accessToken', {nullable: true}) accessToken?: string,
    ): Promise<AppLaunchToken> {
        const token = await this.systemProvider.createAppLaunchToken(
            environmentId,
            appName,
            dbmsId,
            principal,
            accessToken,
        );
        const protocol = this.configService.get('protocol');
        const host = this.configService.get('host');
        const port = this.configService.get('port');
        const appRoot = this.configService.get('appRoot');
        const appBaseUrl = `${protocol}${host}:${port}${appRoot}`;
        const appBasePath = await getAppBasePath(appName);

        return {
            path: createAppLaunchUrl(`${appBaseUrl}${appBasePath}`, token),
            token,
        };
    }
}
