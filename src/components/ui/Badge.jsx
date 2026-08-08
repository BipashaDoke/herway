const variantClasses = {
  safe: 'bg-safe/10 text-safe',
  caution: 'bg-caution/10 text-caution',
  concern: 'bg-concern/10 text-concern',
  neutral: 'bg-gray-100 text-text-secondary',
};

const Badge = ({ children, variant = 'neutral', className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
  >
    {children}
  </span>
);

export default Badge;