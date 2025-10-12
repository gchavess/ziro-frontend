FROM node:20-alpine

WORKDIR /app

# Copia dependências primeiro (para cache eficiente)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia o restante do código
COPY . .

# Define e propaga o ambiente
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Build do Vite apenas se for produção
RUN if [ "$NODE_ENV" = "production" ]; then yarn build --mode production; else echo "Development mode, skipping build"; fi

EXPOSE 5173

# O comando final é controlado via docker-compose (flexível)
CMD ["sh", "-c", "echo 'Use docker-compose to start the right mode (dev or prod)'"]
