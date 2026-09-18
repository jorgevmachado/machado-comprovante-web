export function isObject(value: unknown): boolean {
  return value instanceof Object && !Array.isArray(value);
}