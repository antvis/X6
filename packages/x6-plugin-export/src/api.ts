import { Graph } from '@antv/x6'
import { Export } from './index'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    exportPNG: (fileName?: string, options?: Export.ToImageOptions) => void
    exportJPEG: (fileName?: string, options?: Export.ToImageOptions) => void
    exportSVG: (fileName?: string, options?: Export.ToSVGOptions) => void
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

Graph.prototype.exportSVG = function (
  fileName?: string,
  options?: Export.ToSVGOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.exportSVG(fileName, options)
  }
}
