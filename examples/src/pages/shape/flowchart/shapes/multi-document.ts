import { Path, Shape } from '../../../../../../src'

Shape.Path.define({
  title: 'Multi Document',
  shape: 'flowchart_multi_document',
  overwrite: true,
  width: 80,
  height: 56,
  markup: [
    {
      tagName: 'rect',
      selector: 'bg',
    },
    {
      tagName: 'path',
      groupSelector: 'body',
      selector: 'bottom',
    },
    {
      tagName: 'path',
      groupSelector: 'body',
      selector: 'middle',
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
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
    },
    top: {
      ridge: 0.25,
      z: 0,
    },
    middle: {
      ridge: 0.25,
      z: 1,
    },
    bottom: {
      ridge: 0.25,
      z: 2,
    },
  },
  attrHooks: {
    ridge: {
      set(v, { refBBox, attrs }) {
        if (typeof v === 'number') {
          const width = refBBox.width * 0.9
          const height = refBBox.height * 0.9

          let offsetX = 0
          let offsetY = 0

          const z = attrs.z as number
          if (z === 0) {
            offsetX = 0
            offsetY = refBBox.height * 0.1
          } else if (z === 1) {
            offsetX = refBBox.width * 0.05
            offsetY = refBBox.height * 0.05
          } else if (z === 2) {
            offsetX = refBBox.width * 0.1
            offsetY = 0
          }

          const round = 5
          const ridge = v * height

          const path = new Path()
            .moveTo(width - round, 0)
            .arcTo(round, round, 0, 0, 1, width, round)
            .lineTo(width, height - ridge / 2)
            .quadTo(
              (3 * width) / 4,
              height - 1.4 * ridge,
              width / 2,
              height - ridge / 2,
            )
            .quadTo(
              width / 4,
              height - ridge * (1 - 1.4),
              0,
              height - ridge / 2,
            )

          if (ridge / 2 > round) {
            path.lineTo(0, ridge / 2)
          }

          path.lineTo(0, round).arcTo(round, round, 0, 0, 1, round, 0).close()

          return {
            d: path.translate(offsetX, offsetY).serialize(),
          }
        }
      },
    },
  },
})
