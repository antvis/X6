import { Dom, ObjectExt, Point, Vector, View } from '../@antv/x6'

// need: <meta http-equiv="x-ua-compatible" content="IE=Edge" />
export class PathDrawer extends View {
  public readonly options: PathDrawer.Options
  protected action: PathDrawer.Action
  protected pathElement: SVGPathElement
  protected pathTemplate: SVGPathElement
  protected controlElement: SVGPathElement
  protected startPointElement: SVGElement
  protected timeStamp: number | null
  protected readonly MOVEMENT_DETECTION_THRESHOLD = 150

  protected get vel() {
    return Vector.create(this.container as SVGGElement)
  }

  constructor(
    options: Partial<PathDrawer.Options> & { target: SVGSVGElement },
  ) {
    super()
    this.options = ObjectExt.merge(
      {},
      PathDrawer.defaultOptions,
      options,
    ) as PathDrawer.Options

    this.action = 'awaiting-input'
    this.render()
    this.startListening()
  }

  protected render() {
    const options = this.options
    this.container = Dom.createSvgElement<SVGGElement>('g')
    Dom.addClass(this.container, this.prefixClassName('path-drawer'))

    this.pathTemplate = Dom.createSvgElement<SVGPathElement>('path')
    Dom.attr(this.pathTemplate, options.pathAttributes)

    this.startPointElement = Vector.create(options.startPointMarkup).addClass(
      'start-point',
    ).node as SVGElement

    this.controlElement = Dom.createSvgElement<SVGPathElement>('path')
    Dom.addClass(this.controlElement, 'control-path')

    Vector.create('rect', {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
      fill: 'transparent',
      stroke: 'none',
    }).appendTo(this.container)

    this.options.target.appendChild(this.container)

    return this
  }

  protected onRemove() {
    this.remove(this.pathElement)
    this.clear()
    this.stopListening()
  }

  protected startListening() {
    this.delegateEvents({
      mousedown: 'onMouseDown',
      touchstart: 'onMouseDown',
      dblclick: 'onDoubleClick',
      contextmenu: 'onContextMenu',
      'mousedown .start-point': 'onStartPointMouseDown',
      'touchstart .start-point': 'onStartPointMouseDown',
    })
  }

  protected stopListening() {
    this.undelegateEvents()
  }

  clear() {
    const path = this.pathElement
    if (path && path.pathSegList.numberOfItems <= 1) {
      this.remove(path)
    }
    this.startPointElement.remove()
    this.controlElement.remove()
    this.undelegateDocumentEvents()
    this.action = 'awaiting-input'
    this.emit('clear')
  }

  createPath(x: number, y: number) {
    this.pathElement = this.pathTemplate.cloneNode(true) as SVGPathElement

    this.addMoveSegment(x, y)
    Dom.translate(this.startPointElement, x, y, {
      absolute: true,
    })

    this.vel.before(this.pathElement)
    this.vel.append(this.startPointElement)

    this.emit('path:create', { path: this.pathElement })
  }

  closePath() {
    const path = this.pathElement
    const first = this.getPathSeg(path, 0)
    const last = this.getPathSeg(path, -1)
    if (last.pathSegType === SVGPathSeg.PATHSEG_LINETO_ABS) {
      path.pathSegList.replaceItem(
        path.createSVGPathSegClosePath(),
        path.pathSegList.numberOfItems - 1,
      )
    } else {
      last.x = first.x
      last.y = first.y
      path.pathSegList.appendItem(path.createSVGPathSegClosePath())
    }
    this.finishPath('path:close')
  }

  finishPath(name: string) {
    const path = this.pathElement
    if (path && this.numberOfVisibleSegments() > 0) {
      this.emit('path:finish', { path })
      this.trigger(name, { path })
    } else {
      this.emit('path:abort', { path })
    }
    this.clear()
  }

  numberOfVisibleSegments() {
    const path = this.pathElement
    let remaining = path.pathSegList.numberOfItems
    remaining -= 1
    const last = this.getPathSeg(path, -1)
    if (last.pathSegType === SVGPathSeg.PATHSEG_CLOSEPATH) {
      remaining -= 1
    }
    return remaining
  }

