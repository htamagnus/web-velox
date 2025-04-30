import plugin from 'tailwindcss/plugin'
import { type Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        /* Backgrounds */
        '.bg-background': { backgroundColor: 'var(--background)' },
        '.bg-primary': { backgroundColor: 'var(--primary)' },
        '.bg-primary-light': { backgroundColor: 'var(--primary-light)' },
        '.bg-primary-dark': { backgroundColor: 'var(--primary-dark)' },
        '.bg-success': { backgroundColor: 'var(--success)' },
        '.bg-warning': { backgroundColor: 'var(--warning)' },
        '.bg-error': { backgroundColor: 'var(--error)' },
  
        /* Text colors */
        // '.text-foreground': { color: 'var(--foreground)' },
        '.text-primary': { color: 'var(--primary)' },
        '.text-primary-light': { color: 'var(--primary-light)' },
        '.text-primary-dark': { color: 'var(--primary-dark)' },
        '.text-primary-content': { color: 'var(--primary-content)' },
        '.text-success-content': { color: 'var(--success-content)' },
        '.text-warning-content': { color: 'var(--warning-content)' },
        '.text-error-content': { color: 'var(--error-content)' },
        '.text-copy': { color: 'var(--copy)' },
        '.text-copy-light': { color: 'var(--copy-light)' },
        '.text-copy-lighter': { color: 'var(--copy-lighter)' },
  
        /* Borders */
        '.border-border': { borderColor: 'var(--border)' },
      })
    }),
  ],
}

export default config
