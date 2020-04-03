import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';

import {SystemProvider, IDbms} from '@relate/common';
import {Dbms, AccountArgs, DbmssArgs, CreateAccessTokenArgs, InstallDbmsArgs} from './dbms.types';

@Resolver(() => String)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Mutation(() => String)
    installDbms(@Args() {accountId, name, credentials, version}: InstallDbmsArgs): Promise<string> {
        const account = this.systemProvider.getAccount(accountId);
        return account.installDbms(name, credentials, version);
    }

    @Query(() => [Dbms])
    listDbmss(@Args() {accountId}: AccountArgs): Promise<IDbms[]> {
        const account = this.systemProvider.getAccount(accountId);
        return account.listDbmss();
    }

    @Query(() => [String])
    statusDbmss(@Args() {accountId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const account = this.systemProvider.getAccount(accountId);
        return account.statusDbmss(dbmsIds);
    }

    @Mutation(() => [String])
    startDbmss(@Args() {accountId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const account = this.systemProvider.getAccount(accountId);
        return account.startDbmss(dbmsIds);
    }

    @Mutation(() => [String])
    stopDbmss(@Args() {accountId, dbmsIds}: DbmssArgs): Promise<string[]> {
        const account = this.systemProvider.getAccount(accountId);
        return account.stopDbmss(dbmsIds);
    }

    @Mutation(() => String)
    createAccessToken(@Args() {accountId, dbmsId, appId, authToken}: CreateAccessTokenArgs): Promise<string> {
        const account = this.systemProvider.getAccount(accountId);

        return account.createAccessToken(appId, dbmsId, authToken);
    }
}
