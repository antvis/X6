import {
  Dom,
  FunctionExt,
  CssLoader,
  Cell,
  Node,
  Model,
  View,
  Graph,
  EventArgs,
  Dnd,
} from '@antv/x6'
import { grid } from './grid'
import { content } from './style/raw'

export class Stencil extends View implements Graph.Plugin {
  public name = 'stencil'
  public options: Stencil.Options
  public dnd: Dnd
  protected graphs: { [groupName: string]: Graph }
  protected groups: { [groupName: string]: HTMLElement }
  protected content: HTMLDivElement

  protected get targetScroller() {
    const target = this.options.target
    const scroller = target.getPlugin<any>('scroller')
    return scroller
  }

  protected get targetGraph() {
    return this.options.target
  }

  protected get targetModel() {
    return this.targetGraph.model
  }

  constructor(options: Partial<Stencil.Options> = {}) {
    super()
    CssLoader.ensure(this.name, content)
    this.graphs = {}
    this.groups = {}
    this.options = {
      ...Stencil.defaultOptions,
      ...options,
    } as Stencil.Options
    this.init()
  }

  init() {
    this.dnd = new Dnd(this.options)
    this.onSearch = FunctionExt.debounce(this.onSearch, 200)

    this.initContainer()
    this.initSearch()
    this.initContent()
    this.initGroups()
    this.setTitle()
    this.startListening()
  }

  // #region api

  load(groups: { [groupName: string]: (Node | Node.Metadata)[] }): this
  load(nodes: (Node | Node.Metadata)[], groupName?: string): this
  load(
    data:
      | { [groupName: string]: (Node | Node.Metadata)[] }
      | (Node | Node.Metadata)[],
    groupName?: string,
  ) {
    if (Array.isArray(data)) {
      this.loadGroup(data, groupName)
    } else if (this.options.groups) {
      Object.keys(this.options.groups).forEach((groupName) => {
        if (data[groupName]) {
          this.loadGroup(data[groupName], groupName)
        }
      })
    }
    return this
  }

  unload(groups: { [groupName: string]: (Node | Node.Metadata)[] }): this
  unload(nodes: (Node | Node.Metadata)[], groupName?: string): this
  unload(
    data:
      | { [groupName: string]: (Node | Node.Metadata)[] }
      | (Node | Node.Metadata)[],
    groupName?: string,
  ) {
    if (Array.isArray(data)) {
      this.loadGroup(data, groupName, true)
    } else if (this.options.groups) {
      Object.keys(this.options.groups).forEach((groupName) => {
        if (data[groupName]) {
          this.loadGroup(data[groupName], groupName, true)
        }
      })
    }
    return this
  }

  toggleGroup(groupName: string) {
    if (this.isGroupCollapsed(groupName)) {
      this.expandGroup(groupName)
    } else {
      this.collapseGroup(groupName)
    }
    return this
  }

  collapseGroup(groupName: string) {
    if (this.isGroupCollapsable(groupName)) {
      const group = this.groups[groupName]
      if (group && !this.isGroupCollapsed(groupName)) {
        this.trigger('group:collapse', { name: groupName })
        Dom.addClass(group, 'collapsed')
      }
    }
    return this
  }

  expandGroup(groupName: string) {
    if (this.isGroupCollapsable(groupName)) {
      const group = this.groups[groupName]
      if (group && this.isGroupCollapsed(groupName)) {
        this.trigger('group:expand', { name: groupName })
        Dom.removeClass(group, 'collapsed')
      }
    }
    return this
  }

  isGroupCollapsable(groupName: string) {
    const group = this.groups[groupName]
    return Dom.hasClass(group, 'collapsable')
  }

  isGroupCollapsed(groupName: string) {
    const group = this.groups[groupName]
    return group && Dom.hasClass(group, 'collapsed')
  }

  collapseGroups() {
    Object.keys(this.groups).forEach((groupName) =>
      this.collapseGroup(groupName),
    )
    return this
  }

  expandGroups() {
    Object.keys(this.groups).forEach((groupName) => this.expandGroup(groupName))
    return this
  }

  resizeGroup(groupName: string, size: { width: number; height: number }) {
    const graph = this.graphs[groupName]
    if (graph) {
      graph.resize(size.width, size.height)
    }
    return this
  }

  addGroup(group: Stencil.Group | Stencil.Group[]) {
    const groups = Array.isArray(group) ? group : [group]
    if (this.options.groups) {
      this.options.groups.push(...groups)
    } else {
      this.options.groups = groups
    }
    groups.forEach((group) => this.initGroup(group))
  }

