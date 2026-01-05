import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import React from 'react'

export interface ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  loading?: boolean;
  disabled?: boolean;
  nowrap?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  title?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  iconPosition = 'left',
  variant = 'primary',
  size = 'md',
  radius = 'md',
  loading = false,
  disabled = false,
  nowrap = false,
  onClick,
  title,
  className
}) => {
  const baseStyles = 'inline-flex hover:pointer items-center justify-center gap-2 font-medium transition-colors duration-200';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[radius];

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[#9333EA] to-[#7E22CE]
      text-white font-semibold
      hover:opacity-90
      shadow-lg shadow-purple-500/20
    `,
    secondary: `
      bg-gradient-to-r from-gray-600 to-gray-700
      text-white/90 font-medium
      hover:from-gray-500 hover:to-gray-600
      shadow-md shadow-black/20
    `,
    outline:`
      bg-transparent
      border border-white/20
      text-white/90
      hover:bg-white/10
      transition-colors
    `,
    ghost: `
      text-gray-300
      hover:bg-white/10
    `,
    dark:`
      rounded-full
      bg-[#222] hover:bg-[#444444]
      text-white
      py-4
    `,
    danger: "bg-red-600 text-white hover:bg-red-700",
    
  }[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        sizeStyles,
        radiusStyles,
        variantStyles,
        (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      )}
      title={title}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin"/>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          {text && <span className={nowrap===true ? 'block overflow-hidden text-ellipsis whitespace-nowrap max-w-full':''}>{text}</span>}
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </>
      )}
    </button>
  )
}
