import {Field, ObjectType} from '@nestjs/graphql';
import {EXTENSION_TYPES, EXTENSION_ORIGIN} from '@relate/common';

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
