import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsDesktop(window.innerWidth > MOBILE_BREAKPOINT);
    };

    mql.addEventListener('change', onChange);
    setIsDesktop(window.innerWidth > MOBILE_BREAKPOINT);

    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return isDesktop;
}
