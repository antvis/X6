import { Dnd } from '@antv/x6'
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
        const cell = graph.addNode({
          x: targetPosition.x,
          y: targetPosition.y,
          width: data.width,
          height: data.height,
          style: data.style,
        })
        graph.selectCell(cell)
      }
    })
  })
}
