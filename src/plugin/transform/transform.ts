import type { NodeViewPositionEventArgs } from '@/view/node/type'
import { Dom, disposable, type KeyValue, NumberExt } from '../../common'
import { DocumentEvents } from '../../constants'
import { Angle, GeometryUtil, Point } from '../../geometry'
import type { Graph } from '../../graph'
import type { Node } from '../../model'
import { type NodeView, View } from '../../view'
import { DocumentEvents } from '@/constants'
import type { PointLike } from '@/types'

interface ResizeEventArgs<E> extends NodeViewPositionEventArgs<E> {}
interface RotateEventArgs<E> extends NodeViewPositionEventArgs<E> {}
export interface TransformImplEventArgs {
  'node:resize': ResizeEventArgs<Dom.MouseDownEvent>
  'node:resizing': ResizeEventArgs<Dom.MouseMoveEvent>
  'node:resized': ResizeEventArgs<Dom.MouseUpEvent>
  'node:rotate': RotateEventArgs<Dom.MouseDownEvent>
  'node:rotating': RotateEventArgs<Dom.MouseMoveEvent>
  'node:rotated': RotateEventArgs<Dom.MouseUpEvent>
}

export interface TransformImplOptions {
  className?: string

  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  resizable?: boolean

  rotatable?: boolean
  rotateGrid?: number
  orthogonalResizing?: boolean
  restrictedResizing?: boolean | number
  autoScrollOnResizing?: boolean

  /**
   * Set to `true` if you want the resizing to preserve the
   * aspect ratio of the node. Default is `false`.
   */
  preserveAspectRatio?: boolean
  /**
   * Reaching the minimum width or height is whether to allow control points to reverse
   */
  allowReverse?: boolean
}

interface EventDataResizing {
  action: 'resizing'
  selector: 'bottomLeft' | 'bottomRight' | 'topRight' | 'topLeft'
  direction: Node.ResizeDirection
  trueDirection: Node.ResizeDirection
  relativeDirection: Node.ResizeDirection
  resizeX: number
  resizeY: number
  angle: number
  resized?: boolean
}

interface EventDataRotating {
  action: 'rotating'
  center: PointLike
  angle: number
  start: number
  rotated?: boolean
}

export const NODE_CLS = 'has-widget-transform'
export const DIRECTIONS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
export const POSITIONS: Node.ResizeDirection[] = [
  'top-left',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
]

const defaultOptions: TransformImplOptions = {
  minWidth: 0,
  minHeight: 0,
  maxWidth: Infinity,
  maxHeight: Infinity,
  rotateGrid: 15,
  rotatable: true,
  preserveAspectRatio: false,
  orthogonalResizing: true,
  restrictedResizing: false,
  autoScrollOnResizing: true,
  allowReverse: true,
}
export class TransformImpl extends View<TransformImplEventArgs> {
  private node: Node
  private graph: Graph
  private options: TransformImplOptions
  protected handle: Element | null
  protected prevShift: number
  public container: HTMLElement

  protected get model() {
    return this.graph.model
  }

  protected get view() {
    return this.graph.renderer.findViewByCell(this.node)!
  }

  protected get containerClassName() {
    return this.prefixClassName('widget-transform')
  }

  protected get resizeClassName() {
    return `${this.containerClassName}-resize`
  }

  protected get rotateClassName() {
    return `${this.containerClassName}-rotate`
  }

  constructor(options: TransformImplOptions, node: Node, graph: Graph) {
    super()

    this.node = node
    this.graph = graph

    this.options = {
      ...defaultOptions,
      ...options,
    }

    this.render()
    this.startListening()
  }

