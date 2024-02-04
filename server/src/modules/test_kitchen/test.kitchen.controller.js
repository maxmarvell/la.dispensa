"use strict";
// import { FastifyRequest } from "fastify/types/request"
// import { FastifyReply } from "fastify"
// import { CreateIterationInput, CreateManyIterationIngredientsInput, UpdateIterationIngredientInput, UpdateIterationInput, UpdateIterationInstructionInput } from "./test.kitchen.schema"
// import { createIteration, createIterationingredient, deleteIterationIngredient, getIterationInstance, getIterations, ingredientParams, instructionParams, updateIteration, updateIterationIngredient, updateIterationInstruction } from "./test.kitchen.service"
// export async function getIterationsHandler(
//   request: FastifyRequest<{
//     Querystring: {
//       recipeId: string
//     }
//   }>,
//   reply: FastifyReply
// ) {
//   try {
//     const { recipeId } = request.query
//     const iterations = await getIterations(recipeId)
//     return iterations
//   } catch (error) {
//     console.log(error);
//     return reply.code(404)
//   };
// };
// export async function getIterationInstanceHandler(
//   request: FastifyRequest<{
//     Params: {
//       iterationId: string
//     }
//   }>,
//   reply: FastifyReply
// ) {
//   try {
//     const { iterationId } = request.params
//     const iteration = await getIterationInstance(iterationId)
//     return iteration
//   } catch (error) {
//     console.log(error);
//     return reply.code(404)
//   };
// };
// export async function createIterationHandler(
//   request: FastifyRequest<{
//     Body: CreateIterationInput
//   }>,
//   reply: FastifyReply
// ) {
//   try {
//     const iteration = await createIteration({
//       ...request.body,
//     });
//     return iteration;
//   } catch (error) {
//     console.log(error);
//     return reply.code(401);
//   }
// }
// export async function updateIterationHandler(
//   request: FastifyRequest<{
//     Body: UpdateIterationInput,
//     Params: {
//       iterationId: string
//     }
//   }>,
//   reply: FastifyReply
// ) {
//   try {
//     const iteration = await updateIteration({
//       ...request.body,
//       ...request.params
//     });
//     return iteration;
//   } catch (error) {
//     console.log(error);
//     return reply.code(401);
//   }
// }
// export async function deleteIterationIngredientHandler(
//   request: FastifyRequest<{
//     Params: ingredientParams
//   }>,
//   reply: FastifyReply
// ) {
//   try {
//     const result = await deleteIterationIngredient(request.params);
//     return result;
//   } catch (error) {
//     console.log(error);
//     return reply.code(404);
//   }
// }
// export async function updateIterationIngredientHandler(
//   request: FastifyRequest<{
//     Params: ingredientParams,
//     Body: UpdateIterationIngredientInput
//   }>,
//   reply: FastifyReply
// ) {
//   try {
//     // console.log({ ...request.params, ...request.body })
//     const result = await updateIterationIngredient({ ...request.params, ...request.body });
//     return result;
//   } catch (error) {
//     console.log(error);
//     return reply.code(401);
//   };
// };
// export async function updateIterationInstructionHandler(
//   request: FastifyRequest<{
//     Params: instructionParams,
//     Body: UpdateIterationInstructionInput,
//   }>,
//   reply: FastifyReply
// ) {
//   try {
//     console.log({
//       ...request.params,
//       ...request.body
//     })
//     const result = await updateIterationInstruction({
//       ...request.params,
//       ...request.body
//     });
//     return result;
//   } catch (error) {
//     console.log(error);
//     return reply.code(404);
//   }
// }
// export async function createManyIterationIngredientHandler(
//   request: FastifyRequest<{
//     Params: {
//       iterationId: string
//     },
//     Body: CreateManyIterationIngredientsInput
//   }>,
//   reply: FastifyReply
// ) {
//   try {
//     const ingredients = await Promise.all(request.body.map((el) => {
//       return new Promise(resolve => resolve(createIterationingredient({
//         ...el,
//         ...request.params
//       })))
//     }));
//     return ingredients;
//   } catch (error) {
//     console.log(error);
//     return reply.code(404);
//   }
// }
