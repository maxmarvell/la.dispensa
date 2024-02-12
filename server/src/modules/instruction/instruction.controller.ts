import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify";
import { getInstructions, updateInstruction, deleteInstruction, createInstruction, InstructionURLParams } from "./instruction.service";
import { CreateInstructionsInput, UpdateInstructionInput } from "./instruction.schema";

export async function getInstructionsHandler(
  request: FastifyRequest<{
    Querystring: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  const { recipeId } = request.query;
  try {
    const instructions = await getInstructions(recipeId);
    return reply.code(200).send(instructions);
  } catch (error) {
    console.log(error);
    return reply.code(404);;
  }
}

export async function createManyInstructionsHandler(
  request: FastifyRequest<{
    Body: CreateInstructionsInput
  }>,
  reply: FastifyReply
) {
  try {
    const instructions = await Promise.all(request.body.map((el) => {
      return new Promise(resolve => resolve(createInstruction(el)))
    }))
    return instructions;
  } catch (e) {
    console.log(e);
    return reply.code(400);
  }
}


export async function updateInstructionHandler(
  request: FastifyRequest<{
    Body: UpdateInstructionInput,
    Params: InstructionURLParams
  }>,
  reply: FastifyReply
) {
  try {
    console.log(request.body)
    const instructions = await updateInstruction({
      ...request.body,
      ...request.params
    });
    return instructions;
  } catch (e) {
    console.log(e);
    return reply.code(400);
  }
}

export async function deleteInstructionHandler(
  request: FastifyRequest<{
    Params: InstructionURLParams
  }>,
  reply: FastifyReply
) {
  try {
    const response = await deleteInstruction(request.params);
    return response;
  } catch (e) {
    console.log(e);
    return reply.code(400);
  }
}