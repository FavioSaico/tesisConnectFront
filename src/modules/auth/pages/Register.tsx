import "./auth.css";
import { useState } from "react"
import { PersonalDataFrom } from "../components/PersonalDataFrom"
import { AcademicDataFrom } from "../components/AcademicDataFrom";


export const RegisterPage = () => {

  const [nextPage, setNextPage] = useState<boolean>(false);

  const [dataPersonal, setDataPersonal] = useState<{
    nombre: string,
    apellidos: string,
    correo: string,
    contrasenia: string,
  }>({
    nombre: '',
    apellidos: '',
    correo: '',
    contrasenia: '',
  })
  // Queda hacer una revisión de la sesión
  return (
    <div className="container-auth">
      <div className={`${!nextPage ? 'container-login': 'container-login-academic'}`}>
      <h1 className="title-register">Registro de usuario</h1>
        {
          !nextPage 
          ? (<PersonalDataFrom setNextPage={setNextPage} setDataPersonal={setDataPersonal} dataPersonal={dataPersonal}/>)
          : (<AcademicDataFrom setNextPage={setNextPage} dataPersonal={dataPersonal}/>)
        }
        
      </div>
    </div>
  )
}