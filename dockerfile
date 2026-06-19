# --- Etapa 1: Build ---
FROM node:22-slim AS builder
WORKDIR /app

ARG CSRF_TRUSTED_ORIGINS=http://localhost:81,http://127.0.0.1:81,http://192.168.0.14:81
ENV CSRF_TRUSTED_ORIGINS=${CSRF_TRUSTED_ORIGINS}

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

# Copia archivos de dependencias
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Instala TODAS las dependencias
RUN pnpm install --frozen-lockfile

# Copia el resto del código
COPY . .

# Construye la app
RUN pnpm build

RUN touch /app/sqlite.db && chmod 666 /app/sqlite.db

ENV DATABASE_URL=file:/app/sqlite.db
# --- Etapa 2: Producción ---
FROM node:22-slim AS runner
WORKDIR /app

# Instala pnpm
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

# Copia archivos necesarios
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/sqlite.db ./sqlite.db

ARG CSRF_TRUSTED_ORIGINS=http://localhost:81,http://127.0.0.1:81,http://192.168.0.14:81
ENV DATABASE_URL=file:/app/sqlite.db
ENV CSRF_TRUSTED_ORIGINS=${CSRF_TRUSTED_ORIGINS}

# Instala SOLO dependencias de producción
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["node", "build"]