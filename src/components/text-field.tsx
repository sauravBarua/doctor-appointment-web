'use client';

import type { AnyFieldApi } from '@tanstack/react-form';
import type { ComponentProps } from 'react';
import { FieldError } from '@/components/field-error';
import { PasswordInput } from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = Omit<ComponentProps<typeof Input>, 'id' | 'name' | 'value' | 'onChange' | 'onBlur'> & {
  field: AnyFieldApi;
  label: string;
  password?: boolean;
  hint?: string;
  transform?: (value: string) => string;
};

export function TextField({
  field,
  label,
  password = false,
  hint,
  transform,
  type,
  ...rest
}: Props) {
  const id = field.name;
  const invalid = field.state.meta.errors.length > 0;
  const common = {
    ...rest,
    id,
    name: id,
    value: String(field.state.value ?? ''),
    onBlur: field.handleBlur,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      field.handleChange(transform ? transform(event.target.value) : event.target.value),
    'aria-invalid': invalid,
    'aria-describedby': `${id}-error`,
  };
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {password ? <PasswordInput {...common} /> : <Input {...common} type={type} />}
      {hint && !invalid ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
      <FieldError id={`${id}-error`} errors={field.state.meta.errors} />
    </div>
  );
}
