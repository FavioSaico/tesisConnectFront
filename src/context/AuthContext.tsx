import { AuthResponse } from '@/types/Usuario'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type SessionContextType = {
  currentUser?: AuthResponse | null
  setCurrentUserLS: (user: AuthResponse) => void
  isLoading: boolean
  // setIsLoading: (isLoading: boolean) => void
  logout: () => void
}
// Este es el contexto que tenemos que consumir
// esto lo usamos con el useContext
export const SessionContext = createContext<SessionContextType| undefined>(undefined)

// Este es el que nos provee de acceso al contexto
// el provider retorna un componente que envuelve a su children
export function SessionProvider ({ children } : { children: ReactNode }) {

  const [currentUser, setCurrentUser] = useState<AuthResponse| null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setCurrentUser(JSON.parse(stored))
      setIsLoading(false)
    }
  }, [])

  const setCurrentUserLS = (user: AuthResponse) => {
    setIsLoading(true)
    setCurrentUser(user)
    localStorage.setItem("user", JSON.stringify(user))
    setIsLoading(false)
  }

  const logout = () => {
    setIsLoading(true)
    localStorage.removeItem("user")
    setCurrentUser(null)
    setIsLoading(false)
  }


  return (
    <SessionContext.Provider value={{
      currentUser, setCurrentUserLS, logout, isLoading
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