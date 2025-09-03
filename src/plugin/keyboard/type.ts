import type { Graph } from '../../graph'

export type KeyboardImplAction = 'keypress' | 'keydown' | 'keyup'
export type KeyboardImplHandler = (e: KeyboardEvent) => void

export interface KeyboardImplOptions {
  enabled?: boolean
  /**
   * Specifies if keyboard event should bind on docuemnt or on container.
   *
   * Default is `false` that will bind keyboard event on the container.
   */
  global?: boolean

  format?: (this: Graph, key: string) => string
  guard?: (this: Graph, e: KeyboardEvent) => boolean
}
