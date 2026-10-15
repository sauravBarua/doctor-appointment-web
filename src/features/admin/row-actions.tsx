import { Pencil, Power, PowerOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  name: string;
  isActive: boolean;
  pending: boolean;
  onEdit: () => void;
  onToggle: () => void;
  onDelete?: () => void;
}

export function RowActions({ name, isActive, pending, onEdit, onToggle, onDelete }: Props) {
  const toggleLabel = `${isActive ? 'Désactiver' : 'Activer'} ${name}`;
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Modifier ${name}`}
        title="Modifier"
        onClick={onEdit}
      >
        <Pencil className="size-4" aria-hidden />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label={toggleLabel}
        title={toggleLabel}
        disabled={pending}
        onClick={onToggle}
      >
        {isActive ? (
          <PowerOff className="size-4" aria-hidden />
        ) : (
          <Power className="size-4" aria-hidden />
        )}
      </Button>
      {onDelete ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Supprimer ${name}`}
          title="Supprimer"
          onClick={onDelete}
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}
