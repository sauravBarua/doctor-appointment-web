'use client';

import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  defaultValue: string;
  onSearch: (value: string) => void;
  label: string;
  placeholder: string;
}

// Uncontrolled on purpose: the parent changes `key` to reset it.
export function SearchBox({ defaultValue, onSearch, label, placeholder }: Props) {
  const [text, setText] = useState(defaultValue);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const latest = useRef(onSearch);

  useEffect(() => {
    latest.current = onSearch;
  });
  useEffect(() => () => clearTimeout(timer.current), []);

  function change(next: string) {
    setText(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => latest.current(next.trim()), 350);
  }

  return (
    <div className="relative">
      <Label htmlFor="catalog-search" className="sr-only">
        {label}
      </Label>
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden
      />
      <Input
        id="catalog-search"
        type="search"
        value={text}
        onChange={(event) => change(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="pl-9"
      />
    </div>
  );
}
