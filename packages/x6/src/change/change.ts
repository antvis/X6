import { Cell } from '../core'

export interface IChange {
  cell?: Cell
  execute: () => void
}
