# Kimi tejidos ✿ tienda online

Tienda estilo scrapbook (pastel, letra a mano, cintas washi, polaroids) con los productos cargados en `src/products.js` y que recibe los pedidos por **WhatsApp**.

## Correr en local

```bash
npm install
cp .env.example .env   # número de WhatsApp y redes
npm run dev
```

## Cargar productos

Los productos están en `src/products.js`, un array con un objeto por producto:

```js
{
  id: '15',
  name: 'Tapiz gatito',
  description: `Alto: 16cm aprox.
Ancho: 16cm aprox.`,              // opcional
  price: 8000,
  category: 'Decoración',          // genera el menú y los filtros solos
  images: ['https://…/1.jpg', 'https://…/2.jpg'], // la primera es la portada
  featured: true,                  // opcional: primero en «Los más vendidos»
  variants: {                      // opcional
    name: 'Color',
    values: [
      { name: 'Rosa y marrón', photos: ['https://…/rosa.jpg'] }, // con fotos, la galería muestra esas al elegirla
      { name: 'Celeste y blanco', photos: [] },
    ],
  },
  emoji: '🐱',                     // se usa cuando no hay foto
}
```

La aclaración «Todas las piezas… son hechas a mano…» la agrega sola la página del producto.

## Publicar

`npm run build` genera `dist/`, un sitio estático. Subilo a Netlify, Vercel o Cloudflare Pages y cargá las variables `VITE_*` de `.env` en el panel del hosting.

## Estructura

Vite + React + React Router. Rutas: `/` (inicio) y `/productos` (tienda, filtra con `?categoria=`).

- `index.html`: `<head>` y los íconos SVG compartidos (`<symbol>`), incluido el punto cruz del hero
- `src/App.jsx`: rutas y layout (header, footer, modal de producto, carrito, toast)
- `src/pages/`: `Home.jsx` (hero, más vendidos, categorías, cómo comprar) y `Shop.jsx`
- `src/components/`: tarjeta de producto, header con menú de categorías, modal, carrito, footer
- `src/context/`: productos (con su URL) y categorías, y estado de UI (carrito abierto, toast)
- `src/products.js`: los productos (y los valores por defecto de los campos opcionales)
- `src/cart.js` + `src/hooks/useCart.js`: carrito persistido en `localStorage`
- `src/style.css`: todo el estilo scrapbook
- `public/cursor*.svg`: cursor con lacito (normal y para links/botones)
- `public/_redirects` / `vercel.json`: hacen que `/productos` funcione al abrirlo directo en Netlify o Vercel
