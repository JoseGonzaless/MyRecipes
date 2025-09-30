import { RecipeCreateForm } from '../components/RecipeCreateForm';
import { useRecipes } from '../hooks/useRecipes';

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
          <ul>
            {data.map((recipe) => (
              <li key={recipe.id}>
                <strong>{recipe.name}</strong>
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
