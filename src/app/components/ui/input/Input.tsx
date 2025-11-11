import { Eye, EyeOff, Search, X } from 'lucide-react';
import React, { ChangeEvent, FocusEvent, forwardRef, KeyboardEvent, useState } from 'react'

export interface InputProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string | null;
  helper?: string | null;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  validate?: (value: string) => string | null;
  className?: string;
  maxLength?: number;
  variant?: "default" | "search";
  onEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

const baseInputClasses =
  "block w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition";

export const Input: React.FC<InputProps> = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    id,
    name,
    label,
    value,
    onChange,
    onBlur,
    placeholder,
    type = "text",
    required = false,
    disabled = false,
    readOnly = false,
    error: externalError = null,
    helper = null,
    prefix = null,
    suffix = null,
    icon = null,
    clearable = false,
    showPasswordToggle = false,
    validate = null,
    className = "",
    maxLength,
    onEnter,
    variant = "default",
    ...rest
  } = props;

  const [internalValue, setInternalValue] = useState<string>(value ?? "");
  const isControlled = typeof value !== "undefined";
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);


  React.useEffect(() => {
    if (isControlled) setInternalValue(value ?? "");
  }, [value]);


  const currentError = externalError ?? localError;


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!isControlled) setInternalValue(v);
    onChange?.(e);
    if (validate) setLocalError(validate(v));
  };


  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onChange?.({ target: { value: "" } } as ChangeEvent<HTMLInputElement>);
    if (validate) setLocalError(validate(""));
  };


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onEnter?.(e);
  };


  const _type = type === "password" && showPassword ? "text" : type;


  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}


      <div className="relative flex items-center gap-2">
        {prefix && <div className="flex items-center pl-1 pr-2 text-sm">{prefix}</div>}


        <div className="relative flex-1">
          <input
            {...rest}
            id={id}
            name={name}
            ref={ref}
            value={isControlled ? value : internalValue}
            onChange={handleChange}
            onBlur={onBlur}
            placeholder={placeholder}
            type={_type}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            onKeyDown={handleKeyDown}
            aria-invalid={!!currentError}
            aria-describedby={currentError ? `${id}-error` : helper ? `${id}-helper` : undefined}
            className={`${baseInputClasses} ${currentError
              ? "border-red-300 focus:ring-red-200"
              : "border-slate-200 focus:ring-sky-200"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""} pl-9 pr-10`}
          />


          {variant === "search" && (
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer" />
          )}


          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {icon && <span className="mr-1">{icon}</span>}


            {clearable && (isControlled ? value : internalValue) ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear input"
                className="p-1 rounded hover:bg-slate-100"
              >
                <X className="w-4 h-4 text-slate-500 cursor-pointer" />
              </button>
            ) : null}


            {type === "password" && showPasswordToggle && (
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="p-1 rounded hover:bg-slate-100"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-500 cursor-pointer" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-500 cursor-pointer" />
                )}
              </button>
            )}


            {suffix && <span className="ml-1">{suffix}</span>}
          </div>
        </div>
      </div>


      {currentError ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {currentError}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="mt-1 text-sm text-slate-500">
          {helper}
        </p>
      ) : null}
    </div>
  );

});


Input.displayName = "InputCustom";
