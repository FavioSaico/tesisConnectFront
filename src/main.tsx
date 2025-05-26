import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router";
import { ApolloProvider } from '@apollo/client';

import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: `${import.meta.env.VITE_URL_USUARIO}/graphql`, // Cambia según tu backend
  cache: new InMemoryCache(),
  // credentials: 'include', // Necesario si usas cookies
});

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
    
  // </StrictMode>,
)
