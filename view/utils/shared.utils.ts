export const sleep = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isMobileAgent = () =>
  /iPhone|iPod|Android|BlackBerry|webOS/i.test(navigator.userAgent);

export const isTouchDevice = () =>
  !!navigator.maxTouchPoints || 'ontouchstart' in document.documentElement;

export const getWebSocketURL = () =>
  process.env.NODE_ENV === 'development'
    ? `ws://${window.location.hostname}:${process.env.SERVER_PORT}/ws`
    : `wss://${window.location.host}/ws`;
