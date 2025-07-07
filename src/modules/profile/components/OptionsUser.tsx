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
import { useLocation, useNavigate } from "react-router";
import { useSession } from "@/context/AuthContext";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { MessagesSquare } from 'lucide-react';


export const OptionsUser = () => {

  const { logout, user, isLoading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  if(isLoading) {
    return (<>Cargando ...</>)
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={() => navigate("/auth/login")}
        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-550 text-sm hover:text-white"
      >
        Iniciar sesión
      </Button>
    );
  }

  const usuario = user.usuario ;

  return (
    <div className="flex gap-2">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem className="cursor-pointer mr-1">
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <div
                onClick={() => navigate("/foro")}
                className={`flex gap-1 flex-row text-gray-500 ${isActive("/foro") ? "border-b-2 border-primary bg-blue-50 text-black font-bold" : ""}`}
              >
                <MessagesSquare size={20} className={`${isActive("/foro") ? "text-black font-semibold" : ""}`}/>
                <p className={`${isActive("/foro") ? "text-black font-semibold" : ""}`}>Foro</p>
              </div>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <a href="/profile">Docs</a>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="rounded-full p-1 w-[40px] h-[40px] cursor-pointer">
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