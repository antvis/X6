import { Graph } from '@antv/x6'
import { Export } from './index'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    exportPNG: (fileName?: string, options?: Export.ToImageOptions) => void
    exportJPEG: (fileName?: string, options?: Export.ToImageOptions) => void
  }
}

Graph.prototype.exportPNG = function (
  fileName?: string,
  options?: Export.ToImageOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.exportPNG(fileName, options)
  }
}

Graph.prototype.exportJPEG = function (
  fileName?: string,
  options?: Export.ToImageOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.exportJPEG(fileName, options)
  }
}
