import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';

import {SystemProvider, IDbms} from '@relate/common';
import {Dbms, AccountArgs, DbmssArgs, CreateAccessTokenArgs, InstallDbmsArgs, UninstallDbmsArgs} from './dbms.types';

@Resolver(() => String)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Mutation(() => String)
    async installDbms(@Args() {accountId, name, credentials, version}: InstallDbmsArgs): Promise<string> {
        const account = await this.systemProvider.getAccount(accountId);
        return account.installDbms(name, credentials, version);
    }

    @Mutation(() => String)
    async uninstallDbms(@Args() {accountId, name}: UninstallDbmsArgs): Promise<string> {
        const account = await this.systemProvider.getAccount(accountId);

        return account.uninstallDbms(name).then(() => name);
    }

    @Query(() => [Dbms])
    async listDbmss(@Args() {accountId}: AccountArgs): Promise<IDbms[]> {
        const account = await this.systemProvider.getAccount(accountId);
        return account.listDbmss();
    }

    @Query(() => [String])
    async statusDbmss(@Args() {accountId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const account = await this.systemProvider.getAccount(accountId);
        return account.statusDbmss(dbmsIds);
    }

    @Mutation(() => [String])
    async startDbmss(@Args() {accountId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const account = await this.systemProvider.getAccount(accountId);
        return account.startDbmss(dbmsIds);
    }

    @Mutation(() => [String])
    async stopDbmss(@Args() {accountId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const account = await this.systemProvider.getAccount(accountId);
        return account.stopDbmss(dbmsIds);
    }

    @Mutation(() => String)
    async createAccessToken(@Args() {accountId, dbmsId, appId, authToken}: CreateAccessTokenArgs): Promise<string> {
        const account = await this.systemProvider.getAccount(accountId);

        return account.createAccessToken(appId, dbmsId, authToken);
    }
}
