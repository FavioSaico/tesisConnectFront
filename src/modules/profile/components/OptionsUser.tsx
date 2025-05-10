import { Button } from "@/components/ui/button"
import { UserRound } from "lucide-react"

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
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" className="rounded-full focus-visible:ring-0">
            <UserRound />
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