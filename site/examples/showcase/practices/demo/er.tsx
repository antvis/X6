import React from 'react'
import { Graph, Node, Edge } from '@antv/x6'
import insertCss from 'insert-css'
import { register } from '@antv/x6-react-shape'

// 类型定义
interface TableField {
  name: string
  type: string
  keyType?: 'primary' | 'foreign' | 'unique' | 'index'
  ref?: { table: string; field: string }
  defaultValue?: string
}

interface TableNodeData {
  id: string
  name: string
  fields: TableField[]
}

interface RelationshipData {
  type: '1:1' | '1:N' | 'N:N'
}

// 图标映射
const ICONS: Record<NonNullable<TableField['keyType']>, string> = {
  primary: '🔑',
  foreign: '🔗',
  unique: '⭐',
  index: '📌',
}

// React节点组件
const ERTableNode = React.memo(({ node }: { node: Node }) => {
  const { name, fields = [] } = node.getData<TableNodeData>()
  const height = 36 + fields.length * 24 + 12

  return (
    <div className="er-table" style={{ height }}>
      <div className="er-table-header">{name}</div>
      <div className="er-table-fields">
        {fields.length === 0 ? (
          <div className="er-table-empty">No fields</div>
        ) : (
          fields.map((field, i) => (
            <div
              key={field.name}
              className={`er-table-field ${i % 2 === 0 ? 'even' : 'odd'} ${
                field.keyType || ''
              }`}
            >
              <span className="er-field-icon">
                {field.keyType ? ICONS[field.keyType] : ''}
              </span>
              <span className="er-field-name">{field.name}</span>
              <span className="er-field-type">{field.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
})

// 注册节点
register({
  shape: 'er-table',
  width: 240,
  height: 300,
  component: ERTableNode,
  effect: ['data'],
  ports: {
    // 连接点配置
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: { r: 4, magnet: true, stroke: '#1890ff', fill: '#fff' },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: { r: 4, magnet: true, stroke: '#1890ff', fill: '#fff' },
        },
      },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: { r: 4, magnet: true, stroke: '#1890ff', fill: '#fff' },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: { r: 4, magnet: true, stroke: '#1890ff', fill: '#fff' },
        },
      },
    },
    items: [
      { id: 'top', group: 'top' },
      { id: 'right', group: 'right' },
      { id: 'bottom', group: 'bottom' },
      { id: 'left', group: 'left' },
    ],
  },
})

// 注册边
Graph.registerEdge('er-relationship', {
  inherit: 'edge',
  attrs: {
    line: {
      stroke: '#666',
      strokeWidth: 2,
      targetMarker: { name: 'classic', size: 8 },
    },
  },
  labels: [
    {
      attrs: {
        text: { text: '1:1', fill: '#666', fontSize: 12, fontWeight: 'bold' },
        rect: { fill: '#fff', stroke: '#666', rx: 3, ry: 3 },
      },
    },
  ],
})

// 图配置
const graph = new Graph({
  container: document.getElementById('container')!,
  background: { color: '#f8f9fa' },
  grid: { visible: true, type: 'dot', args: { color: '#e0e0e0' } },
  mousewheel: { enabled: true, modifiers: 'ctrl', minScale: 0.3, maxScale: 2 },
  panning: { enabled: true, eventTypes: ['leftMouseDown', 'rightMouseDown'] },
  connecting: {
    snap: true,
    allowBlank: false,
    allowLoop: false,
    allowMulti: false,
    highlight: true,
    router: { name: 'manhattan' },
    connector: { name: 'rounded', args: { radius: 8 } },
    createEdge: () =>
      graph.createEdge({
        shape: 'er-relationship',
        data: { type: '1:1' } as RelationshipData,
        labels: [{ attrs: { text: { text: '1:1' } } }],
      }),
    validateMagnet: ({ magnet }) => magnet.getAttribute('port-group') !== null,
  },
})

// 工具函数
const transformToGraphData = (tables: TableNodeData[]) => {
  const layout = { cols: 2, nodeWidth: 240, spacing: 100 }
  return tables.reduce(
    (acc, table, index) => {
      const row = Math.floor(index / layout.cols)
      const col = index % layout.cols
      const height = 36 + table.fields.length * 24 + 12

      acc.nodes.push({
        id: table.id,
        shape: 'er-table',
        x: col * (layout.nodeWidth + layout.spacing),
        y: row * (height + layout.spacing),
        width: layout.nodeWidth,
        height,
        data: table,
      })

      table.fields.forEach((field) => {
        if (field.keyType === 'foreign' && field.ref) {
          acc.edges.push({
            id: `${table.id}-${field.ref.table}-${field.name}`,
            shape: 'er-relationship',
            source: { cell: table.id, port: 'right' },
            target: { cell: field.ref.table, port: 'left' },
            data: { type: '1:N' } as RelationshipData,
            labels: [{ attrs: { text: { text: '1:N' } } }],
          })
        }
      })

      return acc
    },
    { nodes: [] as Node[], edges: [] as any[] },
  )
}

const toggleRelationshipType = (edge: Edge) => {
  const types: RelationshipData['type'][] = ['1:1', '1:N', 'N:N']
  const current = edge.getData<RelationshipData>()?.type || '1:1'
  const next = types[(types.indexOf(current) + 1) % types.length]

  edge.setData({ ...edge.getData(), type: next })
  edge.setLabels([
    {
      attrs: {
        text: { text: next, fill: '#666', fontSize: 12, fontWeight: 'bold' },
        rect: { fill: '#fff', stroke: '#666', rx: 3, ry: 3 },
      },
      position: 0.5,
    },
  ])
}

// 事件绑定
graph.on('edge:click', ({ edge, e }) => {
  if (edge.shape === 'er-relationship') {
    e.stopPropagation()
    toggleRelationshipType(edge)
  }
})

graph.on('edge:mouseenter', ({ edge }) => {
  if (edge.shape === 'er-relationship') {
    edge.attr('line/stroke', '#1890ff')
    edge.addTools([
      {
        name: 'button-remove',
        args: {
          distance: -40,
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 8,
                fill: '#ff4d4f',
                stroke: '#fff',
                strokeWidth: 2,
                cursor: 'pointer',
              },
            },
            {
              tagName: 'text',
              selector: 'icon',
              textContent: '×',
              attrs: {
                fill: '#fff',
                fontSize: 12,
                fontWeight: 'bold',
                textAnchor: 'middle',
                dominantBaseline: 'central',
              },
            },
          ],
        },
      },
    ])
  }
})

