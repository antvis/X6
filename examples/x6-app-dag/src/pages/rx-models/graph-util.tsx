/* eslint-disable class-methods-use-this */
import { minBy, maxBy, sortBy } from 'lodash-es'
import {
  GROUP_HORIZONTAL__PADDING,
  GROUP_VERTICAL__PADDING,
  NODE_WIDTH,
  NODE_HEIGHT,
} from '@/constants/graph'
import { NExperimentGraph } from '@/pages/rx-models/typing'
import { BaseNode } from '../common/graph-common/shape/node'
import '../common/graph-common/connector'

// group 范围适应内部节点变化
export function expandGroupAccordingToNodes(params: { moveNodes: BaseNode[] }) {
  const { moveNodes } = params
  const parentNodes: BaseNode[] = []
  moveNodes.forEach((node: BaseNode) => {
    const parentNode: BaseNode = node.getParent() as BaseNode
    if (parentNode && !parentNodes.includes(parentNode)) {
      parentNodes.push(parentNode)
    }
  })
  parentNodes.forEach((parent) => {
    const originSize = parent.getSize()
    const originPosition = parent.getPosition()
    const originX = originPosition.x
    const originY = originPosition.y
    const originWidth = originSize.width
    const originHeight = originSize.height
    const children = parent.getChildren() as BaseNode[]
    const childNodes = children.filter((child) => child.isNode())
    if (childNodes?.length) {
      const positions = childNodes.map((childNode) => childNode.getPosition())
      const minX = minBy(positions, 'x')?.x!
      const minY = minBy(positions, 'y')?.y!
      const maxX = maxBy(positions, 'x')?.x!
      const maxY = maxBy(positions, 'y')?.y!

      const nextX = minX - GROUP_HORIZONTAL__PADDING
      const nextY = minY - GROUP_VERTICAL__PADDING
      const nextWidth = maxX - minX + 2 * GROUP_HORIZONTAL__PADDING + NODE_WIDTH
      const nextHeight = maxY - minY + 2 * GROUP_VERTICAL__PADDING + NODE_HEIGHT
      if (
        originX !== nextX ||
        originY !== nextY ||
        originWidth !== nextWidth ||
        originHeight !== nextHeight
      ) {
        parent.prop({
          position: { x: nextX, y: nextY },
          size: { width: nextWidth, height: nextHeight },
        })
      }
    }
  })
}

// 格式化单个节点，新增节点时复用
export function formatNodeInfoToNodeMeta(
  nodeData: NExperimentGraph.Node,
  inputPortConnectedMap: { [k: string]: boolean } = {},
) {
  const portItems: any[] = []
  const { id, nodeInstanceId, positionX, positionY, inPorts, outPorts } =
    nodeData
  sortBy(inPorts, 'sequence').forEach((inPort: any) => {
    portItems.push({
      ...inPort,
      group: 'in',
      id: inPort.id.toString(),
      connected: !!inputPortConnectedMap[inPort.id.toString()],
    })
  })
  sortBy(outPorts, 'sequence').forEach((outPort: any) => {
    portItems.push({
      ...outPort,
      group: 'out',
      id: outPort.id.toString(),
      connected: !!inputPortConnectedMap[outPort.id.toString()],
    })
  })
  const x = positionX || 0
  const y = positionY || 0
  return {
    ...nodeData,
    x,
    y,
    type: 'node',
    id: (nodeInstanceId || id)!.toString(),
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    data: {
      ...nodeData,
      type: 'node',
      x,
      y,
      id: (nodeInstanceId || id)!.toString(),
    },
    ports: {
      items: portItems,
    },
    zIndex: 10,
  }
}

// 根据群组节点的收缩状态及子节点，计算出节点群组的尺寸和位置
export function calcNodeScale(
  groupData: NExperimentGraph.Group,
  children: any[],
) {
  const { isCollapsed = false } = groupData
  const minX = minBy(children, 'x')?.x
  const minY = minBy(children, 'y')?.y
  const maxX = maxBy(children, 'x')?.x
  const maxY = maxBy(children, 'y')?.y

  const defaultX = minX - GROUP_HORIZONTAL__PADDING
  const defaultY = minY - GROUP_VERTICAL__PADDING
  const defaultWidth = maxX - minX + 2 * GROUP_HORIZONTAL__PADDING + NODE_WIDTH

  if (isCollapsed) {
    return {
      x: defaultX + defaultWidth / 2 - NODE_WIDTH / 2,
      y: defaultY,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    }
  }

  return {
    x: defaultX,
    y: defaultY,
    width: defaultWidth,
    height: maxY - minY + 2 * GROUP_VERTICAL__PADDING + NODE_HEIGHT,
  }
}

