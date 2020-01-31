import {Max, Min} from 'class-validator';
import {ArgsType, Field, Int} from 'type-graphql';

@ArgsType()
export class RecipesArgs {
    @Field(() => Int)
    @Min(0)
    skip = 0;

    @Field(() => Int)
    @Min(1)
    @Max(50)
    take = 25;
}
