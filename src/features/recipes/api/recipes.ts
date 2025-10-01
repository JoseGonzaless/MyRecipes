import { supabase } from '@/config/supabase';
import type { Database } from '@/types/supabase.types';

type Recipe = Database['public']['Tables']['recipes']['Row'];
type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];
type RecipeUpdate = Database['public']['Tables']['recipes']['Update'];

export async function listRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase.from('recipes').select('*').order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createRecipe(input: Pick<RecipeInsert, 'name' | 'serving_size'>): Promise<Recipe> {
  const { data, error } = await supabase.from('recipes').insert(input).select().single();

  if (error) throw new Error(error.message);
  return data!;
}

export async function getRecipe(id: string): Promise<Recipe> {
  const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);
  return data!;
}

export async function updateRecipe(id: string, patch: Pick<RecipeUpdate, 'name' | 'serving_size'>): Promise<Recipe> {
  const { data, error } = await supabase.from('recipes').update(patch).eq('id', id).select('*').single();

  if (error) throw new Error(error.message);
  return data!;
}
