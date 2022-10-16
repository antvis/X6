import React from 'react'
import { Table } from 'antd'
import './index.less'

const dataSource = [
  {
    key: '1',
    example: 'animation/transition',
    description: 'transition 动画',
  },
  {
    key: '2',
    example: 'auto-resize',
    description: '画布大小自适应',
  },
  {
    key: '3',
    example: 'case/bpmn',
    description: 'BPMN 图',
  },
  {
    key: '4',
    example: 'case/class',
    description: '类图',
  },
  {
    key: '5',
    example: 'case/dag',
    description: 'DAG 图',
  },
  {
    key: '6',
    example: 'case/elk',
    description: 'ELK 图',
  },
  {
    key: '7',
    example: 'case/er',
    description: 'ER 图',
  },
]

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
