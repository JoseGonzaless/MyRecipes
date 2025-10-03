import type { Database } from '@/types/supabase.types';

type Ingredient = Database['public']['Tables']['recipe_ingredients']['Row'];

interface IngredientsDisplayViewProps {
  ingredients: Ingredient[];
  isLoading: boolean;
  isError: boolean;
}

export function IngredientsDisplayView({ ingredients, isLoading, isError }: IngredientsDisplayViewProps) {
  if (isLoading) return <p>Loading Ingredients</p>;
  if (isError) return <p role="alert">Failed to load ingredients.</p>;
  if (ingredients.length === 0) return <p>No ingredients yet.</p>;

  return (
    <div>
      <h3>Ingredients</h3>

      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            <strong>{ingredient.quantity}</strong> - {ingredient.unit && `${ingredient.unit}`} {ingredient.name}
            {ingredient.notes && (
              <div style={{ fontStyle: 'italic' }}>
                <small>{ingredient.notes}</small>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
