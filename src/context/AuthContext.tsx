import { AuthResponse } from '@/types/Usuario'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type SessionContextType = {
  user: AuthResponse | null
  setUserLS: (user: AuthResponse) => void
  logout: () => void
  isLoading: boolean
}

export const SessionContext = createContext<SessionContextType| undefined>(undefined)

export function SessionProvider ({ children } : { children: ReactNode }) {

  const [user, setUser] = useState<AuthResponse| null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const setUserLS = (user: AuthResponse) => {
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }


  return (
    <SessionContext.Provider value={{
      user, setUserLS, logout, isLoading
    }}>
      {children}
    </SessionContext.Provider>
  )
}


export const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error("useUser debe usarse dentro de UserProvider")
  }
  return context
}