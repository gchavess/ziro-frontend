FROM node:20-alpine

WORKDIR /app

# Copia dependências primeiro (cache)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia o restante do código
COPY . .

# Define o ambiente
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Build do Vite apenas se for produção
RUN if [ "$NODE_ENV" = "production" ]; then yarn build --mode production; else echo "Development mode, skipping build"; fi

EXPOSE 5173

# O docker-compose vai definir o comando correto
CMD ["sh", "-c", "echo 'Use docker-compose to start the right mode (dev or prod)'"]
