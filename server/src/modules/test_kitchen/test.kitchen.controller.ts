import { FastifyRequest } from "fastify/types/request"
import { FastifyReply } from "fastify"
import { CreateIterationCommentInput, CreateIterationInput, CreateManyIterationIngredientsInput, CreateManyIterationInstructionInput, UpdateIterationIngredientInput, UpdateIterationInput, UpdateIterationInstructionInput } from "./test.kitchen.schema"
import { createIteration, createIterationComment, createIterationInstruction, createIterationingredient, deleteIterationIngredient, deleteIterationInstruction, getIterationComments, getIterationInstance, getIterations, ingredientParams, instructionParams, updateIteration, updateIterationIngredient, updateIterationInstruction } from "./test.kitchen.service"


export async function getIterationsHandler(
  request: FastifyRequest<{
    Querystring: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { recipeId } = request.query
    const iterations = await getIterations(recipeId)
    return iterations
  } catch (error) {
    console.log(error);
    return reply.code(404)
  };
};


export async function getIterationInstanceHandler(
  request: FastifyRequest<{
    Params: {
      iterationId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { iterationId } = request.params
    const iteration = await getIterationInstance(iterationId)
    return iteration
  } catch (error) {
    console.log(error);
    return reply.code(404)
  };
};


export async function createIterationHandler(
  request: FastifyRequest<{
    Body: CreateIterationInput
  }>,
  reply: FastifyReply
) {
  try {
    const iteration = await createIteration({
      ...request.body,
    });
    return iteration;
  } catch (error) {
    console.log(error);
    return reply.code(401);
  }

}


// Ingredients

export async function updateIterationHandler(
  request: FastifyRequest<{
    Body: UpdateIterationInput,
    Params: {
      iterationId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const iteration = await updateIteration({
      ...request.body,
      ...request.params
    });
    return iteration;
  } catch (error) {
    console.log(error);
    return reply.code(401);
  }
}

export async function createManyIterationIngredientHandler(
  request: FastifyRequest<{
    Params: {
      iterationId: string
    },
    Body: CreateManyIterationIngredientsInput
  }>,
  reply: FastifyReply
) {
  try {
    const ingredients = await Promise.all(request.body.map((el) => {
      return new Promise(resolve => resolve(createIterationingredient({
        ...el,
        ...request.params
      })))
    }));
    return ingredients;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  }
}


export async function deleteIterationIngredientHandler(
  request: FastifyRequest<{
    Params: ingredientParams
  }>,
  reply: FastifyReply
) {
  try {
    const result = await deleteIterationIngredient(request.params);
    return result;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  }
}

export async function updateIterationIngredientHandler(
  request: FastifyRequest<{
    Params: ingredientParams,
    Body: UpdateIterationIngredientInput
  }>,
  reply: FastifyReply
) {
  try {
    // console.log({ ...request.params, ...request.body })
    const result = await updateIterationIngredient({ ...request.params, ...request.body });
    return result;
  } catch (error) {
    console.log(error);
    return reply.code(401);
  };
};


// Instructions

export async function createManyIterationInstructionsHandler(
  request: FastifyRequest<{
    Params: {
      iterationId: string
    },
    Body: CreateManyIterationInstructionInput
  }>,
  reply: FastifyReply
) {

  const { iterationId } = request.params;

  try {
    const instructions = await Promise.all(request.body.map((el) => {
      return new Promise(resolve => resolve(createIterationInstruction({
        ...el,
        iterationId
      })))
    }));
    return instructions;
  } catch (e) {
    console.log(e);
    return reply.code(400);
  };
};

export async function updateIterationInstructionHandler(
  request: FastifyRequest<{
    Params: instructionParams,
    Body: UpdateIterationInstructionInput,
  }>,
  reply: FastifyReply
) {
  try {
    const result = await updateIterationInstruction({
      ...request.params,
      ...request.body
    });
    return result;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  }
};

export async function deleteIterationInstructionHandler(
  request: FastifyRequest<{
    Params: {
      iterationId: string,
      step: string
    }
  }>,
  reply: FastifyReply
) {
  const { iterationId, step } = request.params;

  try {
    const result = await deleteIterationInstruction({ iterationId, step });
    return result;
  } catch (error) {
    console.log(error);
    return reply.code(400).send(error);
  };
};


// Comments


export async function getCommentsHandler(
  request: FastifyRequest<{
    Params: {
      iterationId: string
    }
  }>,
  reply: FastifyReply
) {
  const { iterationId } = request.params;
  try {
    const comments = await getIterationComments({ iterationId });
    return reply.code(200).send(comments);
  } catch (error) {
    console.log(error);
    return reply.code(404).send(error);
  };
};

export async function createIterationCommentHandler(
  request: FastifyRequest<{
    Params: {
      iterationId: string
    },
    Body: CreateIterationCommentInput
  }>,
  reply: FastifyReply
) {
  const { iterationId } = request.params;
  const { id: userId } = request.user;

  try {
    const comment = await createIterationComment({
      iterationId,
      userId,
      ...request.body
    });
    return reply.code(201).send(comment);
  } catch (error) {
    console.log(error);
    return reply.code(401).send(error);
  };
};



