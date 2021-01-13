import { debounce } from './util'
import { Listener, Sensor } from '../types'

export function createSensor(element: Element): Sensor {
  let sensor: ResizeObserver | null = null
  let listeners: Listener[] = []

  const trigger = debounce(() => {
    listeners.forEach((listener) => {
      listener(element)
    })
  })

  const create = () => {
    const s = new ResizeObserver(trigger)
    s.observe(element)
    trigger()
    return s
  }

  const bind = (listener: Listener) => {
    if (!sensor) {
      sensor = create()
    }

    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener)
    }
  }

  const destroy = () => {
    if (sensor) {
      sensor.disconnect()
      listeners = []
      sensor = null
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
