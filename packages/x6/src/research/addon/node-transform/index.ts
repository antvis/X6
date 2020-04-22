import { KeyValue } from '../../../types'
import { Angle, Point, snapToGrid } from '../../../geometry'
import { View } from '../../core/view'
import { Node } from '../../core/node'
import { Model } from '../../core/model'
import { Graph } from '../../core/graph'
import { NodeView } from '../../core/node-view'

const BATCH_NAME = 'node-transform'
const DIRECTIONS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
const POSITIONS = [
  'top-left',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
]

export class NodeTransform extends View {
  protected readonly options: NodeTransform.Options
  protected readonly node: Node
  protected readonly model: Model
  protected readonly graph: Graph
  protected readonly mouseMoveHandler: (e: JQuery.TriggeredEvent) => void
  protected readonly mouseUpHandler: (e: JQuery.TriggeredEvent) => void

  protected handle: Element | null
  protected action: 'resize' | 'rotate' | null
  protected data: NodeTransform.ResizeData | NodeTransform.RotateData | null
  protected previousDirectionsShift: number

  constructor(
    options: NodeTransform.Options &
      ({ view: NodeView } | { node: Node; graph: Graph }),
  ) {
    super()

    const { view, node, graph, ...others } = options as any
    if (view) {
      this.node = view.cell
      this.graph = view.graph
      this.model = this.graph.model
    } else if (node && graph) {
      this.node = node
      this.graph = graph
      this.model = this.graph.model
    }

    this.options = {
      padding: 2,
      rotateAngleGrid: 15,
      rotatable: true,
      preserveAspectRatio: false,
      minWidth: 0,
      minHeight: 0,
      maxWidth: Infinity,
      maxHeight: Infinity,
      allowOrthogonalResize: true,
      clearOther: true,
      clearOnBlankMouseDown: true,
      ...others,
    }

    if (this.options.clearOther) {
      NodeTransform.clear(this.graph)
    }

    this.mouseMoveHandler = this.onMouseMove.bind(this)
    this.mouseUpHandler = this.onMouseUp.bind(this)

    this.container = document.createElement('div')
    this.startListening()
    NodeTransform.register(this, this.graph)
  }

  protected startListening() {
    this.delegateEvents({
      'mousedown .resize': 'startResizing',
      'mousedown .rotate': 'startRotating',
      'touchstart .resize': 'startResizing',
      'touchstart .rotate': 'startRotating',
    })

    // Register mouse events.
    this.$(document.body).on('mousemove touchmove', this.mouseMoveHandler)
    this.$(document).on('mouseup touchend', this.mouseUpHandler)

    this.model.on('*', this.update, this)
    this.model.on('reseted', this.remove, this)
    this.node.on('removed', this.remove, this)

    this.graph.on('scale', this.update, this)
    this.graph.on('translate', this.update, this)

    if (this.options.clearOnBlankMouseDown) {
      this.graph.on('blank:mousedown', this.remove, this)
    }
  }

  protected stopListening() {
    this.undelegateEvents()

    this.$(document.body).off('mousemove touchmove', this.mouseMoveHandler)
    this.$(document).off('mouseup touchend', this.mouseUpHandler)

    this.model.off('*', this.update, this)
    this.model.off('reseted', this.remove, this)
    this.node.off('removed', this.remove, this)

    this.graph.off('scale', this.update, this)
    this.graph.off('translate', this.update, this)

    if (this.options.clearOnBlankMouseDown) {
      this.graph.off('blank:mousedown', this.remove, this)
    }
  }

  protected renderHandles() {
    const knob = this.$('<div/>').prop('draggable', false)
    const rotate = knob.clone().addClass('rotate')
    const resizes = POSITIONS.map(pos => {
      return knob
        .clone()
        .addClass('resize')
        .attr('data-position', pos)
    })
    this.empty()
    this.$(this.container).append(resizes, rotate)
  }

