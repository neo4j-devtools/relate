import {Resolver, Args, Mutation, Query} from '@nestjs/graphql';
import {HttpException, HttpStatus, Inject} from '@nestjs/common';

import {SystemProvider} from '@daedalus/common';

@Resolver(() => String)
export class DBMSResolver {
    constructor(@Inject(SystemProvider) protected readonly systemProvider: SystemProvider) {}

    @Query(() => Boolean)
    statusDBMS(@Args('accountID') accountID: string, @Args('dbmsID') dbmsID: string): Promise<boolean> {
        const account = this.systemProvider.getAccount(accountID);
        return account.statusDBMS(dbmsID).catch((err: Error) => {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        });
    }

    @Mutation(() => Boolean)
    startDBMS(@Args('accountID') accountID: string, @Args('dbmsID') dbmsID: string): Promise<boolean> {
        const account = this.systemProvider.getAccount(accountID);
        return account.startDBMS(dbmsID).catch((err: Error) => {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        });
    }

    @Mutation(() => Boolean)
    stopDBMS(@Args('accountID') accountID: string, @Args('dbmsID') dbmsID: string): Promise<boolean> {
        const account = this.systemProvider.getAccount(accountID);
        return account.stopDBMS(dbmsID).catch((err: Error) => {
            throw new HttpException(err, HttpStatus.FORBIDDEN);
        });
    }
}
