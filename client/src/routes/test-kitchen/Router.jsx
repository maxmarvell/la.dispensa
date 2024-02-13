import { Route, Routes } from "react-router-dom";
import Index from "./Index";
import TestKitchen from "./TestKitchen";
import ProtectTestKitchenRoutes from "../utility/ProtectTestKitchenRoutes";

const RecipeRouter = () => (
  <Routes>
    <Route
      path='/'
      element={<Index />}
    >
      <Route
        element={<ProtectTestKitchenRoutes />}
      >
        <Route
          path='/:recipeId'
          element={<TestKitchen />}
        />
      </Route>
    </Route>
  </Routes>
);

export default RecipeRouter;