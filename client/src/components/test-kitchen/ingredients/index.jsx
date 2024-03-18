import { ModifyIngredients } from "./modifyIngredients";
import { CreateIngredients } from "./createIngredients";


const Ingredients = ({ iteration, setNodes }) => {
  return (
    <div className="flex flex-col">
      <ModifyIngredients iteration={iteration} setNodes={setNodes} />
      <CreateIngredients iteration={iteration} setNodes={setNodes} />
    </div>
  )
};

export default Ingredients