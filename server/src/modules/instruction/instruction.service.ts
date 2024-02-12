import prisma from "../../utils/prisma";
import { CreateInstructionInput, UpdateInstructionInput } from "./instruction.schema";

export interface InstructionURLParams {
  recipeId: string,
  step: number
}

export async function getInstructions(recipeId: string) {

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

  // Retrieve the components and their instructions
  const components = await prisma.recipe.findMany({
    where: {
      id: {
        in: componentIds.map(({ id }) => id)
      }
    },
    select: {
      title: true,
      instructions: {
        include: {
          timeAndTemperature: true
        },
        orderBy: {
          step: 'asc'
        }
      }
    }
  });

  const instructions = await prisma.instruction.findMany({
    where: {
      recipeId
    },
    orderBy: {
      step: 'asc'
    },
    include: {
      timeAndTemperature: true
    }
  });

  return { instructions, components };
};

export async function createInstruction(input: CreateInstructionInput) {

  const { timeAndTemperature, ...data } = input;

  if (timeAndTemperature) {
    return prisma.instruction.create({
      data: {
        ...data,
        timeAndTemperature: {
          create: {
            ...timeAndTemperature
          }
        },
      }
    });
  } else {
    return prisma.instruction.create({
      data: data
    });
  };
}


export async function updateInstruction(input: UpdateInstructionInput & InstructionURLParams) {

  const { recipeId, step, ...rest } = input
  const { timeAndTemperature, ...data }: any = rest

  if (timeAndTemperature) {
    data.temperature = {
      upsert: {
        create: {
          ...timeAndTemperature
        },
        update: {
          ...timeAndTemperature
        },
      }
    }
  }

  return prisma.instruction.update({
    where: {
      InstructionId: {
        recipeId, step: Number(step)
      }
    },
    data: data
  });
};

export async function deleteInstruction({ step, recipeId }: InstructionURLParams) {

  const instructionsToUpdate = await prisma.instruction.findMany({
    select: {
      step: true,
      recipeId: true,
    },
    where: {
      recipeId,
      step: {
        gt: Number(step)
      }
    }
  });

  await prisma.instruction.delete({
    where: {
      InstructionId: {
        step: Number(step), recipeId
      }
    }
  });

  await Promise.all(instructionsToUpdate.map((instruction) => {
    console.log(instruction)
    return new Promise(resolve => resolve(prisma.instruction.update({
      where: {
        InstructionId: {
          step: instruction.step,
          recipeId: instruction.recipeId
        }
      },
      data: {
        step: {
          decrement: 1
        }
      }
    })))
  }));

  return { ok: true }
};
