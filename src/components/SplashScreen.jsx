import { useEffect } from 'react';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-ivory flex flex-col items-center justify-center z-50">
      <div className="text-center space-y-4">
        {/* Animated logo mark */}
        <div className="animate-fade-scale text-5xl" aria-hidden="true">
          🌸📍
        </div>
        {/* Brand name */}
        <h1 className="animate-fade-in text-3xl font-bold tracking-tight text-plum">
          HERWAY
        </h1>
        {/* Tagline */}
        <p className="animate-fade-up text-text-secondary text-lg">
          “Every journey, with confidence.”
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;