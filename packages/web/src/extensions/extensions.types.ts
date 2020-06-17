import {ArgsType, Field, ObjectType} from '@nestjs/graphql';
import {EXTENSION_ORIGIN, EXTENSION_TYPES} from '@relate/common';
import {Dbms} from '../dbms/dbms.types';
import {EnvironmentArgs} from '../global.types';

@ObjectType()
export class ExtensionData {
    @Field(() => String)
    name!: string;

    @Field(() => String)
    version!: string;

    @Field(() => String)
    type!: EXTENSION_TYPES;

    @Field(() => String)
    origin!: EXTENSION_ORIGIN;
}

@ObjectType()
export class AppData extends ExtensionData {
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
export class ExtensionArgs extends EnvironmentArgs {
    @Field(() => String)
    name: string;
}

@ArgsType()
export class InstallExtensionArgs extends ExtensionArgs {
    @Field(() => String)
    version: string;
}

@ArgsType()
export class LaunchDataArgs {
    @Field(() => String)
    launchToken: string;

    @Field(() => String)
    appName: string;
}

@ArgsType()
export class CreateLaunchTokenArgs extends EnvironmentArgs {
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
