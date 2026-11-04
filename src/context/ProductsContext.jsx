import { slugify } from '../lib/format.js';
import { products as rawProducts } from '../products.js';

// index drives each product's pastel color and tilt; slug is its URL (with the id appended if two names collide)
const withMeta = (products) => {
  const seen = new Set();
  return products.map((p, index) => {
    let slug = slugify(p.name) || p.id;
    if (seen.has(slug)) slug = `${slug}-${p.id}`;
    seen.add(slug);
    return { ...p, index, slug };
  });
};

const PRODUCTS = withMeta(rawProducts);

// [[categoría, cantidad], ...] en el orden de la tabla
const CATEGORIES = [...PRODUCTS.reduce((m, p) => m.set(p.category, (m.get(p.category) || 0) + 1), new Map())];

export const useProducts = () => ({ products: PRODUCTS });

export const useCategories = () => CATEGORIES;
