import { Path, Shape } from '../../../../../../src'

Shape.Path.define({
  shape: 'flowchart_display',
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
        const rx = width * 0.6
        const ry = Math.round(height + 6) / 2
        const f1 = 0.4
        const f2 = 0.8

        return {
          d: new Path()
            .moveTo(0, height / 2)
            .arcTo(rx, height, 0, 0, 1, width * f1, 0)
            .lineTo(width * f2, 0)
            .arcTo(width * 0.33, ry, 0, 0, 1, width * f2, height)
            .lineTo(width * f1, height)
            .arcTo(rx, height, 0, 0, 1, 0, height / 2)
            .serialize(),
        }
      },
    },
  },
})
