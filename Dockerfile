FROM node:20-alpine

WORKDIR /app

# Copia package.json e yarn.lock
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia todo o código e arquivos .env
COPY . .

# Define NODE_ENV (padrão development)
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Build do Vite com mode production, se NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then yarn build --mode production; else echo "Development mode, skipping build"; fi

EXPOSE 5173

# Comando para iniciar: preview em produção, dev em desenvolvimento
CMD if [ "$NODE_ENV" = "production" ]; then yarn preview --port 5173 --host; else yarn dev --host 0.0.0.0; fi
