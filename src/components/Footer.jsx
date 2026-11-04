const INSTAGRAM = import.meta.env.VITE_INSTAGRAM || 'tejidoskimi';
const TIKTOK = import.meta.env.VITE_TIKTOK || 'tejidoskimi';

export const Footer = () => {
  return (
    <footer className="footer">
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
      <small>© {new Date().getFullYear()} Kimi tejidos · Argentina</small>
    </footer>
  );
};
