import { Path, Shape } from '@antv/x6'

Shape.Path.define({
  title: 'Terminator',
  shape: 'flowchart_terminator',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
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
        const sx = width / 98
        const sy = height / 60
        return {
          d: new Path()
            .moveTo(30, 0)
            .lineTo(68, 0)
            .arcTo(30, 30, 0, 0, 1, 68, 60)
            .lineTo(30, 60)
            .arcTo(30, 30, 0, 0, 1, 30, 0)
            .scale(sx, sy)
            .serialize(),
        }
      },
    },
  },
})
