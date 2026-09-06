export function UnauthorizedPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 p-8 text-center">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300">Access denied</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-300">You do not have permission to access this area.</p>
      </div>
    </div>
  );
}
