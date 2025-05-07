import { Navigate, Route, Routes } from "react-router"
import { LoginPage } from "../pages/Login"
import { RegisterPage } from "../pages/Register"
import { AuthLayout } from "../layout/AuthLayout"

export const AuthRoutes = () => {
  return (
    <AuthLayout>
      <Routes>
        <Route path="login" element={ <LoginPage/>} />
        <Route path="register" element={ <RegisterPage/>} />
        <Route path="/*" element={ <Navigate to="/auth/login" />}  />
      </Routes>
    </AuthLayout>
  )
}
