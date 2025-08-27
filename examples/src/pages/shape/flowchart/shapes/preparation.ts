import {
  JSONObject,
  NumberExt,
  Path,
  Point,
  Shape,
} from '../../../../../../src'

interface KnobsAttrValue extends JSONObject {
  round: boolean | string | number
  ridge: boolean | string | number
}

Shape.Path.define({
  title: 'Preparation',
  shape: 'flowchart_preparation',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      knobs: {
        round: 0.1,
        ridge: 0.2,
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

          if (round > dim / 2) {
            round = dim / 2
          }

          if (v.ridge == null) {
            ridge = 0
          } else if (typeof v.ridge === 'boolean' || v.ridge == null) {
            ridge = width * 0.2
          } else {
            ridge = NumberExt.normalizePercentage(v.ridge, width)
          }

          if (ridge > width / 2) {
            ridge = width / 2
          }

          const points: Point.PointData[] = []

          if (v.ridge === 0) {
            points.push([0, 0], [width, 0], [width, height], [0, height])
          } else if (v.ridge === width / 2) {
            points.push([ridge, 0], [width, height / 2], [ridge, height])
          } else {
            points.push(
              [ridge, 0],
              [width - ridge, 0],
              [width, height / 2],
              [width - ridge, height],
              [ridge, height],
              [0, height / 2],
            )
          }

          return {
            d: Path.drawPoints(points, {
              round,
              close: true,
              initialMove: true,
            }),
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
        const raw = node.attr<number>('body/knobs/round')
        const round = NumberExt.normalizePercentage(raw, dim)
        return {
          x: bbox.width - round,
          y: round,
        }
      },
      onMouseMove({ node, data, deltaX }) {
        if (deltaX !== 0) {
          const key = 'body/knobs/round'
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
    {
      position({ node }) {
        const bbox = node.getBBox()
        const raw = node.attr<number>('body/knobs/ridge')
        return { x: bbox.width * raw, y: bbox.height / 2 }
      },
      onMouseMove({ node, data, deltaX }) {
        if (deltaX !== 0) {
          const key = 'body/knobs/ridge'
          const previous = node.attr<number>(key)

          if (data.ridge == null) {
            data.ridge = previous
          }

          const bbox = node.getBBox()
          const current = NumberExt.clamp(
            data.ridge + (2 * deltaX) / bbox.width,
            0,
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
