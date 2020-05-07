import { Dom } from '../../util'
import { KeyValue } from '../../types'
import * as patterns from './main'

export class Grid {
  root: Element
  patterns: { [id: string]: Element }

  constructor() {
    this.patterns = {}
    this.root = Dom.createVector(
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

    Dom.createVector('rect', {
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

export namespace Grid {
  export interface Options {
    color: string
    thickness: number
  }

  interface BaseDefinition<T extends Options = Options> extends Options {
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

  export type Definition<T extends Options = Options> = T & BaseDefinition<T>
  export type CommonDefinition =
    | Definition<Grid.Options>
    | Definition<Grid.Options>[]
}

export namespace Grid {
  export const presets = patterns
}

export namespace Grid {
  export type Presets = typeof Grid['presets']

  export type OptionsMap = {
    dot: patterns.DotOptions
    fixedDot: patterns.FixedDotOptions
    mesh: patterns.MeshOptions
    doubleMesh: patterns.DoubleMeshOptions[]
  }

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}
