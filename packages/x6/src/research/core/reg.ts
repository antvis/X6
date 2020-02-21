import { Attr } from '../attr'
import { Size } from '../../types'

export interface RegisterNodeOptions {
  size?: Size
  attrs?: Attr.CellAttrs
  markup?: string
  init?: () => void
}

export function registerNode(name: string, options: RegisterNodeOptions) {}
