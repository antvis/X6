import { Cell, Disposable, Graph, Model } from '@antv/x6'
import './api'

export class DataTransform<T = any, F = any> extends Disposable {
  public name = 'dataTransform'
  public options: DataTransform.DataTransformPluginOptions<T, F>
  private disabled = true
  private graph: Graph

  public constructor(options: DataTransform.DataTransformPluginOptions<T, F>) {
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

  public fromJSON(
    data: F | Model.FromJSONData,
    options: Model.FromJSONOptions = {},
  ) {
    const { fromJSONTransform } = this.options
    if (fromJSONTransform && !this.disabled) {
      this.graph.fromJSON(fromJSONTransform(data), options)
    }
    this.graph.fromJSON(data as Model.FromJSONData, options)
    return this
  }

  public toJSON(options: Model.ToJSONOptions = {}): T | DataTransform.JSONData {
    const JSONData = this.graph.toJSON(options)
    if (this.disabled) return JSONData
    const { toJsonTransform } = this.options
    if (toJsonTransform) return toJsonTransform(JSONData)
    return JSONData
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
  export interface DataTransformPluginOptions<T, F> {
    toJsonTransform?: (
      JSONData: DataTransform.JSONData,
    ) => T | DataTransform.JSONData
    fromJSONTransform?: (JSONData: F | Model.FromJSONData) => Model.FromJSONData
    enabled: boolean
  }

  export interface JSONData {
    cells: Cell.Properties[]
  }
}
