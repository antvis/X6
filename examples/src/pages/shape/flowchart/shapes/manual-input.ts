import { JSONObject, Line, NumberExt, Path, Shape } from '@antv/x6'

interface KnobsAttrValue extends JSONObject {
  round: boolean | string | number
  ridge: boolean | string | number
}

Shape.Path.define({
  shape: 'flowchart_manual_input',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      knobs: {
        round: 6,
        ridge: 20,
      },
    },
  },
  attrHooks: {
    knobs: {
      set(val, { refBBox }) {
        if (typeof val === 'object') {
          const v = val as KnobsAttrValue
          const { width, height } = refBBox
          const dim = Math.min(width, height)
          let round: number
          let ridge: number

          if (v.round == null) {
            round = 0
          } else if (typeof v.round === 'boolean') {
            round = dim * 0.1
          } else {
            round = NumberExt.normalizePercentage(v.round, dim)
          }

          if (v.ridge == null) {
            ridge = 0
          } else if (typeof v.ridge === 'boolean' || v.ridge == null) {
            ridge = height * 0.1
          } else {
            ridge = NumberExt.normalizePercentage(v.ridge, height)
          }

          return {
            d: Path.drawPoints(
              [
                [0, ridge],
                [width, 0],
                [width, height],
                [0, height],
              ],
              {
                round,
                close: true,
                initialMove: true,
              },
            ),
          }
        }
      },
    },
  },
  knob: [
    {
      position({ node }) {
        const bbox = node.getBBox()
        const round = node.attr<number>('body/knobs/round')
        return {
          x: bbox.width - round,
          y: round,
        }
      },
      onMouseMove({ node, data, deltaX }) {
        if (deltaX !== 0) {
          const bbox = node.getBBox()
          const key = 'body/knobs/round'
          const previous = node.attr<number>(key)

          if (data.round == null) {
            data.round = previous
          }

          const min = 0
          const max = Math.min(bbox.width, bbox.height) / 3
          const current = NumberExt.clamp(data.round - deltaX, min, max)
          if (current !== previous) {
            node.attr(key, current)
          }
        }
      },
    },
    {
      position({ node }) {
        const bbox = node.getBBox()
        const ridge = node.attr<number>('body/knobs/ridge')
        const line = new Line(0, ridge, bbox.width, 0)
        return line.pointAt(0.25)
      },
      onMouseMove({ node, data, deltaY }) {
        if (deltaY !== 0) {
          const key = 'body/knobs/ridge'
          const bbox = node.getBBox()
          const previous = node.attr<number>(key)

          if (data.ridge == null) {
            data.ridge = previous
          }

          const current = NumberExt.clamp(data.ridge + deltaY, 0, bbox.height)
          if (current !== previous) {
            node.attr(key, current)
          }
        }
      },
    },
  ],
})
