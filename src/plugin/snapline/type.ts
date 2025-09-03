import type { Graph } from '../../graph'

export type SnaplineImplFilterFunction = (this: Graph, node: Node) => boolean

export type SnaplineImplFilter =
  | null
  | (string | { id: string })[]
  | SnaplineImplFilterFunction

export interface SnaplineImplOptions {
  enabled?: boolean
  className?: string
  tolerance?: number
  sharp?: boolean
  /**
   * Specify if snap on node resizing or not.
   */
  resizing?: boolean
  clean?: boolean | number
  filter?: SnaplineImplFilter
}

export interface SnaplineOptions extends SnaplineImplOptions {}

export type SnaplineFilter = SnaplineImplFilter
