import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {HttpException, HttpStatus, Inject} from '@nestjs/common';

import {SystemProvider} from '@daedalus/common';

@Resolver(() => String)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Query(() => String)
    statusDbms(@Args('accountID') accountID: string, @Args('dbmsID') dbmsID: string): Promise<string> {
        const account = this.systemProvider.getAccount(accountID);
        return account.statusDBMS(dbmsID).catch((err: Error) => {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        });
    }

    @Mutation(() => String)
    startDbms(@Args('accountID') accountID: string, @Args('dbmsID') dbmsID: string): Promise<string> {
        const account = this.systemProvider.getAccount(accountID);
        return account.startDBMS(dbmsID).catch((err: Error) => {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        });
    }

    @Mutation(() => String)
    stopDbms(@Args('accountID') accountID: string, @Args('dbmsID') dbmsID: string): Promise<string> {
        const account = this.systemProvider.getAccount(accountID);
        return account.stopDBMS(dbmsID).catch((err: Error) => {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        });
    }
}
