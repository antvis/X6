import type { Morpher } from '../morpher/morpher'

export type PrepareMethod<TAnimator> = (
  this: TAnimator,
  animator: TAnimator,
) => any

export type RunMethod<TAnimator> = (
  this: TAnimator,
  animator: TAnimator,
  positionOrDelta: number,
) => any

export type RetargetMethod<TAnimator, TTarget = any, TExtra = any> = (
  this: TAnimator,
  animator: TAnimator,
  target: TTarget,
  extra: TExtra,
) => any

interface Executor<TAnimator> {
  prepare: PrepareMethod<TAnimator>
  run: RunMethod<TAnimator>
  retarget?: RetargetMethod<TAnimator> | null
  ready: boolean
  finished: boolean
  isTransform?: boolean
}

export type Executors<TAnimator> = Executor<TAnimator>[]

export interface History<TAnimator> {
  [method: string]: {
    morpher: Morpher<any, any, any>
    executor: Executor<TAnimator>
  }
}
