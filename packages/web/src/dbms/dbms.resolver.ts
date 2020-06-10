import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {Inject, UseGuards} from '@nestjs/common';

import {SystemProvider, PUBLIC_GRAPHQL_METHODS, IDbms, IDbmsInfo, IDbmsVersion} from '@relate/common';
import {
    Dbms,
    DbmsInfo,
    EnvironmentArgs,
    DbmssArgs,
    CreateAccessTokenArgs,
    InstallDbmsArgs,
    UninstallDbmsArgs,
    DbmsArgs,
    DbmsVersion,
    DbmsVersionArgs,
    UpdateDbmsConfigArgs,
} from './dbms.types';
import {EnvironmentMethodGuard} from '../guards/environment-method.guard';

@Resolver(() => String)
@UseGuards(EnvironmentMethodGuard)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.INSTALL_DBMS](
        @Args() {environmentId, name, credentials, version}: InstallDbmsArgs,
    ): Promise<string> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return environment.dbmss.install(name, credentials, version);
    }

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.UNINSTALL_DBMS](@Args() {environmentId, name}: UninstallDbmsArgs): Promise<string> {
        const environment = await this.systemProvider.getEnvironment(environmentId);

        return environment.dbmss.uninstall(name).then(() => name);
    }

    @Query(() => Dbms)
    async [PUBLIC_GRAPHQL_METHODS.GET_DBMS](@Args() {environmentId, dbmsId}: DbmsArgs): Promise<IDbms> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return environment.dbmss.get(dbmsId);
    }

    @Query(() => [Dbms])
    async [PUBLIC_GRAPHQL_METHODS.LIST_DBMSS](@Args() {environmentId}: EnvironmentArgs): Promise<IDbms[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);

        const dbmss = (await environment.dbmss.list()).toArray();

        return dbmss;
    }

    @Query(() => [DbmsInfo])
    async [PUBLIC_GRAPHQL_METHODS.INFO_DBMSS](@Args() {environmentId, dbmsIds}: DbmssArgs): Promise<IDbmsInfo[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return (await environment.dbmss.info(dbmsIds)).toArray();
    }

    @Mutation(() => [String])
    async [PUBLIC_GRAPHQL_METHODS.START_DBMSS](@Args() {environmentId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return (await environment.dbmss.start(dbmsIds)).toArray();
    }

    @Mutation(() => [String])
    async [PUBLIC_GRAPHQL_METHODS.STOP_DBMSS](@Args() {environmentId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return (await environment.dbmss.stop(dbmsIds)).toArray();
    }

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.CREATE_ACCESS_TOKEN](
        @Args() {environmentId, dbmsId, appName, authToken}: CreateAccessTokenArgs,
    ): Promise<string> {
        const environment = await this.systemProvider.getEnvironment(environmentId);

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
