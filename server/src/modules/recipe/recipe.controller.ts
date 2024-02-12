import { FastifyReply, FastifyRequest } from "fastify";
import { createRecipe, findUniqueRecipe, findRecipes, updateRecipe, getComponents, connectComponent, removeConnectComponent, availableToConnect, removeRecipe, addEditor, editorInterface, removeEditor, getEditor, getRatings, createRating, getReviews, createReview, getRating, updateRating, getReview, updateReview, updateTags, findTestKitchenRecipes, getDashboard } from "./recipe.service";
import { CreateRecipeInput, UpdateRecipeInput, ConnectComponentInput, AddEditorInput, CreateRatingInput, CreateReviewInput, UpdateRatingInput, UpdateReviewInput, UpdateTagsInput } from "./recipe.schema";
import cloudImageUpload from "../../utils/aws.s3";
import { addRecipePhoto } from "./recipe.service";

interface queryRecipesInterface {
  title?: string,
  page?: string,
  take?: string,
  tags?: string,
}

export async function getRecipesHandler(
  request: FastifyRequest<{
    Querystring: queryRecipesInterface
  }>,
  reply: FastifyReply
) {
  const { title } = request.query;
  const page = Number(request.query.page);
  const take = Number(request.query.take);
  const tags = request.query.tags?.length ? request.query.tags.split(',') : undefined;

  const auth = request.headers.authorization
  const token = auth?.split(" ")[1]

  if (token !== "null") {
    await request.jwtVerify();
    const { id: userId } = request.user;
    try {
      const recipes = await findRecipes({ title, page, take, tags, userId });
      return recipes;
    } catch (error) {
      console.log(error);
      return reply.code(404);
    };
  };

  try {
    const recipes = await findRecipes({ title, page, take, tags });
    return recipes;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  };
};

export async function findTestKitchenRecipesHandler(
  request: FastifyRequest<{
    Querystring: {
      title?: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const recipes = await findTestKitchenRecipes({
      userId: request.user.id,
      ...request.query
    });
    return recipes;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  };
};



export async function createRecipeHandler(
  request: FastifyRequest<{
    Body: CreateRecipeInput,
  }>,
  reply: FastifyReply
) {

  try {
    const recipe = await createRecipe({
      ...request.body,
      authorId: request.user.id
    });
    return recipe;
  } catch (e) {
    console.log(e);
    return reply.code(400);
  }
}


export async function getRecipeHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {

  const { recipeId } = request.params;
  const recipe = await findUniqueRecipe(recipeId);

  if (!recipe) {
    return reply.code(404).send({
      message: "Recipe not found!"
    });
  }

  return recipe;
}


export async function updateRecipeHandler(
  request: FastifyRequest<{
    Body: UpdateRecipeInput,
    Params: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const recipe = await updateRecipe({
      ...request.body,
      recipeId: request.params.recipeId
    });
    return recipe;
  } catch (e) {
    console.log(e);
    return reply.code(400);
  }
}

export async function removeRecipeHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const result = await removeRecipe({
      ...request.params
    });
    return result;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  }
}

export async function getComponentsHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const components = await getComponents(request.params.recipeId);
    return components;
  } catch (error) {
    console.log(error);
    reply.code(404);
  }
}

export async function connectComponentHandler(
  request: FastifyRequest<{
    Body: ConnectComponentInput,
    Params: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { recipeId } = request.params;
    const component = await connectComponent({
      ...request.body,
      recipeId
    });
    return component;
  } catch (error) {
    console.log(error);
    reply.code(401);
  }
}


export async function removeConnectComponentHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string,
      componentId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const { recipeId, componentId } = request.params;
    const result = await removeConnectComponent(recipeId, componentId);
    return result
  } catch (error) {
    console.log(error)
    reply.code(401)
  }
}


