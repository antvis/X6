import React from 'react'
import { Graph, Node, Keyboard } from '@antv/x6'
import { connectors } from '../connector/xmind-definitions'
import Hierarchy from '@antv/hierarchy'
import '../index.less'
import './mind.less'

// 中心主题或分支主题
Graph.registerNode(
  'topic',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    attrs: {
      body: {
        rx: 6,
        ry: 6,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
        strokeWidth: 1,
      },
      img: {
        ref: 'body',
        refX: '100%',
        refY: '50%',
        refY2: -8,
        width: 16,
        height: 16,
        'xlink:href':
          'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SYCuQ6HHs5cAAAAAAAAAAAAAARQnAQ',
        event: 'add:topic',
      },
      label: {
        fontSize: 14,
        fill: '#262626',
      },
    },
  },
  true,
)

// 子主题
Graph.registerNode(
  'topic-child',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
      {
        tagName: 'path',
        selector: 'line',
      },
    ],
    attrs: {
      body: {
        fill: '#ffffff',
        strokeWidth: 0,
        stroke: '#5F95FF',
      },
      label: {
        fontSize: 14,
        fill: '#262626',
        textVerticalAnchor: 'bottom',
      },
      line: {
        stroke: '#5F95FF',
        strokeWidth: 2,
        d: 'M 0 15 L 60 15',
      },
    },
  },
  true,
)

