import portadaDefault from "/portada.jpg";
import perfilDefault from "/perfil.png";

export const ProfilePage = () => {

  // Queda hacer una revisión de la sesión
  return (
    <div className="mt-3 mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1200px]">
      <section className="userSection md:col-span-2">
        <div className="relative h-[200px]">
          <img src={portadaDefault} alt="" className="w-full h-full rounded-t-xl"/>
          <img src={perfilDefault} alt="" className="w-28 absolute -bottom-8 ml-4"/>
        </div>
        <article className="mt-10 ml-4">
          <div className="mb-2">
            <p>Graciela Pérez Bezada</p>
            <p>Estudiante de pregrado</p>
          </div>
          <div className="flex gap-2">
            <h3 className="bg-primary py-1 px-3 text-white rounded-[1.6rem] w-auto">
              Tesista
            </h3>
            <h3 className="bg-primary py-1 px-3 text-white rounded-[1.6rem] w-auto">
              Asesor
            </h3>
          </div>
        </article>

      </section>
      <section className="recomendaciones">
        Recomendaciones
      </section>
    </div>
    
  )
}
