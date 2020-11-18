import { Dom } from '../util'
import { KeyValue } from '../types'
import { CellView } from '../view'
import { Highlighter } from '../registry'
import { EventArgs } from './events'
import { Base } from './base'

export class HighlightManager extends Base {
  protected readonly highlights: KeyValue<HighlightManager.Cache> = {}

  protected init() {
    this.startListening()
  }

  protected startListening() {
    this.graph.on('cell:highlight', this.onCellHighlight, this)
    this.graph.on('cell:unhighlight', this.onCellUnhighlight, this)
  }

  protected stopListening() {
    this.graph.off('cell:highlight', this.onCellHighlight, this)
    this.graph.off('cell:unhighlight', this.onCellUnhighlight, this)
  }

  protected onCellHighlight({
    view: cellView,
    magnet,
    options = {},
  }: EventArgs['cell:highlight']) {
    const resolved = this.resolveHighlighter(options)
    if (!resolved) {
      return
    }

    const key = this.getHighlighterId(magnet, resolved)
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

  protected onCellUnhighlight({
    magnet,
    options = {},
  }: EventArgs['cell:unhighlight']) {
    const resolved = this.resolveHighlighter(options)
    if (!resolved) {
      return
    }

    const id = this.getHighlighterId(magnet, resolved)
    this.unhighlight(id)
  }

  protected resolveHighlighter(options: CellView.HighlightOptions) {
    const graphOptions = this.options
    let highlighterDef: string | undefined | Highlighter.ManaualItem =
      options.highlighter

    if (highlighterDef == null) {
      // check for built-in types
      const type = options.type
      highlighterDef =
        (type && graphOptions.highlighting[type]) ||
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

  protected getHighlighterId(
    magnet: Element,
    options: NonNullable<
      ReturnType<typeof HighlightManager.prototype.resolveHighlighter>
    >,
  ) {
    Dom.ensureId(magnet)
    return options.name + magnet.id + JSON.stringify(options.args)
  }

  protected unhighlight(id: string) {
    const highlight = this.highlights[id]
    if (highlight) {
      highlight.highlighter.unhighlight(
        highlight.cellView,
        highlight.magnet,
        highlight.args,
      )

      delete this.highlights[id]
    }
  }

  @HighlightManager.dispose()
  dispose() {
    Object.keys(this.highlights).forEach((id) => this.unhighlight(id))
    this.stopListening()
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
