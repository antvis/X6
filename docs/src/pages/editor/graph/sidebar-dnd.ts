import { Dnd } from '../../../../../src/addon/dnd'
import { getDataItem } from './sidebar-util'

export function initDnd(palette: HTMLDivElement) {
  palette.childNodes.forEach((elem) => {
    const instance = new Dnd({
      fully: true,
      trigger: elem as HTMLDivElement,
      containers: () => {
        return [
          document.querySelector('.x6-editor-graph') as HTMLElement,
        ]
      },
      proxy: () => {
        return document.createElement('div') as HTMLDivElement
      },
    })

    instance.on(Dnd.events.prepare, onPrepare)
    // instance.on(Dnd.events.dragEnd, onDragEnd)
    // instance.on(Dnd.events.drop, onDrop)
  })
}

function onPrepare(state: Dnd.State) {
  const data = getDataItem(state.trigger)
  const proxy = state.proxy

  proxy.className = 'x6-cell-thumb-proxy'
  if (data) {
    proxy.style.width = `${data.width}px`
    proxy.style.height = `${data.height}px`
  }

  document.body.appendChild(proxy)
}

function onDragEnd(state: Dnd.State) {
  const parent = state.proxy.parentNode
  if (parent != null) {
    parent.removeChild(state.proxy)
  }
}

function onDrop(state: Dnd.State) {
  onDragEnd(state)
}
