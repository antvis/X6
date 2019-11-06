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
  'mousedown' | 'mousemove' | 'mouseup' |
  'touchstart' | 'touchmove' | 'touchend'

export function addListeners(names: EventName[]) {
  names.forEach(name => DomEvent.addListener(doc, name, handle))
}

export function removeListeners(names: EventName[]) {
  names.forEach(name => DomEvent.removeListener(doc, name, handle))
}

export function handle(e: MouseEvent) {
  updatePosition(e)
  const state = data!
  const eventName = e.type as EventName

  if (state != null) {
    state.e = e
  }

  if (
    eventName === 'mousedown' ||
    eventName === 'touchstart'
  ) {
    isTouch = eventName === 'touchstart'
    addListeners(['mouseup', 'touchend'])
    onMouseDown(e)
  } else if (
    eventName === 'mousemove' ||
    eventName === 'touchmove'
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
    eventName === 'mouseup' ||
    eventName === 'touchend'
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
  timer = window.setTimeout(
    () => {
      timer = 0
      prepare(e)
    },
    delay,
  )
}

function prepare(e: MouseEvent | TouchEvent) {
  let trigger: HTMLElement | null = null
  let instance: Dnd | null = null
  const parents = getParents(e.target as HTMLElement)
  for (let i = 0, ii = parents.length; i < ii; i += 1) {
    trigger = parents[i]
    instance = Dnd.getInstance(trigger)
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
  data.instance = instance
  data.isPreparing = true
  data.isDragging = false
  data.trigger = trigger!
  data.target = getDndElement(
    instance,
    data.trigger,
    options.target,
    data.trigger,
  )

  data.proxy = getDndElement(
    instance,
    data.trigger,
    options.proxy,
    () => (data!.target.cloneNode(true) as HTMLElement),
  )

  data.region = getDndElement(instance, data.trigger, options.region, doc.body)
  data.containers = typeof options.containers === 'function'
    ? options.containers.call(instance, data.trigger)
    : options.containers

  updatePosition(e)

  // 将代理元素插入文档，设置样式等
  data.instance.trigger(Dnd.events.prepare, data)

  const proxyOffset = getOffset(data.trigger)
  const triggerWidth = outerWidth(data.trigger)
  const triggerHeight = outerHeight(data.trigger)
  const rateX = (data.pageX - proxyOffset.left) / triggerWidth
  const rateY = (data.pageY - proxyOffset.top) / triggerHeight

  proxyWidth = outerWidth(data.proxy)
  proxyHeight = outerHeight(data.proxy)

  data.diffX = rateX * proxyWidth
  data.diffY = rateY * proxyHeight

  data.proxy.style.left = `${data.pageX - data.diffX}px`
  data.proxy.style.top = `${data.pageY - data.diffY}px`

  addListeners(['mousemove', 'mouseup', 'touchmove', 'touchend'])
}

let fixTop: number
let fixLeft: number
let regionOffset: { left: number, top: number } | null
let regionHeight: number
let regionWidth: number
let proxyWidth: number
let proxyHeight: number

function onDragStart() {
  const state = data!

  state.isPreparing = false
  state.isDragging = true

  const proxyOffset = getOffset(state.proxy)
  const parentOffset = getOffset(state.proxy.parentNode as HTMLElement)
  const style = state.proxy.style

  // 修正值
  fixLeft = proxyOffset.left - parentOffset.left - parseFloat(style.left || '0')
  fixTop = proxyOffset.top - parentOffset.top - parseFloat(style.top || '0')

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
      left + proxyWidth <= offset.left + regionWidth
    ) {
      return left - fixLeft
    }

    if (left < offset.left) {
      return offset.left - fixLeft
    }

    return offset.left + regionWidth - proxyWidth - fixLeft
  }

  const getTop = () => {
    const offset = regionOffset!
    if (
      top >= offset.top &&
      top + proxyHeight <= offset.top + regionHeight
    ) {
      return top - fixTop
    }

    if (top <= offset.top) {
      return offset.top - fixTop
    }

    return offset.top + regionHeight - proxyHeight - fixTop
  }

  const style = state.proxy.style
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
    if (!isContained(state.activeContainer, state.proxy, fully)) {
      state.instance.trigger(Dnd.events.dragLeave, state)
      state.activeContainer = null
    } else {
      state.instance.trigger(Dnd.events.dragOver, state)
    }
  } else {
    for (let i = 0, ii = containers.length; i < ii; i += 1) {
      const container = containers[i]
      if (isContained(container, state.proxy, fully)) {
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
  proxyWidth = 0
  proxyHeight = 0
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
