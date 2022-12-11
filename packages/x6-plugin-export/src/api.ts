import { Graph } from '@antv/x6'
import { Export } from './index'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    toSVG: (
      callback: Export.ToSVGCallback,
      options?: Export.ToSVGOptions,
    ) => void
    toPNG: (
      callback: Export.ToSVGCallback,
      options?: Export.ToImageOptions,
    ) => void
    toJPEG: (
      callback: Export.ToSVGCallback,
      options?: Export.ToImageOptions,
    ) => void
    exportPNG: (fileName?: string, options?: Export.ToImageOptions) => void
    exportJPEG: (fileName?: string, options?: Export.ToImageOptions) => void
    exportSVG: (fileName?: string, options?: Export.ToSVGOptions) => void
  }
}

Graph.prototype.toSVG = function (
  callback: Export.ToSVGCallback,
  options?: Export.ToSVGOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.toSVG(callback, options)
  }
}

Graph.prototype.toPNG = function (
  callback: Export.ToSVGCallback,
  options?: Export.ToImageOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.toPNG(callback, options)
  }
}

Graph.prototype.toJPEG = function (
  callback: Export.ToSVGCallback,
  options?: Export.ToImageOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.toJPEG(callback, options)
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
