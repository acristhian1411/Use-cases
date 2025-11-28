# --- Etapa 1: Build ---
FROM node:22-slim AS builder
WORKDIR /app

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instala TODAS las dependencias
RUN pnpm install --frozen-lockfile

# Copia el resto del código
COPY . .

# Construye la app
RUN pnpm build

RUN touch /app/sqlite.db && chmod 666 /app/sqlite.db

ENV DATABASE_URL=file:/app/sqlite.db
ENV ORIGIN=http://localhost:81
# --- Etapa 2: Producción ---
FROM node:22-slim AS runner
WORKDIR /app

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copia archivos necesarios
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Instala SOLO dependencias de producción
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "build"]