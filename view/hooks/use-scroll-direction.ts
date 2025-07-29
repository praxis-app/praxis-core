import { RefObject, useEffect, useRef, useState } from 'react';
import { BrowserEvents } from '@/constants/shared.constants';

const RESET_SCROLL_DIRECTION_TIMEOUT = 700;
const RESET_SCROLL_DIRECTION_THRESHOLD = 40;

type ScrollDirection = 'up' | 'down' | null;

export const useScrollDirection = (
  scrollableRef: RefObject<HTMLElement>,
  resetTimeout = RESET_SCROLL_DIRECTION_TIMEOUT,
) => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const previousScrollTop = useRef(0);

  useEffect(() => {
    if (!scrollableRef.current) {
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    const scrollableCopy = scrollableRef.current;

    // Initialize with the current scroll position
    previousScrollTop.current = scrollableCopy.scrollTop;

    const handleScroll = () => {
      const currentScrollTop = scrollableCopy.scrollTop;

      if (previousScrollTop.current > currentScrollTop) {
        setScrollDirection('up');
      } else if (previousScrollTop.current < currentScrollTop) {
        setScrollDirection('down');
      }

      previousScrollTop.current = currentScrollTop;

      // Reset scroll direction after some time if near top
      if (currentScrollTop < RESET_SCROLL_DIRECTION_THRESHOLD) {
        timeout = setTimeout(() => {
          setScrollDirection(null);
        }, resetTimeout);
      }
    };

    scrollableCopy.addEventListener(BrowserEvents.Scroll, handleScroll, {
      passive: true,
    });

    return () => {
      if (scrollableCopy) {
        scrollableCopy.removeEventListener(BrowserEvents.Scroll, handleScroll);
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [scrollableRef, resetTimeout]);

  return scrollDirection;
};
