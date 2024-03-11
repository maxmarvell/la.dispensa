import { Handle, Position } from 'reactflow';
import { useParams } from 'react-router-dom';

// service
import { useRecipe } from '@/services/hooks/recipe/useRecipe';

export const recipeNode = ({ selected }: { selected: boolean }) => {

  const { recipeId } = useParams();

  const { getRecipeById } = useRecipe();
  const { data: recipe } = getRecipeById({ recipeId });

  return (
    <>
      <div
        className={`w-64 min-h-64 p-2 bg-yellow-200 divide-y divide-black divide-dashed ${selected && 'outline-dashed outline-4 outline-blue-500'}`}
      >
        <div className='text-lg font-bold'>
          {recipe?.title}
        </div>
        {recipe?.image ? (
          <div className='mb-2 pt-2 w-full aspect-square'>
            <img
              src={recipe.image}
              className='object-cover asbolute top-0 right-0 h-full w-full' />
          </div>
        ) : null}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
};

export default recipeNode;