/**
 * Place for all internal use only types
 *
 * @module
 */


/**
 * Any string that begins a dollar sign
 *
 * @hidden Internal use only
 */
 export type DollarProp = `$${string}`;

/**
 * Allows all the documentation of a template spec to be inherited by any Element
 *
 * @hidden Internal use only
 */
export type Documentation<T> = {
  // WARNING: You cannot use conditional key manipulation here or it will not allow documentation to be passed down
  //   - i.e. you can't do this... [s in keyof T as P extends DollarProp ? never : P]:
  //   - or event this...  [P in Exclude<keyof T, DollarProp>]:
  [P in keyof Omit<T, DollarProp>]: unknown;
  // [P in keyof T]:
  //   P extends DollarProp
  //     ?
  //       never
  //     :
  //       unknown;
}