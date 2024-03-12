import { Handle, Position } from "reactflow";
import { IterationNodeProps } from "../../models";
import { IconArrowNarrowRight, IconCircleMinus, IconCirclePlus, IconEdit } from "@tabler/icons-react";

export default function iterationNode({ data, selected } : IterationNodeProps) {

  const removed = data.parentIngredients.filter(el => !data.ingredients.map(
    el => el.ingredient.name).includes(el.ingredient.name)
  )

  const added = data.ingredients.filter(el => !data.parentIngredients.map(
    el => el.ingredient.name).includes(el.ingredient.name)
  )

  const changed = data.parentIngredients.filter(parent => {
    let child = data.ingredients.find(({ ingredientId }) => ingredientId === parent.ingredientId);
    return child && (child?.unit !== parent.unit || child?.quantity !== parent.quantity)
  }).map(parent => {
    let child = data.ingredients.find(({ ingredientId }) => ingredientId === parent.ingredientId)
    return { child, parent }
  })


  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className={`w-64 h-64 p-2 bg-yellow-200 divide-y-2 divide-black divide-dashed overflow-y-scroll ${selected && 'outline-dashed outline-4 outline-blue-500'}`}
      >
        <div
          className="w-full uppercase text-base font-bold mb-1 text-wrap"
        >
          # {data.tag}
        </div>
        <div className='pt-2'>
          <ul>
            {added.map((el, index) =>
              <li key={index} className='flex items-center space-x-1'>
                <IconCirclePlus />
                <div className='text-ellipsis truncate'>
                  <span>{el.quantity}{el.unit}</span>
                  <span className='capitalize'> {el.ingredient.name}</span>
                </div>
              </li>
            )}
          </ul>
          <ul>
            {removed.map((el, index) => (
              <li key={index} className='flex items-center space-x-1'>
                <IconCircleMinus />
                <div className='text-ellipsis truncate'>
                  <span>{el.quantity}{el.unit}</span>
                  <span className='capitalize'> {el.ingredient.name}</span>
                </div>
              </li>
            )
            )}
          </ul>
          {changed.map((el, index) =>
          (
            <li key={index} className='flex items-center space-x-1'>
              <IconEdit />
              <div className='text-ellipsis truncate'>
                <span>{el.parent.quantity}{el.parent.unit}</span>
                <span className='capitalize'> {el.parent.ingredient.name}</span>
              </div>
              <IconArrowNarrowRight />
              <div className='text-ellipsis truncate'>
                <span>{el.child?.quantity}{el.child?.unit}</span>
                <span className='capitalize'> {el.parent.ingredient.name}</span>
              </div>
            </li>
          )
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}