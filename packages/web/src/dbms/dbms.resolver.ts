import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';

import {SystemProvider} from '@relate/common';

const DBMS_IDS = {
    name: 'dbmsIds',
    type: () => [String],
};

@Resolver(() => String)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Query(() => [String])
    statusDbmss(@Args('accountId') accountId: string, @Args(DBMS_IDS) dbmsIds: string[]): Promise<string[]> {
        const account = this.systemProvider.getAccount(accountId);
        return account.statusDbmss(dbmsIds);
    }

    @Mutation(() => [String])
    startDbmss(@Args('accountId') accountId: string, @Args(DBMS_IDS) dbmsIds: string[]): Promise<string[]> {
        const account = this.systemProvider.getAccount(accountId);
        return account.startDbmss(dbmsIds);
    }

    @Mutation(() => [String])
    stopDbmss(@Args('accountId') accountId: string, @Args(DBMS_IDS) dbmsIds: string[]): Promise<string[]> {
        const account = this.systemProvider.getAccount(accountId);
        return account.stopDbmss(dbmsIds);
    }
}
