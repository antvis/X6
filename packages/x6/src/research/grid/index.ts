import { v } from '../../v'
import { KeyValue } from '../../types'
import * as patterns from './index-rollup'

export class Grid {
  root: Element
  patterns: { [id: string]: Element }

  constructor() {
    this.patterns = {}
    this.root = v.create(
      v.createSvgDocument(),
      {
        width: '100%',
        height: '100%',
      },
      [v.createSvgElement('defs')],
    ).node
  }

  add(id: string, elem: Element) {
    const firstChild = this.root.childNodes[0]
    if (firstChild) {
      firstChild.appendChild(elem)
    }

    this.patterns[id] = elem
    this.root.append(
      v.create('rect', {
        width: '100%',
        height: '100%',
        fill: `url(#${id})`,
      }).node,
    )
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
}

export namespace Grid {
  export const dot = patterns.dot
  export const fixedDot = patterns.fixedDot
  export const mesh = patterns.mesh
  export const doubleMesh = patterns.doubleMesh
}

export namespace Grid {
  export type OptionsMap = {
    dot: patterns.DotOptions
    fixedDot: patterns.FixedDotOptions
    mesh: patterns.MeshOptions
    doubleMesh: patterns.DoubleMeshOptions[]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}
