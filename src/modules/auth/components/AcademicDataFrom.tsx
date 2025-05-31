"use client"
import {
  Form,
  FormControl,
  FormDescription,
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Check, CircleX, Loader, Loader2} from "lucide-react"
import { toast } from "sonner"

import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "@apollo/client"
import { AuthResponse, CarreraProfesionalItem, EspecialidadItem, GradoAcademicoItem, UniversidadItem } from "@/types/Usuario"
import { GET_CARRERA_PROFESIONAL, GET_ESPECIALIDADES, GET_GRADOS_ACADEMICOS, GET_UNIVERSIDAD, REGISTER_USER } from "../graphql/registerUser"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useSession } from "@/context/AuthContext"

interface Props {
  setNextPage: (value: React.SetStateAction<boolean>) => void
  dataPersonal: {
    nombre: string,
    apellidos: string,
    correo: string,
    contrasenia: string,
  }
}

interface GradoAcademicoData {
  getGradosAcademicos: GradoAcademicoItem[]
}
interface EspecialidadesData {
  getEspecialidades: EspecialidadItem[]
}
interface CarrerasProfesionalesData {
  getCarrerasProfesionales: CarreraProfesionalItem[]
}

interface UniversidadesData {
  getUniversidades: UniversidadItem[]
}

const API_MODE = import.meta.env.VITE_API_MODE;

const items = [
  {
    id: "1",
    label: "Tesista",
  },
  {
    id: "2",
    label: "Asesor",
  }
] as const

// esquema del formulario
const formSchema = z.object({
  gradoAcademico: z.string().min(1, {
    message: "Seleccione un grado académico"
  }),
  carreraProfesional: z.string().min(1, {
    message: "Seleccione una carrera profesional"
  }),
  universidad: z.string().min(1,{
    message: "Selecciona una universidad"
  }),
  especialidades: z.array(z.object({ id: z.string(),nombre: z.string()}), {
    message: "Selecciona por lo menos una especialidad"
  }).min(1, {
    message: "Selecciona por lo menos una especialidad"
  }),
  roles: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Selecciona al menos un rol",
  }),
  descripcion: z.string().min(1,{
    message: "Ingrese una descripción personal"
  }),
  lineaInvestigacion: z.string().min(1,{
    message: "Ingrese una descripción académica"
  }),
  orcid: z.string().optional(),
})

