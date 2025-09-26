import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { RecipesPage } from "@/features/recipes/pages/RecipesPage";
import { PlannerPage } from "@/features/planner/pages/PlannerPage";
import { PantryPage } from "@/features/pantry/pages/PantryPage";
import { ShoppingPage } from "@/features/shopping/pages/ShoppingPage";
import AuthPage from "@/features/auth/pages/AuthPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <PlannerPage /> },
      { path: "recipes", element: <RecipesPage /> },
      { path: "pantry", element: <PantryPage /> },
      { path: "shopping", element: <ShoppingPage /> },
      { path: "auth", element: <AuthPage /> },
    ],
  },
]);
