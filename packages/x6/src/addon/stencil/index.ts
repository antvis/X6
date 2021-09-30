import { FunctionExt } from '../../util'
import { grid } from '../../layout/grid'
import { Cell } from '../../model/cell'
import { Node } from '../../model/node'
import { Model } from '../../model/model'
import { View } from '../../view/view'
import { Graph } from '../../graph/graph'
import { EventArgs } from '../../graph/events'
import { Dnd } from '../dnd'

export class Stencil extends View {
  public readonly options: Stencil.Options
  public readonly dnd: Dnd
  protected readonly graphs: { [groupName: string]: Graph }
  protected readonly $groups: { [groupName: string]: JQuery<HTMLElement> }
  protected readonly $container: JQuery<HTMLDivElement>
  protected readonly $content: JQuery<HTMLDivElement>

  protected get targetScroller() {
    const target = this.options.target
    return Graph.isGraph(target) ? target.scroller.widget : target
  }

  protected get targetGraph() {
    const target = this.options.target
    return Graph.isGraph(target) ? target : target.graph
  }

  protected get targetModel() {
    return this.targetGraph.model
  }

  constructor(options: Partial<Stencil.Options>) {
    super()

    this.graphs = {}
    this.$groups = {}
    this.options = {
      ...Stencil.defaultOptions,
      ...options,
    } as Stencil.Options

    this.dnd = new Dnd(this.options)
    this.onSearch = FunctionExt.debounce(this.onSearch, 200)
    this.container = document.createElement('div')
    this.$container = this.$(this.container)
      .addClass(this.prefixClassName(ClassNames.base))
      .attr(
        'data-not-found-text',
        this.options.notFoundText || 'No matches found',
      )

    this.options.collapsable =
      options.collapsable &&
      options.groups &&
      options.groups.some((group) => group.collapsable !== false)

    if (this.options.collapsable) {
      this.$container.addClass('collapsable')
      const collapsed =
        options.groups &&
        options.groups.every(
          (group) => group.collapsed || group.collapsable === false,
        )
      if (collapsed) {
        this.$container.addClass('collapsed')
      }
    }

    this.$('<div/>')
      .addClass(this.prefixClassName(ClassNames.title))
      .html(this.options.title)
      .appendTo(this.$container)

    if (options.search) {
      this.$container.addClass('searchable').append(this.renderSearch())
    }

    this.$content = this.$('<div/>')
      .addClass(this.prefixClassName(ClassNames.content))
      .appendTo(this.$container)

    const globalGraphOptions = options.stencilGraphOptions || {}

    if (options.groups && options.groups.length) {
      options.groups.forEach((group) => {
        const $group = this.$('<div/>')
          .addClass(this.prefixClassName(ClassNames.group))
          .attr('data-name', group.name)

        if (
          (group.collapsable == null && options.collapsable) ||
          group.collapsable !== false
        ) {
          $group.addClass('collapsable')
        }

        $group.toggleClass('collapsed', group.collapsed === true)

        const $title = this.$('<h3/>')
          .addClass(this.prefixClassName(ClassNames.groupTitle))
          .html(group.title || group.name)

        const $content = this.$('<div/>').addClass(
          this.prefixClassName(ClassNames.groupContent),
        )

        const graphOptionsInGroup = group.graphOptions
        const graph = new Graph({
          ...globalGraphOptions,
          ...graphOptionsInGroup,
          container: document.createElement('div'),
          model: globalGraphOptions.model || new Model(),
          width: group.graphWidth || options.stencilGraphWidth,
          height: group.graphHeight || options.stencilGraphHeight,
          interacting: false,
          preventDefaultBlankAction: false,
        })

        $content.append(graph.container)
        $group.append($title, $content).appendTo(this.$content)

        this.$groups[group.name] = $group
        this.graphs[group.name] = graph
      })
    } else {
      const graph = new Graph({
        ...globalGraphOptions,
        container: document.createElement('div'),
        model: globalGraphOptions.model || new Model(),
        width: options.stencilGraphWidth,
        height: options.stencilGraphHeight,
        interacting: false,
        preventDefaultBlankAction: false,
      })
      this.$content.append(graph.container)
      this.graphs[Private.defaultGroupName] = graph
    }

    this.startListening()
    return this
  }

