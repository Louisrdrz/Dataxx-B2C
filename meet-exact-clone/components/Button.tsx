import Link from 'next/link';
import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ children, className = '', variant = 'primary', ...props }: PropsWithChildren<ButtonProps>) {
  const classes = `${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`.trim();
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

type LinkButtonProps = PropsWithChildren<{
  href: string;
  variant?: Variant;
  className?: string;
}>;

export function LinkButton({ href, children, variant = 'primary', className = '' }: LinkButtonProps) {
  const classes = `${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`.trim();
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}


