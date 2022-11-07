export type Nilable<T> = T | null | undefined

export interface PointLike {
  x: number
  y: number
}

export type PointData = [number, number]

export interface Translation {
  tx: number
  ty: number
}

export interface Rotation {
  angle: number
  cx?: number
  cy?: number
}

export interface Scale {
  sx: number
  sy: number
}

export interface Size {
  width: number
  height: number
}

export interface KeyValue<T = any> {
  [key: string]: T
}

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
