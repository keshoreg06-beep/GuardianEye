import React, { useEffect, useState } from 'react';
import {
  Bell,
  CheckCircle,
  Search,
  Sparkles,
  Terminal,
} from 'lucide-react';
import type { AuthUser } from '../../types/auth';

interface HeaderProps {
  openAlertsCount: number;
  onOpenCopilot: () => void;
  onOpenAlertsModal: () => void;
  user: AuthUser | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  openAlertsCount,
  onOpenCopilot,
  onOpenAlertsModal,
  user,
  onLogout,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC',
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/10 px-8 flex items-center justify-between fixed top-0 right-0 left-64 z-20">
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKUs, incident codes, zone tags, tracks..."
            className="w-full bg-[#111827] border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="font-mono text-xs text-gray-400 bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span>{timeStr}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>ZERO DRIFT DETECTED</span>
        </div>

        {user ? (
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200">
            <span className="font-medium text-white">{user.full_name}</span>
            <span className="ml-2 text-slate-400">{user.role?.name ?? 'Operator'}</span>
          </div>
        ) : null}

        <button
          onClick={onOpenAlertsModal}
          className="relative p-2 rounded-lg bg-[#111827] border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all"
        >
          <Bell className="w-4 h-4" />
          {openAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
              {openAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenCopilot}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-medium hover:bg-blue-600/30 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Ask Copilot</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </header>
  );
};
