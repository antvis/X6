import { Shape } from '../../../../../../src'

Shape.Path.define({
  shape: 'flowchart_or',
  overwrite: true,
  width: 60,
  height: 60,
  markup: [
    {
      tagName: 'ellipse',
      selector: 'body',
    },
    {
      tagName: 'path',
      groupSelector: 'line',
      selector: 'h',
    },
    {
      tagName: 'path',
      groupSelector: 'line',
      selector: 'v',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refCx: '50%',
      refCy: '50%',
      refRx: '50%',
      refRy: '50%',
    },
    line: {
      stroke: '#000',
      strokeWidth: 1,
    },
    h: {
      hPath: '',
    },
    v: {
      vPath: '',
    },
  },
  attrHooks: {
    hPath: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        return { d: `M 0 ${height / 2}  L ${width} ${height / 2}` }
      },
    },
    vPath: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        return { d: `M ${width / 2} 0 L ${width / 2} ${height}` }
      },
    },
  },
})
