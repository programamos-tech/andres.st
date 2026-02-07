export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg)]">
      <div
        className="w-10 h-10 rounded-full border-2 border-[var(--border)] border-t-[var(--accent)] animate-spin"
        aria-hidden
      />
      <p className="text-[var(--text-muted)] text-sm">Cargando...</p>
    </div>
  );
}
