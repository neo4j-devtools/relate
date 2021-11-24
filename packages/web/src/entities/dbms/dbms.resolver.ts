import {Resolver, Args, Mutation, Query, Context, Subscription} from '@nestjs/graphql';
import {Inject, UseGuards, UseInterceptors} from '@nestjs/common';
import {Environment, SystemProvider, PUBLIC_GRAPHQL_METHODS, IDbms, IDbmsInfo, IDbmsVersion} from '@relate/common';
import {List} from '@relate/types';

import {
    Dbms,
    DbmsInfo,
    DbmssArgs,
    CreateAccessTokenArgs,
    InstallDbmsArgs,
    UninstallDbmsArgs,
    DbmsArgs,
    DbmsVersion,
    UpdateDbmsConfigArgs,
    ListDbmsVersionsArgs,
    AddDbmsTagsArgs,
    RemoveDbmsTagsArgs,
    AddDbmsMetadataArgs,
    RemoveDbmsMetadataArgs,
    UpgradeDbmsArgs,
    DbmsEvent,
} from './dbms.types';
import {EnvironmentGuard} from '../../guards/environment.guard';
import {EnvironmentInterceptor} from '../../interceptors/environment.interceptor';
import {EnvironmentArgs, FilterArgs} from '../../global.types';
import path from 'path';
import {DBMS_EVENT_TYPE, pubSub, setDbmsWatcher} from '../../utils/file-watcher.utils';
import {DBMSS_PID_FILE_GLOB} from '../../constants';
import {FSWatcher} from 'chokidar';

const environmentWatchers: Map<string, FSWatcher> = new Map();

// taken from https://github.com/nestjs/graphql/issues/186
// may need looking at in future
function withCancel<T>(
    asyncIterator: AsyncIterator<T | undefined>,
    onCancel: () => void,
): AsyncIterator<T | undefined> {
    if (!asyncIterator.return) {
        asyncIterator.return = () =>
            Promise.resolve({
                value: undefined,
                done: true,
            });
    }

    const savedReturn = asyncIterator.return.bind(asyncIterator);
    asyncIterator.return = () => {
        onCancel();
        return savedReturn();
    };

    return asyncIterator;
}

