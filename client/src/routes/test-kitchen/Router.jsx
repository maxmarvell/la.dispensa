import { Route, Routes } from "react-router-dom";
import Index from "./Index";
import TestKitchen from "./TestKitchen";

const RecipeRouter = () => (
  <Routes>
    <Route
      path='/'
      element={<Index />}
    >
      <Route
        path='/:recipeId'
        element={<TestKitchen />}
      />
    </Route>
  </Routes>
);

export default RecipeRouter;