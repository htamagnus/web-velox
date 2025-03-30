'use client'

import React from 'react'
import clsx from 'clsx'

type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost'
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
    'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'w-full bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    ghost: 'w-full bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
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
