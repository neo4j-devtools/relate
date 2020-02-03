import {Injectable} from '@nestjs/common';
import {NewRecipeInput} from './dto/new-recipe.input';
import {RecipesArgs} from './dto/recipes.args';
import {Recipe} from './models/recipe';

const recipes = new Map<string, Recipe>();

@Injectable()
export class RecipesService {
    create(data: NewRecipeInput): Recipe {
        const id = `${recipes.size}`;
        const recipe = {
            id,
            ...data,
        };

        recipes.set(id, recipe);

        return recipe;
    }

    findOneById(id: string): Recipe {
        const recipe = recipes.get(`${id}`);

        if (!recipe) {
            throw new Error(`Recipe ${id} not found`);
        }

        return recipe;
    }

    findAll(_: RecipesArgs): Recipe[] {
        return [...recipes.values()];
    }

    remove(id: string): boolean {
        return recipes.delete(`${id}`);
    }
}
