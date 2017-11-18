export function is(obj, type: new () => any) {
  return obj.constructor === type;
}
