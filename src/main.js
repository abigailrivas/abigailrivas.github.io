import { fetchProducts, isDemo } from './sheets.js';
import { cart } from './cart.js';

const WHATSAPP = import.meta.env.VITE_WHATSAPP || '';
const INSTAGRAM = import.meta.env.VITE_INSTAGRAM || 'tejidoskimi';
const TIKTOK = import.meta.env.VITE_TIKTOK || 'tejidoskimi';

const $ = (sel) => document.querySelector(sel);
const money = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const PASTELS = ['pink', 'mint', 'butter', 'sky', 'peach'];
const TILTS = [-2.5, 1.8, -1, 2.4, -1.8, 1.2];

const state = { products: [], category: 'Todo', query: '', gallery: { images: [], index: 0 } };

/* ---------- productos ---------- */

function productVisual(p, i, cls = '') {
  const tone = PASTELS[i % PASTELS.length];
  if (p.images.length) {
    return `<div class="polaroid__img ${cls}"><img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy" /></div>`;
  }
  return `<div class="polaroid__img ph ph--${tone} ${cls}"><span>${esc(p.emoji)}</span></div>`;
}

function renderTags() {
  const cats = ['Todo', ...new Set(state.products.map((p) => p.category))];
  $('#categoryTags').innerHTML = cats
    .map(
      (c, i) => `<button role="tab" class="tag tag--${PASTELS[i % PASTELS.length]}" aria-selected="${c === state.category}" data-cat="${esc(c)}">${esc(c)}</button>`
    )
    .join('');
}

function renderMenu() {
  const counts = state.products.reduce((m, p) => m.set(p.category, (m.get(p.category) || 0) + 1), new Map());
  const items = [['Todo', state.products.length], ...counts];
  $('#catMenuList').innerHTML = items
    .map(([c, n]) => `<li><a href="#tienda" data-menu-cat="${esc(c)}">${c === 'Todo' ? 'Ver todo' : esc(c)} <small>${n}</small></a></li>`)
    .join('');
}

function selectCategory(cat) {
  state.category = cat;
  renderTags();
  renderGrid();
}

function setMenu(open) {
  $('#catMenuWrap').classList.toggle('is-open', open);
  $('#catMenuBtn').setAttribute('aria-expanded', String(open));
}

function renderGrid() {
  const q = state.query.trim().toLowerCase();
  const list = state.products.filter(
    (p) =>
      (state.category === 'Todo' || p.category === state.category) &&
      (!q || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q))
  );

  if (!list.length) {
    $('#grid').innerHTML = `<div class="empty paper"><p class="h-script">Ups, no encontré nada</p><p>Probá con otra palabra o categoría ♡</p></div>`;
    return;
  }

  $('#grid').innerHTML = list
    .map((p) => {
      const i = state.products.indexOf(p);
      const soldOut = p.stock <= 0;
      return `
      <article class="card" style="--tilt:${TILTS[i % TILTS.length]}deg">
        <button class="card__hit" data-open="${esc(p.id)}" aria-label="Ver ${esc(p.name)}"></button>
        <span class="tape tape--${PASTELS[(i + 2) % PASTELS.length]} ${i % 2 ? 'tape--r' : ''}"></span>
        ${p.featured && !soldOut ? `<span class="badge badge--new">¡favorito!</span>` : ''}
        ${soldOut ? `<span class="stamp">agotado</span>` : ''}
        ${productVisual(p, i)}
        <div class="card__body">
          <h3>${esc(p.name)}</h3>
          <div class="card__row">
            <span class="price">${money.format(p.price)}</span>
            <button class="add" data-add="${esc(p.id)}" ${soldOut ? 'disabled' : ''} aria-label="Agregar ${esc(p.name)} al carrito">+</button>
          </div>
        </div>
      </article>`;
    })
    .join('');
}

function renderSkeleton() {
  $('#grid').innerHTML = Array.from({ length: 6 }, (_, i) => `
    <article class="card card--loading" style="--tilt:${TILTS[i]}deg">
      <div class="polaroid__img ph ph--${PASTELS[i]}"><span class="spin">🧶</span></div>
      <div class="card__body"><h3>Tejiendo...</h3></div>
    </article>`).join('');
}

/* ---------- modal ---------- */

// the "hecho a mano / ligeras variaciones" disclaimer repeats in every product, so it goes in small print
const DISCLAIMER = /^todas las piezas/i;

