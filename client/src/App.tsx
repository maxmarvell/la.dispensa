import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './routes/AppRouter';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={AppRouter} />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
