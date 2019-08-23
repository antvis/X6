import { Cell } from '../core'

export interface IChange {
  cell?: Cell
  undo?: () => void
  redo?: () => void
  execute: () => void
}