@Resolver(() => String)
@UseGuards(EnvironmentGuard)
@UseInterceptors(EnvironmentInterceptor)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Mutation(() => DbmsInfo)
    async [PUBLIC_GRAPHQL_METHODS.INSTALL_DBMS](
        @Context('environment') environment: Environment,
        @Args() {name, credentials, version, edition, noCaching, limited}: InstallDbmsArgs,
    ): Promise<DbmsInfo> {
        return environment.dbmss.install(name, version, edition, credentials, noCaching, limited);
    }

    @Mutation(() => DbmsInfo)
    async [PUBLIC_GRAPHQL_METHODS.UNINSTALL_DBMS](
        @Context('environment') environment: Environment,
        @Args() {name}: UninstallDbmsArgs,
    ): Promise<DbmsInfo> {
        return environment.dbmss.uninstall(name);
    }

    @Query(() => DbmsInfo)
    async [PUBLIC_GRAPHQL_METHODS.GET_DBMS](
        @Context('environment') environment: Environment,
        @Args() {dbmsId}: DbmsArgs,
    ): Promise<DbmsInfo> {
        return environment.dbmss.get(dbmsId);
    }

    @Query(() => [Dbms])
    async [PUBLIC_GRAPHQL_METHODS.LIST_DBMSS](
        @Context('environment') environment: Environment,
        @Args() _env: EnvironmentArgs,
        @Args() {filters}: FilterArgs,
    ): Promise<List<IDbms>> {
        return environment.dbmss.list(filters);
    }

    @Query(() => [DbmsInfo])
    async [PUBLIC_GRAPHQL_METHODS.INFO_DBMSS](
        @Context('environment') environment: Environment,
        @Args() {dbmsIds, onlineCheck}: DbmssArgs,
    ): Promise<List<IDbmsInfo>> {
        return environment.dbmss.info(dbmsIds, onlineCheck);
    }

    @Subscription(() => DbmsEvent, {
        resolve: async (payload: any, _variables: any, context: any) => {
            return {
                [payload.eventType]:
                    payload.eventType !== DBMS_EVENT_TYPE.UNINSTALLED
                        ? await context.environment.dbmss.info([payload.dbmsId])
                        : [payload.dbmsId],
            };
        },
    })
    async [PUBLIC_GRAPHQL_METHODS.WATCH_DBMSS](
        @Context('environment') environment: Environment,
    ): Promise<AsyncIterator<unknown, any, undefined>> {
        if (!environmentWatchers.get(environment.id)) {
            const watchPaths = [];
            // watch dbmss pid file glob
            watchPaths.push(path.join(environment.dirPaths.dbmssData, DBMSS_PID_FILE_GLOB));
            // watch dbmss directory
            watchPaths.push(path.join(environment.dirPaths.dbmssData));
            const watcher = setDbmsWatcher(watchPaths);

            // keep a record of environment watcher
            environmentWatchers.set(environment.id, watcher);
        }

        return withCancel(pubSub.asyncIterator('infoDbmssUpdate'), async () => {
            const watcher = environmentWatchers.get(environment.id);
            // close and remove watcher
            if (watcher) {
                await watcher.close();
                environmentWatchers.delete(environment.id);
            }
        });
    }

    @Mutation(() => [String])
    async [PUBLIC_GRAPHQL_METHODS.START_DBMSS](
        @Context('environment') environment: Environment,
        @Args() {dbmsIds}: DbmssArgs,
    ): Promise<List<string>> {
        return environment.dbmss.start(dbmsIds);
    }

    @Mutation(() => [String])
    async [PUBLIC_GRAPHQL_METHODS.STOP_DBMSS](
        @Context('environment') environment: Environment,
        @Args() {dbmsIds}: DbmssArgs,
    ): Promise<List<string>> {
        return environment.dbmss.stop(dbmsIds);
    }

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.CREATE_ACCESS_TOKEN](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, appName, authToken}: CreateAccessTokenArgs,
    ): Promise<string> {
        return environment.dbmss.createAccessToken(appName, dbmsId, authToken);
    }

    @Query(() => [DbmsVersion])
    async [PUBLIC_GRAPHQL_METHODS.LIST_DBMS_VERSIONS](
        @Context('environment') environment: Environment,
        @Args() {limited}: ListDbmsVersionsArgs,
        @Args() {filters}: FilterArgs,
    ): Promise<List<IDbmsVersion>> {
        return environment.dbmss.versions(limited, filters);
    }

    // @todo: do we want to allow updating dbms config here?
    @Mutation(() => Boolean)
    async [PUBLIC_GRAPHQL_METHODS.UPDATE_DBMS_CONFIG](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, properties}: UpdateDbmsConfigArgs,
    ): Promise<boolean> {
        return environment.dbmss.updateConfig(dbmsId, new Map(properties));
    }

    @Mutation(() => DbmsInfo)
    async [PUBLIC_GRAPHQL_METHODS.ADD_DBMS_TAGS](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, tags}: AddDbmsTagsArgs,
    ): Promise<IDbmsInfo> {
        return environment.dbmss.manifest.addTags(dbmsId, tags);
    }

    @Mutation(() => DbmsInfo)
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_DBMS_TAGS](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, tags}: RemoveDbmsTagsArgs,
    ): Promise<IDbmsInfo> {
        return environment.dbmss.manifest.removeTags(dbmsId, tags);
    }

    @Mutation(() => DbmsInfo)
    async [PUBLIC_GRAPHQL_METHODS.SET_DBMS_METADATA](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, key, value}: AddDbmsMetadataArgs,
    ): Promise<IDbmsInfo> {
        return environment.dbmss.manifest.setMetadata(dbmsId, key, value);
    }

    @Mutation(() => DbmsInfo)
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_DBMS_METADATA](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, keys}: RemoveDbmsMetadataArgs,
    ): Promise<IDbmsInfo> {
        return environment.dbmss.manifest.removeMetadata(dbmsId, ...keys);
    }

    @Mutation(() => DbmsInfo)
    async [PUBLIC_GRAPHQL_METHODS.UPGRADE_DBMS](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, version, options}: UpgradeDbmsArgs,
    ): Promise<IDbmsInfo> {
        return environment.dbmss.upgrade(dbmsId, version, options);
    }
}
