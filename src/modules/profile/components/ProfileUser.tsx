import { useContext, useEffect, useState } from "react";
import { CircleX, Loader2, Pencil } from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { SessionContext } from "@/context/AuthContext";
import { Usuario } from "@/types/Usuario";
import portadaDefault from "/portada.jpg";
import perfilDefault from "/perfil.png";
import { ModalSolicitarAsesoria } from "./ModalSolicitarAsesoria";

const URL_BASE = "http://localhost:3000"; // 'https://api-usuario-609569711189.us-central1.run.app';
const PATH = '/api/auth/informacion';

export const ProfileUser = () => {
  const { id } = useParams()
  const context = useContext(SessionContext);
  const currentUser = context?.currentUser?.usuario;
  const [usuario, setUsuario] = useState<Usuario>();

  async function obtenerUsuarioWithId() {
    await fetch(`${URL_BASE}${PATH}/${id}`,{
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
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
        const usuarioData = res as Usuario;
        setUsuario(usuarioData);
      }
    })
    .catch(() => {
      toast.error("Error", {
        description: "Error en el servidor",
        closeButton: true,
        icon: <CircleX className="text-destructive"/>,
      })
    })
  }

  useEffect(()=>{

    setUsuario(undefined);

    if (!id) return
    // const session = context?.currentUser;
    if(currentUser && id === currentUser.id) {
      setUsuario(currentUser)
    }else{
      obtenerUsuarioWithId()
    }

  }, [id])

  if(!usuario) {
    return (
      <div className="userSection md:col-span-2 flex flex-col gap-3">
        <Loader2 className="animate-spin text-primary mx-auto" size={40}/>
      </div>
    )
  }

  // Queda hacer una revisión de la sesión
  return (
    <section className="userSection md:col-span-2 flex flex-col gap-3">
      <div className="border rounded-xl">
        <div className="relative h-[200px]">
          <img src={portadaDefault} alt="" className="w-full h-full rounded-t-xl"/>
          <img src={perfilDefault} alt="" className="w-28 absolute -bottom-8 ml-4"/>
        </div>
        <div className="mt-10 flex flex-col gap-4 px-4 pb-4">
          <article>
            {/* Nombres */}
            <div className="">
              <div className="flex gap-4">
                <p className="text-2xl font-semibold">{usuario.nombres} {usuario.apellidos}</p>
                {/* Roles */}
                <div className="flex gap-2">
                  {
                    usuario.rol_asesor
                    ? (<h3 className="bg-primary py-1 px-3 text-white rounded-[1.6rem] w-auto">
                        Asesor
                      </h3>
                    )
                    : (
                      <h3 className="bg-primary py-1 px-3 text-white rounded-[1.6rem] w-auto">
                        Tesista
                      </h3>
                    )
                  }
                </div>
                <article className="ml-auto">
                  {
                    id !== currentUser?.id && usuario.rol_asesor 
                    ? <ModalSolicitarAsesoria destinatarioId={id ?? ''} remitenteId={currentUser?.id ?? ''} /> : <></>
                  }
                </article>
                {
                  id === currentUser?.id ? <Pencil className="ml-auto cursor-pointer"/> : <></>
                }
              </div>
              <p className="font-medium">{usuario.grado_academico.nombre} en {usuario.carrera_profesional.nombre}</p>
            </div>
            
          </article>
          <article className="">
            <header className="flex justify-between">
              <h4 className="font-semibold">Especialidades</h4>
              {
                id === currentUser?.id ? <Pencil className="ml-auto"/> : <></>
              }
            </header>
            {
              usuario.especialidades.map((especialidad) => (
                <li key={especialidad.idEspecialidad}>
                  {especialidad.nombreEspecialidad}
                </li>
              ))
            }
          </article>
        </div>
      </div>
      {/* Acerca de */}
      <article className="border rounded-xl p-4">
        <header className="flex justify-between">
          <h4 className="font-semibold">Acerca de</h4>
          {
            id === currentUser?.id ? <Pencil className="ml-auto"/> : <></>
          }
        </header>
        <p>{usuario.descripcion}</p>
        <p>{usuario.linea_investigacion}</p>
      </article>
      {/* Publicaciones */}
      <article className="border rounded-xl p-4">
        <header className="flex justify-between">
          <h4 className="font-semibold">Publicaciones</h4>
          {
            id === currentUser?.id ? <Pencil className="ml-auto"/> : <></>
          }
        </header>
        <ul className="flex gap-2 flex-col mt-2">
          {
            usuario.publicaciones.map((publicacion, i) => (
              <li key={i} className="border rounded-[5px] p-2">
                <p className="font-medium">{publicacion.titulo}</p>
                <p>{publicacion.revista} {`(${publicacion.anioPublicacion})`}</p>
                <p>Enlace: <a href={publicacion.urlPublicacion} className="text-primary underline-offset-4 hover:underline cursor-pointer m-0 break-all">{publicacion.urlPublicacion}</a></p>
              </li>
            ))
          }
        </ul>
      </article>
    </section>
  )
}
