import { Cell } from '../../core/cell'
import { Graph } from '../../graph'

export interface TooltipOptions {
  /**
   * Specifies if tooltip is enabled.
   *
   * Default is `false`.
   */
  enabled: boolean

  /**
   * Delay to show the tooltip in milliseconds.
   */
  delay: number

  zIndex: number

  /**
   * Specifies if the tooltip should be hidden if the mouse is moved
   * over the current cell.
   *
   * Default is `false`.
   */
  hideOnHover: boolean

  /**
   * Specifies if touch and pen events should be ignored.
   *
   * Default is `true`.
   */
  ignoreTouchEvents: boolean
  show?: (this: Graph, args: ShowTooltipArgs) => void
  hide?: (this: Graph) => void
}

export interface ShowTooltipArgs {
  cell: Cell
  elem: HTMLElement | SVGElement
  tip: HTMLElement | string | null
  x: number
  y: number
}
