import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';

import {SystemProvider} from '@relate/common';
import {AuthTokenInput} from './dto/auth-token.input';

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

    @Mutation(() => String)
    createAccessToken(
        @Args('accountId') accountId: string,
        @Args('appId') appId: string,
        @Args('dbmsId') dbmsId: string,
        @Args('authToken') authToken: AuthTokenInput,
    ): Promise<string> {
        const account = this.systemProvider.getAccount(accountId);

        return account.createAccessToken(appId, dbmsId, authToken);
    }
}
