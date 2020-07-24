import {Equals} from 'class-validator';
import {Field, InputType} from '@nestjs/graphql';
import {IAuthToken} from '@relate/common';

@InputType()
export class AuthTokenInput implements IAuthToken {
    @Field(() => String)
    @Equals('basic')
    scheme: 'basic';

    @Field(() => String)
    principal: string;

    @Field(() => String)
    credentials: string;
}
