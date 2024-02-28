import { IterationProps } from "../../../@types/test-kitchen";
import { CreatePreparations } from "./createPreparations";
import { UpdatePreparations } from "./updatePreparations";

const Instructions = ({ iteration, setNodes }: IterationProps) => {

  const { instructions, id } = iteration;

  if (instructions.length === 0) {
    return (
      <>
        <div className="pb-3">
          No instructions have been added to this recipe yet,
          <br />
          Use the form below to add the first
        </div>
        <CreatePreparations instructions={instructions} iterationId={id} setNodes={setNodes} />
      </>
    );
  };

  return (
    <div className="flex flex-col divide-y divide-black">
      <UpdatePreparations instructions={instructions} setNodes={setNodes} iterationId={id} />
      <CreatePreparations instructions={instructions} setNodes={setNodes} iterationId={id} />
    </div>
  );
};

export default Instructions