export async function getAvailableComponentsHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    },
    Querystring: {
      authorId: string,
      title?: string,
      page?: number,
      take?: number,
    }
  }>,
  reply: FastifyReply
) {
  try {
    const recipes = await availableToConnect({
      ...request.query,
      ...request.params
    });
    return recipes;
  } catch (error) {
    console.error(error)
    reply.code(404)
  }
}



export async function uploadPhotoHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {

    const data = await request.file();

    if (!data) {
      throw new Error('No file provided');
    };

    const upload = await cloudImageUpload(data);

    if (upload.ok) {
      const { recipeId } = request.params;
      const filepath = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${data.filename}`;
      const recipe = await addRecipePhoto(filepath, recipeId);
      return recipe;
    };
    return { ok: false };

  } catch (error) {
    console.log(error);
    return reply.code(401);
  };
};


export async function getEditorsHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const data = await getEditor(request.params);
    return data;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  }
}


export async function addEditorHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    },
    Body: AddEditorInput
  }>,
  reply: FastifyReply
) {
  try {
    const data = await addEditor({
      ...request.params,
      ...request.body
    });
    return data;
  } catch (error) {
    console.log(error)
    return reply.code(401)
  }
}

export async function removeEditorHandler(
  request: FastifyRequest<{
    Params: editorInterface
  }>,
  reply: FastifyReply) {
  try {
    await removeEditor(request.params);
    return { ok: true }
  } catch (error) {
    console.log(error)
    return reply.code(404)
  }
}


export async function getRatingsHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const ratings = await getRatings(request.params);
    return ratings;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  };
};

export async function getRatingHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string,
      userId: string,
    }
  }>,
  reply: FastifyReply
) {
  try {
    const rating = await getRating(request.params);
    return rating;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  };
};

export async function updateRatingHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string,
      userId: string,
    },
    Body: UpdateRatingInput
  }>,
  reply: FastifyReply
) {
  try {
    const rating = await updateRating({
      ...request.params,
      ...request.body
    });
    return rating;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  }
}

export async function createRatingHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string,
    },
    Body: CreateRatingInput
  }>,
  reply: FastifyReply
) {
  try {
    const rating = await createRating({
      ...request.body,
      ...request.params
    });
    return rating;
  } catch (error) {
    console.log(error);
    return reply.code(401);
  };
};

export async function getReviewsHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const reviews = await getReviews(request.params);
    return reviews;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  };
};

export async function getReviewHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string,
      userId: string
    }
  }>,
  reply: FastifyReply
) {
  try {
    const review = await getReview(request.params)
    return review
  } catch (error) {
    console.log(error)
    return reply.code(404)
  }
}

export async function createReviewHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    },
    Body: CreateReviewInput
  }>,
  reply: FastifyReply
) {
  try {
    const review = await createReview({
      ...request.params,
      ...request.body
    });
    return review;
  } catch (error) {
    console.log(error);
    return reply.code(401);
  };
};

export async function updateReviewHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string,
      userId: string
    },
    Body: UpdateReviewInput
  }>,
  reply: FastifyReply) {
  try {
    const review = await updateReview({
      ...request.body,
      ...request.params
    });
    return review
  } catch (error) {
    console.log(error)
    return reply.code(404)
  }
}

// Tags

export async function updateTagsHandler(
  request: FastifyRequest<{
    Params: {
      recipeId: string
    },
    Body: UpdateTagsInput
  }>,
  reply: FastifyReply
) {
  try {
    const tags = await updateTags({
      tags: request.body,
      ...request.params
    });
    console.log(tags)
    return tags;
  } catch (error) {
    console.log(error);
    return reply.code(404);
  };
};


// Dashboard

export async function getDashboardHandler(
  request: FastifyRequest<{
    Querystring: {
      lastCursor: string,
      take: string
    }
  }>,
  reply: FastifyReply
) {
  let { lastCursor, take } = request.query;
  let { id: userId } = request.user;

  try {
    let data = getDashboard({ userId, lastCursor, take });
    return data
  } catch (error) {
    console.log(error)
    return reply.code(404)
  }
}
