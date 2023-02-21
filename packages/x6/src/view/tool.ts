import { KeyValue } from '../types'
import { Dom, ObjectExt, StringExt } from '../util'
import { NodeTool, EdgeTool } from '../registry/tool'
import { View } from './view'
import { CellView } from './cell'
import { Markup } from './markup'

export class ToolsView extends View {
  public tools: ToolsView.ToolItem[] | null
  public options: ToolsView.Options
  public cellView: CellView
  public svgContainer: SVGGElement
  public htmlContainer: HTMLDivElement

  public get name() {
    return this.options.name
  }

  public get graph() {
    return this.cellView.graph
  }

  public get cell() {
    return this.cellView.cell
  }

  protected get [Symbol.toStringTag]() {
    return ToolsView.toStringTag
  }

  constructor(options: ToolsView.Options = {}) {
    super()
    this.svgContainer = this.createContainer(true, options) as SVGGElement
    this.htmlContainer = this.createContainer(false, options) as HTMLDivElement
    this.config(options)
  }

  protected createContainer(svg: boolean, options: ToolsView.Options) {
    const container = svg
      ? View.createElement('g', true)
      : View.createElement('div', false)
    Dom.addClass(container, this.prefixClassName('cell-tools'))
    if (options.className) {
      Dom.addClass(container, options.className)
    }
    return container
  }

  config(options: ToolsView.ConfigOptions) {
    this.options = {
      ...this.options,
      ...options,
    }

    if (!CellView.isCellView(options.view) || options.view === this.cellView) {
      return this
    }

    this.cellView = options.view

    if (this.cell.isEdge()) {
      Dom.addClass(this.svgContainer, this.prefixClassName('edge-tools'))
      Dom.addClass(this.htmlContainer, this.prefixClassName('edge-tools'))
    } else if (this.cell.isNode()) {
      Dom.addClass(this.svgContainer, this.prefixClassName('node-tools'))
      Dom.addClass(this.htmlContainer, this.prefixClassName('node-tools'))
    }

    this.svgContainer.setAttribute('data-cell-id', this.cell.id)
    this.htmlContainer.setAttribute('data-cell-id', this.cell.id)

    if (this.name) {
      this.svgContainer.setAttribute('data-tools-name', this.name)
      this.htmlContainer.setAttribute('data-tools-name', this.name)
    }

    const tools = this.options.items
    if (!Array.isArray(tools)) {
      return this
    }

    this.tools = []

    const normalizedTools: typeof tools = []

    tools.forEach((meta) => {
      if (ToolsView.ToolItem.isToolItem(meta)) {
        if (meta.name === 'vertices') {
          normalizedTools.unshift(meta)
        } else {
          normalizedTools.push(meta)
        }
      } else {
        const name = typeof meta === 'object' ? meta.name : meta
        if (name === 'vertices') {
          normalizedTools.unshift(meta)
        } else {
          normalizedTools.push(meta)
        }
      }
    })

    for (let i = 0; i < normalizedTools.length; i += 1) {
      const meta = normalizedTools[i]
      let tool: ToolsView.ToolItem | undefined

      if (ToolsView.ToolItem.isToolItem(meta)) {
        tool = meta
      } else {
        const name = typeof meta === 'object' ? meta.name : meta
        const args = typeof meta === 'object' ? meta.args || {} : {}
        if (name) {
          if (this.cell.isNode()) {
            const ctor = NodeTool.registry.get(name)
            if (ctor) {
              tool = new ctor(args) // eslint-disable-line
            } else {
              return NodeTool.registry.onNotFound(name)
            }
          } else if (this.cell.isEdge()) {
            const ctor = EdgeTool.registry.get(name)
            if (ctor) {
              tool = new ctor(args) // eslint-disable-line
            } else {
              return EdgeTool.registry.onNotFound(name)
            }
          }
        }
      }

      if (tool) {
        tool.config(this.cellView, this)
        tool.render()
        const container =
          tool.options.isSVGElement !== false
            ? this.svgContainer
            : this.htmlContainer
        container.appendChild(tool.container)
        this.tools.push(tool)
      }
    }

    return this
  }

