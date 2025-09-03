import { Graph } from '../../graph'
import type { Export } from './index'
import type {
  ExportToImageOptions,
  ExportToSVGCallback,
  ExportToSVGOptions,
} from './type'

declare module '../../graph/graph' {
  interface Graph {
    toSVG: (callback: ExportToSVGCallback, options?: ExportToSVGOptions) => void
    toSVGAsync: (options?: ExportToSVGOptions) => Promise<string>
    toPNG: (
      callback: ExportToSVGCallback,
      options?: ExportToImageOptions,
    ) => void
    toPNGAsync: (options?: ExportToImageOptions) => Promise<string>
    toJPEG: (
      callback: ExportToSVGCallback,
      options?: ExportToImageOptions,
    ) => void
    toJPEGAsync: (options?: ExportToImageOptions) => Promise<string>
    exportPNG: (fileName?: string, options?: ExportToImageOptions) => void
    exportJPEG: (fileName?: string, options?: ExportToImageOptions) => void
    exportSVG: (fileName?: string, options?: ExportToSVGOptions) => void
  }
}

Graph.prototype.toSVG = function (
  callback: ExportToSVGCallback,
  options?: ExportToSVGOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.toSVG(callback, options)
  }
}

Graph.prototype.toSVGAsync = async function (options?: ExportToSVGOptions) {
  return new Promise((resolve) => {
    this.toSVG(resolve, options)
  })
}

Graph.prototype.toPNG = function (
  callback: ExportToSVGCallback,
  options?: ExportToImageOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.toPNG(callback, options)
  }
}

Graph.prototype.toPNGAsync = async function (options?: ExportToImageOptions) {
  return new Promise((resolve) => {
    this.toPNG(resolve, options)
  })
}

Graph.prototype.toJPEG = function (
  callback: ExportToSVGCallback,
  options?: ExportToImageOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.toJPEG(callback, options)
  }
}

Graph.prototype.toJPEGAsync = async function (options?: ExportToImageOptions) {
  return new Promise((resolve) => {
    this.toJPEG(resolve, options)
  })
}

Graph.prototype.exportPNG = function (
  fileName?: string,
  options?: ExportToImageOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.exportPNG(fileName, options)
  }
}

Graph.prototype.exportJPEG = function (
  fileName?: string,
  options?: ExportToImageOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.exportJPEG(fileName, options)
  }
}

Graph.prototype.exportSVG = function (
  fileName?: string,
  options?: ExportToSVGOptions,
) {
  const instance = this.getPlugin('export') as Export
  if (instance) {
    instance.exportSVG(fileName, options)
  }
}
