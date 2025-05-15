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
// import { useSession } from "@/context/AuthContext";
// import { useEffect, useState } from "react";
import { AuthResponse } from "@/types/Usuario";
import { useNavigate } from "react-router";

export const OptionsUser = () => {

  // const sessionContext = useSession();
  const navigate = useNavigate();

  // const [session, setSession] = useState<AuthResponse>();
  
  // useEffect(()=>{
  //   if(sessionContext?.currentUser) {
  //     setSession(sessionContext.currentUser)
  //   }
  // }, [])

  const sessionLS = JSON.parse(localStorage.getItem('user') ?? '') as AuthResponse;
  const usuario = sessionLS.usuario;

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
            // sessionContext.logout()
            localStorage.removeItem("user")
            setTimeout(() => {
              navigate({
                pathname:`/auth/login`
              });
            }, 1000)
          }}>Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}