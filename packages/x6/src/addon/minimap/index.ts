import { FunctionExt } from '../../util'
import { View } from '../../view/view'
import { Graph } from '../../graph/graph'
import { EventArgs } from '../../graph/events'
import { Scroller } from '../scroller'

namespace ClassName {
  export const root = 'widget-minimap'
  export const viewport = `${root}-viewport`
  export const zoom = `${viewport}-zoom`
}

export class MiniMap extends View {
  public readonly options: MiniMap.Options
  public readonly container: HTMLDivElement
  public readonly $container: JQuery<HTMLElement>
  protected readonly zoomHandle: HTMLDivElement
  protected readonly $viewport: JQuery<HTMLElement>
  protected readonly sourceGraph: Graph
  protected readonly targetGraph: Graph
  protected geometry: Util.ViewGeometry
  protected ratio: number

  protected get scroller() {
    return this.options.scroller
  }

  constructor(options: Partial<MiniMap.Options> & { scroller: Scroller }) {
    super()

    this.options = {
      ...Util.defaultOptions,
      ...options,
    } as MiniMap.Options

    this.updateViewport = FunctionExt.debounce(
      this.updateViewport.bind(this),
      0,
    )

    this.container = document.createElement('div')
    this.$container = this.$(this.container).addClass(
      this.prefixClassName(ClassName.root),
    )

    const graphContainer = document.createElement('div')
    this.container.appendChild(graphContainer)

    this.$viewport = this.$('<div>').addClass(
      this.prefixClassName(ClassName.viewport),
    )

    if (this.options.scalable) {
      this.zoomHandle = this.$('<div>')
        .addClass(this.prefixClassName(ClassName.zoom))
        .appendTo(this.$viewport)
        .get(0)
    }

    this.$container.append(this.$viewport).css({
      width: this.options.width,
      height: this.options.height,
      padding: this.options.padding,
    })

    if (this.options.container) {
      this.options.container.appendChild(this.container)
    }

    this.sourceGraph = this.scroller.graph
    const targetGraphOptions: Graph.Options = {
      ...this.options.graphOptions,
      container: graphContainer,
      model: this.sourceGraph.model,
      frozen: true,
      interacting: false,
      grid: false,
      background: false,
      rotating: false,
      resizing: false,
      embedding: false,
      selecting: false,
      snapline: false,
      clipboard: false,
      history: false,
      scroller: false,
    }

    this.targetGraph = this.options.createGraph
      ? this.options.createGraph(targetGraphOptions)
      : new Graph(targetGraphOptions)

    this.targetGraph.renderer.unfreeze()

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
    this.targetGraph.view.remove()
    this.stopListening()
  }

  protected updatePaper(width: number, height: number): this
  protected updatePaper({ width, height }: EventArgs['resize']): this
  protected updatePaper(w: number | EventArgs['resize'], h?: number) {
    let width: number
    let height: number
    if (typeof w === 'object') {
      width = w.width
      height = w.height
    } else {
      width = w
      height = h as number
    }

    const origin = this.sourceGraph.options
    const scale = this.sourceGraph.scale()
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
    this.targetGraph.resizeGraph(width, height)
    this.targetGraph.translate(x, y)
    this.targetGraph.scale(ratio, ratio)
    this.updateViewport()
    return this
  }

  protected updateViewport() {
    const ratio = this.ratio
    const scale = this.sourceGraph.scale()
    const scroller = this.scroller
    const origin = scroller.clientToLocalPoint(0, 0)
    const position = this.$(this.targetGraph.container).position()
    const translation = this.targetGraph.translate()
    translation.ty = translation.ty || 0

    this.geometry = {
      top: position.top + origin.y * ratio + translation.ty,
      left: position.left + origin.x * ratio + translation.tx,
      width: (scroller.$container.innerWidth()! * ratio) / scale.sx,
      height: (scroller.$container.innerHeight()! * ratio) / scale.sy,
    }
    this.$viewport.css(this.geometry)
  }

  protected startAction(evt: JQuery.MouseDownEvent) {
    const e = this.normalizeEvent(evt)
    const action = e.target === this.zoomHandle ? 'zooming' : 'panning'
    const eventData: Util.EventData = {
      action,
      clientX: e.clientX,
      clientY: e.clientY,
      scrollLeft: this.scroller.container.scrollLeft,
      scrollTop: this.scroller.container.scrollTop,
      zoom: this.scroller.zoom(),
      scale: this.sourceGraph.scale(),
      geometry: this.geometry,
    }

    this.delegateDocumentEvents(Util.documentEvents, eventData)
  }

  protected doAction(evt: JQuery.MouseMoveEvent) {
    const e = this.normalizeEvent(evt)
    const clientX = e.clientX
    const clientY = e.clientY
    const data = e.data as Util.EventData
    switch (data.action) {
      case 'panning': {
        const scale = this.sourceGraph.scale()
        const rx = (clientX - data.clientX) * scale.sx
        const ry = (clientY - data.clientY) * scale.sy
        this.scroller.container.scrollLeft = data.scrollLeft + rx / this.ratio
        this.scroller.container.scrollTop = data.scrollTop + ry / this.ratio
        break
      }

      case 'zooming': {
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
            minScale: this.options.minScale,
            maxScale: this.options.maxScale,
          })
        })
        break
      }
    }
  }

  protected stopAction() {
    this.undelegateDocumentEvents()
  }

  protected scrollTo(evt: JQuery.MouseDownEvent) {
    const e = this.normalizeEvent(evt)

    let x
    let y

    const ts = this.targetGraph.translate()
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
    this.scroller.centerPoint(cx, cy)
  }

  @View.dispose()
  dispose() {
    this.targetGraph.dispose()
    this.remove()
  }
}

export namespace MiniMap {
  export interface Options {
    scroller: Scroller
    container?: HTMLElement
    width: number
    height: number
    padding: number
    scalable?: boolean
    minScale?: number
    maxScale?: number
    createGraph?: (options: Graph.Options) => Graph
    graphOptions?: Graph.Options
  }
}

namespace Util {
  export const defaultOptions: Partial<MiniMap.Options> = {
    width: 300,
    height: 200,
    padding: 10,
    scalable: true,
    minScale: 0.01,
    maxScale: 16,
    graphOptions: {},
    createGraph: (options) => new Graph(options),
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
