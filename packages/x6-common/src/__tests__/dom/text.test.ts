import { Vector } from '../../vector'
import { Dom } from '../../dom'

describe('Dom', () => {
  describe('#text', () => {
    function serializeNode(node: ChildNode) {
      return new XMLSerializer().serializeToString(node)
    }

    // const { wrap } = setupTest()
    // const getSvg = () => {
    //   const svg = v('svg')
    //   svg.attr('width', 600)
    //   svg.attr('height', 800)
    //   wrap.appendChild(svg.node)
    //   return svg
    // }

    // afterEach(clearnTest)

    it('should create single line text', () => {
      const t = Vector.create('text', { x: 250, dy: 100, fill: 'black' })
      t.text('abc')

      expect(t.node.childNodes.length).toEqual(1)
      expect(t.node.childNodes[0].childNodes.length).toEqual(1)
      expect(serializeNode(t.node.childNodes[0].childNodes[0])).toEqual('abc')
    })

    it('should create multi-line text', () => {
      const t = Vector.create('text', { x: 250, dy: 100, fill: 'black' })
      t.text('abc\ndef')
      expect(t.node.childNodes.length).toEqual(2)

      t.text('abcdefgh', {
        annotations: [
          { start: 1, end: 3, attrs: { fill: 'red', stroke: 'orange' } },
          { start: 2, end: 5, attrs: { fill: 'blue' } },
        ],
      })

      expect(t.find('.v-line').length).toEqual(1)
      expect(t.find('tspan').length).toEqual(4)

      t.text('abcd\nefgh', {
        annotations: [
          { start: 1, end: 3, attrs: { fill: 'red', stroke: 'orange' } },
          {
            start: 2,
            end: 5,
            attrs: { fill: 'blue', class: 'blue-annotation' },
          },
        ],
      })

      expect(t.find('.v-line').length).toEqual(2)
      expect(t.find('tspan').length).toEqual(5)
    })

    it('should append custom EOL', () => {
      const t = Vector.create('text', { x: 250, dy: 100, fill: 'black' })
      t.text('abc\ndef', { eol: 'X' })
      expect(t.node.childNodes[0].textContent).toEqual('abcX')
      expect(t.node.childNodes[1].textContent).toEqual('def')

      t.text('abc\ndef\n', { eol: 'X' })
      expect(t.node.childNodes[0].textContent).toEqual('abcX')
      expect(t.node.childNodes[1].textContent).toEqual('defX')
    })

    it('should add annotations to tspan', () => {
      const t = Vector.create('text', { x: 250, dy: 100, fill: 'black' })

      t.text('abcdefgh', {
        includeAnnotationIndices: true,
        annotations: [
          { start: 1, end: 3, attrs: { fill: 'red', stroke: 'orange' } },
          { start: 2, end: 5, attrs: { fill: 'blue' } },
        ],
      })

      const tspans = t.find('tspan')
      expect(tspans[1].attr('annotations')).toEqual('0')
      expect(tspans[2].attr('annotations')).toEqual('0,1')
      expect(tspans[3].attr('annotations')).toEqual('1')
    })

    it('visibility', () => {
      const t = Vector.create('text', { x: 250, dy: 100, fill: 'black' })

      t.text('')
      expect(t.attr('display')).toEqual('none')
      t.text('text')
      expect(t.attr('display')).toBeNull()
    })

    it('should break the words by size', () => {
      expect(
        Dom.breakText('aaaaabbbbbccccceeeeefffffggggghhhhh', {
          width: 200,
          height: 400,
        }).split('\n').length,
      ).toBe(2)
      expect(
        Dom.breakText('aaaaabbbbbccccceeeeefffffggggghhhhh', {
          width: 200,
          height: 20,
        }).split('\n').length,
      ).toBe(1)
    })
  })
})
