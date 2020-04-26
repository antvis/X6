import { View } from '../../core/view'
import { Graph } from '../../core/graph'
import { FunctionExt } from '../../../util'
import { DeepPartial } from 'utility-types'
import { Scroller } from '../scroller'

export class MiniMap extends View {
  public readonly options: MiniMap.Options
  public readonly container: HTMLDivElement
  public readonly $container: JQuery<HTMLElement>
  protected readonly $viewport: JQuery<HTMLElement>
  protected readonly sourceGraph: Graph
  protected readonly targetGraph: Graph
  protected ratio: number
  protected cssGeometry: MiniMap.ViewGeometry

  protected get scroller() {
    return this.options.scroller
  }

  constructor(options: DeepPartial<MiniMap.Options> & { scroller: Scroller }) {
    super()

    this.options = {
      ...MiniMap.defaultOptions,
      ...options,
    } as MiniMap.Options

    this.updateViewport = FunctionExt.debounce(
      this.updateViewport.bind(this),
      0,
    )

    this.container = document.createElement('div')
    this.$container = this.$(this.container).addClass(
      this.prefixClassName('widget-minimap'),
    )

    this.$viewport = this.$('<div>').addClass('viewport')

    if (this.options.zoom) {
      this.$('<div>')
        .addClass('viewport-control')
        .appendTo(this.$viewport)
    }

    this.$container.append(this.$viewport).css({
      width: this.options.width,
      height: this.options.height,
      padding: this.options.padding,
    })

    const graphContainer = document.createElement('div')
    this.container.appendChild(graphContainer)
    if (this.options.container) {
      this.options.container.appendChild(this.container)
    }

    this.sourceGraph = this.scroller.graph
    this.targetGraph = new this.options.graphConstructor({
      ...this.options.graphOptions,
      container: graphContainer,
      model: this.sourceGraph.model,
      interactive: false,
      frozen: true,
      gridSize: 1,
    })

    this.targetGraph.unfreeze()

    this.updatePaper(
      this.sourceGraph.options.width,
      this.sourceGraph.options.height,
    )

    this.startListening()
  }

  protected startListening() {
    this.scroller.$container.on(
      `scroll${this.getEventNamespace()}`,
      this.updateViewport,
    )
    this.sourceGraph.on('resize', this.updatePaper, this)
    this.delegateEvents({
      mousedown: 'startAction',
      touchstart: 'startAction',
      [`mousedown .${this.prefixClassName('graph')}`]: 'scrollTo',
      [`touchstart .${this.prefixClassName('graph')}`]: 'scrollTo',
    })
  }

  protected stopListening() {
    this.scroller.$container.off(this.getEventNamespace())
    this.sourceGraph.off('resize', this.updatePaper, this)
    this.undelegateEvents()
  }

  protected onRemove() {
    this.targetGraph.remove()
    this.stopListening()
  }

  protected updatePaper(width: number, height: number): this
  protected updatePaper({ width, height }: Graph.EventArgs['resize']): this
  protected updatePaper(w: number | Graph.EventArgs['resize'], h?: number) {
    let width: number
    let height: number
    if (typeof w === 'object') {
      width = w.width
      height = w.height
    } else {
      width = w
      height = h as number
    }

    const origin = this.sourceGraph.options.origin
    const scale = this.sourceGraph.getScale()
    const maxWidth = this.options.width - 2 * this.options.padding
    const maxHeight = this.options.height - 2 * this.options.padding

    width = width / scale.sx // tslint:disable-line
    height = height / scale.sy // tslint:disable-line

    this.ratio = Math.min(maxWidth / width, maxHeight / height)

    const ratio = this.ratio
    const x = (origin.x * ratio) / scale.sx
    const y = (origin.y * ratio) / scale.sy

    width = width * ratio // tslint:disable-line
    height = height * ratio // tslint:disable-line
    this.targetGraph.resize(width, height)
    this.targetGraph.setOrigin(x, y)
    this.targetGraph.scale(ratio, ratio)
    this.updateViewport()
    return this
  }

