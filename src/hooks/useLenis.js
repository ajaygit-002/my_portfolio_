import { useEffect, useState } from 'react';

export const useLenis = () => {
  const [lenisInstance, setLenisInstance] = useState(window.lenis || null);

  useEffect(() => {
    const checkLenis = () => {
      if (window.lenis && window.lenis !== lenisInstance) {
        setLenisInstance(window.lenis);
      }
    };

    const interval = setInterval(checkLenis, 100);
    return () => clearInterval(interval);
  }, [lenisInstance]);

  return lenisInstance;
};
