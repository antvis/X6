import { Cell } from '../core/cell'

export interface IChange {
  cell?: Cell
  execute: () => void
}
