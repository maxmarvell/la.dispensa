import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

// pages
import RootLayout from "@/pages/main/components/layout";
import DashboardLayout from "@/pages/dashboard/components/layout";
import { Profile } from "@/pages/profile/components";

import ErrorPage from "../pages/ErrorPage";
import Login from "../pages/auth/Login";

import Logout from "../pages/auth/Logout";
import Recipes from "@/pages/recipes/components";
import Register from "../pages/auth/Register";

// routes
import { RecipeRouter } from "./RecipeRouter";
import { TestKitchenRouter } from "./TestKitchenRouter";

// authorisation
import { RecipeRouteAuth } from "./utility/RecipeRoutes";
import { ProtectedRoutes } from "./utility/ProtectedRoutes";


export const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
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
        element={<RootLayout />}
        errorElement={<ErrorPage />}
      >
        <Route errorElement={<ErrorPage />}>
          <Route index element={<DashboardLayout />}></Route>
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
    </>
  )
);