  render() {
    this.renderHandles()
    this.$(this.container)
      .addClass(this.prefixClassName('node-transform'))
      .toggleClass(
        'no-orth-resize',
        this.options.preserveAspectRatio || !this.options.allowOrthogonalResize,
      )
      .toggleClass('no-rotation', !this.options.rotatable)

    this.graph.container.appendChild(this.container)

    return this.update()
  }

  update() {
    const viewportCTM = this.graph.getMatrix()
    const bbox = this.node.getBBox()

    bbox.x *= viewportCTM.a
    bbox.x += viewportCTM.e
    bbox.y *= viewportCTM.d
    bbox.y += viewportCTM.f
    bbox.width *= viewportCTM.a
    bbox.height *= viewportCTM.d

    const padding = this.options.padding || 0
    const rotation = Angle.normalize(this.node.getRotation())
    const transform = rotation !== 0 ? `rotate(${rotation}deg)` : ''
    this.$(this.container).css({
      transform,
      width: bbox.width + padding * 2 + 2,
      height: bbox.height + padding * 2 + 2,
      left: bbox.x - (padding + 1),
      top: bbox.y - (padding + 1),
    })

    // Update the directions on the halo divs while the element being rotated.
    // The directions are represented by cardinal points (N,S,E,W). For example
    // the div originally pointed to north needs to be changed to point to south
    // if the node was rotated by 180 degrees.
    const shift = Math.floor(rotation * (DIRECTIONS.length / 360))
    if (shift !== this.previousDirectionsShift) {
      // Create the current directions array based on the calculated shift.
      const directions = DIRECTIONS.slice(shift).concat(
        DIRECTIONS.slice(0, shift),
      )
      this.$(this.container)
        .find('.resize')
        .removeClass(DIRECTIONS.join(' '))
        .each((index, elem) => {
          this.$(elem).addClass(directions[index])
        })
      this.previousDirectionsShift = shift
    }

    return this
  }

  remove() {
    this.stopListening()
    super.remove()
    NodeTransform.unregister(this, this.graph)
    return this
  }

  protected calculateTrueDirection(direction: string) {
    const angle = Angle.normalize(this.node.getRotation())
    let i = POSITIONS.indexOf(direction)

    i = i + Math.floor(angle * (POSITIONS.length / 360))
    i = i % POSITIONS.length

    return POSITIONS[i]
  }

  protected toValidResizeDirection(dir: string) {
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

    // Target's data attribute can contain one of 8 positions. Each position
    // defines the way how to resize an node. Whether to change the size on
    // x-axis, on y-axis or on both.

    const relativeDirection = this.$(evt.target).attr('data-position')!
    const trueDirection = this.calculateTrueDirection(relativeDirection)
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

    // Expose the initial setup, so `pointermove` method can access it.
    this.data = {
      selector,
      direction,
      trueDirection,
      relativeDirection,
      resizeX: rx,
      resizeY: ry,
      angle: Angle.normalize(this.node.getRotation()),
    }

    this.action = 'resize'
    this.startOp(evt.target)
  }

  protected startRotating(evt: JQuery.MouseDownEvent) {
    evt.stopPropagation()

    this.model.startBatch(BATCH_NAME, { cid: this.cid })

    const center = this.node.getBBox().getCenter()
    const client = this.graph.snapToGrid(evt.clientX, evt.clientY)
    this.data = {
      center,
      angle: Angle.normalize(this.node.getRotation()),
      start: Point.create(client).theta(center),
    }

    this.action = 'rotate'
    this.startOp(evt.target)
  }

