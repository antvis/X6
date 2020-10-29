import React from 'react'
import { Tabs } from 'antd'
import classNames from 'classnames'
import { useObservableState } from '@/common/hooks/useObservableState'
import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { ExperimentForm } from './form/experiment-config'
import { NodeFormDemo } from './form/node-config'
import css from './index.less'

interface Props {
  experimentId: string
  className?: string
}

export const ComponentConfigPanel: React.FC<Props> = (props) => {
  const { experimentId, className } = props
  const expGraph = useExperimentGraph(experimentId)
  const [activeNodeInstance] = useObservableState(
    () => expGraph.activeNodeInstance$,
  )

  const nodeId = activeNodeInstance && activeNodeInstance.id

  return (
    <div className={classNames(className, css.confPanel)}>
      <div className={css.setting}>
        <Tabs
          defaultActiveKey="setting"
          type="card"
          size="middle"
          tabPosition="top"
          destroyInactiveTabPane={true}
        >
          <Tabs.TabPane tab="参数设置" key="setting">
            <div className={css.form}>
              {nodeId && (
                <NodeFormDemo
                  name="节点参数"
                  nodeId={nodeId}
                  experimentId={experimentId}
                />
              )}
              {!nodeId && (
                <ExperimentForm name="实验设置" experimentId={experimentId} />
              )}
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="全局参数" key="params" disabled={true}>
            <div className={css.form} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <div className={css.footer} />
    </div>
  )
}
