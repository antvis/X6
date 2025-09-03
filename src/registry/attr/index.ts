import { FunctionExt, type JSONObject } from '../../common'
import type { Point, Rectangle } from '../../geometry'
import type { Cell } from '../../model'
import type { CellView } from '../../view'
import { Registry } from '../registry'
import * as attrs from './main'
import { raw } from './raw'

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

interface QualifyOptions {
  elem: Element
  attrs: ComplexAttrs
  cell: Cell
  view: CellView
}

export type QualifyFunction = (
  this: CellView,
  val: ComplexAttrValue,
  options: QualifyOptions,
) => boolean

export interface AttrOptions extends QualifyOptions {
  refBBox: Rectangle
}

export type AttrSetFunction = (
  this: CellView,
  val: ComplexAttrValue,
  options: AttrOptions,
) => SimpleAttrValue | SimpleAttrs | void

export type AttrOffsetFunction = (
  this: CellView,
  val: ComplexAttrValue,
  options: AttrOptions,
) => Point.PointLike

export type AttrPositionFunction = (
  this: CellView,
  val: ComplexAttrValue,
  options: AttrOptions,
) => Point.PointLike | undefined | null

interface Qualify {
  qualify?: QualifyFunction
}

export interface SetDefinition extends Qualify {
  set: AttrSetFunction
}

export interface OffsetDefinition extends Qualify {
  offset: AttrOffsetFunction
}

export interface AttrPositionDefinition extends Qualify {
  /**
   * Returns a point from the reference bounding box.
   */
  position: AttrPositionFunction
}

export type AttrDefinition =
  | string
  | Qualify
  | SetDefinition
  | OffsetDefinition
  | AttrPositionDefinition

export type AttrDefinitions = { [attrName: string]: AttrDefinition }

export function isValidDefinition(
  this: CellView,
  def: AttrDefinition | undefined | null,
  val: ComplexAttrValue,
  options: QualifyOptions,
): def is AttrDefinition {
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

type Presets = typeof attrPresets

export type AttrNativeNames = keyof Presets

export const attrPresets: AttrDefinitions = {
  ...raw,
  ...attrs,
}

export const attrRegistry = Registry.create<AttrDefinition, Presets>({
  type: 'attribute definition',
})

attrRegistry.register(attrPresets, true)
