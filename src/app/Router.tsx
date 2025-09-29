import { createBrowserRouter, Navigate } from 'react-router-dom';

import RequireAuth from '@/app/guards/RequireAuth';
import RequireGuest from '@/app/guards/RequireGuest';
import PublicLayout from '@/components/layout/PublicLayout';
import PrivateLayout from '@/components/layout/PrivateLayout';

import { AuthPage } from '@/features/auth/pages/AuthPage';
import { UpdatePasswordPage } from '@/features/auth/pages/UpdatePasswordPage';
import { PlannerPage } from '@/features/planner/pages/PlannerPage';
import { RecipesPage } from '@/features/recipes/pages/RecipesPage';
import { PantryPage } from '@/features/pantry/pages/PantryPage';
import { ShoppingPage } from '@/features/shopping/pages/ShoppingPage';

export const router = createBrowserRouter([
  // PUBLIC / AUTH
  {
    element: <RequireGuest />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <Navigate to="/auth" replace /> },
          { path: '/auth', element: <AuthPage /> },
        ],
      },
    ],
  },

  // PRIVATE
  {
    element: <RequireAuth />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: '/recipes', element: <RecipesPage /> },
          { path: '/planner', element: <PlannerPage /> },
          { path: '/pantry', element: <PantryPage /> },
          { path: '/shopping', element: <ShoppingPage /> },
          { path: '/update-password', element: <UpdatePasswordPage /> },
        ],
      },
    ],
  },
]);
