import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useRecipe, useDeleteRecipe } from '@/features/recipes/hooks/useRecipes';
import { RecipeUpdateForm } from '@/features/recipes/components/RecipeUpdateForm';
import { ImageUploader } from '@/features/recipes/components/ImageUploader';
import { IngredientsList } from '@/features/recipes/components/IngredientsList';
import { IngredientAddForm } from '@/features/recipes/components/IngredientAddForm';
import type { Database } from '@/types/supabase.types';

type Recipe = Database['public']['Tables']['recipes']['Row'];
type RecipeMaybeInstructions = Recipe & { instructions?: string[] | null };

// Recipe details view component
function RecipeDetailsView({ recipe }: { recipe: RecipeMaybeInstructions }) {
  return (
    <div>
      <h3>Recipe Details</h3>
      <p>
        <strong>Name:</strong> {recipe.name}{' '}
      </p>
      <p>
        <strong>Serving Size:</strong> {recipe.serving_size}
      </p>
      <p>
        <strong>Total Time:</strong> {recipe.total_time ? `${recipe.total_time} minutes` : 'Not specified'}
      </p>
      {recipe.notes && (
        <p>
          <strong>Notes:</strong> <div style={{ whiteSpace: 'pre-wrap', marginLeft: '1rem' }}>{recipe.notes} </div>
        </p>
      )}
    </div>
  );
}

export function RecipeDetailPage() {
  const { id: recipeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  const { data: recipe, isLoading, error } = useRecipe(recipeId ?? '');
  const del = useDeleteRecipe();

  if (!recipeId) return <p role="alert">Missing recipe id.</p>;
  if (isLoading) return <p>Loading</p>;
  if (error) return <p role="alert">Failed to load recipe.</p>;
  if (!recipe) return <p role="alert">Recipe not found.</p>;

  async function handleDelete() {
    if (!recipe) return;
    if (!confirm('Delete this recipe? This cannot be undone.')) return;

    try {
      await del.mutateAsync(recipe.id);
      navigate('/recipes');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }

  return (
    <section>
      {/* Header with navigation and actions */}
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/recipes">← Back to recipes</Link>
            </li>
          </ul>
        </nav>

        <hgroup>
          <h2>{recipe.name}</h2>
          <p>
            Serves: {recipe.serving_size} • {recipe.total_time ? `${recipe.total_time} min` : 'No time specified'}
          </p>
        </hgroup>

        <button type="button" onClick={() => setIsEditing(!isEditing)} style={{ marginRight: '1rem' }}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>

        <button type="button" onClick={handleDelete} disabled={del.isPending}>
          {del.isPending ? 'Deleting' : 'Delete'}
        </button>
      </header>

      {/* Main content */}
      <article>
        {/* Image section */}
        <div>
          <h3>Cover Image</h3>
          <ImageUploader
            recipeId={recipe.id}
            ownerId={recipe.owner_id}
            imagePath={recipe.image_url}
            alt={recipe.name}
          />
        </div>

        {/* Recipe details - view or edit mode */}
        <div>{isEditing ? <RecipeUpdateForm recipe={recipe} /> : <RecipeDetailsView recipe={recipe} />}</div>
      </article>

      {/* Mobile-first tabs: Ingredients / Instructions */}
      <article>
        <div>
          <button type="button" onClick={() => setActiveTab('ingredients')} style={{ marginRight: '1rem' }}>
            Ingredients
          </button>

          <button type="button" onClick={() => setActiveTab('instructions')}>
            Instructions
          </button>
        </div>

        {activeTab === 'ingredients' ? (
          <div>
            <h2>Ingredients</h2>

            <div>
              <IngredientsList recipeId={recipeId} />
            </div>

            <div>
              <h3>Add Ingredient</h3>
              <IngredientAddForm recipeId={recipeId} />
            </div>
          </div>
        ) : (
          <div>
            <h2>Instructions</h2>

            {Array.isArray((recipe as RecipeMaybeInstructions).instructions) &&
            ((recipe as RecipeMaybeInstructions).instructions as string[]).length > 0 ? (
              <ol>
                {((recipe as RecipeMaybeInstructions).instructions as string[]).map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            ) : (
              <p>No instructions yet.</p>
            )}
          </div>
        )}
      </article>
    </section>
  );
}
