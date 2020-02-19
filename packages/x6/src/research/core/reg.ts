import { Attribute } from '../attr'
import { Size } from '../../types'

export interface RegisterNodeOptions {
  size?: Size
  attrs?: Attribute.CellAttributes
  markup?: string
  init?: () => void
}

export function registerNode(name: string, options: RegisterNodeOptions) {}
