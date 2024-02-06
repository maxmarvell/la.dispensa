import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from 'react-router-dom'
import ErrorPage from './ErrorPage';
import Root from './routes/Root';
import Login from './routes/auth/Login';
import { AuthProvider } from './context/auth';
import Users from './routes/users/Users';
import ProtectedRoutes from './routes/utility/ProtectedRoutes';
import Dashboard from './routes/Dashboard';
import Profile from './routes/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Logout from './routes/auth/Logout';
import Recipes from './routes/Recipes';
import Register from './routes/auth/Register';
import TestKitchen from './routes/test-kitchen/TestKitchen';
import TestKitchenContainer from './routes/test-kitchen/Index';

import TestKitchenRoutes from "./routes/test-kitchen/Router"
import RecipeRoutes from './routes/recipe/Router';

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
            path='/users'
            element={<Users />}
          >
            <Route
              path='/users/:userId'
              element={<Profile />}
            />
          </Route>
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
              path='/recipes/*'
              element={<RecipeRoutes />}
            />
            
            <Route
              path='/test-kitchen/*'
              element={<TestKitchenRoutes />}
            />
            <Route
              path='/recipes'
              element={<Recipes />}
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
