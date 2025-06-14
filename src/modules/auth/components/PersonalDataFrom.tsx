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

// esquema del formulario
const formSchema = z.object({
  nombre: z.string().min(2),
  apellidos: z.string().min(2),
  correo: z.string().email({
    message: "Ingrese un correo electrónico válido"
  }), // campo nombre
  contrasenia: z.string().min(6, {
    message: "Ingrese una contraseña válida"
  }),
})

interface Props {
  setNextPage: (value: React.SetStateAction<boolean>) => void;
  setDataPersonal: (value: React.SetStateAction<{
    nombre: string,
    apellidos:  string,
    correo:  string,
    contrasenia:  string,
  }>) => void;
}

export const PersonalDataFrom: React.FC<Props> = ({setNextPage, setDataPersonal}) => {

  // useform se basa en el tipo definido en el schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // resolver para hacer las validaciones
    defaultValues: {
      nombre: "afsdgf",
      apellidos: "asfsdgsd",
      correo: "adasdda6@gmail.com",
      contrasenia: "adfdsgsdg",
    },
  })
  
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
                <FormControl>
                  <Input placeholder="Escribe tu contraseña" type="password" {...field} />
                </FormControl>
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