export const AcademicDataFrom: React.FC<Props> = ({setNextPage, dataPersonal}) => {

  const { data: gradosAcademicosData, loading, error } = useQuery<GradoAcademicoData>(GET_GRADOS_ACADEMICOS);
  const { data: especialidadData, loading: loadingEspecialidades, error: errorEspecialidades } = useQuery<EspecialidadesData>(GET_ESPECIALIDADES);
  const { data: carrerasData, loading: loadingCarreras, error: errorCarreras } = useQuery<CarrerasProfesionalesData>(GET_CARRERA_PROFESIONAL);
  const { data: universidadesData, loading: loadingUniversidades, error: errorUniversidades } = useQuery<UniversidadesData>(GET_UNIVERSIDAD);

  const [register, { loading: loadingGql, error: errorRegister }] = useMutation(REGISTER_USER);
  // useform se basa en el tipo definido en el schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gradoAcademico: "",
      carreraProfesional: "",
      universidad: "",
      especialidades: [],
      roles: [],
      descripcion: "",
      lineaInvestigacion: "",
      orcid: "",
    },
  })

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [especilidadesValue, setEspecilidadesValue] = useState<EspecialidadItem[]>([])
  const [especilidadCurrent, setEspecilidadCurrent] = useState<EspecialidadItem>()

  const containerRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate();
  const { setUserLS } = useSession();

  const handleOnChangeValue = (e: any) => {
    setInputValue(e.target.value)
    setOpen(true)
  }

  const handleSelect = (value: EspecialidadItem) => {
    setInputValue(value.nombre)
    setEspecilidadCurrent(value)
    setOpen(false)
  }

  const handleClickEspecialidades = () => {
    if(especilidadCurrent){
      setInputValue('');
      setEspecilidadCurrent(undefined)
      setEspecilidadesValue([...especilidadesValue, especilidadCurrent])
      form.setValue("especialidades", [...especilidadesValue, especilidadCurrent], { shouldValidate: true })
    }
  }

  const handleRemoveEspecialidades = (es: EspecialidadItem) => {
    const newEspecialidades = especilidadesValue.filter(esp => esp.id !== es.id)
    setEspecilidadesValue(newEspecialidades)
    form.setValue("especialidades", newEspecialidades, { shouldValidate: true })
  }

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    registerGql(values)
  }

  const registerGql = async (values: z.infer<typeof formSchema>) => {
    const { data } = await register({ variables: {
      registerDto: {
        "correo": dataPersonal.correo,
        "contrasena": dataPersonal.contrasenia,
        "nombres": dataPersonal.nombre,
        "apellidos": dataPersonal.apellidos,
        "descripcion": values.descripcion,
        "rol_tesista": values.roles.some(rol => rol === '1'),// !values.roles[0] ? true : (values.roles[0] === '1' ? true: false),
        "rol_asesor": values.roles.some(rol => rol === '2'),// !values.roles[1] ? false : (values.roles[1] === '1' ? true: false),
        "orcid": values.orcid ?? '',
        "id_grado_academico": Number(values.gradoAcademico),
        "id_universidad": Number(values.universidad),
        "linea_investigacion": values.lineaInvestigacion,
        "id_carrera_profesional": Number(values.carreraProfesional),
        "especialidades": values.especialidades.map(es => ({
          "idEspecialidad": Number(es.id),
          "aniosExperiencia": 3
        })),
        // ...values
      }
    }});

    if (data?.register) {
      const session = data?.register as AuthResponse;

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  if(API_MODE === 'gql' && error) {
    toast.error("Error", {
      description: error.message,
      closeButton: true,
      icon: <CircleX className="text-destructive"/>,
    })
  }

  if(API_MODE === 'gql' && errorCarreras) {
    toast.error("Error", {
      description: errorCarreras.message,
      closeButton: true,
      icon: <CircleX className="text-destructive"/>,
    })
  }

  if(API_MODE === 'gql' && errorEspecialidades) {
    toast.error("Error", {
      description: errorEspecialidades.message,
      closeButton: true,
      icon: <CircleX className="text-destructive"/>,
    })
  }

  if(API_MODE === 'gql' && errorUniversidades) {
    toast.error("Error", {
      description: errorUniversidades.message,
      closeButton: true,
      icon: <CircleX className="text-destructive"/>,
    })
  }

  if(API_MODE === 'gql' && errorRegister) {
    toast.error("Error", {
      description: errorRegister.message,
      closeButton: true,
      icon: <CircleX className="text-destructive"/>,
    })
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
                    <ScrollArea className="h-[150px]">
                      {
                        loading 
                        ? <Loader size={16} />
                        : gradosAcademicosData && gradosAcademicosData.getGradosAcademicos.map((grado) => (
                          <SelectItem key={grado.id} value={grado.id}>{grado.nombre}</SelectItem>
                        ))
                      }
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carreraProfesional"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carrera profesional</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tu carrera profesional" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <ScrollArea className="h-[150px]">
                      {
                        loadingCarreras 
                        ? <Loader size={16} />
                        : carrerasData && carrerasData.getCarrerasProfesionales.map((grado) => (
                          <SelectItem value={grado.id}>{grado.nombre}</SelectItem>
                        ))
                      }
                    </ScrollArea>
                    
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="universidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Universidad</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="max-w-[418px]">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona tu universidad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-w-[418px]">
                    <ScrollArea className="h-[150px]">
                      {
                        loadingUniversidades 
                        ? <Loader size={16} />
                        : universidadesData && universidadesData.getUniversidades.map((uni) => (
                          <SelectItem value={uni.id}>{uni.nombre}</SelectItem>
                        ))
                      }
                    </ScrollArea>
                    
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="especialidades"
            render={() => (
              <FormItem className="flex flex-col relative">
                <FormLabel>Especialidades</FormLabel>
                  <div className="relative w-full" ref={containerRef}>
                    <div className="flex w-full gap-2">
                      <Input
                        onFocus={() => setOpen(true)}
                        placeholder='Agregar tus especialidades'
                        value={inputValue}
                        onChange={(e) => {
                          handleOnChangeValue(e)
                        }}
                        className="pr-8 text-[14px]"
                      />
                      <Button variant="default" size="default" 
                        onClick={(e) => {
                          e.preventDefault()
                          handleClickEspecialidades()
                        }}
                      >
                        Agregar
                      </Button>
                    </div>
                    {
                      open &&
                      <Command
                        className="absolute z-10 bottom-[-157px] border w-full h-[150px]"
                        shouldFilter={true}
                      >
                        <CommandInput
                          placeholder="Search framework..."
                          className="h-9 hidden"
                          onFocus={() => setOpen(true)}
                          value={inputValue}
                          onValueChange={setInputValue}
                        />
                        <CommandList>
                          <CommandEmpty>Especialidad no encontrada.</CommandEmpty>
                          {
                            loadingEspecialidades
                            ? <Loader size={16} />
                            : especialidadData && (
                              <CommandGroup>
                                {especialidadData.getEspecialidades.map((opt) => {
                                  
                                  if(especilidadesValue.some(es => es.id === opt.id)) return <></>
                                  
                                  return <CommandItem
                                    key={opt.id}
                                    value={opt.nombre}
                                    onSelect={() => handleSelect(opt)}
                                  >
                                    {opt.nombre}
                                    {inputValue === opt.nombre && (
                                      <Check className="ml-auto h-4 w-4 text-primary" />
                                    )}
                                  </CommandItem>
                                })}
                              </CommandGroup>
                            )
                          }
                        </CommandList>
                      </Command>
                    }
                  </div>
                  <div className="flex gap-x-3 gap-y-2 m-0 flex-wrap mt-3">
                    {
                      especilidadesValue.map((es) => (
                        //  flex gap-1 items-center
                        <div key={es.id} className="py-1 px-1.5 border text-[12px] rounded-[5px] bg-[#FAFAFA] relative">
                          <p>{es.nombre}</p>
                          <CircleX 
                            size={16}
                            onClick={() => {
                              handleRemoveEspecialidades(es)
                            }}
                            className="absolute top-[-0.5rem] right-[-0.5rem] bg-black rounded-2xl text-white cursor-pointer"
                          />
                          {/* <Button variant="outline" size="icon">
                          </Button> */}
                        </div>
                      ))
                    }
                  </div>
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
                <div className="flex flex-row gap-8 p-3 border rounded-[5px]">
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
                <FormLabel>Ingresa tu código ORCID</FormLabel>
                <FormControl>
                  <Input placeholder="Ingresa tu código ORCID" type="text" {...field} />
                </FormControl>
                <FormDescription>Puedes colocar tu código ORCID para completar información sobre tus trabajos acádemicos.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2 m-0">
            {
              (loadingGql) 
                ? (<Button variant="default" size="btnAuth" disabled>
                  <Loader2 className="animate-spin" />
                  Cargando
                </Button>)
                : <Button variant="default" size="btnAuth" type="submit">Registrarme</Button>
            }
            <Button variant="outline" size="btnAuth" type="reset" disabled={loadingGql} onClick={() => { setNextPage(false) }}>Volver</Button>
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