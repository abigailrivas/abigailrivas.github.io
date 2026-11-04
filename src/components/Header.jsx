import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCategories, useProducts } from '../context/ProductsContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useCart } from '../hooks/useCart.js';
import { SHOP_PATH, categoryUrl } from '../lib/format.js';

const RIBBON = ['✿ Hecho a mano con amor', '♡ Envíos a todo el país', '✧ Piezas únicas', '♡ Regalos que abrazan'];

const CategoryMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();
  const { products } = useProducts();
  const categories = useCategories();

  useEffect(() => setOpen(false), [location]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const items = [['Todo', products.length], ...categories];
  const current = location.pathname.startsWith(SHOP_PATH);

  return (
    <div className={`nav-menu ${open ? 'is-open' : ''} ${current ? 'is-current' : ''}`} ref={ref}>
      <button className="nav-menu__btn" aria-expanded={open} aria-controls="catMenu" onClick={() => setOpen((o) => !o)}>
        Productos
        <svg className="nav-menu__caret" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1.5 1.8c1.5 1.4 3 2.9 4.5 4.6 1.5-1.7 3-3.2 4.5-4.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="nav-menu__panel" id="catMenu">
        <ul>
          {items.map(([cat, n]) => (
            <li key={cat}>
              <Link to={categoryUrl(cat)} onClick={(e) => e.currentTarget.blur()}>
                {cat === 'Todo' ? 'Ver todo' : cat} <small>{n}</small>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Header = () => {
  const { count } = useCart();
  const { setCartOpen } = useUI();

  return (
    <>
      <div className="ribbon" aria-hidden="true">
        <div className="ribbon__track">
          {[...RIBBON, ...RIBBON].map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </div>

      <header className="topbar">
        <Link to="/" className="topbar__logo" aria-label="Kimi tejidos, inicio">
          <img src="/logo.png" alt="Kimi" width="112" height="65" />
        </Link>
        <nav className="topbar__nav" aria-label="Principal">
          <CategoryMenu />
          <Link to="/#como-comprar">Cómo comprar</Link>
        </nav>
        <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label="Abrir carrito">
          <svg width="30" height="30">
            <use href="#bag" style={{ color: 'var(--butter)' }} />
          </svg>
          <span>Carrito</span>
          {/* key re-runs the "pop" animation each time the count changes */}
          {count > 0 && (
            <b className="cart-btn__count" key={count}>
              {count}
            </b>
          )}
        </button>
      </header>
    </>
  );
};
