import {Field, ObjectType} from '@nestjs/graphql';
import {EXTENSION_TYPES} from '@relate/common';

@ObjectType()
export class AppData {
    @Field(() => String)
    name!: string;

    @Field(() => String)
    version!: string;

    @Field(() => String)
    type!: EXTENSION_TYPES;

    @Field(() => String)
    url!: string;
}
