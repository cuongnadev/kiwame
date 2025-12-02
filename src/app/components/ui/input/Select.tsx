"use client";
import React, {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  useEffect,
  useState,
} from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string | null;
  helper?: string | null;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  validate?: (value: string) => string | null;
  className?: string;
  variant?: "default" | "bare";
  options: SelectOption[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (e: FocusEvent<HTMLSelectElement>) => void;
}

const baseClasses =
  "block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-white bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-200 transition";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const {
      id,
      name,
      label,
      value,
      onChange,
      onBlur,
      onFocus,
      required = false,
      disabled = false,
      readOnly = false,
      error: externalError = null,
      helper = null,
      prefix = null,
      suffix = null,
      validate = null,
      className = "",
      options,
      variant = "default",
      ...rest
    } = props;

    const isControlled = typeof value !== "undefined";
    const [internalValue, setInternalValue] = useState(value ?? "");
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
      if (isControlled) setInternalValue(value ?? "");
    }, [isControlled, value]);

    const currentError = externalError ?? localError;

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const v = e.target.value;
      if (!isControlled) setInternalValue(v);
      onChange?.(e);
      if (validate) setLocalError(validate(v));
    };

    const classes =
      variant === "bare"
        ? "block w-full bg-transparent border-none focus:ring-0 text-white"
        : baseClasses;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1 block text-sm font-medium text-slate-400"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center gap-2">
          {prefix && <div className="pl-1 pr-2">{prefix}</div>}

          <div className="relative flex-1">
            <select
              {...rest}
              id={id}
              name={name}
              ref={ref}
              required={required}
              disabled={disabled}
              onBlur={onBlur}
              onFocus={onFocus}
              onChange={handleChange}
              value={isControlled ? value : internalValue}
              className={`
                ${classes}
                ${currentError && "border-red-300 focus:ring-red-200"}
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${readOnly ? "pointer-events-none opacity-60" : ""}
                ${className}
              `}
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {suffix && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2">
                {suffix}
              </span>
            )}
          </div>
        </div>

        {currentError ? (
          <p className="mt-1 text-sm text-red-500">{currentError}</p>
        ) : helper ? (
          <p className="mt-1 text-sm text-slate-500">{helper}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
