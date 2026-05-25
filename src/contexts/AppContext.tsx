// AppContext.tsx — Theme, activeTab, notifications
// TODO: Implement in M23
import { createContext, useContext, useState, type ReactNode } from 'react'

interface AppContextValue {
  activeTab: 'editor' | 'dictionary' | 'ocr'
  setActiveTab: (tab: 'editor' | 'dictionary' | 'ocr') => void
  theme: 'dark' | 'light'
  setTheme: (theme: 'dark' | 'light') => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<'editor' | 'dictionary' | 'ocr'>('editor')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  return (
    <AppContext.Provider value={{ activeTab, setActiveTab, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
