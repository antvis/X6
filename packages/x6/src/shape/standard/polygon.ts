import { Base } from '../base'
import { Poly } from './poly'
import { createShape } from './util'

export const Polygon = createShape(
  'polygon',
  {},
  { parent: Poly as typeof Base },
)
