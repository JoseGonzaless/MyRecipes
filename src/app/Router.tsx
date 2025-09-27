import { createBrowserRouter, Navigate } from "react-router-dom";

import RequireAuth from "@/app/routes/RequireAuth";
import RequireGuest from "@/app/routes/RequireGuest";
import PublicLayout from "@/components/layout/PublicLayout";
import PrivateLayout from "@/components/layout/PrivateLayout";

import { AuthPage } from "@/features/auth/pages/AuthPage";
import { PlannerPage } from "@/features/planner/pages/PlannerPage";
import { RecipesPage } from "@/features/recipes/pages/RecipesPage";
import { PantryPage } from "@/features/pantry/pages/PantryPage";
import { ShoppingPage } from "@/features/shopping/pages/ShoppingPage";

export const router = createBrowserRouter([
  {
    element: <RequireGuest />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: "/", element: <Navigate to="/auth" replace /> },
          { path: "/auth", element: <AuthPage /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: "/recipes", element: <RecipesPage /> },
          { path: "/planner", element: <PlannerPage /> },
          { path: "/pantry", element: <PantryPage /> },
          { path: "/shopping", element: <ShoppingPage /> },
        ],
      },
    ],
  },
]);
