export class ObjectUtils {
  static removeEmpty(obj) {
    return Object.entries(obj).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {},
    );
  }
}

export const camelToSnake = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export const snakeToCamel = (str) =>
  str
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', ''),
    );

export const delay = (ms) => {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
};
