import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import "./auth.css";
import { useNavigate } from "react-router"
import { useContext, useState } from "react"
import { Check, CircleX, Loader2 } from "lucide-react"

import { AuthResponse } from '@/types/Usuario'
import { SessionContext } from "@/context/AuthContext"

const formSchema = z.object({
  correo: z.string().email({
    message: "Ingrese un correo electrónico válido"
  }),
  contrasena: z.string().min(6, {
    message: "Ingrese una contraseña válida"
  }),
})

const URL_BASE = import.meta.env.VITE_URL_BASE;
const PATH = '/api/auth/login';

export const LoginPage = () => {
  
  const [isLoding, setIsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      correo: "prueba@gmail.com",
      contrasena: "12311432234",
    },
  })

  const navigate = useNavigate();
  const context = useContext(SessionContext)
  
  async function onSubmit(values: z.infer<typeof formSchema>) {

    setIsLoading(true);
    try {
      await fetch(`${URL_BASE}${PATH}`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...values})
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
          const usuario = res as AuthResponse;

          context?.setCurrentUserLS(usuario);

          toast.success("Autenticación completada", {
            closeButton: true,
            icon: <Check className="text-green-700" />,
          })

          setTimeout(() => {
            navigate({
              pathname:'/profile'
            });
          }, 1000);
        }
        setIsLoading(false)
      })
      .catch(() => {
        toast.error("Error", {
          description: 'Error en la autenticación',
          closeButton: true,
          icon: <CircleX className="text-destructive"/>,
        })
      })
      .finally(() => setIsLoading(false))
      ;
    } catch (error) {
      console.log(error)
    }
    
  }

  // Queda hacer una revisión de la sesión
  return (
    <div className="container-auth">
      <div className="container-login">
        <h1 className="title">Iniciar sesión</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex gap-10 flex-col">
            <FormField
              control={form.control}
              name="correo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribe tu correo electrónico" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contrasena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribe tu contraseña" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <a className="text-primary underline-offset-4 hover:underline cursor-pointer m-0 mx-auto">Ovildaste tu contraseña</a>
            <div className="m-0">
              {
                isLoding 
                ? (<Button variant="default" size="btnAuth" disabled>
                  <Loader2 className="animate-spin" />
                  Cargando
                </Button>)
                : (<Button variant="default" size="btnAuth" type="submit">Ingresar</Button>)
              }
            </div>
            
            <div className="inline-flex justify-center gap-1">
              <p className="inline">
                ¿Aún no tienes tu cuenta? <a 
                  href="/auth/register"
                  className="text-primary underline-offset-4 hover:underline cursor-pointer m-0"
                >Crea tu cuenta</a>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}