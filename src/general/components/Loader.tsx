import { Loader2 } from "lucide-react"

export const Loader = ({ size }:{ size: number}) => {

  return (
    <div className="userSection md:col-span-2 flex flex-col gap-3">
      <Loader2 className="animate-spin text-primary mx-auto" size={size} />
    </div>
  )
}