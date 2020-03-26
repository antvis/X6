import { NodeRegistry } from '../../registry'
import { getName } from './util'
import './path'

export const Rhombus = NodeRegistry.register(getName('rhombus'), {
  inherit: getName('path'),
  attrs: {
    path: {
      d: 'M 30 0 L 60 30 30 60 0 30 z',
    },
    text: {
      refY: 0.5,
      refDy: null,
      yAlignment: 'middle',
    },
  },
})
