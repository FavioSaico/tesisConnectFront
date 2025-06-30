import { GET_USER_AUTHENTICATED } from '@/modules/profile/graphql/getUserProfile'
import { AuthResponse } from '@/types/Usuario'
import { useLazyQuery } from '@apollo/client'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type SessionContextType = {
  user: AuthResponse | null
  setUserLS: (user: AuthResponse) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean

}

interface UserData {
  getUserAuthenticated: AuthResponse
}

const URL_USUARIO = import.meta.env.VITE_URL_USUARIO;

export const SessionContext = createContext<SessionContextType| undefined>(undefined)

export function SessionProvider ({ children } : { children: ReactNode }) {

  const [user, setUser] = useState<AuthResponse| null>(null);
  // const [authenticated, setAuthenticate] = useState<boolean>(false);
  // const [loading, setIsLoading] = useState<boolean>(true);

  const [ getUserAuthenticated, { loading: isLoading }] = useLazyQuery<UserData>(GET_USER_AUTHENTICATED);
  // const { data, loading: isLoading } = useQuery<UserData>(GET_USER_AUTHENTICATED, {
  //   fetchPolicy: 'network-only'
  // });

  useEffect(() => {
    
    // const stored = localStorage.getItem("user")
    // if (stored) {
    //   // setUser(JSON.parse(stored))
    // }
    getUserAuthenticatedGql();
    // setIsLoading(false)
  }, [])

  // console.log(isLoadingGql)

  const getUserAuthenticatedGql = async () => {
    
    const { data } = await getUserAuthenticated();

    if(data) {
      setUser({
        ...data.getUserAuthenticated
      })
    }else{
      setUser(null)
    }

  }

  const setUserLS = async (user: AuthResponse) => {
    setUser(user);
    // setAuthenticate(true)
    // localStorage.setItem("user", JSON.stringify(user));
    // setIsLoading(false)
    // getUserAuthenticatedGql();
  }

  const logout = async() => {

    await fetch(`${URL_USUARIO}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    // localStorage.removeItem("user")
    // setIsLoading(false)
    // setAuthenticate(false)
    setUser(null)
  }

  return (
    <SessionContext.Provider value={{
      // user: data?.getUserAuthenticated ?? null, 
      user, 
      setUserLS, 
      logout, 
      isLoading
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