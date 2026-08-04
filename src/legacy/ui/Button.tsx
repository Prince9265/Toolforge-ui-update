import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-700 shadow-sm shadow-primary/20',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-muted',
  outline:
    'border border-border bg-transparent hover:bg-muted hover:text-foreground',
  ghost: 'bg-transparent hover:bg-muted',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm shadow-destructive/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
