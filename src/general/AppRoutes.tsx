import { useSession } from "@/context/AuthContext"
import { AuthLayout } from "@/modules/auth/layout/AuthLayout"
import { LoginPage } from "@/modules/auth/pages/Login"
import { RegisterPage } from "@/modules/auth/pages/Register"
import { ProfileLayout } from "@/modules/profile/layout/ProfileLayout"
import { ProfilePage } from "@/modules/profile/pages/Profile"
import { Loader2 } from "lucide-react"
import { Navigate, Route, Routes } from "react-router"
import { Toaster } from "sonner"

export const AppRouter = () => {

  const { user, isLoading } = useSession()

  if(isLoading) {
    return (
      <div className="userSection md:col-span-2 flex flex-col gap-3">
        <Loader2 className="animate-spin text-primary mx-auto" size={40}/>
      </div>
    )
  }

  return (
    <>
      <Routes>
        {
          user 
          ? (
            <>
              <Route path="profile">
                <Route element={<ProfileLayout/>}>
                  <Route path=":id" element={<ProfilePage/>}/>
                </Route>
              </Route>
              <Route path='/*' element={ <Navigate to={`/profile/${user.usuario.id}`} /> }/> 
            </>
          )
          : (
            <>
              <Route path="auth">
                <Route element={<AuthLayout/>}>
                  <Route path='login' element={<LoginPage/>}/>
                  <Route path='register' element={<RegisterPage/>}/>
                </Route>
              </Route>
              <Route path='/*' element={ <Navigate to='/auth/login' />  } />
            </>
          )
        }
        
      </Routes>
      <Toaster />
    </>
  )
}