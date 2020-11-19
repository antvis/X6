import React, { useCallback, useState, useRef } from 'react'
import { toLower, unescape } from 'lodash-es'
import { Popover, Tag } from 'antd'
import { DragSource, ConnectDragPreview, ConnectDragSource } from 'react-dnd'
import { DatabaseFilled, ReadOutlined } from '@ant-design/icons'
import marked from 'marked'
import { useSafeSetHTML } from '@/pages/common/hooks/useSafeSetHtml'
import { DRAGGABLE_ALGO_COMPONENT } from '@/constants/graph'
import styles from './node-title.less'

marked.setOptions({
  gfm: true,
  breaks: true,
})

const Document = (props: { node: any }) => {
  const { node } = props
  const descriptionNodeRef = useRef<HTMLDivElement>(null)
  const { description, id, tag = '' } = node

  const htmlStr = marked(
    unescape(description || '暂无文档').replace(/\\n/gi, ' \n '),
  )
  useSafeSetHTML(descriptionNodeRef, htmlStr)

  return (
    <div className={styles.popover}>
      {tag ? (
        <div className={styles.tag}>
          <span className={styles.label}> 标签: </span>
          {tag.split(',').map((str: string) => (
            <Tag key={str}>{str}</Tag>
          ))}
        </div>
      ) : null}
      <div className={styles.description}>
        <div ref={descriptionNodeRef} />
        <div className={styles.doclink}>
          <a href={`#/${id}`} target="_blank" rel="noopener noreferrer">
            查看更多
          </a>
        </div>
      </div>
    </div>
  )
}

interface Props {
  node: any
  searchKey: string
  isDragging: boolean
  connectDragSource: ConnectDragSource
  connectDragPreview: ConnectDragPreview
}

const InnerNodeTitle = (props: Props) => {
  const {
    node = {},
    searchKey = '',
    connectDragPreview,
    connectDragSource,
  } = props
  const { name = '', isDir } = node
  const [visible, setVisible] = useState<boolean>(false)
  const onMouseIn = useCallback(() => {
    setVisible(true)
  }, [])
  const onMouseOut = useCallback(() => {
    setVisible(false)
  }, [])

  // 文件夹
  if (isDir) {
    return <div className={styles.folder}>{name}</div>
  }

  const keywordIdx = searchKey ? toLower(name).indexOf(toLower(searchKey)) : -1

  // 搜索高亮
  if (keywordIdx > -1) {
    const beforeStr = name.substr(0, keywordIdx)
    const afterStr = name.substr(keywordIdx + searchKey.length)

    return connectDragPreview(
      connectDragSource(
        <span className={styles.node}>
          <DatabaseFilled className={styles.nodeIcon} />
          <span className={styles.label}>
            {beforeStr}
            <span className={styles.keyword}>{searchKey}</span>
            {afterStr}
          </span>
        </span>,
      ),
    )
  }

  return (
    <div
      className={styles.nodeTitleWrapper}
      onMouseEnter={onMouseIn}
      onMouseLeave={onMouseOut}
    >
      {connectDragPreview(
        connectDragSource(
          <div className={styles.node}>
            <DatabaseFilled className={styles.nodeIcon} />
            <span className={styles.label}>{name}</span>
          </div>,
        ),
      )}
      {visible && (
        <Popover
          visible={true}
          title={name}
          placement="right"
          content={<Document node={node} />}
          key="description"
        >
          <a className={styles.doc}>
            <ReadOutlined /> 文档
          </a>
        </Popover>
      )}
    </div>
  )
}

export const NodeTitle = DragSource(
  DRAGGABLE_ALGO_COMPONENT,
  {
    beginDrag: (props: Props) => ({
      component: props.node,
    }),
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(InnerNodeTitle)