  removeGroup(groupName: string | string[]) {
    const groupNames = Array.isArray(groupName) ? groupName : [groupName]
    if (this.options.groups) {
      this.options.groups = this.options.groups.filter(
        (group) => !groupNames.includes(group.name),
      )
      groupNames.forEach((groupName) => {
        const graph = this.graphs[groupName]
        this.unregisterGraphEvents(graph)
        graph.dispose()
        delete this.graphs[groupName]

        const elem = this.groups[groupName]
        Dom.remove(elem)
        delete this.groups[groupName]
      })
    }
  }

  // #endregion

  protected initContainer() {
    this.container = document.createElement('div')
    Dom.addClass(this.container, this.prefixClassName(ClassNames.base))
    Dom.attr(
      this.container,
      'data-not-found-text',
      this.options.notFoundText || 'No matches found',
    )
  }

  protected initContent() {
    this.content = document.createElement('div')
    Dom.addClass(this.content, this.prefixClassName(ClassNames.content))
    Dom.appendTo(this.content, this.container)
  }

  protected initSearch() {
    if (this.options.search) {
      Dom.addClass(this.container, 'searchable')
      Dom.append(this.container, this.renderSearch())
    }
  }

  protected initGroup(group: Stencil.Group) {
    const globalGraphOptions = this.options.stencilGraphOptions || {}
    const groupElem = document.createElement('div')
    Dom.addClass(groupElem, this.prefixClassName(ClassNames.group))
    Dom.attr(groupElem, 'data-name', group.name)

    if (
      (group.collapsable == null && this.options.collapsable) ||
      group.collapsable !== false
    ) {
      Dom.addClass(groupElem, 'collapsable')
    }

    Dom.toggleClass(groupElem, 'collapsed', group.collapsed === true)

    const title = document.createElement('h3')
    Dom.addClass(title, this.prefixClassName(ClassNames.groupTitle))
    title.innerHTML = group.title || group.name

    const content = document.createElement('div')
    Dom.addClass(content, this.prefixClassName(ClassNames.groupContent))

    const graphOptionsInGroup = group.graphOptions
    const graph = new Graph({
      ...globalGraphOptions,
      ...graphOptionsInGroup,
      container: document.createElement('div'),
      model: globalGraphOptions.model || new Model(),
      width: group.graphWidth || this.options.stencilGraphWidth,
      height: group.graphHeight || this.options.stencilGraphHeight,
      interacting: false,
      preventDefaultBlankAction: false,
    })

    this.registerGraphEvents(graph)

    Dom.append(content, graph.container)
    Dom.append(groupElem, [title, content])
    Dom.appendTo(groupElem, this.content)

    this.groups[group.name] = groupElem
    this.graphs[group.name] = graph
  }

  protected initGroups() {
    this.clearGroups()
    this.setCollapsableState()

    if (this.options.groups && this.options.groups.length) {
      this.options.groups.forEach((group) => {
        this.initGroup(group)
      })
    } else {
      const globalGraphOptions = this.options.stencilGraphOptions || {}
      const graph = new Graph({
        ...globalGraphOptions,
        container: document.createElement('div'),
        model: globalGraphOptions.model || new Model(),
        width: this.options.stencilGraphWidth,
        height: this.options.stencilGraphHeight,
        interacting: false,
        preventDefaultBlankAction: false,
      })
      Dom.append(this.content, graph.container)
      this.graphs[Private.defaultGroupName] = graph
    }
  }

  protected setCollapsableState() {
    this.options.collapsable =
      this.options.collapsable &&
      this.options.groups &&
      this.options.groups.some((group) => group.collapsable !== false)

    if (this.options.collapsable) {
      Dom.addClass(this.container, 'collapsable')
      const collapsed =
        this.options.groups &&
        this.options.groups.every(
          (group) => group.collapsed || group.collapsable === false,
        )
      if (collapsed) {
        Dom.addClass(this.container, 'collapsed')
      } else {
        Dom.removeClass(this.container, 'collapsed')
      }
    } else {
      Dom.removeClass(this.container, 'collapsable')
    }
  }

  protected setTitle() {
    const title = document.createElement('div')
    Dom.addClass(title, this.prefixClassName(ClassNames.title))
    title.innerHTML = this.options.title
    Dom.appendTo(title, this.container)
  }

  protected renderSearch() {
    const elem = document.createElement('div')
    Dom.addClass(elem, this.prefixClassName(ClassNames.search))
    const input = document.createElement('input')
    Dom.attr(input, {
      type: 'search',
      placeholder: this.options.placeholder || 'Search',
    })
    Dom.addClass(input, this.prefixClassName(ClassNames.searchText))
    Dom.append(elem, input)

    return elem
  }

