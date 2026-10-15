'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { TableCell } from '@/components/ui/table';
import { DoctorAvatar } from '@/features/catalog/doctor-avatar';
import { parseFilters } from '@/features/catalog/filters';
import { useCatalogParams } from '@/features/catalog/use-catalog-params';
import type { AdminClinic } from '@/lib/api/schemas/admin';
import { SITE } from '@/config/site';
import { clinics } from './api';
import { AdminList } from './admin-list';
import { clinicFormSchema } from './clinic-form';
import { fieldErrors } from './form-errors';
import { FormBody, FormDialog } from './form-dialog';
import { useAdminClinics, useRemove, useSave, useToggleActive } from './hooks';
import { ImageField } from './image-field';
import { LabeledInput } from './labeled-input';
import { RowActions } from './row-actions';
import { StatusBadge } from './status-badge';

interface FormState {
  clinic?: AdminClinic;
}

export function ClinicsAdmin() {
  const { searchParams } = useCatalogParams();
  const { page, q } = parseFilters(searchParams);
  const list = useAdminClinics({ page, search: q });
  const { toggle, isPending } = useToggleActive(clinics);
  const remove = useRemove(clinics);
  const [form, setForm] = useState<FormState | null>(null);
  const [deleting, setDeleting] = useState<AdminClinic | null>(null);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success('Clinique supprimée');
      setDeleting(null);
    } catch {
      // Rendered by the dialog.
    }
  }

  return (
    <>
      <AdminList
        query={list}
        getId={(item) => item.id}
        columns={['Clinique', 'Adresse', 'Fuseau horaire', 'Statut']}
        addLabel="Ajouter une clinique"
        onAdd={() => setForm({})}
        searchLabel="Rechercher une clinique"
        searchPlaceholder="Nom de la clinique"
        emptyTitle="Aucune clinique"
        emptyDescription="Aucune clinique ne correspond à cette recherche."
        renderCells={(item) => (
          <>
            <TableCell>
              <div className="flex items-center gap-3">
                <DoctorAvatar name={item.name} image={item.imageUrl} className="size-9" />
                <span className="font-medium">{item.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {item.address}
              <span className="block text-xs">{item.city}</span>
            </TableCell>
            <TableCell className="text-muted-foreground">{item.timezone}</TableCell>
            <TableCell>
              <StatusBadge active={item.isActive} />
            </TableCell>
            <TableCell>
              <RowActions
                name={item.name}
                isActive={item.isActive}
                pending={isPending}
                onEdit={() => setForm({ clinic: item })}
                onToggle={() => toggle(item.id, !item.isActive)}
                onDelete={() => setDeleting(item)}
              />
            </TableCell>
          </>
        )}
      />

      <FormDialog open={form !== null} onClose={() => setForm(null)}>
        {form ? (
          <ClinicForm
            key={form.clinic?.id ?? 'new'}
            clinic={form.clinic}
            onClose={() => setForm(null)}
          />
        ) : null}
      </FormDialog>

      <ConfirmDialog
        open={deleting !== null}
        title={`Supprimer « ${deleting?.name ?? ''} » ?`}
        description="Cette action est définitive. Si la clinique est utilisée, désactivez-la plutôt."
        confirmLabel="Supprimer"
        pending={remove.isPending}
        error={remove.error}
        onConfirm={() => void confirmDelete()}
        onClose={() => {
          setDeleting(null);
          remove.reset();
        }}
      />
    </>
  );
}

function ClinicForm({ clinic, onClose }: { clinic?: AdminClinic; onClose: () => void }) {
  const save = useSave(clinics);
  const [values, setValues] = useState({
    name: clinic?.name ?? '',
    city: clinic?.city ?? '',
    address: clinic?.address ?? '',
    timezone: clinic?.timezone ?? SITE.timezone,
  });
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = clinicFormSchema.safeParse(values);
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    try {
      await save.mutateAsync({ id: clinic?.id, values: parsed.data, image });
      toast.success(clinic ? 'Clinique modifiée' : 'Clinique créée');
      onClose();
    } catch {
      // Rendered by the form body.
    }
  }

  return (
    <FormBody
      title={clinic ? 'Modifier la clinique' : 'Nouvelle clinique'}
      description="Les horaires des médecins sont toujours exprimés dans le fuseau de la clinique."
      submitLabel={clinic ? 'Enregistrer' : 'Créer'}
      pending={save.isPending}
      error={save.error}
      onSubmit={(event) => void submit(event)}
      onClose={onClose}
    >
      <LabeledInput
        id="cl-name"
        label="Nom"
        value={values.name}
        onChange={set('name')}
        error={errors.name}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <LabeledInput
          id="cl-city"
          label="Ville"
          value={values.city}
          onChange={set('city')}
          error={errors.city}
        />
        <LabeledInput
          id="cl-tz"
          label="Fuseau horaire"
          value={values.timezone}
          onChange={set('timezone')}
          error={errors.timezone}
        />
      </div>
      <LabeledInput
        id="cl-address"
        label="Adresse"
        value={values.address}
        onChange={set('address')}
        error={errors.address}
      />
      <ImageField
        id="cl-image"
        label="Photo (facultatif)"
        currentUrl={clinic?.imageUrl ?? null}
        file={image}
        onChange={setImage}
      />
    </FormBody>
  );
}
