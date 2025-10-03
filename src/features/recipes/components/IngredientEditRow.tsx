import { useState } from 'react';
import type { Database } from '@/types/supabase.types';
import type { IngredientUpdateInput } from '@/features/recipes/schemas/recipeIngredients';

type Ingredient = Database['public']['Tables']['recipe_ingredients']['Row'];

interface IngredientEditRowProps {
  ingredient: Ingredient;
  onSave: (id: string, patch: IngredientUpdateInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export function IngredientEditRow({ ingredient, onSave, onDelete }: IngredientEditRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (patch: IngredientUpdateInput) => {
    setPending(true);
    setJustSaved(false);
    setError(null);

    try {
      await onSave(ingredient.id, patch);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
      setIsEditing(false);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
    } finally {
      setPending(false);
    }
  };

  if (!isEditing) {
    return (
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
        <div
          style={{
            flex: '1 1 16rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
          <strong>{ingredient.quantity}</strong> - {ingredient.unit && `${ingredient.unit}`} {ingredient.name}
          {ingredient.notes && (
            <div style={{ fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <small>{ingredient.notes}</small>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flex: '0 1 8rem' }}>
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>

          <button type="button" onClick={() => onDelete(ingredient.id)}>
            Delete
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const patch: IngredientUpdateInput = {
          name: (formData.get('name') as string) || '',
          quantity: Number(formData.get('quantity')),
          unit: (formData.get('unit') as string) || undefined,
          notes: (formData.get('notes') as string) || undefined,
        };
        handleSave(patch);
      }}>
      <fieldset role="group" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <label style={{ flex: '2 1 20rem' }}>
          Name
          <input type="text" name="name" defaultValue={ingredient.name || ''} required />
        </label>

        <div style={{ display: 'flex', gap: '1rem', flex: '1 1 16rem' }}>
          <label style={{ flex: '1 1 8rem' }}>
            Quantity
            <input type="number" name="quantity" defaultValue={ingredient.quantity || 1} min={1} required />
          </label>

          <label style={{ flex: '1 1 8rem' }}>
            Unit
            <input type="text" name="unit" defaultValue={ingredient.unit || ''} />
          </label>
        </div>
      </fieldset>

      <label>
        Notes
        <textarea name="notes" rows={3} defaultValue={ingredient.notes || ''} />
      </label>

      {pending && <small>Saving</small>}
      {justSaved && <small aria-live="polite">Saved</small>}
      {error && <small role="alert">{error}</small>}

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" disabled={pending}>
          Save
        </button>

        <button type="button" disabled={pending} onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
