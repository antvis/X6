import { Disposable, CssLoader, KeyValue } from '@antv/x6-common'
import { Node, Graph, EventArgs } from '@antv/x6'
import { TransformImpl } from './transform'
import { content } from './style/raw'

export class Transform extends Disposable {
  private graph: Graph
  protected widgets: Map<Node, TransformImpl> = new Map()
  public name = 'transform'

  constructor(public readonly options: Transform.Options) {
    super()
  }

  init(graph: Graph) {
    CssLoader.ensure(this.name, content)
    this.graph = graph
    this.startListening()
  }

  protected startListening() {
    this.graph.on('node:mouseup', this.onNodeMouseUp, this)
    this.graph.on('blank:mousedown', this.onBlankMouseDown, this)
  }

  protected stopListening() {
    this.graph.off('node:mouseup', this.onNodeMouseUp, this)
    this.graph.off('blank:mousedown', this.onBlankMouseDown, this)
  }

  protected onNodeMouseUp({ node }: EventArgs['node:mouseup']) {
    this.clearWidgets()
    const widget = this.createTransform(node)
    if (widget) {
      this.widgets.set(node, widget)
    }
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
      resizable: resizing.enabled,
      minWidth: resizing.minWidth || 0,
      maxWidth: resizing.maxWidth || Number.MAX_SAFE_INTEGER,
      minHeight: resizing.minHeight || 0,
      maxHeight: resizing.maxHeight || Number.MAX_SAFE_INTEGER,
      orthogonalResizing: resizing.orthogonal || true,
      restrictedResizing: resizing.restrict || false,
      autoScrollOnResizing: resizing.autoScroll || true,
      preserveAspectRatio: resizing.preserveAspectRatio || false,
      allowReverse: resizing.allowReverse || true,

      rotatable: rotating.enabled || false,
      rotateGrid: rotating.grid || 15,
    }

    return options
  }

  protected clearWidgets() {
    this.widgets.forEach((widget) => widget.dispose())
    this.widgets.clear()
  }

  @Disposable.dispose()
  dispose() {
    this.clearWidgets()
    this.stopListening()
    CssLoader.clean(this.name)
  }
}

export namespace Transform {
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
