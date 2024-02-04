import { FastifyRequest } from "fastify/types/request"
import { FastifyReply } from "fastify"
import { createIngredient, getIngredients, removeIngredient, updateIngredient } from "./ingredient.service";
import { CreateManyIngredientInput, UpdateIngredientInput } from "./ingredient.schema";


export async function getIngredientsHandler(
  request: FastifyRequest<{
    Querystring: { recipeId: string }
  }>,
  reply: FastifyReply
) { 
  try {
    const ingredients = await getIngredients({recipeId : request.query.recipeId});
    return ingredients;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  };
};


export async function createManyIngredientsHandler(
  request: FastifyRequest<{
    Body: CreateManyIngredientInput
  }>, 
  reply: FastifyReply
) {
  try {
    const ingredients = await Promise.all(request.body.map((el) => {
      return new Promise(resolve => resolve(createIngredient(el)))
    }));
    return ingredients;
  } catch (error) {
    console.log(error)
    return reply.code(404)
  }
}


export async function updateIngredientHandler(
  request: FastifyRequest<{
    Body: UpdateIngredientInput,
    Params: {
      recipeId: string,
      ingredientId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { ingredientId, recipeId } = request.params;
    const ingredient = await updateIngredient({
      ...request.body,
      ingredientId,
      recipeId
    });
    return ingredient;
  } catch (error) {
    console.log(error);
    return reply.code(401);
  }
}

export async function removeIngredientHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string,
      ingredientId: string,
    }
  }>,
  reply: FastifyReply,
) {
  try {
    const { ingredientId, recipeId } = request.params;
    const result = await removeIngredient(ingredientId, recipeId)
    return result;
  } catch (error) {
    console.log(error);
    return reply.code(404)
  }
}