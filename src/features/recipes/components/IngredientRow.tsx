import { memo, useCallback, useState } from 'react';
import type { Database } from '@/types/supabase.types';
import {
  ingredientUpdateSchema,
  type IngredientUpdateInput,
  type IngredientUpdateFormValues,
} from '@/features/recipes/schemas/recipeIngredients';

type Ingredient = Database['public']['Tables']['recipe_ingredients']['Row'];

export default memo(function IngredientRow({
  row,
  onSave,
  onDelete,
}: {
  row: Ingredient;
  onSave: (id: string, patch: IngredientUpdateInput) => Promise<void> | void;
  onDelete: (id: string) => void;
}) {
  const [pending, setPending] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lightweight client-side guards for friendlier messages
  function validateLocal(patch: IngredientUpdateFormValues): string | null {
    if (patch.name !== undefined && patch.name.trim().length === 0) return 'Name is required';
    if (patch.quantity !== undefined && Number(patch.quantity) < 1) return 'Quantity must be at least 1';
    return null;
  }

  const send = useCallback(
    async (patchIn: IngredientUpdateFormValues) => {
      const localError = validateLocal(patchIn);
      if (localError) {
        setError(localError);
        return;
      }

      setPending(true);
      setJustSaved(false);
      setError(null);

      try {
        const payload: IngredientUpdateInput = ingredientUpdateSchema.parse(patchIn);

        if (Object.keys(payload).length === 0) {
          setPending(false);
          return;
        }

        await onSave(row.id, payload);
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 1500);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to save');
      } finally {
        setPending(false);
      }
    },
    [onSave, row.id]
  );

  return (
    <div>
      <p>
        {pending && <small>Saving</small>}
        {justSaved && <small aria-live="polite"> Saved</small>}
        {error && <small role="alert">{error}</small>}
      </p>

      <div role="group" style={{ gap: '2rem' }}>
        <InlineEditableText
          key={`name-${row.id}-${row.name ?? ''}`}
          label="Name"
          value={row.name ?? ''}
          onChange={(v) => send({ name: v })}
        />

        <InlineEditableNumber
          key={`qty-${row.id}-${row.quantity ?? 1}`}
          label="Quantity"
          value={row.quantity ?? 1}
          min={1}
          onChange={(v) => send({ quantity: v })}
        />

        <InlineEditableText
          key={`unit-${row.id}-${row.unit ?? ''}`}
          label="Unit"
          value={row.unit ?? ''}
          onChange={(v) => send({ unit: v })}
        />
      </div>

      <InlineEditableTextarea
        key={`notes-${row.id}-${row.notes ?? ''}`}
        label="Notes"
        value={row.notes ?? ''}
        onChange={(v) => send({ notes: v })}
        rows={3}
      />

      <button type="button" onClick={() => onDelete(row.id)} disabled={pending}>
        Delete
      </button>
    </div>
  );
});

function InlineEditableText({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue' | 'type'>) {
  return (
    <label>
      {label}
      <input
        type="text"
        defaultValue={value}
        onBlur={(e) => {
          const next = e.currentTarget.value;
          if (next !== value) onChange(next);
        }}
        {...props}
      />
    </label>
  );
}

function InlineEditableNumber({
  label,
  value,
  min = 1,
  onChange,
  ...props
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (next: number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue' | 'type' | 'min'>) {
  return (
    <label>
      {label}
      <input
        type="number"
        defaultValue={String(value)}
        min={min}
        inputMode="numeric"
        onBlur={(e) => {
          const raw = e.currentTarget.value;
          const next = raw === '' ? min : Number(raw);
          if (next !== value) onChange(next);
        }}
        {...props}
      />
    </label>
  );
}

function InlineEditableTextarea({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'defaultValue'>) {
  return (
    <label>
      {label}
      <textarea
        defaultValue={value}
        onBlur={(e) => {
          const next = e.currentTarget.value;
          if (next !== value) onChange(next);
        }}
        {...props}
      />
    </label>
  );
}
