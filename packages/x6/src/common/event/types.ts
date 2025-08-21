import {
  RequiredKeys,
  OmitByValue,
  OptionalKeys,
  PickByValue,
} from 'utility-types'

export type Handler<Args> = Args extends null | undefined
  ? () => any
  : Args extends any[]
  ? (...args: Args) => any
  : (args: Args) => any

export type EventArgs = { [key: string]: any }

export type EventNames<M extends EventArgs> = Extract<keyof M, string>

/**
 * Get union type of keys from `M` that value matching `any[]`.
 */
export type NamesWithArrayArgs<M extends EventArgs> = RequiredKeys<
  PickByValue<M, any[]>
>

export type NotArrayValueMap<M extends EventArgs> = OmitByValue<M, any[]>

export type OptionalNormalNames<M extends EventArgs> = OptionalKeys<
  NotArrayValueMap<M>
>

export type RequiredNormalNames<M extends EventArgs> = RequiredKeys<
  NotArrayValueMap<M>
>

export type OtherNames<M extends EventArgs> = EventNames<
  PickByValue<M, undefined>
>

export type UnknownNames<M extends EventArgs> = Exclude<string, EventNames<M>>
