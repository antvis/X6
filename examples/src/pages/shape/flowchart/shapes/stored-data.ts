import { Path, Shape } from '../../../../../../src'

Shape.Path.define({
  title: 'Stored Data',
  shape: 'flowchart_stored_data',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      draw: '',
    },
  },
  attrHooks: {
    draw: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        const sx = width / 96.51
        const sy = height / 60

        return {
          d: new Path()
            .moveTo(10, 0)
            .lineTo(96, 0)
            .arcTo(1.5, 1.5, 0, 0, 1, 96, 2)
            .arcTo(10, 30, 0, 0, 0, 96, 58)
            .arcTo(1.5, 1.5, 0, 0, 1, 96, 60)
            .lineTo(10, 60)
            .arcTo(10, 30, 0, 0, 1, 10, 0)
            .scale(sx, sy)
            .serialize(),
        }
      },
    },
  },
})
