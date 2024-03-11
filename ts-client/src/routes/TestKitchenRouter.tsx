import { Route, Routes } from "react-router-dom";

// components
import TestKitchen from "@/pages/test-kitchen/components";
import IterationFlow from "@/pages/test-kitchen/components/iteration-flow";

// authorisation
import { ProtectTestKitchenRoutes } from "./utility/ProtectTestKitchenRoutes";

export const TestKitchenRouter = () => (
  <Routes>
    <Route
      path='/'
      element={<TestKitchen />}
    >
      <Route
        element={<ProtectTestKitchenRoutes />}
      >
        <Route
          path='/:recipeId'
          element={<IterationFlow />}
        />
      </Route>
    </Route>
  </Routes>
);