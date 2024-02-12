import prisma from "../../utils/prisma";
import { getConnections } from "../user/user.service";
import { ConnectComponentInput, CreateRatingInput, CreateRecipeInput, UpdateRecipeInput, CreateReviewInput, UpdateTagsInput } from "./recipe.schema";

export async function createRecipe(input: CreateRecipeInput & { authorId: string }) {
  return prisma.recipe.create({
    data: input
  })
}

export interface queryRecipesInterface {
  title?: string,
  page?: number,
  take?: number,
  tags?: string[],
  userId?: string,
}

// find recipes

export async function findRecipes(input: queryRecipesInterface) {

  const { title, page, take, tags, userId } = input;

  let skip = (page && take) ? (page - 1) * take : undefined;

  const tagQuery = input.tags ? {
    some: {
      name: {
        in: tags
      }
    }
  } : undefined;

  if (userId) {
    const connections = await getConnections(userId);

    return prisma.recipe.findMany({
      skip,
      take,
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
        tags: tagQuery,
        OR: [
          {
            authorId: userId
          },
          {
            public: true
          },
          {
            authorId: {
              in: connections
            }
          }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            image: true
          }
        }
      }
    })

  }

  return prisma.recipe.findMany({
    skip,
    take,
    where: {
      title: {
        contains: title,
        mode: 'insensitive',
      },
      tags: tagQuery,
      public: true,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true
        }
      }
    }
  });
}

export async function findTestKitchenRecipes({ userId, title }: { userId: string, title?: string }) {
  return prisma.recipe.findMany({
    where: {
      OR: [
        {
          authorId: userId
        },
        {
          editors: {
            some: {
              userId
            }
          }
        }
      ],
      title: {
        contains: title,
        mode: 'insensitive',
      }
    },
    take: 5
  });
};


export async function findUniqueRecipe(RecipeId: string) {
  return prisma.recipe.findUnique({
    where: {
      id: RecipeId
    },
    include: {
      tags: true,
      author: true,
      ingredients: {
        include: {
          ingredient: true
        }
      },
      instructions: {
        include: {
          timeAndTemperature: true
        }
      },
      components: {
        include: {
          component: {
            include: {
              ingredients: {
                include: {
                  ingredient: {
                    select: {
                      name: true
                    },
                  },
                },
              },
              instructions: {
                include: {
                  timeAndTemperature: true
                }
              },
            }
          }
        }
      },
      editors: true
    }
  })
}

export async function updateRecipe(input: UpdateRecipeInput & { recipeId: string }) {

  const { recipeId, ...rest } = input;

  return prisma.recipe.update({
    where: {
      id: recipeId
    },
    data: {
      ...rest
    }
  })
}


export async function removeRecipe({ recipeId }: { recipeId: string }) {
  return prisma.recipe.delete({
    where: {
      id: recipeId
    }
  })
}


export async function getComponents(recipeId: string) {
  return prisma.component.findMany({
    where: {
      recipeId
    },
    include: {
      component: {
        include: {
          ingredients: {
            include: {
              ingredient: true
            }
          },
          instructions: {
            orderBy: {
              step: 'asc'
            }
          },
        }
      }
    }
  })
}


export async function connectComponent(input: ConnectComponentInput & { recipeId: string }) {
  return prisma.component.create({
    data: input
  })
}

export async function removeConnectComponent(recipeId: string, componentId: string) {
  return prisma.component.delete({
    where: {
      RecipeComponentId: { recipeId, componentId }
    }
  })
}


export interface queryRecipeConnections {
  authorId: string,
  title?: string,
  page?: number,
  take?: number,
}


