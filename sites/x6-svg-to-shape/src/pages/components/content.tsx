import React from 'react'
import SVGO from 'SVGO'
import classnames from 'classnames'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { Graph, Markup } from '@antv/x6'
import * as svgo from './svgo'
import { App } from '../index'
import './content.less'

export class Content extends React.Component<Content.Props, Content.State> {
  private graphContainer: HTMLDivElement | null = null
  private graph: Graph | null = null

  componentDidMount() {
    this.updateGraph()
  }

  componentWillUpdate(nextProps: Content.Props) {
    if (this.props.file !== nextProps.file) {
      this.updateGraph(nextProps.file)
      console.log(nextProps)
    }
  }

  componentWillUnmount() {
    if (this.graph) {
      this.graph.dispose()
    }
  }

  updateGraph(file: App.File | undefined | null = this.props.file) {
    if (this.props.tab === 'graph' && this.graph == null) {
      this.graph = new Graph({
        container: this.graphContainer!,
        autoResize: true,
        grid: {
          visible: false,
          size: 1,
        },
        panning: {
          enabled: true,
        },
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: false,
        },
      })
    }

    if (file && this.graph) {
      const res = this.optimize(file)

      const size = res.size
      const width = size.width || 100
      const height = size.height || 100

      const x = (this.graph.options.width - width) / 2
      const y = (this.graph.options.height - height) / 2
      const { markup, attrs } = Markup.xml2json(res.data)
      this.graph.clearCells()
      this.graph.addNode({
        shape: 'empty',
        x,
        y,
        width,
        height,
        markup,
        attrs,
      })
    }
  }

  refGraphContainer = (container: HTMLDivElement) => {
    this.graphContainer = container
  }

  optimize(file: App.File | undefined | null) {
    return file
      ? svgo.optimize(file.data, {
          plugins: Content.svgoPlugins,
          pretty: true,
          floatPrecision: 2,
        })
      : null
  }

  renderGraph() {
    return (
      <div
        className={classnames('graph', { active: this.props.tab === 'graph' })}
      >
        <div ref={this.refGraphContainer} />
      </div>
    )
  }

  renderCode() {
    const { tab } = this.props
    if (tab === 'code') {
      const res = this.optimize(this.props.file)
      const size = res.size
      const width = size.width || 100
      const height = size.height || 100

      const code = res
        ? `
const svg = \`${res.data}\`
const width = ${width}
const height = ${height}
const { markup, attrs } = Markup.xml2json(svg)

graph.addNode({
  shape: 'empty',
  x: 100,
  y: 100,
  width,
  height,
  markup,
  attrs,
})
      `.trim()
        : ''
      return (
        <div
          className={classnames('code', { active: this.props.tab === 'code' })}
        >
          <SyntaxHighlighter
            language="typescript"
            style={monokai}
            customStyle={{ background: 'transparent' }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="body">
        <div className="output">
          <div className="content">
            {this.renderGraph()}
            {this.renderCode()}
          </div>
        </div>
        <div className="settings"></div>
      </div>
    )
  }
}

export namespace Content {
  export interface Props {
    tab: App.Tab
    file?: App.File | null
  }

  export interface State {}

  export const svgoPlugins: SVGO.PluginConfig[] = [
    { cleanupAttrs: true },
    { inlineStyles: true },
    { removeDoctype: true },
    { removeXMLProcInst: true },
    { removeComments: true },
    { removeMetadata: true },
    { removeTitle: true },
    { removeDesc: true },
    { removeUselessDefs: true },
    { removeXMLNS: false },
    { removeEditorsNSData: true },
    { removeEmptyAttrs: true },
    { removeHiddenElems: true },
    { removeEmptyText: true },
    { removeEmptyContainers: true },
    { removeViewBox: true },
    { cleanupEnableBackground: true },
    { minifyStyles: true },
    { convertStyleToAttrs: true },
    { convertColors: true },
    { convertPathData: true },
    { convertTransform: true },
    { removeUnknownsAndDefaults: true },
    { removeNonInheritableGroupAttrs: true },
    { removeUselessStrokeAndFill: true },
    { removeUnusedNS: true },
    { prefixIds: false },
    { cleanupIDs: false },
    { cleanupNumericValues: false },
    { cleanupListOfValues: false },
    { moveElemsAttrsToGroup: true },
    { moveGroupAttrsToElems: true },
    { collapseGroups: true },
    { removeRasterImages: false },
    { mergePaths: true },
    { convertShapeToPath: true },
    { convertEllipseToCircle: true },
    { sortAttrs: false },
    { sortDefsChildren: true },
    { removeDimensions: false },
    { removeAttrs: false },
    { removeAttributesBySelector: false },
    { removeElementsByAttr: false },
    { addClassesToSVGElement: false },
    { addAttributesToSVGElement: false },
    { removeOffCanvasPaths: false },
    { removeStyleElement: false },
    { removeScriptElement: false },
    { reusePaths: false },
  ]
}