Graph.registerEdge(
  'mindmap-edge',
  {
    inherit: 'edge',
    connector: {
      name: connectors.branch,
    },
    attrs: {
      line: {
        targetMarker: '',
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
    zIndex: 0,
  },
  true,
)

type NodeType = 'topic' | 'topic-branch' | 'topic-child'

interface MindMapData {
  id: string
  type: NodeType
  label: string
  width: number
  height: number
  children?: MindMapData[]
}

interface HierarchyResult {
  id: string
  x: number
  y: number
  data: MindMapData
  children?: HierarchyResult[]
}

const data: MindMapData = {
  id: '1',
  type: 'topic',
  label: '中心主题',
  width: 160,
  height: 50,
  children: [
    {
      id: '1-1',
      type: 'topic-branch',
      label: '分支主题1',
      width: 100,
      height: 40,
      children: [
        {
          id: '1-1-1',
          type: 'topic-child',
          label: '子主题1',
          width: 60,
          height: 30,
        },
        {
          id: '1-1-2',
          type: 'topic-child',
          label: '子主题2',
          width: 60,
          height: 30,
        },
      ],
    },
    {
      id: '1-2',
      type: 'topic-branch',
      label: '分支主题2',
      width: 100,
      height: 40,
    },
  ],
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      connecting: {
        connectionPoint: 'anchor',
      },
    })
    const selection = new Selection()
    graph.use(selection)
    const keyboard = new Keyboard()
    graph.use(keyboard)

    const render = () => {
      const result: HierarchyResult = Hierarchy.mindmap(data, {
        direction: 'H',
        getHeight(d: MindMapData) {
          return d.height
        },
        getWidth(d: MindMapData) {
          return d.width
        },
        getHGap() {
          return 40
        },
        getVGap() {
          return 20
        },
        getSide: () => {
          return 'right'
        },
      })
      const traverse = (hierarchyItem: HierarchyResult) => {
        if (hierarchyItem) {
          const { data, children } = hierarchyItem
          // 检查当前遍历的节点已经存在还是需要新添加？
          if (graph.hasCell(data.id)) {
            const node = graph.getCellById(data.id)
            node.prop('position', { x: hierarchyItem.x, y: hierarchyItem.y })
          } else {
            graph.addNode({
              id: data.id,
              shape: data.type === 'topic-child' ? 'topic-child' : 'topic',
              x: hierarchyItem.x,
              y: hierarchyItem.y,
              width: data.width,
              height: data.height,
              label: data.label,
              type: data.type,
            })
          }
          if (children) {
            children.forEach((item: HierarchyResult) => {
              const { id, data } = item
              // 先遍历子节点（里面包含创建逻辑，如果画布没有开启async的时候，创建边会提示找不到target节点）
              traverse(item)
              const eid = `${hierarchyItem.id}-->${id}`
              // 检查当前边是否已经存在
              if (!graph.hasCell(eid)) {
                graph.addEdge({
                  id: eid,
                  shape: 'mindmap-edge',
                  source: {
                    cell: hierarchyItem.id,
                    anchor:
                      data.type === 'topic-child'
                        ? {
                            name: 'right',
                            args: {
                              dx: -16,
                            },
                          }
                        : {
                            name: 'center',
                            args: {
                              dx: '25%',
                            },
                          },
                  },
                  target: {
                    cell: id,
                    anchor: {
                      name: 'left',
                    },
                  },
                })
              }
            })
          }
        }
      }
      traverse(result)
      graph.centerContent()
    }

    const findItem = (
      obj: MindMapData,
      id: string,
    ): {
      parent: MindMapData | null
      node: MindMapData | null
    } | null => {
      if (obj.id === id) {
        return {
          parent: null,
          node: obj,
        }
      }
      const { children } = obj
      if (children) {
        for (let i = 0, len = children.length; i < len; i++) {
          const res = findItem(children[i], id)
          if (res) {
            return {
              parent: res.parent || obj,
              node: res.node,
            }
          }
        }
      }
      return null
    }

    const addChildNode = (id: string, type: NodeType) => {
      const res = findItem(data, id)
      const dataItem = res?.node
      if (dataItem) {
        let item: MindMapData | null = null
        const length = dataItem.children ? dataItem.children.length : 0
        let nid = `${id}-${length + 1}`
        if (graph.hasCell(nid)) {
          // 如果通过length + 1拼接出来的节点id在画布中存在了，就在id后面加上随机数
          nid = nid + Math.random()
        }
        if (type === 'topic') {
          item = {
            id: nid,
            type: 'topic-branch',
            label: `分支主题${length + 1}`,
            width: 100,
            height: 40,
          }
        } else if (type === 'topic-branch') {
          item = {
            id: nid,
            type: 'topic-child',
            label: `子主题${length + 1}`,
            width: 60,
            height: 30,
          }
        }
        if (item) {
          if (dataItem.children) {
            dataItem.children.push(item)
          } else {
            dataItem.children = [item]
          }
          return item
        }
      }
      return null
    }

    const removeNode = (id: string) => {
      const res = findItem(data, id)
      const parentItem = res?.parent
      const nodeItem = res?.node
      if (parentItem && parentItem.children) {
        const { children } = parentItem
        const index = children.findIndex((item) => item.id === id)
        // 删除的时候，先删节点以及可能存在的子节点，再调用render，对data数据进行遍历
        if (nodeItem && nodeItem.children) {
          nodeItem.children.forEach((item) => graph.removeCell(item.id))
        }
        graph.removeCell(id)
        return children.splice(index, 1)
      }
      return null
    }

    graph.on('add:topic', ({ node }: { node: Node }) => {
      const { id } = node
      const type = node.prop('type')
      if (addChildNode(id, type)) {
        render()
      }
    })
    keyboard.bindKey(['backspace', 'delete'], () => {
      const selectedNodes = selection
        .getSelectedCells()
        .filter((item) => item.isNode())
      if (selectedNodes.length) {
        const { id } = selectedNodes[0]
        if (removeNode(id)) {
          render()
        }
      }
    })

    keyboard.bindKey('tab', (e) => {
      e.preventDefault()
      const selectedNodes = selection
        .getSelectedCells()
        .filter((item) => item.isNode())
      if (selectedNodes.length) {
        const node = selectedNodes[0]
        const type = node.prop('type')
        if (addChildNode(node.id, type)) {
          render()
        }
      }
    })

    render()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap mindmap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
