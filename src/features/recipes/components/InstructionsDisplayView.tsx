interface InstructionsDisplayViewProps {
  instructions?: string[] | null;
}

export function InstructionsDisplayView({ instructions }: InstructionsDisplayViewProps) {
  const steps = Array.isArray(instructions) ? instructions : [];

  return (
    <div>
      <h3>Instructions</h3>

      {steps.length > 0 ? (
        <ol>
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      ) : (
        <p>No instructions yet.</p>
      )}
    </div>
  );
}
