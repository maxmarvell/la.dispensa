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
import RecipeRoutes from './routes/recipes/Router';
import Register from './routes/auth/Register';
import './App.css';
import TestKitchen from './routes/recipes/TestKitchen';
import TestKitchenContainer from './routes/TestKitchen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path='/'
      element={<Root />}
      errorElement={<ErrorPage />}
    >
      <Route
        errorElement={<ErrorPage />}
      >
        <Route index element={<Dashboard />}></Route>
        <Route
          path='/login'
          element={<Login />}
        />
        <Route
          path='/register'
          element={<Register />}
        />
        <Route
          path='/users'
          element={<Users />}
        >
          <Route
            path='/users/:userId'
            element={<Profile />}
          />
        </Route>
        <Route
          element={<ProtectedRoutes />}
        >
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
            path='/test-kitchen'
            element={<TestKitchenContainer />}
          >
            <Route
              path='/test-kitchen/:recipeId'
              element={<TestKitchen />}
            />
          </Route>
          <Route
            path='/recipes'
            element={<Recipes />}
          />
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
