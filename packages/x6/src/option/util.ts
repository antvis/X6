import { Graph } from '../graph'
import { Shape } from '../shape'

type DrillFn<T> = (...args: any[]) => T

export function drill<T>(
  fn: T | DrillFn<T> | undefined,
  ctx: any,
  ...args: any[]
): T {
  return typeof fn === 'function' ? (fn as DrillFn<T>).call(ctx, ...args) : fn
}

export interface BaseArgs {
  graph: Graph
  shape: Shape
}

export type OptionItem<T, S> = S | ((this: Graph, arg: T) => S)

export interface StrokeStyle<T> {
  dashed: OptionItem<T, boolean>
  stroke: OptionItem<T, string>
  strokeWidth: OptionItem<T, number>
}

export interface FillStyle<T> {
  opacity: OptionItem<T, number>
  fill: OptionItem<T, string>
}

export interface CurosrStyle<T> {
  cursor: OptionItem<T, string>
}

export interface ClassNameStyle<T> {
  className?: OptionItem<T, string>
}

export interface ManualStyle<T> {
  manual?: (args: T) => void
}

export interface BaseStyle<T>
  extends ManualStyle<T>,
    ClassNameStyle<T>,
    StrokeStyle<T>,
    FillStyle<T> {}

export function applyBaseStyle<T extends BaseArgs>(
  args: T,
  style: BaseStyle<T>,
) {
  applyStrokeStyle(args, style)
  applyFillStyle(args, style)
}

export function applyStrokeStyle<T extends BaseArgs>(
  args: T,
  style: StrokeStyle<T>,
) {
  const { shape, graph } = args
  shape.strokeColor = drill(style.stroke, graph, args)
  shape.strokeWidth = drill(style.strokeWidth, graph, args)
  shape.dashed = drill(style.dashed, graph, args)
}

export function applyFillStyle<T extends BaseArgs>(
  args: T,
  style: FillStyle<T>,
) {
  const { shape, graph } = args
  shape.fillColor = drill(style.fill, graph, args)
  shape.opacity = drill(style.opacity, graph, args)
}

export function applyClassName<T extends BaseArgs>(
  args: T,
  style: ClassNameStyle<T>,
  native?: string,
) {
  const manual = drill(style.className, args.graph, args)
  Shape.applyClassName(args.shape, args.graph.prefixCls, native, manual)
}

export function applyCursorStyle<T extends BaseArgs>(
  args: T,
  style: CurosrStyle<T>,
) {
  args.shape.cursor = drill(style.cursor, args.graph, args)
}

export function applyManualStyle<T extends BaseArgs>(
  args: T,
  style: ManualStyle<T>,
) {
  if (style.manual) {
    style.manual(args)
  }
}
