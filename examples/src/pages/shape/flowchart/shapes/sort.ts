import { Path, Shape } from '../../@antv/x6'

Shape.Path.define({
  title: 'Sort',
  shape: 'flowchart_sort',
  overwrite: true,
  width: 100,
  height: 100,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      line: '',
    },
  },
  attrHooks: {
    line: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        const outline = Path.drawPoints(
          [
            [width / 2, 0],
            [width, height / 2],
            [width / 2, height],
            [0, height / 2],
          ],
          {
            round: 5,
            close: true,
            initialMove: true,
          },
        )
        return {
          d: `${outline} M 2 ${height / 2} L ${width - 2} ${height / 2}`,
        }
      },
    },
  },
})
