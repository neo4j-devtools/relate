import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {HttpException, HttpStatus, Inject} from '@nestjs/common';

import {SystemProvider} from '@daedalus/common';

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
        return account.statusDbmss(dbmsIds).catch((err: Error) => {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        });
    }

    @Mutation(() => [String])
    startDbmss(@Args('accountId') accountId: string, @Args(DBMS_IDS) dbmsIds: string[]): Promise<string[]> {
        const account = this.systemProvider.getAccount(accountId);
        return account.startDbmss(dbmsIds).catch((err: Error) => {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        });
    }

    @Mutation(() => [String])
    stopDbmss(@Args('accountId') accountId: string, @Args(DBMS_IDS) dbmsIds: string[]): Promise<string[]> {
        const account = this.systemProvider.getAccount(accountId);
        return account.stopDbmss(dbmsIds).catch((err: Error) => {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        });
    }
}
