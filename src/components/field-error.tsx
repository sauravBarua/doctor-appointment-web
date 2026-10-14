export function FieldError({ id, errors }: { id: string; errors: unknown[] }) {
  const messages = errors
    .map((error) =>
      typeof error === 'string' ? error : (error as { message?: string } | null)?.message,
    )
    .filter((message): message is string => Boolean(message));
  if (messages.length === 0) return null;
  return (
    <p id={id} role="alert" className="text-destructive text-sm">
      {messages[0]}
    </p>
  );
}
