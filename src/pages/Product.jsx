import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Chevron } from '../components/Chevron.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useAddToCart } from '../hooks/useCart.js';
import { SHOP_PATH, categoryUrl, money, priceFor, tone } from '../lib/format.js';

// va en todos los productos, en letra chica, después de la descripción propia (si tiene)
const DISCLAIMER =
  'Todas las piezas de esta tienda son hechas a mano con mucho cariño para vos 💖, por lo tanto pueden tener ligeras variaciones en imagen y tamaño. Los productos pueden tardar hasta 7 días en ser enviados.';

const Description = ({ text }) => (
  <>
    {text.trim() && <p className="desc">{text.trim()}</p>}
    <p className="desc-note">{DISCLAIMER}</p>
  </>
);

// carrusel: se desliza con el dedo/trackpad, y flechas, miniaturas y teclado llevan a cada foto.
// la foto actual sale de la posición del scroll, así queda bien también al deslizar
const Gallery = ({ product: p, photos }) => {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const count = photos.length;

  const goTo = (k) => {
    const el = track.current;
    el.scrollTo({ left: ((k + count) % count) * el.clientWidth, behavior: 'smooth' });
  };
  const onScroll = () => setIndex(Math.round(track.current.scrollLeft / track.current.clientWidth));

  // flechas del teclado para recorrer las fotos (salvo que estés escribiendo o eligiendo una opción)
  useEffect(() => {
    if (count < 2) return;
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return;
      const el = track.current;
      const current = Math.round(el.scrollLeft / el.clientWidth);
      const next = e.key === 'ArrowRight' ? current + 1 : e.key === 'ArrowLeft' ? current - 1 : null;
      if (next !== null) el.scrollTo({ left: ((next + count) % count) * el.clientWidth, behavior: 'smooth' });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [count]);

  if (!count) {
    return (
      <div className="pd__media">
        <div className={`pd__photo ph ph--${tone(p.index)}`}>
          <span>{p.emoji}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pd__media">
      <div className="pd__carousel">
        <div className="pd__photo pd__track" ref={track} onScroll={onScroll}>
          {photos.map((src, k) => (
            <div className="pd__slide" key={src}>
              <img src={src} alt={`${p.name}, foto ${k + 1} de ${count}`} loading={k ? 'lazy' : undefined} />
            </div>
          ))}
        </div>
        {count > 1 && (
          <>
            <button className="icon-btn pd__arrow pd__arrow--prev" onClick={() => goTo(index - 1)} aria-label="Foto anterior">
              <Chevron dir={-1} />
            </button>
            <button className="icon-btn pd__arrow pd__arrow--next" onClick={() => goTo(index + 1)} aria-label="Foto siguiente">
              <Chevron dir={1} />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="thumbs">
          {photos.map((src, k) => (
            <button key={src} onClick={() => goTo(k)} aria-label={`Foto ${k + 1}`} aria-current={k === index}>
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductInfo = ({ product: p, chosen, setChosen }) => {
  const addToCart = useAddToCart();

  return (
    <div className="pd__info">
      <h1 className="h-script">{p.name}</h1>
      <p className="price price--big">{money.format(priceFor(p, chosen))}</p>
      <Description text={p.description} />
      {p.variants.map((group) => (
        <fieldset className="colors" key={group.name}>
          <legend>
            {group.name}: <span className="colors__chosen">{chosen[group.name]}</span>
          </legend>
          {group.values.map(({ name, color, extra }) => (
            <label key={name} title={group.values.some((v) => v.color) ? name : undefined}>
              <input
                type="radio"
                name={group.name}
                value={name}
                checked={chosen[group.name] === name}
                onChange={() => setChosen((c) => ({ ...c, [group.name]: name }))}
              />
              {/* si el selector es de colores, la opción sin color (Sin moño...) va como cajita tachada */}
              {group.values.some((v) => v.color) ? (
                <span className={`swatch ${color ? '' : 'swatch--none'}`} style={color ? { background: color } : undefined}>
                  <span className="sr-only">{name}</span>
                </span>
              ) : (
                <span>
                  {name}
                  {extra ? ` (+${money.format(extra)})` : ''}
                </span>
              )}
            </label>
          ))}
        </fieldset>
      ))}
      <button className="btn btn--pink btn--block" disabled={p.unavailable} onClick={() => addToCart(p, chosen)}>
        {p.unavailable ? 'Sin stock' : 'Sumar al carrito'}
      </button>
    </div>
  );
};

// las variantes elegidas viven acá porque las usan las dos columnas: la info las elige y la galería muestra sus fotos
const ProductDetail = ({ product: p }) => {
  const [picked, setChosen] = useState({});
  // lo que no se eligió (o ya no existe en el producto) va con la primera opción de su selector
  const chosen = Object.fromEntries(
    p.variants.map((g) => [g.name, g.values.some((v) => v.name === picked[g.name]) ? picked[g.name] : g.values[0].name])
  );
  // la galería usa las fotos de la primera opción elegida que tenga fotos propias
  const withPhotos = p.variants
    .map((g) => g.values.find((v) => v.name === chosen[g.name]))
    .find((v) => v?.photos.length);
  const photos = withPhotos ? withPhotos.photos : p.images;

  return (
    <div className="pd">
      {/* key: al cambiar de fotos la galería vuelve a la primera */}
      <Gallery key={photos.join()} product={p} photos={photos} />
      <ProductInfo product={p} chosen={chosen} setChosen={setChosen} />
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
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);

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
