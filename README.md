# NASASHE S.A.S

Aplicación React + Vite conectada a Firebase y empaquetada originalmente como app instalable. Este repositorio ahora está listo para publicarse en GitHub Pages y servir el front-end desde la web.

## Scripts disponibles
- `npm run dev`: modo desarrollo con Vite.
- `npm run build`: genera el paquete de producción.
- `npm run preview`: sirve localmente la build.
- `npm run lint`: ejecuta ESLint.

## Despliegue en GitHub Pages
- Vite está configurado con `base` apuntando al nombre del repositorio (`/NASASHE-SAS/`). Si usas otro nombre, ajusta `GITHUB_PAGES_BASE` o edita `vite.config.js`.
- `BrowserRouter` usa `import.meta.env.BASE_URL` como `basename` para que las rutas funcionen bajo el subdirectorio de Pages.
- Después de cada build se copia `index.html` a `404.html` para que el enrutado del lado del cliente funcione en GitHub Pages.
- El flujo de trabajo `.github/workflows/deploy.yml` construye el sitio y publica el artefacto en Pages al hacer push a `main` o cuando se ejecuta manualmente.

### Pasos para activar Pages
1. Haz push de los cambios a la rama `main` para que se ejecute el workflow.
2. En **Settings > Pages**, selecciona **GitHub Actions** como fuente.
3. Si tu repositorio tiene otro nombre o deseas servir desde la raíz del dominio, ajusta la variable `GITHUB_PAGES_BASE` en el workflow antes de desplegar.

### Construcción local
```bash
npm ci
npm run build
```
Esto generará la carpeta `dist/` con el contenido listo para GitHub Pages.
