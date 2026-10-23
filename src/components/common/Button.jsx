import { forwardRef } from 'react';

/**
 * Reusable button with the HavenDesk visual tokens.
 * Variants: primary | ghost | text | cancel | icon
 */
const Button = forwardRef(({ className = '', variant = 'primary', children, disabled, type = 'button', ...rest }, ref) => {
  const base = 'border-0 rounded font-semibold text-[var(--font)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition';
  const variants = {
    primary: 'primary-button',
    ghost: 'select-button',
    text: 'text-link',
    cancel: 'cancel-button',
    icon: 'icon-button',
  };
  return (
    <button ref={ref} type={type} disabled={disabled} className={[base, variants[variant], className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
