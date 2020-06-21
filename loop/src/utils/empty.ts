/**
 * For shallow copy memoization purposes, we keep these constants to
 * pass as props or as params to memoized selectors to prevent
 * uncessary shallow copy recalculations.
 */
export const emptyObject: { [key: string]: any } = {};
export const emptyArray: Array<any> = [];

export function emptyArrayOr<T extends any[]>(
  maybeArray: T | undefined | null
) {
  if (maybeArray && maybeArray.length) {
    return maybeArray;
  }
  return emptyArray as T;
}

export function emptyObjectOr<T extends { [key: string]: any }>(
  maybeObj: T | undefined | null
): T {
  if (maybeObj && Object.keys(maybeObj).length) {
    return maybeObj;
  }
  return emptyObject as T;
}
