import {Equals} from 'class-validator';
import {Field, InputType} from '@nestjs/graphql';
import {IAuthToken} from '@relate/common';
import {GraphQLJSONObject} from 'graphql-type-json';

@InputType()
export class AuthTokenInput implements IAuthToken {
    @Field(() => String)
    @Equals('basic')
    scheme: 'basic';

    @Field(() => String)
    principal: string;

    @Field(() => String)
    credentials: string;

    @Field(() => String, {nullable: true})
    realm?: string;

    @Field(() => GraphQLJSONObject, {nullable: true})
    parameters?: Record<string, any>;
}
