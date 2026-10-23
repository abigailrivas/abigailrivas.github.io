import { demoRows } from './demo.js';

const SHEET_ID = import.meta.env.VITE_SHEET_ID;
const API_KEY = import.meta.env.VITE_SHEETS_API_KEY;
const RANGE = import.meta.env.VITE_SHEET_RANGE || 'Productos';

// "Categoría" -> "categoria", "Precio ($)" -> "precio"
const normalizeKey = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .trim()
    .replace(/\s+/g, '_');

// Accepts "18.500", "$ 18500", "18500,50"
const parsePrice = (v) => {
  if (typeof v === 'number') return v;
  const clean = String(v ?? '').replace(/[^\d,.-]/g, '');
  if (!clean) return 0;
  const n = clean.includes(',')
    ? clean.replace(/\./g, '').replace(',', '.')
    : clean.replace(/\.(?=\d{3}(\D|$))/g, '');
  return Number(n) || 0;
};

const truthy = (v) => /^(si|sí|yes|true|x|1)$/i.test(String(v ?? '').trim());

// Turns Google Drive share links into embeddable image URLs.
const toImageUrl = (url) => {
  const u = url.trim();
  const m = u.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
  return m ? `https://lh3.googleusercontent.com/d/${m[1]}=w800` : u;
};

const splitList = (v) =>
  String(v ?? '')
    .split(/[|\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

export function rowsToProducts(rows) {
  const [header = [], ...body] = rows;
  const keys = header.map(normalizeKey);

  return body
    .map((row, i) => {
      const r = Object.fromEntries(keys.map((k, j) => [k, row[j] ?? '']));
      const stockRaw = String(r.stock ?? '').trim();
      return {
        id: String(r.id || i + 1),
        name: r.nombre || r.name || 'Sin nombre',
        description: r.descripcion || r.description || '',
        price: parsePrice(r.precio ?? r.price),
        category: (r.categoria || r.category || 'Otros').trim(),
        images: splitList(r.imagen || r.imagenes || r.image).map(toImageUrl),
        // empty stock cell = no limit
        stock: stockRaw === '' ? Infinity : Number(stockRaw) || 0,
        featured: truthy(r.destacado || r.featured),
        // variant picker: "opcion" is its label (Color, Con llavero...), "opciones" its values
        optionLabel: r.opcion || (r.opciones ? 'Opción' : 'Color'),
        options: splitList(r.opciones || r.colores || r.colors),
        emoji: r.emoji || '🧶',
        visible: r.visible === undefined || r.visible === '' || truthy(r.visible),
      };
    })
    .filter((p) => p.visible && p.name);
}

export const isDemo = !SHEET_ID || !API_KEY;

export async function fetchProducts() {
  if (isDemo) return rowsToProducts(demoRows);

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SHEET_ID)}` +
    `/values/${encodeURIComponent(RANGE)}?key=${encodeURIComponent(API_KEY)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || `Google Sheets respondió ${res.status}`);
  }
  const data = await res.json();
  return rowsToProducts(data.values || []);
}
