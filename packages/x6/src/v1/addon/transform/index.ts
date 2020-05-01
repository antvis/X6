import { KeyValue } from '../../../types'
import { Angle, Point, snapToGrid } from '../../../geometry'
import { Node } from '../../core/node'
import { Widget } from '../common/widget'
import {
  EventData,
  BATCH_NAME,
  DIRECTIONS,
  POSITIONS,
  defaultOptions,
  documentEvents,
} from './constant'

export class Transform extends Widget<Transform.Options> {
  protected handle: Element | null
  protected prevShift: number
  protected $container: JQuery<HTMLElement>

  protected get node() {
    return this.cell as Node
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

  protected init(options: Transform.Options) {
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
    this.model.on('reseted', this.remove, this)
    this.node.on('removed', this.remove, this)

    this.graph.on('scale', this.update, this)
    this.graph.on('translate', this.update, this)

    super.startListening()
  }

  protected stopListening() {
    this.undelegateEvents()

    this.model.off('*', this.update, this)
    this.model.off('reseted', this.remove, this)
    this.node.off('removed', this.remove, this)

    this.graph.off('scale', this.update, this)
    this.graph.off('translate', this.update, this)

    super.stopListening()
  }

  protected onRemove() {
    this.stopListening()
  }

  protected renderHandles() {
    this.container = document.createElement('div')
    this.$container = this.$(this.container)

    const $knob = this.$('<div/>').prop('draggable', false)
    const $rotate = $knob.clone().addClass(this.rotateClassName)

    const $resizes = POSITIONS.map(pos => {
      return $knob
        .clone()
        .addClass(this.resizeClassName)
        .attr('data-position', pos)
    })
    this.empty()
    this.$container.append($resizes, $rotate)
  }

  render() {
    this.renderHandles()
    this.$container
      .addClass(this.containerClassName)
      .toggleClass(
        'no-orth-resize',
        this.options.preserveAspectRatio || !this.options.orthogonalResizing,
      )
      .toggleClass('no-rotation', !this.options.rotatable)

    this.graph.container.appendChild(this.container)

    return this.update()
  }

  update() {
    const ctm = this.graph.getMatrix()
    const bbox = this.node.getBBox()

    bbox.x *= ctm.a
    bbox.x += ctm.e
    bbox.y *= ctm.d
    bbox.y += ctm.f
    bbox.width *= ctm.a
    bbox.height *= ctm.d

    const rotation = Angle.normalize(this.node.getRotation())
    const transform = rotation !== 0 ? `rotate(${rotation}deg)` : ''
    this.$container.css({
      transform,
      width: bbox.width,
      height: bbox.height,
      left: bbox.x,
      top: bbox.y,
    })

    this.updateResizerDirections()

    return this
  }

  protected updateResizerDirections() {
    // Update the directions on the resizer divs while the node being rotated.
    // The directions are represented by cardinal points (N,S,E,W). For example
    // the div originally pointed to north needs to be changed to point to south
    // if the node was rotated by 180 degrees.
    const angle = Angle.normalize(this.node.getRotation())
    const shift = Math.floor(angle * (DIRECTIONS.length / 360))
    if (shift !== this.prevShift) {
      // Create the current directions array based on the calculated shift.
      const directions = DIRECTIONS.slice(shift).concat(
        DIRECTIONS.slice(0, shift),
      )

      const className = (dir: string) =>
        `${this.containerClassName}-cursor-${dir}`

      this.$container
        .find(`.${this.resizeClassName}`)
        .removeClass(DIRECTIONS.map(dir => className(dir)).join(' '))
        .each((index, elem) => {
          this.$(elem).addClass(className(directions[index]))
        })
      this.prevShift = shift
    }
  }

  protected getTrueDirection(dir: Node.ResizeDirection) {
    const angle = Angle.normalize(this.node.getRotation())
    let index = POSITIONS.indexOf(dir)

    index = index + Math.floor(angle * (POSITIONS.length / 360))
    index = index % POSITIONS.length

    return POSITIONS[index]
  }

  protected toValidResizeDirection(dir: string): Node.ResizeDirection {
    return (
      ({
        top: 'top-left',
        bottom: 'bottom-right',
        left: 'bottom-left',
        right: 'top-right',
      } as KeyValue)[dir] || dir
    )
  }

  protected startResizing(evt: JQuery.MouseDownEvent) {
    evt.stopPropagation()
    this.model.startBatch(BATCH_NAME, { cid: this.cid })
    const relativeDirection = this.$(evt.target).attr(
      'data-position',
    ) as Node.ResizeDirection
    this.prepareResizing(evt, relativeDirection)
    this.startOp(evt)
  }

  protected prepareResizing(
    evt: JQuery.TriggeredEvent,
    relativeDirection: Node.ResizeDirection,
  ) {
    const trueDirection = this.getTrueDirection(relativeDirection)
    let rx = 0
    let ry = 0
    relativeDirection.split('-').forEach(direction => {
      rx = ({ left: -1, right: 1 } as KeyValue)[direction] || rx
      ry = ({ top: -1, bottom: 1 } as KeyValue)[direction] || ry
    })

    const direction = this.toValidResizeDirection(relativeDirection)
    const selector = ({
      'top-right': 'bottomLeft',
      'top-left': 'bottomRight',
      'bottom-left': 'topRight',
      'bottom-right': 'topLeft',
    } as KeyValue)[direction]

    this.setEventData<EventData.Resizing>(evt, {
      selector,
      direction,
      trueDirection,
      relativeDirection,
      resizeX: rx,
      resizeY: ry,
      angle: Angle.normalize(this.node.getRotation()),
      action: 'resizing',
    })
  }

  protected startRotating(evt: JQuery.MouseDownEvent) {
    evt.stopPropagation()

    this.model.startBatch(BATCH_NAME, { cid: this.cid })

    const center = this.node.getBBox().getCenter()
    const client = this.graph.snapToGrid(evt.clientX, evt.clientY)
    this.setEventData<EventData.Rotating>(evt, {
      center,
      action: 'rotating',
      angle: Angle.normalize(this.node.getRotation()),
      start: Point.create(client).theta(center),
    })
    this.startOp(evt)
  }

  protected onMouseMove(evt: JQuery.MouseMoveEvent) {
    let data = this.getEventData<EventData.Resizing | EventData.Rotating>(evt)
    if (data.action) {
      const e = this.normalizeEvent(evt)
      const pos = this.graph.snapToGrid(e.clientX, e.clientY)
      const gridSize = this.graph.options.gridSize
      const node = this.node
      const options = this.options

      if (data.action === 'resizing') {
        data = data as EventData.Resizing
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

        width = snapToGrid(width, gridSize)
        height = snapToGrid(height, gridSize)
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
        if (rawWidth <= -width || rawHeight <= -height) {
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
          const $handle = this.$container.find(
            `.${this.resizeClassName}[data-position="${revertedDir}"]`,
          )
          this.startHandle($handle[0])
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
        }
      } else if (data.action === 'rotating') {
        data = data as EventData.Rotating
        const theta = data.start - Point.create(pos).theta(data.center)
        let target = data.angle + theta
        if (options.rotateGrid) {
          target = snapToGrid(target, options.rotateGrid)
        }
        node.rotate(target, true)
      }
    }
  }

  protected onMouseUp(evt: JQuery.MouseUpEvent) {
    const data = this.getEventData<EventData.Resizing | EventData.Rotating>(evt)
    if (data.action) {
      this.stopOp()
      this.model.stopBatch(BATCH_NAME, { cid: this.cid })
    }
  }

  protected startHandle(handle: Element) {
    this.handle = handle

    this.$(handle).addClass(`${this.containerClassName}-active-handle`)
    this.$container.addClass(`${this.containerClassName}-active`)

    const pos = handle.getAttribute('data-position') as Node.ResizeDirection
    if (pos) {
      const dir = DIRECTIONS[POSITIONS.indexOf(pos)]
      this.$container.addClass(`${this.containerClassName}-cursor-${dir}`)
    }
  }

  protected stopHandle() {
    if (this.handle) {
      this.$(this.handle).removeClass(
        `${this.containerClassName}-active-handle`,
      )
      this.$container.removeClass(`${this.containerClassName}-active`)

      const pos = this.handle.getAttribute(
        'data-position',
      ) as Node.ResizeDirection
      if (pos) {
        const dir = DIRECTIONS[POSITIONS.indexOf(pos)]
        this.$container.removeClass(`${this.containerClassName}-cursor-${dir}`)
      }

      this.handle = null
    }
  }

  protected startOp(evt: JQuery.MouseDownEvent) {
    const elem = evt.target
    this.startHandle(elem)
    this.graph.undelegateEvents()
    this.delegateDocumentEvents(documentEvents, evt.data)
  }

  protected stopOp() {
    this.stopHandle()
    this.undelegateDocumentEvents()
    this.graph.delegateEvents()
  }
}

export namespace Transform {
  export type Direction = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

  export interface Options extends Widget.Options {
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number

    rotatable?: boolean
    rotateGrid?: number
    orthogonalResizing?: boolean
    /**
     * Set to `true` if you want the resizing to preserve the
     * aspect ratio of the node. Default is `false`.
     */
    preserveAspectRatio?: boolean
  }
}
