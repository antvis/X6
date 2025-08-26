import { expect } from 'vitest'
import { toMatchDOMSnapshot } from './toMatchDOMSnapshot'

expect.extend({
  toMatchDOMSnapshot,
})
