import { Link, useParams } from 'react-router-dom';

import { useRecipe } from '@/features/recipes/hooks/useRecipes';
import { RecipeUpdateForm } from '@/features/recipes/components/RecipeUpdateForm';
import { IngredientsList } from '@/features/recipes/components/IngredientsList';
import { IngredientAddForm } from '@/features/recipes/components/IngredientAddForm';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const recipeId = id ?? '';
  const { data: recipe, isLoading, error } = useRecipe(recipeId);

  if (!recipeId) return <p>Missing recipe id.</p>;
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p role="alert">Failed to load recipe.</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <section>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/recipes">← Back to recipes</Link>
            </li>
          </ul>
        </nav>

        <hgroup>
          <h2>Recipe</h2>
          <p>ID: {recipe.id}</p>
        </hgroup>
      </header>

      <article>
        <RecipeUpdateForm recipe={recipe} />
      </article>

      <article>
        <h2>Ingredients</h2>

        {/* List */}
        <div>
          <IngredientsList recipeId={recipeId} />
        </div>

        {/* Add form */}
        <div>
          <h3>Add ingredient</h3>
          <IngredientAddForm recipeId={recipeId} />
        </div>
      </article>
    </section>
  );
}
