import { type Edge, Graph, type Node, Snapline, Stencil } from '@antv/x6'
import { register } from '@antv/x6-react-shape'
import insertCss from 'insert-css'
import React from 'react'

// 为了协助代码演示
preWork()

const CARD_WIDTH = 260
const CARD_HEIGHT = 96
const PORT_DOT_RADIUS = 3
const COLOR_PORT_GRAY = '#C2C8D5'
const COLOR_PORT_BLUE = '#5F95FF'

const graph = new Graph({
  container: document.getElementById('graph-container') as HTMLElement,
  grid: true,
  mousewheel: {
    enabled: true,
    minScale: 0.5,
    maxScale: 3,
  },
  connecting: {
    connector: { name: 'smooth' },
    connectionPoint: 'anchor',
    allowBlank: false,
    snap: { radius: 20 },
    allowEdge: false,
    allowLoop: false,
    highlight: true,
    createEdge(): Edge {
      return graph.createEdge({ shape: 'agent-edge' })
    },
    validateConnection({
      targetMagnet,
    }: {
      targetMagnet?: Element | null
    }): boolean {
      return !!targetMagnet
    },
  },
  highlighting: {
    magnetAdsorbed: {
      name: 'stroke',
      args: {
        attrs: {
          fill: COLOR_PORT_BLUE,
          stroke: COLOR_PORT_BLUE,
        },
      },
    },
  },
})

graph.use(new Snapline())

Graph.registerEdge(
  'agent-edge',
  {
    inherit: 'edge',
    attrs: {
      line: { stroke: COLOR_PORT_BLUE, strokeWidth: 2, targetMarker: 'block' },
    },
  },
  true,
)

const stencil = new Stencil({
  title: '智能体流程编排',
  target: graph,
  stencilGraphWidth: 240,
  stencilGraphHeight: 480,
  stencilGraphOptions: { panning: true },
  collapsable: true,
  groups: [
    {
      title: '业务逻辑',
      name: 'biz',
      graphHeight: 380,
      layoutOptions: { rowHeight: 88 },
    },
    {
      title: '知识库&数据',
      name: 'data',
      graphHeight: 300,
      layoutOptions: { rowHeight: 88 },
    },
  ],
  layoutOptions: { columns: 1, columnWidth: 230, rowHeight: 88, dx: 8 },
})
document
  .getElementById('stencil')
  ?.appendChild(stencil.container as HTMLElement)

const basePortAttrs = {
  r: PORT_DOT_RADIUS,
  magnet: true,
  stroke: COLOR_PORT_GRAY,
  strokeWidth: 1,
  fill: COLOR_PORT_GRAY,
  style: { visibility: 'hidden' },
}
const createPortGroup = (position: 'top' | 'right' | 'bottom' | 'left') => ({
  position,
  attrs: { circle: { ...basePortAttrs } },
})
const ports = {
  groups: {
    top: createPortGroup('top'),
    right: createPortGroup('right'),
    bottom: createPortGroup('bottom'),
    left: createPortGroup('left'),
  },
  items: [
    { id: 'top', group: 'top' },
    { id: 'right', group: 'right' },
    { id: 'bottom', group: 'bottom' },
    { id: 'left', group: 'left' },
  ],
}

const isPortConnected = (node: Node, portId: string): boolean => {
  const edges = graph.getConnectedEdges(node)
  return edges.some(
    (e) =>
      (e.getSourceCellId() === node.id && e.getSourcePortId() === portId) ||
      (e.getTargetCellId() === node.id && e.getTargetPortId() === portId),
  )
}
const setPortVisible = (node: Node, portId: string, visible: boolean) => {
  node.setPortProp(
    portId,
    'attrs/circle/style/visibility',
    visible ? 'visible' : 'hidden',
  )
}
const setPortColor = (node: Node, portId: string, color: string) => {
  node.setPortProp(portId, 'attrs/circle/fill', color)
  node.setPortProp(portId, 'attrs/circle/stroke', color)
}
const setPortDot = (
  node: Node,
  portId: string,
  visible: boolean,
  color?: string,
) => {
  setPortVisible(node, portId, visible)
  if (color) setPortColor(node, portId, color)
}
const withNodePort = (
  cellId?: string | null,
  portId?: string | null,
  fn?: (node: Node, portId: string) => void,
) => {
  if (!cellId || !portId || !fn) return
  const cell = graph.getCellById(cellId)
  if (cell && cell.isNode()) fn(cell as Node, portId)
}
const showNodePorts = (node: Node, show: boolean) => {
  const ps = node.getPorts()
  for (let i = 0; i < ps.length; i += 1) {
    const id = ps[i].id as string
    if (show) {
      setPortVisible(node, id, true)
    } else {
      const connected = isPortConnected(node, id)
      setPortVisible(node, id, connected)
      setPortColor(node, id, connected ? COLOR_PORT_BLUE : COLOR_PORT_GRAY)
    }
  }
}
graph.on('node:mouseenter', ({ node }: { node: Node }) => {
  showNodePorts(node, true)
})
graph.on('node:mouseleave', ({ node }: { node: Node }) => {
  showNodePorts(node, false)
})
graph.on('edge:mouseenter', ({ edge }: { edge: Edge }) => {
  edge.addTools({ name: 'button-remove', args: { distance: -40 } })
})
graph.on('edge:mouseleave', ({ edge }: { edge: Edge }) => {
  edge.removeTools()
})

