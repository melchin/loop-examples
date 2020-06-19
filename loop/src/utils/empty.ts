/**
 * For shallow copy memoization purposes, we keep these constants to
 * pass as props or as params to memoized selectors to prevent
 * uncessary shallow copy recalculations.
 */
export const emptyObject: { [key: string]: any } = {};
export const emptyArray: Array<any> = [];

export function emptyArrayOr<T extends []>(maybeArray: T | undefined | null) {
  if (maybeArray && maybeArray.length) {
    return maybeArray;
  }
  return emptyArray;
}

export function emptyObjectOr<T extends {}>(maybeObj: T | undefined | null) {
  if (maybeObj && Object.keys(maybeObj).length) {
    return maybeObj;
  }
  return emptyObject;
}
