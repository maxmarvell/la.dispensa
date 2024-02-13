import { Comments } from "./comments";
import { Rating } from "./rating";

const index = ({ iteration }) => {
  return (
    <div className="flex flex-col">
      <Comments iteration={iteration} />
      <Rating iteration={iteration} />
    </div>
  );
};

export default index;