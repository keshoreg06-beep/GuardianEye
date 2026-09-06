import { useLocation } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AppRoutes } from '../routes';
import { useSessionStore } from '../stores/session-store';

export function AppShell() {
  const location = useLocation();
  const { isAuthenticated } = useSessionStore();
  const publicPaths = ['/login', '/unauthorized', '/session-expired'];
  const shouldUseLayout = isAuthenticated || publicPaths.includes(location.pathname);

  if (!shouldUseLayout) {
    return <AppRoutes />;
  }

  return (
    <AppLayout>
      <AppRoutes />
    </AppLayout>
  );
}