  protected startListening() {
    this.delegateEvents({
      [`mousedown .${this.resizeClassName}`]: 'startResizing',
      [`touchstart .${this.resizeClassName}`]: 'startResizing',
      [`mousedown .${this.rotateClassName}`]: 'startRotating',
      [`touchstart .${this.rotateClassName}`]: 'startRotating',
    })

    this.model.on('*', this.update, this)
    this.graph.on('scale', this.update, this)
    this.graph.on('translate', this.update, this)

    this.node.on('removed', this.remove, this)
    this.model.on('reseted', this.remove, this)

    this.view.on('cell:knob:mousedown', this.onKnobMouseDown, this)
    this.view.on('cell:knob:mouseup', this.onKnobMouseUp, this)
  }

  protected stopListening() {
    this.undelegateEvents()

    this.model.off('*', this.update, this)
    this.graph.off('scale', this.update, this)
    this.graph.off('translate', this.update, this)

    this.node.off('removed', this.remove, this)
    this.model.off('reseted', this.remove, this)

    this.view.off('cell:knob:mousedown', this.onKnobMouseDown, this)
    this.view.off('cell:knob:mouseup', this.onKnobMouseUp, this)
  }

  protected renderHandles() {
    this.container = document.createElement('div')

    const knob = document.createElement('div')
    Dom.attr(knob, 'draggable', 'false')
    const rotate = knob.cloneNode(true) as Element
    Dom.addClass(rotate, this.rotateClassName)

    const resizes = POSITIONS.map((pos) => {
      const elem = knob.cloneNode(true) as Element
      Dom.addClass(elem, this.resizeClassName)
      Dom.attr(elem, 'data-position', pos)
      return elem
    })
    this.empty()
    Dom.append(this.container, [...resizes, rotate])
  }

  render() {
    this.renderHandles()

    if (this.view) {
      this.view.addClass(NODE_CLS)
    }

    Dom.addClass(this.container, this.containerClassName)
    Dom.toggleClass(
      this.container,
      'no-orth-resize',
      this.options.preserveAspectRatio || !this.options.orthogonalResizing,
    )
    Dom.toggleClass(this.container, 'no-resize', !this.options.resizable)
    Dom.toggleClass(this.container, 'no-rotate', !this.options.rotatable)

    if (this.options.className) {
      Dom.addClass(this.container, this.options.className)
    }

    this.graph.container.appendChild(this.container)

    return this.update()
  }

  update() {
    const ctm = this.graph.matrix()
    const bbox = this.node.getBBox()

    bbox.x *= ctm.a
    bbox.x += ctm.e
    bbox.y *= ctm.d
    bbox.y += ctm.f
    bbox.width *= ctm.a
    bbox.height *= ctm.d

    const angle = Angle.normalize(this.node.getAngle())
    const transform = angle !== 0 ? `rotate(${angle}deg)` : ''
    Dom.css(this.container, {
      transform,
      width: bbox.width,
      height: bbox.height,
      left: bbox.x,
      top: bbox.y,
    })

    this.updateResizerDirections()

    return this
  }

  remove() {
    if (this.view) {
      this.view.removeClass(NODE_CLS)
    }
    return super.remove()
  }

  protected onKnobMouseDown() {
    this.startHandle()
  }

  protected onKnobMouseUp() {
    this.stopHandle()
  }

  protected updateResizerDirections() {
    // Update the directions on the resizer divs while the node being rotated.
    // The directions are represented by cardinal points (N,S,E,W). For example
    // the div originally pointed to north needs to be changed to point to south
    // if the node was rotated by 180 degrees.
    const angle = Angle.normalize(this.node.getAngle())
    const shift = Math.floor(angle * (DIRECTIONS.length / 360))
    if (shift !== this.prevShift) {
      // Create the current directions array based on the calculated shift.
      const directions = DIRECTIONS.slice(shift).concat(
        DIRECTIONS.slice(0, shift),
      )

      const className = (dir: string) =>
        `${this.containerClassName}-cursor-${dir}`

      const resizes = this.container.querySelectorAll(
        `.${this.resizeClassName}`,
      )
      resizes.forEach((resize, index) => {
        Dom.removeClass(
          resize,
          DIRECTIONS.map((dir) => className(dir)).join(' '),
        )
        Dom.addClass(resize, className(directions[index]))
      })

      this.prevShift = shift
    }
  }

