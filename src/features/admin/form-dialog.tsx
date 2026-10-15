'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { errorMessage } from '@/lib/api/errors';

// The form body is mounted only while open, so its state resets every time.
export function FormDialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        {open ? children : null}
      </DialogContent>
    </Dialog>
  );
}

interface BodyProps {
  title: string;
  description: string;
  submitLabel: string;
  pending: boolean;
  error: unknown;
  onSubmit: (event: React.FormEvent) => void;
  onClose: () => void;
  children: React.ReactNode;
}

export function FormBody({
  title,
  description,
  submitLabel,
  pending,
  error,
  onSubmit,
  onClose,
  children,
}: BodyProps) {
  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {children}
      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{errorMessage(error)}</AlertDescription>
        </Alert>
      ) : null}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? 'Enregistrement…' : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
