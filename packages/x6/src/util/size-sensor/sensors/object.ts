import { debounce } from './util'
import { Listener, Sensor } from '../types'

export function createSensor(element: Element): Sensor {
  let sensor: HTMLObjectElement | null = null
  let listeners: Listener[] = []

  const create = () => {
    if (getComputedStyle(element).position === 'static') {
      const style = (element as HTMLElement).style
      style.position = 'relative'
    }

    const obj = document.createElement('object')
    obj.onload = () => {
      obj.contentDocument!.defaultView!.addEventListener('resize', trigger)
      trigger()
    }
    obj.style.display = 'block'
    obj.style.position = 'absolute'
    obj.style.top = '0'
    obj.style.left = '0'
    obj.style.height = '100%'
    obj.style.width = '100%'
    obj.style.overflow = 'hidden'
    obj.style.pointerEvents = 'none'
    obj.style.zIndex = '-1'
    obj.style.opacity = '0'
    obj.setAttribute('tabindex', '-1')
    obj.type = 'text/html'

    element.appendChild(obj)
    // for ie, should set data attribute delay, or will be white screen
    obj.data = 'about:blank'
    return obj
  }

  const trigger = debounce(() => {
    listeners.forEach((listener) => listener(element))
  })

  const bind = (listener: Listener) => {
    if (!sensor) {
      sensor = create()
    }

    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener)
    }
  }

  const destroy = () => {
    if (sensor && sensor.parentNode) {
      if (sensor.contentDocument) {
        sensor.contentDocument!.defaultView!.removeEventListener(
          'resize',
          trigger,
        )
      }
      sensor.parentNode.removeChild(sensor)
      sensor = null
      listeners = []
    }
  }

  const unbind = (listener: Listener) => {
    const idx = listeners.indexOf(listener)
    if (idx !== -1) {
      listeners.splice(idx, 1)
    }

    // no listener, and sensor is exist then destroy the sensor
    if (listeners.length === 0 && sensor) {
      destroy()
    }
  }

  return {
    element,
    bind,
    destroy,
    unbind,
  }
}
