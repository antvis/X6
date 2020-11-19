import React, { useRef } from 'react'
import classname from 'classnames'
import { Popover, Tag, Tooltip } from 'antd'
import { DatabaseFilled, ProfileTwoTone } from '@ant-design/icons'
import marked from 'marked'
import { ConnectDragPreview, ConnectDragSource, DragSource } from 'react-dnd'
import { ItemName } from '@/component/item-name'
import { unescape } from '@/common/utils'
import { useSafeSetHTML } from '@/pages/common/hooks/useSafeSetHtml'
import { DRAGGABLE_ALGO_COMPONENT } from '@/constants/graph'
import styles from './component-item.less'

marked.setOptions({
  gfm: true,
  breaks: true,
})

const Markdown2html: React.FC<{ description: string; tag: string }> = (
  props,
) => {
  const { description, tag } = props
  const descriptionElementRef = useRef<HTMLDivElement>(null)

  useSafeSetHTML(
    descriptionElementRef,
    marked(unescape(description).replace(/\\n/gi, ' \n ')),
  )

  return (
    <div className={styles.componentDescription}>
      <div ref={descriptionElementRef} key="1" />
      {tag ? (
        <div className={styles.tag} key="2">
          <span className={styles.label}> 标签: </span>
          {tag.split(',').map((str, idx) => (
            <Tag key={str + idx}>{str}</Tag>
          ))}
        </div>
      ) : null}
    </div>
  )
}

const renderSearchInfo = (params: {
  id: number | string
  name: string
  catName: string
  description: string
  tag: string
}) => {
  const { id, name, catName, description = '暂无数据', tag } = params

  return (
    <>
      {catName && (
        <span className={`${styles.catLable} gray `} key="catName">
          {catName}
        </span>
      )}

      <span className={styles.link} key="link">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://pai.alipay.com/component/detail/${id}`}
        >
          <Tooltip title="查看文档">
            <ProfileTwoTone />
          </Tooltip>
        </a>
      </span>

      {description && (
        <Popover
          title={name}
          placement="right"
          content={<Markdown2html description={description} tag={tag} />}
          key="description"
        >
          <div
            className={classname(styles.description, 'gray', 'text-overflow')}
          >
            {description}
          </div>
        </Popover>
      )}
    </>
  )
}

// ! 这里没有理解怎么会走到渲染这个链路上，因此代码先保留，后续可以再删掉或者使用
const renderStatus = (params: {
  changeType: string
  isDeprecated: boolean
  changeMessage: string
}) => {
  const { changeType, isDeprecated, changeMessage } = params
  const renderItems = []
  if (changeType) {
    renderItems.push(
      <Popover
        content={<p className={styles.statusTips}>{changeMessage}</p>}
        key="changeType"
      >
        <span className={classname(styles.itemLable, styles.gre)}>
          {changeType.toLowerCase()}
        </span>
      </Popover>,
    )
  }

  if (isDeprecated) {
    renderItems.push(
      <span className={classname(styles.itemLable, 'gray')} key="status">
        已废弃
      </span>,
    )
  }

  return renderItems
}

interface Node {
  keyword: string
  algoSourceType: number
  name: string
  id: number
  catName: string
  description: string
  tag: string
  changeType: string
  isDeprecated: boolean
  changeMessage: string
}

interface NodeTitleProps {
  data: Node
  connectDragSource: ConnectDragSource
  connectDragPreview: ConnectDragPreview
}

const InnerNodeTitle: React.FC<NodeTitleProps> = (props) => {
  const { data, connectDragPreview, connectDragSource } = props
  const { keyword, algoSourceType, name } = data
  return (
    <div>
      {connectDragPreview(
        connectDragSource(
          <span
            className={classname(styles.nodeItem, {
              [styles.orange]: algoSourceType === 2,
            })}
          >
            <DatabaseFilled className={styles.nodeIcon} />
            <ItemName data={{ name, keyword }} />
          </span>,
        ),
      )}
      {keyword ? renderSearchInfo(data) : renderStatus(data)}
    </div>
  )
}

const NodeTitle = DragSource(
  DRAGGABLE_ALGO_COMPONENT,
  {
    beginDrag: (props: NodeTitleProps) => ({
      component: props.data,
    }),
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(InnerNodeTitle)

interface Props {
  data: any
}

export const ComponentItem: React.FC<Props> = ({ data = {} }) => {
  return <div className={styles.itemBlock}>{<NodeTitle data={data} />}</div>
}
