const INSTAGRAM = import.meta.env.VITE_INSTAGRAM || 'tejidoskimi';
const TIKTOK = import.meta.env.VITE_TIKTOK || 'tejidoskimi';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__cols">
        <div className="footer__brand">
          <img className="footer__logo" src="/logo.png" alt="Kimi" width="120" height="70" />
          <p className="h-script">Gracias por apoyar lo hecho a mano</p>
          <div className="footer__links">
            <a className="social-link" href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener">
              <svg width="22" height="22" aria-hidden="true">
                <use href="#ig" />
              </svg>
              Instagram
            </a>
            <a className="social-link" href={`https://www.tiktok.com/@${TIKTOK}`} target="_blank" rel="noopener">
              <svg width="22" height="22" aria-hidden="true">
                <use href="#tiktok" />
              </svg>
              TikTok
            </a>
          </div>
        </div>
        <div className="footer__info">
          <section>
            <h4>Medios de pago</h4>
            <ul className="footer__badges">
              <li className="footer__badge">Efectivo 10% OFF</li>
              <li className="footer__badge">Transferencia</li>
            </ul>
          </section>
          <section>
            <h4>Envíos</h4>
            <ul className="footer__badges">
              <li className="footer__badge">
                <img src="/img/andreani.png" alt="Andreani" width="47" height="30" />
              </li>
            </ul>
          </section>
        </div>
      </div>
      <small>© {new Date().getFullYear()} Kimi tejidos · Argentina</small>
    </footer>
  );
};
