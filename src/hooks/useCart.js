import { useCallback, useSyncExternalStore } from 'react';
import { cart } from '../cart.js';
import { useUI } from '../context/UIContext.jsx';

export const useCart = () => {
  const items = useSyncExternalStore(cart.subscribe, cart.items);
  return {
    items,
    count: items.reduce((n, it) => n + it.qty, 0),
    total: items.reduce((sum, it) => sum + it.price * it.qty, 0),
  };
};

export const useAddToCart = () => {
  const { toast } = useUI();
  return useCallback(
    (p, chosen = '') => {
      const variant = chosen || p.variants?.values[0]?.name || '';
      cart.add({ id: p.id, name: p.name, price: p.price, variant, variantName: variant ? p.variants.name : '' });
      toast(`${p.emoji} ${p.name} al carrito`);
    },
    [toast]
  );
};
