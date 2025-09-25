import { Dom, type KeyValue, ObjectExt } from '../../common'
import type { CellView } from '../cell'
import { Markup, type MarkupType } from '../markup'
import { View } from '../view'
import { createViewElement } from '../view/util'
import type { ToolsView } from './tool-view'
import { getClassName } from './util'

export interface ToolItemOptions {
  name?: string
  tagName?: string
  isSVGElement?: boolean
  className?: string
  markup?: Exclude<MarkupType, string>
  events?: View.Events | null
  documentEvents?: View.Events | null
  focusOpacity?: number
  [keyLike: string]: any
}

export type ToolItemDefinition =
  | typeof ToolItem
  | (new (options: ToolItemOptions) => ToolItem)

export class ToolItem<
  TargetView extends CellView = CellView,
  Options extends ToolItemOptions = ToolItemOptions,
> extends View {
  // #region static

  public static toStringTag = `X6.${ToolItem.name}`

  public static defaults: ToolItemOptions = {
    isSVGElement: true,
    tagName: 'g',
  }

  public static isToolItem(instance: any): instance is ToolItem {
    if (instance == null) {
      return false
    }

    if (instance instanceof ToolItem) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const view = instance as ToolItem

    if (
      (tag == null || tag === ToolItemToStringTag) &&
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

  public static define<T extends ToolItemOptions>(options: T) {
    const tool = ObjectExt.createClass<ToolItemDefinition>(
      getClassName(options.name),
      ToolItem as ToolItemDefinition,
    ) as typeof ToolItem

    tool.config(options)
    return tool
  }

  public static getDefaults<T extends ToolItemOptions>() {
    return this.defaults as T
  }

  public static config<T extends ToolItemOptions = ToolItemOptions>(
    options: Partial<T>,
  ) {
    this.defaults = this.getOptions(options)
  }

  public static getOptions<T extends ToolItemOptions = ToolItemOptions>(
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
    return ToolItemToStringTag
  }

  constructor(options: Partial<Options> = {}) {
    super()

    this.options = this.getOptions(options)
    this.container = createViewElement(
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
      const meta = Markup.parseJSONMarkup(markup)
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
    return this.visible
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

  protected guard(evt: Dom.EventObject) {
    if (this.graph == null || this.cellView == null) {
      return true
    }

    return this.graph.view.guard(evt, this.cellView)
  }
}

export const ToolItemToStringTag = `X6.${ToolItem.name}`
