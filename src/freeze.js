// Written for you. Read it; you do not need to change it.

/**
 * Freezes `value` and every object and array inside it, at every level.
 *
 * `Object.freeze` is one level deep: a frozen object can still hold an array
 * that changes. This walks down and freezes each level it finds.
 *
 * It freezes the object you give it — that object, not a copy. Whatever you
 * pass in can never be changed again, by anyone who holds it.
 *
 * Plain objects and arrays only. (A Map or a Set inside would stay
 * changeable — freezing one does not stop `set` or `add`.)
 *
 * @template T
 * @param {T} value
 * @returns {T} the same value, now frozen all the way down
 */
export function deepFreeze(value) {
  if (value !== null && typeof value === 'object') {
    Object.freeze(value);
    for (const inner of Object.values(value)) {
      deepFreeze(inner);
    }
  }
  return value;
}
