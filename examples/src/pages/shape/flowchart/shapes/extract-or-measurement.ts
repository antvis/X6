import { Path, Shape } from '../../../../../../src'

Shape.Path.define({
  shape: 'flowchart_extract_or_measurement',
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
        const sx = width / 95
        const sy = height / 60

        return {
          d: new Path()
            .moveTo(3, 60)
            .lineTo(91, 60)
            .arcTo(6, 4, 30, 0, 0, 94, 55)
            .lineTo(49, 0)
            .arcTo(3, 3, 0, 0, 0, 45, 0)
            .lineTo(0, 55)
            .arcTo(6, 4, -35, 0, 0, 3, 60)
            .close()
            .scale(sx, sy)
            .serialize(),
        }
      },
    },
  },
})
