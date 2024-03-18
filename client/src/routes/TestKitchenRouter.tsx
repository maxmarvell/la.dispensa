import { Route, Routes } from "react-router-dom";

// components
import Index from "../pages/test-kitchen/Index";
import TestKitchen from "../pages/test-kitchen/TestKitchen";

// authorisation
import { ProtectTestKitchenRoutes } from "./utility/ProtectTestKitchenRoutes";

export const TestKitchenRouter = () => (
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