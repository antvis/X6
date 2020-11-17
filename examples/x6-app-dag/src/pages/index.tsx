import React from 'react'
import classNames from 'classnames'
import { Layout } from 'antd'
import { RouteComponentProps } from 'react-router'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { GuideHeader } from '@/layout/header'
import { ComponentTreePanel } from './component-tree-panel'
import { ComponentConfigPanel } from './component-config-panel'
import { DAGCanvas } from './dag-canvas'

import styles from './index.less'

interface Props extends RouteComponentProps<{ experimentId: string }> {
  experimentId: string
}

const { Content } = Layout

const DagDemo: React.FC<Props> = (props) => {
  const { experimentId = '1' } = props

  return (
    <Layout className={styles.layout}>
      <GuideHeader experimentId={experimentId} />
      <Content className={styles.content}>
        <div className={classNames(styles.experiment)}>
          <DndProvider backend={HTML5Backend}>
            <ComponentTreePanel
              experimentId={experimentId}
              className={styles.nodeSourceTree}
            />
            <div className={styles.editPanel}>
              <DAGCanvas
                experimentId={experimentId}
                className={styles.dagCanvas}
              />
              <ComponentConfigPanel
                experimentId={experimentId}
                className={styles.confPanel}
              />
            </div>
          </DndProvider>
        </div>
      </Content>
    </Layout>
  )
}

export default DagDemo