  protected onMouseMove(evt: JQuery.MouseMoveEvent) {
    if (this.action) {
      const e = this.normalizeEvent(evt)
      const client = this.graph.snapToGrid(e.clientX, e.clientY)
      const gridSize = this.graph.options.gridSize
      const node = this.node
      const options = this.options

      if (this.action === 'resize') {
        const data = this.data as NodeTransform.ResizeData
        const currentRect = node.getBBox()
        const requestedSize = Point.create(client)
          .rotate(data.angle, currentRect.getCenter())
          .diff(currentRect[data.selector])

        let width = data.resizeX
          ? requestedSize.x * data.resizeX
          : currentRect.width

        let height = data.resizeY
          ? requestedSize.y * data.resizeY
          : currentRect.height

        width = snapToGrid(width, gridSize)
        height = snapToGrid(height, gridSize)
        width = Math.max(width, options.minWidth || gridSize)
        height = Math.max(height, options.minHeight || gridSize)
        width = Math.min(width, options.maxWidth || Infinity)
        height = Math.min(height, options.maxHeight || Infinity)

        if (options.preserveAspectRatio) {
          const candidateWidth =
            (currentRect.width * height) / currentRect.height
          const candidateHeight =
            (currentRect.height * width) / currentRect.width

          if (width < candidateWidth) {
            height = candidateHeight
          } else {
            width = candidateWidth
          }
        }

        if (currentRect.width !== width || currentRect.height !== height) {
          node.resize(width, height, {
            ui: true,
            direction: data.direction as any,
            relativeDirection: data.relativeDirection,
            trueDirection: data.trueDirection,
            minWidth: options.minWidth,
            minHeight: options.minHeight,
            maxWidth: options.maxWidth,
            maxHeight: options.maxHeight,
            preserveAspectRatio: options.preserveAspectRatio,
          })
        }
      } else if (this.action === 'rotate') {
        const data = this.data as NodeTransform.RotateData
        const theta = data.start - Point.create(client).theta(data.center)
        let target = data.angle + theta
        if (options.rotateAngleGrid) {
          target = snapToGrid(target, options.rotateAngleGrid)
        }
        node.rotate(target, true)
      }
    }
  }

  protected onMouseUp() {
    if (this.action) {
      this.stopOp()
      this.model.stopBatch(BATCH_NAME, { cid: this.cid })
      this.action = null
      this.data = null
    }
  }

  protected startOp(elem: Element) {
    if (elem) {
      this.$(elem).addClass('active')
      this.handle = elem
    }
    this.$(this.container).addClass('active')
    this.graph.undelegateEvents()
  }

  protected stopOp() {
    if (this.handle) {
      this.$(this.handle).removeClass('active')
      this.handle = null
    }
    this.$(this.container).removeClass('active')
    this.graph.delegateEvents()
  }
}

export namespace NodeTransform {
  export type Direction = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

  export interface Options {
    /**
     * Set to `true` if you want the resizing to preserve the
     * aspect ratio of the node. Default is `false`.
     */
    preserveAspectRatio?: boolean
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    rotateAngleGrid?: number
    allowOrthogonalResize?: boolean
    rotatable?: boolean
    clearOther?: boolean
    clearOnBlankMouseDown?: boolean
    padding: number
  }

  export interface ResizeData {
    selector: 'bottomLeft' | 'bottomRight' | 'topRight' | 'topLeft'
    direction: string
    trueDirection: string
    relativeDirection: string
    resizeX: number
    resizeY: number
    angle: number
  }

  export interface RotateData {
    center: Point
    angle: number
    start: number
  }
}

export namespace NodeTransform {
  const dic: KeyValue<KeyValue<NodeTransform>> = {}

  export function clear(graph: Graph) {
    graph.trigger('freetransform:create')
    removeInstances(graph)
  }

  export function removeInstances(graph: Graph) {
    const cache = dic[graph.cid]
    if (cache) {
      Object.keys(cache).forEach(cid => {
        const instance = cache[cid]
        if (instance) {
          instance.remove()
        }
      })
    }
  }

  export function getInstances(graph: Graph) {
    return dic[graph.cid] || {}
  }

  export function register(instance: NodeTransform, graph: Graph) {
    let cache = dic[graph.cid]
    if (cache == null) {
      cache = dic[graph.cid] = {}
    }
    cache[instance.cid] = instance
  }

  export function unregister(instance: NodeTransform, graph: Graph) {
    if (dic[graph.cid]) {
      delete dic[graph.cid][instance.cid]
    }
  }
}
