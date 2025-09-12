import React from 'react'
import { Select } from 'antd'
import dagre from 'dagre'
import { Graph, Cell, Node, Color, Dom } from '@antv/x6'
import './shape'
import '../index.less'
import './index.less'

const male =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'
const female =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ'

export class OrgExample extends React.Component<Example.Props, Example.State> {
  private container: HTMLDivElement
  private graph: Graph

  state: Example.State = {
    dir: 'LR',
  }

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      width: 1000,
      height: 600,
      interacting: false,
    })

    const nodes = [
      this.createNode('Founder & Chairman', 'Pierre Omidyar', male, '#31d0c6'),
      this.createNode(
        'President & CEO',
        'Margaret C. Whitman',
        female,
        '#31d0c6',
      ),
      this.createNode('President, PayPal', 'Scott Thompson', male, '#7c68fc'),
      this.createNode(
        'President, Ebay Global Marketplaces',
        'Devin Wenig',
        male,
        '#7c68fc',
      ),
      this.createNode(
        'Senior Vice President Human Resources',
        'Jeffrey S. Skoll',
        male,
        '#fe854f',
      ),
      this.createNode(
        'Senior Vice President Controller',
        'Steven P. Westly',
        male,
        '#feb663',
      ),
      this.createNode(
        'Senior Vice President Controller',
        'Carl Carlson',
        female,
        '#feb663',
      ),
    ]

    const edges = [
      this.createEdge(nodes[0], nodes[1]),
      this.createEdge(nodes[1], nodes[2]),
      this.createEdge(nodes[1], nodes[3]),
      this.createEdge(nodes[1], nodes[4]),
      this.createEdge(nodes[1], nodes[5]),
      this.createEdge(nodes[1], nodes[6]),
    ]

    this.graph.resetCells([...nodes, ...edges])
    this.layout()
    this.graph.zoomTo(0.8)
    this.graph.centerContent()
    this.setup()
  }

  setup() {
    this.graph.on(
      'node:add',
      ({ e, node }: { e: Dom.ClickEvent; node: Node }) => {
        e.stopPropagation()
        const bg = Color.randomHex()
        const member = this.createNode(
          'Employee',
          'New Employee',
          Math.random() < 0.5 ? male : female,
          bg,
          Color.invert(bg, true),
        )
        this.graph.addCell([member, this.createEdge(node, member)])
        this.layout()
      },
    )

    this.graph.on(
      'node:delete',
      ({ e, node }: { e: Dom.ClickEvent; node: Node }) => {
        e.stopPropagation()
        this.graph.removeCell(node)
        this.layout()
      },
    )
  }

  layout() {
    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()
    const rankdir = this.state.dir
    const g = new dagre.graphlib.Graph()
    g.setGraph({ rankdir, nodesep: 16, ranksep: 16 })
    g.setDefaultEdgeLabel(() => ({}))

    const width = 260
    const height = 90
    nodes.forEach((node) => {
      g.setNode(node.id, { width, height })
    })

    edges.forEach((edge) => {
      const source = edge.getSourceCellId()
      const target = edge.getTargetCellId()
      g.setEdge(source, target)
    })

    dagre.layout(g)

    g.nodes().forEach((id: string) => {
      const node = this.graph.getCellById(id) as Node
      if (node) {
        const pos = g.node(id)
        node.position(pos.x, pos.y)
      }
    })

    edges.forEach((edge) => {
      const source = edge.getSourceNode()!
      const target = edge.getTargetNode()!
      const sourceBBox = source.getBBox()
      const targetBBox = target.getBBox()

      if (
        (rankdir === 'LR' || rankdir === 'RL') &&
        sourceBBox.y !== targetBBox.y
      ) {
        const gap =
          rankdir === 'LR'
            ? targetBBox.x - sourceBBox.x - sourceBBox.width
            : -sourceBBox.x + targetBBox.x + targetBBox.width
        const fix = rankdir === 'LR' ? sourceBBox.width : 0
        const x = sourceBBox.x + fix + gap / 2
        edge.setVertices([
          { x, y: sourceBBox.center.y },
          { x, y: targetBBox.center.y },
        ])
      } else if (
        (rankdir === 'TB' || rankdir === 'BT') &&
        sourceBBox.x !== targetBBox.x
      ) {
        const gap =
          rankdir === 'TB'
            ? targetBBox.y - sourceBBox.y - sourceBBox.height
            : -sourceBBox.y + targetBBox.y + targetBBox.height
        const fix = rankdir === 'TB' ? sourceBBox.height : 0
        const y = sourceBBox.y + fix + gap / 2
        edge.setVertices([
          { x: sourceBBox.center.x, y },
          { x: targetBBox.center.x, y },
        ])
      } else {
        edge.setVertices([])
      }
    })
  }

  createNode(
    rank: string,
    name: string,
    image: string,
    background: string,
    textColor = '#000',
  ) {
    return this.graph.createNode({
      shape: 'org-node',
      attrs: {
        '.card': { fill: background },
        '.image': { xlinkHref: image },
        '.rank': {
          fill: textColor,
          text: Dom.breakText(rank, { width: 160, height: 45 }),
        },
        '.name': {
          fill: textColor,
          text: Dom.breakText(name, { width: 160, height: 45 }),
        },
        '.btn > circle': { stroke: textColor },
        '.btn > text': { fill: textColor, stroke: textColor },
      },
    })
  }

  createEdge(source: Cell, target: Cell) {
    return this.graph.createEdge({
      shape: 'org-edge',
      source: { cell: source.id },
      target: { cell: target.id },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onDirChange = (dir: 'LR' | 'RL' | 'TB' | 'BT') => {
    this.setState({ dir }, () => {
      this.layout()
      this.graph.centerContent()
    })
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div className="x6-graph-tools">
          <Select value={this.state.dir} onChange={this.onDirChange}>
            <Select.Option value="LR">Left-Right</Select.Option>
            <Select.Option value="RL">Right-Left</Select.Option>
            <Select.Option value="TB">Top-Bottom</Select.Option>
            <Select.Option value="BT">Bottom-Top</Select.Option>
          </Select>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}

// eslint-disable-next-line
export namespace Example {
  export interface Props {}

  export interface State {
    dir: 'LR' | 'RL' | 'TB' | 'BT'
  }
}
