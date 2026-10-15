import type { ComponentProps } from 'react';
import { FieldError } from '@/components/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = Omit<ComponentProps<typeof Input>, 'id'> & {
  id: string;
  label: string;
  error?: string;
};

export function LabeledInput({ id, label, error, ...props }: Props) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={Boolean(error)} aria-describedby={`${id}-error`} {...props} />
      <FieldError id={`${id}-error`} errors={error ? [error] : []} />
    </div>
  );
}
