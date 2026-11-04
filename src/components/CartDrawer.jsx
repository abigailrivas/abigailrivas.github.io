import { useEffect, useState } from 'react';
import { cart } from '../cart.js';
import { useProducts } from '../context/ProductsContext.jsx';
import { useUI } from '../context/UIContext.jsx';
import { useCart } from '../hooks/useCart.js';
import { money } from '../lib/format.js';
import { ProductVisual } from './ProductCard.jsx';
import { PickupCalendar, formatDay, inPickupRange, pickupRange, slotsFor } from './PickupCalendar.jsx';
import { Select } from './Select.jsx';

const WHATSAPP = import.meta.env.VITE_WHATSAPP || '';

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
  </svg>
);

const variantText = (it) => (it.variant ? `${it.variantName || 'Opción'}: ${it.variant}` : '');

const SHIPPING = { domicilio: 'Envío a domicilio', sucursal: 'Envío a sucursal', retiro: 'Retiro' };
const PICKUP_PLACE = 'la Estación de Tren Luis Guillón, Zona Sur, Buenos Aires';
const CASH_DISCOUNT = 0.1;
const CASH_DISCOUNT_LABEL = `${CASH_DISCOUNT * 100}%`;
const PAYMENT = {
  efectivo: { label: `Efectivo (${CASH_DISCOUNT_LABEL} de descuento)`, hint: `Solo para retiro en ${PICKUP_PLACE}` },
  transferencia: { label: 'Transferencia', hint: 'Después del pedido te envío el alias para transferir' },
};
const CHECKOUT_STEPS = [
  ['payment', 'Forma de pago'],
  ['shipping', 'Datos de envío'],
];
const DOC_TYPES = ['DNI', 'LC', 'LE', 'CI', 'Pasaporte'];
const PROVINCES = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz',
  'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
];

const EMPTY_FORM = {
  payment: '',
  shipping: 'domicilio',
  name: '',
  docType: 'DNI',
  doc: '',
  address: '',
  city: '',
  province: '',
  zip: '',
  phone: '',
  email: '',
  branch: '',
  pickupDay: '',
  pickupTime: '',
};

const digits = (s) => s.replace(/\D/g, '');

// devuelve { campo: mensaje } solo con los que tienen problemas, en el orden en que aparecen en pantalla
const validate = (f) => {
  const errors = {};
  const pickup = f.shipping === 'retiro';
  // en el retiro el calendario va primero, así el foco salta ahí si falta elegir
  if (pickup) {
    if (!f.pickupDay) errors.pickupDay = 'Elegí un día';
    // por si el carrito quedó abierto de un día para otro
    else if (!inPickupRange(f.pickupDay)) errors.pickupDay = 'Ese día ya no está disponible, elegí otro';
    if (!f.pickupTime) errors.pickupTime = 'Elegí un horario';
  }

  const name = f.name.trim();
  if (!name) errors.name = 'Escribí tu nombre y apellido';
  else if (name.split(/\s+/).length < 2) errors.name = 'Falta el apellido';

  // para retirar no hacen falta documento ni dirección
  if (!pickup) {
    // se aceptan puntos y espacios ("12.345.678")
    const doc = f.doc.trim();
    const passport = f.docType === 'Pasaporte';
    const docOk = passport ? /^[a-z0-9]{6,12}$/i.test(doc) : /^[\d.\s]+$/.test(doc) && /^\d{6,9}$/.test(digits(doc));
    if (!doc) errors.doc = 'Escribí tu número de documento';
    else if (!docOk) errors.doc = passport ? 'Revisá el número de pasaporte' : 'Usá solo números (entre 6 y 9)';

    if (!f.address.trim()) errors.address = 'Escribí la calle y el número';
    else if (!/\d/.test(f.address)) errors.address = 'Falta el número de la calle';
    if (!f.city.trim()) errors.city = 'Escribí tu localidad';
    if (!f.province) errors.province = 'Elegí una provincia';

    const zip = f.zip.trim();
    if (!zip) errors.zip = 'Escribí el código postal';
    else if (!/^(\d{4}|[a-z]\d{4}[a-z]{3})$/i.test(zip)) errors.zip = 'Tiene que tener 4 números (ej. 1406)';
  }

  if (!f.phone.trim()) errors.phone = 'Escribí un teléfono';
  else if (digits(f.phone).length < 8) errors.phone = 'El número parece incompleto';

  if (!f.email.trim()) errors.email = 'Escribí tu correo';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errors.email = 'Revisá el correo (ej. nombre@gmail.com)';
  return errors;
};

