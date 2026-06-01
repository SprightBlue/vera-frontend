
## VERA README

Vera — Frontend: interfaz web en React + TypeScript construida con Vite. Panel de gestión y visualización de alertas.

Rápido: ejecutar estos comandos en PowerShell

```powershell
npm install
npm run dev    # desarrollo (HMR)
npm run build  # compilar
npm run preview# servir la build
```

Scripts útiles
- `dev`, `build`, `lint`, `preview` (ver `package.json`).

Dónde mirar para la evaluación
- Páginas y rutas: `src/presentation/pages`
- UI y componentes: `src/presentation/components` y `src/components`
- Lógica y llamadas a API: `src/infrastructure/api` y `src/infrastructure`
- Features por dominio: `src/features`

Puntos a comprobar
- Arranca con `npm run dev` y abrir http://localhost:5173/
- `npm run lint` para calidad de código
- `npm run build` debe compilar sin errores

Contribuir: crear rama, pasar `lint` y `build`, abrir PR con instrucciones de prueba.
