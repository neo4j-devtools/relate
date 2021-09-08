import {Inject, UseGuards, UseInterceptors} from '@nestjs/common';
import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {
    Environment,
    IDbmsPluginInstalled,
    IDbmsPluginSource,
    PUBLIC_GRAPHQL_METHODS,
    SystemProvider,
} from '@relate/common';
import {List} from '@relate/types';

import {EnvironmentArgs, FilterArgs} from '../../global.types';
import {EnvironmentGuard} from '../../guards/environment.guard';
import {EnvironmentInterceptor} from '../../interceptors/environment.interceptor';
import {DbmsArgs, DbmssArgs} from '../dbms/dbms.types';
import {
    AddDbmsPluginSources,
    DbmsPluginInstalled,
    DbmsPluginSource,
    PluginNameArgs,
    RemoveDbmsPluginSources,
    UninstallDbmsPluginReturn,
} from './dbms-plugins.types';

@Resolver(() => String)
@UseGuards(EnvironmentGuard)
@UseInterceptors(EnvironmentInterceptor)
export class DBMSPluginsResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Query(() => [DbmsPluginInstalled])
    async [PUBLIC_GRAPHQL_METHODS.LIST_DBMS_PLUGINS](
        @Context('environment') environment: Environment,
        @Args() {dbmsId}: DbmsArgs,
        @Args() {filters}: FilterArgs,
    ): Promise<List<IDbmsPluginInstalled>> {
        return environment.dbmsPlugins.list(dbmsId, filters);
    }

    @Mutation(() => [DbmsPluginInstalled])
    async [PUBLIC_GRAPHQL_METHODS.INSTALL_DBMS_PLUGIN](
        @Context('environment') environment: Environment,
        @Args() {dbmsIds}: DbmssArgs,
        @Args() {pluginName}: PluginNameArgs,
    ): Promise<List<IDbmsPluginInstalled>> {
        return environment.dbmsPlugins.install(dbmsIds, pluginName);
    }

    @Mutation(() => UninstallDbmsPluginReturn, {nullable: true})
    async [PUBLIC_GRAPHQL_METHODS.UNINSTALL_DBMS_PLUGIN](
        @Context('environment') environment: Environment,
        @Args() {dbmsIds}: DbmssArgs,
        @Args() {pluginName}: PluginNameArgs,
    ): Promise<UninstallDbmsPluginReturn> {
        await environment.dbmsPlugins.uninstall(dbmsIds, pluginName);
        return {
            dbmsIds,
            pluginName,
        };
    }

    @Query(() => [DbmsPluginSource])
    async [PUBLIC_GRAPHQL_METHODS.LIST_DBMS_PLUGIN_SOURCES](
        @Context('environment') environment: Environment,
        @Args() _env: EnvironmentArgs,
        @Args() {filters}: FilterArgs,
    ): Promise<List<IDbmsPluginSource>> {
        return environment.dbmsPlugins.listSources(filters);
    }

    @Mutation(() => [DbmsPluginSource])
    async [PUBLIC_GRAPHQL_METHODS.ADD_DBMS_PLUGIN_SOURCES](
        @Context('environment') environment: Environment,
        @Args() _env: EnvironmentArgs,
        @Args() {sources}: AddDbmsPluginSources,
    ): Promise<List<IDbmsPluginSource>> {
        return environment.dbmsPlugins.addSources(sources);
    }

    @Mutation(() => [DbmsPluginSource])
    async [PUBLIC_GRAPHQL_METHODS.REMOVE_DBMS_PLUGIN_SOURCES](
        @Context('environment') environment: Environment,
        @Args() _env: EnvironmentArgs,
        @Args() {names}: RemoveDbmsPluginSources,
    ): Promise<List<IDbmsPluginSource>> {
        return environment.dbmsPlugins.removeSources(names);
    }
}
