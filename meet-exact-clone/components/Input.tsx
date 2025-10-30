import { InputHTMLAttributes, forwardRef } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function InputComponent(
  { label, hint, error, id, className = '', ...props },
  ref
) {
  const inputId = id || props.name || undefined;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block">
          {label}
        </label>
      )}
      <input id={inputId} ref={ref} className={`input-base ${error ? 'border-red-500' : ''} ${className}`.trim()} {...props} />
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});


