export function is(obj, type: new () => any) {
  if (!obj) {
    return obj === type;
  }
  return obj.constructor === type;
}
