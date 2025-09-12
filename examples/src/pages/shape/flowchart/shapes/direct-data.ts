import { Path, Shape } from '@antv/x6'

Shape.Path.define({
  shape: 'flowchart_direct_data',
  overwrite: true,
  width: 100,
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
      selector: 'arc',
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
    arc: {
      fill: 'none',
      arcPath: '',
    },
  },
  attrHooks: {
    binPath: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        const rx = +(width / 10).toFixed(2)
        const ry = +(height / 2).toFixed(2)
        return {
          d: new Path()
            .moveTo(rx, 0)
            .lineTo(width - rx, 0)
            .arcTo(rx, ry, 0, 1, 1, width - rx, height)
            .lineTo(rx, height)
            .arcTo(rx, ry, 0, 1, 1, rx, 0)
            .serialize(),
        }
      },
    },
    arcPath: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        const rx = +(width / 10).toFixed(2)
        const ry = +(height / 2).toFixed(2)
        return {
          d: new Path()
            .moveTo(width - rx, 0)
            .arcTo(rx, ry, 0, 1, 0, width - rx, height)
            .serialize(),
        }
      },
    },
  },
})
