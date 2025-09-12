import { Path, Shape } from '@antv/x6'

Shape.Path.define({
  title: 'Summing Function',
  shape: 'flowchart_summing_function',
  overwrite: true,
  width: 70,
  height: 70,
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
      draw: true,
    },
  },
  attrHooks: {
    draw: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        const path = new Path()
          .moveTo(0, height / 2)
          .lineTo(width, height / 2)
          .moveTo(width / 2, 0)
          .lineTo(width / 2, height)
          .rotate(45, { x: width / 2, y: height / 2 })
        return {
          d: path.serialize(),
        }
      },
    },
  },
})
