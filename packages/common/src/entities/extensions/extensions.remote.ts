import gql from 'graphql-tag';
import {List, None} from '@relate/types';

import {GraphqlError, NotAllowedError, NotFoundError} from '../../errors';
import {EXTENSION_TYPES, PUBLIC_GRAPHQL_METHODS} from '../../constants';
import {IExtensionMeta, IExtensionVersion} from '../../utils/extensions';
import {ExtensionsAbstract} from './extensions.abstract';
import {RemoteEnvironment} from '../environments';

export class RemoteExtensions extends ExtensionsAbstract<RemoteEnvironment> {
    async getAppPath(appName: string): Promise<string> {
        // @todo: listInstalledApps has a bad typing for remote env
        const installed: List<any> = await this.list();

        return installed
            .find(({name, type}) => type === EXTENSION_TYPES.STATIC && name === appName)
            .flatMap((app) => {
                if (None.isNone(app)) {
                    throw new NotFoundError(`App ${appName} not found`);
                }

                return app.path;
            });
    }

    async versions(): Promise<List<IExtensionVersion>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                query ExtensionVersions {
                    ${PUBLIC_GRAPHQL_METHODS.LIST_EXTENSION_VERSIONS} {
                        name
                        version
                        origin
                    }
                }
            `,
            variables: {},
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to list extension versions',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data.listExtensionVersions);
    }

    async list(): Promise<List<IExtensionMeta>> {
        const {data, errors}: any = await this.environment.graphql({
            query: gql`
                query InstalledExtensions {
                    ${PUBLIC_GRAPHQL_METHODS.INSTALLED_EXTENSIONS} {
                        name
                        type
                        path
                    }
                }
            `,
            variables: {},
        });

        if (errors) {
            throw new GraphqlError(
                'Unable to list installed extensions',
                List.from<Error>(errors).mapEach(({message}) => message),
            );
        }

        return List.from(data.installedExtensions);
    }

    link(_filePath: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${RemoteEnvironment.name} does not support linking extensions`);
    }

    async install(name: string, version: string): Promise<IExtensionMeta> {
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

        return data.installExtension;
    }

    async uninstall(name: string): Promise<List<IExtensionMeta>> {
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

        return List.from(data.uninstallExtension);
    }
}
