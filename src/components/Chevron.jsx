export const Chevron = ({ dir }) => (
  <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden="true">
    <path
      d={dir < 0 ? 'M8.5 2.5C6.6 4.4 4.9 6.1 3 8c1.9 1.9 3.6 3.6 5.5 5.5' : 'M3.5 2.5C5.4 4.4 7.1 6.1 9 8c-1.9 1.9-3.6 3.6-5.5 5.5'}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
