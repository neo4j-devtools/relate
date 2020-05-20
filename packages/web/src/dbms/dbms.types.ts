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

    @Field(() => String, {nullable: true})
    connectionUri?: string;
}

@ArgsType()
export class EnvironmentArgs {
    @Field(() => String, {nullable: true})
    environmentId?: string;
}

@ArgsType()
export class DbmsArgs {
    @Field(() => String, {nullable: true})
    environmentId?: string;

    @Field(() => String)
    dbmsId: string;
}

@ArgsType()
export class DbmssArgs {
    @Field(() => String, {nullable: true})
    environmentId?: string;

    @Field(() => [String])
    dbmsIds: string[];
}

@ArgsType()
export class InstallDbmsArgs {
    @Field(() => String)
    environmentId: string;

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
    environmentId: string;

    @Field(() => String)
    name: string;
}

@ArgsType()
export class CreateAccessTokenArgs {
    @Field(() => String, {nullable: true})
    environmentId?: string;

    @Field(() => String)
    dbmsId: string;

    @Field(() => String)
    appId: string;

    @Field(() => AuthTokenInput)
    authToken: AuthTokenInput;
}
