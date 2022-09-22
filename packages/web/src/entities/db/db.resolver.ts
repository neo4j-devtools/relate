import {Resolver, Args, Mutation, Query, Context} from '@nestjs/graphql';
import {Inject, UseGuards, UseInterceptors} from '@nestjs/common';
import {Environment, SystemProvider, PUBLIC_GRAPHQL_METHODS, IDb4, IDb5} from '@relate/common';
import {List} from '@relate/types';

import {CreateOrDropDbArgs, ListDbArgs, Db, DumpDbArgs, LoadDbArgs} from './db.types';
import {EnvironmentGuard} from '../../guards/environment.guard';
import {EnvironmentInterceptor} from '../../interceptors/environment.interceptor';

@Resolver(() => String)
@UseGuards(EnvironmentGuard)
@UseInterceptors(EnvironmentInterceptor)
export class DbResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.CREATE_DB](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, user, dbName, accessToken}: CreateOrDropDbArgs,
    ): Promise<string> {
        return environment.dbs.create(dbmsId, user, dbName, accessToken).then(() => dbName);
    }

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.DROP_DB](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, user, dbName, accessToken}: CreateOrDropDbArgs,
    ): Promise<string> {
        return environment.dbs.drop(dbmsId, user, dbName, accessToken).then(() => dbName);
    }

    @Query(() => [Db]!)
    async [PUBLIC_GRAPHQL_METHODS.LIST_DBS](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, user, accessToken}: ListDbArgs,
    ): Promise<List<IDb4 | IDb5>> {
        return environment.dbs.list(dbmsId, user, accessToken);
    }

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.DUMP_DB](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, database, to, javaPath}: DumpDbArgs,
    ): Promise<string> {
        return environment.dbs.dump(dbmsId, database, to, javaPath);
    }

    @Mutation(() => String)
    async [PUBLIC_GRAPHQL_METHODS.LOAD_DB](
        @Context('environment') environment: Environment,
        @Args() {dbmsId, database, from, force, javaPath}: LoadDbArgs,
    ): Promise<string> {
        return environment.dbs.load(dbmsId, database, from, force, javaPath);
    }
}