  protected getTrueDirection(dir: Node.ResizeDirection) {
    const angle = Angle.normalize(this.node.getAngle())
    let index = POSITIONS.indexOf(dir)

    index += Math.floor(angle * (POSITIONS.length / 360))
    index %= POSITIONS.length

    return POSITIONS[index]
  }

  protected toValidResizeDirection(dir: string): Node.ResizeDirection {
    return (
      (
        {
          top: 'top-left',
          bottom: 'bottom-right',
          left: 'bottom-left',
          right: 'top-right',
        } as KeyValue
      )[dir] || dir
    )
  }

  protected startResizing(evt: Dom.MouseDownEvent) {
    evt.stopPropagation()
    this.model.startBatch('resize', { cid: this.cid })
    const dir = Dom.attr(evt.target, 'data-position') as Node.ResizeDirection
    this.prepareResizing(evt, dir)
    this.startAction(evt)
  }

  protected prepareResizing(
    evt: Dom.EventObject,
    relativeDirection: Node.ResizeDirection,
  ) {
    const trueDirection = this.getTrueDirection(relativeDirection)
    let rx = 0
    let ry = 0
    relativeDirection.split('-').forEach((direction) => {
      rx = ({ left: -1, right: 1 } as KeyValue)[direction] || rx
      ry = ({ top: -1, bottom: 1 } as KeyValue)[direction] || ry
    })

    const direction = this.toValidResizeDirection(relativeDirection)
    const selector = (
      {
        'top-right': 'bottomLeft',
        'top-left': 'bottomRight',
        'bottom-left': 'topRight',
        'bottom-right': 'topLeft',
      } as KeyValue
    )[direction]
    const angle = Angle.normalize(this.node.getAngle())

    this.setEventData<EventDataResizing>(evt, {
      selector,
      direction,
      trueDirection,
      relativeDirection,
      angle,
      resizeX: rx,
      resizeY: ry,
      action: 'resizing',
    })
  }

  protected startRotating(evt: Dom.MouseDownEvent) {
    evt.stopPropagation()

    this.model.startBatch('rotate', { cid: this.cid })

    const center = this.node.getBBox().getCenter()
    const e = this.normalizeEvent(evt)
    const client = this.graph.snapToGrid(e.clientX, e.clientY)
    this.setEventData<EventDataRotating>(evt, {
      center,
      action: 'rotating',
      angle: Angle.normalize(this.node.getAngle()),
      start: Point.create(client).theta(center),
    })
    this.startAction(evt)
  }

