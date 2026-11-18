import { products as rawProducts } from '../products.js';

// index drives each product's pastel color and tilt
const withMeta = (products) => products.map((p, index) => ({ ...p, index }));

const PRODUCTS = withMeta(rawProducts);

// [[categoría, cantidad], ...] en el orden de la tabla
const CATEGORIES = [...PRODUCTS.reduce((m, p) => m.set(p.category, (m.get(p.category) || 0) + 1), new Map())];

export const useProducts = () => ({ products: PRODUCTS });

export const useCategories = () => CATEGORIES;