  update(options: ToolsView.UpdateOptions = {}) {
    const tools = this.tools
    if (tools) {
      tools.forEach((tool) => {
        if (options.toolId !== tool.cid && tool.isVisible()) {
          tool.update()
        }
      })
    }
    return this
  }

  focus(focusedTool: ToolsView.ToolItem | null) {
    const tools = this.tools
    if (tools) {
      tools.forEach((tool) => {
        if (focusedTool === tool) {
          tool.show()
        } else {
          tool.hide()
        }
      })
    }

    return this
  }

  blur(blurredTool: ToolsView.ToolItem | null) {
    const tools = this.tools
    if (tools) {
      tools.forEach((tool) => {
        if (tool !== blurredTool && !tool.isVisible()) {
          tool.show()
          tool.update()
        }
      })
    }

    return this
  }

  hide() {
    return this.focus(null)
  }

  show() {
    return this.blur(null)
  }

  remove() {
    const tools = this.tools
    if (tools) {
      tools.forEach((tool) => tool.remove())
      this.tools = null
    }

    Dom.remove(this.svgContainer)
    Dom.remove(this.htmlContainer)
    return super.remove()
  }

  mount() {
    const tools = this.tools
    const cellView = this.cellView
    if (cellView && tools) {
      const hasSVG = tools.some((tool) => tool.options.isSVGElement !== false)
      const hasHTML = tools.some((tool) => tool.options.isSVGElement === false)
      if (hasSVG) {
        const parent = this.options.local
          ? cellView.container
          : cellView.graph.view.decorator
        parent.appendChild(this.svgContainer)
      }

      if (hasHTML) {
        this.graph.container.appendChild(this.htmlContainer)
      }
    }
    return this
  }
}

export namespace ToolsView {
  export interface Options extends ConfigOptions {
    className?: string
  }

  export interface ConfigOptions {
    view?: CellView
    name?: string
    local?: boolean
    items?:
      | (
          | ToolItem
          | string
          | NodeTool.NativeNames
          | NodeTool.NativeItem
          | NodeTool.ManaualItem
          | EdgeTool.NativeNames
          | EdgeTool.NativeItem
          | EdgeTool.ManaualItem
        )[]
      | null
  }

  export interface UpdateOptions {
    toolId?: string
  }
}

export namespace ToolsView {
  export const toStringTag = `X6.${ToolsView.name}`

  export function isToolsView(instance: any): instance is ToolsView {
    if (instance == null) {
      return false
    }

    if (instance instanceof ToolsView) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const view = instance as ToolsView

    if (
      (tag == null || tag === toStringTag) &&
      view.graph != null &&
      view.cell != null &&
      typeof view.config === 'function' &&
      typeof view.update === 'function' &&
      typeof view.focus === 'function' &&
      typeof view.blur === 'function' &&
      typeof view.show === 'function' &&
      typeof view.hide === 'function'
    ) {
      return true
    }

    return false
  }
}

