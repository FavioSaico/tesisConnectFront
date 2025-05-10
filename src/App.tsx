import { SessionProvider } from './context/AuthContext'
import { AppRouter } from './general/AppRoutes'

function App() {

  return (
    <SessionProvider>
      <AppRouter/>
    </SessionProvider>
  )
}

export default App