export async function availableToConnect(input: { recipeId: string } & queryRecipeConnections) {

  const { authorId, recipeId, title, page, take } = input;

  let skip = (page && take) ? (page - 1) * take : undefined;

  return prisma.recipe.findMany({
    skip: Number(skip),
    take: Number(take),
    where: {
      authorId,
      AND: [
        {
          NOT: {
            parentRecipes: {
              some: {
                recipeId
              }
            }
          }
        },
        {
          NOT: {
            id: recipeId
          }
        }
      ],
      title: {
        contains: title
      }
    },
    include: {
      author: true
    }
  })
}


export async function addRecipePhoto(filepath: string, recipeId: string) {
  return prisma.recipe.update({
    where: {
      id: recipeId
    },
    data: {
      image: filepath
    }
  })
}


export interface editorInterface {
  userId: string,
  recipeId: string,
};

export async function getEditor({ recipeId }: { recipeId: string }) {
  return prisma.recipeEditors.findMany({
    where: {
      recipeId
    }
  });
};

export async function addEditor(input: editorInterface) {
  return prisma.recipeEditors.create({
    data: {
      ...input
    }
  });
};

export async function removeEditor(input: editorInterface) {
  return prisma.recipeEditors.delete({
    where: {
      EditorId: {
        ...input
      }
    }
  })
}


// Ratings

export async function getRatings({ recipeId }: { recipeId: string }) {
  return prisma.rating.aggregate({
    where: {
      recipeId
    },
    _avg: {
      value: true
    },
    _count: true
  });
};

export async function getRating(input: { recipeId: string, userId: string }) {
  return prisma.rating.findUnique({
    where: {
      RatingId: input
    }
  });
};

export async function updateRating(input: { recipeId: string, userId: string, value: number }) {

  const { value, ...keys } = input;

  return prisma.rating.update({
    where: {
      RatingId: keys
    },
    data: {
      value
    }
  });
};

export async function createRating(input: CreateRatingInput & { recipeId: string }) {
  return prisma.rating.create({
    data: input
  });
};


// Reviews

export async function getReviews({ recipeId }: { recipeId: string }) {
  return prisma.review.findMany({
    where: {
      recipeId
    }
  });
};

export async function createReview(input: CreateReviewInput & { recipeId: string }) {
  return prisma.review.create({
    data: input
  });
};

export async function getReview(input: { recipeId: string, userId: string }) {
  return prisma.review.findUnique({
    where: {
      ReviewId: input
    }
  });
};

export async function updateReview(input: { recipeId: string, userId: string, text: string }) {

  const { text, ...keys } = input;

  return prisma.review.update({
    where: {
      ReviewId: keys
    },
    data: {
      text
    }
  });
};


// Tags

export async function updateTags(input: { tags: UpdateTagsInput, recipeId: string }) {

  const { recipeId, tags } = input;

  const data = tags.map(({ name }) => ({ name, recipeId }));

  await prisma.tag.deleteMany({
    where: {
      recipeId
    }
  });

  return prisma.tag.createMany({
    data: data
  })
};


// Dashboard

export async function getDashboard({ userId, take, lastCursor }: { userId?: string, take: string, lastCursor?: string }) {

  const results = await prisma.recipe.findMany({
    take: parseInt(take as string),
    ...(lastCursor && {
      skip: 1, // Do not include the cursor itself in the query result.
      cursor: {
        id: lastCursor as string,
      }
    }),
    orderBy: {
      createdOn: "desc",
    }
  });

  if (results.length == 0) {
    return {
      data: [],
      metaData: {
        lastCursor: null,
        hasNextPage: false,
      },
    };
  }

  const lastPostInResults: any = results[results.length - 1];
  const cursor: any = lastPostInResults.id;

  const nextPage = await prisma.user.findMany({
    // Same as before, limit the number of events returned by this query.
    take: take ? parseInt(take as string) : 7,
    skip: 1, // Do not include the cursor itself in the query result.
    cursor: {
      id: cursor,
    },
  });

  const data = {
    data: results, metaData: {
      lastCursor: cursor,
      hasNextPage: nextPage.length > 0,
    }
  };

  return data
}
