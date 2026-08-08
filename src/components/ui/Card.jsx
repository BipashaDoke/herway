const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-surface rounded-2xl border border-gray-100 shadow-sm p-4 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;