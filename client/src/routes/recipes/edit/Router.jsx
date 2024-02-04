import { Route, Routes } from "react-router-dom";
import Index from "./Index";
import Description from "./Description";
import Instructions from "./Instructions";
import Ingredients from "./Ingredients";
import Components from "./Components";


const EditRouter = () => (
  <Routes>
    <Route
      path='/edit'
      element={<Index />}
    >
      <Route
        index
        element={<Description />}
      ></Route>
      <Route
        path="/edit/instructions"
        element={<Instructions />}
      ></Route>
      <Route
        path="/edit/ingredients"
        element={<Ingredients />}
      ></Route>
      <Route
        path="/edit/components"
        element={<Components />}
      ></Route>
    </Route>
  </Routes>
);

export default EditRouter;