import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { useSessionStore } from '../stores/session-store';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { user, clearSession } = useSessionStore();

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex">
      <Sidebar alertCount={0} onOpenCopilot={() => undefined} user={user} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header
          openAlertsCount={0}
          onOpenCopilot={() => undefined}
          onOpenAlertsModal={() => undefined}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex-1 mt-16 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
