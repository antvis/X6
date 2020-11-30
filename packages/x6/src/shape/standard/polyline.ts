import { Base } from '../base'
import { Poly } from './poly'
import { createShape } from './util'

export const Polyline = createShape(
  'polyline',
  {},
  { parent: Poly as typeof Base },
)
