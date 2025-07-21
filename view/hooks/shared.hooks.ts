// TODO: Consider breaking up into multiple files

import {
  Breakpoint,
  useColorScheme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { RefObject, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { BrowserEvents, LocalStorageKeys } from '../constants/shared.constants';
import { useAppStore } from '../store/app.store';
import { PubSubMessage, SubscriptionOptions } from '../types/shared.types';
import { getWebSocketURL } from '../utils/shared.utils';

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

export const useSubscription = (
  channel: string,
  options?: SubscriptionOptions,
) => {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const isEnabled = options?.enabled ?? true;

  const getOptions = () => {
    if (!options || !options.onMessage) {
      return options;
    }
    const onMessage = (event: MessageEvent) => {
      const message: PubSubMessage = JSON.parse(event.data);
      // Ignore messages from other channels
      if (message.channel !== channel || !options.onMessage) {
        return;
      }
      // Log errors from the server
      if (message.type === 'RESPONSE' && message.error) {
        console.error(message.error);
        return;
      }
      options.onMessage(event);
    };
    return { ...options, onMessage };
  };

  const { sendMessage, readyState, ...rest } = useWebSocket(getWebSocketURL(), {
    // Ensure multiple channels can be subscribed to in
    // the same component with `share` set to `true`
    share: true,
    shouldReconnect: () => isLoggedIn,
    ...getOptions(),
  });

  useEffect(() => {
    const token = localStorage.getItem(LocalStorageKeys.AccessToken);
    if (!isLoggedIn || !token) {
      return;
    }

    if (isEnabled && readyState === WebSocket.OPEN) {
      const message: PubSubMessage = {
        type: 'REQUEST',
        request: 'SUBSCRIBE',
        channel,
        token,
      };
      sendMessage(JSON.stringify(message));
    }
  }, [channel, isEnabled, readyState, sendMessage, isLoggedIn]);

  return { sendMessage, ...rest };
};

export const useIsDarkMode = () => {
  const [prefersDarkMode, setPrefersDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const { mode } = useColorScheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) =>
      setPrefersDarkMode(e.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (mode === 'system') {
    return prefersDarkMode;
  }

  return mode === 'dark';
};

export const useAboveBreakpoint = (breakpoint: Breakpoint) =>
  useMediaQuery(useTheme().breakpoints.up(breakpoint));

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return [screenSize.width, screenSize.height];
};

export const useInView = (
  ref: RefObject<HTMLElement>,
  rootMargin = '0px',
  onView?: () => void,
) => {
  const [inView, setInView] = useState(false);
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    const isBrowserCompatible = 'IntersectionObserver' in window;
    if (!isBrowserCompatible) {
      setInView(true);
      setViewed(true);
      return;
    }
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setViewed(true);
          onView?.();
        }
        setInView(entry.isIntersecting);
      },
      { rootMargin },
    );
    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, rootMargin, onView]);

  return { inView, setInView, viewed, setViewed };
};