  protected startListening() {
    const title = this.prefixClassName(ClassNames.title)
    const searchText = this.prefixClassName(ClassNames.searchText)
    const groupTitle = this.prefixClassName(ClassNames.groupTitle)

    this.delegateEvents({
      [`click .${title}`]: 'onTitleClick',
      [`touchstart .${title}`]: 'onTitleClick',
      [`click .${groupTitle}`]: 'onGroupTitleClick',
      [`touchstart .${groupTitle}`]: 'onGroupTitleClick',
      [`input .${searchText}`]: 'onSearch',
      [`focusin .${searchText}`]: 'onSearchFocusIn',
      [`focusout .${searchText}`]: 'onSearchFocusOut',
    })
  }

  protected stopListening() {
    this.undelegateEvents()
  }

  protected registerGraphEvents(graph: Graph) {
    graph.on('cell:mousedown', this.onDragStart, this)
  }

  protected unregisterGraphEvents(graph: Graph) {
    graph.off('cell:mousedown', this.onDragStart, this)
  }

  protected loadGroup(
    cells: (Node | Node.Metadata)[],
    groupName?: string,
    reverse?: boolean,
  ) {
    const model = this.getModel(groupName)
    if (model) {
      const nodes = cells.map((cell) =>
        Node.isNode(cell) ? cell : Node.create(cell),
      )
      if (reverse === true) {
        model.removeCells(nodes)
      } else {
        model.resetCells(nodes)
      }
    }

    const group = this.getGroup(groupName)
    let height = this.options.stencilGraphHeight
    if (group && group.graphHeight != null) {
      height = group.graphHeight
    }

    const layout = (group && group.layout) || this.options.layout
    if (layout && model) {
      FunctionExt.call(layout, this, model, group)
    }

    if (!height) {
      const graph = this.getGraph(groupName)
      graph.fitToContent({
        minWidth: graph.options.width,
        gridHeight: 1,
        padding:
          (group && group.graphPadding) ||
          this.options.stencilGraphPadding ||
          10,
      })
    }

    return this
  }

  protected onDragStart(args: EventArgs['node:mousedown']) {
    const { e, node } = args
    const group = this.getGroupByNode(node)
    if (group && group.nodeMovable === false) {
      return
    }
    this.dnd.start(node, e)
  }

  protected filter(keyword: string, filter?: Stencil.Filter) {
    const found = Object.keys(this.graphs).reduce((memo, groupName) => {
      const graph = this.graphs[groupName]
      const name = groupName === Private.defaultGroupName ? null : groupName
      const items = graph.model.getNodes().filter((cell) => {
        let matched = false
        if (typeof filter === 'function') {
          matched = FunctionExt.call(filter, this, cell, keyword, name, this)
        } else if (typeof filter === 'boolean') {
          matched = filter
        } else {
          matched = this.isCellMatched(
            cell,
            keyword,
            filter,
            keyword.toLowerCase() !== keyword,
          )
        }

        const view = graph.renderer.findViewByCell(cell)
        if (view) {
          Dom.toggleClass(view.container, 'unmatched', !matched)
        }

        return matched
      })

      const found = items.length > 0
      const options = this.options

      const model = new Model()
      model.resetCells(items)

      if (options.layout) {
        FunctionExt.call(options.layout, this, model, this.getGroup(groupName))
      }

      if (this.groups[groupName]) {
        Dom.toggleClass(this.groups[groupName], 'unmatched', !found)
      }

      graph.fitToContent({
        gridWidth: 1,
        gridHeight: 1,
        padding: options.stencilGraphPadding || 10,
      })

      return memo || found
    }, false)

    Dom.toggleClass(this.container, 'not-found', !found)
  }

  protected isCellMatched(
    cell: Cell,
    keyword: string,
    filters: Stencil.Filters | undefined,
    ignoreCase: boolean,
  ) {
    if (keyword && filters) {
      return Object.keys(filters).some((shape) => {
        if (shape === '*' || cell.shape === shape) {
          const filter = filters[shape]
          if (typeof filter === 'boolean') {
            return filter
          }

          const paths = Array.isArray(filter) ? filter : [filter]
          return paths.some((path) => {
            let val = cell.getPropByPath<string>(path)
            if (val != null) {
              val = `${val}`
              if (!ignoreCase) {
                val = val.toLowerCase()
              }
              return val.indexOf(keyword) >= 0
            }
            return false
          })
        }

        return false
      })
    }

    return true
  }

  protected onSearch(evt: Dom.EventObject) {
    this.filter(evt.target.value as string, this.options.search)
  }

