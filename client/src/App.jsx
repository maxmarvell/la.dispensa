import ErrorPage from './ErrorPage';
import Root from './routes/Root';
import Login from './routes/auth/Login';
import Dashboard from './routes/Dashboard';
import Profile from './routes/Profile';
import Logout from './routes/auth/Logout';
import Recipes from './routes/Recipes';
import Register from './routes/auth/Register';

import TestKitchenRoutes from "./routes/test-kitchen/Router"
import RecipeRoutes from './routes/recipe/Router';

import ProtectedRoutes from './routes/utility/ProtectedRoutes';
import RecipeRouteAuth from './routes/utility/RecipeRoutes';

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css';

const router = createBrowserRouter(
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
              element={<RecipeRoutes />}
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
              element={<TestKitchenRoutes />}
            />
          </Route>
        </Route>
      </Route>

    </Route>
  )
)

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
