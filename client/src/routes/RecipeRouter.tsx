import { Route, Routes } from "react-router-dom";

// pages
import Index from "../pages/recipe/Index";
import Permissions from "../pages/recipe/Permissions";
import TestKitchen from "../pages/test-kitchen/TestKitchen";
import Components from "../pages/recipe/Components";
import Delete from "../pages/recipe/Delete";

// authorisation
import { AuthorRoutes } from "./utility/AuthorRoutes";

export const RecipeRouter = () => (
  <Routes>
    <Route
      path='/'
      element={<Index />}
    >
      <Route
        element={<AuthorRoutes />}
      >
        <Route
          path="/privacy"
          element={<Permissions />}
        ></Route>
        <Route
          path="/components"
          element={<Components />}
        ></Route>
        <Route
          path="/delete"
          element={<Delete />}
        ></Route>
      </Route>
    </Route>
    <Route
      path="/test-kitchen"
      element={<TestKitchen />}
    ></Route>

  </Routes>
);