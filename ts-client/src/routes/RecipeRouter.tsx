import { Route, Routes } from "react-router-dom";

// pages
import { Recipe } from "@/pages/recipe/components";
import { Components } from "@/pages/recipe/recipe-components/components";
import { Permissions } from "@/pages/recipe/recipe-permissions/components";
import { Delete } from "@/pages/recipe/recipe-delete/components";
import TestKitchen from "@/pages/test-kitchen/components";

// authorisation
import { AuthorRoutes } from "./utility/AuthorRoutes";

export const RecipeRouter = () => (
  <Routes>
    <Route
      path='/'
      element={<Recipe />}
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