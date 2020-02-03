import {Inject, NotFoundException} from '@nestjs/common';
import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {PubSub} from 'apollo-server-express';

import {NewRecipeInput} from './dto/new-recipe.input';
import {RecipesArgs} from './dto/recipes.args';
import {Recipe} from './models/recipe';
import {RecipesService} from './recipes.service';

const pubSub = new PubSub();

@Resolver(() => Recipe)
export class RecipesResolver {
    constructor(@Inject(RecipesService) private readonly recipesService: RecipesService) {}

    @Query(() => Recipe)
    async recipe(@Args('id') id: string): Promise<Recipe> {
        const recipe = await this.recipesService.findOneById(id);

        if (!recipe) {
            throw new NotFoundException(id);
        }

        return recipe;
    }

    @Query(() => [Recipe])
    recipes(@Args() recipesArgs: RecipesArgs): Recipe[] {
        return this.recipesService.findAll(recipesArgs);
    }

    @Mutation(() => Recipe)
    async addRecipe(@Args('newRecipeData') newRecipeData: NewRecipeInput): Promise<Recipe> {
        const recipe = await this.recipesService.create(newRecipeData);

        await pubSub.publish('recipeAdded', {recipeAdded: recipe});

        return recipe;
    }

    @Mutation(() => Boolean)
    removeRecipe(@Args('id') id: string): boolean {
        return this.recipesService.remove(id);
    }

    @Subscription(() => Recipe)
    recipeAdded(): AsyncIterator<unknown> {
        return pubSub.asyncIterator('recipeAdded');
    }
}
