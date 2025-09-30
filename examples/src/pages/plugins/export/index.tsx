import '../../index.less'
import { useRef, useEffect } from 'react'
import { Button, Space, Divider } from 'antd'
import { Graph, Export } from '@antv/x6'

type ExportMethods = Pick<
  Graph,
  | 'exportSVG'
  | 'exportPNG'
  | 'exportJPEG'
  | 'toSVG'
  | 'toPNG'
  | 'toJPEG'
  | 'toSVGAsync'
  | 'toPNGAsync'
  | 'toJPEGAsync'
>

type SyncExportKeys = keyof Pick<
  ExportMethods,
  'exportSVG' | 'exportPNG' | 'exportJPEG'
>

type CallbackExportKeys = keyof Pick<
  ExportMethods,
  'toSVG' | 'toPNG' | 'toJPEG'
>

type AsyncExportKeys = keyof Pick<
  ExportMethods,
  'toSVGAsync' | 'toPNGAsync' | 'toJPEGAsync'
>

export const ExportExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const graphRef = useRef<Graph | undefined>(undefined)

  useEffect(() => {
    if (!containerRef.current) return
    const graph = new Graph({
      container: containerRef.current,
      width: 400,
      height: 400,
      grid: true,
    })

    const source = graph.addNode({
      x: 50,
      y: 150,
      width: 80,
      height: 40,
      label: 'Hello',
    })

    const target = graph.addNode({
      x: 280,
      y: 250,
      width: 80,
      height: 40,
      label: 'World',
    })

    graph.addEdge({
      source,
      target,
    })

    graph.use(new Export())

    graphRef.current = graph

    return () => {
      graph.dispose()
    }
  }, [])

  const handleSyncExport = (type: SyncExportKeys) => {
    if (graphRef.current) {
      const graph = graphRef.current
      graph[type](`test ${type}`, {
        preserveDimensions: true,
      })
    }
  }

  const handleCallbackExport = (type: CallbackExportKeys) => {
    if (graphRef.current) {
      const graph = graphRef.current
      graph[type](
        (dataUri) => {
          // 1. toSVG  -> svgXML
          // 2. toPNG  -> base64Image
          // 3. toJPEG -> base64Image
          console.log(`test ${type}`, dataUri)
        },
        {
          preserveDimensions: true,
        },
      )
    }
  }

  const handleAsyncExport = async (type: AsyncExportKeys) => {
    if (graphRef.current) {
      const graph = graphRef.current
      const dataUri = await graph[type]({
        preserveDimensions: true,
      })
      // 1. toSVGAsync  -> svgXML
      // 2. toPNGAsync  -> base64Image
      // 3. toJPEGAsync -> base64Image
      console.log(`test ${type}`, dataUri)
    }
  }

  return (
    <div className="x6-graph-wrap">
      <h1>export</h1>
      <div ref={containerRef} className="x6-graph" />

      <Space
        style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}
      >
        {(['exportSVG', 'exportPNG', 'exportJPEG'] as SyncExportKeys[]).map(
          (type) => (
            <Button key={type} onClick={async () => handleSyncExport(type)}>
              {type}
            </Button>
          ),
        )}

        <Divider type="vertical" />

        {(['toSVG', 'toPNG', 'toJPEG'] as CallbackExportKeys[]).map((type) => (
          <Button key={type} onClick={async () => handleCallbackExport(type)}>
            {type}
          </Button>
        ))}

        <Divider type="vertical" />

        {(['toSVGAsync', 'toPNGAsync', 'toJPEGAsync'] as AsyncExportKeys[]).map(
          (type) => (
            <Button key={type} onClick={async () => handleAsyncExport(type)}>
              {type}
            </Button>
          ),
        )}
      </Space>
    </div>
  )
}
