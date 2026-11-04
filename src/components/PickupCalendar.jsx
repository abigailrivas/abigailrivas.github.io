import { useState } from 'react';

const WEEKDAY_SLOTS = ['9:00', '17:30', '18:00', '18:30', '19:00'];
// cada media hora entre dos horas en punto, ambas incluidas: halfHours(10, 12) -> 10:00, 10:30, ..., 12:00
const halfHours = (from, to) => Array.from({ length: (to - from) * 2 + 1 }, (_, k) => `${from + Math.floor(k / 2)}:${k % 2 ? '30' : '00'}`);
// fines de semana: de 10:00 a 12:00 y de 16:00 a 18:00
const WEEKEND_SLOTS = [...halfHours(10, 12), ...halfHours(16, 18)];
const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const PREP_DAYS = 4; // días que lleva preparar el pedido
const PICKUP_WINDOW_DAYS = 14; // después de eso, dos semanas para pasar a buscarlo

const monthName = new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' });
const longDate = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

// "2026-11-04" en hora local (toISOString pasaría a UTC y podría correr el día)
export const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

// "domingo, 8 de noviembre" -> "domingo 8 de noviembre"
export const formatDay = (key) => longDate.format(fromKey(key)).replace(',', '');

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const monthsBetween = (a, b) => (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();

// primer y último día en que se puede retirar, como "YYYY-MM-DD"
export const pickupRange = (now = new Date()) => ({
  from: dayKey(addDays(now, PREP_DAYS)),
  to: dayKey(addDays(now, PREP_DAYS + PICKUP_WINDOW_DAYS)),
});

export const inPickupRange = (key) => {
  const { from, to } = pickupRange();
  return key >= from && key <= to;
};

export const slotsFor = (key) => {
  if (!key) return [];
  const day = fromKey(key).getDay();
  return day === 0 || day === 6 ? WEEKEND_SLOTS : WEEKDAY_SLOTS;
};

const Chevron = ({ flip }) => (
  <svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M6.2 1.5C4.8 3 3.3 4.5 1.6 6c1.7 1.5 3.2 3 4.6 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PickupCalendar = ({ id, value, onChange, ...aria }) => {
  const today = new Date();
  const todayKey = dayKey(today);
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const { from, to } = pickupRange(today);
  // se puede navegar solo entre los meses que tienen días disponibles
  const minOffset = monthsBetween(first, fromKey(from));
  const maxOffset = monthsBetween(first, fromKey(to));
  const [offset, setOffset] = useState(() => {
    if (value) return monthsBetween(first, fromKey(value));
    // arranca en el mes actual, o en el siguiente si a este le queda menos de una semana
    const daysLeft = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();
    return daysLeft < 7 ? 1 : 0;
  });

  const month = new Date(first.getFullYear(), first.getMonth() + offset, 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const blanks = (month.getDay() + 6) % 7; // la semana arranca el lunes
  const days = Array.from({ length: daysInMonth }, (_, k) => new Date(month.getFullYear(), month.getMonth(), k + 1));

  return (
    <div className="calendar" id={id} tabIndex={-1} {...aria}>
      <div className="calendar__head">
        <button type="button" className="calendar__nav" onClick={() => setOffset((o) => o - 1)} disabled={offset <= minOffset} aria-label="Mes anterior">
          <Chevron />
        </button>
        <b>{monthName.format(month).replace(/^./, (c) => c.toUpperCase())}</b>
        <button type="button" className="calendar__nav" onClick={() => setOffset((o) => o + 1)} disabled={offset >= maxOffset} aria-label="Mes siguiente">
          <Chevron flip />
        </button>
      </div>
      <div className="calendar__grid" role="grid">
        {WEEKDAYS.map((d, k) => (
          <span key={k} className="calendar__weekday" aria-hidden="true">
            {d}
          </span>
        ))}
        {Array.from({ length: blanks }, (_, k) => (
          <span key={`b${k}`} />
        ))}
        {days.map((d) => {
          const key = dayKey(d);
          return (
            <button
              type="button"
              key={key}
              className={`calendar__day ${key === todayKey ? 'is-today' : ''}`}
              aria-pressed={key === value}
              aria-label={formatDay(key)}
              disabled={key < from || key > to}
              onClick={() => onChange(key)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};
