import { useState } from "react"
import { editIteration } from "../../api/test-kitchen"
import { useMutation } from "@tanstack/react-query"
import Ingredients from "./ingredients";
import Instructions from "./preparations";

// Components
import Feedback from "./feedback";
import { IterationProps } from "../../@types/test-kitchen";


const FocusedIteration = ({ iteration, setNodes }: IterationProps) => {

  // Extract important variables iterationId and tag
  const { tag, id: iterationId } = iteration;

  // Mutate the selected iteration
  const { mutateAsync: editDescriptionMutation } = useMutation({
    mutationFn: editIteration
  });

  // Change description handler
  const changeDescriptionHandler = (value: string) => {

    // Update the global node flow value
    setNodes(prev => prev.map(({ data, ...rest }) => {
      if (data.id === iterationId) {
        return { ...rest, data: { ...data, tag: value } }
      } else {
        return { ...rest, data }
      };
    }));
  };

  const [display, setDisplay] = useState<string>('ingredients')

  function renderSwitch(display: string) {
    switch (display) {
      case 'ingredients':
        return (
          <Ingredients
            iteration={iteration}
            setNodes={setNodes}
          />
        );
      case 'instructions':
        return (
          <Instructions
            iteration={iteration}
            setNodes={setNodes}
          />
        );
      case 'comments':
        return (
          <Feedback
            iteration={iteration}
          />
        );
      case 'auth':
        return (
          <div></div>
        )
    }
  }

  return (
    <>
      <div className='text-lg font-bold flex border-b-2 border-slate-950'>
        #
        <input type='text'
          onBlur={() => editDescriptionMutation({
            input: { tag },
            iterationId,
          })}
          onChange={e => changeDescriptionHandler(e.target.value)}
          value={tag || ""}
          placeholder='add tag here'
          className='bg-transparent uppercase border-none grow text-lg font-bold focus:outline-none p-0 pl-1 overflow-hidden'
        />
      </div>
      <div className="flex justify-evenly space-x-5 py-2 border-b-2 border-slate-950">
        <button
          onClick={() => setDisplay('ingredients')}
          className={`border-b ${display === 'ingredients' ? 'border-slate-950' : 'border-transparent'}`}
        >
          Ingredients
        </button>
        <button
          onClick={() => setDisplay('instructions')}
          className={`border-b ${display === 'instructions' ? 'border-slate-950' : 'border-transparent'}`}
        >
          Instructions
        </button>
        <button
          onClick={() => setDisplay('comments')}
          className={`border-b ${display === 'comments' ? 'border-slate-950' : 'border-transparent'}`}
        >
          Comments
        </button>
        <button
          onClick={() => setDisplay('auth')}
          className={`border-b ${display === 'auth' ? 'border-slate-950' : 'border-transparent'}`}
        >
          Author
        </button>
      </div>
      <div className="flex flex-col pt-2 overflow-y-auto">
        {renderSwitch(display)}
      </div>
    </>
  );
};

export default FocusedIteration;