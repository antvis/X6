import { NumberExt, Shape } from '@antv/x6'

Shape.Path.define({
  title: 'Predefined Process',
  shape: 'flowchart_predefined_process',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
    bg: {
      stroke: '#000',
      round: 0.1,
    },
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      ridge: 0.2,
    },
  },
  attrHooks: {
    round: {
      set(v, { refBBox }) {
        if (typeof v === 'number') {
          const { width, height } = refBBox
          const dim = Math.min(width, height)
          let round = dim * v
          if (round > dim / 2) {
            round = dim / 2
          }
          return {
            rx: round,
            ry: round,
          }
        }
      },
    },
    ridge: {
      set(v, { refBBox }) {
        if (typeof v === 'number') {
          const { width, height } = refBBox
          let ridge = width * v
          if (ridge > width / 2) {
            ridge = width / 2
          }

          const data = [
            'M',
            ridge,
            0,
            'L',
            ridge,
            height,
            'M',
            width - ridge,
            0,
            width - ridge,
            height,
          ]

          return {
            d: data.join(' '),
          }
        }
      },
    },
  },
  knob: [
    {
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
          const dim = Math.min(bbox.width, bbox.height)
          const ridge = node.attr<number>('body/ridge') * bbox.width
          const max = ridge / dim
          const current = NumberExt.clamp(data.round - deltaX / dim, 0, max)
          if (current !== previous) {
            node.attr(key, current)
          }
        }
      },
    },
    {
      position({ node }) {
        const bbox = node.getBBox()
        const raw = node.attr<number>('body/ridge')
        const ridge = bbox.width * raw
        return {
          x: ridge,
          y: bbox.height * 0.7,
        }
      },
      onMouseMove({ node, data, deltaX }) {
        if (deltaX !== 0) {
          const key = 'body/ridge'
          const previous = node.attr<number>(key)

          if (data.ridge == null) {
            data.ridge = previous
          }

          const bbox = node.getBBox()
          const dim = Math.min(bbox.width, bbox.height)
          const raw = node.attr<number>('bg/round')
          const round = raw * dim
          const min = round / bbox.width

          const current = NumberExt.clamp(
            data.ridge + (2 * deltaX) / bbox.width,
            min,
            0.5,
          )
          if (current !== previous) {
            node.attr(key, current)
          }
        }
      },
    },
  ],
})
