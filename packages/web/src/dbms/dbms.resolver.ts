import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';

import {SystemProvider, IDbms} from '@relate/common';
import {
    Dbms,
    EnvironmentArgs,
    DbmssArgs,
    CreateAccessTokenArgs,
    InstallDbmsArgs,
    UninstallDbmsArgs,
} from './dbms.types';

@Resolver(() => String)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Mutation(() => String)
    async installDbms(@Args() {environmentId, name, credentials, version}: InstallDbmsArgs): Promise<string> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return environment.installDbms(name, credentials, version);
    }

    @Mutation(() => String)
    async uninstallDbms(@Args() {environmentId, name}: UninstallDbmsArgs): Promise<string> {
        const environment = await this.systemProvider.getEnvironment(environmentId);

        return environment.uninstallDbms(name).then(() => name);
    }

    @Query(() => [Dbms])
    async listDbmss(@Args() {environmentId}: EnvironmentArgs): Promise<IDbms[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return environment.listDbmss();
    }

    @Query(() => [String])
    async statusDbmss(@Args() {environmentId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return environment.statusDbmss(dbmsIds);
    }

    @Mutation(() => [String])
    async startDbmss(@Args() {environmentId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return environment.startDbmss(dbmsIds);
    }

    @Mutation(() => [String])
    async stopDbmss(@Args() {environmentId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const environment = await this.systemProvider.getEnvironment(environmentId);
        return environment.stopDbmss(dbmsIds);
    }

    @Mutation(() => String)
    async createAccessToken(@Args() {environmentId, dbmsId, appId, authToken}: CreateAccessTokenArgs): Promise<string> {
        const environment = await this.systemProvider.getEnvironment(environmentId);

        return environment.createAccessToken(appId, dbmsId, authToken);
    }
}
