import "./auth.css";
import { useState } from "react"
import { PersonalDataFrom } from "../components/PersonalDataFrom"
import { AcademicDataFrom } from "../components/AcademicDataFrom";


export const RegisterPage = () => {

  const [nextPage, setNextPage] = useState<boolean>(false);

  // Queda hacer una revisión de la sesión
  return (
    <div className="container-auth">
      <div className="container-login">
      <h1 className="title-register">Registro de usuario</h1>
        {
          !nextPage 
          ? (<PersonalDataFrom setNextPage={setNextPage}/>)
          : (<AcademicDataFrom setNextPage={setNextPage}/>)
        }
        
      </div>
    </div>
  )
}