export const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-md bg-emerald-800 text-white hover:bg-emerald-700 
    transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);