graph.on(
  'edge:connected',
  ({
    currentCell,
    currentPort,
  }: {
    currentCell: Node
    currentPort?: string
  }) => {
    if (!currentPort) return
    setPortDot(currentCell, currentPort, true, COLOR_PORT_BLUE)
  },
)

graph.on('edge:added', ({ edge }: { edge: Edge }) => {
  withNodePort(edge.getSourceCellId(), edge.getSourcePortId(), (node, port) =>
    setPortDot(node, port, true, COLOR_PORT_BLUE),
  )
  withNodePort(edge.getTargetCellId(), edge.getTargetPortId(), (node, port) =>
    setPortDot(node, port, true, COLOR_PORT_BLUE),
  )
})

graph.on('edge:removed', ({ edge }: { edge: Edge }) => {
  withNodePort(edge.getSourceCellId(), edge.getSourcePortId(), (node, port) => {
    const stillConnected = isPortConnected(node, port)
    if (!stillConnected) setPortDot(node, port, false, COLOR_PORT_GRAY)
  })
  withNodePort(edge.getTargetCellId(), edge.getTargetPortId(), (node, port) => {
    const stillConnected = isPortConnected(node, port)
    if (!stillConnected) setPortDot(node, port, false, COLOR_PORT_GRAY)
  })
})

type AgentCardConfig = {
  key: string
  iconText: string
  title: string
  desc: string
  theme?: 'blue' | 'green' | 'orange' | 'red'
  inputPlaceholder?: string
}

const AgentReactCard = ({ node }: { node: Node }) => {
  const raw = node.getData() as AgentCardConfig | null | undefined
  const data: AgentCardConfig = {
    key: raw?.key ?? 'unknown',
    iconText: raw?.iconText ?? '',
    title: raw?.title ?? '',
    desc: raw?.desc ?? '',
    theme: raw?.theme ?? 'blue',
    inputPlaceholder: raw?.inputPlaceholder,
  }
  const theme = data.theme ?? 'blue'
  return React.createElement('div', { className: `agent-card ${theme}` }, [
    React.createElement('div', { className: 'header', key: 'header' }, [
      React.createElement(
        'div',
        { className: 'icon', key: 'icon' },
        data.iconText,
      ),
      React.createElement(
        'div',
        { className: 'title', key: 'title' },
        data.title,
      ),
      React.createElement('div', { className: 'actions', key: 'actions' }, [
        React.createElement(
          'span',
          {
            className: 'op',
            key: 'delete',
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation()
              const cfg = (node.getData() as AgentCardConfig | null) || null
              const k = cfg?.key
              if (k === 'start' || k === 'end') return
              node.remove()
            },
            title: '删除节点',
          },
          '✖️',
        ),
      ]),
    ]),

    data.inputPlaceholder
      ? React.createElement('div', { className: 'body', key: 'body' }, [
          React.createElement(
            'span',
            { className: 'section', key: 'sec' },
            '节点内容',
          ),
          React.createElement('input', {
            type: 'text',
            placeholder: data.inputPlaceholder,
          }),
        ])
      : React.createElement(
          'div',
          { className: 'desc', key: 'desc' },
          data.desc,
        ),
  ])
}

register({
  shape: 'agent-react-card',
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  effect: ['data'],
  component: AgentReactCard,
})

const createAgentCard = (cfg: AgentCardConfig) =>
  graph.createNode({
    shape: 'agent-react-card',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    data: cfg,
    ports,
  })

type FlowData = {
  title: string
  badge?: string
}

