import { Path, Shape } from '../../@antv/x6'

Shape.Path.define({
  shape: 'flowchart_database',
  overwrite: true,
  width: 60,
  height: 60,
  markup: [
    {
      tagName: 'rect',
      selector: 'bg',
    },
    {
      tagName: 'path',
      groupSelector: 'body',
      selector: 'bin',
    },
    {
      tagName: 'path',
      groupSelector: 'body',
      selector: 'top',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      stroke: '#000',
      strokeWidth: 1,
    },
    bin: {
      fill: '#fff',
      binPath: '',
    },
    top: {
      fill: 'none',
      topPath: '',
    },
  },
  attrHooks: {
    binPath: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        const rx = +(width / 2).toFixed(2)
        const ry = +(height / 6).toFixed(2)
        return {
          d: new Path()
            .moveTo(0, height - ry)
            .lineTo(0, ry)
            .arcTo(rx, ry, 0, 0, 1, width, ry)
            .lineTo(width, height - ry)
            .arcTo(rx, ry, 0, 0, 1, 0, height - ry)
            .serialize(),
        }
      },
    },
    topPath: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        const rx = +(width / 2).toFixed(2)
        const ry = +(height / 6).toFixed(2)
        return {
          d: new Path()
            .moveTo(0, ry)
            .arcTo(rx, ry, 0, 0, 0, width, ry)
            .serialize(),
        }
      },
    },
  },
})
