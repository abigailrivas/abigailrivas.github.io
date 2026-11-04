import { useEffect, useRef, useState } from 'react';

// dropdown propio (el <select> nativo no se puede estilizar): botón + listbox, se maneja con teclado
export const Select = ({ id, value, onChange, options, placeholder = 'Elegí...', ...aria }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const listRef = useRef(null);

  const choose = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  const show = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const onKeyDown = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === 'ArrowDown') setActive((k) => Math.min(k + 1, options.length - 1));
    else if (e.key === 'ArrowUp') setActive((k) => Math.max(k - 1, 0));
    else if (e.key === 'Enter' || e.key === ' ') choose(options[active]);
    else if (e.key === 'Escape') {
      e.stopPropagation(); // que no cierre también el carrito
      setOpen(false);
    } else if (e.key === 'Tab') return setOpen(false);
    else if (e.key.length === 1) {
      // escribir una letra salta a la primera opción que empieza con ella
      const k = options.findIndex((o) => o.toLowerCase().startsWith(e.key.toLowerCase()));
      if (k >= 0) setActive(k);
      return;
    } else return;
    e.preventDefault();
  };

  return (
    <div className={`select ${open ? 'is-open' : ''}`} ref={ref}>
      <button
        type="button"
        id={id}
        className="select__btn"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        {...aria}
      >
        <span className={value ? '' : 'select__placeholder'}>{value || placeholder}</span>
        <svg className="nav-menu__caret" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true">
          <path d="M1.5 1.8c1.5 1.4 3 2.9 4.5 4.6 1.5-1.7 3-3.2 4.5-4.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        // mousedown sin default: el botón no pierde el foco (y no dispara su blur) al hacer click en una opción
        <ul className="select__panel" role="listbox" id={`${id}-list`} ref={listRef} onMouseDown={(e) => e.preventDefault()}>
          {options.map((opt, k) => (
            <li
              key={opt}
              id={`${id}-${k}`}
              role="option"
              aria-selected={opt === value}
              className={k === active ? 'is-active' : ''}
              onMouseEnter={() => setActive(k)}
              onClick={() => choose(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
