import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Badge = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-200', className)}
      {...props}
    />
  ),
);

Badge.displayName = 'Badge';
