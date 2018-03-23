export function is(obj, type: new () => any) {
  if (obj === null || obj === undefined) {
    return obj === type;
  }
  return obj.constructor === type;
}
