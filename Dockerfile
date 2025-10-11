FROM node:20-alpine

WORKDIR /app

# Copia package.json e yarn.lock
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copia todo código e env files
COPY . .

# Define NODE_ENV
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Build só se for produção
RUN if [ "$NODE_ENV" = "production" ]; then yarn build; else echo "Development mode, skipping build"; fi

EXPOSE 5173

CMD if [ "$NODE_ENV" = "production" ]; then yarn preview --port 5173 --host; else yarn dev --host 0.0.0.0; fi
