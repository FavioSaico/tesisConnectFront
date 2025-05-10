import { Route, Routes } from "react-router"
import { ProfilePage } from "../pages/Profile"
import { ProfileLayout } from '../layout/ProfileLayout';

export const ProfileRoutes = () => {
  return (
    <ProfileLayout>
      <Routes>
        {/* <Route path="/" element={ <Navigate to="/" />}  /> */}

        <Route path="/" element={ <ProfilePage/> } />

      </Routes>
    </ProfileLayout>
  )
}
