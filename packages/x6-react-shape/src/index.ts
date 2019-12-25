export * from './shape'

import { Shape } from '@antv/x6'
import { ReactShape } from './shape'
import './extend'

export function register(name: string = 'react', force: boolean = false) {
  Shape.register(name, ReactShape, force)
}
