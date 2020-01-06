import { Dnd, Point } from '@antv/x6'
import { getEditor } from '../index'
import { getDataItem } from './sidebar-util'
import { DataItem } from './sidebar-data'

export function initDnd(palette: HTMLDivElement) {
  palette.childNodes.forEach((elem: HTMLElement) => {
    const data = getDataItem(elem)
    const instance = new Dnd<DataItem>(elem, {
      data,
      getGraph: () => getEditor().graph,
      getTargetCell: () => null,
      createDragElement: ({ data }) => {
        const elem = document.createElement('div') as HTMLDivElement
        if (data != null) {
          elem.style.width = `${data.width}px`
          elem.style.height = `${data.height}px`
        }
        elem.style.border = '1px dashed #000'
        elem.style.cursor = 'move'
        return elem
      },
      createPreviewElement: ({ graph, data }) => {
        const elem = document.createElement('div') as HTMLDivElement
        if (data != null) {
          const s = graph.view.scale
          elem.style.width = `${data.width * s}px`
          elem.style.height = `${data.height * s}px`
        }

        elem.style.border = '1px dashed #000'
        elem.style.cursor = 'move'
        return elem
      },
    })

    instance.on('drop', ({ data, graph, targetPosition }) => {
      if (data != null) {
        const x = targetPosition.x
        const y = targetPosition.y
        const width = data.width
        const height = data.height

        const cell = data.isEdge
          ? graph.addEdge({
              style: { ...data.style, stroke: '#000' },
              points: data.points
                ? data.points.map(p => new Point(x + p.x, y + p.y))
                : [],
              sourcePoint: new Point(x, height + y),
              targetPoint: new Point(x + width, y),
            })
          : graph.addNode({
              x,
              y,
              width,
              height,
              style: data.style,
            })
        graph.selectCell(cell)
      }
    })
  })
}
