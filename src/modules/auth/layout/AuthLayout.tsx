
import logo from "../../../assets/logo.png";

interface Props {
  children?: React.ReactNode;
}

export const AuthLayout: React.FC<Props> = ({children}) => {

  // Queda hacer una revisión de la sesión
  return (
    <div className="w-full min-h-screen p-5">
      <header className="w-full">
        <div className="logo_container w-max max-w-72">
          <img src={logo} alt="logo_tesisconnect" className="w-full" />
        </div>
      </header>

      {children}
    </div>
  )
}
