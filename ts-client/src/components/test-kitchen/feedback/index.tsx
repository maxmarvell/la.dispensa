// components
import { Comments } from "./comments";
import { Rating } from "./rating";

// types
import { IterationType } from "../../../@types/test-kitchen";

const index = ({ iteration }: { iteration: IterationType }) => {
  return (
    <div className="flex flex-col">
      <Comments iteration={iteration} />
      <Rating iteration={iteration} />
    </div>
  );
};

export default index;