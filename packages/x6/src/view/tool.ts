import { KeyValue } from '../types'
import { Dom, ObjectExt } from '../util'
import { View } from './view'
import { CellView } from './cell'
import { Markup } from './markup'

export class ToolView extends View {
  public name?: string
  public tools: ToolView.Item[] | null
  public options: ToolView.Options
  public cellView: CellView

  public get graph() {
    return this.cellView.graph
  }

  public get cell() {
    return this.cellView.cell
  }

  protected localMount?: boolean

  constructor(options: ToolView.Options = {}) {
    super()

    this.container = View.createElement(
      options.tagName || 'g',
      options.isSVGElement !== false,
    )

    Dom.addClass(this.container, this.prefixClassName('cell-tools'))

    if (options.className) {
      Dom.addClass(this.container, options.className)
    }
  }

  config(options: ToolView.ConfigOptions) {
    this.name = options.name
    this.cellView = options.cellView
    this.localMount = options.localMount

    const cellView = options.cellView
    if (!(cellView instanceof CellView)) {
      return this
    }

    const tools = options.tools
    if (!Array.isArray(tools)) {
      return this
    }

    this.tools = []
    for (let i = 0; i < tools.length; i += 1) {
      const tool = tools[i]
      if (tool instanceof ToolView.Item) {
        tool.config(cellView, this)
        tool.render()
        this.container.appendChild(tool.container)
        this.tools.push(tool)
      }
    }

    return this
  }

  getName() {
    return this.name
  }

  update(options: ToolView.UpdateOptions = {}) {
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

  focusTool(focusedTool: ToolView.Item | null) {
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

  blurTool(blurredTool: ToolView.Item | null) {
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
    return this.focusTool(null)
  }

  show() {
    return this.blurTool(null)
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
      const parent = this.localMount
        ? cellView.container
        : cellView.graph.view.decorator
      parent.appendChild(this.container)
    }
    return this
  }
}

export namespace ToolView {
  export interface Options {
    tagName?: string
    isSVGElement?: boolean
    className?: string
  }

  export interface ConfigOptions {
    cellView: CellView
    name?: string
    tools?: Item[]
    localMount?: boolean
  }

  export interface UpdateOptions {
    toolId?: string
  }
}

export namespace ToolView {
  export class Item<
    TargetView extends CellView = CellView,
    Options extends Item.Options = Item.Options
  > extends View {
    // #region static

    protected static defaults: Item.Options = {
      isSVGElement: true,
      tagName: 'g',
    }

    static getDefaults() {
      return this.defaults
    }

    static config<T extends Item.Options = Item.Options>(options: Partial<T>) {
      this.defaults = this.getOptions(options)
    }

    static getOptions<T extends Item.Options = Item.Options>(
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
    protected parent: ToolView
    protected cellView: TargetView
    protected visible: boolean
    protected childNodes: KeyValue<Element>

    get graph() {
      return this.cellView.graph
    }

    get cell() {
      return this.cellView.cell
    }

    get name() {
      return this.options.name
    }

    constructor(options: Partial<Options> = {}) {
      super()

      this.options = this.getOptions(options)
      this.container = View.createElement(
        options.tagName || 'g',
        options.isSVGElement !== false,
      )

      Dom.addClass(this.container, this.prefixClassName('cell-tool'))

      if (typeof options.className === 'string') {
        Dom.addClass(this.container, options.className)
      }

      const markup = this.options.markup
      if (markup) {
        const meta = Markup.isStringMarkup(markup)
          ? Markup.parseStringMarkup(markup)
          : Markup.parseJSONMarkup(markup)
        this.container.appendChild(meta.fragment)
        this.childNodes = meta.selectors as KeyValue<Element>
      }

      this.init()
    }

    protected getOptions(options: Partial<Options>): Options {
      const ctor = (this.constructor as any) as Item
      return ctor.getOptions(options) as Options
    }

    protected init() {}

    delegateEvents() {
      if (this.options.events) {
        super.delegateEvents(this.options.events)
      }
      return this
    }

    config(view: CellView, toolsView: ToolView) {
      this.cellView = view as TargetView
      this.parent = toolsView
      this.stamp(this.container)
      this.delegateEvents()
      return this
    }

    render() {
      this.empty()
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

    getName() {
      return this.name
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
      this.parent.focusTool(this)
      return this
    }

    blur() {
      this.container.style.opacity = ''
      this.parent.blurTool(this)
      return this
    }

    protected guard(evt: JQuery.TriggeredEvent) {
      if (this.graph == null || this.cellView == null) {
        return true
      }

      return this.graph.view.guard(evt, this.cellView)
    }
  }

  export namespace Item {
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
}
