const KEY = 'kimi-cart-v1';
const listeners = new Set();

let items = load();

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* private mode: cart just won't persist */
  }
  listeners.forEach((fn) => fn());
}

export const cart = {
  items: () => items,
  total: () => items.reduce((sum, it) => sum + it.price * it.qty, 0),
  subscribe: (fn) => listeners.add(fn),

  // returns false when stock would be exceeded
  add(product, stock = Infinity) {
    const key = `${product.id}::${product.color}`;
    const inCart = items.filter((it) => it.id === product.id).reduce((n, it) => n + it.qty, 0);
    if (inCart >= stock) return false;
    const found = items.find((it) => it.key === key);
    if (found) found.qty += 1;
    else items = [...items, { ...product, key, qty: 1 }];
    save();
    return true;
  },

  change(key, delta, stock = Infinity) {
    const it = items.find((x) => x.key === key);
    if (!it) return;
    const inCart = items.filter((x) => x.id === it.id).reduce((n, x) => n + x.qty, 0);
    if (delta > 0 && inCart >= stock) return;
    it.qty += delta;
    if (it.qty <= 0) items = items.filter((x) => x.key !== key);
    save();
  },
};
