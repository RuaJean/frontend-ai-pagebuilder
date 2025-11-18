# Arquitectura Frontend

Esta capa de frontend en Next.js se organiza para mantener separación clara entre UI, reglas de negocio del navegador y consumo tipado del backend. El contrato OpenAPI (`openapi/swagger.json`) es la fuente única de verdad para endpoints y modelos; los tipos se regeneran automáticamente y se propagan al resto de las capas.

## Presentation
- Ubicación: `app/` y `src/components/`.
- Responsabilidades: routing, layouts y componentes visuales puros (sin lógica de datos). Consumen props ya validadas y despachan acciones del store o hooks.

## Features
- Ubicación: `src/features/`.
- Responsabilidades: lógica específica por dominio (auth, websites, media, etc.), conectando UI con servicios/store. Incluye hooks y componentes conectados por feature.

## Services
- Ubicación: `src/services/` + utilidades compartidas (`src/utils/fetcher.ts`, `src/utils/errorHandler.ts`).
- Responsabilidades: encapsular llamadas HTTP al backend, aplicar manejo de errores, transformar datos mínimos y exponer funciones tipadas usando los modelos generados.

## Types
- Ubicación: `src/types/`.
- `src/types/openapi.ts`: archivo generado automáticamente con `openapi-typescript` a partir de `openapi/swagger.json`. **No se edita a mano**.
- `src/types/api.d.ts` reexporta los esquemas generados para ser consumidos en el resto del proyecto. Cualquier tipo manual adicional debe extender, nunca duplicar, los esquemas del contrato.

## Store
- Ubicación: `src/store/` y slices en `src/features/*`.
- Responsabilidades: configurar Redux Toolkit, exponer hooks typed (`src/store/hooks.ts`) y centralizar el estado global consumido por la UI.

## Fuente del contrato y regeneración de tipos
1. La copia del contrato vive en `openapi/swagger.json`.
2. Para actualizar los tipos tras un cambio del backend ejecutar:
   ```bash
   npm run generate:openapi
   ```
   Este script envuelve `openapi-typescript` y vuelve a generar `src/types/openapi.ts`.
3. Commits relacionados deben incluir el JSON actualizado y el archivo de tipos regenerado para mantener sincronía.

> Opcional: se puede añadir un workflow en `.github/workflows/` que ejecute `npm run generate:openapi` y falle si hay diffs pendientes, garantizando CI basada en el contrato.

