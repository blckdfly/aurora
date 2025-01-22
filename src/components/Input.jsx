export const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border rounded-md focus:outline-none 
    focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${className}`}
    {...props}
  />
);