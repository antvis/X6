import { Cell, Disposable, Graph, Model } from '@antv/x6'

export class DataTransform<T> extends Disposable {
  public name = 'dataTransform'
  public options: DataTransform.DataTransformPluginOptions<T>
  private disabled = true
  private graph: Graph

  public constructor(options: DataTransform.DataTransformPluginOptions<T>) {
    super()
    const { enabled } = options
    if (enabled) {
      this.disabled = false
    }
    this.options = options
  }

  public init(graph: Graph) {
    this.graph = graph
  }

  public toJsonTransform(JSONData: DataTransform.JSONData): T {
    const { toJsonTransform } = this.options
    return toJsonTransform(JSONData)
  }

  public toJSON(options: Model.ToJSONOptions = {}): T {
    return this.toJsonTransform(this.graph.toJSON(options))
  }

  public isEnabled() {
    return !this.disabled
  }

  public enable() {
    this.disabled = false
  }

  public disable() {
    this.disabled = true
  }

  // #endregion

  @Disposable.dispose()
  dispose() {}
}

export namespace DataTransform {
  export interface DataTransformPluginOptions<T> {
    toJsonTransform: (JSONData: DataTransform.JSONData) => T
    enabled: boolean
  }

  export interface JSONData {
    cells: Cell.Properties[]
  }
}
