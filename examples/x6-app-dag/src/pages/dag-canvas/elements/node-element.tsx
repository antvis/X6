import React from 'react'
import { Node } from '@antv/x6'
import classNames from 'classnames'
import { ConfigProvider } from 'antd'
import { filter, map } from 'rxjs/operators'
import { DatabaseFilled } from '@ant-design/icons'
import { useObservableState } from '@/common/hooks/useObservableState'
import { ANT_PREFIX } from '@/constants/global'
import { NExecutionStatus } from '@/pages/rx-models/typing'
import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { NodeStatus } from '@/pages/common/graph-common/node-status'
import { NodePopover } from '../../common/graph-common/node-popover'
import styles from './node-element.less'

interface Props {
  experimentId: string
  node?: Node
}

export const NodeElement: React.FC<Props> = (props) => {
  const { experimentId, node } = props
  const experimentGraph = useExperimentGraph(experimentId)
  const [instanceStatus] = useObservableState(
    () =>
      experimentGraph.executionStatus$.pipe(
        filter((x) => !!x),
        map((x) => x.execInfo),
      ),
    {} as NExecutionStatus.ExecutionStatus['execInfo'],
  )
  const data: any = node?.getData() || {}
  const { name, id, selected } = data
  const nodeStatus = instanceStatus[id] || {}

  return (
    <ConfigProvider prefixCls={ANT_PREFIX}>
      <NodePopover status={nodeStatus}>
        <div
          className={classNames(styles.nodeElement, {
            [styles.selected]: !!selected,
          })}
        >
          <div className={styles.icon}>
            <DatabaseFilled style={{ color: '#1890ff' }} />
          </div>
          <div className={styles.notation}>
            <div className={styles.name}>{name}</div>
            {nodeStatus.jobStatus && (
              <NodeStatus
                className={styles.statusIcon}
                status={nodeStatus.jobStatus as any}
              />
            )}
          </div>
        </div>
      </NodePopover>
    </ConfigProvider>
  )
}
