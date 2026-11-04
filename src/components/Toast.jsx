import { useUI } from '../context/UIContext.jsx';

export const Toast = () => {
  const { toastState } = useUI();
  return (
    <div className={`toast ${toastState.on ? 'is-on' : ''}`} role="status" aria-live="polite">
      {toastState.text}
    </div>
  );
};
