import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class AppLaunchToken {
    @Field(() => String)
    token: string;

    @Field(() => String)
    path: string;
}
