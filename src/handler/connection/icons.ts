import * as util from '../../util'
import { State } from '../../core'
import { Rectangle, Point } from '../../struct'
import { ImageShape } from '../../shape'
import { ConnectionHandler } from './handler'
import { getConnectionIconOptions } from './option'
import { Disposable, MouseEventEx, DomEvent } from '../../common'

export class Icons extends Disposable {
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

  get sourceState() {
    return this.master.sourceState
  }

  get currentState() {
    return this.master.currentState
  }

  protected createIcons(state: State) {
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

      if (util.hasHtmlLabel(state) || options.toFront) {
        icon.dialect = 'html'
        icon.init(this.graph.container)
      } else {
        icon.dialect = 'svg'
        icon.init(this.graph.view.getOverlayPane())
        if (options.toBack) {
          util.toBack(icon.elem)
        }
      }

      const getState = () => (this.currentState || state)
      const mouseDown = (evt: MouseEvent) => {
        // Updates the local icon before firing the mouse down event.
        if (!DomEvent.isConsumed(evt)) {
          this.icon = icon
          this.graph.fireMouseEvent(
            DomEvent.MOUSE_DOWN, new MouseEventEx(evt, getState()),
          )
        }
      }

      MouseEventEx.redirectMouseEvents(
        icon.elem, this.graph, getState, mouseDown,
      )

      icons.push(icon)

      this.redrawIcons(icons, this.iconState)

      return icons
    }

    return null
  }

  protected redrawIcons(icons: ImageShape[] | null, state: State) {
    if (icons != null && icons[0] != null && state != null) {
      const pos = this.getIconPosition(icons[0], state)
      icons[0].bounds.x = pos.x
      icons[0].bounds.y = pos.y
      icons[0].redraw()
    }
  }

  protected getIconPosition(icon: ImageShape, state: State) {
    const s = this.graph.view.scale
    let cx = state.bounds.getCenterX()
    let cy = state.bounds.getCenterY()

    if (this.graph.isSwimlane(state.cell)) {
      const size = this.graph.getStartSize(state.cell)

      cx = (size.width !== 0) ? state.bounds.x + size.width * s / 2 : cx
      cy = (size.height !== 0) ? state.bounds.y + size.height * s / 2 : cy

      const rot = util.getRotation(state)
      if (rot !== 0) {
        const ct = state.bounds.getCenter()
        const pt = util.rotatePoint(new Point(cx, cy), rot, ct)
        cx = pt.x
        cy = pt.y
      }
    }

    return new Point(
      cx - icon.bounds.width / 2,
      cy - icon.bounds.height / 2,
    )
  }

  protected updateIcon(e: MouseEventEx) {
    console.log(this.icon)
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
          w, h,
        )
        this.activeIcon.bounds = bounds
      }

      this.activeIcon.redraw()
    }
  }

  destroyIcons() {
    if (this.icons != null) {
      this.icons.forEach(i => i.dispose())
      this.icons = null
      this.icon = null
      this.activeIcon = null
      this.iconState = null
    }
  }

  @Disposable.aop()
  dispose() {
    this.destroyIcons()
  }
}
