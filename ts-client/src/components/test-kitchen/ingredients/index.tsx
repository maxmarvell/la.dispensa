import { ModifyIngredients } from "./modifyIngredients";
import { CreateIngredients } from "./createIngredients";

import { IterationProps } from "../../../@types/test-kitchen";


const Ingredients = ({ iteration, setNodes } : IterationProps) => {
  return (
    <div className="flex flex-col">
      <ModifyIngredients iteration={iteration} setNodes={setNodes} />
      <CreateIngredients iteration={iteration} setNodes={setNodes} />
    </div>
  )
};

export default Ingredients