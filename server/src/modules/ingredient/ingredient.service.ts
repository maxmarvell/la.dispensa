import prisma from "../../utils/prisma";
import { CreateIngredientInput, UpdateIngredientInput } from "./ingredient.schema";


export async function getIngredients({ recipeId }: { recipeId: string }) {
  return prisma.recipeIngredient.findMany({
    where: {
      recipeId
    },
    include: {
      ingredient: {
        select: {
          name: true
        }
      },
    }
  })
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



export async function updateIngredient(input: UpdateIngredientInput & { ingredientId: string, recipeId: string}) {
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

  return prisma.recipeIngredient.update({
    where: {
      RecipeIngredientId : {ingredientId, recipeId}
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
      RecipeIngredientId : {ingredientId, recipeId}
    }
  })
}