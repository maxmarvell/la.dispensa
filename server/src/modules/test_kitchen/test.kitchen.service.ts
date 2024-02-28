import prisma from "../../utils/prisma"
import { CreateIterationInput, CreateIterationIngredientInput, UpdateIterationIngredientInput, UpdateIterationInput, UpdateIterationInstructionInput, CreateIterationCommentInput, CreateIterationInstructionInput, IterationInstructionCompositeKey } from "./test.kitchen.schema";
import { ParentIterationInstruction, ParentRecipeInstruction, FindIterationResponse } from "./test.kitchen.schema";

export async function getIterations(recipeId: string) {
  return prisma.iteration.findMany({
    where: {
      recipeId
    },
    include: {
      parent: {
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          },
          instructions: true
        }
      },
      ingredients: {
        include: {
          ingredient: true
        }
      },
      instructions: {
        orderBy: {
          step: "asc"
        },
        include: {
          timeAndTemperature: true,
        }
      },
    }
  });
};

export async function getIterationInstance(iterationId: string) {
  return prisma.iteration.findUnique({
    where: {
      id: iterationId
    },
    include: {
      ingredients: {
        include: {
          ingredient: true
        }
      },
      instructions: true,
    }
  });
};

export async function createIteration(input: CreateIterationInput) {

  // Extract the recipeId and rest
  const { recipeId, ...rest } = input;

  // ...rest still contains parentId field
  const { parentId } = rest;

  // Parent ingredients are either the original recipe or the parent iteration
  const ingredients = parentId ? (
    await prisma.ingredientIteration.findMany({
      where: {
        iterationId: parentId,
      },
      select: {
        unit: true,
        quantity: true,
        ingredientId: true
      }
    })
  ) : (
    await prisma.recipeIngredient.findMany({
      where: {
        recipeId
      },
      select: {
        unit: true,
        quantity: true,
        ingredientId: true
      }
    })
  );


  if (parentId) {
    let parentInstructions: ParentIterationInstruction[] = await prisma.instructionIteration.findMany({
      where: {
        iterationId: parentId,
      },
      include: {
        timeAndTemperature: {
          select: {
            hours: true,
            temperature: true,
            minutes: true,
            unit: true
          }
        }
      }
    });

    // Map the instructions to a nested create query
    const instructions = parentInstructions.map(({ timeAndTemperature, ...rest }) => {
      return {
        ...rest,
        ...(timeAndTemperature && {
          timeAndTemperature: {
            create: timeAndTemperature
          }
        })
      };
    });

    // Nested creation of the iteration and the ingredient fields
    const iteration = await prisma.iteration.create({
      data: {
        ...rest,
        recipeId,
        ingredients: {
          createMany: {
            data: ingredients
          }
        },
      },
      include: {
        ingredients: true
      }
    });

    // Connnect the instructions with a nested create
    await Promise.all(instructions.map(({ iterationId, ...rest }) => {
      return new Promise(resolve => resolve(
        prisma.instructionIteration.create({
          data: {
            iterationId: iteration.id,
            ...rest
          }
        })
      ))
    }))

    return prisma.iteration.findUnique({
      where: {
        id: iteration.id
      },
      include: {
        parent: {
          include: {
            ingredients: {
              include: {
                ingredient: true
              }
            },
            instructions: true
          }
        },
        ingredients: {
          include: {
            ingredient: true
          }
        },
        instructions: {
          include: {
            timeAndTemperature: true,
          }
        },
      }
    })
  };


  // Parent instructions are either the OG recipe or the parent iteration
  // Only take fields with temperature and time fields
  let parentInstructions: ParentRecipeInstruction[] = await prisma.instruction.findMany({
    where: {
      recipeId,
    },
    include: {
      timeAndTemperature: {
        select: {
          hours: true,
          temperature: true,
          minutes: true,
          unit: true
        }
      }
    }
  });

  // Map the instructions to a nested create query
  const instructions = parentInstructions.map(({ timeAndTemperature, ...rest }) => ({
    ...rest,
    ...(timeAndTemperature && {
      timeAndTemperature: {
        create: timeAndTemperature
      }
    }),
  })
  );

  // Nested creation of the iteration and the ingredient fields
  const iteration: FindIterationResponse = await prisma.iteration.create({
    data: {
      ...rest,
      recipeId,
      ingredients: {
        createMany: {
          data: ingredients
        }
      },
    },
    include: {
      ingredients: true
    }
  });

  // Connnect the instructions with a nested create
  await Promise.all(instructions.map(({ recipeId, ...rest }) => {
    return new Promise(resolve => resolve(
      prisma.instructionIteration.create({
        data: {
          iterationId: iteration.id,
          ...rest
        }
      })
    ))
  }))

  return prisma.iteration.findUnique({
    where: {
      id: iteration.id
    },
    include: {
      parent: {
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          },
          instructions: true
        }
      },
      ingredients: {
        include: {
          ingredient: true
        }
      },
      instructions: {
        include: {
          timeAndTemperature: true,
        }
      },
    }
  })
};

