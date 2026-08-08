const HerWayLogo = ({ compact = false }) => (
  <div className="flex items-center gap-2 select-none">
    <span className="text-2xl" role="img" aria-hidden="true">🌸</span>
    {!compact && (
      <span className="text-xl font-bold tracking-tight text-plum">
        HerWay
      </span>
    )}
  </div>
);

export default HerWayLogo;