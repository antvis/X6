import { Disposable, Graph } from '@antv/x6'

export class DataTransform extends Disposable {
  private graph: Graph
  public options: DataTransform.DataTransformPluginOptions
  private disabled: boolean

  constructor(options: DataTransform.DataTransformPluginOptions) {
    super()
    this.options = options
  }

  init(graph: Graph) {
    this.graph = graph
  }

  getGraph() {
    return this.graph
  }

  // #region api

  isEnabled() {
    return !this.disabled
  }

  enable() {
    this.disabled = false
  }

  disable() {
    this.disabled = true
  }

  // #endregion

  @Disposable.dispose()
  dispose() {}
}

export namespace DataTransform {
  export interface DataTransformPluginOptions {
    transformFn: () => void
  }
}
