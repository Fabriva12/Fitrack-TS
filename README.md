# Fitrack 🏋️

Planificador de rutinas de ejercicios semanales. Registrá tu perfil, armá tu rutina día por día y seguí tus calorías.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Configuración

Creá un archivo `.env` en la raíz del proyecto con:

```env
VITE_API_NINJAS_KEY=tu_api_key_aqui
```

Obtené tu key gratuita en [https://api-ninjas.com/](https://api-ninjas.com/).

> `.env` está en `.gitignore` — no se versiona. Usá `.env.example` como referencia.

## Desarrollo

```bash
npm run dev
```

Abrí [http://localhost:5173](http://localhost:5173) en el navegador.

## Build

```bash
npm run build
```

Genera la carpeta `dist/` con la app lista para producción.

## Preview del build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Stack

- **React 19** — UI
- **TypeScript 6** — Tipado
- **Vite 8** — Bundler y dev server
- **React Router 7** — Navegación
