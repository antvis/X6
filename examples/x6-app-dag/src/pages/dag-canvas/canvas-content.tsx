import React, { useCallback, useEffect, useRef } from 'react'
import { message } from 'antd'
import '@antv/x6-react-shape'
import { useDrop } from 'react-dnd'
import classNames from 'classnames'
import { DRAGGABLE_ALGO_COMPONENT, DRAGGABLE_MODEL } from '@/constants/graph'
import { useExperimentGraph } from '@/pages/rx-models/experiment-graph'
import { FloatingContextMenu } from './elements/floating-context-menu'
import { CanvasHandler } from '../common/canvas-handler'
import { GraphRunningStatus } from './elements/graph-running-status'
import styles from './canvas-content.less'

interface Props {
  experimentId: string
  className?: string
}

export const CanvasContent: React.FC<Props> = (props) => {
  const { experimentId, className } = props

  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const expGraph = useExperimentGraph(experimentId)

  // 渲染画布
  useEffect(() => {
    expGraph.renderGraph(containerRef.current!, canvasRef.current!)
  }, [expGraph])

  // 处理组件拖拽落下事件
  const [, dropRef] = useDrop({
    accept: [DRAGGABLE_ALGO_COMPONENT, DRAGGABLE_MODEL],
    drop: (item: any, monitor) => {
      const currentMouseOffset = monitor.getClientOffset()
      const sourceMouseOffset = monitor.getInitialClientOffset()
      const sourceElementOffset = monitor.getInitialSourceClientOffset()
      const diffX = sourceMouseOffset!.x - sourceElementOffset!.x
      const diffY = sourceMouseOffset!.y - sourceElementOffset!.y
      const x = currentMouseOffset!.x - diffX
      const y = currentMouseOffset!.y - diffY
      if (expGraph.isGraphReady()) {
        expGraph.requestAddNode({
          clientX: x,
          clientY: y,
          nodeMeta: item.component,
        })
      } else {
        message.info('实验数据建立中，请稍后再尝试添加节点')
      }
    },
  })

  // 画布侧边 toolbar handler
  const onHandleSideToolbar = useCallback(
    (action: 'in' | 'out' | 'fit' | 'real') => () => {
      // 确保画布已渲染
      if (expGraph.isGraphReady()) {
        switch (action) {
          case 'in':
            expGraph.zoomGraph(0.1)
            break
          case 'out':
            expGraph.zoomGraph(-0.1)
            break
          case 'fit':
            expGraph.zoomGraphToFit()
            break
          case 'real':
            expGraph.zoomGraphRealSize()
            break
          default:
        }
      }
    },
    [expGraph],
  )

  return (
    <div
      ref={(elem) => {
        containerRef.current = elem
        dropRef(elem)
      }}
      className={classNames(className, styles.canvasContent)}
    >
      {/* 图和边的右键菜单 */}
      <FloatingContextMenu experimentId={experimentId} />

      {/* 缩放相关的 toolbar */}
      <CanvasHandler
        onZoomIn={onHandleSideToolbar('in')}
        onZoomOut={onHandleSideToolbar('out')}
        onFitContent={onHandleSideToolbar('fit')}
        onRealContent={onHandleSideToolbar('real')}
      />

      {/* 图运行状态 */}
      <GraphRunningStatus
        className={styles.runningStatus}
        experimentId={experimentId}
      />

      {/* 图容器 */}
      <div ref={canvasRef} />
    </div>
  )
}
