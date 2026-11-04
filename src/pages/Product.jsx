import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext.jsx';
import { useAddToCart } from '../hooks/useCart.js';
import { SHOP_PATH, categoryUrl, money, tone } from '../lib/format.js';

// va en todos los productos, en letra chica, después de la descripción propia (si tiene)
const DISCLAIMER =
  'Todas las piezas de esta tienda son hechas a mano con mucho cariño para vos 💖, por lo tanto pueden tener ligeras variaciones en imagen y tamaño.';

const Description = ({ text }) => (
  <>
    {text.trim() && <p className="desc">{text.trim()}</p>}
    <p className="desc-note">{DISCLAIMER}</p>
  </>
);

const Gallery = ({ product: p, photos }) => {
  const [index, setIndex] = useState(0);
  const count = photos.length;

  // flechas del teclado para recorrer las fotos (salvo que estés escribiendo o eligiendo una opción)
  useEffect(() => {
    if (count < 2) return;
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return;
      if (e.key === 'ArrowRight') setIndex((k) => (k + 1) % count);
      if (e.key === 'ArrowLeft') setIndex((k) => (k - 1 + count) % count);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [count]);

  return (
    <div className="pd__media">
      <div className={`pd__photo ${count ? '' : `ph ph--${tone(p.index)}`}`}>
        {count ? <img src={photos[index]} alt={p.name} /> : <span>{p.emoji}</span>}
      </div>
      {count > 1 && (
        <div className="thumbs">
          {photos.map((src, k) => (
            <button key={src} onClick={() => setIndex(k)} aria-label={`Foto ${k + 1}`} aria-current={k === index}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ product: p, variant, setVariant }) => {
  const addToCart = useAddToCart();

  return (
    <div className="pd__info">
      <h1 className="h-script">{p.name}</h1>
      <p className="price price--big">{money.format(p.price)}</p>
      <Description text={p.description} />
      {p.variants && (
        <fieldset className="colors">
          <legend>{p.variants.name}</legend>
          {p.variants.values.map(({ name }) => (
            <label key={name}>
              <input type="radio" name="variant" value={name} checked={variant === name} onChange={() => setVariant(name)} />
              <span>{name}</span>
            </label>
          ))}
        </fieldset>
      )}
      <button className="btn btn--pink btn--block" disabled={p.unavailable} onClick={() => addToCart(p, variant)}>
        {p.unavailable ? 'Sin stock' : 'Sumar al carrito'}
      </button>
    </div>
  );
};

// la variante elegida vive acá porque la usan las dos columnas: la info la elige y la galería muestra sus fotos
const ProductDetail = ({ product: p }) => {
  const [variant, setVariant] = useState(p.variants?.values[0]?.name || '');
  const chosen = p.variants?.values.find((v) => v.name === variant);
  const photos = chosen?.photos.length ? chosen.photos : p.images;

  return (
    <div className="pd">
      {/* key: al cambiar de variante la galería vuelve a la primera foto */}
      <Gallery key={variant} product={p} photos={photos} />
      <ProductInfo product={p} variant={variant} setVariant={setVariant} />
    </div>
  );
};

const Message = ({ title, children }) => (
  <main>
    <section className="empty paper">
      <p className="h-script">{title}</p>
      {children}
    </section>
  </main>
);

export const Product = () => {
  const { slug } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.slug === slug);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} · Kimi tejidos`;
    return () => {
      document.title = 'Kimi tejidos · Hecho a mano';
    };
  }, [product]);

  if (!product) {
    return (
      <Message title="No encontré ese producto">
        <p>
          <Link to={SHOP_PATH}>Ver todos los productos ♡</Link>
        </p>
      </Message>
    );
  }

  return (
    <main>
      <section className="product">
        <nav className="breadcrumb" aria-label="Estás en">
          <Link to={SHOP_PATH}>Productos</Link>
          <span aria-hidden="true">›</span>
          <Link to={categoryUrl(product.category)}>{product.category}</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{product.name}</span>
        </nav>
        {/* key resets gallery and chosen variant when moving between products */}
        <ProductDetail key={product.id} product={product} />
      </section>
    </main>
  );
};
