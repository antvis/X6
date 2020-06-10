import { Path } from './path'
import { createShape } from './util'

export const Rhombus = createShape(
  'rhombus',
  {
    d: 'M 30 0 L 60 30 30 60 0 30 z',
    attrs: {
      text: {
        refY: 0.5,
        refDy: null,
      },
    },
  },
  {
    parent: Path,
    ignoreMarkup: true,
  },
)
