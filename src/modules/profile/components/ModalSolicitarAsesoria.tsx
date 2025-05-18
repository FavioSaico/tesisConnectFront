import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Check, CircleX, Mail } from "lucide-react"

import { useState } from "react"
import { toast } from "sonner"
import { DialogDescription } from "@radix-ui/react-dialog"



// esquema del formulario
const formSchema = z.object({
  titulo: z.string({
    required_error: "Ingrese un titulo"
  }).nonempty({
    message: "Ingrese un titulo"
  }),
  descripcion: z.string({
    required_error: "Ingrese una descripción"
  }).nonempty({
    message: "Ingrese una descripción"
  }),
})

interface Props {
  remitenteId: string
  destinatarioId: string
}

const URL_BASE = 'https://api-usuario-609569711189.us-central1.run.app'; //import.meta.env.VITE_URL_BASE;
const PATH = '/api/notification/sendNotication';

export const ModalSolicitarAsesoria: React.FC<Props> = ({remitenteId, destinatarioId}) => {

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descripcion: ""
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {

      await fetch(`${URL_BASE}${PATH}`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tituloProyecto: values.titulo,
          areaInvestigacion: values.descripcion,
          remitenteId, 
          destinatarioId
        })
      })
      .then(res => res.json())
      .then(res => {
        if(res.message) {
          toast.error("Error", {
            description: res.error ?? res.message,
            closeButton: true,
            icon: <CircleX className="text-destructive"/>,
          })
        }else{
          setOpen(false)
          toast.success("Solicitud enviada", {
            closeButton: true,
            icon: <Check className="text-green-700" />,
          })
        }
        setLoading(false)
        
      })
      .catch(() => {
        setLoading(false)
        toast.error("Error", {
          description: 'Error en el envio de la solicitud',
          closeButton: true,
          icon: <CircleX className="text-destructive"/>,
        })
      })
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer text-[15px]">
          <Mail />
          Solicitar asesoria
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Datos de solicitud</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Ingresa los datos para solicitar una asesoría.
        </DialogDescription>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, 
          (errors) => {
            console.log("Errores de validación:", errors);
          })} className="space-y-8 flex gap-5 flex-col">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo de tesis / proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el titulo de tu proyecto" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Áreas de interés</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa una descripción"
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" className="cursor-pointer w-full" disabled={loading}>
                {loading ? "Enviando..." : "Enviar solicitud"} 
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