  protected onSearchFocusIn() {
    Dom.addClass(this.container, 'is-focused')
  }

  protected onSearchFocusOut() {
    Dom.removeClass(this.container, 'is-focused')
  }

  protected onTitleClick() {
    if (this.options.collapsable) {
      Dom.toggleClass(this.container, 'collapsed')
      if (Dom.hasClass(this.container, 'collapsed')) {
        this.collapseGroups()
      } else {
        this.expandGroups()
      }
    }
  }

  protected onGroupTitleClick(evt: Dom.EventObject) {
    const group = evt.target.closest(
      `.${this.prefixClassName(ClassNames.group)}`,
    )
    if (group) {
      this.toggleGroup(Dom.attr(group, 'data-name') || '')
    }

    const allCollapsed = Object.keys(this.groups).every((name) => {
      const group = this.getGroup(name)
      const groupElem = this.groups[name]
      return (
        (group && group.collapsable === false) ||
        Dom.hasClass(groupElem, 'collapsed')
      )
    })

    Dom.toggleClass(this.container, 'collapsed', allCollapsed)
  }

  protected getModel(groupName?: string) {
    const graph = this.getGraph(groupName)
    return graph ? graph.model : null
  }

  protected getGraph(groupName?: string) {
    return this.graphs[groupName || Private.defaultGroupName]
  }

  protected getGroup(groupName?: string) {
    const groups = this.options.groups
    if (groupName != null && groups && groups.length) {
      return groups.find((group) => group.name === groupName)
    }
    return null
  }

  protected getGroupByNode(node: Node) {
    const groups = this.options.groups
    if (groups) {
      return groups.find((group) => {
        const model = this.getModel(group.name)
        if (model) {
          return model.has(node.id)
        }
        return false
      })
    }
    return null
  }

  protected clearGroups() {
    Object.keys(this.graphs).forEach((groupName) => {
      const graph = this.graphs[groupName]
      this.unregisterGraphEvents(graph)
      graph.dispose()
    })
    Object.keys(this.groups).forEach((groupName) => {
      const elem = this.groups[groupName]
      Dom.remove(elem)
    })
    this.graphs = {}
    this.groups = {}
  }

  protected onRemove() {
    this.clearGroups()
    this.dnd.remove()
    this.stopListening()
    this.undelegateDocumentEvents()
  }

  @View.dispose()
  dispose() {
    this.remove()
    CssLoader.clean(this.name)
  }
}

export namespace Stencil {
  export interface Options extends Dnd.Options {
    title: string
    groups?: Group[]
    search?: Filter
    placeholder?: string
    notFoundText?: string
    collapsable?: boolean
    stencilGraphWidth: number
    stencilGraphHeight: number
    stencilGraphOptions?: Graph.Options
    stencilGraphPadding?: number
    layout?: (this: Stencil, model: Model, group?: Group | null) => any
    layoutOptions?: any
  }

  export type Filter = Filters | FilterFn | boolean
  export type Filters = { [shape: string]: string | string[] | boolean }
  export type FilterFn = (
    this: Stencil,
    cell: Node,
    keyword: string,
    groupName: string | null,
    stencil: Stencil,
  ) => boolean

  export interface Group {
    name: string
    title?: string
    collapsed?: boolean
    collapsable?: boolean
    nodeMovable?: boolean

    graphWidth?: number
    graphHeight?: number
    graphPadding?: number
    graphOptions?: Graph.Options
    layout?: (this: Stencil, model: Model, group?: Group | null) => any
    layoutOptions?: any
  }

  export const defaultOptions: Partial<Options> = {
    stencilGraphWidth: 200,
    stencilGraphHeight: 800,
    title: 'Stencil',
    collapsable: false,
    placeholder: 'Search',
    notFoundText: 'No matches found',

    layout(model, group) {
      const options = {
        columnWidth: (this.options.stencilGraphWidth as number) / 2 - 10,
        columns: 2,
        rowHeight: 80,
        resizeToFit: false,
        dx: 10,
        dy: 10,
      }

      grid(model, {
        ...options,
        ...this.options.layoutOptions,
        ...(group ? group.layoutOptions : {}),
      })
    },
    ...Dnd.defaults,
  }
}

namespace ClassNames {
  export const base = 'widget-stencil'
  export const title = `${base}-title`
  export const search = `${base}-search`
  export const searchText = `${search}-text`
  export const content = `${base}-content`
  export const group = `${base}-group`
  export const groupTitle = `${group}-title`
  export const groupContent = `${group}-content`
}

namespace Private {
  export const defaultGroupName = '__default__'
}
