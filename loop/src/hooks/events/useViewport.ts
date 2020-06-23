import { useEffect, useState } from "react";

export default function useViewport() {
  const [viewport, setViewport] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleWindowResize() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }
    const _window = window;
    _window.addEventListener("resize", handleWindowResize);
    _window.addEventListener("orientationchange", handleWindowResize);
    return () => {
      _window.removeEventListener("resize", handleWindowResize);
      _window.removeEventListener("orientationchange", handleWindowResize);
    };
  }, []);

  return viewport;
}
