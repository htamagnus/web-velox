'use client'

import React from 'react'

type LoaderProps = {
  size?: number
  className?: string
}

export default function Loader({ size = 24, className }: LoaderProps) {
  return (
    <div
    className={["animate-spin rounded-full border-2 border-t-transparent", className].join(' ')}
      style={{
        width: size,
        height: size,
        borderColor: 'white',
        borderTopColor: 'transparent',
      }}
    />
  )
}
