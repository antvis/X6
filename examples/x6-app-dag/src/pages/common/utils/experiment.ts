import { maxBy, minBy } from 'lodash-es'
import { NExperimentGraph } from '@/pages/rx-models/typing'

interface BasicPoint {
  x: number
  y: number
}

/**
 * 找出一组坐标的边缘坐标（最小和最大的边缘坐标轴）和中点
 * @param points
 */
export function calcPointsInfo(points: BasicPoint[]) {
  if (!Array.isArray(points) || !points.length) {
    throw new Error('计算坐标边缘必须传入一组坐标')
  }
  const minX = minBy(points, (point: BasicPoint) => point.x)!.x
  const minY = minBy(points, (point: BasicPoint) => point.y)!.y
  const maxX = maxBy(points, (point: BasicPoint) => point.x)!.x
  const maxY = maxBy(points, (point: BasicPoint) => point.y)!.y
  const middleX = (minX + maxX) / 2
  const middleY = (minY + maxY) / 2

  return {
    minX,
    minY,
    maxX,
    maxY,
    middleX,
    middleY,
  }
}

/**
 * 将一组坐标转换成相对某个点的相对租表
 * @param points
 * @param origin
 */
export function transformPointsToOrigin(
  points: BasicPoint[],
  origin: BasicPoint,
): BasicPoint[] {
  return points.map((point) => ({
    ...point,
    x: point.x - origin.x,
    y: point.y - origin.y,
  }))
}

/**
 * 将一组相对某点的坐标还原回原始坐标
 * @param points
 * @param origin
 */
export function revertPointsToOrigin(
  points: BasicPoint[],
  origin: BasicPoint,
): BasicPoint[] {
  return points.map((point) => ({
    ...point,
    x: point.x + origin.x,
    y: point.y + origin.y,
  }))
}

export function formatNodeToGraphNodeConf(originNode: {
  id: number
  nodeInstanceId?: number
  positionX: number
  positionY: number
}): any {
  const { id, nodeInstanceId, positionX, positionY } = originNode
  return {
    ...originNode,
    x: positionX || 0,
    y: positionY || 0,
    id: (nodeInstanceId || id)!.toString(),
    width: 180,
    height: 32,
    data: originNode,
    ports: {
      groups: {
        inputPorts: {
          position: {
            name: 'top',
            args: {
              dr: 0,
              dx: 0,
              dy: 0,
            },
          },
          attrs: {
            circle: {
              fill: '#ffffff',
              stroke: '#31d0c6',
              strokeWidth: 1,
              r: 4,
              style: 'cursor: default;',
            },
            text: {
              fill: '#6a6c8a',
            },
          },
        },
        outputPorts: {
          position: {
            name: 'bottom',
            args: {
              dr: 0,
              dx: 0,
              dy: 0,
            },
          },
          attrs: {
            circle: {
              fill: '#ffffff',
              stroke: '#31d0c6',
              strokeWidth: 1,
              r: 4,
              style: 'cursor: crosshair;',
            },
            text: {
              fill: '#6a6c8a',
            },
          },
        },
      },
    },
  }
}
/**
 * 将实验图节点信息转换为节点和边的配置
 * @param graph
 */
export function formatExperimentGraph(graph: any = {}) {
  const { nodes = [], links = [], groups = [] } = graph
  const formattedNodes = nodes.map((node: any) =>
    formatNodeToGraphNodeConf(node),
  )

  const formattedEdges = links.map((link: any) => {
    const { source, target } = link
    return {
      ...link,
      source: source.toString(),
      target: target.toString(),
      label: '',
    }
  })

  const groupNodeMap = groups.reduce(
    (mapResult: any, currentGroup: NExperimentGraph.Group) => {
      const { id } = currentGroup
      return {
        ...mapResult,
        [id]:
          formattedNodes.filter(
            (node: any) => node.groupId.toString() === id.toString(),
          ) || [],
      }
    },
    {},
  )

  return {
    nodes: formattedNodes,
    edges: formattedEdges,
    groups,
    groupNodeMap,
  }
}
