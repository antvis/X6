import { Graph } from '../core'
import { Shape } from '../shape'

type DrillFn<T> = (...args: any[]) => T

export function drill<T>(
  fn: T | DrillFn<T> | undefined,
  ctx: any,
  ...args: any[]
): T {
  return typeof fn === 'function'
    ? (fn as DrillFn<T>).call(ctx, ...args)
    : fn
}

export interface BaseArgs {
  graph: Graph,
  shape: Shape,
}

export type OptionItem<T, S> = S | ((this: Graph, arg: T) => S)

export interface StrokeStyle<T> {
  dashed: OptionItem<T, boolean>,
  stroke: OptionItem<T, string>,
  strokeWidth: OptionItem<T, number>,
}

export interface BaseStyle<T> extends StrokeStyle<T> {
  className?: OptionItem<T, string>
  opacity: OptionItem<T, number>
  fill: OptionItem<T, string>
  style?: (args: T) => void
}

export function applyBaseStyle<T extends BaseArgs>(args: T, style: BaseStyle<T>) {
  const { shape, graph } = args
  shape.stroke = drill(style.stroke, graph, args)
  shape.strokeWidth = drill(style.strokeWidth, graph, args)
  shape.fill = drill(style.fill, graph, args)
  shape.dashed = drill(style.dashed, graph, args)
  shape.opacity = drill(style.opacity, graph, args)
}

export function applyClassName(
  shape: Shape,
  prefix: string,
  native?: string,
  manual?: string,
) {
  let className: string = ''

  if (native) {
    className += `${prefix}-${native}`
  }

  if (manual) {
    className += ` ${manual}`
  }

  if (className.length) {
    shape.className = className
  }
}