// 格式化单个群组，新增群组时复用
export function formatGroupInfoToNodeMeta(
  groupData: NExperimentGraph.Group,
  nodeDatas: any[],
  edges?: any[],
) {
  const { id, isCollapsed = false } = groupData
  const includedNodes: any[] = nodeDatas.filter(
    (nodeMeta: any) => nodeMeta.groupId.toString() === id.toString(),
  )

  const { x, y, width, height } = calcNodeScale(groupData, includedNodes)

  // group 已收缩则必定已存在，而不是处理新增的 group，因此处理的 nodeDatas 是 meta 数据而不是 getData 的数据
  if (isCollapsed && edges) {
    // eslint-disable-next-line no-param-reassign
    includedNodes.forEach((node) => {
      node.data.hide = true
    })
    const includedNodeIds: string[] = includedNodes.map((nodeData) =>
      nodeData.id.toString(),
    )
    // 从外部进入到 group 内部的连线
    const edgesFromOutside = edges.filter((edge: any) => {
      const { source, target } = edge
      return (
        includedNodeIds.includes(target.cell.toString()) &&
        !includedNodeIds.includes(source.cell.toString())
      )
    })
    // 从 group 穿到外部的连线
    const edgesToOutside = edges.filter((edge: any) => {
      const { source, target } = edge
      return (
        includedNodeIds.includes(source.cell.toString()) &&
        !includedNodeIds.includes(target.cell.toString())
      )
    })
    const portItems = []
    if (edgesFromOutside?.length) {
      const portId = Date.now().toString()
      portItems.push({ group: 'in', id: portId, connected: true }) // 增加 group 的输入桩
      // 增加连接到 group 输入桩的连线
      edgesFromOutside.forEach((edge: any) => {
        const { source, outputPortId } = edge
        edges.push({
          sourceAnchor: 'bottom',
          source: {
            cell: source.cell.toString(),
            port: outputPortId.toString(),
            anchor: {
              name: 'bottom',
            },
          },
          target: {
            cell: id.toString(),
            port: portId,
            anchor: {
              name: 'center',
            },
          },
          label: '',
          zIndex: 1,
        })
      })
    }
    if (edgesToOutside?.length) {
      const portId = (Date.now() + 1).toString()
      portItems.push({ group: 'out', id: portId, connected: false }) // 增加 group 的输出桩
      // 增加链接到 group 输出桩的连线
      edgesToOutside.forEach((edge: any) => {
        const { target, inputPortId } = edge
        edges.push({
          type: 'group',
          sourceAnchor: 'bottom',
          source: {
            cell: id,
            port: portId,
            anchor: {
              name: 'bottom',
            },
          },
          target: {
            cell: target.cell,
            port: inputPortId,
            anchor: {
              name: 'center',
            },
          },
          label: '',
          zIndex: 1,
        })
      })
    }
    return {
      type: 'group',
      ...groupData,
      id: id.toString(),
      x,
      y,
      width,
      height,
      zIndex: 1,
      data: { ...groupData, type: 'group', includedNodes, id: id.toString() },
      ports: {
        items: portItems,
      },
    }
  }

  return {
    type: 'group',
    ...groupData,
    id: id.toString(),
    x,
    y,
    width,
    height,
    zIndex: 1,
    data: { ...groupData, type: 'group', includedNodes, id: id.toString() },
  }
}

// 将接口返回的图信息转换为图渲染引擎可渲染的信息
export function formatGraphData(
  graphData: NExperimentGraph.ExperimentGraph = {} as any,
) {
  const { nodes = [], links = [], groups = [] } = graphData

  // 格式化边
  const formattedEdges = links.map((link: NExperimentGraph.Link) => {
    const { source, outputPortId, target, inputPortId } = link
    return {
      ...link,
      data: { ...link },
      sourceAnchor: 'bottom',
      source: {
        cell: source.toString(),
        port: outputPortId.toString(),
        anchor: {
          name: 'bottom',
        },
      },
      target: {
        cell: target.toString(),
        port: inputPortId.toString(),
        anchor: {
          name: 'center',
        },
      },
      label: '',
      zIndex: 1,
    }
  })

  // 记录所有已连线的输入桩
  const inputPortConnectedMap = formattedEdges.reduce(
    (acc: { [k: string]: boolean }, edge: any) => {
      acc[edge.inputPortId] = true
      return acc
    },
    {} as { [k: string]: boolean },
  )

  // 格式化算法组件节点
  const formattedNodes = nodes.map((nodeData: NExperimentGraph.Node) =>
    formatNodeInfoToNodeMeta(nodeData, inputPortConnectedMap),
  )

  // 格式化群组节点
  const formattedGroups = groups.map((groupData: NExperimentGraph.Group) =>
    formatGroupInfoToNodeMeta(groupData, formattedNodes, formattedEdges),
  )

  return {
    nodes: [
      ...formattedNodes,
      ...formattedGroups.filter(
        (group: any) => !!group?.data?.includedNodes?.length,
      ),
    ],
    edges: formattedEdges,
  }
}
