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
        '.bg-background': { backgroundColor: 'var(--background)' },
        '.text-foreground': { color: 'var(--foreground)' },
        '.text-muted': { color: 'var(--muted)' },
        '.bg-accent': { backgroundColor: 'var(--accent)' },
        '.border-border': { borderColor: 'var(--border)' },
        '.bg-primary': { backgroundColor: 'var(--primary)' },
        '.text-primary': { color: 'var(--primary)' },
        '.bg-secondary': { backgroundColor: 'var(--secondary)' },
        '.text-secondary': { color: 'var(--secondary)' },
      })
    }),
  ],
}

export default config
