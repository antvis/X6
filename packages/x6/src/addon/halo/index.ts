import { ObjectExt, Dom } from '../../util'
import { Rectangle, Point, Angle } from '../../geometry'
import { Cell, Edge } from '../../model'
import { View, CellView } from '../../view'
import { Widget } from '../common'
import { NodePreset } from './node-preset'
import { EdgePreset } from './edge-preset'

export class Halo extends Widget<Halo.Options> {
  protected handles: Halo.Handle[]
  protected action: string | null | undefined
  protected localX: number
  protected localY: number
  protected evt: JQuery.TriggeredEvent | null

  protected $container: JQuery<HTMLElement>
  protected $handles: JQuery<HTMLElement>
  protected $box: JQuery<HTMLElement>
  protected $pieToggles: { [name: string]: JQuery<HTMLElement> }

  protected get type() {
    return this.options.type!
  }

  init(options: Halo.Options) {
    const defaults: Halo.Options = {
      type: 'surrounding',
      clearAll: true,
      clearOnBlankPointerdown: true,
      useModelGeometry: false,
      clone: (cell) => cell.clone().removeZIndex(),
      pieInnerRadius: 20,
      pieOuterRadius: 50,
      pieSliceAngle: 45,
      pieStartAngleOffset: 0,
      pieIconSize: 14,
      pieToggles: [
        {
          name: 'default',
          position: 'e',
        },
      ],
    }

    this.options = ObjectExt.merge(
      defaults,
      this.cell.isNode()
        ? new NodePreset(this).getPresets()
        : this.cell.isEdge()
        ? new EdgePreset(this).getPresets()
        : null,
      options,
    )

    this.handles = []
    if (this.options.handles) {
      this.options.handles.forEach((handle) => this.addHandle(handle))
    }

    this.render()
    this.startListening()
  }

  protected startListening() {
    const model = this.model
    const graph = this.graph
    const cell = this.view.cell

    this.delegateEvents({
      'mousedown .handle': 'onHandlePointerDown',
      'touchstart .handle': 'onHandlePointerDown',
      'mousedown .pie-toggle': 'onPieTogglePointerDown',
      'touchstart .pie-toggle': 'onPieTogglePointerDown',
    })

    graph.on('halo:destroy', this.remove, this)
    model.on('reseted', this.remove, this)
    cell.on('removed', this.remove, this)

    if (this.options.clearOnBlankPointerdown) {
      graph.on('blank:mousedown', this.remove, this)
    }

    model.on('*', this.update, this)
    graph.on('scale', this.update, this)
    graph.on('translate', this.update, this)
  }

  protected stopListening() {
    const model = this.model
    const graph = this.graph
    const cell = this.view.cell

    this.undelegateEvents()

    graph.off('halo:destroy', this.remove, this)
    model.off('reseted', this.remove, this)
    cell.off('removed', this.remove, this)

    if (this.options.clearOnBlankPointerdown) {
      graph.off('blank:mousedown', this.remove, this)
    }

    model.off('*', this.update, this)
    graph.off('scale', this.update, this)
    graph.off('translate', this.update, this)
  }

  render() {
    const options = this.options
    this.container = document.createElement('div')
    this.$container = this.$(this.container)
      .addClass(this.prefixClassName('widget-halo'))
      .addClass(this.type)
      .attr('data-type', this.view.cell.type)
    if (options.className) {
      this.$container.addClass(options.className)
    }

    this.$handles = this.$('<div/>')
      .addClass('handles')
      .appendTo(this.container)

    this.$box = this.$('<div/>').addClass('box').appendTo(this.container)

    this.$pieToggles = {}

    this.$handles.append(
      this.handles.map((handle) => this.renderHandle(handle)),
    )

    switch (options.type) {
      case 'toolbar':
      case 'surrounding':
        if (this.hasHandle('fork')) {
          this.toggleFork()
        }
        break
      case 'pie':
        if (this.options.pieToggles) {
          this.options.pieToggles.forEach((item) => {
            const $elem = this.$('<div/>')
            $elem.addClass('pie-toggle').addClass(item.position || 'e')
            $elem.attr('data-name', item.name)
            Halo.applyAttrs($elem, item.attrs)
            $elem.appendTo(this.container)
            this.$pieToggles[item.name] = $elem
          })
        }
        break
      default:
        throw new Error('Unknown halo type')
    }

    this.$container.addClass('animate').appendTo(this.graph.container)
    this.update()
    this.setPieIcons()
    return this
  }

