import { type Notification } from '../../contexts/AppContext'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

interface NotificationCardProps {
  notification: Notification
  onDismiss: (id: string) => void
}

// Premium color schemes with bold, intentional palettes
const typeStyles = {
  success: {
    // Vibrant emerald with premium gradient
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    border: 'border-emerald-300',
    accent: 'from-emerald-500 to-teal-500',
    text: 'text-emerald-900',
    icon: CheckCircleIcon,
    progress: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    dot: 'bg-emerald-500',
  },
  error: {
    // Bold crimson with depth
    bg: 'bg-gradient-to-br from-red-50 to-rose-50',
    border: 'border-red-300',
    accent: 'from-red-500 to-rose-500',
    text: 'text-red-900',
    icon: XMarkIcon,
    progress: 'bg-gradient-to-r from-red-500 to-rose-500',
    dot: 'bg-red-500',
  },
  warning: {
    // Rich amber with sophistication
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-300',
    accent: 'from-amber-500 to-orange-500',
    text: 'text-amber-900',
    icon: ExclamationTriangleIcon,
    progress: 'bg-gradient-to-r from-amber-500 to-orange-500',
    dot: 'bg-amber-500',
  },
  info: {
    // Deep indigo with elegance
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
    border: 'border-blue-300',
    accent: 'from-blue-500 to-indigo-500',
    text: 'text-blue-900',
    icon: InformationCircleIcon,
    progress: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    dot: 'bg-blue-500',
  },
}

// Dark mode premium schemes
const typeStylesDark = {
  success: {
    bg: 'dark:bg-gradient-to-br dark:from-emerald-950/40 dark:to-teal-950/40',
    border: 'dark:border-emerald-700/50',
    accent: 'dark:from-emerald-400 dark:to-teal-400',
    text: 'dark:text-emerald-200',
    progress: 'dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-500',
    dot: 'dark:bg-emerald-400',
  },
  error: {
    bg: 'dark:bg-gradient-to-br dark:from-red-950/40 dark:to-rose-950/40',
    border: 'dark:border-red-700/50',
    accent: 'dark:from-red-400 dark:to-rose-400',
    text: 'dark:text-red-200',
    progress: 'dark:bg-gradient-to-r dark:from-red-500 dark:to-rose-500',
    dot: 'dark:bg-red-400',
  },
  warning: {
    bg: 'dark:bg-gradient-to-br dark:from-amber-950/40 dark:to-orange-950/40',
    border: 'dark:border-amber-700/50',
    accent: 'dark:from-amber-400 dark:to-orange-400',
    text: 'dark:text-amber-200',
    progress: 'dark:bg-gradient-to-r dark:from-amber-500 dark:to-orange-500',
    dot: 'dark:bg-amber-400',
  },
  info: {
    bg: 'dark:bg-gradient-to-br dark:from-blue-950/40 dark:to-indigo-950/40',
    border: 'dark:border-blue-700/50',
    accent: 'dark:from-blue-400 dark:to-indigo-400',
    text: 'dark:text-blue-200',
    progress: 'dark:bg-gradient-to-r dark:from-blue-500 dark:to-indigo-500',
    dot: 'dark:bg-blue-400',
  },
}

export default function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
  const { type, message, duration } = notification
  const styles = typeStyles[type]
  const darkStyles = typeStylesDark[type]

  // Calculate animation duration based on notification duration
  const animationDuration = duration ?? 4000

  return (
    <motion.div
      initial={{ opacity: 0, x: 48, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 48, y: -20 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        mass: 0.8
      }}
      className={`relative mb-4 flex w-96 items-start gap-4 overflow-hidden rounded-xl border backdrop-blur-sm ${styles.bg} ${darkStyles.bg} ${styles.border} ${darkStyles.border} shadow-xl`}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Accent bar on left */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${styles.accent} ${darkStyles.accent}`} />

      {/* Content wrapper with padding */}
      <div className="flex flex-1 gap-4 p-4 pl-5">
        {/* Icon with background */}
        <div className={`mt-0.5 shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${styles.accent} ${darkStyles.accent} shadow-lg`}>
          <styles.icon className="h-5 w-5 text-white drop-shadow-sm" />
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold leading-tight ${styles.text} ${darkStyles.text}`}>
            {message}
          </p>
        </div>

        {/* Close button with hover effect */}
        <button
          onClick={() => onDismiss(notification.id)}
          className={`group shrink-0 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${styles.text} ${darkStyles.text}`}
          aria-label="Dismiss notification"
        >
          <XMarkIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
        </button>
      </div>

      {/* Premium progress bar with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 overflow-hidden bg-black/5 dark:bg-white/5">
        <motion.div
          className={`h-full ${styles.progress} ${darkStyles.progress} shadow-lg`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: animationDuration / 1000, ease: 'linear' }}
        />
      </div>

      {/* Subtle shine effect on top */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
    </motion.div>
  )
}
