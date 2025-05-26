import { useEffect, useState } from "react";
// import { Usuario } from "@/types/Usuario";
import { useNavigate } from "react-router";

import perfilDefault from "/perfil.png";
import { CircleX, UserRoundPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Recomendaciones, RecomendacionesUser, RecomendationsResponse } from "@/types/Recomendaciones";

import './profile.css';
import { Progress } from "@/components/ui/progress";
import { useSession } from "@/context/AuthContext";
import { GET_RECOMMENDED_USERS } from "../graphql/getUserRecomendations";
import { useLazyQuery } from "@apollo/client";

const URL_USUARIO = import.meta.env.VITE_URL_USUARIO
const URL_RECOMENDACIONES = import.meta.env.VITE_URL_RECOMENDACIONES
const API_MODE = import.meta.env.VITE_API_MODE;
const PATH_RECOMENDACIONES = '/recomendaciones/por-id-y-fecha?id_investigador=';
const PATH_USUARIO = '/api/auth/informacion';

export type UsuarioRecomendado = RecomendacionesUser;

interface UserData {
  getUsers: {
    id: string
    nombres: string
    apellidos: string
    linea_investigacion: string
    rol_asesor: boolean
  }[]
}

interface UserDataRest {
  id: string
  nombres: string
  apellidos: string
  linea_investigacion: string
  rol_asesor: boolean
}

interface UserVars {
  ids: number[];
}

export const Recomendations = () => {

  const navigate = useNavigate();

  const [ recomendaciones, setRecomendaciones ] = useState<Recomendaciones[]>([])
  const [ usuarios, setUsuarios ] = useState<UsuarioRecomendado[]>([])
  const [ loadingRest, setLoading ] = useState<boolean>(true)

  const [ getUsers, { loading: isLoadingGql, error }] = useLazyQuery<UserData, UserVars>(GET_RECOMMENDED_USERS);

  const { user } = useSession()

  async function obtenerRecomendacionesWithId() {
    setLoading(true);
    const usuario = user?.usuario;
    const id = usuario?.id

    if(!id) {
      setLoading(false)
      return
    }
    
    await fetch(`${URL_RECOMENDACIONES}${PATH_RECOMENDACIONES}${id}`,{
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
        setLoading(false)
      }else{
        const recomendacionesData = res as RecomendationsResponse;

        const uniqueItems = Array.from(
          new Map(recomendacionesData.recomendaciones.map(item => [item.idUsuarioRecomendado, item])).values()
        );
        const uniqueItems2 = uniqueItems.filter(u => u.idUsuarioRecomendado !== u.idInvestigador);

        if(uniqueItems2.length === 0) {
          setLoading(false)
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
      setLoading(false)
    })
    
  }

  async function getUsersGpl() {

    const { data } = await getUsers({
      variables: { ids: recomendaciones.map(re => re.idUsuarioRecomendado) }
    });

    if( !data ) return;

    const usersData =  data.getUsers.map( user => {
      let currentPuntaje = 0;
      recomendaciones.find(re => {
        if(user.id === re.idUsuarioRecomendado.toString()) {
          currentPuntaje = re.puntaje;
          return true
        }
        return false
      });

      return { ...user,  puntaje: Number((currentPuntaje*100).toFixed(2))}
    })

    setUsuarios(usersData)
  }

  async function getUsersRest() {

    const usuariosRest = await fetch(`${URL_USUARIO}${PATH_USUARIO}`,{
      method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: recomendaciones.map(re => re.idUsuarioRecomendado)
        })
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
        const usersData =  res.map( (user: UserDataRest) => {
          let currentPuntaje = 0;
          recomendaciones.find(re => {
            if(user.id === re.idUsuarioRecomendado.toString()) {
              currentPuntaje = re.puntaje;
              return true
            }
            return false
          });

          return { ...user,  puntaje: Number((currentPuntaje*100).toFixed(2))}
        }) as UsuarioRecomendado[]

        setLoading(false)
        return usersData;
      }
      
    })
    .catch(() => {
      toast.error("Error", {
        description: "Error al obtener usuarios recomendados",
        closeButton: true,
        icon: <CircleX className="text-destructive"/>,
      })
      setLoading(false)
    });

    setUsuarios(usuariosRest ?? []);
  }

  async function obtenerDataUsuarioRecomendacionesWithId() {

    if(!recomendaciones) return;

    if(!recomendaciones.length) return;

    if(API_MODE === 'rest') {
      getUsersRest()
    }else {
      getUsersGpl()
    }
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

  if(API_MODE === 'gql'  && error) {
    toast.error("Error", {
      description: error.message,
      closeButton: true,
      icon: <CircleX className="text-destructive"/>,
    })
  }

  const tesistas = usuarios.filter(u => !u.rol_asesor)
  const asesores = usuarios.filter(u => u.rol_asesor)

  return (
    <section className="border rounded-xl p-4">
      <div>
        <h2 className="font-bold text-xl">Recomendaciones</h2>
      </div>
      {
        (API_MODE === 'rest' ? loadingRest : isLoadingGql)
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