function descriptionHtml(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const main = lines.filter((l) => !DISCLAIMER.test(l.trim())).join('\n').trim();
  const notes = lines.filter((l) => DISCLAIMER.test(l.trim()));
  return (
    (main ? `<p class="desc">${esc(main)}</p>` : '') +
    notes.map((n) => `<p class="desc-note">${esc(n.trim())}</p>`).join('')
  );
}

function openProduct(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  const i = state.products.indexOf(p);
  const soldOut = p.stock <= 0;
  const thumbs = p.images.length > 1
    ? `<div class="thumbs">${p.images.map((src, k) => `<button data-img="${k}" aria-label="Foto ${k + 1}" aria-current="${k === 0}"><img src="${esc(src)}" alt="" /></button>`).join('')}</div>`
    : '';

  $('#modalBody').innerHTML = `
    <button class="icon-btn modal__close" data-close aria-label="Cerrar">✕</button>
    <div class="modal__media">
      <div class="modal__photo js-main-img ${p.images.length ? '' : `ph ph--${PASTELS[i % PASTELS.length]}`}">
        ${p.images.length ? `<img src="${esc(p.images[0])}" alt="${esc(p.name)}" />` : `<span>${esc(p.emoji)}</span>`}
      </div>
      ${thumbs}
    </div>
    <div class="modal__info">
      <p class="chapter">${esc(p.category)}</p>
      <h2 id="modalTitle" class="h-script">${esc(p.name)}</h2>
      <p class="price price--big">${money.format(p.price)}</p>
      ${descriptionHtml(p.description)}
      ${p.options.length ? `
        <fieldset class="colors">
          <legend>${esc(p.optionLabel)}</legend>
          ${p.options.map((c, k) => `<label><input type="radio" name="option" value="${esc(c)}" ${k === 0 ? 'checked' : ''}/><span>${esc(c)}</span></label>`).join('')}
        </fieldset>` : ''}
      <p class="stock-line">${soldOut ? 'Agotado por ahora. ¡Escribime y lo tejo por encargo!' : p.stock === Infinity ? 'Disponible ✓' : `Quedan ${p.stock} ✓`}</p>
      <button class="btn btn--pink btn--block" data-modal-add="${esc(p.id)}" ${soldOut ? 'disabled' : ''}>Sumar al carrito ♡</button>
    </div>`;
  state.gallery = { images: p.images, index: 0 };
  $('#productModal').showModal();
}

function showImage(index) {
  const { images } = state.gallery;
  if (images.length < 2) return;
  const k = (index + images.length) % images.length;
  state.gallery.index = k;
  $('.js-main-img img').src = images[k];
  document.querySelectorAll('.thumbs [data-img]').forEach((b) => b.setAttribute('aria-current', String(Number(b.dataset.img) === k)));
}

/* ---------- carrito ---------- */

function renderCart() {
  const items = cart.items();
  const count = items.reduce((n, it) => n + it.qty, 0);
  $('#cartCount').textContent = count;
  $('#cartCount').hidden = count === 0;

  if (!items.length) {
    $('#cartItems').innerHTML = `<div class="cart-empty"><p class="h-script">Está vacío...</p><p>¡Sumale algo lindo! ✿</p></div>`;
    $('#cartFoot').hidden = true;
    return;
  }
  $('#cartFoot').hidden = false;
  $('#cartItems').innerHTML = items
    .map((it) => {
      const p = state.products.find((x) => x.id === it.id);
      const i = p ? state.products.indexOf(p) : 0;
      return `
      <div class="line">
        ${p ? productVisual(p, i, 'line__img') : ''}
        <div class="line__info">
          <b>${esc(it.name)}</b>
          ${it.color ? `<small>${esc(it.optionLabel || 'Opción')}: ${esc(it.color)}</small>` : ''}
          <span class="price">${money.format(it.price * it.qty)}</span>
        </div>
        <div class="qty">
          <button data-dec="${esc(it.key)}" aria-label="Quitar uno">−</button>
          <span>${it.qty}</span>
          <button data-inc="${esc(it.key)}" aria-label="Sumar uno" ${p && it.qty >= p.stock ? 'disabled' : ''}>+</button>
        </div>
      </div>`;
    })
    .join('');
  $('#cartTotal').textContent = money.format(cart.total());
}

function addToCart(id, color = '') {
  const p = state.products.find((x) => x.id === id);
  if (!p || p.stock <= 0) return;
  const option = color || p.options[0] || '';
  const ok = cart.add({ id: p.id, name: p.name, price: p.price, color: option, optionLabel: option ? p.optionLabel : '' }, p.stock);
  toast(ok ? `${p.emoji} ${p.name} al carrito` : 'No hay más stock de eso 🥲');
}

