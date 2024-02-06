import { Route, Routes } from "react-router-dom";
import Index from "./Index";
import Permissions from "./Permissions";
import AuthorRoutes from "../utility/AuthorRoutes";
import TestKitchen from "../test-kitchen/TestKitchen";
import Components from "./Components";
import Delete from "./Delete";

const RecipeRouter = () => (
  <Routes>
    <Route
      path='/:recipeId'
      element={<Index />}
    >
      <Route
        element={<AuthorRoutes />}
      >
        <Route
          path="/:recipeId/privacy"
          element={<Permissions />}
        ></Route>
        <Route
          path="/:recipeId/components"
          element={<Components />}
        ></Route>
        <Route
          path="/:recipeId/delete"
          element={<Delete />}
        ></Route>
      </Route>
    </Route>
    <Route
      path="/:recipeId/test-kitchen"
      element={<TestKitchen />}
    ></Route>

  </Routes>
);

export default RecipeRouter;