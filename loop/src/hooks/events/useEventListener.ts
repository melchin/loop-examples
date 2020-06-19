/**
 * Generic way of using hooks to set up any event listener
 */
import { useEffect, useRef } from "react";

export type Handler = (e: Event) => void;

const defaultHandler = (e: Event) => null;

const useEventListener = (
  eventName: string,
  handler: Handler = defaultHandler,
  ref: React.MutableRefObject<any>
) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const reference = ref;
    const isSupportedElementType =
      reference && reference.current.addEventListener;
    if (!isSupportedElementType) {
      return;
    }

    const eventListener = (event: Event) => savedHandler.current(event);
    reference.current.addEventListener(eventName, eventListener);
    return () => {
      reference.current.removeEventListener(eventName, eventListener);
    };
  }, [eventName, ref]);
};

export default useEventListener;
