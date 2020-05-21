import { Dom } from '../util'
import { KeyValue } from '../types'
import { CellView } from '../view'
import { Highlighter } from '../definition'
import { Base } from './base'

export class HighlightManager extends Base {
  protected readonly highlights: KeyValue<HighlightManager.Cache> = {}

  protected init() {
    this.graph.on('cell:highlight', ({ view, magnet, options }) =>
      this.onCellHighlight(view, magnet, options),
    )

    this.graph.on('cell:unhighlight', ({ view, magnet, options }) =>
      this.onCellUnhighlight(view, magnet, options),
    )
  }

  protected onCellHighlight(
    cellView: CellView,
    magnet: Element,
    options: CellView.HighlightOptions = {},
  ) {
    const resolved = this.resolveHighlighter(options)
    if (!resolved) {
      return
    }

    Dom.ensureId(magnet)
    const key = resolved.name + magnet.id + JSON.stringify(resolved.args)
    if (!this.highlights[key]) {
      const highlighter = resolved.highlighter
      highlighter.highlight(cellView, magnet, { ...resolved.args })

      this.highlights[key] = {
        cellView,
        magnet,
        highlighter,
        args: resolved.args,
      }
    }
  }

  protected onCellUnhighlight(
    cellView: CellView,
    magnet: Element,
    options: CellView.HighlightOptions = {},
  ) {
    const resolved = this.resolveHighlighter(options)
    if (!resolved) {
      return
    }

    Dom.ensureId(magnet)
    const key = resolved.name + magnet.id + JSON.stringify(resolved.args)
    const highlight = this.highlights[key]
    if (highlight) {
      // Use the cellView and magnetEl that were used by the highlighter.highlight() method.
      highlight.highlighter.unhighlight(
        highlight.cellView,
        highlight.magnet,
        highlight.args,
      )

      delete this.highlights[key]
    }
  }

  protected resolveHighlighter(options: CellView.HighlightOptions) {
    let highlighterDef = options.highlighter
    const graphOptions = this.options
    if (highlighterDef == null) {
      // check for built-in types
      const type = [
        'embedding',
        'connecting',
        'nodeAvailability',
        'magnetAvailability',
      ].find((type) => !!(options as any)[type])

      highlighterDef =
        (type && (graphOptions.highlighting as any)[type]) ||
        graphOptions.highlighting.default
    }

    if (highlighterDef == null) {
      return null
    }

    const def: Highlighter.ManaualItem =
      typeof highlighterDef === 'string'
        ? {
            name: highlighterDef,
          }
        : highlighterDef

    const name = def.name
    const highlighter = Highlighter.registry.get(name)
    if (highlighter == null) {
      return Highlighter.registry.onNotFound(name)
    }

    Highlighter.check(name, highlighter)

    return {
      name,
      highlighter,
      args: def.args || {},
    }
  }
}

export namespace HighlightManager {
  export interface Cache {
    highlighter: Highlighter.Definition<KeyValue>
    cellView: CellView
    magnet: Element
    args: KeyValue
  }

  export type Options = Highlighter.NativeItem | Highlighter.ManaualItem
}
