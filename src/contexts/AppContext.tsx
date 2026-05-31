// AppContext.tsx — activeTab, notifications
import { createContext, useContext, useState, useRef, useEffect, type ReactNode, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  duration?: number
}

interface AppContextValue {
  activeTab: 'editor' | 'dictionary' | 'ocr'
  setActiveTab: (tab: 'editor' | 'dictionary' | 'ocr') => void
  isOCRSplitOpen: boolean
  setIsOCRSplitOpen: (open: boolean) => void
  notifications: Notification[]
  addNotification: (notif: Omit<Notification, 'id'>) => void
  dismissNotification: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

// Fallback ID generator for browsers without crypto.randomUUID
function generateFallbackId(): string {
  return `notif_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<'editor' | 'dictionary' | 'ocr'>('editor')
  const [isOCRSplitOpen, setIsOCRSplitOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  // Timer reference map for cleanup management
  const timerRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  // Track component mount state to prevent state updates after unmount
  const isMountedRef = useRef(true)

  const dismissNotification = useCallback((id: string) => {
    // Clear timer if exists
    if (timerRefs.current.has(id)) {
      const timerId = timerRefs.current.get(id)
      if (timerId) {
        clearTimeout(timerId)
      }
      timerRefs.current.delete(id)
    }
    
    // Remove from state array
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const addNotification = useCallback((notif: Omit<Notification, 'id'>) => {
    // Generate unique ID using crypto.randomUUID with fallback
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : generateFallbackId()
    
    // Apply default duration of 4000ms if not specified
    const duration = notif.duration ?? 4000
    
    // Create notification object
    const notification: Notification = {
      id,
      type: notif.type,
      message: notif.message,
      duration
    }
    
    // Add to state array with max limit enforcement (10 notifications max)
    setNotifications(prev => {
      // If at max limit, remove oldest notification first
      if (prev.length >= 10) {
        // Remove the oldest (first) notification
        const filtered = prev.slice(1)
        return [...filtered, notification]
      }
      return [...prev, notification]
    })
    
    // Schedule auto-dismiss timer
    const timerId = setTimeout(() => {
      if (isMountedRef.current) {
        dismissNotification(id)
      }
    }, duration)
    
    // Store timer reference for cleanup
    timerRefs.current.set(id, timerId)
  }, [dismissNotification])

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      // Clear all pending timers
      timerRefs.current.forEach(timerId => {
        clearTimeout(timerId)
      })
      // Clear timer map
      timerRefs.current.clear()
    }
  }, [])

  return (
    <AppContext.Provider value={{ activeTab, setActiveTab, isOCRSplitOpen, setIsOCRSplitOpen, notifications, addNotification, dismissNotification }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
