import axiosInstance from "./refresh";
import { stratify, tree } from "d3-hierarchy";
import { getRecipe } from "./recipe";
import { BaseRecipe } from "../@types/recipe";
import { CommentType, IterationLayoutType, IterationType } from "../@types/test-kitchen";

export async function getIterations({ recipeId }: { recipeId: string }) {
  try {
    const { data } = await axiosInstance.get('/api/iterations?' + new URLSearchParams({
      recipeId
    }));
    data.filter((el: any) => (el.parentId === null)).forEach((node: any) => node.parentId = "root");
    data.push({ id: "root", parentId: null })
    return data
  } catch (error) {
    console.error(error)
  };
};

export async function getIterationInstance({ iterationId }: { iterationId: string }) {
  try {
    const { data } = await axiosInstance.get(`/api/iterations/${iterationId}`)
    return data
  } catch (error) {
    console.error(error)
  };
};

export async function createIteration(input: any) {
  try {
    const { data } = await axiosInstance.post('/api/iterations/',
      input,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function editIteration({ iterationId, input }: any) {
  try {
    const { data } = await axiosInstance.patch(`/api/iterations/${iterationId}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return data;
  } catch (error) {
    console.error(error)
  }
};

export async function deleteIteration({ iterationId }: { iterationId: string }) {
  try {
    await axiosInstance.delete(`/api/iterations/${iterationId}/`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return { ok: true };
  } catch (error) {
    console.error(error);
  };
};


export async function deleteIterationIngredient({ iterationId, ingredientId }: any) {
  try {
    const { data } = await axiosInstance.delete(`/api/iterations/${iterationId}/ingredients/${ingredientId}/`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return data
  } catch (error) {
    console.error(error)
  }
};

export async function createManyIterationIngredients({ iterationId, input }: any) {
  try {
    const { data } = await axiosInstance.post(`/api/iterations/${iterationId}/ingredients/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function updateIterationIngredient({ iterationId, ingredientId, input }: any) {
  try {
    const { data } = await axiosInstance.patch(`/api/iterations/${iterationId}/ingredients/${ingredientId}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

// Instructions

export async function createManyIterationInstruction({ iterationId, input }: any) {
  try {
    const { data } = await axiosInstance.post(`/api/iterations/${iterationId}/instructions/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function updateIterationInstruction({ iterationId, step, input }: any) {
  try {
    const { data } = await axiosInstance.patch(`/api/iterations/${iterationId}/instructions/${step}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function removeIterationInstruction({ iterationId, step }: any) {
  try {
    const { data } = await axiosInstance.delete(`/api/iterations/${iterationId}/instructions/${step}/`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};


// Comments

export async function getComments({ iterationId }: { iterationId: string }): Promise<CommentType[] | undefined> {
  try {
    const { data } = await axiosInstance.get(`/api/iterations/${iterationId}/comments`);
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function createComment({ input, iterationId }: { input: any, iterationId: string }) {
  try {
    const { data } = await axiosInstance.post(`/api/iterations/${iterationId}/comments/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getIterationsLayout({ recipeId }: { recipeId: string | undefined }): Promise<IterationLayoutType | undefined> {

  if (!recipeId) return undefined;

  try {
    const iterations = await getIterations({ recipeId });
    const recipe = await getRecipe({ recipeId });

    if (!recipe || !iterations) return;

    const root = stratify<IterationType>()
      .id((d: any) => d.id)
      .parentId((d: any) => d.parentId)(iterations);

    const g = tree<IterationType>();
    const layout = g.nodeSize([150 * 2, 200 * 2])(root);

    const initialEdges = layout
      .descendants()
      .map(node => node.children && node.children
        .map(child => ({
          id: `${node.id}-${child.id}`,
          source: `${node.id}`,
          target: `${child.id}`
        }))).flat(Infinity).filter(Boolean);

    const initialNodes = layout
      .descendants()
      .map((node: any) => ({
        id: node.id,
        type: node.id !== "root" ? "iterationNode" : "recipeNode",
        data: {
          id: node.data.id,
          tag: node.data.tag,
          ingredients: node.id !== "root" ? node.data.ingredients : recipe?.ingredients,
          instructions: node.id !== "root" ? node.data.instructions : recipe?.instructions,
          parentIngredients: node.data.parent ? node.data.parent.ingredients : recipe?.ingredients,
          parentInstructions: node.data.parent ? node.data.parent.instructions : recipe?.instructions,
        },
        position: { x: node.x, y: node.y }
      }));

    return ({ initialNodes, initialEdges, })

  } catch (error) {
    console.error(error)
  }
};


export async function findTestKitchenRecipes({ title }: { title: string }) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/test-kitchen?` + new URLSearchParams({
      title
    }));
    return data as BaseRecipe[];
  } catch (error) {
    console.error(error);
  };
};