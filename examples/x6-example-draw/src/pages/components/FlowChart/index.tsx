import React from 'react'
import {
  FLOW_CHART_RECT
} from '@/x6Editor/constant'
import { useElementMove } from '@/common/hooks'
import styles from './index.less'

export default function() {
  const {
    activeType,
    clientRect,
    shadow,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useElementMove()

  return (
    <div>
      <svg
        className={styles.svg}
        width="368"
        height="250"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        onMouseDown={handleMouseDown}
      >
        <rect
          x="10"
          y="10"
          width={FLOW_CHART_RECT.iconWidth}
          height={FLOW_CHART_RECT.iconHeight}
          fill="transparent"
          stroke="black"
          strokeWidth="1"
          cursor="pointer"
          data-type={FLOW_CHART_RECT.type}
          data-width={FLOW_CHART_RECT.width}
          data-height={FLOW_CHART_RECT.height}
          className={activeType === FLOW_CHART_RECT.type ? styles.active : ''}
        />
      </svg>
      {activeType && (
        <div
          className={styles.mask}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div 
            className={styles.shadow}
            ref={shadow}
            draggable={false}
            style={clientRect}
          >
          </div>
        </div>
      )}
    </div>
  )
}
