'use client';

import { ImagePlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FieldError } from '@/components/field-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024; // client-side guess; the API is the real judge

function problemWith(file: File): string | null {
  if (!TYPES.includes(file.type)) return 'Format accepté : JPEG, PNG ou WebP.';
  if (file.size > MAX_BYTES) return 'L’image ne doit pas dépasser 5 Mo.';
  return null;
}

interface Props {
  id: string;
  label: string;
  currentUrl: string | null;
  file: File | null;
  onChange: (file: File | null) => void;
}

export function ImageField({ id, label, currentUrl, file, onChange }: Props) {
  const [problem, setProblem] = useState<string | null>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const shown = preview ?? currentUrl;

  function pick(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.files?.[0] ?? null;
    const issue = next ? problemWith(next) : null;
    setProblem(issue);
    if (issue) event.target.value = '';
    onChange(issue ? null : next);
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        {shown ? <AvatarImage src={shown} alt="" /> : null}
        <AvatarFallback>
          <ImagePlus className="text-muted-foreground size-5" aria-hidden />
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 gap-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          type="file"
          accept={TYPES.join(',')}
          onChange={pick}
          aria-describedby={`${id}-hint`}
        />
        {problem ? (
          <FieldError id={`${id}-hint`} errors={[problem]} />
        ) : (
          <p id={`${id}-hint`} className="text-muted-foreground text-xs">
            JPEG, PNG ou WebP, 5 Mo maximum.
          </p>
        )}
      </div>
    </div>
  );
}
