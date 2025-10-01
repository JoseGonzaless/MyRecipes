import { Link } from 'react-router-dom';
import { RecipeCreateForm } from '@/features/recipes/components/RecipeCreateForm';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';

export function RecipesPage() {
  const { data, isLoading, error } = useRecipes();

  return (
    <main className="container">
      <h1>Recipes</h1>

      <RecipeCreateForm />

      {isLoading && <p>Loading…</p>}
      {error && <p>Error loading recipes.</p>}

      {!isLoading &&
        !error &&
        (data?.length ? (
          // this displays all recipes, but could be changed to cards or something in the future
          <ul>
            {data.map((recipe) => (
              <li key={recipe.id}>
                <strong>
                  <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
                </strong>
                {recipe.serving_size ? <> — servings: {String(recipe.serving_size)}</> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recipes yet — add your first one above.</p>
        ))}
    </main>
  );
}
