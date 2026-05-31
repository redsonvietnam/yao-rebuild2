// NotificationList.tsx — Premium toast notification stack UI with refined animations
import { useAppContext } from '../../contexts/AppContext'
import NotificationCard from './NotificationCard'
import { AnimatePresence, motion } from 'framer-motion'

export default function NotificationList() {
  const { notifications, dismissNotification } = useAppContext()

  // Stagger animation for multiple notifications
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  }

  return (
    <motion.div
      className="fixed top-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ willChange: 'transform, opacity' }}
    >
      <AnimatePresence mode="popLayout">
        {notifications.length > 0 && (
          <motion.div
            className="flex flex-col items-end gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, x: 64, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 64, y: -20 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8,
                }}
                className="pointer-events-auto"
              >
                <NotificationCard
                  notification={notification}
                  onDismiss={dismissNotification}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
