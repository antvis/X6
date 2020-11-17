import React, { useRef } from 'react'
import { ReloadOutlined } from '@ant-design/icons'
import { useClickAway } from 'ahooks'
import { Menu } from '@antv/x6-react-components'
import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { graphPointToOffsetPoint } from '@/pages/common//utils/graph'
import styles from './index.less'

interface Props {
  experimentId: string
  data: any
}

export const GraphContextMenu: React.FC<Props> = (props) => {
  const { experimentId, data } = props
  const containerRef = useRef<HTMLDivElement>(null as any)
  const expGraph = useExperimentGraph(experimentId)

  useClickAway(() => {
    expGraph.clearContextMenuInfo()
  }, containerRef)

  const { x: left, y: top } = graphPointToOffsetPoint(
    expGraph.graph!,
    data,
    expGraph.wrapper!,
  )

  return (
    <div
      ref={containerRef}
      className={styles.graphContextMenu}
      style={{ top, left }}
    >
      <Menu hasIcon={true}>
        <Menu.Item disabled={true} icon={<ReloadOutlined />} text="刷新" />
      </Menu>
    </div>
  )
}
