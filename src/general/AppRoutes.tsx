// import { useSession } from "@/context/AuthContext"
import { AuthLayout } from "@/modules/auth/layout/AuthLayout"
import { LoginPage } from "@/modules/auth/pages/Login"
import { RegisterPage } from "@/modules/auth/pages/Register"
import { ProfileLayout } from "@/modules/profile/layout/ProfileLayout"
import { ProfilePage } from "@/modules/profile/pages/Profile"
import { Route, Routes } from "react-router"
import { Toaster } from "sonner"

export const AppRouter = () => {

  // const sessionContext = useSession()

  // if(sessionContext.isLoading) {
  //   return <>Cargando</>
  // }
  // const session = sessionContext.currentUser;
  
  return (
    <>
      <Routes>
        
        <Route path="auth">
          <Route element={<AuthLayout/>}>
            <Route path='login' element={<LoginPage/>}/>
            <Route path='register' element={<RegisterPage/>}/>
          </Route>
        </Route>
        <Route path="profile">
          <Route element={<ProfileLayout/>}>
            <Route path=":id" element={<ProfilePage/>}/>
          </Route>
        </Route>

        {
          // session === null
          // ? (
          //   <>
          //     <Route path="auth">
          //       <Route element={<AuthLayout/>}>
          //         {/* <Route index element={<ProfilePage/>}/> */}
          //         <Route path='login' element={<LoginPage/>}/>
          //         <Route path='register' element={<RegisterPage/>}/>
          //       </Route>
          //     </Route>
          //     {/* <Route path="/auth/*" element={ <AuthRoutes /> } /> */}
          //     <Route path='/*' element={ <Navigate to='/auth/login' />  } />
          //   </>
          // )
          // : (
          //   <>
          //     <Route path="profile">
          //       <Route element={<ProfileLayout/>}>
          //         <Route path=":id" element={<ProfilePage/>}/>
          //       </Route>
          //     </Route>
          //   </>
            
          // )
        }

        {/* <Route path="/auth/*" element={ <AuthRoutes /> } /> */}
        {/* <Route path='/*' element={ <Navigate to='/auth/login' />  } /> */}
        
      </Routes>
      <Toaster />
    </>
  )
}