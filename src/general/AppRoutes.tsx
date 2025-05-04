import { AuthRoutes } from "@/modules/auth/routes/AuthRoutes"
import { ProfileRoutes } from "@/modules/profile/routes/ProfileRoutes"
import { Navigate, Route, Routes } from "react-router"

export const AppRouter = () => {

  // Queda hacer una revisión de la sesión
  return (
    <Routes>
        <Route path="/auth/*" element={ <AuthRoutes /> } />
        <Route path="/profile/*" element={ <ProfileRoutes /> } />
        <Route path='/*' element={ <Navigate to='/auth/*' />  } />
    </Routes>
  )
}