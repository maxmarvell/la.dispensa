import prisma from "../../utils/prisma";
import { CreateIngredientInput, UpdateIngredientInput } from "./ingredient.schema";


export async function getIngredients({ recipeId }: { recipeId: string }) {

  // Retrieve the recipe Ids of all the components
  const componentIds = await prisma.recipe.findMany({
    where: {
      parentRecipes: {
        some: {
          recipeId
        }
      }
    },
    select: {
      id: true
    }
  });

  const components = await prisma.component.findMany({
    where: {
      componentId: {
        in: componentIds.map(({ id }) => id)
      }
    },
    include: {
      component: {
        select: {
          title: true,
          ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      }
    }
  });

  const ingredients = await prisma.recipeIngredient.findMany({
    where: {
      recipeId
    },
    include: {
      ingredient: {
        select: {
          name: true
        }
      }
    }
  });

  return { ingredients, components };
}


export async function createIngredient(input: CreateIngredientInput) {
  const { ingredient, ...data } = input;

  const fetchIngredient = await prisma.ingredient.upsert({
    where: {
      name: ingredient.name
    },
    update: {},
    create: {
      name: ingredient.name
    },
    select: {
      id: true
    }
  })

  return prisma.recipeIngredient.create({
    data: {
      ...data,
      ingredientId: fetchIngredient.id
    }
  })
}



export async function updateIngredient(input: UpdateIngredientInput & { ingredientId: string, recipeId: string }) {
  const { ingredient, ...data } = input;

  const fetchIngredient = await prisma.ingredient.upsert({
    where: {
      name: ingredient.name
    },
    update: {},
    create: {
      name: ingredient.name
    },
    select: {
      id: true
    }
  })

  const { ingredientId, recipeId, ...rest } = data

  console.log(ingredientId, recipeId)

  return prisma.recipeIngredient.update({
    where: {
      RecipeIngredientId: { ingredientId, recipeId }
    },
    data: {
      ...rest,
      ingredientId: fetchIngredient.id
    }
  })
}


export async function removeIngredient(ingredientId: string, recipeId: string) {
  return prisma.recipeIngredient.delete({
    where: {
      RecipeIngredientId: { ingredientId, recipeId }
    }
  })
}