import { forwardRef } from 'react';

/**
 * Styled native select used in forms.
 */
const Select = forwardRef(({ className = '', ...rest }, ref) => (
  <select ref={ref} className={['booking-modal select', className].filter(Boolean).join(' ')} {...rest} />
));

Select.displayName = 'Select';
export default Select;
