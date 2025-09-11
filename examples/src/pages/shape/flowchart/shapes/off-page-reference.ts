import { NumberExt, Path, Point, Shape } from '../../@antv/x6'

Shape.Path.define({
  title: 'Off Page Reference',
  shape: 'flowchart_off_page_reference',
  overwrite: true,
  width: 60,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      ridge: 0.5,
    },
  },
  attrHooks: {
    ridge: {
      set(v, { refBBox }) {
        if (typeof v === 'number') {
          const { width, height } = refBBox
          let ridge = v < 1 ? NumberExt.normalizePercentage(v, height) : height
          if (ridge > height) {
            ridge = height
          }

          const points: Point.PointData[] = []
          if (ridge === 0) {
            points.push([0, 0], [width, 0], [width / 2, height])
          } else if (ridge === height) {
            points.push([0, 0], [width, 0], [width, height], [0, height])
          } else {
            points.push(
              [0, 0],
              [width, 0],
              [width, ridge],
              [width / 2, height],
              [0, ridge],
            )
          }

          return {
            d: Path.drawPoints(points, {
              round: 0,
              close: true,
              initialMove: true,
            }),
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
        const current = NumberExt.clamp(data.ridge + deltaY / bbox.height, 0, 1)
        if (current !== previous) {
          node.attr(key, current)
        }
      }
    },
  },
})
