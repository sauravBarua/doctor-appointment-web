'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FieldError } from '@/components/field-error';
import { ImageField } from '@/components/image-field';
import { LabeledInput } from '@/components/labeled-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { errorMessage } from '@/lib/api/errors';
import { fieldErrors } from '@/lib/form-errors';
import type { SessionUser } from '@/stores/session';
import { useUpdateProfile } from './hooks';
import { buildChanges, profileSchema } from './profile-changes';

export function ProfileForm({ user }: { user: SessionUser }) {
  const update = useUpdateProfile();
  const isDoctor = user.role === 'DOCTOR';
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imageKey, setImageKey] = useState(0); // remounting clears the file input after a save
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dirty = name.trim() !== user.name || (isDoctor && bio.trim() !== '') || image !== null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = profileSchema.safeParse({ name, bio });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    const changes = buildChanges(parsed.data, user, isDoctor);
    try {
      await update.mutateAsync({ changes, image });
      toast.success('Profil mis à jour');
      setName(parsed.data.name);
      setBio('');
      setImage(null);
      setImageKey((key) => key + 1);
    } catch {
      // Rendered below.
    }
  }

  return (
    <form noValidate onSubmit={(event) => void submit(event)} className="grid gap-5">
      <ImageField
        key={imageKey}
        id="pf-image"
        label="Photo de profil"
        currentUrl={user.image}
        file={image}
        onChange={setImage}
      />
      <LabeledInput
        id="pf-name"
        label="Nom complet"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <LabeledInput
        id="pf-email"
        label="Adresse e-mail"
        value={user.email}
        readOnly
        disabled
        aria-describedby="pf-email-hint"
      />
      <p id="pf-email-hint" className="text-muted-foreground -mt-3 text-xs">
        L’adresse e-mail ne peut pas être modifiée.
      </p>

      {isDoctor ? (
        <div className="grid gap-2">
          <Label htmlFor="pf-bio">Présentation</Label>
          <Textarea
            id="pf-bio"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Laissez vide pour conserver votre présentation actuelle."
            aria-describedby="pf-bio-error"
          />
          <FieldError id="pf-bio-error" errors={errors.bio ? [errors.bio] : []} />
          <p className="text-muted-foreground text-xs">Affichée aux patients sur votre fiche.</p>
        </div>
      ) : null}

      {update.error ? (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage(update.error)}</AlertDescription>
        </Alert>
      ) : null}

      <div>
        <Button type="submit" disabled={!dirty || update.isPending}>
          {update.isPending ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
    </form>
  );
}
