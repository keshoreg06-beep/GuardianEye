import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl border border-white/10 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20', className)}
      {...props}
    />
  ),
);

Card.displayName = 'Card';
