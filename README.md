# Kimi tejidos ✿ tienda online

Tienda estilo scrapbook (pastel, letra a mano, cintas washi, polaroids) que lee los productos desde una **Google Sheet** y recibe los pedidos por **WhatsApp**.

## Correr en local

```bash
npm install
cp .env.example .env   # completá los valores
npm run dev
```

Sin `.env` la tienda muestra productos de ejemplo.

## 1. Armar la planilla

1. Creá una Google Sheet y renombrá la primera hoja a **Productos**.
2. Importá `productos-ejemplo.csv` (Archivo → Importar). Son los 20 productos reales de la tienda de Empretienda, con sus fotos. O copiá estos encabezados en la fila 1:

| columna | qué va | ejemplo |
|---|---|---|
| `id` | identificador único | `1` |
| `nombre` | nombre del producto | `Conejita Mimí` |
| `descripcion` | texto libre | `Mide 22 cm` |
| `precio` | número, con o sin puntos | `18.500` |
| `categoria` | genera los filtros solos | `Amigurumis` |
| `imagen` | URL(s) separadas por `\|`. Sirven links de Google Drive compartidos | `https://drive.google.com/file/d/…` |
| `stock` | cantidad. `0` = agotado, vacío = sin límite | `5` |
| `destacado` | `si` muestra el sticker «¡favorito!» | `si` |
| `opcion` | nombre de la variante (opcional) | `Color`, `Con llavero` |
| `opciones` | valores separados por `\|` | `Rosa y marrón\|Celeste y blanco` |
| `emoji` | se usa cuando no hay foto | `🐰` |

Opcional: una columna `visible` con `no` oculta el producto sin borrarlo.

3. **Compartir → Cualquier persona con el enlace → Lector** (la API key solo puede leer planillas públicas).
4. Si usás fotos de Drive, compartilas también como «cualquier persona con el enlace».

## 2. API key de Google Sheets

1. Entrá a [console.cloud.google.com](https://console.cloud.google.com), creá un proyecto.
2. *APIs y servicios → Biblioteca* → habilitá **Google Sheets API**.
3. *Credenciales → Crear credenciales → Clave de API*.
4. Restringila: *Restricciones de API* → solo Google Sheets API, y *Referentes HTTP* → tu dominio (y `localhost:5173/*` para desarrollo).
5. Pegá la clave en `VITE_SHEETS_API_KEY` y el ID de la planilla en `VITE_SHEET_ID`.

Los cambios en la planilla se ven al recargar la página, sin redeploy.

## 3. Publicar

`npm run build` genera `dist/`, un sitio estático. Subilo a Netlify, Vercel o Cloudflare Pages y cargá las mismas variables `VITE_*` en el panel del hosting.

## Estructura

- `index.html`: secciones, stickers y doodles SVG
- `src/sheets.js`: lectura de Google Sheets API v4 y normalización de filas
- `src/cart.js`: carrito persistido en `localStorage`
- `src/main.js`: render, filtros, modal, checkout por WhatsApp
- `src/style.css`: todo el estilo scrapbook
- `public/cursor*.svg`: cursor con lacito (normal y para links/botones)
