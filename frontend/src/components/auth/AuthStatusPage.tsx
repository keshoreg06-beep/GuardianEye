import { useAuth } from '../../hooks/use-auth';

export function AuthStatusPage() {
  const { user, logout } = useAuth();

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-8">
      <h1 className="text-2xl font-semibold text-white">Session status</h1>
      <div className="mt-4 space-y-2 text-sm text-slate-300">
        <p>Email: {user?.email ?? 'Not signed in'}</p>
        <p>Role: {user?.role?.name ?? 'Unknown'}</p>
        <p>Active: {user?.is_active ? 'Yes' : 'No'}</p>
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-6 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
      >
        Logout
      </button>
    </div>
  );
}
