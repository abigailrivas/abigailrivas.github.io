import { useCallback, useSyncExternalStore } from 'react';
import { cart } from '../cart.js';
import { useUI } from '../context/UIContext.jsx';
import { priceFor } from '../lib/format.js';
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
    // chosen: { [nombre del selector]: opción elegida }; lo que falte va con la primera opción
    (p, chosen = {}) => {
      const variant = p.variants.map((g) => `${g.name}: ${chosen[g.name] || g.values[0].name}`).join(' · ');
      cart.add({ id: p.id, name: p.name, price: priceFor(p, chosen), variant });
      toast(`${p.emoji} ${p.name} al carrito`);
    },
    [toast]
  );
};
