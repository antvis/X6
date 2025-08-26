import { Graph } from '../../graph'
import type { Export } from './index'

declare module '../../graph/graph' {
  interface Graph {
    toSVG: (
      callback: Export.ToSVGCallback,
      options?: Export.ToSVGOptions,
    ) => void
    toSVGAsync: (options?: Export.ToSVGOptions) => Promise<string>
    toPNG: (
      callback: Export.ToSVGCallback,
      options?: Export.ToImageOptions,
    ) => void
    toPNGAsync: (options?: Export.ToImageOptions) => Promise<string>
    toJPEG: (
      callback: Export.ToSVGCallback,
      options?: Export.ToImageOptions,
    ) => void
    toJPEGAsync: (options?: Export.ToImageOptions) => Promise<string>
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

Graph.prototype.toSVGAsync = async function (options?: Export.ToSVGOptions) {
  return new Promise((resolve) => {
    this.toSVG(resolve, options)
  })
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

Graph.prototype.toPNGAsync = async function (options?: Export.ToImageOptions) {
  return new Promise((resolve) => {
    this.toPNG(resolve, options)
  })
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

Graph.prototype.toJPEGAsync = async function (options?: Export.ToImageOptions) {
  return new Promise((resolve) => {
    this.toJPEG(resolve, options)
  })
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
