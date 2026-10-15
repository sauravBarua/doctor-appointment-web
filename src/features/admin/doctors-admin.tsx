'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableCell } from '@/components/ui/table';
import { DoctorAvatar } from '@/features/catalog/doctor-avatar';
import { parseFilters } from '@/features/catalog/filters';
import { useCatalogParams } from '@/features/catalog/use-catalog-params';
import { doctors } from './api';
import { AdminList } from './admin-list';
import { CredentialsDialog } from './credentials-dialog';
import { DoctorFormDialog, type CreatedDoctor, type DoctorFormState } from './doctor-form';
import { useAdminDoctors, useClinicOptions, useSpecialtyOptions, useToggleActive } from './hooks';
import { RowActions } from './row-actions';
import { StatusBadge } from './status-badge';

const ALL = 'all';

function FilterSelect({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  allLabel: string;
  value: string | undefined;
  options: { id: string; name: string }[];
  onChange: (value: string | undefined) => void;
}) {
  return (
    <Select
      value={value ?? ALL}
      onValueChange={(next) => onChange(next === ALL ? undefined : next)}
    >
      <SelectTrigger aria-label={label} className="w-full sm:w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function DoctorsAdmin() {
  const { searchParams, update } = useCatalogParams();
  const { page, q, specialtyId, clinicId } = parseFilters(searchParams);
  const list = useAdminDoctors({ page, search: q, specialtyId, clinicId });
  const specialties = useSpecialtyOptions();
  const clinics = useClinicOptions();
  const { toggle, isPending } = useToggleActive(doctors);
  const [form, setForm] = useState<DoctorFormState | null>(null);
  const [created, setCreated] = useState<CreatedDoctor | null>(null);

  return (
    <>
      <AdminList
        query={list}
        getId={(item) => item.id}
        columns={['Médecin', 'Spécialité', 'Clinique', 'Statut']}
        addLabel="Ajouter un médecin"
        onAdd={() => setForm({})}
        searchLabel="Rechercher un médecin"
        searchPlaceholder="Nom du médecin"
        emptyTitle="Aucun médecin"
        emptyDescription="Aucun médecin ne correspond à ces critères."
        filters={
          <>
            <FilterSelect
              label="Filtrer par spécialité"
              allLabel="Toutes les spécialités"
              value={specialtyId}
              options={specialties.data ?? []}
              onChange={(value) => update({ specialtyId: value })}
            />
            <FilterSelect
              label="Filtrer par clinique"
              allLabel="Toutes les cliniques"
              value={clinicId}
              options={clinics.data ?? []}
              onChange={(value) => update({ clinicId: value })}
            />
          </>
        }
        renderCells={(item) => (
          <>
            <TableCell>
              <div className="flex items-center gap-3">
                <DoctorAvatar name={item.user.name} image={item.user.image} className="size-9" />
                <div className="grid">
                  <span className="font-medium">{item.user.name}</span>
                  <span className="text-muted-foreground text-xs">{item.user.email}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>{item.specialty.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {item.clinic.name}
              <span className="block text-xs">{item.clinic.city}</span>
            </TableCell>
            <TableCell>
              <StatusBadge active={item.isActive} />
            </TableCell>
            <TableCell>
              <RowActions
                name={item.user.name}
                isActive={item.isActive}
                pending={isPending}
                onEdit={() => setForm({ doctor: item })}
                onToggle={() => toggle(item.id, !item.isActive)}
              />
            </TableCell>
          </>
        )}
      />

      <DoctorFormDialog
        state={form}
        onClose={() => setForm(null)}
        onCreated={(info) => {
          setForm(null);
          setCreated(info);
        }}
      />
      <CredentialsDialog info={created} onClose={() => setCreated(null)} />
    </>
  );
}
