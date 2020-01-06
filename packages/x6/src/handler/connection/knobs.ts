import { Point, Rectangle } from '../../geometry'
import { DomUtil, DomEvent } from '../../dom'
import { Disposable } from '../../entity'
import { State } from '../../core/state'
import { ImageShape } from '../../shape'
import { ConnectionHandler } from './handler'
import { getConnectionIconOptions } from './option'
import { MouseEventEx } from '../mouse-event'

export class Knobs extends Disposable {
  private icon: ImageShape | null
  private icons: ImageShape[] | null
  private activeIcon: ImageShape | null
  private iconState: State | null

  constructor(public master: ConnectionHandler) {
    super()
  }

  get graph() {
    return this.master.graph
  }

  get preview() {
    return this.master.preview
  }

  get sourceState() {
    return this.preview.sourceState
  }

  get currentState() {
    return this.preview.currentState
  }

  isStarted() {
    return this.isEmpty() || (this.icons != null && this.icon != null)
  }

  isEmpty() {
    return this.icons == null
  }

  resetIcons(state: State) {
    this.icons = this.createIcons(state)
  }

  createIcons(state: State) {
    const options = getConnectionIconOptions({
      graph: this.graph,
      cell: state.cell,
    })

    if (options.image != null && state != null) {
      this.iconState = state
      const icons = []
      const image = options.image
      const bounds = new Rectangle(0, 0, image.width, image.height)
      const icon = new ImageShape(bounds, image.src, null, null, 0)

      icon.preserveImageAspect = false
      icon.cursor = options.cursor

      if (State.hasHtmlLabel(state) || options.toFront) {
        icon.dialect = 'html'
        icon.init(this.graph.container)
      } else {
        icon.dialect = 'svg'
        icon.init(this.graph.view.getOverlayPane())
        if (options.toBack) {
          DomUtil.toBack(icon.elem)
        }
      }

      const getState = () => this.currentState || state
      const mouseDown = (evt: MouseEvent) => {
        // Updates the local icon before firing the mouse down event.
        if (!DomEvent.isConsumed(evt)) {
          this.icon = icon
          this.graph.dispatchMouseEvent(
            'mouseDown',
            new MouseEventEx(evt, getState()),
          )
        }
      }

      MouseEventEx.redirectMouseEvents(
        icon.elem,
        this.graph,
        getState,
        mouseDown,
      )

      icons.push(icon)

      this.redrawIcons(icons, this.iconState)

      return icons
    }

    return null
  }

  active() {
    this.activeIcon = this.icon
    this.icon = null
  }

  refresh() {
    if (this.iconState != null) {
      this.iconState = this.graph.view.getState(this.iconState.cell)
    }

    if (this.iconState != null) {
      this.redrawIcons(this.icons, this.iconState)
      return true
    }

    return false
  }

  protected redrawIcons(icons: ImageShape[] | null, state: State) {
    if (icons != null && icons[0] != null && state != null) {
      const pos = this.getIconPosition(icons[0], state)
      icons[0].bounds.x = pos.x
      icons[0].bounds.y = pos.y
      icons[0].redraw()
    }
  }

  updateIcons(e: MouseEventEx, state: State | null) {
    if (!this.master.isMouseDown() && state != null && this.icons != null) {
      let hits = false
      const target = e.getSource()
      for (let i = 0, ii = this.icons.length; i < ii; i += 1) {
        hits =
          target === this.icons[i].elem ||
          target.parentNode === this.icons[i].elem

        if (hits) {
          break
        }
      }

      if (!hits) {
        this.doUpdateIcons(e, state, this.icons)
      }
    }
  }

  protected doUpdateIcons(e: MouseEventEx, state: State, icons: ImageShape[]) {
    // empty
  }

  updateIcon(e: MouseEventEx) {
    if (this.activeIcon != null) {
      const w = this.activeIcon.bounds.width
      const h = this.activeIcon.bounds.height
      const options = getConnectionIconOptions({
        graph: this.graph,
        cell: this.sourceState!.cell,
      })

      if (this.currentState != null && options.centerTarget) {
        const p = this.getIconPosition(this.activeIcon, this.currentState)
        this.activeIcon.bounds.x = p.x
        this.activeIcon.bounds.y = p.y
      } else {
        const bounds = new Rectangle(
          e.getGraphX() + options.offset.x,
          e.getGraphY() + options.offset.y,
          w,
          h,
        )
        this.activeIcon.bounds = bounds
      }

      this.activeIcon.redraw()
    }
  }

  protected getIconPosition(icon: ImageShape, state: State) {
    const s = this.graph.view.scale
    let cx = state.bounds.getCenterX()
    let cy = state.bounds.getCenterY()

    if (this.graph.isSwimlane(state.cell)) {
      const size = this.graph.getStartSize(state.cell)

      cx = size.width !== 0 ? state.bounds.x + (size.width * s) / 2 : cx
      cy = size.height !== 0 ? state.bounds.y + (size.height * s) / 2 : cy

      const rot = State.getRotation(state)
      if (rot !== 0) {
        const ct = state.bounds.getCenter()
        const pt = new Point(cx, cy).rotate(rot, ct)
        cx = pt.x
        cy = pt.y
      }
    }

    return new Point(cx - icon.bounds.width / 2, cy - icon.bounds.height / 2)
  }

  destroyIcons() {
    if (this.icons != null) {
      this.icons.forEach(i => i.dispose())
      this.icon = null
      this.icons = null
      this.activeIcon = null
      this.iconState = null
    }
  }

  @Disposable.dispose()
  dispose() {
    this.destroyIcons()
  }
}
