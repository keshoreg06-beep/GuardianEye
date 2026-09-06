import { Link } from 'react-router-dom';

export function SessionExpiredPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-red-300">Session expired</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Please sign in again</h1>
        <p className="mt-2 text-sm text-slate-300">Your access token has expired or is no longer valid.</p>
        <Link to="/login" className="mt-6 inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500">
          Return to login
        </Link>
      </div>
    </div>
  );
}
