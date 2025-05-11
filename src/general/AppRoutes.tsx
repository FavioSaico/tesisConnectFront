import { useSession } from "@/context/AuthContext"
import { AuthRoutes } from "@/modules/auth/routes/AuthRoutes"
import { ProfileLayout } from "@/modules/profile/layout/ProfileLayout"
import { ProfilePage } from "@/modules/profile/pages/Profile"
import { Navigate, Route, Routes } from "react-router"
import { Toaster } from "sonner"

export const AppRouter = () => {

  const sessionContext = useSession()

  if(sessionContext.isLoading) {
    return <>Cargando</>
  }
  const session = sessionContext.currentUser;
  
  return (
    <>
      <Routes>
        {/* <Route path="/profile/*" element={ <ProfileRoutes /> } />
              <Route path='/*' element={ <Navigate to='/profile/*' />  } /> */}
        {
          session === null
          ? (
            <>
              <Route path="/auth/*" element={ <AuthRoutes /> } />
              <Route path='/*' element={ <Navigate to='/auth/*' />  } />
            </>
          )
          : (
            <>
            {/* <Route path="/profile" element={<ProfileLayout />}>
              <Route path=":id" element={<ProfilePage/>}/>
            </Route> */}
              <Route path="profile">
                <Route path=":id" element={<ProfileLayout/>}>
                  <Route index element={<ProfilePage/>}/>
                </Route>
                <Route index element={ <Navigate to={`/profile/${session?.usuario?.id}`} />  } />
              </Route>
              <Route path='/*' element={ <Navigate to={`/profile/${session?.usuario?.id}`} />  } />
            </>
            
          )
        }
      </Routes>
      <Toaster />
    </>
  )
}