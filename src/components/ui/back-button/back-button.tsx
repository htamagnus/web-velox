'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type BackButtonProps = {
  onBack?: () => void
  className?: string
}

export default function BackButton({ onBack, className }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleBack}
      aria-label="Voltar"
      className={`absolute top-6 left-4 rounded-full p-2 cursor-pointer bg-background border border-border hover:bg-accent transition ${className}`}
    >
      <ArrowLeft size={20} />
    </button>
  )
}
