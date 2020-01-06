import { Point, Style, Cell, Graph, DomUtil } from '@antv/x6'
import arrowUrl from './stencil/arrows.xml'
import flowchartUrl from './/stencil/flowchart.xml'
import { StencilRegistry } from './stencil-registry'
import { DataItem, generals, getUMLPaletteItems } from './sidebar-data'

export interface Palette {
  title: string
  expand: boolean
  items?: PaletteItem[]
  load?: Promise<PaletteItem[]>
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

palettes.push(
  {
    title: 'General',
    expand: true,
    items: generals.map(data => ({
      data,
      render: getRenderer(data),
    })),
  },
  {
    title: 'Flow',
    expand: true,
    load: loadStencil(flowchartUrl, {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 2,
    }),
  },
  {
    title: 'UML',
    expand: true,
    items: getUMLPaletteItems(),
  },
  {
    title: 'Arrows',
    expand: true,
    load: loadStencil(arrowUrl, {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 2,
    }),
  },
)

export function getPalettes() {
  return palettes
}

const dataCache: WeakMap<HTMLElement, DataItem> = new WeakMap()
export function getDataItem(elem: HTMLElement) {
  return dataCache.get(elem)
}

let graph: Graph

function createTempGraph() {
  const container = DomUtil.createElement('div')
  container.style.visibility = 'hidden'
  container.style.position = 'absolute'
  container.style.overflow = 'hidden'
  container.style.height = '1px'
  container.style.width = '1px'

  document.body.appendChild(container)

  const graph = new Graph(container, {
    grid: false,
    tooltip: false,
    folding: false,
    connection: false,
    autoScroll: false,
    resetViewOnRootChange: false,
    backgroundColor: null,
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

export function getRenderer(item: DataItem) {
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
    if (item.isEdge) {
      graph.addEdge({
        label: item.data,
        style: { ...item.style, stroke: '#000' },
        points: item.points ? [...item.points] : [],
        sourcePoint: new Point(0, height),
        targetPoint: new Point(width, 0),
      })
    } else {
      graph.addNode({
        width,
        height,
        label: item.data,
        style: item.style,
      })
    }

    const elem = renderThumb(
      graph,
      container,
      thumbWidth,
      thumbHeight,
      thumbBorder,
    )

    dataCache.set(elem, item)
  }
}

export function getRendererForCells(cells: Cell[]) {
  return (
    container: HTMLDivElement,
    thumbWidth: number,
    thumbHeight: number,
    thumbBorder: number,
  ) => {
    const graph = getTempGraph()
    graph.view.scaleAndTranslate(1, 0, 0)
    graph.addCells(cells)
    return renderThumb(graph, container, thumbWidth, thumbHeight, thumbBorder)
  }
}

function renderThumb(
  graph: Graph,
  container: HTMLDivElement,
  thumbWidth: number,
  thumbHeight: number,
  thumbBorder: number,
) {
  const bounds = graph.getGraphBounds()
  const scale =
    Math.floor(
      Math.min(
        (thumbWidth - 2 * thumbBorder) / bounds.width,
        (thumbHeight - 2 * thumbBorder) / bounds.height,
      ) * 100,
    ) / 100

  graph.view.scaleAndTranslate(
    scale,
    Math.floor((thumbWidth - bounds.width * scale) / 2 / scale - bounds.x),
    Math.floor((thumbHeight - bounds.height * scale) / 2 / scale - bounds.y),
  )

  let node = DomUtil.createElement('div')
  if (graph.dialect === 'svg') {
    const stage = graph.view.getStage() as SVGGElement
    const svg = stage.ownerSVGElement!.cloneNode(true) as SVGElement
    svg.style.position = 'relative'
    svg.style.overflow = 'hidden'
    svg.style.left = ''
    svg.style.top = ''
    svg.style.width = DomUtil.toPx(thumbWidth)
    svg.style.height = DomUtil.toPx(thumbHeight)

    node.appendChild(svg)
  } else {
    node.innerHTML = graph.container.innerHTML
  }

  container.appendChild(node)
  graph.getModel().clear()

  return node
}

function getTagsForStencil(packageName: string, stencilName: string) {
  const tags = packageName.split('.').map(tag => tag.replace(/_/g, ' '))
  tags.push(stencilName.replace(/_/g, ' '))
  return tags
}

function loadStencil(url: string, style: Style) {
  const items: PaletteItem[] = []

  return StencilRegistry.loadStencilSet(
    url,
    false,
    (
      packageName: string,
      stencilName: string,
      title: string,
      width: number,
      height: number,
    ) => {
      const shapeName = StencilRegistry.getShapeName(packageName, stencilName)
      const tags = getTagsForStencil(packageName, stencilName)

      const data: DataItem = {
        title,
        width,
        height,
        style: { ...style, shape: shapeName },
        tags: tags.join(' '),
      }

      items.push({
        data,
        render: getRenderer(data),
      })
    },
  ).then(() => items)
}
