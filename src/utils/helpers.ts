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

export function randomAlphabet(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function randomNumberString(length) {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function randomLicensePlates(length) {
  const plates = new Set();

  while (plates.size < length) {
    const f = randomAlphabet(3);
    const l = randomNumberString(4);
    plates.add(`${f}-${l}`);
  }

  return Array.from(plates);
}
