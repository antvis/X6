import { ObjectExt, FunctionExt } from '../../util'
import { Rectangle } from '../../geometry'
import { Cell } from '../../model/cell'
import { Edge } from '../../model/edge'
import { CellView } from '../../view/cell'
import { Widget, Handle } from '../common'
import { NodePreset } from './node-preset'
import { EdgePreset } from './edge-preset'

export class Halo extends Widget<Halo.Options> implements Handle {
  protected $container: JQuery<HTMLElement>
  protected $content: JQuery<HTMLElement>

  protected get type() {
    return this.options.type || 'surround'
  }

  protected get handleOptions() {
    return this.options
  }

  init(options: Halo.Options) {
    this.options = ObjectExt.merge(
      Halo.defaultOptions,
      this.cell.isNode()
        ? new NodePreset(this).getPresets()
        : this.cell.isEdge()
        ? new EdgePreset(this).getPresets()
        : null,
      options,
    )

    this.render()
    this.initHandles()
    this.update()
    this.startListening()
  }

  protected startListening() {
    const model = this.model
    const graph = this.graph
    const cell = this.view.cell

    cell.on('removed', this.remove, this)
    model.on('reseted', this.remove, this)
    graph.on('halo:destroy', this.remove, this)

    model.on('*', this.update, this)
    graph.on('scale', this.update, this)
    graph.on('translate', this.update, this)

    super.startListening()
  }

  protected stopListening() {
    const model = this.model
    const graph = this.graph
    const cell = this.view.cell

    this.undelegateEvents()

    cell.off('removed', this.remove, this)
    model.off('reseted', this.remove, this)
    graph.off('halo:destroy', this.remove, this)

    model.off('*', this.update, this)
    graph.off('scale', this.update, this)
    graph.off('translate', this.update, this)

    super.stopListening()
  }

  protected render() {
    const options = this.options
    const cls = this.prefixClassName('widget-halo')
    this.view.addClass(Private.NODE_CLS)
    this.container = document.createElement('div')
    this.$container = this.$(this.container)
      .addClass(cls)
      .attr('data-shape', this.view.cell.shape)

    if (options.className) {
      this.$container.addClass(options.className)
    }

    this.$handleContainer = this.$('<div/>')
      .addClass(`${cls}-handles`)
      .appendTo(this.container)

    this.$content = this.$('<div/>')
      .addClass(`${cls}-content`)
      .appendTo(this.container)

    this.$container.appendTo(this.graph.container)

    return this
  }

  remove() {
    this.stopBatch()
    this.view.removeClass(Private.NODE_CLS)
    return super.remove()
  }

  protected update() {
    if (this.isRendered()) {
      this.updateContent()
      const bbox = this.getBBox()
      const tinyThreshold = this.options.tinyThreshold || 0
      const smallThreshold = this.options.smallThreshold || 0

      this.$handleContainer.toggleClass(
        `${this.handleClassName}-tiny`,
        bbox.width < tinyThreshold && bbox.height < tinyThreshold,
      )

      const className = `${this.handleClassName}-small`
      this.$handleContainer.toggleClass(
        className,
        !this.$handleContainer.hasClass(className) &&
          bbox.width < smallThreshold &&
          bbox.height < smallThreshold,
      )

      this.$container.css({
        width: bbox.width,
        height: bbox.height,
        left: bbox.x,
        top: bbox.y,
      })

      if (this.hasHandle('unlink')) {
        this.toggleUnlink()
      }

      if (this.type === 'surround' || this.type === 'toolbar') {
        if (this.hasHandle('fork')) {
          this.toggleFork()
        }
      }
    }
  }

  protected updateContent() {
    const content = this.options.content
    if (typeof content === 'function') {
      const ret = FunctionExt.call(content, this, this.view, this.$content[0])
      if (ret) {
        this.$content.html(ret)
      }
    } else if (content) {
      this.$content.html(content)
    } else {
      this.$content.remove()
    }
  }

  protected getBBox() {
    const view = this.view
    const bbox = this.options.bbox
    const rect =
      typeof bbox === 'function' ? FunctionExt.call(bbox, this, view) : bbox

    return Rectangle.create({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      ...rect,
    })
  }

  protected removeCell() {
    this.cell.remove()
  }

  protected toggleFork() {
    const cell = this.view.cell.clone()
    const view = this.graph.hook.createCellView(cell)!
    const valid = this.graph.hook.validateConnection(
      this.view,
      null,
      view,
      null,
      'target',
    )
    this.$handleContainer.children('.fork').toggleClass('hidden', !valid)
    view.remove()
  }

  protected toggleUnlink() {
    const hasEdges = this.model.getConnectedEdges(this.view.cell).length > 0
    this.$handleContainer.children('.unlink').toggleClass('hidden', !hasEdges)
  }

  // #region batch

  startBatch() {
    this.model.startBatch('halo', {
      halo: this.cid,
    })
  }

  stopBatch() {
    if (this.model.hasActiveBatch('halo')) {
      this.model.stopBatch('halo', {
        halo: this.cid,
      })
    }
  }

  // #endregion
}

export namespace Halo {
  export interface Options extends Handle.Options, Widget.Options {
    className?: string
    /**
     * The preferred side for a self-loop edge created from Halo
     */
    loopEdgePreferredSide?: 'top' | 'bottom' | 'left' | 'right'
    loopEdgeWidth?: number
    rotateGrid?: number
    rotateEmbeds?: boolean
    content?:
      | false
      | string
      | ((cellView: CellView, boxElement: HTMLElement) => string)

    /**
     * If set to true, the cell position and dimensions will be used as a
     * basis for the Halo tools position. By default, this is set to `false`
     * which causes the Halo tools position be based on the bounding box of
     * the element view. Sometimes though, your shapes can have certain SVG
     * sub elements that stick out of the view and you don't want these sub
     * elements to affect the Halo tools position. In this case, set the
     * `useCellGeometry` to true.
     */
    useCellGeometry?: boolean

    /**
     * This function will be called when cloning or forking actions take
     * place and it should return a clone of the original cell. This is
     * useful e.g. if you want the clone to be moved by an offset after
     * the user clicks the clone handle.
     */
    clone?: (cell: Cell, opt: any) => Cell

    /**
     * A bounding box within which the Halo view will be rendered.
     */
    bbox?:
      | Partial<Rectangle.RectangleLike>
      | ((this: Halo, view: CellView) => Partial<Rectangle.RectangleLike>)

    magnet?: (cellView: CellView, terminal: Edge.TerminalType) => Element
  }

  export type OrthPosition = 'e' | 'w' | 's' | 'n'
  export type Position = OrthPosition | 'se' | 'sw' | 'ne' | 'nw'

  export interface PieToggle {
    name: string
    position?: OrthPosition
    attrs?: { [selector: string]: JQuery.PlainObject }
  }

  export const defaultOptions: Options = {
    type: 'surround',
    clearAll: true,
    clearOnBlankMouseDown: true,
    useCellGeometry: false,
    clone: (cell) => cell.clone().removeZIndex(),
  }
}

export interface Halo extends Handle {}

Object.getOwnPropertyNames(Handle.prototype).forEach((name) => {
  if (name !== 'constructor') {
    Object.defineProperty(
      Halo.prototype,
      name,
      Object.getOwnPropertyDescriptor(Handle.prototype, name)!,
    )
  }
})

namespace Private {
  export const NODE_CLS = 'has-widget-halo'
}
