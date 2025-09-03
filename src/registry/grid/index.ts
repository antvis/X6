import { Dom, type KeyValue, Vector } from '../../common'
import { Registry } from '../registry'
import * as patterns from './main'

export class Grid {
  root: Element
  patterns: { [id: string]: Element }

  constructor() {
    this.patterns = {}
    this.root = Vector.create(
      Dom.createSvgDocument(),
      {
        width: '100%',
        height: '100%',
      },
      [Dom.createSvgElement('defs')],
    ).node
  }

  add(id: string, elem: Element) {
    const firstChild = this.root.childNodes[0]
    if (firstChild) {
      firstChild.appendChild(elem)
    }

    this.patterns[id] = elem

    Vector.create('rect', {
      width: '100%',
      height: '100%',
      fill: `url(#${id})`,
    }).appendTo(this.root)
  }

  get(id: string) {
    return this.patterns[id]
  }

  has(id: string) {
    return this.patterns[id] != null
  }
}

export interface GridOptions {
  color: string
  thickness: number
}

interface BaseDefinition<T extends GridOptions = GridOptions>
  extends GridOptions {
  markup: string
  update: (
    elem: Element,
    options: {
      sx: number
      sy: number
      ox: number
      oy: number
      width: number
      height: number
    } & T,
  ) => void
}

export type GridDefinition<T extends GridOptions = GridOptions> = T &
  BaseDefinition<T>

type CommonDefinition =
  | GridDefinition<GridOptions>
  | GridDefinition<GridOptions>[]

export const gridPresets = patterns
export const gridRegistry = Registry.create<CommonDefinition, Presets>({
  type: 'grid',
})

gridRegistry.register(gridPresets, true)

type Presets = typeof gridPresets

export type GridOptionsMap = {
  dot: patterns.DotOptions
  fixedDot: patterns.FixedDotOptions
  mesh: patterns.MeshOptions
  doubleMesh: patterns.DoubleMeshOptions[]
}

export type GridNativeNames = keyof Presets

export interface GridNativeItem<T extends GridNativeNames = GridNativeNames> {
  type: T
  args?: GridOptionsMap[T]
}

export interface GridManualItem {
  type: Exclude<string, GridNativeNames>
  args?: KeyValue
}
