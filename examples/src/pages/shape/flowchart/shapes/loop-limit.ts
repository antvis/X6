import { Path, Shape } from '../../../../../../src'

Shape.Path.define({
  shape: 'flowchart_loop_limit',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
    body: {
      stroke: '#000',
      fill: '#fff',
      strokeWidth: 1,
      path: '',
    },
  },
  attrHooks: {
    path: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        const sx = width / 100
        const sy = height / 60

        return {
          d: new Path()
            .moveTo(20, 0)
            .lineTo(80, 0)
            .lineTo(100, 20)
            .lineTo(100, 55)
            .arcTo(5, 5, 0, 0, 1, 95, 60)
            .lineTo(5, 60)
            .arcTo(5, 5, 0, 0, 1, 0, 55)
            .lineTo(0, 20)
            .lineTo(20, 0)
            .close()
            .scale(sx, sy)
            .serialize(),
        }
      },
    },
  },
})
