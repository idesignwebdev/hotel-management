import { forwardRef } from 'react';

/**
 * Styled text input used in forms and search bars.
 */
const Input = forwardRef(({ className = '', ...rest }, ref) => (
  <input ref={ref} className={['booking-modal input', className].filter(Boolean).join(' ')} {...rest} />
));

Input.displayName = 'Input';
export default Input;
