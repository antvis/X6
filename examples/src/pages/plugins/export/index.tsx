/**
 * Export 插件示例。
 *
 * 注册插件后，Graph 上会挂载：
 * - exportSVG、exportPNG、exportJPEG：触发浏览器下载
 * - toSVG、toPNG、toJPEG：在回调中返回导出结果（类型为 ExportToSVGCallback）
 * - toSVGAsync、toPNGAsync、toJPEGAsync：返回 Promise<string>
 *
 * toSVG、toSVGAsync 得到 SVG XML 字符串；toPNG、toJPEG、toPNGAsync、toJPEGAsync 得到图片 Data URI。
 */
import { Export, Graph } from '@antv/x6'
import { Button, message, Space } from 'antd'
import type React from 'react'
import { useEffect, useRef } from 'react'
import '../../index.less'
import './index.less'

/** exportSVG、exportPNG、exportJPEG 下载时使用的文件名（不含扩展名） */
const FILE_NAME = 'x6-graph'

/** exportPNG、exportJPEG、toPNG、toJPEG、toPNGAsync、toJPEGAsync 使用的选项 */
const imageExportOptions = {
  preserveDimensions: true,
  backgroundColor: '#ffffff',
} as const

/** exportSVG、toSVG、toSVGAsync 使用的选项 */
const svgExportOptions = {
  preserveDimensions: true,
} as const

/** toSVG、toSVGAsync 的返回值可由此保存为 .svg 文件 */
function downloadTextFile(content: string, filename: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/** toPNG、toJPEG、toPNGAsync、toJPEGAsync 的返回值可由此预览 */
function previewDataUri(dataUri: string, title: string) {
  const tab = window.open()
  if (!tab) return
  tab.document.title = title
  const img = tab.document.createElement('img')
  img.src = dataUri
  img.alt = title
  img.style.maxWidth = '100%'
  tab.document.body.appendChild(img)
}

export const ExportExample: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<Graph | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const graph = new Graph({
      container: containerRef.current,
      width: 800,
      height: 600,
      grid: true,
    })

    const source = graph.addNode({
      x: 120,
      y: 180,
      width: 100,
      height: 40,
      attrs: {
        label: { text: 'Hello' },
        body: { strokeWidth: 2 },
      },
    })

    const target = graph.addNode({
      x: 420,
      y: 320,
      width: 100,
      height: 40,
      attrs: {
        label: { text: 'World' },
        body: { strokeWidth: 2 },
      },
    })

    graph.addEdge({ source, target })

    // 注册 Export 插件后，方可调用 exportSVG、toSVG、toSVGAsync 等方法
    graph.use(new Export())
    graphRef.current = graph

    return () => {
      graphRef.current = null
      graph.dispose()
    }
  }, [])

  // exportSVG、exportPNG、exportJPEG
  const onDownloadSVG = () => {
    const graph = graphRef.current
    if (!graph) return
    graph.exportSVG(FILE_NAME, svgExportOptions)
    message.success('SVG 已开始下载')
  }

  const onDownloadPNG = () => {
    const graph = graphRef.current
    if (!graph) return
    graph.exportPNG(FILE_NAME, imageExportOptions)
    message.success('PNG 已开始下载')
  }

  const onDownloadJPEG = () => {
    const graph = graphRef.current
    if (!graph) return
    graph.exportJPEG(FILE_NAME, {
      ...imageExportOptions,
      quality: 0.92,
    })
    message.success('JPEG 已开始下载')
  }

  // toSVG、toPNG、toJPEG
  const onToSVG = () => {
    const graph = graphRef.current
    if (!graph) return
    graph.toSVG(
      (svg) => {
        // toSVG 回调：SVG XML 字符串
        downloadTextFile(svg, `${FILE_NAME}.svg`, 'image/svg+xml')
        message.success('已通过 toSVG 回调保存 SVG')
      },
      svgExportOptions,
    )
  }

  const onToPNG = () => {
    const graph = graphRef.current
    if (!graph) return
    graph.toPNG(
      (dataUri) => {
        // toPNG 回调：data:image/png;base64,...
        previewDataUri(dataUri, 'PNG export')
        message.success('PNG 已在新标签页打开')
      },
      imageExportOptions,
    )
  }

  const onToJPEG = () => {
    const graph = graphRef.current
    if (!graph) return
    graph.toJPEG(
      (dataUri) => {
        // toJPEG 回调：data:image/jpeg;base64,...
        previewDataUri(dataUri, 'JPEG export')
        message.success('JPEG 已在新标签页打开')
      },
      { ...imageExportOptions, quality: 0.92 },
    )
  }

  // toSVGAsync、toPNGAsync、toJPEGAsync
  const onToSVGAsync = async () => {
    const graph = graphRef.current
    if (!graph) return
    const svg = await graph.toSVGAsync(svgExportOptions)
    downloadTextFile(svg, `${FILE_NAME}-async.svg`, 'image/svg+xml')
    message.success(`toSVGAsync 完成，共 ${svg.length} 个字符`)
  }

  const onToPNGAsync = async () => {
    const graph = graphRef.current
    if (!graph) return
    const dataUri = await graph.toPNGAsync(imageExportOptions)
    previewDataUri(dataUri, 'PNG export (async)')
    message.success('toPNGAsync 已在新标签页预览')
  }

  const onToJPEGAsync = async () => {
    const graph = graphRef.current
    if (!graph) return
    const dataUri = await graph.toJPEGAsync({
      ...imageExportOptions,
      quality: 0.92,
    })
    previewDataUri(dataUri, 'JPEG export (async)')
    message.success('toJPEGAsync 已在新标签页预览')
  }

  return (
    <div className="x6-graph-wrap export-example">
      <h1>Export</h1>
      <div className="export-example-body">
        <div
          ref={containerRef}
          className="x6-graph export-example-canvas"
        />
        <aside className="export-example-panel">
          <section className="export-example-panel-section">
            <div className="export-example-panel-title">
              exportSVG、exportPNG、exportJPEG
            </div>
            <Space direction="vertical" size="small">
              <Button onClick={onDownloadSVG}>exportSVG</Button>
              <Button onClick={onDownloadPNG}>exportPNG</Button>
              <Button onClick={onDownloadJPEG}>exportJPEG</Button>
            </Space>
          </section>
          <section className="export-example-panel-section">
            <div className="export-example-panel-title">
              toSVG、toPNG、toJPEG
            </div>
            <Space direction="vertical" size="small">
              <Button onClick={onToSVG}>toSVG</Button>
              <Button onClick={onToPNG}>toPNG</Button>
              <Button onClick={onToJPEG}>toJPEG</Button>
            </Space>
          </section>
          <section className="export-example-panel-section">
            <div className="export-example-panel-title">
              toSVGAsync、toPNGAsync、toJPEGAsync
            </div>
            <Space direction="vertical" size="small">
              <Button onClick={onToSVGAsync}>toSVGAsync</Button>
              <Button onClick={onToPNGAsync}>toPNGAsync</Button>
              <Button onClick={onToJPEGAsync}>toJPEGAsync</Button>
            </Space>
          </section>
        </aside>
      </div>
    </div>
  )
}
