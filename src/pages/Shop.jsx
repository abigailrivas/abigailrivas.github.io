import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard.jsx';
import { useCategories, useProducts } from '../context/ProductsContext.jsx';
import { tone } from '../lib/format.js';

export const Shop = () => {
  const { products } = useProducts();
  const categories = useCategories().map(([cat]) => cat);
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');

  // la categoría vive en la URL (?categoria=...) para poder compartir el link
  const requested = params.get('categoria');
  const category = categories.includes(requested) ? requested : 'Todo';
  const select = (cat) => setParams(cat === 'Todo' ? {} : { categoria: cat }, { replace: true });

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === 'Todo' || p.category === category) &&
        (!q || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q))
    );
  }, [products, category, query]);

  const content = list.length ? (
    list.map((p) => <ProductCard key={p.id} product={p} />)
  ) : (
    <div className="empty paper">
      <p className="h-script">Ups, no encontré nada</p>
      <p>Probá con otra palabra o categoría ♡</p>
    </div>
  );

  return (
    <main>
      <section className="shop" id="tienda">
        <div className="section-head">
          <h1 className="h-script">Productos</h1>
          <svg className="underline" width="200" height="20">
            <use href="#squiggle" style={{ color: 'var(--pink-deep)' }} />
          </svg>
        </div>

        <div className="toolbar">
          <div className="tags" role="tablist" aria-label="Categorías">
            {['Todo', ...categories].map((cat, i) => (
              <button key={cat} role="tab" className={`tag tag--${tone(i)}`} aria-selected={cat === category} onClick={() => select(cat)}>
                {cat}
              </button>
            ))}
          </div>
          <label className="search">
            <span className="sr-only">Buscar</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar... ✎" autoComplete="off" />
          </label>
        </div>

        <div className="grid" aria-live="polite">
          {content}
        </div>
      </section>
    </main>
  );
};