  protected onMouseMove(evt: Dom.MouseMoveEvent) {
    const view = this.graph.findViewByCell(this.node) as NodeView
    let data = this.getEventData<EventDataResizing | EventDataRotating>(evt)
    if (data.action) {
      const e = this.normalizeEvent(evt)
      let clientX = e.clientX
      let clientY = e.clientY

      const scroller = this.graph.getPlugin<any>('scroller')
      const restrict = this.options.restrictedResizing

      if (restrict === true || typeof restrict === 'number') {
        const factor = restrict === true ? 0 : restrict
        const fix = scroller ? Math.max(factor, 8) : factor
        const rect = this.graph.container.getBoundingClientRect()
        clientX = NumberExt.clamp(clientX, rect.left + fix, rect.right - fix)
        clientY = NumberExt.clamp(clientY, rect.top + fix, rect.bottom - fix)
      } else if (this.options.autoScrollOnResizing && scroller) {
        scroller.autoScroll(clientX, clientY)
      }

      const pos = this.graph.snapToGrid(clientX, clientY)
      const gridSize = this.graph.getGridSize()
      const node = this.node
      const options = this.options

      if (data.action === 'resizing') {
        data = data as EventDataResizing
        if (!data.resized) {
          if (view) {
            view.addClass('node-resizing')
            this.notify('node:resize', evt, view)
          }
          data.resized = true
        }

        const currentBBox = node.getBBox()
        const requestedSize = Point.create(pos)
          .rotate(data.angle, currentBBox.getCenter())
          .diff(currentBBox[data.selector])

        let width = data.resizeX
          ? requestedSize.x * data.resizeX
          : currentBBox.width

        let height = data.resizeY
          ? requestedSize.y * data.resizeY
          : currentBBox.height

        const rawWidth = width
        const rawHeight = height

        width = GeometryUtil.snapToGrid(width, gridSize)
        height = GeometryUtil.snapToGrid(height, gridSize)
        width = Math.max(width, options.minWidth || gridSize)
        height = Math.max(height, options.minHeight || gridSize)
        width = Math.min(width, options.maxWidth || Infinity)
        height = Math.min(height, options.maxHeight || Infinity)

        if (options.preserveAspectRatio) {
          const candidateWidth =
            (currentBBox.width * height) / currentBBox.height
          const candidateHeight =
            (currentBBox.height * width) / currentBBox.width

          if (width < candidateWidth) {
            height = candidateHeight
          } else {
            width = candidateWidth
          }
        }

        const relativeDirection = data.relativeDirection
        if (
          options.allowReverse &&
          (rawWidth <= -width || rawHeight <= -height)
        ) {
          let reverted: Node.ResizeDirection

          if (relativeDirection === 'left') {
            if (rawWidth <= -width) {
              reverted = 'right'
            }
          } else if (relativeDirection === 'right') {
            if (rawWidth <= -width) {
              reverted = 'left'
            }
          } else if (relativeDirection === 'top') {
            if (rawHeight <= -height) {
              reverted = 'bottom'
            }
          } else if (relativeDirection === 'bottom') {
            if (rawHeight <= -height) {
              reverted = 'top'
            }
          } else if (relativeDirection === 'top-left') {
            if (rawWidth <= -width && rawHeight <= -height) {
              reverted = 'bottom-right'
            } else if (rawWidth <= -width) {
              reverted = 'top-right'
            } else if (rawHeight <= -height) {
              reverted = 'bottom-left'
            }
          } else if (relativeDirection === 'top-right') {
            if (rawWidth <= -width && rawHeight <= -height) {
              reverted = 'bottom-left'
            } else if (rawWidth <= -width) {
              reverted = 'top-left'
            } else if (rawHeight <= -height) {
              reverted = 'bottom-right'
            }
          } else if (relativeDirection === 'bottom-left') {
            if (rawWidth <= -width && rawHeight <= -height) {
              reverted = 'top-right'
            } else if (rawWidth <= -width) {
              reverted = 'bottom-right'
            } else if (rawHeight <= -height) {
              reverted = 'top-left'
            }
          } else if (relativeDirection === 'bottom-right') {
            if (rawWidth <= -width && rawHeight <= -height) {
              reverted = 'top-left'
            } else if (rawWidth <= -width) {
              reverted = 'bottom-left'
            } else if (rawHeight <= -height) {
              reverted = 'top-right'
            }
          }

          const revertedDir = reverted!
          this.stopHandle()
          const handle = this.container.querySelector(
            `.${this.resizeClassName}[data-position="${revertedDir}"]`,
          )
          this.startHandle(handle)
          this.prepareResizing(evt, revertedDir)
          this.onMouseMove(evt)
        }

        if (currentBBox.width !== width || currentBBox.height !== height) {
          const resizeOptions: Node.ResizeOptions = {
            ui: true,
            direction: data.direction,
            relativeDirection: data.relativeDirection,
            trueDirection: data.trueDirection,
            minWidth: options.minWidth!,
            minHeight: options.minHeight!,
            maxWidth: options.maxWidth!,
            maxHeight: options.maxHeight!,
            preserveAspectRatio: options.preserveAspectRatio === true,
          }
          node.resize(width, height, resizeOptions)
          this.notify('node:resizing', evt, view)
        }
      } else if (data.action === 'rotating') {
        data = data as EventDataRotating
        if (!data.rotated) {
          if (view) {
            view.addClass('node-rotating')
            this.notify('node:rotate', evt, view)
          }
          data.rotated = true
        }

        const currentAngle = node.getAngle()
        const theta = data.start - Point.create(pos).theta(data.center)
        let target = data.angle + theta
        if (options.rotateGrid) {
          target = GeometryUtil.snapToGrid(target, options.rotateGrid)
        }
        target = Angle.normalize(target)

        if (currentAngle !== target) {
          node.rotate(target, { absolute: true })
          this.notify('node:rotating', evt, view)
        }
      }
    }
  }

