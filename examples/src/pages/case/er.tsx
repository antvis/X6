import { Graph, Shape, Edge } from '@antv/x6'
import React, { useEffect, useRef } from 'react'
import './er.less'
import './tableNode'

interface Table {
  id?: string
  name: string
  fields: {
    name: string
    type: string
    isPrimary?: boolean
    isForeign?: boolean
    isUnique?: boolean
  }[]
  foreignKeys?: {
    field: string
    referencedTable: string
    referencedField: string
    isUnique?: boolean
  }[]
}

interface ErDiagramProps {
  tables: Table[]
}

type RelationshipType = '1:1' | '1:N' | 'N:N'

// 配置常量
const CONFIG = {
  nodeWidth: 240,
  baseSpacing: 120,
  minSpacing: 60,
  headerHeight: 40,
  fieldHeight: 25,
  bottomPadding: 16,
}

// 创建图实例
const createErGraph = (container: HTMLElement) =>
  new Graph({
    container,
    background: { color: '#f8f9fa' },
    width: container.clientWidth || 800,
    height: container.clientHeight || 600,
    autoResize: true,
    interacting: {
      nodeMovable: true,
      edgeMovable: true,
      edgeLabelMovable: false,
    },
    grid: { visible: true, type: 'dot', args: { color: '#ddd', thickness: 1 } },
    mousewheel: {
      enabled: true,
      zoomAtMousePosition: true,
      modifiers: 'ctrl',
      minScale: 0.5,
      maxScale: 1.5,
    },
    connecting: {
      snap: true,
      allowBlank: false,
      allowLoop: false,
      highlight: true,
      connectionPoint: 'anchor',
      router: { name: 'manhattan', args: { step: 10 } },
      connector: { name: 'rounded', args: { radius: 8 } },
      createEdge: () =>
        new Shape.Edge({
          attrs: {
            line: {
              stroke: '#999',
              strokeWidth: 2,
              targetMarker: { name: 'block', width: 12, height: 8 },
            },
          },
          labels: [
            {
              attrs: {
                text: {
                  text: '1:1',
                  fill: '#999',
                  fontSize: 14,
                  fontWeight: 'bold',
                },
                rect: {
                  fill: 'white',
                  stroke: '#999',
                  strokeWidth: 1,
                  rx: 3,
                  ry: 3,
                },
              },
              position: 0.5,
              draggable: false,
            },
          ],
          data: { relationshipType: '1:1' as RelationshipType },
        }),
    },
  })

// 计算节点高度
const calculateNodeHeight = (fields: Table['fields']) =>
  CONFIG.headerHeight +
  fields.length * CONFIG.fieldHeight +
  CONFIG.bottomPadding

// 创建节点配置
const createNode = (table: Table, x: number, y: number) => ({
  id: table.name,
  shape: 'er-table',
  x,
  y,
  width: CONFIG.nodeWidth,
  height: calculateNodeHeight(table.fields || []),
  data: { tableName: table.name, fields: table.fields },
  attrs: {
    body: { stroke: '#1890ff', strokeWidth: 2, fill: '#fff', rx: 4, ry: 4 },
  },
  ports: {
    groups: {
      top: {
        position: { name: 'top' },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            fill: '#fff',
            style: { visibility: 'hidden' },
          },
        },
      },
      bottom: {
        position: { name: 'bottom' },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            fill: '#fff',
            style: { visibility: 'hidden' },
          },
        },
      },
      left: {
        position: { name: 'left' },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            fill: '#fff',
            style: { visibility: 'hidden' },
          },
        },
      },
      right: {
        position: { name: 'right' },
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#5F95FF',
            fill: '#fff',
            style: { visibility: 'hidden' },
          },
        },
      },
    },
    items: [
      { id: 'top', group: 'top' },
      { id: 'bottom', group: 'bottom' },
      { id: 'left', group: 'left' },
      { id: 'right', group: 'right' },
    ],
  },
})

// 创建边配置
const createEdge = (source: string, target: string) => ({
  id: `${source}-${target}`,
  source: { cell: source, port: 'right' },
  target: { cell: target, port: 'left' },
  attrs: {
    line: {
      stroke: '#999',
      strokeWidth: 2,
      targetMarker: { name: 'block', width: 8, height: 6, fill: '#999' },
    },
  },
  labels: [
    {
      attrs: {
        text: { text: '1:1', fill: '#999', fontSize: 14, fontWeight: 'bold' },
        rect: { fill: 'white', stroke: '#999', strokeWidth: 1, rx: 3, ry: 3 },
      },
      position: 0.5,
      draggable: false,
    },
  ],
  data: { relationshipType: '1:1' as RelationshipType },
  router: { name: 'manhattan' },
  connector: { name: 'rounded' },
})

