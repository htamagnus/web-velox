'use client'

import { useLocale } from '@/contexts/locale-context'
import { Globe } from 'lucide-react'
import styles from './language-selector.module.css'

export default function LanguageSelector() {
  const { locale, setLocale } = useLocale()

  return (
    <div className={styles.container}>
      <Globe size={18} className={styles.icon} />
      <button
        onClick={() => setLocale('pt')}
        className={locale === 'pt' ? styles.active : styles.inactive}
      >
        PT
      </button>
      <span className={styles.separator}>|</span>
      <button
        onClick={() => setLocale('en')}
        className={locale === 'en' ? styles.active : styles.inactive}
      >
        EN
      </button>
    </div>
  )
}

