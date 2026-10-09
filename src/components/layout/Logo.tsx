import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Incartion home">
      <span className="grid h-9 w-9 place-items-center rounded-md bg-brand text-lg font-black text-primary-foreground shadow-card">
        I
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-lg font-black tracking-tight">INCARTION</span>
          <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Uniforms · Bulk</span>
        </span>
      )}
    </Link>
  );
}
