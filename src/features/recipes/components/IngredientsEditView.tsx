import { IngredientAddForm } from '@/features/recipes/components/IngredientAddForm';
import { IngredientEditRow } from '@/features/recipes/components/IngredientEditRow';
import { useUpdateIngredient, useDeleteIngredient } from '@/features/recipes/hooks/useRecipeIngredients';
import type { IngredientUpdateInput } from '@/features/recipes/schemas/recipeIngredients';
import type { Database } from '@/types/supabase.types';

type Ingredient = Database['public']['Tables']['recipe_ingredients']['Row'];

interface IngredientsEditViewProps {
  recipeId: string;
  ingredients: Ingredient[];
  isLoading: boolean;
  isError: boolean;
}

export function IngredientsEditView({ recipeId, ingredients, isLoading, isError }: IngredientsEditViewProps) {
  const update = useUpdateIngredient(recipeId);
  const remove = useDeleteIngredient(recipeId);

  const handleSave = async (id: string, patch: IngredientUpdateInput) => {
    await update.mutateAsync({ id, patch });
  };

  const handleDelete = (id: string) => {
    remove.mutate(id);
  };

  if (isLoading) {
    return <p>Loading Ingredients</p>;
  }

  if (isError) {
    return <p role="alert">Failed to load ingredients.</p>;
  }

  return (
    <div>
      <h3>Ingredients</h3>

      {ingredients.length > 0 ? (
        <div>
          {ingredients.map((ingredient) => (
            <article key={ingredient.id} style={{ paddingBottom: '0rem' }}>
              <IngredientEditRow ingredient={ingredient} onSave={handleSave} onDelete={handleDelete} />
            </article>
          ))}
        </div>
      ) : (
        <p>No ingredients yet.</p>
      )}

      <div>
        <h4>Add Ingredient</h4>
        <IngredientAddForm recipeId={recipeId} />
      </div>
    </div>
  );
}
