import { Button } from "@/components/ui/button"
import perfilDefault from "/perfil.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router";
import { useSession } from "@/context/AuthContext";

export const OptionsUser = () => {

  const { logout, user, isLoading } = useSession();
  const navigate = useNavigate();

  if(isLoading) {
    return (<>Cargando ...</>)
  }

  if(!user){
    return (<>Usuario no existe</>)
  }

  const usuario = user.usuario ;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="rounded-full p-1 w-[40px] h-[40px]">
            <div className="rounded-full">
              <img src={perfilDefault} alt="" className="w-full h-full"/>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {usuario?.nombres}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => {
            navigate({
              pathname:`/profile/${usuario?.id}`
            });
          }}>Ver perfil</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {
            logout()
            setTimeout(() => {
              navigate({
                pathname:`/auth/login`
              });
            }, 500)
          }}>Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}