import { afterAll, describe, expect, it } from 'vitest'
import { Dom } from '../../../src/common/dom'
import { Vector } from '../../../src/common/vector'

describe('Dom', () => {
  const fixture = document.createElement('div')
  const svgContainer = Vector.create('svg').node
  fixture.appendChild(svgContainer)
  document.body.appendChild(fixture)

  afterAll(() => {
    fixture.parentNode?.removeChild(fixture)
  })

  describe('#getTransformToElement', () => {
    it('rotate', () => {
      const normalizeFloat = (value: number) => {
        const temp = value * 100
        return temp > 0 ? Math.floor(temp) : Math.ceil(temp)
      }

      const container = Vector.create(svgContainer)
      const group = Vector.create('g')
      const rect = Vector.create('rect')

      container.append(group)
      container.append(rect)

      rect.rotate(45)

      const matrix = Dom.getTransformToElement(group.node, rect.node)
      expect({
        a: normalizeFloat(matrix.a),
        b: normalizeFloat(matrix.b),
        c: normalizeFloat(matrix.c),
        d: normalizeFloat(matrix.d),
        e: normalizeFloat(matrix.e),
        f: normalizeFloat(matrix.f),
      }).toEqual({
        a: normalizeFloat(Math.SQRT1_2),
        b: normalizeFloat(-0.7071067811865475),
        c: normalizeFloat(0.7071067811865475),
        d: normalizeFloat(Math.SQRT1_2),
        e: normalizeFloat(0),
        f: normalizeFloat(0),
      })

      group.remove()
      rect.remove()
    })

    it('translate', () => {
      const container = Vector.create(svgContainer)
      const group = Vector.create('g')
      const rect = Vector.create('rect')

      container.append(group)
      container.append(rect)

      rect.translate(10, 10)

      const matrix = Dom.getTransformToElement(group.node, rect.node)
      expect({
        a: matrix.a,
        b: matrix.b,
        c: matrix.c,
        d: matrix.d,
        e: matrix.e,
        f: matrix.f,
      }).toEqual({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: -10,
        f: -10,
      })

      group.remove()
      rect.remove()
    })
  })

  describe('#getTransformToParentElement', () => {
    it('translate', () => {
      const container = Vector.create(svgContainer)
      const group = Vector.create('g')
      const node = Vector.create('g')
      const rect = Vector.create('rect')

      container.append(group)
      group.append(node)
      node.append(rect)

      group.translate(50, 50)
      node.translate(10, 10)
      rect.translate(20, 20)

      const matrix = Dom.getTransformToParentElement(rect.node, node.node)
      expect(matrix.a).toBe(1)
      expect(matrix.b).toBe(0)
      expect(matrix.c).toBe(0)
      expect(matrix.d).toBe(1)
      expect(matrix.e).toBe(20)
      expect(matrix.f).toBe(20)

      rect.remove()
      node.remove()
      group.remove()
    })

    it('rotate', () => {
      const container = Vector.create(svgContainer)
      const group = Vector.create('g')
      const node = Vector.create('g')
      const rect = Vector.create('rect')

      container.append(group)
      group.append(node)
      node.append(rect)

      group.rotate(50)
      node.rotate(10)
      rect.rotate(20)

      const matrix = Dom.getTransformToParentElement(rect.node, group.node)
      const angle = 30 * (Math.PI / 180)
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)

      expect(matrix.a).toBeCloseTo(cos, 6)
      expect(matrix.b).toBeCloseTo(sin, 6)
      expect(matrix.c).toBeCloseTo(-sin, 6)
      expect(matrix.d).toBeCloseTo(cos, 6)
      expect(matrix.e).toBe(0)
      expect(matrix.f).toBe(0)

      rect.remove()
      node.remove()
      group.remove()
    })
  })
})
