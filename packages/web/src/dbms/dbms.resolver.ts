import {Resolver, Args, Mutation, Query, Context} from '@nestjs/graphql';
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
    DbmsVersionArgs,
    UpdateDbmsConfigArgs,
} from './dbms.types';
import {EnvironmentGuard} from '../guards/environment.guard';
import {EnvironmentInterceptor} from '../interceptors/environment.inteceptor';
import {EnvironmentArgs} from '../global.types';

@Resolver(() => String)
@UseGuards(EnvironmentGuard)
@UseInterceptors(EnvironmentInterceptor)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.INSTALL_DBMS](
        @Context('environment') environment: Environment,
        @Args() {name, credentials, version}: InstallDbmsArgs,
    ): Promise<string> {
        return environment.dbmss.install(name, credentials, version);
    }

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.UNINSTALL_DBMS](
        @Context('environment') environment: Environment,
        @Args() {name}: UninstallDbmsArgs,
    ): Promise<string> {
        return environment.dbmss.uninstall(name).then(() => name);
    }

    @Query(() => Dbms)
    async [PUBLIC_GRAPHQL_METHODS.GET_DBMS](
        @Context('environment') environment: Environment,
        @Args() {dbmsId}: DbmsArgs,
    ): Promise<IDbms> {
        return environment.dbmss.get(dbmsId);
    }

    @Query(() => [Dbms])
    async [PUBLIC_GRAPHQL_METHODS.LIST_DBMSS](
        @Context('environment') environment: Environment,
        @Args() _env: EnvironmentArgs,
    ): Promise<List<IDbms>> {
        return environment.dbmss.list();
    }

    @Query(() => [DbmsInfo])
    async [PUBLIC_GRAPHQL_METHODS.INFO_DBMSS](
        @Context('environment') environment: Environment,
        @Args() {dbmsIds}: DbmssArgs,
    ): Promise<List<IDbmsInfo>> {
        return environment.dbmss.info(dbmsIds);
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
        @Args() {environmentId}: DbmsVersionArgs,
    ): Promise<IDbmsVersion[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return (await environment.dbmss.versions()).toArray();
    }

    // @todo: do we want to allow updating dbms config here?
    @Mutation(() => Boolean)
    async [PUBLIC_GRAPHQL_METHODS.UPDATE_DBMS_CONFIG](
        @Args() {environmentId, dbmsId, properties}: UpdateDbmsConfigArgs,
    ): Promise<boolean> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return environment.dbmss.updateConfig(dbmsId, new Map(properties));
    }
}
