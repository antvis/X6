import type { Node } from '../../model'

export interface Point {
  x: number
  y: number
}

/** How a pin's position is persisted in `port.args`. */
export type PortEditorPositionUnit = 'local' | 'percent'

export interface PortEditorOptions {
  /** Port group used for pins. Created on the node automatically if absent. */
  group?: string
  /** Prefix of generated pin ids (`pin-1`, `pin-2`, ...). */
  idPrefix?: string
  /**
   * `local`  – store node-local pixels (args.x/args.y). Pins keep their pixel offset on resize.
   * `percent` – store percentages of the node size. Pins keep their relative spot on resize.
   */
  positionUnit?: PortEditorPositionUnit
  /**
   * CSS selector of the element used as the node outline. When omitted, every geometric
   * shape of the node markup (rect/circle/ellipse/path/polygon/polyline) is used and the
   * nearest one wins — that keeps custom, non-rectangular symbols working.
   */
  outlineSelector?: string
  /** Max samples per outline when walking it with `getPointAtLength`. */
  sampleCount?: number
  /** Create the port group on the node when it does not exist yet. */
  autoCreateGroup?: boolean
  /** Group definition used by `autoCreateGroup`. */
  groupConfig?: Record<string, any>
  /** Show a "×" badge when the pointer hovers an existing pin (remove on click). */
  deleteBadge?: boolean
  /** Leave add-pin mode automatically after a pin was placed. */
  stopAfterAdd?: boolean
  /**
   * 添加模式下禁止拖动元件（默认 true）。否则在"本体也是 magnet"的元件上点击加引脚，
   * 会被 X6 解释为拖拽/移动元件，产生副作用。
   */
  blockNodeMove?: boolean
  /**
   * 添加模式下禁用画布平移（默认 true）。X6 在 `node:unhandled:mousedown` 时会启动 panning，
   * 于是"按下元件想加引脚"会被解释为拖动画布，视图静默位移、后续交互全部错位。
   */
  blockPanning?: boolean
  /** Extra class added to the overlay root element. */
  className?: string
  /** Called whenever add-pin mode is entered or left (also when the host leaves it via Esc). */
  onModeChange?: (adding: boolean) => void
  onPortAdded?: (args: { node: Node; portId: string }) => void
  onPortRemoved?: (args: { node: Node; portId: string }) => void
}

export interface ResolvedPortEditorOptions
  extends Required<
    Omit<
      PortEditorOptions,
      | 'onPortAdded'
      | 'onPortRemoved'
      | 'onModeChange'
      | 'className'
      | 'outlineSelector'
    >
  > {
  className?: string
  outlineSelector?: string
  onModeChange?: (adding: boolean) => void
  onPortAdded?: (args: { node: Node; portId: string }) => void
  onPortRemoved?: (args: { node: Node; portId: string }) => void
}
