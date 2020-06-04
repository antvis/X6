import { KeyValue } from '../types'
import { Dom, ObjectExt, StringExt } from '../util'
import { NodeTool, EdgeTool } from '../definition'
import { View } from './view'
import { CellView } from './cell'
import { Markup } from './markup'

export class ToolsView extends View {
  public tools: ToolsView.ToolItem[] | null
  public options: ToolsView.Options
  public cellView: CellView

  public get name() {
    return this.options.name
  }

  public get graph() {
    return this.cellView.graph
  }

  public get cell() {
    return this.cellView.cell
  }

  protected get local() {
    return this.options.local
  }

  constructor(options: ToolsView.Options = {}) {
    super()

    this.container = View.createElement(
      options.tagName || 'g',
      options.isSVGElement !== false,
    )

    Dom.addClass(this.container, this.prefixClassName('cell-tools'))

    if (options.className) {
      Dom.addClass(this.container, options.className)
    }

    this.config(options)
  }

  config(options: ToolsView.ConfigOptions) {
    this.options = {
      ...this.options,
      ...options,
    }

    if (
      !(options.cellView instanceof CellView) ||
      options.cellView === this.cellView
    ) {
      return this
    }

    this.cellView = options.cellView

    if (this.cell.isEdge()) {
      Dom.addClass(this.container, this.prefixClassName('edge-tools'))
    } else if (this.cell.isNode()) {
      Dom.addClass(this.container, this.prefixClassName('node-tools'))
    }

    this.container.setAttribute('data-cell-id', this.cell.id)

    if (this.name) {
      this.container.setAttribute('data-tools-name', this.name)
    }

    const tools = this.options.tools
    if (!Array.isArray(tools)) {
      return this
    }

    this.tools = []
    for (let i = 0; i < tools.length; i += 1) {
      const meta = tools[i]
      let tool: ToolsView.ToolItem | undefined

      if (meta instanceof ToolsView.ToolItem) {
        tool = meta
      } else {
        const name = typeof meta === 'object' ? meta.name : meta
        const args = typeof meta === 'object' ? meta.args || {} : {}
        if (name) {
          if (this.cell.isNode()) {
            const ctor = NodeTool.registry.get(name)
            if (ctor) {
              tool = new ctor(args)
            } else {
              return NodeTool.registry.onNotFound(name)
            }
          } else if (this.cell.isEdge()) {
            const ctor = EdgeTool.registry.get(name)
            if (ctor) {
              tool = new ctor(args)
            } else {
              return EdgeTool.registry.onNotFound(name)
            }
          }
        }
      }

      if (tool) {
        tool.config(this.cellView, this)
        tool.render()
        this.container.appendChild(tool.container)
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

    return super.remove()
  }

  mount() {
    const cellView = this.cellView
    if (cellView) {
      const parent = this.local
        ? cellView.container
        : cellView.graph.view.decorator
      parent.appendChild(this.container)
    }
    return this
  }
}

export namespace ToolsView {
  export interface Options extends ConfigOptions {
    tagName?: string
    isSVGElement?: boolean
    className?: string
  }

  export interface ConfigOptions {
    cellView?: CellView
    name?: string
    tools?:
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
    local?: boolean
  }

  export interface UpdateOptions {
    toolId?: string
  }
}

export namespace ToolsView {
  export class ToolItem<
    TargetView extends CellView = CellView,
    Options extends ToolItem.Options = ToolItem.Options
  > extends View {
    // #region static

    protected static defaults: ToolItem.Options = {
      isSVGElement: true,
      tagName: 'g',
    }

    static getDefaults() {
      return this.defaults
    }

    static config<T extends ToolItem.Options = ToolItem.Options>(
      options: Partial<T>,
    ) {
      this.defaults = this.getOptions(options)
    }

    static getOptions<T extends ToolItem.Options = ToolItem.Options>(
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
    protected visible: boolean
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

    protected getOptions(options: Partial<Options>): Options {
      const ctor = (this.constructor as any) as ToolItem
      return ctor.getOptions(options) as Options
    }

    protected init() {}

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

    protected stamp(elem: Element = this.container) {
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
      return this.visible
    }

    focus() {
      const opacity = this.options.focusOpacity
      if (opacity != null && isFinite(opacity)) {
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
}
