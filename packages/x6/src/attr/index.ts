import { JSONObject } from '../util'
import { Rectangle, Point } from '../geometry'
import { Cell } from '../core/cell'
import { CellView } from '../core/cell-view'
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
  ) => Point | Point.PointLike

  export type PositionFunction = (
    val: ComplexAttrValue,
    options: Options,
  ) => Point | Point.PointLike | undefined | null

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
        def.qualify.call(this, val, options)
      ) {
        return true
      }
    }

    return false
  }
}

export namespace Attr {
  export const presets: Definitions = {
    ...raw,
    ...attrs,
  }
}

export namespace Attr {
  export type Presets = typeof Attr['presets']
  export type NativeNames = keyof Presets
}
