import { Graph, Path, Point } from '@antv/x6'
import type { ConnectorBaseOptions } from '@antv/x6/registry'

export const connectors = {
  root: 'xmind-root-curve',
  branch: 'xmind-branch-curve',
}

interface RootCurveOptions extends ConnectorBaseOptions {
  strokeWidth?: number
}

Graph.registerConnector(
  connectors.root,
  (sourcePoint, targetPoint, _routerPoints, options: RootCurveOptions) => {
    const normalize = (p: Point.PointLike, width: number) => {
      const factor = Math.hypot(p.x, p.y) / width
      return { x: p.x / factor, y: p.y / factor }
    }

    const cross = (p1: Point.PointLike, p2: Point.PointLike, width: number) => {
      if (Point.equals(p1, p2)) {
        return p1
      }
      const diff = {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
      }
      const normalized = normalize(diff, width)
      const rotated = Point.rotate(normalized, 90)
      return {
        x: p1.x + rotated.x,
        y: p1.y + rotated.y,
      }
    }

    const pivot = (p1: Point.PointLike, p2: Point.PointLike) => {
      return {
        x: p1.x * 2 - p2.x,
        y: p1.y * 2 - p2.y,
      }
    }

    const smallWidth = options.strokeWidth || 3
    const bigWidth = smallWidth * 3
    const divide = (targetPoint.x - sourcePoint.x) / 3 + sourcePoint.x

    const center = sourcePoint
    const q1start = cross(sourcePoint, targetPoint, bigWidth / 2)
    const q2start = cross(targetPoint, sourcePoint, smallWidth / 2)
    const q1end = pivot(targetPoint, q2start)
    const q2end = pivot(sourcePoint, q1start)
    const fx = (q1start.x - q2end.x) / 2
    const fy = (q1end.y - q2start.y) / 2

    q1end.x = targetPoint.x
    q2start.x = targetPoint.x

    const pathData = `
     M ${center.x} ${center.y}
     L ${q1start.x} ${q1start.y}
     Q ${divide + fx} ${targetPoint.y + fy} ${q1end.x} ${q1end.y}
     L ${q2start.x} ${q2start.y}
     Q ${divide - fx} ${targetPoint.y - fy} ${q2end.x} ${q2end.y}
     Z
  `

    return options.raw ? Path.parse(pathData) : pathData
  },
  true,
)

Graph.registerConnector(
  connectors.branch,
  (sourcePoint, targetPoint, _routerPoints, options) => {
    const midX = sourcePoint.x + 10
    const midY = sourcePoint.y
    const ctrX = (targetPoint.x - midX) / 5 + midX
    const ctrY = targetPoint.y
    const pathData = `
     M ${sourcePoint.x} ${sourcePoint.y}
     L ${midX} ${midY}
     Q ${ctrX} ${ctrY} ${targetPoint.x} ${targetPoint.y}
    `
    return options.raw ? Path.parse(pathData) : pathData
  },
  true,
)
