export function deepEqual<T>(a: T, b: T, excludeKeys?: [keyof T]): boolean {
  if (a === b) return true;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  let keysA = Object.keys(a) as (keyof T)[];
  let keysB = Object.keys(b) as (keyof T)[];

  if (excludeKeys) {
    for (const key of excludeKeys) {
      keysA = keysA.filter((keyA) => keyA !== key);
      keysB = keysB.filter((keyB) => keyB !== key);
    }
  }

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    const valA = a[key];
    const valB = b[key];

    if (!deepEqual(valA, valB)) return false;
  }

  return true;
}
