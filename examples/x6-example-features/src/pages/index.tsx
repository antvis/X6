import React from 'react'
import { Table } from 'antd'
import './index.less'

const dataSource = [
  {
    example: 'graph',
    description: '画布',
  },
  {
    example: 'position',
    description: '画布位置',
  },
  {
    example: 'edge',
    description: '连线',
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
    example: 'group',
    description: '群组',
  },
  {
    example: 'embed/dnd',
    description: '嵌入',
  },
  {
    example: 'animation/transition',
    description: '动画',
  },
  {
    example: 'auto-resize',
    description: '画布大小自适应',
  },
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
    example: 'snapline',
    description: '对齐线',
  },
  {
    example: 'clipboard',
    description: '剪切板',
  },
  {
    example: 'connector/offset-rounded',
    description: '带偏移的圆角连接器',
  },
  {
    example: 'connector/xmind-curve',
    description: '脑图连接器',
  },
  {
    example: 'dnd',
    description: 'Dnd',
  },
].map((item, index) => ({ key: index, ...item }))

const columns = [
  {
    title: 'example',
    dataIndex: 'example',
    render(text: string) {
      return (
        <a href={`./${text}`} target="_blank">
          {text}
        </a>
      )
    },
  },
  {
    title: 'description',
    dataIndex: 'description',
  },
]

export default function () {
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
