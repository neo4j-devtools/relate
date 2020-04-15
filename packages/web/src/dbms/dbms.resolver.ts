import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';

import {SystemProvider, IDbms} from '@relate/common';
import {Dbms, AccountArgs, DbmssArgs, CreateAccessTokenArgs, InstallDbmsArgs, UninstallDbmsArgs} from './dbms.types';

@Resolver(() => String)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Mutation(() => String)
    installDbms(@Args() {accountId, name, credentials, version}: InstallDbmsArgs): Promise<string> {
        const account = this.systemProvider.getAccount(accountId);
        return account.installDbms(name, credentials, version);
    }

    @Mutation(() => String)
    uninstallDbms(@Args() {accountId, name}: UninstallDbmsArgs): Promise<string> {
        const account = this.systemProvider.getAccount(accountId);

        return account.uninstallDbms(name).then(() => name);
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
