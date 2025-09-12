import { Shape } from '@antv/x6'

Shape.Path.define({
  title: 'Annotation',
  shape: 'flowchart_annotation_1',
  overwrite: true,
  width: 40,
  height: 100,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refD: 'M 40 0 L 0 0 L 0 100 L 40 100',
    },
  },
})
