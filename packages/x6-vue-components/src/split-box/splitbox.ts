import * as CSS from 'csstype'
import { MouseMoveTracker } from '../util/dom/MouseMoveTracker'

export interface SplitboxProps {
  split?: string | 'vertical' | 'horizontal'
  primary?: string | 'first' | 'second'
  resizable?: boolean
  /**
   * Rerender after resize.
   */
  refresh?: boolean
  size?: number | string
  minSize?: number
  maxSize?: number
  defaultSize?: number | string
  step?: number
  prefixCls?: string
  style?: CSS.Properties
  boxStyle?: CSS.Properties
  primaryBoxStyle?: CSS.Properties
  secondBoxStyle?: CSS.Properties
  resizerStyle?: CSS.Properties
  // onResizeStart?: () => void
  // onResizeEnd?: (newSize: number) => void
  // onResizing?: (newSize: number) => void
  // onResizerClick?: () => void
  // onResizerDoubleClick?: () => void
}

export interface ResizerProps {
  className?: string
  style?: CSS.Properties
  // refIt: React.LegacyRef<HTMLDivElement>
  // onClick?: (e: React.MouseEvent) => void
  // onDoubleClick?: (e: React.MouseEvent) => void
  // onMouseDown: (e: React.MouseEvent) => void
  onMouseMove?: (
    deltaX: number,
    deltaY: number,
    pos: MouseMoveTracker.ClientPosition,
  ) => void
  onMouseMoveEnd?: () => void
}

export interface BoxProps {
  style?: CSS.Properties
  className?: string
  currentSize?: number | string
  oppositeSize?: number | string
  index: number | 1 | 2
  vertical: boolean
  isPrimary: boolean
  // refIt: React.LegacyRef<HTMLDivElement>
}
