import { Path, Shape } from '../../../../../../src'

Shape.Path.define({
  shape: 'flowchart_delay',
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
        const sr = 5
        const br = Math.round(height + sr) / 2
        const factor = 0.8

        return {
          d: new Path()
            .moveTo(0, sr)
            .arcTo(sr, sr, 0, 0, 1, sr, 0)
            .lineTo(width * factor, 0)
            .arcTo(br, br, 0, 0, 1, width * factor, height)
            .lineTo(sr, height)
            .arcTo(sr, sr, 0, 0, 1, 0, height - sr)
            .close()
            .serialize(),
        }
      },
    },
  },
})
