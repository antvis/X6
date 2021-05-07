import sinon from 'sinon'
import { G } from '../g/g'
import { namespaces } from '../../util/dom'

describe('Base', () => {
  describe('html()', () => {
    it('should call xml with the svg namespace', () => {
      const group = new G()
      const spy = sinon.spy(group, 'xml')
      group.svg('<foo>')
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual(['<foo>', undefined, namespaces.svg])
    })
  })
})
