import { NumberExt, Path, Shape } from '../../../../../../src'

Shape.Path.define({
  title: 'Paper Tape',
  shape: 'flowchart_paper_tape',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      ridge: 0.1,
    },
  },
  attrHooks: {
    ridge: {
      set(v, { refBBox }) {
        if (typeof v === 'number') {
          const { width, height } = refBBox
          let ridge = NumberExt.normalizePercentage(v, height)
          if (ridge > height / 2) {
            ridge = height / 2
          }

          const r = width * 0.7

          return {
            d: new Path()
              .moveTo(0, ridge)
              .arcTo(r, r, 0, 0, 0, width / 2, ridge)
              .arcTo(r, r, 0, 0, 1, width, ridge)
              .lineTo(width, height - ridge)
              .arcTo(r, r, 0, 0, 0, width / 2, height - ridge)
              .arcTo(r, r, 0, 0, 1, 0, height - ridge)
              .lineTo(0, ridge)
              .serialize(),
          }
        }
      },
    },
  },
  knob: {
    position({ node }) {
      const bbox = node.getBBox()
      const raw = node.attr<number>('body/ridge')
      const ridge = bbox.height * raw
      return { x: bbox.width / 2, y: ridge }
    },
    onMouseMove({ node, data, deltaY }) {
      if (deltaY !== 0) {
        const key = 'body/ridge'
        const previous = node.attr<number>(key)

        if (data.ridge == null) {
          data.ridge = previous
        }

        const bbox = node.getBBox()
        const current = NumberExt.clamp(
          data.ridge + (2 * deltaY) / bbox.height,
          0,
          0.5,
        )
        if (current !== previous) {
          node.attr(key, current)
        }
      }
    },
  },
})
