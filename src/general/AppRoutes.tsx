// import { useSession } from "@/context/AuthContext"
import { AuthLayout } from "@/modules/auth/layout/AuthLayout"
import { LoginPage } from "@/modules/auth/pages/Login"
import { RegisterPage } from "@/modules/auth/pages/Register"
import { ProfileLayout } from "@/modules/profile/layout/ProfileLayout"
import { ProfilePage } from "@/modules/profile/pages/Profile"
import { AuthResponse } from "@/types/Usuario"
import { Navigate, Route, Routes } from "react-router"
import { Toaster } from "sonner"

export const AppRouter = () => {

  // const sessionContext = useSession()

  // if(sessionContext.isLoading) {
  //   return <>Cargando</>
  // }
  // const session = sessionContext.currentUser;
  const usuarioLS = localStorage.getItem('user');
  let id: string | undefined;
  if(usuarioLS) {
    const usuario = JSON.parse(usuarioLS) as AuthResponse;
    // console.log(usuario)
    id = usuario.usuario?.id
  }

  console.log(id)

  return (
    <>
      <Routes>
        <Route path="profile">
          <Route element={<ProfileLayout/>}>
            <Route path=":id" element={<ProfilePage/>}/>
          </Route>
        </Route>
        <Route path="auth">
          <Route element={<AuthLayout/>}>
            <Route path='login' element={<LoginPage/>}/>
            <Route path='register' element={<RegisterPage/>}/>
          </Route>
        </Route>
        <Route path='/*' element={ <Navigate to='/auth/login' />  } />
      {/* <Route path='/*' element={ <Navigate to={`/profile/${id}`} />  } /> */}

        {
          // id 
          // ? (
          //   <>
          //     <Route path="profile">
          //       <Route element={<ProfileLayout/>}>
          //         <Route path=":id" element={<ProfilePage/>}/>
          //       </Route>
          //     </Route>
          //     <Route path='/*' element={ <Navigate to={`/profile/${id}`} />  } />
          //   </>
          // )
          // : (
          //   <>
          //     <Route path="auth">
          //       <Route element={<AuthLayout/>}>
          //         <Route path='login' element={<LoginPage/>}/>
          //         <Route path='register' element={<RegisterPage/>}/>
          //       </Route>
          //     </Route>
          //     <Route path='/*' element={ <Navigate to='/auth/login' />  } />
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