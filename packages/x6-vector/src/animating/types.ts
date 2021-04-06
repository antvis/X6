export type Now = () => number

export type When = 'now' | 'start' | 'relative' | 'after' | 'with'

export interface Options {
  duration?: number
  delay?: number
  swing?: boolean
  times?: number
  wait?: number
  ease?: string
  when?: When
}