  protected onMouseUp(evt: Dom.MouseUpEvent) {
    const data = this.getEventData<EventDataResizing | EventDataRotating>(evt)
    if (data.action) {
      this.stopAction(evt)
      this.model.stopBatch(data.action === 'resizing' ? 'resize' : 'rotate', {
        cid: this.cid,
      })
    }
  }

  protected startHandle(handle?: Element | null) {
    this.handle = handle || null
    Dom.addClass(this.container, `${this.containerClassName}-active`)
    if (handle) {
      Dom.addClass(handle, `${this.containerClassName}-active-handle`)

      const pos = handle.getAttribute('data-position') as Node.ResizeDirection
      if (pos) {
        const dir = DIRECTIONS[POSITIONS.indexOf(pos)]
        Dom.addClass(this.container, `${this.containerClassName}-cursor-${dir}`)
      }
    }
  }

  protected stopHandle() {
    Dom.removeClass(this.container, `${this.containerClassName}-active`)

    if (this.handle) {
      Dom.removeClass(this.handle, `${this.containerClassName}-active-handle`)

      const pos = this.handle.getAttribute(
        'data-position',
      ) as Node.ResizeDirection
      if (pos) {
        const dir = DIRECTIONS[POSITIONS.indexOf(pos)]
        Dom.removeClass(
          this.container,
          `${this.containerClassName}-cursor-${dir}`,
        )
      }

      this.handle = null
    }
  }

  protected startAction(evt: Dom.MouseDownEvent) {
    this.startHandle(evt.target)
    this.graph.view.undelegateEvents()
    this.delegateDocumentEvents(DocumentEvents, evt.data)
  }

  protected stopAction(evt: Dom.MouseUpEvent) {
    this.stopHandle()
    this.undelegateDocumentEvents()
    this.graph.view.delegateEvents()

    const view = this.graph.findViewByCell(this.node) as NodeView
    const data = this.getEventData<EventDataResizing | EventDataRotating>(evt)

    if (view) {
      view.removeClass(`node-${data.action}`)
      if (data.action === 'resizing' && data.resized) {
        this.notify('node:resized', evt, view)
      } else if (data.action === 'rotating' && data.rotated) {
        this.notify('node:rotated', evt, view)
      }
    }
  }

  protected notify<
    K extends keyof TransformImplEventArgs,
    T extends Dom.EventObject,
  >(name: K, evt: T, view: NodeView, args: KeyValue = {}) {
    if (view) {
      const graph = view.graph
      const e = graph.view.normalizeEvent(evt) as any
      const localPoint = graph.snapToGrid(e.clientX, e.clientY)

      this.trigger(name, {
        e,
        view,
        node: view.cell,
        cell: view.cell,
        x: localPoint.x,
        y: localPoint.y,
        ...args,
      })
    }
  }

  @disposable()
  dispose() {
    this.stopListening()
    this.remove()
    this.off()
  }
}
