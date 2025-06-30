import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router";
import { ApolloProvider, createHttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';


const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_URL_USUARIO}/graphql`,
  credentials: 'include'
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
console.log(import.meta.env.VITE_URL_USUARIO);

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
    
  // </StrictMode>,
)
