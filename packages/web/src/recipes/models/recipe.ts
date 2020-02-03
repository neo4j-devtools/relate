import {Field, ID, ObjectType} from 'type-graphql';

@ObjectType()
export class Recipe {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    title: string;

    @Field(() => String, {nullable: true})
    description?: string;

    @Field(() => [String])
    ingredients: string[];
}