export namespace ToolsView {
  export class ToolItem<
    TargetView extends CellView = CellView,
    Options extends ToolItem.Options = ToolItem.Options,
  > extends View {
    // #region static

    protected static defaults: ToolItem.Options = {
      isSVGElement: true,
      tagName: 'g',
    }

    public static getDefaults<T extends ToolItem.Options>() {
      return this.defaults as T
    }

    public static config<T extends ToolItem.Options = ToolItem.Options>(
      options: Partial<T>,
    ) {
      this.defaults = this.getOptions(options)
    }

    public static getOptions<T extends ToolItem.Options = ToolItem.Options>(
      options: Partial<T>,
    ): T {
      return ObjectExt.merge(
        ObjectExt.cloneDeep(this.getDefaults()),
        options,
      ) as T
    }

    // #endregion

    public readonly options: Options

    public container: HTMLElement | SVGElement

    public parent: ToolsView

    protected cellView: TargetView

    protected visible = true

    protected childNodes: KeyValue<Element>

    public get graph() {
      return this.cellView.graph
    }

    public get cell() {
      return this.cellView.cell
    }

    public get name() {
      return this.options.name
    }

    protected get [Symbol.toStringTag]() {
      return ToolItem.toStringTag
    }

    constructor(options: Partial<Options> = {}) {
      super()

      this.options = this.getOptions(options)
      this.container = View.createElement(
        this.options.tagName || 'g',
        this.options.isSVGElement !== false,
      )

      Dom.addClass(this.container, this.prefixClassName('cell-tool'))

      if (typeof this.options.className === 'string') {
        Dom.addClass(this.container, this.options.className)
      }

      this.init()
    }

    protected init() {}

    protected getOptions(options: Partial<Options>): Options {
      const ctor = this.constructor as any as ToolItem
      return ctor.getOptions(options) as Options
    }

    delegateEvents() {
      if (this.options.events) {
        super.delegateEvents(this.options.events)
      }
      return this
    }

    config(view: CellView, toolsView: ToolsView) {
      this.cellView = view as TargetView
      this.parent = toolsView
      this.stamp(this.container)

      if (this.cell.isEdge()) {
        Dom.addClass(this.container, this.prefixClassName('edge-tool'))
      } else if (this.cell.isNode()) {
        Dom.addClass(this.container, this.prefixClassName('node-tool'))
      }

      if (this.name) {
        this.container.setAttribute('data-tool-name', this.name)
      }

      this.delegateEvents()

      return this
    }

    render() {
      this.empty()

      const markup = this.options.markup
      if (markup) {
        const meta = Markup.isStringMarkup(markup)
          ? Markup.parseStringMarkup(markup)
          : Markup.parseJSONMarkup(markup)
        this.container.appendChild(meta.fragment)
        this.childNodes = meta.selectors as KeyValue<Element>
      }

      this.onRender()
      return this
    }

    protected onRender() {}

    update() {
      return this
    }

    protected stamp(elem: Element) {
      if (elem) {
        elem.setAttribute('data-cell-id', this.cellView.cell.id)
      }
    }

    show() {
      this.container.style.display = ''
      this.visible = true
      return this
    }

    hide() {
      this.container.style.display = 'none'
      this.visible = false
      return this
    }

    isVisible() {
      return !!this.visible
    }

    focus() {
      const opacity = this.options.focusOpacity
      if (opacity != null && Number.isFinite(opacity)) {
        this.container.style.opacity = `${opacity}`
      }
      this.parent.focus(this)
      return this
    }

    blur() {
      this.container.style.opacity = ''
      this.parent.blur(this)
      return this
    }

    protected guard(evt: JQuery.TriggeredEvent) {
      if (this.graph == null || this.cellView == null) {
        return true
      }

      return this.graph.view.guard(evt, this.cellView)
    }
  }

  export namespace ToolItem {
    export interface Options {
      name?: string
      tagName?: string
      isSVGElement?: boolean
      className?: string
      markup?: Markup
      events?: View.Events | null
      documentEvents?: View.Events | null
      focusOpacity?: number
    }
  }

  export namespace ToolItem {
    export type Definition =
      | typeof ToolItem
      | (new (options: ToolItem.Options) => ToolItem)

    let counter = 0
    function getClassName(name?: string) {
      if (name) {
        return StringExt.pascalCase(name)
      }
      counter += 1
      return `CustomTool${counter}`
    }

    export function define<T extends Options>(options: T) {
      const tool = ObjectExt.createClass<Definition>(
        getClassName(options.name),
        this as Definition,
      ) as typeof ToolItem

      tool.config(options)
      return tool
    }
  }

  export namespace ToolItem {
    export const toStringTag = `X6.${ToolItem.name}`

    export function isToolItem(instance: any): instance is ToolItem {
      if (instance == null) {
        return false
      }

      if (instance instanceof ToolItem) {
        return true
      }

      const tag = instance[Symbol.toStringTag]
      const view = instance as ToolItem

      if (
        (tag == null || tag === toStringTag) &&
        view.graph != null &&
        view.cell != null &&
        typeof view.config === 'function' &&
        typeof view.update === 'function' &&
        typeof view.focus === 'function' &&
        typeof view.blur === 'function' &&
        typeof view.show === 'function' &&
        typeof view.hide === 'function' &&
        typeof view.isVisible === 'function'
      ) {
        return true
      }

      return false
    }
  }
}
