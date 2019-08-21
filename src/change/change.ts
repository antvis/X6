export interface IChange {
  undo?: () => void
  redo?: () => void
  execute: () => void
}
