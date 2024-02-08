import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post as createInstructions } from "../../../api/instructions";
import * as dark from "../../../assets/icons/dark"
import CreateField from "./createField";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Create = ({ instructions }) => {

  // Retrieve recipeId from params
  const { recipeId } = useParams();

  // form fields for new instructions
  const [newInstructions, setNewInstructions] = useState([]);

  // If no instructions have been added already default to one empty field
  useEffect(() => {
    setNewInstructions((instructions?.length === 0) ? [{
      step: 1,
      description: "",
      recipeId
    }] : []);
  }, [instructions]);

  // Use query client to invalidate instruction query
  const queryClient = useQueryClient();

  // Add mutation invalidates get instructions
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createInstructions,
    onSuccess: () => {
      queryClient.invalidateQueries(['instructions'])
    },
  });

  const handleAddField = () => {
    setNewInstructions((prev) => [...prev, {
      step: newInstructions?.length + instructions?.length + 1,
      description: "",
      recipeId
    }]);
  };

  const handleCreate = async () => {
    await mutateAsync({ data: newInstructions });
  };


  return (
    <>
      {newInstructions?.map((el) => (
        <CreateField
          key={el.step}
          instruction={el}
          setNewInstructions={setNewInstructions}

        />
      ))
      }
      <div className="flex justify-center space-x-5">
        <button
          onClick={handleAddField}
          className="border-2 hover:border-orange-300 hover:bg-orange-300 border-slate-950"
        >
          <img src={dark.Add} alt="add field" />
        </button>
        <button
          onClick={handleCreate}
          className="border-2 hover:border-orange-300 hover:bg-orange-300 border-slate-950"
        >
          <img
            src={isPending ? dark.Refresh : dark.SaveFill}
            className={isPending ? "animate-spin" : ""}
            alt="save-icon"
          />
        </button>
      </div>
    </>
  )
}

export default Create