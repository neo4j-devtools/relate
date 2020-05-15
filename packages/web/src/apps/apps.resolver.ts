import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';
import {EXTENSION_TYPES, SystemProvider} from '@relate/common';
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
    async installedApps(@Args('environmentId') environmentId: string): Promise<AppData[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installedExtensions = await this.systemProvider.listInstalledExtensions();
        const host = this.configService.get('host');
        const port = this.configService.get('port');

        return Promise.all(
            _.map(
                _.filter(installedExtensions, ({type}) => type === EXTENSION_TYPES.STATIC),
                async (app) => {
                    const appPath = await environment.getAppPath(app.name);
                    // @todo: protocol
                    const url = `http://${host}:${port}${appPath}`;

                    return {
                        ...app,
                        url,
                    };
                },
            ),
        );
    }

    @Mutation(() => AppLaunchToken)
    async createAppLaunchToken(
        @Args('environmentId') environmentId: string,
        @Args('appName') appName: string,
        @Args('dbmsId') dbmsId: string,
        @Args('principal') principal: string,
        @Args('accessToken') accessToken: string,
    ): Promise<AppLaunchToken> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const token = await this.systemProvider.createAppLaunchToken(
            environmentId,
            appName,
            dbmsId,
            principal,
            accessToken,
        );
        const host = this.configService.get('host');
        const port = this.configService.get('port');
        const appPath = await environment.getAppPath(appName);
        // @todo: protocol
        const url = `http://${host}:${port}${appPath}`;

        return {
            path: createAppLaunchUrl(url, token),
            token,
        };
    }
}
