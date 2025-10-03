import type { Database } from '@/types/supabase.types';

type Recipe = Database['public']['Tables']['recipes']['Row'];

interface RecipeDetailsViewProps {
  recipe: Recipe;
}

export function RecipeDetailsView({ recipe }: RecipeDetailsViewProps) {
  return (
    <div>
      <h3>Recipe Details</h3>

      <p>
        <strong>Name:</strong> {recipe.name}
      </p>

      <p>
        <strong>Serving Size:</strong> {recipe.serving_size}
      </p>

      <p>
        <strong>Total Time:</strong> {recipe.total_time ? `${recipe.total_time} minutes` : 'N/A'}
      </p>

      {recipe.notes && (
        <p>
          <strong>Notes:</strong>
          <div style={{ whiteSpace: 'pre-wrap', marginLeft: '1rem' }}>{recipe.notes}</div>
        </p>
      )}
    </div>
  );
}
