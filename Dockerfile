FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia código
COPY . .

# Build só se for produção
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN [ "$NODE_ENV" = "production" ] && yarn build || echo "Development mode, skipping build"

# Expor porta 5173
EXPOSE 5173

# CMD decide se é dev ou prod
CMD sh -c 'if [ "$NODE_ENV" = "production" ]; then yarn preview --port 5173 --host; else yarn dev --host 0.0.0.0; fi'
