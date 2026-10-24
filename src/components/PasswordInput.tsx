import { useState, type ComponentPropsWithoutRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './PasswordInput.css';

type PasswordInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'> & {
  id: string;
};

const PasswordInput = ({ id, className, ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleLabel = isVisible ? 'Hide password' : 'Show password';

  return (
    <div className="password-field">
      <input
        {...props}
        id={id}
        className={['password-field__input', className].filter(Boolean).join(' ')}
        type={isVisible ? 'text' : 'password'}
      />
      <button
        type="button"
        className="password-field__toggle"
        aria-label={toggleLabel}
        aria-controls={id}
        title={toggleLabel}
        onClick={() => setIsVisible((visible) => !visible)}
      >
        {isVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
      </button>
    </div>
  );
};

export default PasswordInput;
