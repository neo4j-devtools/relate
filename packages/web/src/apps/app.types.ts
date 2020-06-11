import {ArgsType, Field, ObjectType} from '@nestjs/graphql';
import {EXTENSION_ORIGIN, EXTENSION_TYPES} from '@relate/common';
import {Dbms} from '../dbms/dbms.types';
import {EnvironmentArgs} from '../global.types';

@ObjectType()
export class AppData {
    @Field(() => String)
    name!: string;

    @Field(() => String)
    version!: string;

    @Field(() => String)
    type!: EXTENSION_TYPES;

    @Field(() => String)
    path!: string;
}

@ObjectType()
export class AppLaunchData {
    @Field(() => String)
    environmentId: string;

    @Field(() => String)
    appName: string;

    @Field(() => Dbms)
    dbms: Dbms;

    @Field(() => String, {nullable: true})
    principal?: string;

    @Field(() => String, {nullable: true})
    accessToken?: string;
}

@ObjectType()
export class AppLaunchToken {
    @Field(() => String)
    token: string;

    @Field(() => String)
    path: string;
}

@ArgsType()
export class LaunchDataArgs extends EnvironmentArgs {
    @Field(() => String)
    appName: string;

    @Field(() => String)
    launchToken: string;
}

@ArgsType()
export class CreateLaunchTokenArgs {
    @Field(() => String)
    appName: string;

    @Field(() => String)
    dbmsId: string;

    @Field(() => String, {nullable: true})
    principal: string;

    @Field(() => String, {nullable: true})
    accessToken: string;
}

@ObjectType()
export class ExtensionData {
    @Field(() => String)
    type!: EXTENSION_TYPES;

    @Field(() => String)
    name!: string;

    @Field(() => String)
    version!: string;

    @Field(() => String)
    dist!: string;

    @Field(() => String)
    origin!: EXTENSION_ORIGIN;
}

@ObjectType()
export class ExtensionVersion {
    @Field(() => String)
    type!: EXTENSION_TYPES;

    @Field(() => String)
    name!: string;

    @Field(() => String)
    version!: string;

    @Field(() => String)
    origin!: EXTENSION_ORIGIN;
}
