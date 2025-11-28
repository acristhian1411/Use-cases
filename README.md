# Use Cases - Manual Testing Flow App

Aplicación web para gestionar casos de prueba manuales, construida con SvelteKit, TailwindCSS, Drizzle ORM y SQLite.

## 📋 Descripción

Esta aplicación permite crear y gestionar módulos de prueba, casos de prueba con pasos detallados y actores involucrados en el proceso de testing manual. Ideal para equipos de QA que necesitan documentar y organizar sus flujos de prueba.

### Características principales

- ✅ Gestión de módulos de prueba
- ✅ Creación y edición de casos de prueba
- ✅ Editor dinámico de pasos de prueba
- ✅ Gestión de actores
- ✅ Base de datos SQLite local
- ✅ Interfaz moderna con TailwindCSS
- ✅ Iconos con Lucide

## 🛠️ Stack Tecnológico

- **Frontend**: SvelteKit 2.x + Svelte 5
- **Estilos**: TailwindCSS 3.x
- **Base de datos**: SQLite con Drizzle ORM
- **Iconos**: Lucide Svelte
- **Build**: Vite 7.x
- **Runtime**: Node.js 22

## 🚀 Despliegue Local

### Opción 1: Sin contenedores (Desarrollo)

#### Requisitos previos

- Node.js 22 o superior
- pnpm (recomendado) o npm

#### Pasos

1. **Clonar el repositorio** (si aplica)
```sh
git clone https://github.com/acristhian1411/Use-cases
cd Use-cases
```

2. **Instalar dependencias**
```sh
pnpm install
# o
npm install
```

3. **Inicializar la base de datos**

La base de datos SQLite se creará automáticamente en `sqlite.db`. Si necesitas ejecutar migraciones:

```sh
pnpm drizzle-kit push
# o
npx drizzle-kit push
```

4. **Iniciar el servidor de desarrollo**
```sh
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

5. **Abrir en el navegador automáticamente**
```sh
pnpm dev -- --open
```

### Opción 2: Con Docker (Producción)

#### Requisitos previos

- Docker
- Docker Compose

#### Pasos

1. **Construir y ejecutar con Docker Compose**
```sh
docker-compose up -d
```

Esto construirá la imagen y ejecutará el contenedor en segundo plano.

2. **Acceder a la aplicación**

La aplicación estará disponible en `http://localhost:81`

3. **Ver logs**
```sh
docker-compose logs -f use_cases
```

4. **Detener el contenedor**
```sh
docker-compose down
```

#### Construcción manual con Docker

Si prefieres construir y ejecutar manualmente:

```sh
# Construir la imagen
docker build -t use-cases .

# Ejecutar el contenedor
docker run -d \
  -p 81:3000 \
  -v $(pwd)/sqlite.db:/app/sqlite.db \
  -e DATABASE_URL=file:/app/sqlite.db \
  -e ORIGIN=http://localhost:81 \
  --name use_cases \
  use-cases
```

## 📦 Scripts Disponibles

```sh
pnpm dev          # Inicia el servidor de desarrollo
pnpm build        # Construye la aplicación para producción
pnpm preview      # Previsualiza la build de producción
pnpm start        # Ejecuta la aplicación en producción (requiere build previo)
pnpm check        # Verifica tipos y sintaxis de Svelte
pnpm check:watch  # Verifica tipos en modo watch
```

## 🗄️ Base de Datos

La aplicación utiliza SQLite con las siguientes tablas:

- **modules**: Módulos de prueba
- **testCases**: Casos de prueba asociados a módulos
- **steps**: Pasos individuales de cada caso de prueba
- **actors**: Actores involucrados en las pruebas

El archivo de base de datos (`sqlite.db`) se crea automáticamente en la raíz del proyecto.

## 🔧 Configuración

### Variables de entorno

Para Docker, puedes configurar:

- `DATABASE_URL`: Ruta al archivo SQLite (default: `file:/app/sqlite.db`)
- `ORIGIN`: URL de origen para CORS (default: `http://localhost:81`)

### Puerto

- **Desarrollo**: Puerto 5173 (Vite default)
- **Producción (Docker)**: Puerto 81 (mapeado desde el puerto interno 3000)

## 📝 Notas

- La base de datos SQLite persiste en el volumen montado cuando usas Docker
- En desarrollo, los cambios se reflejan automáticamente con hot reload
- Para producción, asegúrate de ejecutar `pnpm build` antes de `pnpm start`

## 📚 Documentación Adicional

Consulta la carpeta `docs/` para más información sobre la implementación y tareas del proyecto.
