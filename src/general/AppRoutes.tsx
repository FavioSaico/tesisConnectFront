import { useSession } from "@/context/AuthContext"
import { AuthRoutes } from "@/modules/auth/routes/AuthRoutes"
import { ProfileRoutes } from "@/modules/profile/routes/ProfileRoutes"
import { Navigate, Route, Routes } from "react-router"
import { Toaster } from "sonner"

export const AppRouter = () => {

  const sessionContext = useSession()

  return (
    <>
      <Routes>
        {
          sessionContext?.currentUser === null
          ? (
            <>
              <Route path="/auth/*" element={ <AuthRoutes /> } />
              <Route path='/*' element={ <Navigate to='/auth/*' />  } />
            </>
          )
          : (
            <>
              <Route path="/profile/*" element={ <ProfileRoutes /> } />
              <Route path='/*' element={ <Navigate to='/profile' />  } />
            </>
          )
        }
      </Routes>
      <Toaster />
    </>
  )
}