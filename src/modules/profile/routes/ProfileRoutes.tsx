import { Route, Routes } from "react-router"
import { ProfilePage } from "../pages/Profile"

export const ProfileRoutes = () => {
  return (
    <Routes>
        {/* <Route path="/" element={ <Navigate to="/" />}  /> */}

        <Route path="/*" element={ <ProfilePage/> } />

    </Routes>
  )
}
