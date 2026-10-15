'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { FieldError } from '@/components/field-error';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { AdminDoctor } from '@/lib/api/schemas/admin';
import { doctors } from './api';
import { fieldErrors } from '@/lib/form-errors';
import { FormBody, FormDialog } from './form-dialog';
import { useClinicOptions, useCreateDoctor, useSave, useSpecialtyOptions } from './hooks';
import { ImageField } from '@/components/image-field';
import { LabeledInput } from '@/components/labeled-input';

export interface DoctorFormState {
  doctor?: AdminDoctor;
}
export interface CreatedDoctor {
  name: string;
  email: string;
  temporaryPassword: string | null;
}

const createSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  clinicId: z.string().min(1, 'Choisissez une clinique.'),
  specialtyId: z.string().min(1, 'Choisissez une spécialité.'),
  bio: z.string().trim().max(1000),
});
const editSchema = createSchema.pick({ specialtyId: true, bio: true });

interface Option {
  id: string;
  name: string;
}

function OptionSelect({
  id,
  label,
  value,
  options,
  placeholder,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: Option[];
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="w-full"
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-error`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError id={`${id}-error`} errors={error ? [error] : []} />
    </div>
  );
}

export function DoctorFormDialog({
  state,
  onClose,
  onCreated,
}: {
  state: DoctorFormState | null;
  onClose: () => void;
  onCreated: (created: CreatedDoctor) => void;
}) {
  return (
    <FormDialog open={state !== null} onClose={onClose}>
      {state ? (
        <DoctorForm
          key={state.doctor?.id ?? 'new'}
          doctor={state.doctor}
          onClose={onClose}
          onCreated={onCreated}
        />
      ) : null}
    </FormDialog>
  );
}

function DoctorForm({
  doctor,
  onClose,
  onCreated,
}: {
  doctor?: AdminDoctor;
  onClose: () => void;
  onCreated: (created: CreatedDoctor) => void;
}) {
  const create = useCreateDoctor();
  const update = useSave(doctors);
  const specialties = useSpecialtyOptions();
  const clinics = useClinicOptions();
  const [values, setValues] = useState({
    name: '',
    email: '',
    clinicId: '',
    specialtyId: doctor?.specialty.id ?? '',
    bio: doctor?.bio ?? '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const mutation = doctor ? update : create;

  // An inactive specialty is not in the dropdown list but must still show as selected.
  const specialtyOptions = specialties.data ?? [];
  const withCurrent =
    doctor && !specialtyOptions.some((option) => option.id === doctor.specialty.id)
      ? [doctor.specialty, ...specialtyOptions]
      : specialtyOptions;

  const set =
    (key: 'name' | 'email' | 'bio') =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    try {
      if (doctor) {
        const parsed = editSchema.safeParse(values);
        if (!parsed.success) return setErrors(fieldErrors(parsed.error));
        setErrors({});
        await update.mutateAsync({
          id: doctor.id,
          values: { specialtyId: parsed.data.specialtyId, bio: parsed.data.bio || null },
          image,
        });
        toast.success('Médecin modifié');
        onClose();
        return;
      }
      const parsed = createSchema.safeParse(values);
      if (!parsed.success) return setErrors(fieldErrors(parsed.error));
      setErrors({});
      const { bio, ...rest } = parsed.data;
      const result = await create.mutateAsync({
        values: { ...rest, bio: bio || undefined },
        image,
      });
      onCreated({
        name: rest.name,
        email: rest.email,
        temporaryPassword: result.temporaryPassword ?? null,
      });
    } catch {
      // Rendered by the form body.
    }
  }

  return (
    <FormBody
      title={doctor ? 'Modifier le médecin' : 'Nouveau médecin'}
      description={
        doctor
          ? `${doctor.user.name} · ${doctor.user.email} · ${doctor.clinic.name}`
          : 'Un compte est créé avec un mot de passe temporaire envoyé par e-mail.'
      }
      submitLabel={doctor ? 'Enregistrer' : 'Créer le médecin'}
      pending={mutation.isPending}
      error={mutation.error}
      onSubmit={(event) => void submit(event)}
      onClose={onClose}
    >
      {doctor ? null : (
        <>
          <LabeledInput
            id="dr-name"
            label="Nom complet"
            value={values.name}
            onChange={set('name')}
            error={errors.name}
          />
          <LabeledInput
            id="dr-email"
            label="Adresse e-mail"
            type="email"
            autoComplete="off"
            value={values.email}
            onChange={set('email')}
            error={errors.email}
          />
          <OptionSelect
            id="dr-clinic"
            label="Clinique"
            placeholder="Choisir une clinique"
            value={values.clinicId}
            options={clinics.data ?? []}
            error={errors.clinicId}
            onChange={(clinicId) => setValues((current) => ({ ...current, clinicId }))}
          />
        </>
      )}
      <OptionSelect
        id="dr-specialty"
        label="Spécialité"
        placeholder="Choisir une spécialité"
        value={values.specialtyId}
        options={withCurrent}
        error={errors.specialtyId}
        onChange={(specialtyId) => setValues((current) => ({ ...current, specialtyId }))}
      />
      <div className="grid gap-2">
        <Label htmlFor="dr-bio">Présentation (facultatif)</Label>
        <Textarea
          id="dr-bio"
          rows={4}
          value={values.bio}
          onChange={set('bio')}
          aria-describedby="dr-bio-error"
        />
        <FieldError id="dr-bio-error" errors={errors.bio ? [errors.bio] : []} />
      </div>
      <ImageField
        id="dr-image"
        label="Photo (facultatif)"
        currentUrl={doctor?.user.image ?? null}
        file={image}
        onChange={setImage}
      />
    </FormBody>
  );
}
