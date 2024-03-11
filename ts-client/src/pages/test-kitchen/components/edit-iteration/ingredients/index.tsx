import { ModifyIngredients } from "./update-ingredients";
import { CreateIngredients } from "./create-ingredients";

import { IterationProps } from "@/pages/test-kitchen/models";

const Ingredients = ({ iteration, setNodes } : IterationProps) => {
  return (
    <div className="flex flex-col">
      <ModifyIngredients iteration={iteration} setNodes={setNodes} />
      <CreateIngredients iteration={iteration} setNodes={setNodes} />
    </div>
  )
};

export default Ingredients