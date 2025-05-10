import portadaDefault from "/portada.jpg";
import perfilDefault from "/perfil.png";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "@/context/AuthContext";
import { AuthResponse } from "@/types/Usuario";
import { Pencil } from "lucide-react";

export const ProfilePage = () => {

  const context = useContext(SessionContext);
  const [session, setSession] = useState<AuthResponse>();

  useEffect(()=>{
    if(context?.currentUser) {
      setSession(context.currentUser)
    }
  }, [])

  if(!session) {
    return (<>No autenticado</>)
  }

  // Queda hacer una revisión de la sesión
  return (
    <div className="mt-3 mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1200px]">
      <section className="userSection md:col-span-2  flex flex-col gap-3">
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
                  <p className="text-2xl font-semibold">{session.usuario?.nombres} {session.usuario?.apellidos}</p>
                  {/* Roles */}
                  <div className="flex gap-2">
                    {
                      session.usuario?.rol_asesor
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
                  {/* <Button className="ml-auto p-0 has-[>svg]:px-0 border-none w-[30px]" variant={"outline"}> */}
                    <Pencil className="ml-auto"/>
                  {/* </Button> */}
                  
                </div>
                <p>{session.usuario?.grado_academico.nombre}</p>
              </div>
              
            </article>
            <article className="">
              <header className="flex justify-between">
                <h4>Especialidades</h4>
                <Pencil />
              </header>
              {
                session.usuario?.especialidades.map((especialidad) => (
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
            <Pencil />
          </header>
          <p>{session.usuario?.descripcion}</p>
          <p>{session.usuario?.linea_investigacion}</p>
        </article>
        {/* Publicaciones */}
        <article className="border rounded-xl p-4">
          <header className="flex justify-between">
            <h4 className="font-semibold">Publicaciones</h4>
            <Pencil />
          </header>
          <ul className="flex gap-2 flex-col mt-2">
            {
              session.usuario?.publicaciones.map((publicacion, i) => (
                <li key={i} className="border rounded-[5px] p-2">
                  <p className="font-medium">{publicacion.titulo}</p>
                  <p>{publicacion.revista} {`(${publicacion.anioPublicacion})`}</p>
                  <p>Enlace: <a href={publicacion.urlPublicacion} className="text-primary underline-offset-4 hover:underline cursor-pointer m-0">{publicacion.urlPublicacion}</a></p>
                </li>
              ))
            }
          </ul>
        </article>
      </section>
      <section className="recomendaciones">
        Recomendaciones
      </section>
    </div>
    
  )
}
