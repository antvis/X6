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
