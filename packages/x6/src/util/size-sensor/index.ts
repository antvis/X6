import { createSensor } from './sensors'
import { Sensor, Listener } from './types'

export namespace SizeSensor {
  const cache: WeakMap<Element, Sensor> = new WeakMap()

  function get(element: Element) {
    let sensor = cache.get(element)
    if (sensor) {
      return sensor
    }

    sensor = createSensor(element)
    cache.set(element, sensor)
    return sensor
  }

  function remove(sensor: Sensor) {
    sensor.destroy()
    cache.delete(sensor.element)
  }

  export const bind = (element: Element, cb: Listener) => {
    const sensor = get(element)
    sensor.bind(cb)
    return () => sensor.unbind(cb)
  }

  export const clear = (element: Element) => {
    const sensor = get(element)
    remove(sensor)
  }
}
