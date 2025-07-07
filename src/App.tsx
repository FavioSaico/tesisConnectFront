import { SessionProvider } from './context/AuthContext'
import { AppRouter } from './general/AppRoutes'
import { ChatFloating } from './modules/chat/components/ChatFloating'

function App() {

  return (
    <SessionProvider>
      <AppRouter/>
      <ChatFloating/>
    </SessionProvider>
  )
}

export default App
