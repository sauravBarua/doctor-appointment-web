import { SITE } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <p>Tous les horaires sont affichés à l’heure de Paris ({SITE.timezone}).</p>
      </div>
    </footer>
  );
}
