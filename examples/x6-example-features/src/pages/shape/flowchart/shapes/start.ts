import { Shape } from '@antv/x6'

Shape.Path.define({
  title: 'Start',
  shape: 'flowchart_start',
  overwrite: true,
  width: 100,
  height: 100,
  attrs: {
    bg: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refRx: '50%',
      refRy: '50%',
    },
  },
})
