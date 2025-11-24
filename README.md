# Proyecto Unidad 4 - Backend con JWT y OAuth

## Características
- CRUD completo con MongoDB
- Autenticación JWT
- Login con Google OAuth 2.0
- API RESTful

## Instalación
```bash
npm install
```

## Configuración

Crea un archivo `.env`:
```
PORT=5000
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_secreto
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
```

## Ejecución
```bash
npm run dev
```

## Endpoints

- POST /api/auth/register - Registro
- POST /api/auth/login - Login
- GET /api/auth/google - Login con Google
- GET /api/auth/me - Perfil del usuario
- GET /api/usuarios - Listar usuarios (protegida)

## Deploy

- Backend: Render
- Frontend: Vercel