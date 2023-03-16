import { Basecoat, CssLoader, KeyValue, Node, Graph, EventArgs } from '@antv/x6'
import { TransformImpl } from './transform'
import { content } from './style/raw'
import './api'

export class Transform extends Basecoat<Transform.EventArgs> {
  private graph: Graph
  protected widgets: Map<Node, TransformImpl> = new Map()
  public name = 'transform'
  private disabled = false

  constructor(public readonly options: Transform.Options = {}) {
    super()
    CssLoader.ensure(this.name, content)
  }

  init(graph: Graph) {
    this.graph = graph
    if (this.disabled) {
      return
    }
    this.startListening()
  }

  protected startListening() {
    this.graph.on('node:click', this.onNodeClick, this)
    this.graph.on('blank:mousedown', this.onBlankMouseDown, this)
  }

  protected stopListening() {
    this.graph.off('node:click', this.onNodeClick, this)
    this.graph.off('blank:mousedown', this.onBlankMouseDown, this)
  }

  enable() {
    if (this.disabled) {
      this.disabled = false
      this.startListening()
    }
  }

  disable() {
    if (!this.disabled) {
      this.disabled = true
      this.stopListening()
    }
  }

  isEnabled() {
    return !this.disabled
  }

  createWidget(node: Node) {
    this.clearWidgets()
    const widget = this.createTransform(node)
    if (widget) {
      this.widgets.set(node, widget)
      widget.on('*', (name, args) => {
        this.trigger(name, args)
        this.graph.trigger(name, args)
      })
    }
  }

  protected onNodeClick({ node }: EventArgs['node:click']) {
    this.createWidget(node)
  }

  protected onBlankMouseDown() {
    this.clearWidgets()
  }

  protected createTransform(node: Node) {
    const options = this.getTransformOptions(node)
    if (options.resizable || options.rotatable) {
      return new TransformImpl(options, node, this.graph)
    }

    return null
  }

  protected getTransformOptions(node: Node) {
    if (!this.options.resizing) {
      this.options.resizing = {
        enabled: false,
      }
    }

    if (!this.options.rotating) {
      this.options.rotating = {
        enabled: false,
      }
    }

    if (typeof this.options.resizing === 'boolean') {
      this.options.resizing = {
        enabled: this.options.resizing,
      }
    }
    if (typeof this.options.rotating === 'boolean') {
      this.options.rotating = {
        enabled: this.options.rotating,
      }
    }

    const resizing = Transform.parseOptionGroup<Transform.ResizingRaw>(
      this.graph,
      node,
      this.options.resizing,
    )

    const rotating = Transform.parseOptionGroup<Transform.RotatingRaw>(
      this.graph,
      node,
      this.options.rotating,
    )

    const options: TransformImpl.Options = {
      resizable: !!resizing.enabled,
      minWidth: resizing.minWidth || 0,
      maxWidth: resizing.maxWidth || Number.MAX_SAFE_INTEGER,
      minHeight: resizing.minHeight || 0,
      maxHeight: resizing.maxHeight || Number.MAX_SAFE_INTEGER,
      orthogonalResizing:
        typeof resizing.orthogonal === 'boolean' ? resizing.orthogonal : true,
      restrictedResizing: !!resizing.restrict,
      autoScrollOnResizing:
        typeof resizing.autoScroll === 'boolean' ? resizing.autoScroll : true,
      preserveAspectRatio: !!resizing.preserveAspectRatio,
      allowReverse:
        typeof resizing.allowReverse === 'boolean'
          ? resizing.allowReverse
          : true,

      rotatable: !!rotating.enabled,
      rotateGrid: rotating.grid || 15,
    }

    return options
  }

  clearWidgets() {
    this.widgets.forEach((widget, node) => {
      if (this.graph.getCellById(node.id)) {
        widget.dispose()
      }
    })
    this.widgets.clear()
  }

  @Basecoat.dispose()
  dispose() {
    this.clearWidgets()
    this.stopListening()
    this.off()
    CssLoader.clean(this.name)
  }
}

export namespace Transform {
  export interface EventArgs extends TransformImpl.EventArgs {}

  type OptionItem<T, S> = S | ((this: Graph, arg: T) => S)

  export interface ResizingRaw {
    enabled?: boolean
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    orthogonal?: boolean
    restrict?: boolean | number
    autoScroll?: boolean
    preserveAspectRatio?: boolean
    allowReverse?: boolean
  }

  export interface RotatingRaw {
    enabled?: boolean
    grid?: number
  }

  export type Resizing = {
    [K in keyof ResizingRaw]?: OptionItem<Node, ResizingRaw[K]>
  }

  export type Rotating = {
    [K in keyof RotatingRaw]?: OptionItem<Node, RotatingRaw[K]>
  }

  export type Options = {
    rotating?: boolean | Partial<Rotating>
    resizing?: boolean | Partial<Resizing>
  }

  export function parseOptionGroup<
    K extends KeyValue,
    S extends KeyValue = KeyValue,
    T = any,
  >(graph: Graph, arg: T, options: S): K {
    const result: any = {}
    Object.keys(options || {}).forEach((key) => {
      const val = options[key]
      result[key] = typeof val === 'function' ? val.call(graph, arg) : val
    })
    return result
  }
}
