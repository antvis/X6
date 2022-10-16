import { Vector } from '../../vector'
import { Dom } from '../../dom'

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
        a: normalizeFloat(0.7071067811865476),
        b: normalizeFloat(-0.7071067811865475),
        c: normalizeFloat(0.7071067811865475),
        d: normalizeFloat(0.7071067811865476),
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
    const isSimilar = (matrix1: DOMMatrix, matrix2: DOMMatrix) => {
      const result = [
        Math.abs(matrix1.a - matrix2.a),
        Math.abs(matrix1.b - matrix2.b),
        Math.abs(matrix1.c - matrix2.c),
        Math.abs(matrix1.d - matrix2.d),
        Math.abs(matrix1.e - matrix2.e),
        Math.abs(matrix1.f - matrix2.f),
      ]

      return result.every((item) => item < 0.000001)
    }

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
      const result = Dom.getTransformToElement(rect.node, node.node)

      expect(isSimilar(matrix, result)).toEqual(true)

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
      const result = Dom.getTransformToElement(rect.node, group.node)

      expect(isSimilar(matrix, result)).toEqual(true)

      rect.remove()
      node.remove()
      group.remove()
    })
  })
})
