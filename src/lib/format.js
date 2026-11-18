export const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

const PASTELS = ['pink', 'mint', 'butter', 'sky', 'peach'];
const TILTS = [-2.5, 1.8, -1, 2.4, -1.8, 1.2];

// pastel and tilt rotate with the product's position so the grid looks hand-placed
export const tone = (i, offset = 0) => PASTELS[(i + offset) % PASTELS.length];
export const tilt = (i) => `${TILTS[i % TILTS.length]}deg`;

export const SHOP_PATH = '/productos';
export const categoryUrl = (cat) => (cat === 'Todo' ? SHOP_PATH : `${SHOP_PATH}?categoria=${encodeURIComponent(cat)}`);
export const productUrl = (p) => `${SHOP_PATH}/${encodeURIComponent(p.id)}`;

// precio con los extras de las opciones elegidas ({ [nombre del selector]: opción }); sin elegir va la primera
export const priceFor = (p, chosen = {}) =>
  p.variants.reduce((sum, g) => {
    const value = g.values.find((v) => v.name === chosen[g.name]) || g.values[0];
    return sum + (value.extra || 0);
  }, p.price);
