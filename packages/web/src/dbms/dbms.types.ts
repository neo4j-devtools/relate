import {ObjectType, ArgsType, Field, ID} from '@nestjs/graphql';
import {NEO4J_EDITION} from '@relate/common';

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

    @Field(() => [String])
    tags: string[];

    @Field(() => String, {nullable: true})
    connectionUri?: string;
}

@ObjectType()
export class DbmsInfo extends Dbms {
    @Field(() => String)
    status: string;

    @Field(() => String, {nullable: true})
    version?: string;

    @Field(() => String, {nullable: true})
    edition?: string;
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
export class ListDbmsVersionsArgs extends EnvironmentArgs {
    @Field(() => Boolean, {nullable: true})
    limited?: boolean;
}

@ArgsType()
export class InstallDbmsArgs extends EnvironmentArgs {
    @Field(() => String)
    name: string;

    @Field(() => String)
    credentials: string;

    @Field(() => String)
    version: string;

    @Field(() => NEO4J_EDITION, {nullable: true})
    edition?: NEO4J_EDITION;

    @Field(() => Boolean, {nullable: true})
    noCaching?: boolean;

    @Field(() => Boolean, {nullable: true})
    limited?: boolean;
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
export class AddDbmsTagsArgs extends EnvironmentArgs {
    @Field(() => String)
    dbmsId: string;

    @Field(() => [String])
    tags: string[];
}

@ArgsType()
export class RemoveDbmsTagsArgs extends EnvironmentArgs {
    @Field(() => String)
    dbmsId: string;

    @Field(() => [String])
    tags: string[];
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
    @Field(() => String)
    dbmsId: string;

    @Field(() => [[String, String]])
    properties: [string, string][];
}

@ArgsType()
export class ListDbArgs {
    @Field(() => String)
    dbmsId: string;

    @Field(() => String)
    user: string;

    @Field(() => String)
    accessToken: string;
}

@ArgsType()
export class CreateOrDropDbArgs extends ListDbArgs {
    @Field(() => String)
    dbName: string;
}

@ObjectType()
export class Db {
    @Field(() => String)
    name: string;

    @Field(() => String)
    role: string;

    @Field(() => String)
    requestedStatus: string;

    @Field(() => String)
    currentStatus: string;

    @Field(() => String)
    error: string;

    @Field(() => String)
    default: boolean;
}
