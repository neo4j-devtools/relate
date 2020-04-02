import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class AppLaunchData {
    @Field(() => String)
    accountId: string;

    @Field(() => String)
    appId: string;

    @Field(() => String)
    dbmsId: string;

    @Field(() => String)
    principal: string;

    @Field(() => String)
    accessToken: string;
}