  addMoveSegment(x: number, y: number) {
    const path = this.pathElement
    const seg = path.createSVGPathSegMovetoAbs(x, y)
    path.pathSegList.appendItem(seg)
    this.emit('path:segment:add', { path })
    this.emit('path:move-segment:add', { path })
  }

  addLineSegment(x: number, y: number) {
    const path = this.pathElement
    const seg = path.createSVGPathSegLinetoAbs(x, y)
    path.pathSegList.appendItem(seg)
    this.emit('path:segment:add', { path })
    this.emit('path:line-segment:add', { path })
  }

  addCurveSegment(
    x: number,
    y: number,
    x1: number,
    y1: number,
    x2?: number,
    y2?: number,
  ) {
    const path = this.pathElement
    const seg = path.createSVGPathSegCurvetoCubicAbs(
      x,
      y,
      x1,
      y1,
      x2 || x,
      y2 || y,
    )
    path.pathSegList.appendItem(seg)
    this.emit('path:segment:add', { path })
    this.emit('path:curve-segment:add', { path })
  }

  adjustLastSegment(
    x: number | null,
    y: number | null,
    x1?: number | null,
    y1?: number | null,
    x2?: number,
    y2?: number,
  ) {
    const path = this.pathElement
    const snapRadius = this.options.snapRadius
    if (snapRadius && x != null && y != null) {
      const snaped = this.snapLastSegmentCoordinates(x, y, snapRadius)
      x = snaped.x // eslint-disable-line
      y = snaped.y // eslint-disable-line
    }

    const seg = this.getPathSeg(path, -1)

    if (x != null) {
      seg.x = x
    }
    if (y != null) {
      seg.y = y
    }

    if (x1 != null) {
      seg.x1 = x1
    }
    if (y1 != null) {
      seg.y1 = y1
    }

    if (x2 != null) {
      seg.x2 = x2
    }
    if (y2 != null) {
      seg.y2 = y2
    }

    this.emit('path:edit', { path })
    this.emit('path:last-segment:adjust', { path })
  }

  snapLastSegmentCoordinates(x: number, y: number, snapRadius: number) {
    const path = this.pathElement
    let xSnaped = false
    let ySnaped = false
    let targetX = x
    let targetY = y

    for (
      let i = path.pathSegList.numberOfItems - 2;
      i >= 0 && (!xSnaped || !ySnaped);
      i -= 1
    ) {
      const seg = this.getPathSeg(path, i)
      if (!xSnaped && Math.abs(seg.x - x) < snapRadius) {
        targetX = seg.x
        xSnaped = true
      }
      if (!ySnaped && Math.abs(seg.y - y) < snapRadius) {
        targetY = seg.y
        ySnaped = true
      }
    }
    return new Point(targetX, targetY)
  }

  removeLastSegment() {
    const path = this.pathElement
    path.pathSegList.removeItem(path.pathSegList.numberOfItems - 1)
    this.emit('path:edit', { path })
    this.emit('path:last-segment:remove', { path })
  }

  findControlPoint(x: number, y: number) {
    const path = this.pathElement
    const seg = this.getPathSeg(path, -1)
    return new Point(x, y).reflection(seg)
  }

  replaceLastSegmentWithCurve() {
    const path = this.pathElement
    const last = this.getPathSeg(path, -1)
    const prev = this.getPathSeg(path, -2)
    const seg = path.createSVGPathSegCurvetoCubicAbs(
      last.x,
      last.y,
      prev.x,
      prev.y,
      last.x,
      last.y,
    )
    path.pathSegList.replaceItem(seg, path.pathSegList.numberOfItems - 1)
    this.emit('path:edit', { path })
    this.emit('path:last-segment:replace-with-curve', { path })
  }

  adjustControlPath(x1: number, y1: number, x2: number, y2: number) {
    const controlPathElement = this.controlElement
    controlPathElement.pathSegList.initialize(
      controlPathElement.createSVGPathSegMovetoAbs(x1, y1),
    )
    controlPathElement.pathSegList.appendItem(
      controlPathElement.createSVGPathSegLinetoAbs(x2, y2),
    )
    this.vel.append(controlPathElement)

    const path = this.pathElement
    this.emit('path:interact', { path })
    this.emit('path:control:adjust', { path })
  }

