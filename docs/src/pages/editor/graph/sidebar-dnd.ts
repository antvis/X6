import { util } from '../../../../../src'
import { Dnd } from '../../../../../src/addon/dnd'
import { getEditor } from '../index'
import { getDataItem } from './sidebar-util'

export function initDnd(palette: HTMLDivElement) {
  palette.childNodes.forEach((elem) => {
    const instance = new Dnd({
      fully: true,
      element: elem as HTMLElement,
      preview: () => document.createElement('div'),
      containers: () => [getEditor().graph.container],
    })

    instance.on(Dnd.events.prepare, onPrepare)
    instance.on(Dnd.events.dragEnd, onDragEnd)
    instance.on(Dnd.events.drop, onDrop)
  })
}

function onPrepare(state: Dnd.State) {
  const data = getDataItem(state.element)
  const proxy = state.preview

  proxy.className = 'x6-cell-thumb-proxy'
  if (data) {
    state.data = data
    proxy.style.width = `${data.width}px`
    proxy.style.height = `${data.height}px`
  }

  document.body.appendChild(proxy)
}

function onDragEnd(state: Dnd.State) {
  const parent = state.preview.parentNode
  if (parent != null) {
    parent.removeChild(state.preview)
  }
}

function onDrop(state: Dnd.State) {
  onDragEnd(state)

  const graph = getEditor().graph
  if (
    state.activeContainer === graph.container &&
    state.data != null
  ) {
    const offset = util.getOffset(state.activeContainer)
    const x = state.pageX - offset.x - state.diffX
    const y = state.pageY - offset.y - state.diffY

    // console.log(offset, origin)

    graph.addNode({
      x,
      y,
      width: state.data.width,
      height: state.data.height,
      style: state.data.style,
    })

  }
  // console.log(state)
}

