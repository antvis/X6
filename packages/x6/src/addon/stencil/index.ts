import { FunctionExt } from '../../util'
import { Cell } from '../../model/cell'
import { Node } from '../../model/node'
import { Model } from '../../model/model'
import { View } from '../../view/view'
import { Graph } from '../../graph/graph'
import { EventArgs } from '../../graph/events'
import { grid as gridLayout } from '../../layout/grid'
import { Dnd } from '../dnd'
import { Scroller } from '../scroller'

export class Stencil extends View {
  public readonly options: Stencil.Options
  public readonly dnd: Dnd
  protected readonly graphs: { [groupName: string]: Graph }
  protected readonly $groups: { [groupName: string]: JQuery<HTMLElement> }
  protected readonly $container: JQuery<HTMLDivElement>
  protected readonly $content: JQuery<HTMLDivElement>

  protected get targetScroller() {
    const target = this.options.target
    return target instanceof Graph ? null : target
  }

  protected get targetGraph() {
    const target = this.options.target
    return target instanceof Graph ? target : target.graph
  }

  protected get targetModel() {
    return this.targetGraph.model
  }

  constructor(
    options: Partial<Stencil.Options> & { target: Graph | Scroller },
  ) {
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
    this.$container = this.$(this.container).addClass(
      this.prefixClassName(ClassNames.base),
    )

    if (options.collapsable) {
      this.$container.addClass('collapsable').append(this.renderToggleAll())
    }

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
          .toggleClass('closed', group.closed === true)

        const $title = this.$('<h3/>')
          .addClass(this.prefixClassName(ClassNames.groupTitle))
          .html(group.label || group.name)

        const $content = this.$('<div/>').addClass(
          this.prefixClassName(ClassNames.groupContent),
        )

        const graphOptionsInGroup = group.graphOptions
        const graph = new Graph({
          ...globalGraphOptions,
          ...graphOptionsInGroup,
          container: document.createElement('div'),
          model: globalGraphOptions.model || new Model(),
          width: group.width || options.width,
          height: group.height || options.height,
          interactive: false,
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
        width: options.width,
        height: options.height,
        interactive: false,
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
            placeholder: 'Search',
          })
          .addClass(this.prefixClassName(ClassNames.searchText)),
      )
  }

  protected renderToggleAll() {
    return [
      this.$('<div/>')
        .addClass(this.prefixClassName(ClassNames.title))
        .append(this.$('<label/>').addClass('label').html(this.options.label))
        .append(this.$('<button/>').text('+').addClass('btn btn-expand'))
        .append(this.$('<button/>').text('-').addClass('btn btn-collapse')),
    ]
  }

  protected startListening() {
    const searchText = this.prefixClassName(ClassNames.searchText)
    const title = this.prefixClassName(ClassNames.title)
    const groupTitle = this.prefixClassName(ClassNames.groupTitle)

    this.delegateEvents({
      'click .btn-expand': 'expandGroups',
      'click .btn-collapse': 'collapseGroups',
      [`click .${title} > .label`]: 'expandGroups',
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
    } else {
      if (this.options.groups) {
        Object.keys(this.options.groups).forEach((groupName) => {
          if (data[groupName]) {
            this.loadGroup(data[groupName], groupName)
          }
        })
      }
    }
    return this
  }

  protected loadGroup(cells: (Node | Node.Metadata)[], groupName?: string) {
    const model = this.getModel(groupName)
    if (model) {
      const nodes = cells.map((cell) =>
        cell instanceof Node ? cell : Node.create(cell),
      )
      model.resetCells(nodes)
    }

    const group = this.getGroup(groupName)
    let height = this.options.height
    if (group && group.height != null) {
      height = group.height
    }

    if (this.options.layout) {
      this.options.layout.call(this, model, group)
    }

    if (!height) {
      const graph = this.getGraph(groupName)
      graph.fitToContent({
        minWidth: graph.options.width,
        gridHeight: 1,
        padding: this.options.graphPadding || 10,
      })
    }

    return this
  }

  protected onDragStart(args: EventArgs['node:mousedown']) {
    const { e, node } = args
    this.dnd.start(node, e)
  }

  protected filter(keyworld: string, filter?: Stencil.Filter) {
    const found = Object.keys(this.graphs).reduce((memo, groupName) => {
      const graph = this.graphs[groupName]
      const name = groupName === Private.defaultGroupName ? null : groupName
      const items = graph.model.getCells().filter((cell) => {
        let matched = false
        matched =
          typeof filter === 'function'
            ? filter.call(this, cell, keyworld, name, this)
            : this.isCellMatched(
                cell,
                keyworld,
                typeof filter === 'boolean' ? {} : filter,
                keyworld.toLowerCase() !== keyworld,
              )

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
        options.layout.call(this, model, this.getGroup(groupName))
      }

      if (this.$groups[groupName]) {
        this.$groups[groupName].toggleClass('unmatched', !found)
      }

      graph.fitToContent({
        gridWidth: 1,
        gridHeight: 1,
        padding: options.graphPadding || 10,
      })

      return memo || found
    }, false)

    this.$container.toggleClass('not-found', !found)
  }

  protected isCellMatched(
    cell: Cell,
    keyworld: string,
    filters: Stencil.Filters | undefined,
    ignoreCase: boolean,
  ) {
    if (keyworld && filters) {
      return Object.keys(filters).some((type) => {
        const paths = filters[type]
        return (
          ('*' === type || cell.type === type) &&
          paths.some((path) => {
            let val = cell.getPropByPath<string>(path)
            if (val != null) {
              val = `${val}`
              if (ignoreCase) {
                val = val.toLowerCase()
              }
              return val.indexOf(keyworld) >= 0
            }
          })
        )
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

  protected onGroupTitleClick(evt: JQuery.TriggeredEvent) {
    const $group = this.$(evt.target).closest(
      `.${this.prefixClassName(ClassNames.group)}`,
    )
    this.toggleGroup($group.attr('data-name') || '')
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
    const $group = this.$groups[groupName]
    if ($group && !this.isGroupCollapsed(groupName)) {
      this.trigger('group:collapse', { name: groupName })
      $group.addClass('collapsed')
    }
    return this
  }

  expandGroup(groupName: string) {
    const $group = this.$groups[groupName]
    if ($group && this.isGroupCollapsed(groupName)) {
      this.trigger('group:expand', { name: groupName })
      $group.removeClass('collapsed')
    }
    return this
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
    label: string
    width: number
    height: number
    graphPadding?: number
    stencilGraphOptions?: Graph.Options
    layout?: (this: Stencil, model: Model, gourp?: Group) => any
    layoutOptions?: any
    search?: Filter
    groups?: Group[]
    collapsable?: boolean
  }

  export type Filter = Filters | FilterFn | boolean
  export type Filters = { [type: string]: string[] }
  export type FilterFn = (
    this: Stencil,
    cell: Node,
    keyworld: string,
    groupName: string,
    stencil: Stencil,
  ) => boolean

  export interface Group {
    name: string
    label?: string
    closed?: boolean
    width?: number
    height?: number
    graphOptions?: Graph.Options
    layoutOptions?: any
  }

  export const defaultOptions: Partial<Options> = {
    width: 200,
    height: 800,
    label: 'Stencil',
    collapsable: false,

    layout(model, group) {
      const options = {
        columnWidth: (this.options.width as number) / 2 - 10,
        columns: 2,
        rowHeight: 80,
        resizeToFit: false,
        dx: 10,
        dy: 10,
      }

      gridLayout(model, {
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
