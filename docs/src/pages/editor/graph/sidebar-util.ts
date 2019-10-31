import { EditorGraph } from './graph'
import { DataItem, generals } from './sidebar-data'
import { util } from '../../../../../src'

export interface Palette {
  title: string
  expand: boolean
  items: PaletteItem[]
}

export interface PaletteItem {
  data: DataItem
  render: (
    container: HTMLDivElement,
    thumbWidth: number,
    thumbHeight: number,
    thumbBorder: number,
  ) => void
}

const palettes: Palette[] = []

palettes.push({
  title: 'General',
  expand: true,
  items: generals.map(data => (
    {
      data,
      render: getRenderer(data),
    }
  )),
})

export function getPalettes() {
  return palettes
}

let graph: EditorGraph

function createTempGraph() {
  const container = util.createElement('div')
  container.style.visibility = 'hidden'
  container.style.position = 'absolute'
  container.style.overflow = 'hidden'
  container.style.height = '1px'
  container.style.width = '1px'

  document.body.appendChild(container)

  const graph = new EditorGraph(container, {
    grid: false,
    tooltip: false,
    folding: false,
    connection: false,
    autoScroll: false,
    resetViewOnRootChange: false,
  })

  graph.renderer.antialiased = true

  graph.renderer.minSvgStrokeWidth = 1.3

  return graph
}

function getTempGraph() {
  if (graph == null) {
    graph = createTempGraph()
  }
  return graph
}

function getRenderer(item: DataItem) {
  return (
    container: HTMLDivElement,
    thumbWidth: number,
    thumbHeight: number,
    thumbBorder: number,
  ) => {
    const width = item.width
    const height = item.height
    const graph = getTempGraph()

    graph.view.scaleAndTranslate(1, 0, 0)
    graph.addNode({
      width,
      height,
      data: item.data,
      style: item.style,
    })

    const bounds = graph.getGraphBounds()
    const scale = Math.floor(Math.min(
      (thumbWidth - 2 * thumbBorder) / bounds.width,
      (thumbHeight - 2 * thumbBorder) / bounds.height,
    ) * 100) / 100

    graph.view.scaleAndTranslate(
      scale,
      Math.floor((thumbWidth - bounds.width * scale) / 2 / scale - bounds.x),
      Math.floor((thumbHeight - bounds.height * scale) / 2 / scale - bounds.y),
    )

    let node = util.createElement('div')
    if (graph.dialect === 'svg') {
      const stage = graph.view.getStage() as SVGGElement
      const svg = stage.ownerSVGElement!.cloneNode(true) as SVGElement
      svg.style.position = 'relative'
      svg.style.overflow = 'hidden'
      svg.style.left = ''
      svg.style.top = ''
      svg.style.width = util.toPx(thumbWidth)
      svg.style.height = util.toPx(thumbHeight)

      node.appendChild(svg)
    } else {
      node.innerHTML = graph.container.innerHTML
    }

    container.appendChild(node)
    graph.getModel().clear()
  }
}
