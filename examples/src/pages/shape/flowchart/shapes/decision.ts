import { Shape } from '../../../../../../src'

Shape.Path.define({
  shape: 'flowchart_decision',
  overwrite: true,
  width: 100,
  height: 100,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refD: 'M 50 0 L 100 50 L 50 100 L 0 50 Z',
    },
  },
})
