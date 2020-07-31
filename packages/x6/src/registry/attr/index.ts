import { Rectangle, Point } from '../../geometry'
import { JSONObject, FunctionExt } from '../../util'
import { Cell } from '../../model'
import { CellView } from '../../view'
import { Registry } from '../registry'
import { raw } from './raw'
import * as attrs from './main'

export namespace Attr {
  export type SimpleAttrValue = null | undefined | string | number

  export type SimpleAttrs = { [name: string]: SimpleAttrValue }

  export type ComplexAttrValue =
    | null
    | undefined
    | boolean
    | string
    | number
    | JSONObject

  export type ComplexAttrs = { [name: string]: ComplexAttrValue }

  export type CellAttrs = { [selector: string]: ComplexAttrs }
}

export namespace Attr {
  export interface QualifyOptions {
    elem: Element
    attrs: ComplexAttrs
    cell: Cell
    view: CellView
  }

  export type QualifyFucntion = (
    this: CellView,
    val: ComplexAttrValue,
    options: QualifyOptions,
  ) => boolean

  export interface Options extends QualifyOptions {
    refBBox: Rectangle
  }

  export type SetFunction = (
    this: CellView,
    val: ComplexAttrValue,
    options: Options,
  ) => SimpleAttrValue | SimpleAttrs | void

  export type OffsetFunction = (
    this: CellView,
    val: ComplexAttrValue,
    options: Options,
  ) => Point.PointLike

  export type PositionFunction = (
    this: CellView,
    val: ComplexAttrValue,
    options: Options,
  ) => Point.PointLike | undefined | null

  export interface Qualify {
    qualify?: QualifyFucntion
  }

  export interface SetDefinition extends Qualify {
    set: SetFunction
  }

  export interface OffsetDefinition extends Qualify {
    offset: OffsetFunction
  }

  export interface PositionDefinition extends Qualify {
    /**
     * Returns a point from the reference bounding box.
     */
    position: PositionFunction
  }

  export type Definition =
    | string
    | Qualify
    | SetDefinition
    | OffsetDefinition
    | PositionDefinition

  export type Definitions = { [attrName: string]: Definition }

  export type GetDefinition = (name: string) => Definition | null | undefined
}

export namespace Attr {
  export function isValidDefinition(
    this: CellView,
    def: Definition | undefined | null,
    val: ComplexAttrValue,
    options: QualifyOptions,
  ): def is Definition {
    if (def != null) {
      if (typeof def === 'string') {
        return true
      }

      if (
        typeof def.qualify !== 'function' ||
        FunctionExt.call(def.qualify, this, val, options)
      ) {
        return true
      }
    }

    return false
  }
}

export namespace Attr {
  export type Presets = typeof Attr['presets']
  export type NativeNames = keyof Presets
}

export namespace Attr {
  export const presets: Definitions = {
    ...raw,
    ...attrs,
  }

  export const registry = Registry.create<Definition, Presets>({
    type: 'attribute definition',
  })

  registry.register(Attr.presets, true)
}
