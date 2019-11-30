import { DomEvent } from '../../common'
import { clearSelection } from '../../util'
import { Dnd } from '.'
import {
  getParents,
  getDndElement,
  getOffset,
  outerWidth,
  outerHeight,
  isContained,
} from './util'

const win = window
const doc = win.document

let data: Dnd.State | null = null
let timer: number
let isTouch: boolean

type EventName =
  | 'mousedown'
  | 'mousemove'
  | 'mouseup'
  | 'touchstart'
  | 'touchmove'
  | 'touchend'

export function addListeners(names: EventName[]) {
  names.forEach((name) => DomEvent.addListener(doc, name, handle))
}

export function removeListeners(names: EventName[]) {
  names.forEach((name) => DomEvent.removeListener(doc, name, handle))
}

export function handle(e: MouseEvent) {
  updatePosition(e)
  const state = data!
  const eventName = e.type as EventName

  if (state != null) {
    state.e = e
  }

  if (eventName === 'mousedown' || eventName === 'touchstart') {
    isTouch = eventName === 'touchstart'
    addListeners(['mouseup', 'touchend'])
    onMouseDown(e)
  } else if (
    (eventName === 'mousemove' || eventName === 'touchmove') &&
    state != null
  ) {
    if (state.isPreparing) {
      onDragStart()
    }

    if (state.isDragging) {
      onDragging()
      onDragEnterLeaveOver()
    }

    clearSelection()
    e.preventDefault()
  } else if (
    (eventName === 'mouseup' || eventName === 'touchend') &&
    state != null
  ) {
    removeListeners(['mouseup', 'touchend'])
    if (timer) {
      clearTimeout(timer)
      timer = 0
      return
    }

    if (state.isDragging) {
      state.isDragging = false
      onDrop()
    } else if (state.isPreparing) {
      state.isPreparing = false
      state.instance.trigger(Dnd.events.dragEnd, state)
      clear()
    }
  }
}

function onMouseDown(e: MouseEvent | TouchEvent) {
  const delay = isTouch ? 200 : Dnd.delay || 300
  timer = window.setTimeout(() => {
    timer = 0
    prepare(e)
  },                        delay)
}

function prepare(e: MouseEvent | TouchEvent) {
  let element: HTMLElement | null = null
  let instance: Dnd | null = null
  const parents = getParents(e.target as HTMLElement)
  for (let i = 0, ii = parents.length; i < ii; i += 1) {
    element = parents[i]
    instance = Dnd.getInstance(element)
    if (instance != null) {
      break
    }
  }

  // null or disabled
  if (instance == null || instance.disabled) {
    return
  }

  const options = instance.options

  data = {} as Dnd.State
  data.e = e
  data.element = element!
  data.instance = instance
  data.isPreparing = true
  data.isDragging = false

  data.preview = getDndElement(
    instance,
    data.element,
    options.preview,
    () => data!.element.cloneNode(true) as HTMLElement,
  )

  data.region = getDndElement(instance, data.element, options.region, doc.body)
  data.containers =
    typeof options.containers === 'function'
      ? options.containers.call(instance, data.element)
      : options.containers

  updatePosition(e)

  // 将代理元素插入文档，设置样式等
  data.instance.trigger(Dnd.events.prepare, data)

  const offset = getOffset(data.element)
  const width = outerWidth(data.element)
  const height = outerHeight(data.element)
  const rateX = (data.pageX - offset.left) / width
  const rateY = (data.pageY - offset.top) / height

  previewWidth = outerWidth(data.preview)
  previewHeight = outerHeight(data.preview)

  data.diffX = rateX * previewWidth
  data.diffY = rateY * previewHeight

  data.preview.style.left = `${data.pageX - data.diffX}px`
  data.preview.style.top = `${data.pageY - data.diffY}px`

  addListeners(['mousemove', 'mouseup', 'touchmove', 'touchend'])
}

let fixTop: number
let fixLeft: number
let regionOffset: { left: number; top: number } | null
let regionHeight: number
let regionWidth: number
let previewWidth: number
let previewHeight: number

function onDragStart() {
  const state = data!

  state.isPreparing = false
  state.isDragging = true

  const previewOffset = getOffset(state.preview)
  const parentOffset = getOffset(state.preview.parentNode as HTMLElement)
  const style = state.preview.style

  // 修正值
  fixLeft =
    previewOffset.left - parentOffset.left - parseFloat(style.left || '0')
  fixTop = previewOffset.top - parentOffset.top - parseFloat(style.top || '0')

  // 区域
  regionOffset = getOffset(state.region)
  regionWidth = outerWidth(state.region)
  regionHeight = outerHeight(state.region)

  state.instance.trigger(Dnd.events.dragStart, state)
}

function onDragging() {
  const state = data!
  const axis = state.instance.options.axis
  const top = state.pageY - state.diffY
  const left = state.pageX - state.diffX

  // 限制在指定的区域内
  const getLeft = () => {
    const offset = regionOffset!
    if (
      left >= offset.left &&
      left + previewWidth <= offset.left + regionWidth
    ) {
      return left - fixLeft
    }

    if (left < offset.left) {
      return offset.left - fixLeft
    }

    return offset.left + regionWidth - previewWidth - fixLeft
  }

  const getTop = () => {
    const offset = regionOffset!
    if (top >= offset.top && top + previewHeight <= offset.top + regionHeight) {
      return top - fixTop
    }

    if (top <= offset.top) {
      return offset.top - fixTop
    }

    return offset.top + regionHeight - previewHeight - fixTop
  }

  const style = state.preview.style
  if (axis !== 'y') {
    style.left = `${getLeft()}px`
  }
  if (axis !== 'x') {
    style.top = `${getTop()}px`
  }

  state.instance.trigger(Dnd.events.dragging, state)
}

function onDragEnterLeaveOver() {
  const state = data!
  const containers = state.containers
  const fully = state.instance.options.fully

  if (!containers || !containers.length) {
    return
  }

  if (state.activeContainer) {
    if (!isContained(state.activeContainer, state.preview, fully)) {
      state.instance.trigger(Dnd.events.dragLeave, state)
      state.activeContainer = null
    } else {
      state.instance.trigger(Dnd.events.dragOver, state)
    }
  } else {
    for (let i = 0, ii = containers.length; i < ii; i += 1) {
      const container = containers[i]
      if (isContained(container, state.preview, fully)) {
        state.activeContainer = container
        state.instance.trigger(Dnd.events.dragEnter, state)
        break
      }
    }
  }
}

function onDrop() {
  data!.instance.trigger(Dnd.events.drop, data)
  clear()
}

function clear() {
  removeListeners(['mousemove', 'mouseup', 'touchmove', 'touchend'])

  data = null
  isTouch = false

  fixLeft = 0
  fixTop = 0
  regionOffset = null
  regionHeight = 0
  regionWidth = 0
  previewWidth = 0
  previewHeight = 0
}

function updatePosition(e: MouseEvent | TouchEvent) {
  if (data == null) {
    return
  }

  if (isTouch) {
    const evt = e as TouchEvent
    const changedTouches = evt.changedTouches
    if (changedTouches && changedTouches.length) {
      data.pageX = changedTouches[0].pageX
      data.pageY = changedTouches[0].pageY
    }
  } else {
    const evt = e as MouseEvent
    data.pageX = evt.pageX
    data.pageY = evt.pageY
  }
}
