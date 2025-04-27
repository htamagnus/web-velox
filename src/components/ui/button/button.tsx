'use client'

import React from 'react'
import clsx from 'clsx'

type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'round' | 'confirm'
  loading?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className,
  onClick,
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    confirm: 'w-full bg-white/7 button-confirm rounded-md py-2',
    primary: 'button-confirm w-full',
    secondary: 'bg-white text-gray-900 px-6 py-2 rounded-md font-semibold shadow-lg hover:opacity-90',
    ghost: 'w-full bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 px-4 py-2 rounded-md',
    round: 'rounded-button',
  }
    
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseClasses,
        variants[variant],
        disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
    >
      {loading ? 'Carregando...' : children}
    </button>
  )
}
