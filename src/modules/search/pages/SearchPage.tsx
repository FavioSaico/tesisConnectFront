import { useLazyQuery } from "@apollo/client"
import { GET_USERS_SEARCH } from "../graphql/getUsersSearch"
import { useEffect } from "react"
import { useSearchParams } from "react-router"
import { Usuario } from "@/types/Usuario"
import perfilDefault from "/perfil.png";

interface SearchResult {
  getUsersSearch: Usuario[]
}

export const SearchPage = () => {

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") ?? ""
  // console.log(searchTerm)
  const [fetchSearch, { data, loading, error }] = useLazyQuery<SearchResult>(GET_USERS_SEARCH)

  // Ejecuta cada vez que `q` cambia
  useEffect(() => {
    if (searchTerm.trim()) {
      fetchSearch({ variables: { term: searchTerm } })
    }
  }, [searchTerm, fetchSearch])

  return (
    <div className="mt-3 mx-auto max-w-[900px]">
      {loading && <p>Buscando...</p>}
      {error && <p>Error: {error.message}</p>}
      {data?.getUsersSearch?.length ? (
        <ul className="flex flex-col gap-2">
          {data.getUsersSearch.map((result) => (
            <a 
              key={result.id}
              href={`/profile/${result.id}`}
              className="border-1 rounded-[3px] px-3 py-2 md:px-6 md:py-4 flex flex-row gap-4 cursor-pointer hover:bg-gray-100"
            >
              <div className="w-10 md:w-14">
                <img src={perfilDefault} alt="profile" className="w-10 md:w-14"/>
              </div>
              <div className="flex gap-1 flex-col">
                <div className="flex gap-2 flex-row items-center">
                  <p className="text-[0.875rem] md:text-[1.25rem] font-bold ">{result.nombres} {result.apellidos}</p>
                  {
                    result.rol_asesor
                    ? (<h3 className="bg-primary py-0.5 px-3 text-white rounded-[1.6rem] w-auto text-[0.5rem] md:text-[0.75rem] flex items-center h-auto">
                        Asesor
                      </h3>
                    )
                    : (
                      <h3 className="bg-primary py-0.5 px-3 text-white rounded-[1.6rem] w-auto text-[0.5rem] md:text-[0.75rem] flex items-center h-auto">
                        Tesista
                      </h3>
                    )
                  }
                </div>
                <p className="text-[0.75rem] md:text-[0.875rem] font-semibold">{result.grado_academico?.nombre} en {result.carrera_profesional.nombre}</p>
                <p className="text-[0.75rem] md:text-[0.875rem] font-medium">{result.universidad?.nombre ?? '-'}</p>
                <p className="text-[0.75rem] md:text-[0.875rem]">{result.descripcion}</p>
              </div>
            </a>
          ))}
        </ul>
      ) : (
        !loading && <p className="w-full text-center">No hay resultados</p>
      )}
    </div>
  )
}
