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

export default RecipeRouter;