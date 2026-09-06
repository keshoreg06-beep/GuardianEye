import { cn } from '../../utils/cn';
import { RiskLevel, designTokens } from '../../styles/design-tokens';

export interface RiskPulseProps {
  level: RiskLevel;
  active?: boolean;
  className?: string;
}

export function RiskPulse({ level, active = true, className }: RiskPulseProps) {
  const tone = designTokens.semantic[level.toLowerCase() as keyof typeof designTokens.semantic];

  return (
    <span className={cn('flex items-center gap-2', className)}>
      <span
        className="inline-flex h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: tone.color,
          boxShadow: active ? `0 0 0 6px ${tone.bg}` : 'none',
        }}
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-300">{tone.label}</span>
    </span>
  );
}
