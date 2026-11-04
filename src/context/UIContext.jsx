import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [toastState, setToastState] = useState({ text: '', on: false });
  const timer = useRef();

  const toast = useCallback((text) => {
    setToastState({ text, on: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastState((t) => ({ ...t, on: false })), 2200);
  }, []);

  const value = useMemo(
    () => ({
      cartOpen,
      setCartOpen,
      toastState,
      toast,
    }),
    [cartOpen, toastState, toast]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);
