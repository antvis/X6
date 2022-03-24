import { createSensor as createObjectSensor } from './object'
import { createSensor as createResizeObserverSensor } from './observer'

export const createSensor =
  typeof ResizeObserver !== 'undefined'
    ? createResizeObserverSensor
    : createObjectSensor
