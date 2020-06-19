import { useRef } from "react";

const getValid = (
  sassKey: string | undefined,
  customSassKey: string | undefined
): string[] => {
  if (customSassKey) {
    return [customSassKey];
  }
  return typeof sassKey === "string" ? [sassKey] : [];
};

type Sass = { [className: string]: string };

const useCustomStyles = (
  sass: Sass,
  customSass: Sass,
  name: keyof Sass
): string[] => {
  const _classes = useRef<string[]>(getValid(sass[name], customSass[name]));
  return _classes.current;
};

export default useCustomStyles;
