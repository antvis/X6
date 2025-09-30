import { Link } from 'react-router-dom'
import { Table } from 'antd'
import './index.less'

const dataSource = [
  // ========= graph =========
  {
    example: 'graph',
    description: '画布',
  },
  {
    example: 'position/position',
    description: '画布定位',
  },
  {
    example: 'position/coord',
    description: '坐标系',
  },
  {
    example: 'auto-resize',
    description: '画布大小自适应',
  },
  // ========= node =========
  {
    example: 'html',
    description: 'HTML 节点',
  },
  {
    example: 'shape/custom-node',
    description: '自定义节点',
  },
  {
    example: 'group',
    description: '群组',
  },
  {
    example: 'embed/dnd',
    description: '嵌入',
  },
  {
    example: 'react',
    description: 'React 节点',
  },
  {
    example: 'react/portal',
    description: 'Portal 使用方式',
  },
  // ========= port =========
  {
    example: 'ports/defaults',
    description: '连接桩增删',
  },
  {
    example: 'ports/connected',
    description: '定义连接桩形状',
  },
  // ========= edge =========
  {
    example: 'edge',
    description: '连线',
  },
  {
    example: 'router',
    description: 'Manhattan 路由',
  },
  {
    example: 'edge/tool/arrowhead',
    description: '箭头工具',
  },
  {
    example: 'edge/tool/button',
    description: '按钮工具',
  },
  {
    example: 'edge/custom-connector',
    description: '自定义连接器',
  },
  {
    example: 'edge/custom-router',
    description: '自定义路由',
  },
  {
    example: 'edge/native-marker',
    description: '内置箭头',
  },
  {
    example: 'edge/custom-marker',
    description: '自定义箭头',
  },
  {
    example: 'edge/edge-editor',
    description: '路径编辑器',
  },
  {
    example: 'connector/offset-rounded',
    description: '带偏移的圆角连接器',
  },
  {
    example: 'connector/xmind-curve',
    description: '脑图连接器',
  },
  // ========= tools =========
  {
    example: 'tools/clean',
    description: '常用工具',
  },
  // ========= case =========
  {
    example: 'case/bpmn',
    description: 'BPMN 图',
  },
  {
    example: 'case/class',
    description: '类图',
  },
  {
    example: 'case/dag',
    description: 'DAG 图',
  },
  {
    example: 'case/elk',
    description: 'ELK 图',
  },
  {
    example: 'case/er',
    description: 'ER 图',
  },
  {
    example: 'case/mind',
    description: '脑图',
  },
  {
    example: 'case/swimlane',
    description: '泳道图',
  },
  {
    example: 'org',
    description: '组织架构图',
  },
  // ========= plugins =========
  {
    example: 'plugins/snapline',
    description: '对齐线',
  },
  {
    example: 'plugins/clipboard',
    description: '剪切板',
  },
  {
    example: 'plugins/keyboard',
    description: '快捷键',
  },
  {
    example: 'plugins/dnd',
    description: 'Dnd',
  },
  {
    example: 'plugins/scroller',
    description: '滚动画布',
  },
  {
    example: 'plugins/selection',
    description: '框选',
  },
  {
    example: 'plugins/stencil',
    description: 'Stencil',
  },
  {
    example: 'plugins/transform',
    description: '调整节点形状',
  },
  {
    example: 'plugins/undo',
    description: '撤销重做',
  },
  {
    example: 'plugins/export',
    description: '导出',
  },
  // ========= animation ========
  {
    example: 'animation/transition',
    description: '动画',
  },
  {
    example: 'history',
    description: '时光回溯',
  },
  {
    example: 'virtual-render',
    description: '虚拟渲染',
  },
].map((item, index) => ({ key: index, ...item }))

const columns = [
  {
    title: 'example',
    dataIndex: 'example',
    render(text: string) {
      return (
        <Link to={`/${text}`} target="_blank" rel="noreferrer">
          {text}
        </Link>
      )
    },
  },
  {
    title: 'description',
    dataIndex: 'description',
  },
]

export const ExampleList = () => {
  return (
    <div className="home">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        size="small"
      />
    </div>
  )
}
