import EventEmitter from 'events';
import { useEffect, useRef } from 'react';

export function useEventEmitter(
  emitter: EventEmitter | undefined,
  eventName: string | symbol,
  handler: (...args: unknown[]) => void,
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Allow disabling this hook by passing a falsy emitter
    if (!emitter) {
      return;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener = (...args: unknown[]) => savedHandler.current(...args);

    emitter.on(eventName, eventListener);

    return () => {
      emitter.off(eventName, eventListener);
    };
  }, [eventName, emitter]);
}
