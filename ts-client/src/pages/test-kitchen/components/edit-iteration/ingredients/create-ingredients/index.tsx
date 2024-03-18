import { useState, useContext } from "react";
import { useParams } from "react-router-dom";

// component
import { IconDeviceFloppy, IconPlus, IconSquareX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

// services
import AuthContext from "@/services/contexts/authContext";
import SocketContext from "@/services/contexts/socketContext";
import { IngredientInput } from "@/components/ingredients/input";

// types
import { IterationProps } from "@/pages/test-kitchen/models";
import { useIterationIngredient } from "@/pages/test-kitchen/hooks/useIterationIngredients";
import { AuthContextType, SocketContextType } from "@/services/contexts/models";
import { NewIngredientInputType } from "@/types/ingredient";

const CREATE_INGREDIENT_CHANNEL = import.meta.env.VITE_CREATE_INGREDIENT_CHANNEL;

export const CreateIngredients = ({ iteration, setNodes }: IterationProps) => {

  // params
  const { id: iterationId } = iteration;
  const { recipeId } = useParams();

  // auth
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  // socket
  const { socket } = useContext(SocketContext) as SocketContextType;

  // allow users to be able to add ingredients
  // use state for the new input fields
  const [newIngredients, setNewIngredients] = useState<NewIngredientInputType[]>([]);
  const handleAddIngredient = () => {
    setNewIngredients(prev => [...prev, {
      ingredient: {
        name: ""
      },
      quantity: 0,
      id: crypto.randomUUID()
    }]);
  };

  // update the selected iterations ingredient field
  const { createIngredients } = useIterationIngredient({ iterationId });

  const handleCreate = async () => {

    // await the newly created ingredients
    let createdIngredients = await createIngredients({ input: newIngredients });

    // reset the new ingredients form
    setNewIngredients([])

    // update the global test-kitchen state
    setNodes(prev => prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        return { ...rest, data: { ...data, ingredients: [...data.ingredients, ...createdIngredients] } };
      } else {
        return { ...rest, data };
      }
    }));

    // emit the change
    socket?.emit(CREATE_INGREDIENT_CHANNEL, {
      newIngredients,
      iterationId,
      recipeId,
      userId,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mt-3 mb-2">
        <Button
          variant="ghost"
          className="space-x-5"
          onClick={handleAddIngredient}
        >
          <IconPlus className="mr-2 size-5" /> Add an Ingredient?
        </Button>
      </div>
      <div className="space-y-2">
        {newIngredients.map(el =>
          <div key={el.id} className="flex space-x-2">
            <IngredientInput
              key={el.id}
              ingredient={el}
              setIngredient={{
                nameChange: ({ name }: { name: string }) => {
                  setNewIngredients(prev => prev.map(_el => el.id === _el.id ? { ..._el, ingredient: { name } } : _el))
                },
                quantityChange: ({ quantity }: { quantity: number }) => {
                  setNewIngredients(prev => prev.map(_el => (
                    el.id === _el.id ? { ..._el, quantity: quantity } : _el
                  )))
                },
                unitChange: ({ unit: _unit }: { unit: "G" | "KG" | "CUP" | "ML" | "L" | "OZ" | undefined }) => {
                  setNewIngredients(prev => prev.map(({ unit, ...rest }, _index) => (
                    el.id === rest.id ? { ...rest, unit: _unit } : rest
                  )))
                },
              }}
            />
            <Button
              className="bg-slate-950 text-white hover:bg-orange-300 hover:text-slate-950 aspect-square p-0"
              onClick={() => setNewIngredients(prev =>
                prev.filter(_el => _el.id !== el.id)
              )}
            >
              <IconSquareX className="size-5" />
            </Button>
          </div>
        )}
        {newIngredients.length ? (
          <Button
            onClick={handleCreate}
            className="bg-slate-950 text-white hover:bg-orange-300 hover:text-slate-950"
          >
            <IconDeviceFloppy className="mr-2 size-5" /> Save All
          </Button>
        ) : null
        }
      </div>
    </div>
  );
};