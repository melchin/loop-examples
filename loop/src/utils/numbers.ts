export const withCommas = (value: number) =>
  value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