const ErrorText = ({ id, children }) => (
  <small className="field__error" id={id}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9.5v4M12 17h.01" />
    </svg>
    {children}
  </small>
);

const Field = ({ id, label, error, children }) => (
  <div className={`field ${error ? 'has-error' : ''}`}>
    <label htmlFor={id}>{label}</label>
    {children}
    {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
  </div>
);

export const CartDrawer = () => {
  const { cartOpen, setCartOpen } = useUI();
  const { items, total } = useCart();
  const { products } = useProducts();
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const discount = form.payment === 'efectivo' ? Math.round(total * CASH_DISCOUNT) : 0;
  const toPay = total - discount;

  // un campo se valida recién al salir de él (blur) o al tocar "Pedir por WhatsApp", nunca mientras escribís
  const check = (key, values = form) => {
    const message = validate(values)[key];
    setErrors(({ [key]: _, ...rest }) => (message ? { ...rest, [key]: message } : rest));
  };
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const control = (key) => ({
    id: `co-${key}`,
    name: key,
    value: form[key],
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `co-${key}-error` : undefined,
  });
  const input = (key) => ({ ...control(key), onChange: (e) => set(key, e.target.value), onBlur: () => check(key) });
  // en un dropdown elegir una opción ya es "terminar" el campo
  const select = (key) => ({
    ...control(key),
    onChange: (v) => {
      const next = { ...form, [key]: v };
      set(key, v);
      check(key, next);
      // cambiar DNI ↔ Pasaporte cambia qué número es válido
      if (key === 'docType' && errors.doc) check('doc', next);
    },
    onBlur: () => check(key),
  });

  useEffect(() => {
    document.body.classList.toggle('no-scroll', cartOpen);
    if (!cartOpen) {
      setStep('cart');
      return;
    }
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cartOpen, setCartOpen]);

  useEffect(() => {
    if (!items.length) setStep('cart');
  }, [items.length]);

  // cada paso arranca limpio: el blur del campo al tocar "Volver" o cerrar el carrito no tiene que dejar errores guardados
  useEffect(() => setErrors({}), [step]);

  const toShipping = () => {
    if (form.payment) return setStep('shipping');
    setErrors({ payment: 'Elegí cómo vas a pagar' });
    document.getElementById('co-payment')?.focus();
  };

  const choosePayment = (payment) => {
    // en efectivo solo se puede retirar
    setForm((f) => ({ ...f, payment, shipping: payment === 'efectivo' ? 'retiro' : f.shipping }));
    setErrors(({ payment: _, ...rest }) => rest);
  };

  const checkout = (e) => {
    e.preventDefault();
    if (step === 'payment') return toShipping();
    const found = validate(form);
    setErrors(found);
    const invalid = Object.keys(found);
    if (invalid.length) {
      document.getElementById(`co-${invalid[0]}`)?.focus();
      return;
    }
    const f = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()]));
    const lines = items.map(
      (it) => `• ${it.qty} × ${it.name}${it.variant ? ` (${variantText(it)})` : ''} — ${money.format(it.price * it.qty)}`
    );
    const msg = [
      `¡Hola Kimi! ✿ Soy ${f.name} y quiero hacer este pedido:`,
      '',
      ...lines,
      '',
      ...(discount ? [`Subtotal: ${money.format(total)}`, `Descuento por pago en efectivo (${CASH_DISCOUNT_LABEL}): ${money.format(-discount)}`] : []),
      `*Total: ${money.format(toPay)}*`,
      f.shipping === 'retiro' ? 'Envío: gratis' : 'Envío: a calcular',
      f.payment === 'efectivo' ? 'Pago: en efectivo al retirar' : 'Pago: por transferencia (espero el alias)',
      '',
      ...(f.shipping === 'retiro'
        ? [`*Retiro gratis en ${PICKUP_PLACE}*`, `Día: ${formatDay(f.pickupDay)}`, `Hora: ${f.pickupTime}`, `Nombre: ${f.name}`]
        : [
            `*${SHIPPING[f.shipping]} (Correo Argentino)*`,
            f.shipping === 'sucursal' && f.branch ? `Sucursal: ${f.branch}` : null,
            `Nombre: ${f.name}`,
            `${f.docType}: ${f.doc}`,
            `Dirección: ${f.address}`,
            `Localidad: ${f.city}, ${f.province}`,
            `CP: ${f.zip}`,
          ]),
      `Teléfono: ${f.phone}`,
      `Email: ${f.email}`,
    ]
      .filter((l) => l !== null)
      .join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  };

  const inCheckout = step !== 'cart';
  const stepIndex = CHECKOUT_STEPS.findIndex(([key]) => key === step);
  const pickup = form.shipping === 'retiro';
  const slots = slotsFor(form.pickupDay);
  const shippingOptions = form.payment === 'efectivo' ? ['retiro'] : Object.keys(SHIPPING);

  const pickDay = (key) => {
    // si el horario elegido no existe ese día (semana ↔ finde), se borra
    const next = { ...form, pickupDay: key, pickupTime: slotsFor(key).includes(form.pickupTime) ? form.pickupTime : '' };
    setForm(next);
    check('pickupDay', next);
  };

  const pickTime = (time) => {
    const next = { ...form, pickupTime: time };
    setForm(next);
    check('pickupTime', next);
  };

  const phoneField = (
    <Field id="co-phone" label="Teléfono" error={errors.phone}>
      <input type="tel" autoComplete="tel" {...input('phone')} />
    </Field>
  );

  const totalRow = (className = '') => (
    <div className={`totals ${className}`}>
      {discount > 0 && (
        <>
          <div className="shipping-cost">
            <span>Subtotal</span>
            <b>{money.format(total)}</b>
          </div>
          <div className="shipping-cost">
            <span>Descuento efectivo ({CASH_DISCOUNT_LABEL})</span>
            <b>{money.format(-discount)}</b>
          </div>
        </>
      )}
      <div className="receipt-total">
        <span>Total</span>
        <b>{money.format(toPay)}</b>
      </div>
      <div className="shipping-cost">
        <span>Costo de envío</span>
        <b>{pickup ? 'Gratis' : 'A calcular*'}</b>
      </div>
      {!pickup && <small className="shipping-cost__note">* Se envía luego por WhatsApp</small>}
    </div>
  );

  const paymentStep = (
    <>
      <h3 className="h-script">Forma de pago</h3>
      <div className={`field ${errors.payment ? 'has-error' : ''}`}>
        <div className="pay-options" id="co-payment" role="radiogroup" aria-label="Forma de pago" tabIndex={-1}>
          {Object.entries(PAYMENT).map(([value, { label, hint }]) => (
            <label key={value} className="pay-option">
              <input type="radio" name="payment" value={value} checked={form.payment === value} onChange={() => choosePayment(value)} />
              <span>
                <b>{label}</b>
                <small>{hint}</small>
              </span>
            </label>
          ))}
        </div>
        {errors.payment && <ErrorText id="co-payment-error">{errors.payment}</ErrorText>}
      </div>
    </>
  );

  const shippingStep = (
    <>
      <h3 className="h-script">{pickup ? 'Datos para el retiro' : 'Datos de envío'}</h3>
      <p className="checkout__note">
        {pickup
          ? `Retirás sin costo en ${PICKUP_PLACE}${form.payment === 'efectivo' ? ' y abonás en efectivo' : ''}.`
          : 'Los envíos se hacen por Correo Argentino'}
      </p>

      <fieldset className="colors">
        <legend>¿Cómo querés recibirlo?</legend>
        {shippingOptions.map((value) => (
          <label key={value}>
            <input type="radio" name="shipping" value={value} checked={form.shipping === value} onChange={() => set('shipping', value)} />
            <span>{SHIPPING[value]}</span>
          </label>
        ))}
      </fieldset>
      {form.payment === 'efectivo' && <p className="checkout__hint">Pagando en efectivo, el pedido se retira en la estación.</p>}

      {pickup && (
        <>
          <Field id="co-pickupDay" label="¿Qué día lo retirás?" error={errors.pickupDay}>
            <p className="checkout__hint">
              Lleva 4 días prepararlo; podés pasar a buscarlo entre el {formatDay(pickupRange().from)} y el{' '}
              {formatDay(pickupRange().to)}.
            </p>
            <PickupCalendar id="co-pickupDay" value={form.pickupDay} onChange={pickDay} aria-invalid={errors.pickupDay ? true : undefined} />
          </Field>
          {form.pickupDay && (
            <Field id="co-pickupTime" label={`Horario · ${formatDay(form.pickupDay)}`} error={errors.pickupTime}>
              <div className="colors slots" id="co-pickupTime" role="radiogroup" tabIndex={-1}>
                {slots.map((s) => (
                  <label key={s}>
                    <input type="radio" name="pickupTime" value={s} checked={form.pickupTime === s} onChange={() => pickTime(s)} />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </Field>
          )}
          <aside className="notice">
            <p>
              <b>¿Te surgió algo?</b> Podés reagendar el retiro para otra fecha por WhatsApp, <b>solo una vez</b>.
            </p>
            <p>
              El tiempo de espera en la estación es de <b>30 minutos</b>.
            </p>
          </aside>
        </>
      )}

      <Field id="co-name" label="Nombre y apellido completo" error={errors.name}>
        <input type="text" autoComplete="name" {...input('name')} />
      </Field>
      {pickup ? (
        <>
          {phoneField}
          <Field id="co-email" label="Correo electrónico" error={errors.email}>
            <input type="email" autoComplete="email" {...input('email')} />
          </Field>
        </>
      ) : (
        <>
          <div className="checkout__row checkout__row--doc">
            <Field id="co-docType" label="Documento">
              <Select options={DOC_TYPES} {...select('docType')} />
            </Field>
            <Field id="co-doc" label="Número" error={errors.doc}>
              <input type="text" inputMode={form.docType === 'Pasaporte' ? 'text' : 'numeric'} {...input('doc')} />
            </Field>
          </div>
          <Field id="co-address" label="Dirección (calle, número, piso/depto)" error={errors.address}>
            <input type="text" autoComplete="street-address" {...input('address')} />
          </Field>
          <div className="checkout__row">
            <Field id="co-city" label="Localidad" error={errors.city}>
              <input type="text" autoComplete="address-level2" {...input('city')} />
            </Field>
            <Field id="co-province" label="Provincia" error={errors.province}>
              <Select options={PROVINCES} {...select('province')} />
            </Field>
          </div>
          <div className="checkout__row">
            <Field id="co-zip" label="Código postal" error={errors.zip}>
              <input type="text" autoComplete="postal-code" {...input('zip')} />
            </Field>
            {phoneField}
          </div>
          <Field id="co-email" label="Correo electrónico" error={errors.email}>
            <input type="email" autoComplete="email" {...input('email')} />
          </Field>
          {form.shipping === 'sucursal' && (
            <Field id="co-branch" label="Sucursal de Correo Argentino (si ya sabés cuál)">
              <input type="text" placeholder="Opcional" {...input('branch')} />
            </Field>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <div className="drawer-backdrop" hidden={!cartOpen} onClick={() => setCartOpen(false)} />
      <aside className={`drawer ${cartOpen ? 'is-open' : ''} ${inCheckout ? 'is-wide' : ''}`} aria-label="Carrito" aria-hidden={!cartOpen}>
        <div className="drawer__head">
          {inCheckout ? (
            <button className="drawer__back" onClick={() => setStep(stepIndex === 0 ? 'cart' : CHECKOUT_STEPS[stepIndex - 1][0])}>
              <svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true">
                <path d="M6.2 1.5C4.8 3 3.3 4.5 1.6 6c1.7 1.5 3.2 3 4.6 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {stepIndex === 0 ? 'Volver al carrito' : 'Volver'}
            </button>
          ) : (
            <h3 className="h-script">Mi carrito</h3>
          )}
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        {!inCheckout && (
          <>
            <div className="drawer__items">
              {!items.length && (
                <div className="cart-empty">
                  <p className="h-script">Está vacío...</p>
                  <p>¡Sumale algo lindo! ✿</p>
                </div>
              )}
              {items.map((it) => {
                const p = products.find((x) => x.id === it.id);
                return (
                  <div className="line" key={it.key}>
                    {p ? <ProductVisual product={p} className="line__img" /> : <span />}
                    <div className="line__info">
                      <b>{it.name}</b>
                      {it.variant && <small>{variantText(it)}</small>}
                      <span className="price">{money.format(it.price * it.qty)}</span>
                    </div>
                    <div className="qty">
                      <button onClick={() => cart.change(it.key, -1)} aria-label="Quitar uno">
                        −
                      </button>
                      <span>{it.qty}</span>
                      <button onClick={() => cart.change(it.key, +1)} aria-label="Sumar uno">
                        +
                      </button>
                    </div>
                    <button className="line__remove" onClick={() => cart.remove(it.key)} aria-label={`Eliminar ${it.name}`}>
                      <TrashIcon />
                    </button>
                  </div>
                );
              })}
            </div>
            {items.length > 0 && (
              <div className="drawer__foot">
                {totalRow()}
                {/* keys distintas: si React reutiliza el mismo <button>, el click en "Continuar" termina enviando el form recién montado */}
                <button key="next" type="button" className="btn btn--pink btn--block" onClick={() => setStep('payment')}>
                  Continuar
                </button>
              </div>
            )}
          </>
        )}

        {inCheckout && (
          <div className="checkout-layout">
            {/* resumen de solo lectura; en celular se oculta y queda el total abajo */}
            <section className="summary" aria-label="Resumen del pedido">
              <h3 className="h-script">Tu pedido</h3>
              <ul className="summary__items">
                {items.map((it) => {
                  const p = products.find((x) => x.id === it.id);
                  return (
                    <li key={it.key}>
                      {p ? <ProductVisual product={p} className="line__img" /> : <span />}
                      <div className="line__info">
                        <b>{it.name}</b>
                        {it.variant && <small>{variantText(it)}</small>}
                        <small>
                          {it.qty} × {money.format(it.price)}
                        </small>
                      </div>
                      <span className="price">{money.format(it.price * it.qty)}</span>
                    </li>
                  );
                })}
              </ul>
              {totalRow('summary__total')}
            </section>

            <div className="checkout-pane">
              <ol className="progress" style={{ '--progress': (stepIndex + 1) / CHECKOUT_STEPS.length }}>
                {CHECKOUT_STEPS.map(([key, label], k) => (
                  <li key={key} className={k < stepIndex ? 'is-done' : k === stepIndex ? 'is-current' : ''} aria-current={k === stepIndex ? 'step' : undefined}>
                    {/* a los pasos ya hechos se puede volver tocándolos */}
                    <button type="button" disabled={k >= stepIndex} onClick={() => setStep(key)}>
                      <span className="progress__dot">{k < stepIndex ? '✓' : k + 1}</span>
                      {label}
                    </button>
                  </li>
                ))}
              </ol>

              {/* key: al cambiar de paso el scroll vuelve arriba */}
              <div className="drawer__items" key={step}>
                <form id="checkout" className="checkout" onSubmit={checkout} noValidate>
                  {step === 'payment' ? paymentStep : shippingStep}
                </form>
              </div>

              <div className="drawer__foot">
                {totalRow('receipt-total--mobile')}
                {step === 'payment' ? (
                  <button key="payment" type="submit" form="checkout" className="btn btn--pink btn--block">
                    Continuar
                  </button>
                ) : (
                  <button key="submit" type="submit" form="checkout" className="btn btn--mint btn--block">
                    Pedir por WhatsApp ✿
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
