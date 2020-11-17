import { Graph, Path } from '@antv/x6'

Graph.registerConnector('curve', (sourcePoint, targetPoint) => {
  const path = new Path()
  path.appendSegment(Path.createSegment('M', sourcePoint))
  path.appendSegment(
    Path.createSegment(
      'C',
      sourcePoint.x + 180,
      sourcePoint.y,
      targetPoint.x - 180,
      targetPoint.y,
      targetPoint.x,
      targetPoint.y,
    ),
  )
  return path.serialize()
})
