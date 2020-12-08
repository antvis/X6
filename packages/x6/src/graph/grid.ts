import * as Registry from '../registry'
import { Dom, Vector } from '../util'
import { Base } from './base'

export class GridManager extends Base {
  protected instance: Registry.Grid | null
  protected patterns: Registry.Grid.Definition[]

  protected get elem() {
    return this.view.grid
  }

  protected get grid() {
    return this.options.grid
  }

  protected init() {
    this.startListening()
    this.draw(this.grid)
  }

  protected startListening() {
    this.graph.on('scale', this.update, this)
    this.graph.on('translate', this.update, this)
  }

  protected stopListening() {
    this.graph.off('scale', this.update, this)
    this.graph.off('translate', this.update, this)
  }

  protected setVisible(visible: boolean) {
    if (this.grid.visible !== visible) {
      this.grid.visible = visible
      this.update()
    }
  }

  getGridSize() {
    return this.grid.size
  }

  setGridSize(size: number) {
    this.grid.size = Math.max(size, 1)
    this.update()
  }

  show() {
    this.setVisible(true)
    this.update()
  }

  hide() {
    this.setVisible(false)
    this.update()
  }

  clear() {
    this.elem.style.backgroundImage = ''
  }

  draw(options?: GridManager.DrawGridOptions) {
    this.clear()
    this.instance = null
    Object.assign(this.grid, options)
    this.patterns = this.resolveGrid(options)
    this.update()
  }

  update(
    options:
      | Partial<Registry.Grid.Options>
      | Partial<Registry.Grid.Options>[] = {},
  ) {
    const gridSize = this.grid.size
    if (gridSize <= 1 || !this.grid.visible) {
      return this.clear()
    }

    const ctm = this.graph.matrix()
    const grid = this.getInstance()
    const items = Array.isArray(options) ? options : [options]

    this.patterns.forEach((settings, index) => {
      const id = `pattern_${index}`
      const sx = ctm.a || 1
      const sy = ctm.d || 1

      const { update, markup, ...others } = settings
      const options = {
        ...others,
        ...items[index],
        sx,
        sy,
        ox: ctm.e || 0,
        oy: ctm.f || 0,
        width: gridSize * sx,
        height: gridSize * sy,
      }

      if (!grid.has(id)) {
        grid.add(
          id,
          Vector.create(
            'pattern',
            { id, patternUnits: 'userSpaceOnUse' },
            Vector.createVectors(markup),
          ).node,
        )
      }

      const patternElem = grid.get(id)

      if (typeof update === 'function') {
        update(patternElem.childNodes[0] as Element, options)
      }

      let x = options.ox % options.width
      if (x < 0) {
        x += options.width
      }

      let y = options.oy % options.height
      if (y < 0) {
        y += options.height
      }

      Dom.attr(patternElem, {
        x,
        y,
        width: options.width,
        height: options.height,
      })
    })

    const base64 = new XMLSerializer().serializeToString(grid.root)
    const url = `url(data:image/svg+xml;base64,${btoa(base64)})`
    this.elem.style.backgroundImage = url
  }

  protected getInstance() {
    if (!this.instance) {
      this.instance = new Registry.Grid()
    }

    return this.instance
  }

  protected resolveGrid(
    options?: GridManager.DrawGridOptions,
  ): Registry.Grid.Definition[] | never {
    if (!options) {
      return []
    }

    const type = (options as Registry.Grid.NativeItem).type
    if (type == null) {
      return [
        {
          ...Registry.Grid.presets.dot,
          ...options.args,
        },
      ]
    }

    const items = Registry.Grid.registry.get(type)
    if (items) {
      let args = options.args || []
      if (!Array.isArray(args)) {
        args = [args]
      }

      return Array.isArray(items)
        ? items.map((item, index) => ({ ...item, ...args[index] }))
        : [{ ...items, ...args[0] }]
    }

    return Registry.Grid.registry.onNotFound(type)
  }

  @Base.dispose()
  dispose() {
    this.stopListening()
    this.clear()
  }
}

export namespace GridManager {
  export type DrawGridOptions =
    | Registry.Grid.NativeItem
    | Registry.Grid.ManaualItem
    | {
        args?: Registry.Grid.OptionsMap['dot']
      }

  export interface CommonOptions {
    size: number
    visible: boolean
  }

  export type Options = CommonOptions & DrawGridOptions
}
