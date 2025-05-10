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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"

const items = [
  {
    id: "recents",
    label: "Tesista",
  },
  {
    id: "home",
    label: "Asesor",
  },
  {
    id: "applications",
    label: "Colaborador",
  }
] as const

// esquema del formulario
const formSchema = z.object({
  gradoAcademico: z.string({
    required_error: "Selecciona un grado académico",
  }),
  roles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Selecciona al menos un rol",
  }),
  especialidades: z.string().min(6, {
    message: "Ingrese una especialidad válida"
  }),
  descripcion: z.string({
    required_error: "Ingrese una descripción"
  }),
  lineaInvestigacion: z.string({
    required_error: "Ingrese una línea de investigación"
  }),
  orcid: z.string({
    required_error: "Ingrese una descripción"
  }),
})

interface Props {
  setNextPage: (value: React.SetStateAction<boolean>) => void;
}

export const AcademicDataFrom: React.FC<Props> = ({setNextPage}) => {

  // useform se basa en el tipo definido en el schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradoAcademico: "",
      roles: [],
      especialidades: "",
      descripcion: "",
      lineaInvestigacion: "",
      orcid: "",
    },
  })
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <>
      <h2 className="text-left text-base font-semibold mt-2 mb-4">Datos académicos</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex gap-5 flex-col">
          <FormField
            control={form.control}
            name="gradoAcademico"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grado académico</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tu grado académico" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roles"
            render={() => (
              <FormItem>
                <div className="">
                  <FormLabel className="text-base">Rol actual</FormLabel>
                </div>
                <div className="flex flex-row gap-2 justify-between p-3 border rounded-[5px]">
                  {items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="roles"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row gap-2 items-center"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal m-0">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="especialidades"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidades</FormLabel>
                <FormControl>
                  <Input placeholder="Agrega tus especialidades" type="text" {...field} />
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
                <FormLabel>Descripción personal</FormLabel>
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

          <FormField
            control={form.control}
            name="lineaInvestigacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción académica</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingresa tus líneas de investigación"
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orcid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código ORCID</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa tu código ORCID" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2 m-0">
            <Button variant="default" size="btnAuth" type="submit">Registrarme</Button>
            <Button variant="outline" size="btnAuth" type="reset" onClick={() => { setNextPage(false) }}>Volver</Button>
          </div>
          {/* <div className="inline-flex justify-center gap-1">
            <p className="inline">
            ¿Ya tienes una cuenta? <a 
                href="/auth/login"
                className="text-primary underline-offset-4 hover:underline cursor-pointer m-0"
              >Iniciar sesión</a>
            </p>
          </div> */}
        </form>
      </Form>
    </>
  )
}