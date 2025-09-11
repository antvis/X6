import { NumberExt, Path, Shape } from '../../@antv/x6'

Shape.Path.define({
  shape: 'flowchart_document',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      ridge: 0.25,
    },
  },
  attrHooks: {
    ridge: {
      set(v, { refBBox }) {
        if (typeof v === 'number') {
          const { width, height } = refBBox
          const round = 5
          const ridge = v * height
          const path = new Path()
            .moveTo(width - round, 0)
            .arcTo(round, round, 0, 0, 1, width, round)
            .lineTo(width, height - ridge / 2)
            .quadTo(
              (3 * width) / 4,
              height - 1.4 * ridge,
              width / 2,
              height - ridge / 2,
            )
            .quadTo(
              width / 4,
              height - ridge * (1 - 1.4),
              0,
              height - ridge / 2,
            )

          if (ridge / 2 > round) {
            path.lineTo(0, ridge / 2)
          }

          path.lineTo(0, round).arcTo(round, round, 0, 0, 1, round, 0).close()

          return {
            d: path.serialize(),
          }
        }
      },
    },
  },
  knob: {
    position({ node }) {
      const bbox = node.getBBox()
      const ridge = node.attr<number>('body/ridge')
      return { x: bbox.width * 0.75, y: bbox.height - bbox.height * ridge }
    },
    onMouseMove({ node, data, deltaY }) {
      if (deltaY !== 0) {
        const bbox = node.getBBox()
        const key = 'body/ridge'
        const previous = node.attr<number>(key)

        if (data.ridge == null) {
          data.ridge = previous
        }

        const current = NumberExt.clamp(data.ridge - deltaY / bbox.height, 0, 1)
        if (current !== previous) {
          node.attr(key, current)
        }
      }
    },
  },
})
