"use client";
import { Eye, EyeOff, X } from 'lucide-react';
import React, { ChangeEvent, FocusEvent, forwardRef, KeyboardEvent, useEffect, useState } from 'react'

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
  variant?: "default" | "bare";
  onEnter?: (e: KeyboardEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
}

const baseInputClasses =
  "block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-200 transition";

export const Input: React.FC<InputProps> = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    id,
    name,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
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

  useEffect(() => {
    if (isControlled) setInternalValue(value ?? "");
  }, [value, isControlled]);

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

  const classes =
    variant === "bare"
      ? "block w-full bg-transparent border-none focus:ring-0 focus-visible:ring-0 focus:outline-none focus-visible:outline-none text-white"
      : baseInputClasses;

  return (
    <div className={`w-full`}>
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
            onFocus={onFocus}
            placeholder={placeholder}
            type={_type}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            onKeyDown={handleKeyDown}
            aria-invalid={!!currentError}
            aria-describedby={currentError ? `${id}-error` : helper ? `${id}-helper` : undefined}
            className={`
              ${classes}
              ${currentError && "border-red-300 focus:ring-red-200"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${className}
            `}
          />

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
                tabIndex={-1}
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
