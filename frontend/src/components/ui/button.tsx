import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'default' | 'secondary' | 'ghost' | 'outline';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50';

    const variants: Record<ButtonVariant, string> = {
      default: 'bg-blue-600 text-white hover:bg-blue-500',
      secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
      outline: 'border border-white/10 bg-transparent text-slate-200 hover:bg-white/5',
      ghost: 'text-slate-200 hover:bg-white/5',
    };

    return <button ref={ref} className={cn(base, variants[variant], className)} {...props} />;
  },
);

Button.displayName = 'Button';
