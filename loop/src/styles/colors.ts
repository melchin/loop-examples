export const rgba = (r: number, g: number, b: number) => (a: number = 1) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;

export const grey = rgba(136, 136, 136); // #888888

export const white = rgba(255, 255, 255); // #FFFFFF

export default {
  grey,
  white,
};
