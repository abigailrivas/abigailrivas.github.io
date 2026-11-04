import { Link } from 'react-router-dom';
import { money, productUrl, tone } from '../lib/format.js';

export const ProductVisual = ({ product: p, className = '', lazy = true }) => {
  if (p.images.length) {
    return (
      <div className={`polaroid__img ${className}`}>
        <img src={p.images[0]} alt={p.name} loading={lazy ? 'lazy' : undefined} />
      </div>
    );
  }
  return (
    <div className={`polaroid__img ph ph--${tone(p.index)} ${className}`}>
      <span>{p.emoji}</span>
    </div>
  );
};

export const ProductCard = ({ product: p }) => (
  <Link className={`card ${p.unavailable ? 'card--unavailable' : ''}`} to={productUrl(p)}>
    <ProductVisual product={p} className="card__img" />
    {p.unavailable && <span className="card__label">Sin stock</span>}
    <h3 className="card__name">{p.name}</h3>
    <p className="card__price">{money.format(p.price)}</p>
  </Link>
);
