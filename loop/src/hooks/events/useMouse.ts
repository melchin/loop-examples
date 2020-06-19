import { MutableRefObject, useCallback, useEffect, useState } from "react";
import useEventListener, { Handler } from "./useEventListener";

/**
 * Reduces code duplication by utilizing the useEventListener hook
 * to generate specific hooks for different event listeners.
 * @param eventName - A valid event type
 */
const createGenericEvent = (eventName: string) => (
  ref: MutableRefObject<any>,
  handler?: Handler
) => useEventListener(eventName, handler, ref);

export const useMouseDown = createGenericEvent("mousedown");
export const useMouseUp = createGenericEvent("mouseup");
export const useMouseOver = createGenericEvent("mouseover");
export const useMouseMouseMove = createGenericEvent("mousemove");
export const useMouseClick = createGenericEvent("click");
export const useMouseDblClick = createGenericEvent("dblclick");
export const useMouseMouseEnter = createGenericEvent("mouseenter");
export const useMouseMouseOut = createGenericEvent("mouseout");
export const useMouseMouseLeave = createGenericEvent("mouseleave");
export const useMouseContextMenu = createGenericEvent("contextmenu"); // Right Click

export const useMouseHover = (ref: MutableRefObject<any>, handler?: any) => {
  const [hovered, setHovered] = useState(false);

  const enter = useCallback(
    (e: any) => {
      if (handler) {
        handler(e);
      }
      setHovered(true);
    },
    [handler]
  );
  const leave = (e: any) => setHovered(false);

  useEffect(() => {
    const reference = ref;
    reference.current.addEventListener("mouseenter", enter);
    reference.current.addEventListener("mouseleave", leave);
    return () => {
      reference.current.removeEventListener("mouseenter", enter);
      reference.current.removeEventListener("mouseleave", leave);
    };
  }, [ref, enter]);

  return hovered;
};

export default useMouseClick;
