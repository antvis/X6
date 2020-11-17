import React, { useCallback, useRef } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { useClickAway } from 'ahooks'
import { Menu } from '@antv/x6-react-components'
import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { graphPointToOffsetPoint } from '@/pages/common//utils/graph'
import styles from './index.less'

interface Props {
  experimentId: string
  data: any
}

export const EdgeContextMenu: React.FC<Props> = (props) => {
  const { experimentId, data } = props
  const containerRef = useRef<HTMLDivElement>(null as any)
  const expGraph = useExperimentGraph(experimentId)

  useClickAway(() => {
    expGraph.clearContextMenuInfo()
  }, containerRef)

  const onDeleteEdge = useCallback(() => {
    expGraph.deleteEdgeFromContextMenu(data.edge)
  }, [expGraph, data])

  const { x: left, y: top } = graphPointToOffsetPoint(
    expGraph.graph!,
    data,
    expGraph.wrapper!,
  )

  return (
    <div
      ref={containerRef}
      className={styles.edgeContextMenu}
      style={{ top, left }}
    >
      <Menu hasIcon={true}>
        <Menu.Item
          onClick={onDeleteEdge}
          icon={<DeleteOutlined />}
          text="删除"
        />
      </Menu>
    </div>
  )
}