  protected updateViewport() {
    const ratio = this.ratio
    const scale = this.sourceGraph.getScale()
    const scroller = this.scroller
    const origin = scroller.clientToLocalPoint(0, 0)
    const position = this.$(this.targetGraph.container).position()
    const translation = this.targetGraph.getTranslation()
    translation.ty = translation.ty || 0

    this.cssGeometry = {
      top: position.top + origin.y * ratio + translation.ty,
      left: position.left + origin.x * ratio + translation.tx,
      width: (scroller.$container.innerWidth()! * ratio) / scale.sx,
      height: (scroller.$container.innerHeight()! * ratio) / scale.sy,
    }
    this.$viewport.css(this.cssGeometry)
  }

  protected startAction(e: JQuery.MouseDownEvent) {
    e = this.normalizeEvent(e) // tslint:disable-line
    const action = this.$(e.target).hasClass('current-view-control')
      ? 'zooming'
      : 'panning'
    const eventData: MiniMap.EventData = {
      action,
      clientX: e.clientX,
      clientY: e.clientY,
      scrollLeft: this.scroller.container.scrollLeft,
      scrollTop: this.scroller.container.scrollTop,
      zoom: this.scroller.zoom(),
      scale: this.sourceGraph.getScale(),
      geometry: this.cssGeometry,
    }

    this.delegateDocumentEvents(MiniMap.documentEvents, eventData)
  }

  protected doAction(e: JQuery.MouseMoveEvent) {
    e = this.normalizeEvent(e) // tslint:disable-line
    const clientX = e.clientX
    const clientY = e.clientY
    const data = e.data as MiniMap.EventData
    switch (data.action) {
      case 'panning': {
        const scale = this.sourceGraph.getScale()
        const rx = (clientX - data.clientX) * scale.sx
        const ry = (clientY - data.clientY) * scale.sy
        this.scroller.container.scrollLeft = data.scrollLeft + rx / this.ratio
        this.scroller.container.scrollTop = data.scrollTop + ry / this.ratio
        break
      }

      case 'zooming': {
        const zoom = this.options.zoom
        const startScale = data.scale
        const startGeometry = data.geometry
        const delta =
          1 + (data.clientX - clientX) / startGeometry.width / startScale.sx

        if (data.frameId) {
          cancelAnimationFrame(data.frameId)
        }

        data.frameId = requestAnimationFrame(() => {
          this.scroller.zoom(delta * data.zoom, {
            absolute: true,
            ...zoom,
          })
        })
        break
      }
    }
  }

  protected stopAction() {
    this.undelegateDocumentEvents()
  }

  protected scrollTo(e: JQuery.MouseDownEvent) {
    e = this.normalizeEvent(e) // tslint:disable-line

    let x
    let y

    const ts = this.targetGraph.getTranslation()
    ts.ty = ts.ty || 0

    if (e.offsetX == null) {
      const offset = this.$(this.targetGraph.container).offset()!
      x = e.pageX - offset.left
      y = e.pageY - offset.top
    } else {
      x = e.offsetX
      y = e.offsetY
    }

    const cx = (x - ts.tx) / this.ratio
    const cy = (y - ts.ty) / this.ratio
    this.scroller.center(cx, cy)
  }
}

export namespace MiniMap {
  export interface Options {
    scroller: Scroller
    container?: HTMLElement
    width: number
    height: number
    padding: number
    zoom: {
      min: number
      max: number
    }
    graphConstructor: typeof Graph & (new (...args: any[]) => Graph)
    graphOptions?: any
  }

  export const defaultOptions: DeepPartial<Options> = {
    graphConstructor: Graph,
    graphOptions: {},
    zoom: {
      min: 0.5,
      max: 2,
    },
    width: 300,
    height: 200,
    padding: 10,
  }

  export const documentEvents = {
    mousemove: 'doAction',
    touchmove: 'doAction',
    mouseup: 'stopAction',
    touchend: 'stopAction',
  }

  export interface ViewGeometry extends JQuery.PlainObject<number> {
    top: number
    left: number
    width: number
    height: number
  }

  export interface EventData {
    frameId?: number
    action: 'zooming' | 'panning'
    clientX: number
    clientY: number
    scrollLeft: number
    scrollTop: number
    zoom: number
    scale: { sx: number; sy: number }
    geometry: ViewGeometry
  }
}
