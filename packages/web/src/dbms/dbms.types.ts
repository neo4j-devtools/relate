import {ObjectType, ArgsType, Field, ID} from '@nestjs/graphql';
import {AuthTokenInput} from './dto/auth-token.input';
import {EnvironmentArgs} from '../global.types';

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

@ObjectType()
export class DbmsInfo extends Dbms {
    @Field(() => String)
    status: string;

    @Field(() => String, {nullable: true})
    version: string;

    @Field(() => String, {nullable: true})
    edition: string;
}

@ArgsType()
export class DbmsArgs extends EnvironmentArgs {
    @Field(() => String)
    dbmsId: string;
}

@ArgsType()
export class DbmssArgs extends EnvironmentArgs {
    @Field(() => [String])
    dbmsIds: string[];
}

@ArgsType()
export class InstallDbmsArgs extends EnvironmentArgs {
    @Field(() => String)
    name: string;

    @Field(() => String)
    credentials: string;

    @Field(() => String)
    version: string;
}

@ArgsType()
export class UninstallDbmsArgs extends EnvironmentArgs {
    @Field(() => String)
    name: string;
}

@ArgsType()
export class CreateAccessTokenArgs extends EnvironmentArgs {
    @Field(() => String)
    dbmsId: string;

    @Field(() => String)
    appName: string;

    @Field(() => AuthTokenInput)
    authToken: AuthTokenInput;
}

@ArgsType()
export class DbmsVersionArgs {
    @Field(() => String, {nullable: true})
    environmentId?: string;
}

@ObjectType()
export class DbmsVersion {
    @Field(() => String)
    edition: string;

    @Field(() => String)
    version: string;

    @Field(() => String)
    origin: string;

    @Field(() => String)
    dist: string;
}

@ArgsType()
export class UpdateDbmsConfigArgs {
    @Field(() => String, {nullable: true})
    environmentId?: string;

    @Field(() => String)
    dbmsId: string;

    @Field(() => [[String, String]])
    properties: [string, string][];
}
