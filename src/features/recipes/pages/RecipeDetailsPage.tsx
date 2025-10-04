import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import type { Database } from '@/types/supabase.types';
import { useRecipe, useDeleteRecipe } from '@/features/recipes/hooks/useRecipes';
import { useRecipeIngredients } from '@/features/recipes/hooks/useRecipeIngredients';
import { RecipeDetailsView } from '@/features/recipes/components/RecipeDetailsView';
import { RecipeUpdateForm } from '@/features/recipes/components/RecipeUpdateForm';
import { ImageUploader } from '@/features/recipes/components/ImageUploader';
import { IngredientsDisplayView } from '@/features/recipes/components/IngredientsDisplayView';
import { IngredientsEditView } from '@/features/recipes/components/IngredientsEditView';
import { InstructionsDisplayView } from '@/features/recipes/components/InstructionsDisplayView';

type Recipe = Database['public']['Tables']['recipes']['Row'];
type RecipeMaybeInstructions = Recipe & { instructions?: string[] | null };

export function RecipeDetailPage() {
  const { id: recipeId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');

  const { data: recipe, isLoading: recipeLoading, error } = useRecipe(recipeId ?? '');

  const {
    data: ingredients = [],
    isLoading: ingredientsLoading,
    isError: ingredientsError,
  } = useRecipeIngredients(recipeId ?? '');

  const del = useDeleteRecipe();

  // ===== Guards =====
  if (!recipeId) return <p role="alert">Missing recipe id.</p>;
  if (recipeLoading) return <p>Loading</p>;
  if (error) return <p role="alert">Failed to load recipe.</p>;
  if (!recipe) return <p role="alert">Recipe not found.</p>;

  const instructions = (recipe as RecipeMaybeInstructions).instructions ?? null;

  async function handleDelete() {
    if (!recipe) return;
    if (!confirm('Delete this recipe? This cannot be undone.')) return;
    try {
      await del.mutateAsync(recipe.id);
      navigate('/recipes');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  return (
    <section>
      {/* ===== Header ===== */}
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/recipes">← Back to recipes</Link>
            </li>
          </ul>
        </nav>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem' }}>
          <hgroup>
            <h2>{recipe.name}</h2>
            <p>
              Serves: {recipe.serving_size} • {recipe.total_time ? `${recipe.total_time} min` : 'No time specified'}
            </p>
          </hgroup>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
            </button>

            <button type="button" onClick={handleDelete} disabled={del.isPending}>
              {del.isPending ? 'Deleting' : 'Delete'}
            </button>
          </div>
        </div>
      </header>

      {/* ===== Recipe Details (image + form/view) ===== */}
      <article>
        {/* Cover image: only in edit mode */}
        {isEditing && (
          <div>
            <h4>Cover Image</h4>

            <ImageUploader
              recipeId={recipe.id}
              ownerId={recipe.owner_id}
              imagePath={recipe.image_url}
              alt={recipe.name}
            />
          </div>
        )}

        {/* Recipe details: edit vs read */}
        <div>{isEditing ? <RecipeUpdateForm recipe={recipe} /> : <RecipeDetailsView recipe={recipe} />}</div>
      </article>

      {/* ===== Tabs: Ingredients / Instructions ===== */}
      <article>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button" role="tab" onClick={() => setActiveTab('ingredients')}>
            Ingredients
          </button>

          <button type="button" role="tab" onClick={() => setActiveTab('instructions')}>
            Instructions
          </button>
        </div>

        {activeTab === 'ingredients' ? (
          isEditing ? (
            <IngredientsEditView
              recipeId={recipeId}
              ingredients={ingredients}
              isLoading={ingredientsLoading}
              isError={ingredientsError}
            />
          ) : (
            <IngredientsDisplayView
              recipeId={recipeId}
              ingredients={ingredients}
              isLoading={ingredientsLoading}
              isError={ingredientsError}
            />
          )
        ) : (
          <InstructionsDisplayView instructions={instructions} />
        )}
      </article>
    </section>
  );
}
