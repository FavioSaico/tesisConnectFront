// import { useSession } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { AuthResponse, Usuario } from "@/types/Usuario";
import { useNavigate } from "react-router";

import perfilDefault from "/perfil.png";
import { CircleX, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Recomendaciones, RecomendationsResponse } from "@/types/Recomendaciones";

import './profile.css';
import { Progress } from "@/components/ui/progress";

const URL_BASE = import.meta.env.VITE_URL_BASE;
const URL_BASE_R = 'http://localhost:8000';
const PATH_RECOMENDACIONES = '/recomendaciones/por-id-y-fecha?id_investigador=';
const PATH_USUARIO = '/api/auth/informacion';


export type UsuarioRecomendado = Usuario & { puntaje: number }

export const Recomendations = () => {

  // const sessionContext = useSession();
  const navigate = useNavigate();
  // const id = 1

  const [ recomendaciones, setRecomendaciones ] = useState<Recomendaciones[]>([])
  const [ usuarios, setUsuarios ] = useState<UsuarioRecomendado[]>([])
  const [ loading, isLoading ] = useState<boolean>(true)

  async function obtenerRecomendacionesWithId() {
    isLoading(true);
    const usuario = JSON.parse(localStorage.getItem('user') ?? '') as AuthResponse ;
    // console.log(usuario)
    const id = usuario.usuario?.id

    if(!id) {
      isLoading(false)
      return
    }
    
    await fetch(`${URL_BASE_R}${PATH_RECOMENDACIONES}${id}`,{
      method: 'GET',
        headers:{
          'Content-Type': 'application/json'
        },
    })
    .then((res) => res.json())
    .then(res => {
      console.log(res)
      if(res.message) {
        toast.error("Error", {
          description: res.error ?? res.message,
          closeButton: true,
          icon: <CircleX className="text-destructive"/>,
        })
      }else{
        const recomendacionesData = res as RecomendationsResponse;

        const uniqueItems = Array.from(
          new Map(recomendacionesData.recomendaciones.map(item => [item.idUsuarioRecomendado, item])).values()
        );
        const uniqueItems2 = uniqueItems.filter(u => u.idUsuarioRecomendado !== u.idInvestigador);

        if(uniqueItems2.length === 0) {
          isLoading(false)
          return;
        }

        setRecomendaciones(uniqueItems2.slice(0,6));
      }
    })
    .catch(() => {
      toast.error("Error", {
        description: "Error al obtener recomendaciones",
        closeButton: true,
        icon: <CircleX className="text-destructive"/>,
      })
      // setRecomendaciones([]);
      isLoading(false)
    })
    
  }

  async function obtenerDataUsuarioRecomendacionesWithId() {

    if(!recomendaciones) return;

    // if(recomendaciones.length === 0) {
    //   isLoading(false)
    //   return;
    // }

    const users: UsuarioRecomendado[] = [];

    const usuariosPeticion = recomendaciones.map( async (recomendacion) => {
      return fetch(`${URL_BASE}${PATH_USUARIO}/${recomendacion.idUsuarioRecomendado}`,{
        method: 'GET',
          headers:{
            'Content-Type': 'application/json'
          },
      })
      .then((res) => res.json())
      .then(res => {
        if(res.message) {
          toast.error("Error", {
            description: res.error ?? res.message,
            closeButton: true,
            icon: <CircleX className="text-destructive"/>,
          })
        }else{
          const usuarioData = {...res, puntaje: Number((recomendacion.puntaje*100).toFixed(2))} as UsuarioRecomendado;
          isLoading(false)
          return usuarioData;
          // users.push(usuarioData)
        }
        
      })
      .catch(() => {
        toast.error("Error", {
          description: "Error al obtener usuarios recomendados",
          closeButton: true,
          icon: <CircleX className="text-destructive"/>,
        })
        // throw new Error('Error en la petición');
        // setUsuarios([]);
        isLoading(false)
      })
    })

    const datos = await Promise.all(usuariosPeticion);

    datos.forEach((dato) => {
      if(dato) users.push(dato)
    })

    setUsuarios(users);
  }

  function handleClickUser(id: string) {
    navigate({
      pathname:`/profile/${id}`
    });
  }

  useEffect(()=>{
    obtenerRecomendacionesWithId();
  }, [])

  useEffect(() => {
    obtenerDataUsuarioRecomendacionesWithId()
  }, [recomendaciones])

  const tesistas = usuarios.filter(u => !u.rol_asesor)
  const asesores = usuarios.filter(u => u.rol_asesor)

  return (
    <section className="border rounded-xl p-4">
      <div>
        <h2 className="font-bold text-xl">Recomendaciones</h2>
      </div>
      {
        (loading) 
        ? (<div className="loader"></div>)
        : (
          <>
            <div>
              <p className="font-semibold">Asesores</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2 mt-2">
                {
                  asesores.map((usuario,i) => {
                    return (
                    <li key={i} className="border rounded-[5px] p-3 flex gap-4 items-start cursor-pointer" onClick={()=> handleClickUser(usuario.id)}>
                      <div className="relative w-[55px]">
                        <img src={perfilDefault} alt="" className="w-[55px]"/>
                      </div>
                      <div className="flex flex-col gap-2 h-full max-w-[264px]">
                        <p className="font-medium">{`${usuario.nombres} ${usuario.apellidos}`}</p>
                        <p className="text-xs">{usuario.linea_investigacion}</p>
                        <div className="flex gap-4 items-center">
                          <Progress value={usuario.puntaje} className="w-[40%]" />
                          <p className="text-xs">{usuario.puntaje}% de afinidad</p>
                        </div>
                        <Button variant="default" size='sm' className="cursor-pointer max-w-32 mt-auto">
                          <UserRoundPlus />
                          Conectar
                        </Button>
                      </div>
                    </li>
                    )
                  })
                }
              </ul>
            </div>
            <div>
              <p className="font-semibold mt-3">Personas con tus mismos intereses</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2 mt-2">
                  {
                    tesistas.map((usuario,i) => {
                      return (
                      <li key={i} className="border rounded-[5px] p-3 flex gap-4 items-start cursor-pointer" onClick={()=> handleClickUser(usuario.id)}>
                        <div className="relative w-[55px]">
                          <img src={perfilDefault} alt="" className="w-[55px]"/>
                        </div>
                        <div className="flex flex-col gap-2 h-full">
                          <p className="font-medium">{`${usuario.nombres} ${usuario.apellidos}`}</p>
                          <p className="text-xs">{usuario.linea_investigacion}</p>
                          <div className="flex gap-4 items-center">
                            <Progress value={usuario.puntaje} className="w-[40%]" />
                            <p className="text-xs">{usuario.puntaje}% de afinidad</p>
                          </div>
                          <Button variant="default" size='sm' className="cursor-pointer max-w-32 mt-auto">
                            <UserRoundPlus />
                            Conectar
                          </Button>
                        </div>
                      </li>
                      )
                    })
                  }
                </ul>
            </div>
          </>
        )
      }
      
    </section>
  )
}