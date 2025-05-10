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

export const OptionsUser = () => {

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
          <DropdownMenuLabel>Usuario 1</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}