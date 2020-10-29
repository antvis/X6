import React from 'react'
import { Popover } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash-es'
import css from './index.less'

interface TooltipProps {
  children: React.ReactElement
  status: StatusObj
}

interface StatusObj {
  name: string
  defName: string
  jobStatus: string
  startTime: string
  endTime: string
}

export const NodePopover = ({ children, status }: TooltipProps) => {
  const componentNode = (
    <div style={{ width: '100%', height: '100%' }}>{children}</div>
  )
  if (isEmpty(status)) {
    return componentNode
  }
  return (
    <Popover
      placement="bottomLeft"
      content={<PopoverContent status={status} />}
      overlayClassName={css.content}
    >
      {componentNode}
    </Popover>
  )
}

const nodeAtts: StatusObj = {
  name: '节点名称',
  defName: '算法名称',
  jobStatus: '运行状态',
  startTime: '开始时间',
  endTime: '结束时间',
}

const PopoverContent = ({ status }: { status: StatusObj }) => (
  <ul className={css.list}>
    {!status.name && <LoadingOutlined />}
    {Object.entries(nodeAtts).map(([key, text]) => {
      const value = status[key as keyof StatusObj]
      if (value) {
        return (
          <li key={key} className={css.item}>
            <span className={css.label}>{text}</span>
            <span className={css.text}>{value}</span>
          </li>
        )
      }
      return null
    })}
  </ul>
)