  protected renderSearch() {
    return this.$('<div/>')
      .addClass(this.prefixClassName(ClassNames.search))
      .append(
        this.$('<input/>')
          .attr({
            type: 'search',
            placeholder: this.options.placeholder || 'Search',
          })
          .addClass(this.prefixClassName(ClassNames.searchText)),
      )
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

    Object.keys(this.graphs).forEach((groupName) => {
      const graph = this.graphs[groupName]
      graph.on('cell:mousedown', this.onDragStart, this)
    })
  }

  protected stopListening() {
    this.undelegateEvents()
    Object.keys(this.graphs).forEach((groupName) => {
      const graph = this.graphs[groupName]
      graph.off('cell:mousedown', this.onDragStart, this)
    })
  }

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

  protected loadGroup(cells: (Node | Node.Metadata)[], groupName?: string) {
    const model = this.getModel(groupName)
    if (model) {
      const nodes = cells.map((cell) =>
        Node.isNode(cell) ? cell : Node.create(cell),
      )
      model.resetCells(nodes)
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
          view.$(view.container).toggleClass('unmatched', !matched)
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

      if (this.$groups[groupName]) {
        this.$groups[groupName].toggleClass('unmatched', !found)
      }

      graph.fitToContent({
        gridWidth: 1,
        gridHeight: 1,
        padding: options.stencilGraphPadding || 10,
      })

      return memo || found
    }, false)

    this.$container.toggleClass('not-found', !found)
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

  protected onSearch(evt: JQuery.TriggeredEvent) {
    this.filter(evt.target.value as string, this.options.search)
  }

  protected onSearchFocusIn() {
    this.$container.addClass('is-focused')
  }

  protected onSearchFocusOut() {
    this.$container.removeClass('is-focused')
  }

  protected onTitleClick() {
    if (this.options.collapsable) {
      this.$container.toggleClass('collapsed')
      if (this.$container.hasClass('collapsed')) {
        this.collapseGroups()
      } else {
        this.expandGroups()
      }
    }
  }

  protected onGroupTitleClick(evt: JQuery.TriggeredEvent) {
    const $group = this.$(evt.target).closest(
      `.${this.prefixClassName(ClassNames.group)}`,
    )
    this.toggleGroup($group.attr('data-name') || '')

    const allCollapsed = Object.keys(this.$groups).every((name) => {
      const group = this.getGroup(name)
      const $group = this.$groups[name]
      return (
        (group && group.collapsable === false) || $group.hasClass('collapsed')
      )
    })

    this.$container.toggleClass('collapsed', allCollapsed)
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
      const $group = this.$groups[groupName]
      if ($group && !this.isGroupCollapsed(groupName)) {
        this.trigger('group:collapse', { name: groupName })
        $group.addClass('collapsed')
      }
    }
    return this
  }

  expandGroup(groupName: string) {
    if (this.isGroupCollapsable(groupName)) {
      const $group = this.$groups[groupName]
      if ($group && this.isGroupCollapsed(groupName)) {
        this.trigger('group:expand', { name: groupName })
        $group.removeClass('collapsed')
      }
    }
    return this
  }

  isGroupCollapsable(groupName: string) {
    const $group = this.$groups[groupName]
    return $group.hasClass('collapsable')
  }

  isGroupCollapsed(groupName: string) {
    const $group = this.$groups[groupName]
    return $group && $group.hasClass('collapsed')
  }

  collapseGroups() {
    Object.keys(this.$groups).forEach((groupName) =>
      this.collapseGroup(groupName),
    )
    return this
  }

  expandGroups() {
    Object.keys(this.$groups).forEach((groupName) =>
      this.expandGroup(groupName),
    )
    return this
  }

  resizeGroup(groupName: string, size: { width: number; height: number }) {
    const graph = this.graphs[groupName]
    if (graph) {
      graph.resize(size.width, size.height)
    }
    return this
  }

  onRemove() {
    Object.keys(this.graphs).forEach((groupName) => {
      const graph = this.graphs[groupName]
      graph.view.remove()
      delete this.graphs[groupName]
    })
    this.dnd.remove()
    this.stopListening()
    this.undelegateDocumentEvents()
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