graph.on('edge:mouseleave', ({ edge }) => {
  edge.attr('line/stroke', '#666')
  edge.removeTools()
})

// 初始化
const initializeGraph = async () => {
  const response = await fetch('/data/er.json')
  const { nodes, edges } = transformToGraphData(await response.json())
  graph.addNodes(nodes)
  graph.addEdges(edges)

  graph.centerContent()
}

initializeGraph()

// 样式
insertCss(`
  .er-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    border: 2px solid #1890ff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transition: all 0.3s ease;
  }

  .er-table:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .er-table-header {
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    color: white;
    padding: 8px 12px;
    font-weight: 600;
    font-size: 13px;
    text-align: center;
    border-radius: 6px 6px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .er-table-fields { 
    flex: 1; 
    overflow: hidden;
    border-radius: 0 0 6px 6px;
  }
  .er-table-empty { padding: 20px; text-align: center; color: #999; font-style: italic; }

  .er-table-field {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    font-size: 11px;
    border-bottom: 1px solid #e8e8e8;
    transition: background-color 0.2s ease;
  }

  .er-table-field:hover { background-color: #f5f5f5; }
  .er-table-field.even { background-color: #fafafa; }
  .er-table-field:last-child { 
    border-bottom: none;
    border-radius: 0 0 6px 6px;
  }
  .er-table-field.primary { background-color: #e6f7ff; }
  .er-table-field.foreign { background-color: #fff7e6; }
  .er-table-field.unique { background-color: #f6ffed; }
  .er-table-field.index { background-color: #f9f0ff; }

  .er-field-icon { margin-right: 4px; font-size: 10px; }
  .er-field-name { flex: 1; font-weight: 500; color: #262626; }
  .er-field-type { color: #666; font-family: 'Monaco', 'Menlo', monospace; font-size: 10px; }
  .er-field-not-null { color: #ff4d4f; font-size: 9px; font-weight: bold; margin-left: 4px; }

  .x6-port-body { opacity: 0; transition: opacity 0.2s ease; }
  .x6-node:hover .x6-port-body { opacity: 1; }
  .x6-port-body circle { fill: #fff; stroke: #1890ff; stroke-width: 2; cursor: crosshair; r: 8; }
  .x6-port:hover .x6-port-body circle { fill: #e6f7ff; stroke: #40a9ff; stroke-width: 3; r: 10; }
  .x6-port-available .x6-port-body circle { fill: #f6ffed; stroke: #52c41a; stroke-width: 3; r: 10; }
  .x6-edge:hover path:nth-child(2) { stroke: #1890ff; }
`)

export default function ERDiagram() {
  return <div id="container" style={{ width: '100%', height: '100vh' }} />
}