function setDrawer(open) {
  $('#drawer').classList.toggle('is-open', open);
  $('#drawer').setAttribute('aria-hidden', String(!open));
  $('#drawerBackdrop').hidden = !open;
  document.body.classList.toggle('no-scroll', open);
}

function checkout() {
  const items = cart.items();
  if (!items.length) return;
  const name = $('#buyerName').value.trim();
  const note = $('#buyerNote').value.trim();
  const lines = items.map(
    (it) => `• ${it.qty} × ${it.name}${it.color ? ` (${it.optionLabel || 'Opción'}: ${it.color})` : ''} — ${money.format(it.price * it.qty)}`
  );
  const msg = [
    `¡Hola Kimi! ✿ ${name ? `Soy ${name} y q` : 'Q'}uiero hacer este pedido:`,
    '',
    ...lines,
    '',
    `*Total: ${money.format(cart.total())}*`,
    note ? `\nNota: ${note}` : '',
  ].join('\n');
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
}

let toastTimer;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-on'), 2200);
}

/* ---------- eventos ---------- */

$('#categoryTags').addEventListener('click', (e) => {
  const b = e.target.closest('[data-cat]');
  if (b) selectCategory(b.dataset.cat);
});

$('#catMenuBtn').addEventListener('click', () => setMenu(!$('#catMenuWrap').classList.contains('is-open')));

$('#catMenuList').addEventListener('click', (e) => {
  const a = e.target.closest('[data-menu-cat]');
  if (!a) return;
  selectCategory(a.dataset.menuCat);
  setMenu(false);
  a.blur();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#catMenuWrap')) setMenu(false);
});

$('#search').addEventListener('input', (e) => {
  state.query = e.target.value;
  renderGrid();
});

$('#grid').addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if (add) return addToCart(add.dataset.add);
  const open = e.target.closest('[data-open]');
  if (open) openProduct(open.dataset.open);
});

$('#productModal').addEventListener('click', (e) => {
  const dlg = $('#productModal');
  if (e.target === dlg || e.target.closest('[data-close]')) return dlg.close();
  const thumb = e.target.closest('[data-img]');
  if (thumb) return showImage(Number(thumb.dataset.img));
  const add = e.target.closest('[data-modal-add]');
  if (add) {
    const option = dlg.querySelector('input[name="option"]:checked')?.value;
    addToCart(add.dataset.modalAdd, option);
    dlg.close();
  }
});

$('#cartItems').addEventListener('click', (e) => {
  const inc = e.target.closest('[data-inc]');
  const dec = e.target.closest('[data-dec]');
  if (inc) {
    const it = cart.items().find((x) => x.key === inc.dataset.inc);
    const p = state.products.find((x) => x.id === it?.id);
    cart.change(inc.dataset.inc, +1, p?.stock ?? Infinity);
  }
  if (dec) cart.change(dec.dataset.dec, -1);
});

$('#cartOpen').addEventListener('click', () => setDrawer(true));
$('#cartClose').addEventListener('click', () => setDrawer(false));
$('#drawerBackdrop').addEventListener('click', () => setDrawer(false));
// flechas del teclado para recorrer las fotos del producto abierto
document.addEventListener('keydown', (e) => {
  if (!$('#productModal').open || e.target.closest?.('input, textarea')) return;
  if (e.key === 'ArrowRight') showImage(state.gallery.index + 1);
  if (e.key === 'ArrowLeft') showImage(state.gallery.index - 1);
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  setDrawer(false);
  setMenu(false);
});
$('#checkout').addEventListener('click', checkout);

cart.subscribe(renderCart);

/* ---------- init ---------- */

$('#year').textContent = new Date().getFullYear();
// footer links are optional in the markup
const waLink = $('#waLink');
if (waLink) waLink.href = `https://wa.me/${WHATSAPP}`;
document.querySelectorAll('.ig-link').forEach((a) => (a.href = `https://instagram.com/${INSTAGRAM}`));
document.querySelectorAll('.tt-link').forEach((a) => (a.href = `https://www.tiktok.com/@${TIKTOK}`));
$('#demoNote').hidden = !isDemo;

renderSkeleton();
renderCart();

fetchProducts()
  .then((products) => {
    state.products = products;
    renderMenu();
    renderTags();
    renderGrid();
    renderCart();
  })
  .catch((err) => {
    console.error(err);
    $('#grid').innerHTML = `
      <div class="empty paper">
        <p class="h-script">Se enredó la lana...</p>
        <p>No pude cargar los productos. Probá recargar en un ratito.</p>
        <small>${esc(err.message)}</small>
      </div>`;
  });
