// components
import Feedback from "./feedback";
import Ingredients from "./ingredients";
import Instructions from "./preparations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DrawerHeader } from "@/components/ui/drawer";

// services
import { useIteration } from "../../hooks/useIteration";

// types
import { IterationProps } from "../../models";


export const EditIteration = ({ iteration, setNodes }: IterationProps) => {

  // Extract important variables iterationId and tag
  const { tag, id: iterationId } = iteration;

  // Mutate the selected iteration
  const { updateIteration } = useIteration();

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

  return (
    <Tabs defaultValue="ingredients" className="w-full">
      <DrawerHeader className="p-0 absolute top-0 right-5 left-5 overflow-hidden z-50 bg-slate-50">
        <div className='text-lg font-bold flex border-b-2 border-slate-950'>
          #
          <input type='text'
            onBlur={() => updateIteration({
              input: { tag },
              iterationId,
            })}
            onChange={e => changeDescriptionHandler(e.target.value)}
            value={tag || ""}
            placeholder='add tag here'
            className='bg-transparent uppercase border-none grow text-lg font-bold focus:outline-none p-0 pl-1 overflow-hidden'
          />
        </div>
        <TabsList className="flex justify-evenly space-x-5 py-2">
          <TabsTrigger value="ingredients" className="grow">Ingredients</TabsTrigger>
          <TabsTrigger value="instructions" className="grow">Instructions</TabsTrigger>
          <TabsTrigger value="comments" className="grow">Comments</TabsTrigger>
          <TabsTrigger value="author" className="grow">Author</TabsTrigger>
        </TabsList>
      </DrawerHeader>
      <div className="flex flex-col pt-16 overflow-y-scroll">
        <TabsContent value="ingredients"><Ingredients
          iteration={iteration}
          setNodes={setNodes}
        /></TabsContent>
        <TabsContent value="instructions"><Instructions
          iteration={iteration}
          setNodes={setNodes}
        /></TabsContent>
        <TabsContent value="comments"><Feedback
          iteration={iteration}
        /></TabsContent>
        <TabsContent value="author"><div></div></TabsContent>
      </div>
    </Tabs>
  );
};

export default EditIteration;