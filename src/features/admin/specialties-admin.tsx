'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { TableCell } from '@/components/ui/table';
import { DoctorAvatar } from '@/features/catalog/doctor-avatar';
import { parseFilters } from '@/features/catalog/filters';
import { useCatalogParams } from '@/features/catalog/use-catalog-params';
import type { AdminSpecialty } from '@/lib/api/schemas/admin';
import { specialties } from './api';
import { AdminList } from './admin-list';
import { fieldErrors } from './form-errors';
import { FormBody, FormDialog } from './form-dialog';
import { useAdminSpecialties, useRemove, useSave, useToggleActive } from './hooks';
import { ImageField } from './image-field';
import { LabeledInput } from './labeled-input';
import { RowActions } from './row-actions';
import { StatusBadge } from './status-badge';

const schema = z.object({ name: z.string().trim().min(2).max(80) });

interface FormState {
  specialty?: AdminSpecialty;
}

export function SpecialtiesAdmin() {
  const { searchParams } = useCatalogParams();
  const { page, q } = parseFilters(searchParams);
  const list = useAdminSpecialties({ page, search: q });
  const { toggle, isPending } = useToggleActive(specialties);
  const remove = useRemove(specialties);
  const [form, setForm] = useState<FormState | null>(null);
  const [deleting, setDeleting] = useState<AdminSpecialty | null>(null);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success('Spécialité supprimée');
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
        columns={['Spécialité', 'Statut']}
        addLabel="Ajouter une spécialité"
        onAdd={() => setForm({})}
        searchLabel="Rechercher une spécialité"
        searchPlaceholder="Nom de la spécialité"
        emptyTitle="Aucune spécialité"
        emptyDescription="Aucune spécialité ne correspond à cette recherche."
        renderCells={(item) => (
          <>
            <TableCell>
              <div className="flex items-center gap-3">
                <DoctorAvatar name={item.name} image={item.iconUrl} className="size-9" />
                <span className="font-medium">{item.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge active={item.isActive} />
            </TableCell>
            <TableCell>
              <RowActions
                name={item.name}
                isActive={item.isActive}
                pending={isPending}
                onEdit={() => setForm({ specialty: item })}
                onToggle={() => toggle(item.id, !item.isActive)}
                onDelete={() => setDeleting(item)}
              />
            </TableCell>
          </>
        )}
      />

      <FormDialog open={form !== null} onClose={() => setForm(null)}>
        {form ? (
          <SpecialtyForm
            key={form.specialty?.id ?? 'new'}
            specialty={form.specialty}
            onClose={() => setForm(null)}
          />
        ) : null}
      </FormDialog>

      <ConfirmDialog
        open={deleting !== null}
        title={`Supprimer « ${deleting?.name ?? ''} » ?`}
        description="Cette action est définitive. Si la spécialité est utilisée, désactivez-la plutôt."
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

function SpecialtyForm({
  specialty,
  onClose,
}: {
  specialty?: AdminSpecialty;
  onClose: () => void;
}) {
  const save = useSave(specialties);
  const [name, setName] = useState(specialty?.name ?? '');
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ name });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    try {
      await save.mutateAsync({ id: specialty?.id, values: parsed.data, image });
      toast.success(specialty ? 'Spécialité modifiée' : 'Spécialité créée');
      onClose();
    } catch {
      // Rendered by the form body.
    }
  }

  return (
    <FormBody
      title={specialty ? 'Modifier la spécialité' : 'Nouvelle spécialité'}
      description="Le nom est affiché aux patients dans le catalogue."
      submitLabel={specialty ? 'Enregistrer' : 'Créer'}
      pending={save.isPending}
      error={save.error}
      onSubmit={(event) => void submit(event)}
      onClose={onClose}
    >
      <LabeledInput
        id="sp-name"
        label="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      <ImageField
        id="sp-image"
        label="Icône (facultatif)"
        currentUrl={specialty?.iconUrl ?? null}
        file={image}
        onChange={setImage}
      />
    </FormBody>
  );
}
