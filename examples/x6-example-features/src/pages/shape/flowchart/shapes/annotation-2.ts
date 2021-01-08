import { Shape } from '@antv/x6'

Shape.Path.define({
  title: 'Annotation',
  shape: 'flowchart_annotation_2',
  overwrite: true,
  width: 50,
  height: 100,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refD: 'M 50 0 L 25 0 L 25 100 L 50 100 M 0 50 L 25 50',
    },
  },
})
