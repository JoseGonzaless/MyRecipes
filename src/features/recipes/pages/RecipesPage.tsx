import { Link } from 'react-router-dom';

import { RecipeCreateForm } from '@/features/recipes/components/RecipeCreateForm';
import { useRecipes } from '@/features/recipes/hooks/useRecipes';

export function RecipesPage() {
  const { data, isLoading, error } = useRecipes();

  return (
    <main className="container">
      <h1>Recipes</h1>

      {isLoading && <p>Loading</p>}
      {error && <p role="alert">Error loading recipes.</p>}

      {!isLoading && !error && (
        <>
          {data?.length ? (
            <section
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 50%), 1fr))',
                gap: '1rem',
              }}>
              {data.map((recipe) => (
                <article key={recipe.id}>
                  <header>
                    <h4>
                      <Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link>
                    </h4>
                  </header>

                  <p>
                    <strong>Servings:</strong> {recipe.serving_size ? recipe.serving_size : '—'}
                  </p>
                  <p>
                    <strong>Total Time:</strong> {recipe.total_time ? recipe.total_time : '—'}
                  </p>
                </article>
              ))}
            </section>
          ) : (
            <p>No recipes yet — add your first one above.</p>
          )}
        </>
      )}

      <RecipeCreateForm />
    </main>
  );
}