const FlowCard = ({ node }: { node: Node }) => {
  const data = node.getData() as FlowData
  const shape = node.shape
  const type = shape === 'agent-end-card' ? 'end' : 'start'
  return React.createElement('div', { className: `flow-card ${type}` }, [
    React.createElement('div', { className: 'header', key: 'h' }, [
      React.createElement(
        'div',
        { className: 'icon', key: 'i' },
        type === 'end' ? 'E' : 'S',
      ),
      React.createElement('div', { className: 'title', key: 't' }, data.title),
      data.badge
        ? React.createElement(
            'div',
            { className: 'badge', key: 'b' },
            data.badge,
          )
        : null,
    ]),
    type === 'start'
      ? React.createElement('div', { className: 'body', key: 'body' }, [
          React.createElement(
            'span',
            { className: 'section', key: 's' },
            'Agent 开始节点',
          ),
        ])
      : React.createElement('div', { className: 'footer', key: 'f' }, [
          React.createElement(
            'span',
            { className: 'section', key: 's2' },
            'Agent 结束节点',
          ),
        ]),
  ])
}

const registerFlowShape = (shape: string) => {
  register({
    shape,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    effect: ['data'],
    component: FlowCard,
  })
}

registerFlowShape('agent-start-card')
registerFlowShape('agent-end-card')

const createFlowCard = (kind: 'start' | 'end', data: FlowData) =>
  graph.createNode({
    shape: kind === 'start' ? 'agent-start-card' : 'agent-end-card',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    data,
    ports,
  })

const createStartCard = () =>
  createFlowCard('start', {
    title: '开始',
    badge: '触发器',
  })

const createEndCard = () =>
  createFlowCard('end', {
    title: '结束',
    badge: '输出器',
  })

Graph.registerNode(
  'agent-stencil-card',
  {
    inherit: 'rect',
    width: 220,
    height: 66,
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'rect', selector: 'iconRect' },
      { tagName: 'text', selector: 'iconLabel' },
      { tagName: 'text', selector: 'title' },
      { tagName: 'text', selector: 'desc' },
    ],
    attrs: {
      body: { stroke: '#5F95FF', strokeWidth: 1, fill: '#fff', rx: 8, ry: 8 },
      iconRect: {
        width: 32,
        height: 32,
        rx: 8,
        ry: 8,
        refX: 12,
        refY: 20,
        fill: '#F0F5FF',
      },
      iconLabel: {
        refX: 28,
        refY: 36,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fontSize: 12,
        fontWeight: 600,
        fill: '#1D39C4',
      },
      title: {
        refX: 60,
        refY: 26,
        textAnchor: 'start',
        textVerticalAnchor: 'middle',
        fontSize: 14,
        fontWeight: 600,
        fill: '#141414',
        textWrap: { width: 170, height: 20, ellipsis: '…' },
      },
      desc: {
        refX: 60,
        refY: 46,
        textAnchor: 'start',
        textVerticalAnchor: 'middle',
        fontSize: 12,
        fill: 'rgba(0,0,0,0.65)',
        textWrap: { width: 170, height: 32, ellipsis: '…' },
      },
    },
    ports,
  },
  true,
)

const createAgentStencilCard = (cfg: AgentCardConfig) => {
  const themeMap = {
    blue: { rectFill: '#F0F5FF', textFill: '#1D39C4' },
    green: { rectFill: '#E6FFFB', textFill: '#08979C' },
    orange: { rectFill: '#FFF7E6', textFill: '#FA8C16' },
    red: { rectFill: '#FFF1F0', textFill: '#CF1322' },
  } as const
  const theme = cfg.theme ?? 'blue'
  const colors = themeMap[theme]
  return graph.createNode({
    shape: 'agent-stencil-card',
    attrs: {
      iconRect: { fill: colors.rectFill },
      iconLabel: { text: cfg.iconText, fill: colors.textFill },
      title: { text: cfg.title },
      desc: { text: cfg.desc },
    },
    data: { type: cfg.key },
    ports,
  })
}

let AGENT_CONFIGS: Record<string, AgentCardConfig> | null = null

const getAgentConfig = (type: string): AgentCardConfig | null => {
  return AGENT_CONFIGS ? (AGENT_CONFIGS[type] ?? null) : null
}

