import { Primer } from '../../common'
import { addListeners, removeListeners } from './handler'

export class Dnd extends Primer {
  public readonly options: Dnd.Options
  public disabled: boolean

  constructor(options: Dnd.Options) {
    super()
    this.options = options
    this.disabled = options.disabled != null ? options.disabled : false
    if (options.trigger == null || options.trigger.nodeType !== 1) {
      throw new Error('The trigger element for dnd is illegal.')
    }
    Dnd.stamp(options.trigger, this)
  }

  enable() {
    this.disabled = false
  }

  disable() {
    this.disabled = true
  }
}

export namespace Dnd {
  export const version = '0.1.0'
  export const delay = 300
  export const events = {
    prepare: 'prepare',
    dragStart: 'dragStart',
    dragging: 'dragging',
    dragEnter: 'dragEnter',
    dragOver: 'dragOver',
    dragLeave: 'dragLeave',
    dragEnd: 'dragEnd',
    drop: 'drop',
  }

  export type HTMLElementOrFunc = HTMLElement |
    ((this: Dnd, trigger: HTMLElement) => HTMLElement)

  export interface Options {
    /**
     * 触发拖动的元素
     */
    trigger: HTMLElement
    /**
     * 接受拖动结果的容器
     */
    containers: HTMLElement[] | ((this: Dnd, trigger: HTMLElement) => HTMLElement[])
    /**
     * 拖动时的代理元素
     */
    proxy?: HTMLElementOrFunc
    /**
     * 目标元素，拖动结束时实际移动的元素
     */
    target?: HTMLElementOrFunc
    /**
     * 区域限制的元素
     */
    region?: HTMLElementOrFunc
    fully?: boolean
    axis?: 'x' | 'y'
    disabled?: boolean
  }

  export interface State {
    e: MouseEvent | TouchEvent
    instance: Dnd,
    trigger: HTMLElement
    target: HTMLElement
    proxy: HTMLElement
    region: HTMLElement
    containers: HTMLElement[]
    activeContainer?: HTMLElement | null
    isPreparing: boolean
    isDragging: boolean
    pageX: number
    pageY: number
    diffX: number
    diffY: number
    data?: any
  }

  const cache: WeakMap<HTMLElement, Dnd> = new WeakMap()

  export function stamp(trigger: HTMLElement, dnd: Dnd) {
    cache.set(trigger, dnd)
  }

  export function getInstance(trigger: HTMLElement) {
    return cache.get(trigger) || null
  }

  export function enable() {
    addListeners(['mousedown', 'touchstart'])
  }

  export function disable() {
    removeListeners(['mousedown', 'touchstart'])
  }
}

Dnd.enable()
