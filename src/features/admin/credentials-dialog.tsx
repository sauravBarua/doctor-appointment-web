'use client';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CreatedDoctor } from './doctor-form';

export function CredentialsDialog({
  info,
  onClose,
}: {
  info: CreatedDoctor | null;
  onClose: () => void;
}) {
  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copié');
    } catch {
      toast.error('Copie impossible. Sélectionnez le texte manuellement.');
    }
  }

  return (
    <Dialog open={info !== null} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogContent>
        {info ? (
          <>
            <DialogHeader>
              <DialogTitle>Médecin créé</DialogTitle>
              <DialogDescription>
                {info.name} ({info.email}) peut se connecter. Le mot de passe temporaire lui a été
                envoyé par e-mail.
              </DialogDescription>
            </DialogHeader>
            {info.temporaryPassword ? (
              <div className="grid gap-2">
                <Label htmlFor="temp-password">Mot de passe temporaire</Label>
                <div className="flex gap-2">
                  <Input
                    id="temp-password"
                    readOnly
                    value={info.temporaryPassword}
                    className="font-mono"
                    onFocus={(event) => event.currentTarget.select()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void copy(info.temporaryPassword ?? '')}
                  >
                    Copier
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  Affiché une seule fois. Le médecin devra le changer à sa première connexion.
                </p>
              </div>
            ) : null}
            <DialogFooter>
              <Button onClick={onClose}>Terminé</Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
