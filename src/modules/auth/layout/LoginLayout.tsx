
interface Props {
  children?: React.ReactNode;
}

export const AuthLayout: React.FC<Props> = ({children}) => {

  // Queda hacer una revisión de la sesión
  return (
    <>
      <h1>Layout</h1>
      {children}
    </>
  )
}
