'use client'

import React from 'react'
import clsx from 'clsx'

type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'round'
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
    primary: 'w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 px-4 py-2 rounded-md',
    secondary: 'bg-white text-gray-900 px-6 py-2 rounded-full font-semibold shadow-lg hover:opacity-90',
    ghost: 'w-full bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 px-4 py-2 rounded-md',
    round: 'bg-white text-black w-10 h-10 rounded-full text-xl shadow hover:opacity-90', // NOVO
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
