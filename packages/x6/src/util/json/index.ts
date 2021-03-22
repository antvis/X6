/**
 * A type alias for a JSON primitive.
 */
export type JSONPrimitive = boolean | number | string | null | undefined

/**
 * A type alias for a JSON value.
 */
export type JSONValue = JSONPrimitive | JSONObject | JSONArray

/**
 * A type definition for a JSON object.
 */
export interface JSONObject {
  [key: string]: JSONValue
}

/**
 * A type definition for a JSON array.
 */
export interface JSONArray extends Array<JSONValue> {}

/**
 * A type definition for a readonly JSON object.
 */
export interface ReadonlyJSONObject {
  readonly [key: string]: ReadonlyJSONValue
}

/**
 * A type definition for a readonly JSON array.
 */
export interface ReadonlyJSONArray extends ReadonlyArray<ReadonlyJSONValue> {}

/**
 * A type alias for a readonly JSON value.
 */
export type ReadonlyJSONValue =
  | JSONPrimitive
  | ReadonlyJSONObject
  | ReadonlyJSONArray

/**
 * The namespace for JSON-specific functions.
 */
export namespace JSONExt {
  /**
   * A shared frozen empty JSONObject
   */
  export const emptyObject = Object.freeze({}) as ReadonlyJSONObject

  /**
   * A shared frozen empty JSONArray
   */
  export const emptyArray = Object.freeze([]) as ReadonlyJSONArray

  /**
   * Test whether a JSON value is a primitive.
   *
   * @param value - The JSON value of interest.
   *
   * @returns `true` if the value is a primitive,`false` otherwise.
   */
  export function isPrimitive(
    value: ReadonlyJSONValue,
  ): value is JSONPrimitive {
    return (
      value === null ||
      value === undefined ||
      typeof value === 'boolean' ||
      typeof value === 'number' ||
      typeof value === 'string'
    )
  }

  /**
   * Test whether a JSON value is an array.
   *
   * @param value - The JSON value of interest.
   *
   * @returns `true` if the value is a an array, `false` otherwise.
   */
  export function isArray(value: JSONValue): value is JSONArray
  export function isArray(value: ReadonlyJSONValue): value is ReadonlyJSONArray
  export function isArray(value: ReadonlyJSONValue): boolean {
    return Array.isArray(value)
  }

  /**
   * Test whether a JSON value is an object.
   *
   * @param value - The JSON value of interest.
   *
   * @returns `true` if the value is a an object, `false` otherwise.
   */
  export function isObject(value: JSONValue): value is JSONObject
  export function isObject(
    value: ReadonlyJSONValue,
  ): value is ReadonlyJSONObject
  export function isObject(value: ReadonlyJSONValue): boolean {
    return !isPrimitive(value) && !isArray(value)
  }

  /**
   * Compare two JSON values for deep equality.
   *
   * @param first - The first JSON value of interest.
   *
   * @param second - The second JSON value of interest.
   *
   * @returns `true` if the values are equivalent, `false` otherwise.
   */
  export function deepEqual(
    first: ReadonlyJSONValue,
    second: ReadonlyJSONValue,
  ): boolean {
    // Check referential and primitive equality first.
    if (first === second) {
      return true
    }

    // If one is a primitive, the `===` check ruled out the other.
    if (isPrimitive(first) || isPrimitive(second)) {
      return false
    }

    // Test whether they are arrays.
    const a1 = isArray(first)
    const a2 = isArray(second)

    // Bail if the types are different.
    if (a1 !== a2) {
      return false
    }

    // If they are both arrays, compare them.
    if (a1 && a2) {
      return deepArrayEqual(
        first as ReadonlyJSONArray,
        second as ReadonlyJSONArray,
      )
    }

    // At this point, they must both be objects.
    return deepObjectEqual(
      first as ReadonlyJSONObject,
      second as ReadonlyJSONObject,
    )
  }

  /**
   * Create a deep copy of a JSON value.
   *
   * @param value - The JSON value to copy.
   *
   * @returns A deep copy of the given JSON value.
   */
  export function deepCopy<T extends ReadonlyJSONValue>(value: T): T {
    // Do nothing for primitive values.
    if (isPrimitive(value)) {
      return value
    }

    // Deep copy an array.
    if (isArray(value)) {
      return deepArrayCopy(value)
    }

    // Deep copy an object.
    return deepObjectCopy(value)
  }

  /**
   * Compare two JSON arrays for deep equality.
   */
  function deepArrayEqual(
    first: ReadonlyJSONArray,
    second: ReadonlyJSONArray,
  ): boolean {
    // Check referential equality first.
    if (first === second) {
      return true
    }

    // Test the arrays for equal length.
    if (first.length !== second.length) {
      return false
    }

    // Compare the values for equality.
    for (let i = 0, n = first.length; i < n; i += 1) {
      if (!deepEqual(first[i], second[i])) {
        return false
      }
    }

    // At this point, the arrays are equal.
    return true
  }

  /**
   * Compare two JSON objects for deep equality.
   */
  function deepObjectEqual(
    first: ReadonlyJSONObject,
    second: ReadonlyJSONObject,
  ): boolean {
    // Check referential equality first.
    if (first === second) {
      return true
    }

    // Check for the first object's keys in the second object.
    // eslint-disable-next-line
    for (const key in first) {
      if (!(key in second)) {
        return false
      }
    }

    // Check for the second object's keys in the first object.
    // eslint-disable-next-line
    for (const key in second) {
      if (!(key in first)) {
        return false
      }
    }

    // Compare the values for equality.
    // eslint-disable-next-line
    for (const key in first) {
      if (!deepEqual(first[key], second[key])) {
        return false
      }
    }

    // At this point, the objects are equal.
    return true
  }

  /**
   * Create a deep copy of a JSON array.
   */
  function deepArrayCopy(value: any): any {
    const result = new Array<any>(value.length) // eslint-disable-line
    for (let i = 0, n = value.length; i < n; i += 1) {
      result[i] = deepCopy(value[i])
    }
    return result
  }

  /**
   * Create a deep copy of a JSON object.
   */
  function deepObjectCopy(value: any): any {
    const result: any = {}
    Object.keys(value).forEach((key) => {
      result[key] = deepCopy(value[key])
    })
    return result
  }
}
