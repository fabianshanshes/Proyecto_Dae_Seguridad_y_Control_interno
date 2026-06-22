# Proyecto_Dae_Seguridad_y_Control_interno

## Descripción del proyecto

Este proyecto es un sistema de control de accesos para un centro de datos, compuesto por:

- Un servidor Node.js/Express que expone una API REST para solicitudes de acceso e incidencias.
- Un cliente React/Vite que provee una interfaz para solicitantes, autorizadores, guardia y SOC.

## Requisitos previos

Antes de iniciar, instala en tu equipo:

- Node.js 18+ y npm 10+ (u otra versión compatible).
- MySQL/MariaDB para la base de datos.

## Estructura del proyecto

- `server/` - código y dependencias del backend.
- `client/` - aplicación React del frontend.

## Configuración de la base de datos

1. Importa la base de datos proporcionada con el proyecto usando MySQL.

Por ejemplo, si el archivo SQL recibido se llama `control_interno_datacenter.sql`:

```bash
mysql -u tu_usuario -p < control_interno_datacenter.sql
```

2. Verifica que la base de datos se haya importado correctamente antes de iniciar el servidor.



## Configuración del servidor

1. Abre una terminal en la carpeta `server/`:

```bash
cd server
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en `server/` con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=control_interno_datacenter
PORT=5000
```

4. Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

5. Alternativamente, para ejecutar en modo de producción:

```bash
npm start
```

## Configuración del cliente

1. Abre otra terminal en la carpeta `client/`:

```bash
cd client
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia la aplicación React:

```bash
npm run dev
```

4. Abre el navegador en la dirección que entrega Vite, típicamente:

```text
http://localhost:5173
```

## Flujo de ejecución

- El frontend consume la API del backend en `http://localhost:5000`.
- El backend ejecuta un proceso periódico de expiración de solicitudes cada minuto.
- El frontend ofrece vistas para:
  - Crear solicitudes de acceso.
  - Revisar solicitudes pendientes.
  - Registrar check-in y check-out.
  - Ver permisos de un solicitante.
  - Reportar incidencias.

## Comandos rápidos

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

## Consideraciones adicionales

- Asegúrate de que MySQL esté corriendo antes de iniciar el backend.
- Si el proyecto se mueve a otro host o puerto, actualiza las URLs del cliente o usa variables de entorno en el frontend.
- No subas el archivo `.env` al repositorio. Está incluido en `.gitignore`.

## Problemas comunes

- Si el servidor no conecta a la base de datos, revisa que las credenciales y el nombre de la base de datos sean correctos.
- Si el cliente no encuentra la API, verifica que el backend esté activo en `http://localhost:5000`.

