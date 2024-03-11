// components
import { Comments } from "./comments";
import { Rating } from "./rating";

// types
import { IterationFeedbackProps } from "@/pages/test-kitchen/models";

export const Feedback = ({ iteration }: IterationFeedbackProps) => {
  return (
    <div className="flex flex-col">
      <Comments iteration={iteration} />
      <Rating iteration={iteration} />
    </div>
  );
};

export default Feedback;