export async function updateIteration(input: UpdateIterationInput & { iterationId: string }) {

  const { iterationId, ...rest } = input;

  return prisma.iteration.update({
    where: {
      id: iterationId
    },
    data: rest
  })
};

export async function deleteIteration({ iterationId }: { iterationId: string }) {
  return prisma.iteration.delete({
    where: {
      id: iterationId
    }
  });
};

// Ingredients

export interface ingredientParams {
  ingredientId: string,
  iterationId: string,
};

export async function deleteIterationIngredient(input: ingredientParams) {
  return prisma.ingredientIteration.delete({
    where: {
      RecipeIngredientId: {
        ...input
      }
    }
  })
};

export async function updateIterationIngredient(input: UpdateIterationIngredientInput & ingredientParams) {

  const { ingredientId, iterationId, ...rest } = input;

  return prisma.ingredientIteration.update({
    where: {
      RecipeIngredientId: {
        iterationId,
        ingredientId,
      }
    },
    data: {
      ...rest
    },
    include: {
      ingredient: true
    }
  });
};

export async function createIterationingredient(input: CreateIterationIngredientInput & { iterationId: string }) {

  const { ingredient, ...data } = input

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

  return prisma.ingredientIteration.create({
    data: {
      ...data,
      ingredientId: fetchIngredient.id
    },
    include: {
      ingredient: true
    }
  })
};

// Instructions

export async function createIterationInstruction(input: CreateIterationInstructionInput & { iterationId: string }) {

  const { timeAndTemperature, ...data } = input;

  return prisma.instructionIteration.create({
    data: {
      ...data,
      ...(timeAndTemperature && {
        timeAndTemperature: {
          create: {
            ...timeAndTemperature
          }
        },
      })
    }
  });
};

export async function updateIterationInstruction(input: UpdateIterationInstructionInput & IterationInstructionCompositeKey) {

  const { step, iterationId, ...data } = input;
  const { timeAndTemperature, ...rest } = data;

  return prisma.instructionIteration.update({
    where: {
      InstructionId: {
        step: step,
        iterationId
      }
    },
    data: {
      ...rest,
      ...(timeAndTemperature && {
        timeAndTemperature: {
          upsert: {
            update: timeAndTemperature,
            create: timeAndTemperature
          }
        }
      })
    },
  });
};

export async function deleteIterationInstruction(input: IterationInstructionCompositeKey) {

  const { step, iterationId } = input;

  const instructionsToUpdate: IterationInstructionCompositeKey[] = await prisma.instructionIteration.findMany({
    select: {
      step: true,
      iterationId: true,
    },
    where: {
      iterationId,
      step: {
        gt: Number(step)
      }
    }
  });

  await prisma.instructionIteration.delete({
    where: {
      InstructionId: {
        iterationId,
        step: Number(step),
      }
    }
  });

  await Promise.all(instructionsToUpdate.map((instruction) => {
    return new Promise(resolve => resolve(prisma.instructionIteration.update({
      where: {
        InstructionId: {
          step: instruction.step,
          iterationId: instruction.iterationId
        }
      },
      data: {
        step: {
          decrement: 1
        }
      }
    })));
  }));

  return { ok: true };
};

// Comments

export async function getIterationComments({ iterationId }: { iterationId: string }) {
  return prisma.comment.findMany({
    where: {
      iterationId
    },
    orderBy: {
      createdOn: 'desc'
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        }
      }
    }
  });
};

export async function createIterationComment(input: CreateIterationCommentInput & { iterationId: string, userId: string }) {
  return prisma.comment.create({
    data: input
  });
};