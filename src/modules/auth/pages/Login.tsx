import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

// esquema del formulario
const formSchema = z.object({
  correo: z.string().email({
    message: "Ingrese un correo electrónico válido"
  }), // campo nombre
  contrasenia: z.string().min(6, {
    message: "Ingrese una contraseña válida"
  }),
})


export const LoginPage = () => {
  
  // useform se basa en el tipo definido en el schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // resolver para hacer las validaciones
    defaultValues: {
      correo: "prueba@gmail.com",
      contrasenia: "12311432234",
    },
  })

  const navigate = useNavigate();

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Tienen validación por su tipo de datos
    console.log(values);
    
    navigate({
      pathname:'/profile'
    }); 
  }

  // Queda hacer una revisión de la sesión
  return (
    <div className="container-auth">
      <div className="container-login">
        <h1 className="title">Iniciar sesión</h1>
        {/* Form es el provider que pasa información de su contexto a sus hijos */}
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
              name="contrasenia"
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
            <Button variant="default" size="btnAuth" type="submit">Ingresar</Button>
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