  removeControlPath() {
    const path = this.pathElement
    const svgControl = this.controlElement
    svgControl.pathSegList.clear()
    this.vel.append(svgControl)
    this.emit('path:interact', { path })
    this.emit('path:control:remove', { path })
  }

  protected getPathSeg(path: SVGPathElement, index: number) {
    const i = index < 0 ? path.pathSegList.numberOfItems + index : index
    return path.pathSegList.getItem(i) as SVGPathSegCurvetoCubicAbs
  }

  protected onMouseDown(evt: JQuery.MouseDownEvent) {
    const e = this.normalizeEvent(evt)
    e.stopPropagation()

    if (
      this.isLeftMouseDown(e) &&
      this.isSamePositionEvent(e) &&
      this.container.parentNode
    ) {
      const local = this.vel.toLocalPoint(e.clientX, e.clientY)
      switch (this.action) {
        case 'awaiting-input':
          this.createPath(local.x, local.y)
          this.action = 'path-created'
          this.delegateDocumentEvents(PathDrawer.documentEvents)
          break
        case 'adjusting-line-end':
          this.action = 'awaiting-line-end'
          break
        case 'adjusting-curve-end':
          this.action = 'awaiting-curve-control-2'
          break
        default:
          break
      }
      this.timeStamp = e.timeStamp
    }
  }

  protected onMouseMove(evt: JQuery.MouseMoveEvent) {
    const e = this.normalizeEvent(evt)
    e.stopPropagation()
    if (this.action !== 'awaiting-input') {
      const local = this.vel.toLocalPoint(e.clientX, e.clientY)
      const timeStamp = this.timeStamp
      if (timeStamp) {
        if (e.timeStamp - timeStamp < this.MOVEMENT_DETECTION_THRESHOLD) {
          switch (this.action) {
            case 'path-created': {
              const translate = Dom.translate(this.startPointElement)
              this.adjustControlPath(
                translate.tx,
                translate.ty,
                local.x,
                local.y,
              )
              break
            }
            case 'awaiting-line-end':
            case 'adjusting-curve-control-1': {
              this.adjustLastSegment(local.x, local.y)
              break
            }
            case 'awaiting-curve-control-2': {
              this.adjustLastSegment(
                local.x,
                local.y,
                null,
                null,
                local.x,
                local.y,
              )
              break
            }
            default:
              break
          }
        } else {
          switch (this.action) {
            case 'path-created':
              this.action = 'adjusting-curve-control-1'
              break
            case 'awaiting-line-end':
              this.replaceLastSegmentWithCurve()
              this.action = 'adjusting-curve-control-2'
              break
            case 'awaiting-curve-control-2':
              this.action = 'adjusting-curve-control-2'
              break
            case 'adjusting-curve-control-1': {
              const translate = Dom.translate(this.startPointElement)
              this.adjustControlPath(
                translate.tx,
                translate.ty,
                local.x,
                local.y,
              )
              break
            }
            case 'adjusting-curve-control-2': {
              const controlPoint = this.findControlPoint(local.x, local.y)
              this.adjustLastSegment(
                null,
                null,
                null,
                null,
                controlPoint.x,
                controlPoint.y,
              )
              this.adjustControlPath(
                controlPoint.x,
                controlPoint.y,
                local.x,
                local.y,
              )
              break
            }
            default:
              break
          }
        }
      } else {
        switch (this.action) {
          case 'adjusting-line-end':
            this.adjustLastSegment(local.x, local.y)
            break
          case 'adjusting-curve-end':
            this.adjustLastSegment(
              local.x,
              local.y,
              null,
              null,
              local.x,
              local.y,
            )
            break

          default:
            break
        }
      }
    }
  }

  protected onPointerUp(evt: JQuery.MouseUpEvent) {
    this.timeStamp = null
    const e = this.normalizeEvent(evt)
    e.stopPropagation()
    if (this.isLeftMouseDown(e) && this.isSamePositionEvent(e)) {
      const local = this.vel.toLocalPoint(e.clientX, e.clientY)
      switch (this.action) {
        case 'path-created':
        case 'awaiting-line-end':
          this.addLineSegment(local.x, local.y)
          this.action = 'adjusting-line-end'
          break
        case 'awaiting-curve-control-2':
          this.removeControlPath()
          this.addLineSegment(local.x, local.y)
          this.action = 'adjusting-line-end'
          break
        case 'adjusting-curve-control-1':
        case 'adjusting-curve-control-2':
          this.addCurveSegment(local.x, local.y, local.x, local.y)
          this.action = 'adjusting-curve-end'
          break

        default:
          break
      }
    }
  }

