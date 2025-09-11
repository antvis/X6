import { Shape } from '../../@antv/x6'

Shape.Path.define({
  title: 'Sequential Data',
  shape: 'flowchart_sequential_data',
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
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      line: '',
    },
  },
  attrHooks: {
    line: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        return { d: `M ${width / 2} ${height} L ${width} ${height}` }
      },
    },
  },
})