// 布局表格
const layoutTables = (tables: Table[]) => {
  const nodes: any[] = []
  const edges: any[] = []
  const nodeData = tables.map((table) => ({
    id: table.name,
    width: CONFIG.nodeWidth,
    height: calculateNodeHeight(table.fields || []),
    table,
  }))

  const cols = 2
  const colWidth = CONFIG.nodeWidth + CONFIG.baseSpacing
  const rowHeight = 300 // 可以根据节点最大高度动态计算
  nodeData.forEach((data, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    const x = col * colWidth
    const y = row * rowHeight
    nodes.push(createNode(data.table, x, y))
  })

  tables.forEach((table) => {
    table.foreignKeys?.forEach((fk) => {
      if (fk.field && fk.referencedTable && table.name !== fk.referencedTable) {
        edges.push(createEdge(table.name, fk.referencedTable))
      }
    })
  })

  return { nodes, edges }
}

export const ErDiagram: React.FC<ErDiagramProps> = ({ tables }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  const toggleType = (edge: Edge) => {
    const types: RelationshipType[] = ['1:1', '1:N', 'N:N']
    const current = edge.getData()?.relationshipType || '1:1'
    const next = types[(types.indexOf(current) + 1) % types.length]

    edge.setData({ relationshipType: next })
    edge.setLabels([
      {
        attrs: {
          text: { text: next, fill: '#999', fontSize: 14, fontWeight: 'bold' },
          rect: { fill: 'white', stroke: '#999', strokeWidth: 1, rx: 3, ry: 3 },
        },
        position: 0.5,
      },
    ])
  }

  useEffect(() => {
    if (!containerRef.current) return

    const graph = createErGraph(containerRef.current)
    graphRef.current = graph

    graph.on('edge:click', ({ edge }) => {
      toggleType(edge)
    })
    graph.on('edge:mouseenter', ({ edge }) => {
      edge.addTools([
        { name: 'target-arrowhead', args: { attrs: { fill: '#999' } } },
        {
          name: 'button-remove',
          args: {
            distance: -40,
            offset: 0,
            attrs: { 'font-size': 12, fill: 'red' },
          },
        },
      ])
    })

    graph.on('edge:mouseleave', ({ edge }) => edge.removeTools())

    return () => {
      if (graphRef.current) {
        graphRef.current.dispose()
        graphRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!graphRef.current) return

    const validTables = tables.filter((t) => t?.name && Array.isArray(t.fields))
    if (!validTables.length) return

    const { nodes, edges } = layoutTables(validTables)
    graphRef.current.addNodes(nodes)
    graphRef.current.addEdges(edges)
    graphRef.current.centerContent()

    requestAnimationFrame(() => {
      if (graphRef.current) {
        graphRef.current.zoomToFit({ padding: 20 })
      }
    })
  }, [tables])

  return (
    <div className="relative" style={{ height: '600px' }}>
      <div style={{ paddingBottom: 10, textAlign: 'center' }}>
        <div>操作提示</div>
        <div>点击边的标签切换关系类型</div>
        <div>循环：1:1 → 1:N → N:N</div>
      </div>
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ background: '#f8f9fa' }}
      />
    </div>
  )
}

const data = [
  {
    id: 'profiles',
    name: 'profiles',
    fields: [
      { name: 'id', type: 'bigint', isPrimary: true },
      { name: 'user_id', type: 'bigint', isForeign: true },
      { name: 'first_name', type: 'varchar(50)' },
      { name: 'last_name', type: 'varchar(50)' },
      { name: 'avatar_url', type: 'varchar(255)' },
      { name: 'bio', type: 'text' },
      { name: 'birth_date', type: 'date' },
      { name: 'phone', type: 'varchar(20)' },
    ],
    foreignKeys: [
      {
        field: 'user_id',
        referencedTable: 'users',
        referencedField: 'id',
        isUnique: true,
      },
    ],
  },
  {
    id: 'users',
    name: 'users',
    fields: [
      { name: 'id', type: 'bigint', isPrimary: true },
      { name: 'username', type: 'varchar(50)', isUnique: true },
      { name: 'email', type: 'varchar(100)', isUnique: true },
      { name: 'password_hash', type: 'varchar(255)' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
      { name: 'status', type: 'tinyint' },
    ],
    foreignKeys: [],
  },
  {
    id: 'posts',
    name: 'posts',
    fields: [
      { name: 'id', type: 'bigint', isPrimary: true },
      { name: 'user_id', type: 'bigint', isForeign: true },
      { name: 'title', type: 'varchar(200)' },
      { name: 'content', type: 'text' },
      { name: 'status', type: 'varchar(20)' },
      { name: 'created_at', type: 'timestamp' },
      { name: 'updated_at', type: 'timestamp' },
      { name: 'published_at', type: 'timestamp' },
    ],
    foreignKeys: [
      { field: 'user_id', referencedTable: 'users', referencedField: 'id' },
    ],
  },
  {
    id: 'categories',
    name: 'categories',
    fields: [
      { name: 'id', type: 'bigint', isPrimary: true },
      { name: 'name', type: 'varchar(100)', isUnique: true },
      { name: 'slug', type: 'varchar(100)', isUnique: true },
      { name: 'description', type: 'text' },
      { name: 'parent_id', type: 'bigint', isForeign: true },
      { name: 'created_at', type: 'timestamp' },
    ],
    foreignKeys: [],
  },
]
export const CaseErExample = () => (
  <div className="x6-graph-wrap">
    <ErDiagram tables={data} />
  </div>
)
