import { Route } from "react-router"
import { ProfilePage } from "../pages/Profile"
import { ProfileLayout } from '../layout/ProfileLayout';

export const ProfileRoutes = () => {
  return (
    <ProfileLayout>
      <Route path="/profile">
        <Route path=":id" element={ <ProfilePage/> } />
      </Route>
    </ProfileLayout>
  )
}
