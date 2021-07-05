import React from 'react'
import { Graph, Node } from '@antv/x6'
import '@antv/x6-react-shape'
import data from './data.json'
import '../index.less'
import './index.less'

//#region react component
interface IProps {
  node?: Node
}
interface IState {
  collapsed: boolean
}
class GroupComponent extends React.Component<IProps, IState> {
  state = {
    collapsed: false,
  }

  shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    return nextState.collapsed !== this.state.collapsed
  }

  onCollapse = () => {
    const node = this.props.node
    const target = !this.state.collapsed

    if (node) {
      const cells = node.getChildren()
      if (cells) {
        cells.forEach((cell: Node) => {
          if (target) {
            cell.hide()
          } else {
            cell.show()
          }
        })
      }
      if (target) {
        node.prop('previousSize', node.size())
        node.size(160, 32)
      } else {
        const previousSize = node.prop('previousSize')
        node.size(previousSize.width, previousSize.height)
      }
    }

    this.setState({
      collapsed: target,
    })
  }

  render() {
    return (
      <div className="group">
        <div className="header">
          <span>
            <img
              src="https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*rYacTYE0PR0AAAAAAAAAAAAAARQnAQ"
              alt="group"
            />
            <span>Group</span>
          </span>
          <span className="btn" onClick={this.onCollapse}>
            {this.state.collapsed ? '+' : '-'}
          </span>
        </div>
      </div>
    )
  }
}
Graph.registerReactComponent('group', <GroupComponent />, true)
//#endregion

export default class Example extends React.Component {
  private graph: Graph
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      connecting: {
        connector: 'smooth',
      },
    })

    this.graph = graph
    this.initShape()
    this.initEvent()
  }

  initShape = () => {
    const nodes = data.nodes
    const edges = data.edges
    const groups = data.groups
    const newEdges: typeof edges = []

    const getNode = (nodeId: string) => {
      if (nodeId) {
        return nodes.find((node) => node.id === nodeId)
      }
      return null
    }

    const getGroup = (groupId: string | undefined) => {
      if (groupId) {
        return groups.find((group) => group.id === groupId)
      }
      return null
    }

    // 将连接到群组内部节点的连线进行拆分
    // source  target    op
    //   √       X      source->群组->target
    //   X       √      source->群组->target
    //   √       √      source->群组1->群组2->target
    edges.forEach((edge) => {
      const sourceNodeId =
        typeof edge.source === 'string' ? edge.source : edge.source.cell
      const targetNodeId =
        typeof edge.target === 'string' ? edge.target : edge.target.cell
      const sourceNode = getNode(sourceNodeId)
      const targetNode = getNode(targetNodeId)
      const sourceGroup = getGroup(sourceNode?.group)
      const targetGroup = getGroup(targetNode?.group)

      if (sourceGroup !== targetGroup) {
        if (sourceGroup && targetGroup) {
          const sourceGroupPort = {
            cell: sourceGroup.id,
            port: sourceGroup.ports.items[0].id,
          }
          const targetGroupPort = {
            cell: targetGroup.id,
            port: targetGroup.ports.items[0].id,
          }
          newEdges.push(
            ...[
              {
                ...edge,
                source: edge.source,
                target: sourceGroupPort,
                id: `${edge.id}_1`,
                for: edge.id,
              },
              {
                ...edge,
                source: targetGroupPort,
                target: edge.target,
                id: `${edge.id}_2`,
                for: edge.id,
              },
            ],
          )
          edge.source = sourceGroupPort
          edge.target = targetGroupPort

          const sourceChildren = sourceGroup.children as string[]
          const targetChildren = targetGroup.children as string[]
          sourceChildren.push(sourceNode!.id)
          targetChildren.push(targetNode!.id)
        } else if (sourceGroup) {
          const sourceGroupPort = {
            cell: sourceGroup.id,
            port: sourceGroup.ports.items[0].id,
          }
          newEdges.push(
            ...[
              {
                ...edge,
                source: edge.source,
                target: sourceGroupPort,
                id: `${edge.id}_1`,
                for: edge.id,
              },
            ],
          )
          edge.source = sourceGroupPort

          const children = sourceGroup.children as string[]
          children.push(sourceNode!.id)
        } else if (targetGroup) {
          const targetGroupPort = {
            cell: targetGroup.id,
            port: targetGroup.ports.items[0].id,
          }
          newEdges.push(
            ...[
              {
                ...edge,
                source: targetGroupPort,
                target: edge.target,
                id: `${edge.id}_1`,
                for: edge.id,
              },
            ],
          )
          edge.target = targetGroupPort

          const children = targetGroup.children as string[]
          children.push(targetNode!.id)
        }
      }
    })

    this.graph.addNodes([...nodes, ...groups])
    this.graph.addEdges([...edges, ...newEdges])
  }

  initEvent = () => {
    const graph = this.graph
    graph.on('node:moving', ({ node }) => {
      const isGroup = node.prop('isGroup')
      if (isGroup) {
        node.prop('originPosition', node.getPosition())
        return
      }

      const groupId = node.prop('group')
      const group = graph.getNodes().find((node) => node.id === groupId)
      if (!group) {
        return
      }

      let hasChange = false
      let originSize = group.prop('originSize')
      if (originSize == null) {
        originSize = group.size()
        group.prop('originSize', originSize)
      }
      let originPosition = group.prop('originPosition')
      if (originPosition == null) {
        originPosition = group.position()
        group.prop('originPosition', originPosition)
      }

      let x = originPosition.x
      let y = originPosition.y
      let cornerX = originPosition.x + originSize.width
      let cornerY = originPosition.y + originSize.height
      const childs = group.getChildren()
      if (childs) {
        childs.forEach((child) => {
          const bbox = child.getBBox().inflate(32)
          const corner = bbox.getCorner()

          if (bbox.x < x) {
            x = bbox.x
            hasChange = true
          }

          if (bbox.y < y) {
            y = bbox.y
            hasChange = true
          }

          if (corner.x > cornerX) {
            cornerX = corner.x
            hasChange = true
          }

          if (corner.y > cornerY) {
            cornerY = corner.y
            hasChange = true
          }
        })
      }

      if (hasChange) {
        group.prop({
          position: { x, y },
          size: { width: cornerX - x, height: cornerY - y },
        })
      }
    })
  }

  toJson = () => {
    const res = this.graph.toJSON()
    const cells = res.cells
    res.cells = cells
      .filter((cell) => !cell.for)
      .map((cell) => {
        if (cell.shape === 'edge') {
          return {
            ...cell,
            source: cell.originSource || cell.source,
            target: cell.originTarget || cell.target,
          }
        }
        return cell
      })
    return res
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
