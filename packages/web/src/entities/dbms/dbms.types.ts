import {ObjectType, ArgsType, Field, ID} from '@nestjs/graphql';
import {IDbms, NEO4J_EDITION} from '@relate/common';
import GraphQLJSON, {GraphQLJSONObject} from 'graphql-type-json';

import {AuthTokenInput} from './dto/auth-token.input';
import {EnvironmentArgs} from '../../global.types';

@ObjectType()
export class Dbms implements Omit<IDbms, 'config'> {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    description: string;

    @Field(() => [String])
    tags: string[];

    @Field(() => GraphQLJSONObject)
    metadata: Record<string, any>;

    @Field(() => String)
    connectionUri: string;
}

@ObjectType()
export class DbmsInfo extends Dbms {
    @Field(() => String)
    status: string;

    @Field(() => String)
    serverStatus: string;

    @Field(() => String, {nullable: true})
    version?: string;

    @Field(() => String, {nullable: true})
    edition?: string;

    @Field(() => String, {nullable: true})
    prerelease?: string;
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

    @Field(() => Boolean, {nullable: true})
    onlineCheck?: boolean;
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

@ArgsType()
export class AddDbmsMetadataArgs extends EnvironmentArgs {
    @Field(() => String)
    dbmsId: string;

    @Field(() => String)
    key: string;

    @Field(() => GraphQLJSON)
    value: any;
}

@ArgsType()
export class RemoveDbmsMetadataArgs extends EnvironmentArgs {
    @Field(() => String)
    dbmsId: string;

    @Field(() => [String])
    keys: string[];
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
