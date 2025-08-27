import { NumberExt, Shape } from '../../../../../../src'

Shape.Path.define({
  title: 'Process',
  shape: 'flowchart_process',
  overwrite: true,
  width: 100,
  height: 100,
  attrs: {
    bg: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      round: 0.1,
    },
  },
  attrHooks: {
    round: {
      set(v, { refBBox }) {
        if (typeof v === 'number') {
          const { width, height } = refBBox
          const dim = Math.min(width, height)
          const round = v * dim
          return { rx: round, ry: round }
        }
      },
    },
  },
  knob: {
    position({ node }) {
      const bbox = node.getBBox()
      const dim = Math.min(bbox.width, bbox.height)
      const raw = node.attr<number>('bg/round')
      const round = NumberExt.normalizePercentage(raw, dim)
      return {
        x: bbox.width - round,
        y: round,
      }
    },
    onMouseMove({ node, data, deltaX }) {
      if (deltaX !== 0) {
        const key = 'bg/round'
        const previous = node.attr<number>(key)

        if (data.round == null) {
          data.round = previous
        }

        const bbox = node.getBBox()
        const dim = Math.min(bbox.width, bbox.height) / 2
        const current = NumberExt.clamp(data.round - deltaX / dim, 0, 0.5)
        if (current !== previous) {
          node.attr(key, current)
        }
      }
    },
  },
})
