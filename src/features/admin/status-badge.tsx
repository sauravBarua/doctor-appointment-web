import { Badge } from '@/components/ui/badge';

export function StatusBadge({ active }: { active: boolean }) {
  return <Badge variant={active ? 'secondary' : 'outline'}>{active ? 'Actif' : 'Inactif'}</Badge>;
}
