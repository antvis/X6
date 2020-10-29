import React, { useEffect } from 'react'
import classNames from 'classnames'
import {
  useExperimentGraph,
  useUnmountExperimentGraph,
} from '@/pages/rx-models/experiment-graph'
import { CanvasContent } from './canvas-content'
import { CanvasToolbar } from './canvas-toolbar'
import { BottomToolbar } from './bottom-toolbar'

import styles from './index.less'

interface Props {
  experimentId: string
  className?: string
}

export const DAGCanvas: React.FC<Props> = (props) => {
  const { experimentId, className } = props
  const expGraph = useExperimentGraph(experimentId)

  // 处理画布卸载
  useUnmountExperimentGraph(experimentId)

  // 自定义算法组件的渲染控制
  useEffect(() => {
    ;(window as any).renderForm = expGraph.setActiveAlgoData
    return () => {
      delete (window as any).renderForm
    }
  }, [expGraph])

  return (
    <div className={classNames(styles.dagContainer, className)}>
      <CanvasToolbar experimentId={experimentId} />
      <CanvasContent
        experimentId={experimentId}
        className={styles.canvasContent}
      />
      <BottomToolbar experimentId={experimentId} />
    </div>
  )
}
