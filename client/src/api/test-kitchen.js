import axiosInstance from "./refresh";
import { stratify, tree } from "d3-hierarchy";
import { getRecipe } from "./recipe";

export async function getIterations({ recipeId }) {
  try {
    const { data } = await axiosInstance.get('/api/iterations?' + new URLSearchParams({
      recipeId
    }));
    data.filter((el) => (el.parentId === null)).forEach((node) => node.parentId = "root");
    data.push({ id: "root", parentId: null })
    return data
  } catch (error) {
    console.error(error)
  };
};

export async function getIterationInstance({ iterationId }) {
  try {
    const { data } = await axiosInstance.get(`/api/iterations/${iterationId}`)
    return data
  } catch (error) {
    console.error(error)
  };
};

export async function createIteration(input) {
  try {
    const { data } = await axiosInstance.post('/api/iterations/',
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function editIteration({ iterationId, input }) {
  try {
    const { data } = await axiosInstance.patch(`/api/iterations/${iterationId}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error)
  }
};

export async function deleteIteration({ iterationId }) {
  try {
    const { data } = await axiosInstance.delete(`/api/iterations/${iterationId}/`,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return { ok: true };
  } catch (error) {
    console.error(error);
  };
};


export async function deleteIterationIngredient({ iterationId, ingredientId }) {
  try {
    const { data } = await axiosInstance.delete(`/api/iterations/${iterationId}/ingredients/${ingredientId}/`,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data
  } catch (error) {
    console.error(error)
  }
};

export async function createManyIterationIngredients({ iterationId, input }) {
  try {
    const { data } = await axiosInstance.post(`/api/iterations/${iterationId}/ingredients/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error)
  }
}

export async function updateIterationIngredient({ iterationId, ingredientId, input }) {
  try {
    const { data } = await axiosInstance.patch(`/api/iterations/${iterationId}/ingredients/${ingredientId}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

// Instructions

export async function createManyIterationInstruction({ iterationId, input }) {
  try {
    const { data } = await axiosInstance.post(`/api/iterations/${iterationId}/instructions/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function updateIterationInstruction({ iterationId, step, input }) {
  try {
    const { data } = await axiosInstance.patch(`/api/iterations/${iterationId}/instructions/${step}/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function removeIterationInstruction({ iterationId, step }) {
  try {
    const { data } = await axiosInstance.delete(`/api/iterations/${iterationId}/instructions/${step}/`,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};


// Comments

export async function getComments({ iterationId }) {
  try {
    const { data } = await axiosInstance.get(`/api/iterations/${iterationId}/comments`);
    return data;
  } catch (error) {
    console.error(err)
  }
}

export async function createComment({ input, iterationId }) {
  try {
    const { data } = await axiosInstance.post(`/api/iterations/${iterationId}/comments/`,
      input,
      {
        headers: { 'Content-Type': 'application/json' }
      },
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(error);
  };
};

export async function getIterationsLayout({ recipeId }) {
  try {

    const iterations = await getIterations({ recipeId });
    const recipe = await getRecipe({ recipeId });

    const root = stratify()
      .id((d) => d.id)
      .parentId((d) => d.parentId)(iterations);

    const g = tree();
    const layout = g.nodeSize([150 * 2, 200 * 2])(root);

    return ({
      initialNodes: layout
        .descendants()
        .map((node, index) => (
          {
            id: node.id,
            type: node.id !== "root" ? "iterationNode" : "recipeNode",
            data: {
              id: node.data.id,
              index: index,
              tag: node.data.tag,
              ingredients: node.id !== "root" ? node.data.ingredients : recipe.ingredients,
              instructions: node.id !== "root" ? node.data.instructions : recipe.instructions,
              parentIngredients: node.data.parent ? node.data.parent.ingredients : recipe.ingredients,
              parentInstructions: node.data.parent ? node.data.parent.instructions : recipe.instructions,
            },
            position: { x: node.x, y: node.y }
          })),
      initialEdges: layout
        .descendants()
        .map((node) => (node.children && node.children
          .map((child) => ({
            id: `${node.id}-${child.id}`,
            source: `${node.id}`,
            target: `${child.id}`
          })))).flat(Infinity).filter(Boolean),
    })
  } catch (error) {
    console.error(error)
  }
};


export async function findTestKitchenRecipes({ title }) {
  try {
    const { data } = await axiosInstance.get(`/api/recipes/test-kitchen?` + new URLSearchParams({
      title
    }));
    return data;
  } catch (error) {
    console.error(error);
  };
};