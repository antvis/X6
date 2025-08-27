import { NumberExt, Path, Point, Shape } from '../../../../../../src'

Shape.Path.define({
  title: 'Merge or Storage',
  shape: 'flowchart_merge_or_storage',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
    body: {
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
          let round = NumberExt.normalizePercentage(v, dim)
          if (round > dim / 2) {
            round = dim / 2
          }

          const points: Point.PointData[] = [
            [0, 0],
            [width, 0],
            [width / 2, height],
          ]

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
})
