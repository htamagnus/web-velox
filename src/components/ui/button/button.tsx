'use client'

import React from 'react'
import clsx from 'clsx'
import styles from './button.module.css'
import { useRouter } from 'next/navigation'

type ButtonProps = {
  children?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'round' | 'confirm' | 'strava' | 'back'
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
  const router = useRouter()
  const isDisabled = disabled || loading

  const baseClasses =
  'inline-flex items-center justify-center font-semibold transition-all text-base focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer'

  const variants = {
    primary: 'w-full py-2 rounded-md bg-primary shadow hover:brightness-10 active:scale-95',
    secondary: 'bg-copy text-background shadow hover:opacity-90 active:scale-95',
    ghost: 'bg-transparent text-copy hover:bg-white/10 active:scale-95',
    round: 'bg-primary-dark w-10 h-10 rounded-full hover:brightness-110 active:scale-95',
    back: 'w-10 h-10 absolute top-6 left-4 rounded-full text-copy-lighter hover:bg-white/10 active:scale-95',
    confirm: styles.confirm,
    strava: styles.strava,
  }

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (variant === 'back') {
      router.back()
    }
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={clsx(
        baseClasses,
        variants[variant],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <span className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}
