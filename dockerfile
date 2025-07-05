FROM node:20-alpine

WORKDIR /app

# Copiamos solo los archivos necesarios para instalar dependencias
COPY package.json yarn.lock ./

# Usamos corepack para activar yarn
RUN corepack enable && yarn set version stable

EXPOSE 5173

# Instalamos dependencias y ejecutamos Vite dentro del contenedor
CMD ["sh", "-c", "yarn install && yarn dev"]