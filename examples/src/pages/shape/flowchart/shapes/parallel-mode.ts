import { Path, Shape } from '../../@antv/x6'

Shape.Path.define({
  title: 'Parallel Mode',
  shape: 'flowchart_parallel_mode',
  overwrite: true,
  width: 100,
  height: 40,
  markup: [
    {
      tagName: 'rect',
      selector: 'bg',
    },
    {
      tagName: 'path',
      selector: 'dot',
    },
    {
      tagName: 'path',
      groupSelector: 'line',
      selector: 'top',
    },
    {
      tagName: 'path',
      groupSelector: 'line',
      selector: 'bottom',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    line: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
    },
    dot: {
      fill: '#ffff00',
      stroke: '#000',
      dotPath: '',
    },
    top: {
      topPath: '',
    },
    bottom: {
      bottomPath: '',
    },
  },
  attrHooks: {
    dotPath: {
      set(_v, { refBBox }) {
        const { width, height } = refBBox
        const sx = width / 94
        const sy = height / 40

        return {
          d: new Path()
            .moveTo(47, 15)
            .lineTo(52, 20)
            .lineTo(47, 25)
            .lineTo(42, 20)
            .lineTo(47, 15)
            .close()
            .moveTo(27, 15)
            .lineTo(32, 20)
            .lineTo(27, 25)
            .lineTo(22, 20)
            .lineTo(27, 15)
            .close()
            .moveTo(67, 15)
            .lineTo(72, 20)
            .lineTo(67, 25)
            .lineTo(62, 20)
            .lineTo(67, 15)
            .close()
            .scale(sx, sy)
            .serialize(),
        }
      },
    },

    topPath: {
      set(_v, { refBBox }) {
        return { d: `M 0 0 L ${refBBox.width} 0` }
      },
    },

    bottomPath: {
      set(_v, { refBBox }) {
        return {
          d: `M 0 ${refBBox.height} L ${refBBox.width} ${refBBox.height}`,
        }
      },
    },
  },
})
