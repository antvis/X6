import React from 'react'
import x6Editor from '@/x6Editor'
import { Dnd } from '@antv/x6/es/addon/dnd'
import { FlowChartRect, FlowChartPloygon } from '@/x6Editor/shape'
import styles from './index.less'

enum FLOW_CHART_TYPE {
  RECT = 'rect',
  ELLIPSE = 'ellipse',
  DIAMOND = 'diamond',
  PARALLELOGRAM = 'Parallelogram',
}

export default function () {
  const dnd: Dnd = new Dnd({
    target: x6Editor.getInstance().graph as any,
  })

  const startDrag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: FLOW_CHART_TYPE,
  ) => {
    let node
    switch (type) {
      case FLOW_CHART_TYPE.RECT:
        node = new FlowChartRect()
        break
      case FLOW_CHART_TYPE.ELLIPSE:
        node = new FlowChartRect({
          width: 100,
          height: 50,
          attrs: {
            body: {
              rx: 20,
              ry: 20,
            },
          },
        })
        break
      case FLOW_CHART_TYPE.DIAMOND:
        node = new FlowChartPloygon({
          ports: {
            items: [
              {
                group: 'in',
              },
              {
                group: 'out',
              },
              {
                group: 'left',
              },
              {
                group: 'right',
              },
            ],
          },
        })
        break
      case FLOW_CHART_TYPE.PARALLELOGRAM:
        node = new FlowChartPloygon({
          width: 130,
          height: 60,
          attrs: {
            body: {
              refPoints: '60,20 160,20 130,60 30,60',
            },
          },
        })
        break
      default:
        break
    }
    dnd.start(node as any, e.nativeEvent as any)
  }

  return (
    <div className={styles.chart}>
      <div
        className={styles.ellipse}
        onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.ELLIPSE)}
      />
      <div onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.RECT)} />
      <div
        className={styles.diamond}
        onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.DIAMOND)}
      />
      <div
        className={styles.parallelogram}
        onMouseDown={(e) => startDrag(e, FLOW_CHART_TYPE.PARALLELOGRAM)}
      />
    </div>
  )
}
