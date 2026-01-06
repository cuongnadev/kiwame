"use client";
import React, {
  ChangeEvent,
  FocusEvent,
  forwardRef,
  useEffect,
  useState,
} from "react";

export interface TextareaProps {
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
  validate?: (value: string) => string | null;
  className?: string;
  rows?: number;
  variant?: "default" | "bare";
  maxLength?: number;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: FocusEvent<HTMLTextAreaElement>) => void;
}

const baseClasses =
  "block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-white bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-200 transition resize-none";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      id,
      name,
      label,
      value,
      onChange,
      onBlur,
      onFocus,
      placeholder,
      required = false,
      disabled = false,
      readOnly = false,
      error: externalError = null,
      helper = null,
      validate = null,
      className = "",
      rows = 3,
      maxLength,
      variant = "default",
      ...rest
    } = props;

    const [internalValue, setInternalValue] = useState(value ?? "");
    const isControlled = typeof value !== "undefined";
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
      if (isControlled) setInternalValue(value ?? "");
    }, [isControlled, value]);

    const currentError = externalError ?? localError;

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value;
      if (!isControlled) setInternalValue(v);
      onChange?.(e);
      if (validate) setLocalError(validate(v));
    };

    const classes =
      variant === "bare"
        ? "block w-full bg-transparent border-none focus:ring-0 text-white resize-none"
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

        <textarea
          {...rest}
          id={id}
          name={name}
          ref={ref}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          maxLength={maxLength}
          value={isControlled ? value : internalValue}
          className={`
            ${classes}
            ${currentError && "border-red-300 focus:ring-red-200"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${readOnly ? "opacity-60" : ""}
            ${className}
          `}
        />

        {currentError ? (
          <p className="mt-1 text-sm text-red-500">{currentError}</p>
        ) : helper ? (
          <p className="mt-1 text-sm text-slate-500">{helper}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
