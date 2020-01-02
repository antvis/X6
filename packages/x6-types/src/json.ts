export type JSONPrimitive = boolean | number | string | null

export type JSONValue = JSONPrimitive | JSONObject | JSONArray

export interface JSONObject {
  [key: string]: JSONValue
}

export interface JSONArray extends Array<JSONValue> {}

export interface ReadonlyJSONObject {
  readonly [key: string]: ReadonlyJSONValue
}

export interface ReadonlyJSONArray extends ReadonlyArray<ReadonlyJSONValue> {}

export type ReadonlyJSONValue =
  | JSONPrimitive
  | ReadonlyJSONObject
  | ReadonlyJSONArray
