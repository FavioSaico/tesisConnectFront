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
import { useState } from "react"
import { Check, CircleX, Eye, EyeOff, Loader2 } from "lucide-react"

import { AuthResponse } from '@/types/Usuario'
import { useSession } from "@/context/AuthContext"
import { useMutation } from "@apollo/client"

import { LOGIN_USER } from "../graphql/loginUser.ts"

const formSchema = z.object({
  correo: z.string().email({
    message: "Ingrese un correo electrónico válido"
  }),
  contrasena: z.string().min(6, {
    message: "Ingrese una contraseña válida"
  }),
})

const URL_USUARIO = import.meta.env.VITE_URL_USUARIO;
const API_MODE = import.meta.env.VITE_API_MODE;
const PATH = '/api/auth/login';

export const LoginPage = () => {
  
  const [isLodingRest, setIsLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      correo: "",
      contrasena: "",
    },
  })

  const navigate = useNavigate();

  const { setUserLS } = useSession()

  const [login, { loading: loadingGql, error }] = useMutation(LOGIN_USER);
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    try {

      if(API_MODE === 'rest' || 1 === 1) {
        loginRest(values)
      }else{
        const { data } = await login({ variables: {
          loginDto: {
            ...values
          }
        }});

        if (data?.login) {
          const session = data?.login as AuthResponse;

          setUserLS(session);

          toast.success("Autenticación completada", {
            closeButton: true,
            icon: <Check className="text-green-700" />,
          })

          setTimeout(() => {
            navigate({
              pathname:`/profile/${session.usuario?.id}`
            });
          }, 1000);
        }
      }
      ;
    } catch (error) {
      console.log(error)
    }
  }

  async function loginRest(values: any) {
    setIsLoading(true);
    await fetch(`${URL_USUARIO}${PATH}`, {
      method: 'POST',
      credentials: 'include',
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
        const session = res as AuthResponse;

        setUserLS(session);

        toast.success("Autenticación completada", {
          closeButton: true,
          icon: <Check className="text-green-700" />,
        })

        setTimeout(() => {
          navigate({
            pathname:`/profile/${session.usuario?.id}`
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
  }

  if(API_MODE === 'gql' && error) {
    toast.error("Error", {
      description: error.message,
      closeButton: true,
      icon: <CircleX className="text-destructive"/>,
    })
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
                  <div className="flex items-center relative">
                    <FormControl>
                      <Input 
                        placeholder="Escribe tu contraseña" 
                        type={showPassword ? "text" : "password"}
                        {...field} 
                      />
                    </FormControl>
                    <div className="flex p-1 px-2 hover:bg-gray-200 hover:cursor-pointer h-full items-center rounded-[3px] absolute right-0" onClick={() => setShowPassword(!showPassword)}>
                      {
                        showPassword 
                        ? (<EyeOff />)
                        : (<Eye />)
                      }
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <a className="text-primary underline-offset-4 hover:underline cursor-pointer m-0 mx-auto">Ovildaste tu contraseña</a>
            <div className="m-0">
              {
                (API_MODE === 'rest' ? isLodingRest : loadingGql) 
                ? (<Button variant="default" size="btnAuth" disabled>
                  <Loader2 className="animate-spin" />
                  Cargando
                </Button>)
                : (<><Button variant="default" size="btnAuth" type="submit">Ingresar</Button></>)
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