import gql from 'graphql-tag';
import {Dict, List, None} from '@relate/types';

import {GraphqlError, NotAllowedError, NotFoundError} from '../../errors';
import {PUBLIC_GRAPHQL_METHODS} from '../../constants';
import {IExtensionVersion} from '../../utils/extensions';
import {ExtensionsAbstract} from './extensions.abstract';
import {RemoteEnvironment} from '../environments';
import {IRelateFilter} from '../../utils/generic';
import {IAppLaunchToken, IExtensionInfo} from '../../models';

export class RemoteExtensions extends ExtensionsAbstract<RemoteEnvironment> {
    async getAppPath(appName: string): Promise<string> {
        // @todo: listInstalledApps has a bad typing for remote env
        const installed: List<any> = await this.listApps();

        return installed
            .find(({name}) => name === appName)
            .flatMap((app) => {
                if (None.isNone(app)) {
                    throw new NotFoundError(`App ${appName} not found`);
                }

                return app.path;
            });
    }

    async versions(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionVersion>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                query ExtensionVersions($filters: [RelateSimpleFilter!]) {
                    ${PUBLIC_GRAPHQL_METHODS.LIST_EXTENSION_VERSIONS}(filters: $filters) {
                        name
                        version
                        origin
                    }
                }
            `,
            variables: {filters},
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to list extension versions',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data[PUBLIC_GRAPHQL_METHODS.LIST_EXTENSION_VERSIONS]);
    }

    async list(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionInfo>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                query InstalledExtensions($filters: [RelateSimpleFilter!]) {
                    ${PUBLIC_GRAPHQL_METHODS.LIST_EXTENSIONS}(filters: $filters) {
                        type
                        name
                        version
                        origin
                    }
                }
            `,
            variables: {filters},
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to list installed extensions',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data[PUBLIC_GRAPHQL_METHODS.LIST_EXTENSIONS]);
    }

    async listApps(filters?: List<IRelateFilter> | IRelateFilter[]): Promise<List<IExtensionInfo>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                query InstalledExtensions($filters: [RelateSimpleFilter!]) {
                    ${PUBLIC_GRAPHQL_METHODS.LIST_APPS}(filters: $filters) {
                        name
                        type
                        path
                    }
                }
            `,
            variables: {filters},
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to list installed extensions',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data[PUBLIC_GRAPHQL_METHODS.LIST_APPS]);
    }

    link(_filePath: string): Promise<IExtensionInfo> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support linking extensions`);
    }

    async install(name: string, version: string): Promise<IExtensionInfo> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                mutation InstallExtension($name: String!, version: String!) {
                    ${PUBLIC_GRAPHQL_METHODS.INSTALL_EXTENSION}(name: $name, version: $version) {
                        name
                        type
                        path
                    }
                }
            `,
            variables: {
                name,
                version,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to install extension',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return data[PUBLIC_GRAPHQL_METHODS.INSTALL_EXTENSION];
    }

    async uninstall(name: string): Promise<List<IExtensionInfo>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                mutation UninstallExtension($name: String!) {
                    ${PUBLIC_GRAPHQL_METHODS.UNINSTALL_EXTENSION}(name: $name) {
                        name
                        type
                        path
                    }
                }
            `,
            variables: {name},
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to uninstall extensions',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data[PUBLIC_GRAPHQL_METHODS.UNINSTALL_EXTENSION]);
    }

    async createAppLaunchToken(
        appName: string,
        dbmsId: string,
        principal?: string,
        accessToken?: string,
        projectId?: string,
    ): Promise<string> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                mutation CreateAppLaunchToken(
                    $dbmsId: String!,
                    $appName: String!,
                    $principal: String,
                    $accessToken: String,
                    $projectId: String
                ) {
                    ${PUBLIC_GRAPHQL_METHODS.CREATE_APP_LAUNCH_TOKEN}(
                        dbmsId: $dbmsId,
                        appName: $appName,
                        principal: $principal,
                        accessToken: $accessToken,
                        projectId: $projectId
                    ) {
                        token
                        path
                    }
                }
            `,
            variables: {
                dbmsId,
                appName,
                principal,
                accessToken,
                projectId,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to create app launch token',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return Dict.from(data[PUBLIC_GRAPHQL_METHODS.CREATE_APP_LAUNCH_TOKEN])
            .getValue('token')
            .getOrElse(() => {
                throw new NotFoundError(`Unable to parse app launch token`);
            });
    }

    async parseAppLaunchToken(appName: string, launchToken: string): Promise<IAppLaunchToken> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
               query appLaunchData($appName: String!, $launchToken: String!) {
                    ${PUBLIC_GRAPHQL_METHODS.APP_LAUNCH_DATA}(appName: $appName, launchToken: $launchToken) {
                        environmentId
                        appName
                        dbms {
                            id
                        }
                        principal
                        accessToken
                        projectId
                    }
                }
            `,
            variables: {
                appName,
                launchToken,
            },
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to parse app launch token',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return data[PUBLIC_GRAPHQL_METHODS.APP_LAUNCH_DATA];
    }
}
