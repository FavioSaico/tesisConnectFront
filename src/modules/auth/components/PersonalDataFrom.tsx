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

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

// esquema del formulario
const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener mínimo 2 letras"
  }),
  apellidos: z.string().min(2, {
    message: "El apellido debe tener mínimo 2 letras"
  }),
  correo: z.string().email({
    message: "Ingrese un correo electrónico válido"
  }), // campo nombre
  contrasenia: z.string()
  .min(6, { message: "Ingrese una contraseña válida" })
  .max(32, "Máximo 32 caracteres")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "Debe contener al menos un número")
  .regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo"),
})

interface Props {
  setNextPage: (value: React.SetStateAction<boolean>) => void;
  setDataPersonal: (value: React.SetStateAction<{
    nombre: string,
    apellidos:  string,
    correo:  string,
    contrasenia:  string,
  }>) => void;
  dataPersonal: {
    nombre: string,
    apellidos: string,
    correo: string,
    contrasenia: string,
  }
}

export const PersonalDataFrom: React.FC<Props> = ({setNextPage, setDataPersonal, dataPersonal}) => {

  // useform se basa en el tipo definido en el schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // resolver para hacer las validaciones
    defaultValues: {
      nombre: dataPersonal.nombre,
      apellidos: dataPersonal.apellidos,
      correo: dataPersonal.correo,
      contrasenia: dataPersonal.contrasenia,
    },
  })

  const [showPassword, setShowPassword] = useState(false);
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    setNextPage(true);
    setDataPersonal({...values})
  }

  return (
    <>
      <h2 className="text-left text-base font-semibold mt-2 mb-4">Datos personales</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex gap-10 flex-col">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input placeholder="Escribe tus nombres" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apellidos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Escribe tus apellidos" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
          <Button variant="default" size="btnAuth" type="submit">Siguiente</Button>
          <div className="inline-flex justify-center gap-1">
            <p className="inline">
            ¿Ya tienes una cuenta? <a 
                href="/auth/login"
                className="text-primary underline-offset-4 hover:underline cursor-pointer m-0"
              >Iniciar sesión</a>
            </p>
          </div>
        </form>
      </Form>
    </>
  )
}