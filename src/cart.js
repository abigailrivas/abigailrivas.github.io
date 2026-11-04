// v2: los items guardan variant/variantName (antes color/optionLabel)
// v3: suba de precios; los items guardan el precio, así que los carritos viejos no sirven
const KEY = 'kimi-cart-v3';
const listeners = new Set();

const load = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

let items = load();

// every change creates a new array so React (useSyncExternalStore) sees it
const commit = (next) => {
  items = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode: cart just won't persist */
  }
  listeners.forEach((fn) => fn());
};

export const cart = {
  items: () => items,

  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  add: (product) => {
    const key = `${product.id}::${product.variant}`;
    const found = items.some((it) => it.key === key);
    commit(found ? items.map((it) => (it.key === key ? { ...it, qty: it.qty + 1 } : it)) : [...items, { ...product, key, qty: 1 }]);
  },

  change: (key, delta) => {
    const it = items.find((x) => x.key === key);
    if (!it) return;
    commit(items.map((x) => (x.key === key ? { ...x, qty: x.qty + delta } : x)).filter((x) => x.qty > 0));
  },

  remove: (key) => commit(items.filter((x) => x.key !== key)),
};
