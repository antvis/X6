import React from 'react'
import x6Editor from '@/x6Editor'
import { Dnd } from '@antv/x6/es/addon/dnd'
import { FlowChartRect } from '@/x6Editor/shape'
import styles from './index.less'

enum FLOW_CHART_TYPE {
  RECT = 'rect',
  ELLIPSE = 'ellipse',
}

export default function () {
  const dnd: Dnd = new Dnd({
    target: x6Editor.getInstance().graph as any,
  })

  const startDrag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: FLOW_CHART_TYPE,
  ) => {
    let option
    switch (type) {
      case FLOW_CHART_TYPE.RECT:
        break
      case FLOW_CHART_TYPE.ELLIPSE:
        option = {
          width: 100,
          height: 50,
          attrs: {
            body: {
              rx: 20,
              ry: 20,
            },
          },
        }
        break
      default:
        break
    }
    const node = new FlowChartRect(option)
    dnd.start(node as any, e.nativeEvent as any)
  }

  return (
    <div className={styles.chart}>
      <div
        className={styles.ellipse}
        onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.ELLIPSE)}
      />
      <div onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.RECT)} />
    </div>
  )
}
