import { supabase } from '@/config/supabase';
import type { Database } from '@/types/supabase.types';

type RecipeRow = Database['public']['Tables']['recipes']['Row'];
type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];

export async function listRecipes(): Promise<RecipeRow[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createRecipe(
  input: Pick<RecipeInsert, 'name' | 'serving_size'>
): Promise<RecipeRow> {
  const { data, error } = await supabase.from('recipes').insert(input).select().single();
  if (error) throw new Error(error.message);
  return data;
}