  protected onStartPointMouseDown(evt: JQuery.MouseDownEvent) {
    const e = this.normalizeEvent(evt)
    e.stopPropagation()
    if (this.isLeftMouseDown(e) && this.isSamePositionEvent(e)) {
      this.closePath()
    }
  }

  protected onDoubleClick(evt: JQuery.DoubleClickEvent) {
    const e = this.normalizeEvent(evt)
    e.preventDefault()
    e.stopPropagation()
    if (this.isLeftMouseDown(e)) {
      if (this.pathElement && this.numberOfVisibleSegments() > 0) {
        this.removeLastSegment()
        this.finishPath('path:stop')
      }
    }
  }

  protected onContextMenu(evt: JQuery.ContextMenuEvent) {
    const e = this.normalizeEvent(evt)
    e.preventDefault()
    e.stopPropagation()
    if (this.isSamePositionEvent(e)) {
      if (this.pathElement && this.numberOfVisibleSegments() > 0) {
        this.removeLastSegment()
        this.finishPath('path:stop')
      }
    }
  }

  protected isLeftMouseDown(e: JQuery.TriggeredEvent) {
    return (e.which || 0) <= 1
  }

  protected isSamePositionEvent(
    e: JQuery.ContextMenuEvent | JQuery.MouseDownEvent | JQuery.MouseUpEvent,
  ) {
    const originalEvent = e.originalEvent
    return originalEvent == null || originalEvent.detail <= 1
  }
}

// eslint-disable-next-line
export namespace PathDrawer {
  export interface Options {
    /**
     * The drawing area. Any paths drawn by the user are appended to this
     * <svg> element. They are not removed when the PathDrawer is removed.
     */
    target: SVGSVGElement
    /**
     * An object with CSS attributes of the new path.
     */
    pathAttributes: { [name: string]: string | null | number }
    /**
     * The SVG markup of control point overlay elements.
     */
    startPointMarkup: string
    /**
     *  If set to a number greater than zero, the endpoint of the current
     * segment snaps to the x- and y-values of previously drawn segment
     * endpoints. The number determines the distance for snapping.
     */
    snapRadius: number
  }

  export type Action =
    | 'awaiting-input'
    | 'path-created'
    | 'awaiting-line-end'
    | 'adjusting-line-end'
    | 'adjusting-curve-end'
    | 'awaiting-curve-control-1'
    | 'awaiting-curve-control-2'
    | 'adjusting-curve-control-1'
    | 'adjusting-curve-control-2'

  interface CommonEventArgs {
    path: SVGPathElement
  }

  export interface EventArgs {
    clear?: null
    'path:create': CommonEventArgs
    'path:close': CommonEventArgs
    'path:stop': CommonEventArgs
    'path:finish': CommonEventArgs
    'path:abort': CommonEventArgs

    'path:segment:add': CommonEventArgs
    'path:move-segment:add': CommonEventArgs
    'path:line-segment:add': CommonEventArgs
    'path:curve-segment:add': CommonEventArgs

    'path:edit': CommonEventArgs
    'path:last-segment:adjust': CommonEventArgs
    'path:last-segment:remove': CommonEventArgs
    'path:last-segment:replace-with-curve': CommonEventArgs

    'path:interact': CommonEventArgs
    'path:control:adjust': CommonEventArgs
    'path:control:remove': CommonEventArgs
  }

  export const defaultOptions: Partial<Options> = {
    pathAttributes: {
      class: null,
      fill: '#ffffff',
      stroke: '#000000',
      'stroke-width': 1,
      'pointer-events': 'none',
    },
    startPointMarkup: '<circle r="5"/>',
    snapRadius: 0,
  }

  export const documentEvents = {
    mousemove: 'onMouseMove',
    touchmove: 'onMouseMove',
    mouseup: 'onMouseUp',
    touchend: 'onMouseUp',
    touchcancel: 'onMouseUp',
  }
}
