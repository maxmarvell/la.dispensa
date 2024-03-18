import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

// pages
import ErrorPage from "../ErrorPage";
import Root from "../pages/Root";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Logout from "../pages/auth/Logout";
import Recipes from "../pages/Recipes";
import Register from "../pages/auth/Register";

// routes
import { RecipeRouter } from "./RecipeRouter";
import { TestKitchenRouter } from "./TestKitchenRouter";

// authorisation
import { RecipeRouteAuth } from "./utility/RecipeRoutes";
import { ProtectedRoutes } from "./utility/ProtectedRoutes";


export const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path='/'
    >
      <Route
        path='/login'
        element={<Login />}
      />
      <Route
        path='/register'
        element={<Register />}
      />
      <Route
        path='/'
        element={<Root />}
        errorElement={<ErrorPage />}
      >
        <Route errorElement={<ErrorPage />}>
          <Route index element={<Dashboard />}></Route>
          <Route
            element={<RecipeRouteAuth />}
          >
            <Route
              path='/recipes/:recipeId/*'
              element={<RecipeRouter />}
            />
          </Route>
          <Route
              path='/recipes'
              element={<Recipes />}
            />
          <Route element={<ProtectedRoutes />}>
            <Route
              path='/logout'
              element={<Logout />}
            />
            <Route
              path='/profile/:userId'
              element={<Profile />}
            />
            <Route
              path='/test-kitchen/*'
              element={<TestKitchenRouter />}
            />
          </Route>
        </Route>
      </Route>

    </Route>
  )
);