import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {SystemProvider} from '@relate/common';
import _ from 'lodash';

import {IWebModuleConfig} from '../web.module';

import {AppData, AppLaunchData, AppLaunchToken} from './models';
import {createAppLaunchUrl} from './apps.utils';

@Resolver(() => String)
export class AppsResolver {
    constructor(
        @Inject(ConfigService) protected readonly configService: ConfigService<IWebModuleConfig>,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    @Query(() => AppLaunchData)
    async appLaunchData(
        @Args('appName') appName: string,
        @Args('launchToken') launchToken: string,
        @Args('environmentId', {nullable: true}) environmentId?: string,
    ): Promise<AppLaunchData> {
        const {dbmsId, ...rest} = await this.systemProvider.parseAppLaunchToken(appName, launchToken);
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const dbms = await environment.getDbms(dbmsId);

        return {
            dbms,
            environmentId: environment.id,
            ...rest,
        };
    }

    @Query(() => [AppData])
    async installedApps(@Args('environmentId', {nullable: true}) environmentId?: string): Promise<AppData[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installedApps = await environment.listInstalledApps();

        return Promise.all(
            _.map(installedApps, async (app) => {
                const appPath = await environment.getAppPath(app.name, this.configService.get('appRoot'));

                return {
                    ...app,
                    path: appPath,
                };
            }),
        );
    }

    @Mutation(() => AppLaunchToken)
    async createAppLaunchToken(
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
        const appBasePath = await environment.getAppPath(appName);

        return {
            path: createAppLaunchUrl(appBasePath, token),
            token,
        };
    }
}
