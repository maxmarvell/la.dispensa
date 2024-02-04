import { useState } from "react"
import { editIteration } from "../../api/test-kitchen"
import { useMutation } from "@tanstack/react-query"
import Ingredients from "./ingredients";
import Instructions from "./instructions";
import Comments from "./comments";


const FocusedIteration = ({ iteration, setNodes }) => {

  // Extract important variables iterationId and tag
  const { tag, id: iterationId } = iteration;

  // Mutate the selected iteration
  const { mutateAsync: editDescriptionMutation } = useMutation({
    mutationFn: editIteration
  });

  // Change description handler
  const changeDescriptionHandler = (value) => {

    // Update the global node flow value
    setNodes((prev) => (prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        return { ...rest, data: { ...data, tag: value } }
      } else {
        return { ...rest, data }
      };
    })));
  };

  const [display, setDisplay] = useState('ingredients')

  function renderSwitch(display) {
    switch (display) {
      case 'ingredients':
        return (
          <Ingredients
            iteration={iteration}
            setNodes={setNodes}
          />
        )
      case 'instructions':
        return (
          <Instructions
            iteration={iteration}
            setNodes={setNodes}
          />
        )
      case 'comments':
        return (
          <Comments
            iteration={iteration}
          />
        )
    }
  }

  return (
    <>
      <div className='text-lg font-bold flex'>
        #
        <input type='text'
          onBlur={() => editDescriptionMutation({
            input: { tag },
            iterationId,
          })}
          onChange={e => changeDescriptionHandler(e.target.value)}
          value={tag || ""}
          placeholder='add tag here'
          className='bg-transparent border-none grow text-lg font-bold focus:outline-none p-0 pl-1 overflow-hidden'
        />
      </div>
      <div className="flex flex-col grow space-y-2 pt-2">
        <div className="flex justify-evenly space-x-5">
          <button
            onClick={() => setDisplay('ingredients')}
            className={`border-b border-transparent ${display === 'ingredients' ? 'border-slate-50' : ''}`}
          >
            Ingredients
          </button>
          <button
            onClick={() => setDisplay('instructions')}
            className={`border-b border-transparent ${display === 'instructions' ? 'border-slate-50' : ''}`}
          >
            Instructions
          </button>
          <button
            onClick={() => setDisplay('comments')}
            className={`border-b border-transparent ${display === 'comments' ? 'border-slate-50' : ''}`}
          >
            Comments
          </button>
        </div>
        <div className="flex flex-col grow">
          {renderSwitch(display)}
        </div>
      </div>
    </>
  );
};

export default FocusedIteration;