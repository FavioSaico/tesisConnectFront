import { Recomendations } from "../components/Recommendations";
import { ProfileUser } from "../components/ProfileUser";

export const ProfilePage = () => {

  return (
    <div className="mt-3 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[1200px]">
      <ProfileUser/>
      <Recomendations/>
    </div>
    
  )
}
