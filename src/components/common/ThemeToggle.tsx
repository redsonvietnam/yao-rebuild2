import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-lg border transition-all active:scale-95"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        borderColor: 'var(--color-border)',
        background: 'linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
        color: 'var(--color-text-secondary)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--color-text-primary)'
        e.currentTarget.style.borderColor = 'var(--color-border-light)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--color-text-secondary)'
        e.currentTarget.style.borderColor = 'var(--color-border)'
      }}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </motion.button>
  )
}
