import React, { useCallback } from 'react'
import { Popover, ConfigProvider } from 'antd'
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { Edge } from '@antv/x6'
import { ANT_PREFIX } from '@/constants/global'
import { calcNodeScale } from '@/pages/rx-models/graph-util'
import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { NExperimentGraph } from '@/pages/rx-models/typing'
import {
  X6DemoGroupNode,
  X6DemoNode,
} from '@/pages/common/graph-common/shape/node'
import { X6DemoGroupEdge } from '../../common/graph-common/shape/edge'
import styles from './node-group.less'

interface Props {
  experimentId: string
  node?: X6DemoGroupNode
}

export const NodeGroup: React.FC<Props> = (props) => {
  const { experimentId, node } = props
  const data = node!.getData<NExperimentGraph.Group>()
  const { name, isCollapsed = false } = data
  const experimentGraph = useExperimentGraph(experimentId)

  // 折叠
  const onCollapseGroup = useCallback(() => {
    const { graph } = experimentGraph
    const children = node!.getDescendants()
    const childNodes: X6DemoNode[] = children.filter((child) =>
      child.isNode(),
    ) as any[]
    const { x, y, width, height } = calcNodeScale(
      { isCollapsed: true } as any,
      childNodes.map((i) => i.getData()),
    )

    // 还原尺寸
    node!.setProp({
      position: { x, y },
      size: { width, height },
    })

    // 处理 Data
    node?.updateData({ isCollapsed: true })

    // 隐藏子元素
    children.forEach((child) => {
      child.hide()
      child.updateData({ hide: true })
    })

    // 删除桩和边
    const groupEdges = graph?.getConnectedEdges(node!)
    if (groupEdges?.length) {
      experimentGraph.deleteEdges(groupEdges)
    }
    const ports = node!.getPorts()
    if (ports?.length) {
      node!.removePorts(ports)
    }

    // 创建新的连接桩和边
    const incomingEdges = childNodes.reduce(
      (accu: Edge[], curr: X6DemoNode) => {
        const incomingEdgs = graph!.getIncomingEdges(curr)
        if (incomingEdgs?.length) {
          return [...accu, ...incomingEdgs]
        }
        return accu
      },
      [] as Edge[],
    )
    const outgoingEdges = childNodes.reduce(
      (accu: Edge[], curr: X6DemoNode) => {
        const outgoingEdgs = graph!.getOutgoingEdges(curr)
        if (outgoingEdgs?.length) {
          return [...accu, ...outgoingEdgs]
        }
        return accu
      },
      [] as Edge[],
    )
    if (incomingEdges?.length) {
      const inputPortId = Date.now().toString()
      node!.addPort({ group: 'in', id: inputPortId, connected: true })
      incomingEdges
        .filter(
          (edge) =>
            !childNodes.map((i) => i.id).includes(edge.getSourceCellId()),
        ) // 只考虑从外部连接到组里的连线
        .forEach((edge) => {
          let sourceNodeId = edge.getSourceCellId()
          let sourcePortId = edge.getSourcePortId()
          const sourceNode: X6DemoNode = edge.getSourceCell()! as X6DemoNode
          if (sourceNode instanceof X6DemoGroupNode) {
            experimentGraph.deleteEdges(edge)
            return
          }
          const sourceParentNode: X6DemoGroupNode | null =
            sourceNode.parent as X6DemoGroupNode
          // 若源节点不可见，且存在父群组节点，则说明源节点的父群组节点已折叠，此时创建一个连接折叠父节点的桩
          if (
            !sourceNode.visible &&
            sourceParentNode instanceof X6DemoGroupNode
          ) {
            sourceNodeId = sourceParentNode.id
            const parentNodePorts = sourceParentNode.getPortsByGroup('out')
            sourcePortId = parentNodePorts[0].id
          }
          graph!.addEdge(
            new X6DemoGroupEdge({
              sourceAnchor: 'bottom',
              source: {
                cell: sourceNodeId,
                port: sourcePortId,
                anchor: {
                  name: 'bottom',
                },
              },
              target: {
                cell: node!.id,
                port: inputPortId,
                anchor: {
                  name: 'center',
                },
              },
              zIndex: 1,
            }),
          )
        })
    }
    if (outgoingEdges?.length) {
      const outputPortId = Date.now().toString()
      node!.addPort({ group: 'out', id: outputPortId, connected: false })
      outgoingEdges
        .filter(
          (edge) =>
            !childNodes.map((i) => i.id).includes(edge.getTargetCellId()),
        )
        .forEach((edge) => {
          let targetNodeId = edge.getTargetCellId()
          let targetPortId = edge.getTargetPortId()
          const targetNode: X6DemoNode = edge.getTargetCell()! as X6DemoNode
          if (targetNode instanceof X6DemoGroupNode) {
            experimentGraph.deleteEdges(edge)
            return
          }
          const targetParentNode: X6DemoGroupNode | null =
            targetNode.parent as X6DemoGroupNode
          // 若源节点不可见，且存在父群组节点，则说明源节点的父群组节点已折叠，此时创建一个连接折叠父节点的桩
          if (
            !targetNode.visible &&
            targetParentNode instanceof X6DemoGroupNode
          ) {
            targetNodeId = targetParentNode.id
            const parentNodePorts = targetParentNode.getPortsByGroup('in')
            targetPortId = parentNodePorts[0].id
          }
          graph!.addEdge(
            new X6DemoGroupEdge({
              sourceAnchor: 'bottom',
              source: {
                cell: node!.id,
                port: outputPortId,
                anchor: {
                  name: 'bottom',
                },
              },
              target: {
                cell: targetNodeId,
                port: targetPortId,
                anchor: {
                  name: 'center',
                },
              },
              zIndex: 1,
            }),
          )
        })
    }
  }, [node, experimentGraph])

  // 展开
  const onExpandGroup = useCallback(() => {
    const { graph } = experimentGraph
    const children = node!.getDescendants()
    const childNodes: X6DemoNode[] = children.filter((child) =>
      child.isNode(),
    ) as any[]
    const { x, y, width, height } = calcNodeScale(
      { isCollapsed: false } as any,
      children.filter((i) => i.isNode()).map((i) => i.getData()),
    )
    // 还原尺寸
    node!.setProp({
      position: { x, y },
      size: { width, height },
    })

    // 处理 Data
    const prevData = node!.getData<object>()
    node?.setData({ ...prevData, isCollapsed: false })

    // 显示子元素
    childNodes.forEach((child) => {
      child.show()
      child.updateData({ hide: false })
    })

    // 删除桩和边
    const groupEdges = graph?.getConnectedEdges(node!)
    if (groupEdges?.length) {
      experimentGraph.deleteEdges(groupEdges)
    }
    const ports = node!.getPorts()
    if (ports?.length) {
      node!.removePorts(ports)
    }

    // 建立与外部折叠群组的连接
    const childIncomingEdges = childNodes.reduce(
      (accu: Edge[], curr: X6DemoNode) => {
        const incomingEdgs = graph!.getIncomingEdges(curr)
        if (incomingEdgs?.length) {
          return [...accu, ...incomingEdgs]
        }
        return accu
      },
      [] as Edge[],
    )
    const childOutgoingEdges = childNodes.reduce(
      (accu: Edge[], curr: X6DemoNode) => {
        const outgoingEdgs = graph!.getOutgoingEdges(curr)
        if (outgoingEdgs?.length) {
          return [...accu, ...outgoingEdgs]
        }
        return accu
      },
      [] as Edge[],
    )
    if (childIncomingEdges?.length) {
      childIncomingEdges
        .filter(
          (edge) =>
            !childNodes.map((i) => i.id).includes(edge.getSourceCellId()),
        ) // 只考虑从外部连接到组里的连线
        .forEach((edge) => {
          const sourceNode: X6DemoNode = edge.getSourceCell()! as X6DemoNode
          if (sourceNode instanceof X6DemoGroupNode) {
            experimentGraph.deleteEdges(edge)
            return
          }
          const sourceParentNode: X6DemoGroupNode | null =
            sourceNode.parent as X6DemoGroupNode
          // 若源节点不可见，且存在父群组节点，则说明源节点的父群组节点已折叠，此时创建一个连接折叠父节点的桩
          if (
            !sourceNode.visible &&
            sourceParentNode instanceof X6DemoGroupNode
          ) {
            const sourceNodeId = sourceParentNode.id
            const parentNodePorts = sourceParentNode.getPortsByGroup('out')
            const sourcePortId = parentNodePorts[0].id
            const targetNodeId = edge.getTargetCellId()
            const targetPortId = edge.getTargetPortId()
            graph!.addEdge(
              new X6DemoGroupEdge({
                sourceAnchor: 'bottom',
                source: {
                  cell: sourceNodeId,
                  port: sourcePortId,
                  anchor: {
                    name: 'bottom',
                  },
                },
                target: {
                  cell: targetNodeId,
                  port: targetPortId,
                  anchor: {
                    name: 'center',
                  },
                },
                zIndex: 1,
              }),
            )
          }
        })
    }

    if (childOutgoingEdges?.length) {
      childOutgoingEdges
        .filter(
          (edge) =>
            !childNodes.map((i) => i.id).includes(edge.getTargetCellId()),
        )
        .forEach((edge) => {
          const targetNode: X6DemoNode = edge.getTargetCell()! as X6DemoNode
          if (targetNode instanceof X6DemoGroupNode) {
            experimentGraph.deleteEdges(edge)
            return
          }
          const targetParentNode: X6DemoGroupNode | null =
            targetNode.parent as X6DemoGroupNode
          // 若源节点不可见，且存在父群组节点，则说明源节点的父群组节点已折叠，此时创建一个连接折叠父节点的桩
          if (
            !targetNode.visible &&
            targetParentNode instanceof X6DemoGroupNode
          ) {
            const targetNodeId = targetParentNode.id
            const parentNodePorts = targetParentNode.getPortsByGroup('in')
            const targetPortId = parentNodePorts[0].id
            const sourceNodeId = edge.getSourceCellId()
            const sourcePortId = edge.getSourcePortId()
            graph!.addEdge(
              new X6DemoGroupEdge({
                sourceAnchor: 'bottom',
                source: {
                  cell: sourceNodeId,
                  port: sourcePortId,
                  anchor: {
                    name: 'bottom',
                  },
                },
                target: {
                  cell: targetNodeId,
                  port: targetPortId,
                  anchor: {
                    name: 'center',
                  },
                },
                zIndex: 1,
              }),
            )
          }
        })
    }
  }, [node, experimentGraph])

  return (
    <ConfigProvider prefixCls={ANT_PREFIX}>
      <div className={styles.nodeGroup}>
        <div className={styles.row}>
          <Popover
            content={`组名: ${name}`}
            overlayClassName={styles.namePopover}
          >
            <div className={styles.name}>
              {name.length > 20 ? `${name.slice(0, 20)}...` : name}
            </div>
          </Popover>
          {isCollapsed ? (
            <PlusSquareOutlined
              className={styles.collapseButton}
              onClick={onExpandGroup}
            />
          ) : (
            <MinusSquareOutlined
              className={styles.collapseButton}
              onClick={onCollapseGroup}
            />
          )}
        </div>
      </div>
    </ConfigProvider>
  )
}
