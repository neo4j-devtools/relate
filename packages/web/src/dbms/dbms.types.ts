import {ObjectType, ArgsType, Field, ID} from '@nestjs/graphql';
import {AuthTokenInput} from './dto/auth-token.input';

@ObjectType()
export class Dbms {
    @Field(() => ID)
    id: string;

    @Field(() => String, {nullable: true})
    name?: string;

    @Field(() => String, {nullable: true})
    description?: string;
}

@ArgsType()
export class AccountArgs {
    @Field(() => String, {nullable: true})
    accountId?: string;
}

@ArgsType()
export class DbmssArgs {
    @Field(() => String, {nullable: true})
    accountId?: string;

    @Field(() => [String])
    dbmsIds: string[];
}

@ArgsType()
export class InstallDbmsArgs {
    @Field(() => String)
    accountId: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    credentials: string;

    @Field(() => String)
    version: string;
}

@ArgsType()
export class UninstallDbmsArgs {
    @Field(() => String)
    accountId: string;

    @Field(() => String)
    name: string;
}

@ArgsType()
export class CreateAccessTokenArgs {
    @Field(() => String, {nullable: true})
    accountId?: string;

    @Field(() => String)
    dbmsId: string;

    @Field(() => String)
    appId: string;

    @Field(() => AuthTokenInput)
    authToken: AuthTokenInput;
}
