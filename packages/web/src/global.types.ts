import {ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class EnvironmentArgs {
    @Field(() => String, {nullable: true})
    environmentId?: string;
}
