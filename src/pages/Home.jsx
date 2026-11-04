import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard.jsx';
import { useCategories, useProducts } from '../context/ProductsContext.jsx';
import { SHOP_PATH, categoryUrl, tone } from '../lib/format.js';

const Chevron = ({ dir }) => (
  <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden="true">
    <path
      d={dir < 0 ? 'M8.5 2.5C6.6 4.4 4.9 6.1 3 8c1.9 1.9 3.6 3.6 5.5 5.5' : 'M3.5 2.5C5.4 4.4 7.1 6.1 9 8c-1.9 1.9-3.6 3.6-5.5 5.5'}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Hero = () => (
  <section className="hero stitch-frame">
    {['tl', 'tr', 'bl', 'br'].map((corner) => (
      <svg key={corner} className={`stitch-corner stitch-corner--${corner}`} aria-hidden="true">
        <use href="#stitch-corner" />
      </svg>
    ))}
    <div className="hero__text">
      <h1>
        <span className="h-script">Hecho a mano,</span>
      </h1>
      <p className="hero__lead">
        Amigurumis, bolsitos y cositas tejidas al crochet con mucha paciencia y un poquito de
        magia. Cada pieza es única ♡
      </p>
      <div className="hero__cta">
        <Link to={SHOP_PATH} className="btn btn--pink">
          Ver la tienda ✿
        </Link>
        <Link to="/#como-comprar" className="btn btn--ghost">
          ¿Cómo compro?
        </Link>
      </div>
    </div>
  </section>
);

// "más vendidos" = los marcados como destacados; si hay pocos, se completa con el resto
const pickBestsellers = (products) => {
  const featured = products.filter((p) => p.featured);
  return [...featured, ...products.filter((p) => !p.featured)].slice(0, Math.max(featured.length, 8));
};

const Bestsellers = () => {
  const { products } = useProducts();
  const track = useRef(null);
  const slide = (dir) => track.current.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    slide(e.key === 'ArrowRight' ? 1 : -1);
  };

  return (
    <section className="bestsellers" id="mas-vendidos">
      <div className="section-head section-head--row">
        <h2 className="h-script">Los más vendidos</h2>
        <div className="carousel-nav">
          <button className="icon-btn" onClick={() => slide(-1)} aria-label="Anteriores">
            <Chevron dir={-1} />
          </button>
          <button className="icon-btn" onClick={() => slide(1)} aria-label="Siguientes">
            <Chevron dir={1} />
          </button>
        </div>
      </div>
      <div className="carousel" ref={track} tabIndex={0} onKeyDown={onKeyDown} aria-label="Productos más vendidos">
        {pickBestsellers(products).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

const Categories = () => {
  const { products } = useProducts();
  const categories = useCategories();
  if (!categories.length) return null;

  return (
    <section className="categories" id="categorias">
      <div className="section-head">
        <h2 className="h-script">Categorías</h2>
        <svg className="underline" width="200" height="20">
          <use href="#squiggle" style={{ color: 'var(--pink-deep)' }} />
        </svg>
      </div>
      <div className="cat-grid">
        {categories.map(([cat, n], i) => {
          const items = products.filter((p) => p.category === cat);
          const cover = items.find((p) => p.images.length);
          return (
            <Link key={cat} className={`cat-card cat-card--${tone(i)}`} to={categoryUrl(cat)}>
              <span className="cat-card__img">
                {cover ? <img src={cover.images[0]} alt="" loading="lazy" /> : <span>{items[0].emoji}</span>}
              </span>
              <span className="cat-card__label">
                {cat} <small>{n} {n === 1 ? 'producto' : 'productos'}</small>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

const STEPS = [
  ['pink', 'Elegí tus favoritos y sumalos al carrito.'],
  ['mint', 'Elegí cómo pagar: transferencia o efectivo con 10% de descuento (solo para retiro).'],
  ['butter', 'Elegí la entrega: envío por Correo Argentino o retiro gratis en la estación Luis Guillón.'],
  ['sky', 'Tocá «Pedir por WhatsApp» y terminamos la compra.'],
];

const HowToBuy = () => (
  <section className="how" id="como-comprar">
    <div className="section-head">
      <h2 className="h-script">Facilito, en {STEPS.length} pasos</h2>
    </div>
    <ol className="steps">
      {STEPS.map(([color, text], i) => (
        <li key={color} className={`sticky sticky--${color}`}>
          <span className="pin" />
          <b>{i + 1}.</b>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  </section>
);

export const Home = () => (
  <main>
    <Hero />
    <Bestsellers />
    <Categories />
    <HowToBuy />
  </main>
);