graph.on('node:added', ({ node }: { node: Node }) => {
  const data = node.getData() as { type?: string } | undefined
  const type = data?.type
  if (type && node.shape !== 'agent-react-card') {
    const cfg = getAgentConfig(type)
    if (cfg) {
      const { x, y } = node.position()
      const newNode = createAgentCard(cfg).position(x, y)
      node.remove()
      graph.addNode(newNode)
    }
  }
})
;(async () => {
  AGENT_CONFIGS = await fetch('/data/agent-flow.json').then((res) => res.json())

  stencil.load(
    [
      createAgentStencilCard(getAgentConfig('llm')!),
      createAgentStencilCard(getAgentConfig('code')!),
      createAgentStencilCard(getAgentConfig('branch')!),
      createAgentStencilCard(getAgentConfig('loop')!),
    ],
    'biz',
  )

  stencil.load(
    [
      createAgentStencilCard(getAgentConfig('kb')!),
      createAgentStencilCard(getAgentConfig('mcp')!),
      createAgentStencilCard(getAgentConfig('db')!),
    ],
    'data',
  )

  const start = graph.addNode(createStartCard().position(60, 60))

  const llm = graph.addNode(
    createAgentCard(getAgentConfig('llm')!).position(220, 220),
  )

  const end = graph.addNode(createEndCard().position(360, 380))

  graph.addEdge({
    shape: 'agent-edge',
    source: { cell: start.id, port: 'bottom' },
    target: { cell: llm.id, port: 'top' },
  })
  graph.addEdge({
    shape: 'agent-edge',
    source: { cell: llm.id, port: 'bottom' },
    target: { cell: end.id, port: 'top' },
  })
})().catch((err) => {
  console.error(err)
})

function preWork() {
  const container = document.getElementById('container') as HTMLElement
  if (!container) {
    return
  }
  const stencilContainer = document.createElement('div')
  stencilContainer.id = 'stencil'
  const graphContainer = document.createElement('div')
  graphContainer.id = 'graph-container'
  container.appendChild(stencilContainer)
  container.appendChild(graphContainer)

  insertCss(`
    #container {
      display: flex;
      border: 1px solid #dfe3e8;
      height: 480px;
    }
    #stencil {
      width: 260px;
      height: 100%;
      position: relative;
      border-right: 1px solid #dfe3e8;
      background: #fff;
    }
    #graph-container {
      width: calc(100% - 260px);
      height: 100%;
      background: #fff;
    }
    .x6-widget-stencil  { background-color: #fff; }
    .x6-widget-stencil-title { background-color: #fff; }
    .x6-widget-stencil-group-title { background-color: #fff !important; }

    /* agent card */
    .agent-card {
      display: flex;
      flex-direction: column;
      border: 1px solid #5F95FF;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 12px;
      width: 260px;
      height: 96px;
      background: #fff;
      gap: 8px;
    }

    .agent-card .header { display: flex; align-items: center; gap: 12px; }
    .agent-card .icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: #F0F5FF; color: #1D39C4; display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; font-family: Inter, PingFang SC, Arial;
    }
    .agent-card.green .icon { background: #E6FFFB; color: #08979C; }
    .agent-card.orange .icon { background: #FFF7E6; color: #FA8C16; }
    .agent-card.red .icon { background: #FFF1F0; color: #CF1322; }

    .agent-card .title { font-size: 16px; color: #141414; font-weight: 600; line-height: 20px; }
    .agent-card .desc { font-size: 13px; color: rgba(0,0,0,0.65); line-height: 18px; }
    .agent-card .body { display: flex; align-items: center; gap: 8px; }
    .agent-card .section { font-size: 12px; color: #8c8c8c; flex: 0 0 auto; white-space: nowrap; min-width: max-content; }
    .agent-card .body input {
      flex: 1; min-width: 0; height: 30px; border: 1px solid #5F95FF; border-radius: 6px; padding: 4px 8px; background: #FAFAFA; color: #141414;
    }
    .agent-card .actions { margin-left: auto; color: #8c8c8c; display: flex; gap: 8px; }
    .agent-card .actions .op { font-size: 14px; cursor: pointer; }

    /* start/end flow cards */
    .flow-card { display: flex; flex-direction: column; border: 1px solid #5F95FF; border-radius: 12px; background: #fff; width: 260px; height: 96px; box-sizing: border-box; padding: 12px; gap: 8px; }
    .flow-card .header { display: flex; align-items: center; gap: 12px; }
    .flow-card .icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
    .flow-card.start .icon { background: #EEF2FF; color: #5F95FF; }
    .flow-card.end .icon { background: #FFF1F0; color: #FF7875; }
    .flow-card .title { font-size: 16px; color: #141414; font-weight: 600; }
    .flow-card .badge { margin-left: auto; font-size: 12px; color: #8c8c8c; background: #F5F5F5; border-radius: 8px; padding: 2px 8px; }
    .flow-card .body { display: flex; align-items: center; gap: 8px; }
    .flow-card .section { font-size: 12px; color: #8c8c8c; }
    .flow-card .chips { display: flex; align-items: center; gap: 6px; flex: 1; flex-wrap: wrap; }
    .flow-card .chip { font-size: 12px; color: #595959; background: #FAFAFA; border: 1px solid #5F95FF; border-radius: 6px; padding: 2px 8px; }
    .flow-card .actions { margin-left: auto; color: #8c8c8c; }
    .flow-card .footer { display: flex; align-items: center; gap: 8px; }
  `)
}
