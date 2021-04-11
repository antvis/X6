import { SVGAttributesMap } from '../../vector/types'
import { HTMLAttributesMap } from '../types'

export type AttributesMap<T> = T extends SVGElement
  ? SVGAttributesMap<T>
  : T extends HTMLElement
  ? HTMLAttributesMap<T>
  : HTMLAttributesMap<HTMLDivElement>
