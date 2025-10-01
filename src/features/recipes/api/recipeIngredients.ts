import { supabase } from '@/config/supabase';
import type { Database } from '@/types/supabase.types';
import type { IngredientCreateInput, IngredientUpdateInput } from '@/features/recipes/schemas/recipeIngredients';

type Ingredient = Database['public']['Tables']['recipe_ingredients']['Row'];
type IngredientInsert = Database['public']['Tables']['recipe_ingredients']['Insert'];
type IngredientUpdate = Database['public']['Tables']['recipe_ingredients']['Update'];

export async function listIngredients(recipeId: string): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .eq('recipe_id', recipeId)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function insertIngredient(recipeId: string, values: IngredientCreateInput): Promise<Ingredient> {
  const payload: Omit<IngredientInsert, 'owner_id'> = {
    recipe_id: recipeId,
    name: values.name,
    quantity: values.quantity ?? 0,
    unit: values.unit,
    notes: values.notes,
  };

  const { data, error } = await supabase.from('recipe_ingredients').insert(payload).select('*').single();

  if (error) throw new Error(error.message);
  return data!;
}

export async function updateIngredient(id: string, patch: IngredientUpdateInput): Promise<Ingredient> {
  const updatePayload: Partial<IngredientUpdate> = {
    ...(patch.name !== undefined ? { name: patch.name } : {}),
    ...(patch.quantity !== undefined ? { quantity: patch.quantity } : {}),
    ...(patch.unit !== undefined ? { unit: patch.unit ?? null } : {}),
    ...(patch.notes !== undefined ? { notes: patch.notes ?? null } : {}),
  };

  const { data, error } = await supabase
    .from('recipe_ingredients')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data!;
}

export async function deleteIngredient(id: string): Promise<void> {
  const { error } = await supabase.from('recipe_ingredients').delete().eq('id', id);

  if (error) throw new Error(error.message);
}