  remove() {
    if (this.action && this.evt) {
      this.onMouseUp(this.evt as JQuery.MouseUpEvent)
    }
    this.stopBatch()
    return super.remove()
  }

  isRendered() {
    return this.$box != null
  }

  isOpen(name?: string) {
    if (this.isRendered()) {
      return name
        ? this.$pieToggles[name].hasClass('open')
        : this.$container.hasClass('open')
    }
    return false
  }

  update() {
    if (this.isRendered()) {
      this.updateBoxContent()
      const bbox = this.getBBox()
      const tinyThreshold = this.options.tinyThreshold || 0
      const smallThreshold = this.options.smallThreshold || 0
      this.$container.toggleClass(
        'tiny',
        bbox.width < tinyThreshold && bbox.height < tinyThreshold,
      )
      this.$container.toggleClass(
        'small',
        !this.$container.hasClass('tiny') &&
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
    }
  }

  updateBoxContent() {
    const content = this.options.boxContent
    if (typeof content === 'function') {
      const ret = content.call(this, this.view, this.$box[0])
      if (ret) {
        this.$box.html(ret)
      }
    } else {
      if (content) {
        this.$box.html(content)
      } else {
        this.$box.remove()
      }
    }
  }

  getBBox() {
    const view = this.view
    const bbox = this.options.bbox
    const rect = typeof bbox === 'function' ? bbox(view, this) : bbox
    return Rectangle.create({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      ...rect,
    })
  }

  protected setPieIcons() {
    if ('pie' === this.type) {
      this.$container.find('.handle').each((_, elem) => {
        const $elem = this.$(elem)
        const action = $elem.attr('data-action')!
        const handle = this.getHandle(action)
        if (!handle || !handle.icon) {
          const contect = window
            .getComputedStyle(elem, ':before')
            .getPropertyValue('content')
          if (contect && 'none' !== contect) {
            const $icons = $elem.find<any>('.slice-text-icon')
            if ($icons.length) {
              Dom.createVector($icons[0]).text(contect.replace(/['"]/g, ''))
            }
          }

          const bgImg = $elem.css('background-image')
          if (bgImg) {
            const matches = bgImg.match(/url\(['"]?([^'"]+)['"]?\)/)
            if (matches) {
              const href = matches[1]
              const $imgs = $elem.find<any>('.slice-img-icon')
              if ($imgs.length > 0) {
                Dom.createVector($imgs[0]).attr('xlink:href', href)
              }
            }
          }
        }
      })
    }
  }

  renderHandle(handle: Halo.Handle) {
    const index = this.getHandleIdx(handle.name)
    const $handle = this.$('<div/>')
      .addClass('handle')
      .addClass(handle.name)
      .attr('data-action', handle.name)
      .prop('draggable', false)
    switch (this.type) {
      case 'toolbar':
      case 'surrounding':
        $handle.addClass(handle.position)
        if (handle.content) {
          $handle.html(handle.content)
        }
        break
      case 'pie':
        const options = this.options
        const outerRadius = options.pieOuterRadius!
        const innerRadius = options.pieInnerRadius!
        const offset = (outerRadius + innerRadius) / 2
        const ratio = new Point(outerRadius, outerRadius)
        const delta = Angle.toRad(options.pieSliceAngle!)
        const curRad = index * delta + Angle.toRad(options.pieStartAngleOffset!)
        const nextRad = curRad + delta
        const pathData = Dom.createSlicePathData(
          innerRadius,
          outerRadius,
          curRad,
          nextRad,
        )
        const vSvg = Dom.createVector('svg').addClass('slice-svg')
        const vPath = Dom.createVector('path')
          .addClass('slice')
          .attr('d', pathData)
          .translate(outerRadius, outerRadius)
        const pos = Point.fromPolar(offset, -curRad - delta / 2, ratio).toJSON()
        const iconSize = options.pieIconSize!
        const vImg = Dom.createVector('image')
          .attr(pos)
          .addClass('slice-img-icon')
        pos.y = pos.y + iconSize - 2
        const vText = Dom.createVector('text', {
          'font-size': iconSize,
        })
          .attr(pos)
          .addClass('slice-text-icon')

        vImg.attr({
          width: iconSize,
          height: iconSize,
        })
        vImg.translate(-iconSize / 2, -iconSize / 2)
        vText.translate(-iconSize / 2, -iconSize / 2)
        vSvg.append([vPath, vImg, vText])
        $handle.append(vSvg.node)
    }

    if (handle.icon) {
      this.setHandleIcon($handle, handle.icon)
    }

    Halo.applyAttrs($handle, handle.attrs)

    return $handle
  }

  hasHandle(name: string) {
    return this.getHandleIdx(name) >= 0
  }

  getHandleIdx(name: string) {
    return this.handles.findIndex((item) => item.name === name)
  }

  getHandle(name: string) {
    return this.handles.find((item) => item.name === name)
  }

  addHandle(handle: Halo.Handle) {
    if (!this.hasHandle(handle.name)) {
      this.handles.push(handle)

      const events = handle.events
      if (events) {
        Object.keys(events).forEach((action) => {
          const callback = events[action]
          const name = `action:${handle.name}:${action}`
          if (typeof callback === 'string') {
            this.on(name, (this as any)[callback], this)
          } else {
            this.on(name, callback)
          }
        })
      }

      if (this.$handles) {
        this.renderHandle(handle).appendTo(this.$handles)
      }
    }

    return this
  }

  addHandles(handles: Halo.Handle[]) {
    handles.forEach((handle) => this.addHandle(handle))
    return this
  }

  removeHandles() {
    while (this.handles.length) {
      this.removeHandle(this.handles[0].name)
    }
    return this
  }

  changeHandle(name: string, newHandle: Partial<Halo.Handle>) {
    const handle = this.getHandle(name)
    if (handle) {
      this.removeHandle(name)
      this.addHandle({
        name,
        ...handle,
        ...newHandle,
      })
    }
    return this
  }

  removeHandle(name: string) {
    const index = this.getHandleIdx(name)
    const handle = this.handles[index]
    if (handle) {
      if (handle.events) {
        Object.keys(handle.events).forEach((event) => {
          this.off(`action:${name}:${event}`)
        })
      }
      this.getHandleElem(name).remove()
      this.handles.splice(index, 1)
    }
    return this
  }

  toggleHandle(name: string, selected?: boolean) {
    const handle = this.getHandle(name)
    if (handle) {
      const $handle = this.getHandleElem(name)
      if (selected === undefined) {
        // tslint:disable-next-line
        selected = !$handle.hasClass('selected')
      }
      $handle.toggleClass('selected', selected)
      const icon = selected ? handle.iconSelected : handle.icon
      if (icon) {
        this.setHandleIcon($handle, icon)
      }
    }
    return this
  }

  selectHandle(name: string) {
    return this.toggleHandle(name, true)
  }

  deselectHandle(name: string) {
    return this.toggleHandle(name, false)
  }

  deselectAllHandles() {
    this.handles.forEach((handle) => this.deselectHandle(handle.name))
    return this
  }

  protected setHandleIcon($handle: JQuery<Element>, icon: string) {
    switch (this.type) {
      case 'pie':
        const $icons = $handle.find('.slice-img-icon')
        this.$($icons[0]).attr('xlink:href', icon)
        break
      case 'toolbar':
      case 'surrounding':
        $handle.css('background-image', `url(${icon})`)
    }
  }

  protected getHandleElem(name: string) {
    return this.$container.find(`.handle.${name}`)
  }

  protected removeCell() {
    this.cell.remove()
  }

  toggleFork() {
    const cell = this.view.cell.clone()
    const view = this.graph.renderer.createView(cell)!
    const valid = this.graph.hook.validateConnection(
      this.view,
      null,
      view,
      null,
      'target',
    )
    this.$handles.children('.fork').toggleClass('hidden', !valid)
    view.remove()
  }

  toggleUnlink() {
    const hasEdges = this.model.getConnectedEdges(this.view.cell).length > 0
    this.$handles.children('.unlink').toggleClass('hidden', !hasEdges)
  }

  toggleState(name?: string) {
    if (this.isRendered()) {
      const $container = this.$container
      Object.keys(this.$pieToggles).forEach((key) => {
        const $toggle = this.$pieToggles[key]
        $toggle.removeClass('open')
      })
      if (this.isOpen()) {
        this.trigger('pie:close', { name })
        $container.removeClass('open')
      } else {
        this.trigger('pie:open', { name })
        if (name) {
          const toggle =
            this.options.pieToggles &&
            this.options.pieToggles.find((i) => i.name === name)
          if (toggle) {
            $container.attr({
              'data-pie-toggle-position': toggle.position,
              'data-pie-toggle-name': toggle.name,
            })
          }
          this.$pieToggles[name].addClass('open')
        }
        $container.addClass('open')
      }
    }
  }

  triggerAction(
    event: string,
    action: string,
    e: JQuery.TriggeredEvent,
    x: number,
    y: number,
    dx?: number,
    dy?: number,
  ) {
    this.trigger(`action:${event}:${action}`, { e, x, y, dx, dy })
  }

  protected onPieTogglePointerDown(evt: JQuery.MouseDownEvent) {
    evt.stopPropagation()
    const name = this.$(evt.target).closest('.pie-toggle').attr('data-name')
    if (!this.isOpen(name)) {
      if (this.isOpen()) {
        this.toggleState()
      }
    }
    this.toggleState(name)
  }

  protected onHandlePointerDown(evt: JQuery.MouseDownEvent) {
    this.action = this.$(evt.target).closest('.handle').attr('data-action')

    if (this.action) {
      evt.preventDefault()
      evt.stopPropagation()
      const e = this.normalizeEvent(evt)
      const local = this.graph.snapToGrid({
        x: e.clientX,
        y: e.clientY,
      })
      const localX = local.x
      const localY = local.y
      this.localX = localX
      this.localY = localY
      this.evt = e
      if (e.type === 'mousedown' && 2 === evt.button) {
        this.triggerAction(this.action, 'contextmenu', evt, localX, localY)
      } else {
        this.triggerAction(this.action, 'mousedown', evt, localX, localY)
        this.delegateDocumentEvents(
          {
            mousemove: 'onMouseMove',
            touchmove: 'onMouseMove',
            mouseup: 'onMouseUp',
            touchend: 'onMouseUp',
          },
          evt.data,
        )
      }
    }
  }

  protected onMouseMove(evt: JQuery.MouseMoveEvent) {
    if (this.action) {
      evt.preventDefault()
      evt.stopPropagation()
      const e = this.normalizeEvent(evt)
      const local = this.graph.snapToGrid({
        x: e.clientX,
        y: e.clientY,
      })
      const dx = local.x - this.localX
      const dy = local.y - this.localY
      this.localX = local.x
      this.localY = local.y
      this.evt = e
      this.triggerAction(
        this.action,
        'mousemove',
        evt,
        local.x,
        local.y,
        dx,
        dy,
      )
    }
  }

  protected onMouseUp(evt: JQuery.MouseUpEvent) {
    const action = this.action
    if (action) {
      this.action = null
      this.evt = null
      const local = this.graph.snapToGrid({
        x: evt.clientX,
        y: evt.clientY,
      })
      this.triggerAction(action, 'mouseup', evt, local.x, local.y)
      this.undelegateDocumentEvents()
    }
  }

  // #region batch

  stopBatch() {
    if (this.model.hasActiveBatch('halo')) {
      this.model.stopBatch('halo', {
        halo: this.cid,
      })
    }
  }

  startBatch() {
    this.model.startBatch('halo', {
      halo: this.cid,
    })
  }

  // #endregion
}

export namespace Halo {
  export interface Options {
    type?: 'surrounding' | 'pie' | 'toolbar'
    className?: string
    handles?: Handle[] | null
    /**
     * The preferred side for a self-loop edge created from Halo
     */
    loopLinkPreferredSide?: 'top' | 'bottom' | 'left' | 'right'
    loopLinkWidth?: number
    rotateAngleGrid?: number
    rotateEmbeds?: boolean
    boxContent?:
      | false
      | string
      | ((cellView: CellView, boxDOMElement: HTMLElement) => string)
    /**
     * If set to `true` (the default value), clear all the existing halos
     * from the page when a new halo is created. This is the most common
     * behavior as it is assumed that there is only one halo visible on the
     * page at a time. However, some applications might need to have more
     * than one halo visible. In this case, set `clearAll` to `false` (and
     * make sure to call `remove()` once you don't need a halo anymore)
     */
    clearAll?: boolean
    clearOnBlankPointerdown?: boolean
    /**
     * If set to true, the model position and dimensions will be used as a
     * basis for the Halo tools position. By default, this is set to false
     * which causes the Halo tools position be based on the bounding box of
     * the element view. Sometimes though, your shapes can have certain SVG
     * sub elements that stick out of the view and you don't want these sub
     * elements to affect the Halo tools position. In this case, set the
     * `useModelGeometry` to true.
     */
    useModelGeometry?: boolean
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
      | ((view: CellView, halo: Halo) => Partial<Rectangle.RectangleLike>)

    magnet?: (cellView: CellView, terminal: Edge.TerminalType) => Element

    pieOuterRadius?: number
    pieInnerRadius?: number

    /**
     * The angle of one slice in the pie menu.
     */
    pieSliceAngle?: number
    /**
     * The angle offset of the first handle in the pie menu.
     */
    pieStartAngleOffset?: number
    /**
     * The size in pixels of the icon in the pie menu.
     */
    pieIconSize?: number
    /**
     * An array of pie toggle buttons.
     */
    pieToggles?: PieToggle[]

    tinyThreshold?: number
    smallThreshold?: number
  }

  export type OrthPosition = 'e' | 'w' | 's' | 'n'
  export type Position = OrthPosition | 'se' | 'sw' | 'ne' | 'nw'

  export interface Handle {
    /**
     * The name of the custom tool. This name will be also set as a
     * CSS class to the handle DOM element making it easy to select
     * it your CSS stylesheet.
     */
    name: string
    position: Position
    /**
     * The icon url used to render the tool. This icons is set as a
     * background image on the tool handle DOM element.
     */
    icon?: string | null
    iconSelected?: string | null
    content?: string
    events?: { [event: string]: string }
    attrs?: { [selector: string]: JQuery.PlainObject }
  }

  export interface PieToggle {
    name: string
    position?: OrthPosition
    attrs?: { [selector: string]: JQuery.PlainObject }
  }
}

export namespace Halo {
  export interface HandleEventArgs {
    e: JQuery.TriggeredEvent
    x: number
    y: number
    dx: number
    dy: number
  }

  export interface EventArgs {
    'pie:open': { name: string }
    'pie:close': { name: string }
  }
}

export namespace Halo {
  export function applyAttrs(
    elem: HTMLElement | JQuery,
    attrs?: { [selector: string]: JQuery.PlainObject },
  ) {
    if (attrs) {
      const $elem = View.$(elem)
      Object.keys(attrs).forEach((selector) => {
        const $element = $elem.find(selector).addBack().filter(selector)
        const { class: cls, ...attr } = attrs[selector]
        if (cls) {
          $element.addClass(cls)
        }
        $element.attr(attr)
      })
    }
  }
}
