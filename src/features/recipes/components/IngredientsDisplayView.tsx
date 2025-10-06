import type { Database } from '@/types/supabase.types';

import { IngredientAddForm } from './IngredientAddForm';

type Ingredient = Database['public']['Tables']['recipe_ingredients']['Row'];

interface IngredientsDisplayViewProps {
  recipeId: string;
  ingredients: Ingredient[];
  isLoading: boolean;
  isError: boolean;
}

export function IngredientsDisplayView({ recipeId, ingredients, isLoading, isError }: IngredientsDisplayViewProps) {
  if (isLoading) {
    return <p>Loading Ingredients</p>;
  }

  if (isError) {
    return <p role="alert">Failed to load ingredients.</p>;
  }

  return (
    <section>
      <h3>Ingredients</h3>

      {ingredients.length > 0 ? (
        <ul>
          {ingredients.map((ingredient) => (
            <li key={ingredient.id}>
              <strong>{ingredient.quantity}</strong>
              {ingredient.unit} {ingredient.name}
              {ingredient.notes && (
                <div style={{ fontStyle: 'italic' }}>
                  <small>{ingredient.notes}</small>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No ingredients yet.</p>
      )}

      <div>
        <h4>Add Ingredient</h4>
        <IngredientAddForm recipeId={recipeId} />
      </div>
    </section>
  );
}
