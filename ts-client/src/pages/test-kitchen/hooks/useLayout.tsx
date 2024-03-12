import { useQuery } from "@tanstack/react-query";
import { stratify, tree } from "d3-hierarchy";
import axiosInstance from "@/services/axios";

import { UseLayoutProps, } from "../models";
import { IterationType } from "@/types/iteration";

interface TreeIterationType extends IterationType {
  parentId: string
}

export const useLayout = ({ recipeId }: UseLayoutProps) => {

  if (!recipeId) throw new Error("id of recipe for layout is required");

  const getIterationsLayout = useQuery({
    queryKey: ['iteration-layout', recipeId],
    queryFn: async () => {
      try {
        let { data: recipe } = await axiosInstance.get(`/api/recipes/${recipeId}`);

        let { data: iterations } = await axiosInstance.get('/api/iterations?' + new URLSearchParams({
          recipeId
        }))

        iterations.filter((el: any) => (el.parentId === null)).forEach((node: any) => node.parentId = "root");
        iterations.push({ id: "root", parentId: null })

        const root = stratify<TreeIterationType>()
          .id((d) => d.id)
          .parentId((d) => d.parentId)(iterations);

        const g = tree<TreeIterationType>();
        const layout = g.nodeSize([150 * 2, 200 * 2])(root);

        const initialEdges = layout
          .descendants()
          .map(node => node.children && node.children
            .map(child => ({
              id: `${node.id}-${child.id}`,
              source: `${node.id}`,
              target: `${child.id}`
            })) || []).reduce((accumulator, value) => accumulator.concat(value), []).filter(Boolean);

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
    }
  });

  return {
    getIterationsLayout
  }

}