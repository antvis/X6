import { Graph, Model } from '@antv/x6'
import { DataTransform } from './index'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    toJSONTransform?: <T = any>(
      options?: Model.ToJSONOptions,
    ) => T | DataTransform.JSONData
    fromJSONTransform?: <F = any>(
      data: F | Model.FromJSONData,
      options?: Model.FromJSONOptions,
    ) => Graph
  }
}

Graph.prototype.toJSONTransform = function (options: Model.ToJSONOptions = {}) {
  const transform = this.getPlugin('dataTransform') as DataTransform
  return transform.toJSON(options)
}

Graph.prototype.fromJSONTransform = function <F = any>(
  data: F | Model.FromJSONData,
  options: Model.FromJSONOptions = {},
) {
  const transform = this.getPlugin('dataTransform') as DataTransform
  transform.fromJSON(data, options)
  return this
}
