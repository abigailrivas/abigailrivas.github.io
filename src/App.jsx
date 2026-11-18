import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { CartDrawer } from './components/CartDrawer.jsx';
import { Footer } from './components/Footer.jsx';
import { Header } from './components/Header.jsx';
import { Toast } from './components/Toast.jsx';
import { UIProvider } from './context/UIContext.jsx';
import { Home } from './pages/Home.jsx';
import { Product } from './pages/Product.jsx';
import { Shop } from './pages/Shop.jsx';

// el router no scrollea solo: arriba de todo al cambiar de página, o a la sección si hay #hash
const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }));
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const NotFound = () => (
  <main>
    <section className="empty paper">
      <p className="h-script">Esta página se destejió</p>
      <p>
        <Link to="/">Volver al inicio ♡</Link>
      </p>
    </section>
  </main>
);

export const App = () => (
  <UIProvider>
    <ScrollManager />
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/productos" element={<Shop />} />
      <Route path="/productos/:id" element={<Product />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
    <CartDrawer />
    <Toast />
  </UIProvider>
);
