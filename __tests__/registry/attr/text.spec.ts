import { describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { text, textWrap } from '../../../src/registry/attr/text'

describe('Text attribute', () => {
  it('should qualify correctly', () => {
    expect(text.qualify('test', { attrs: {} })).toBe(true)
    expect(text.qualify('test', { attrs: { textWrap: null } })).toBe(true)
    expect(text.qualify('test', { attrs: { textWrap: {} } })).toBe(false)
  })

  it('should set text with options', () => {
    const mockElem = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text',
    )
    const mockView = {
      find: vi.fn().mockReturnValue([]),
    }
    const mockSetAttribute = vi.spyOn(mockElem, 'setAttribute')
    const mockText = vi.spyOn(Dom, 'text')

    text.set('test', {
      view: mockView,
      elem: mockElem,
      attrs: {
        x: 10,
        eol: '\n',
        fontSize: '16px',
        'text-vertical-anchor': 'middle',
      },
    })

    expect(mockSetAttribute).toHaveBeenCalledWith('font-size', '16px')
    expect(mockText).toHaveBeenCalledWith(mockElem, 'test', {
      x: 10,
      eol: '\n',
      textVerticalAnchor: 'middle',
      annotations: undefined,
      textPath: undefined,
      displayEmpty: false,
      lineHeight: undefined,
    })
  })
})

describe('textWrap attribute', () => {
  it('should qualify correctly', () => {
    expect(textWrap.qualify({}, { attrs: {} })).toBe(true)
    expect(textWrap.qualify(null, { attrs: {} })).toBe(false)
  })

  it('should wrap text with width/height options', () => {
    const mockElem = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text',
    )
    const mockView = {
      cell: {},
      graph: {
        view: {
          svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        },
      },
    }
    const mockBreakText = vi
      .spyOn(Dom, 'breakText')
      .mockReturnValue('wrapped text')
    const mockTextSet = vi.spyOn(text, 'set')

    textWrap.set(
      { width: '100%', height: 50, text: 'test' },
      {
        view: mockView,
        elem: mockElem,
        attrs: { 'font-size': '16px' },
        refBBox: { x: 0, y: 0, width: 200, height: 100 },
      },
    )

    expect(mockBreakText).toHaveBeenCalledWith(
      'test',
      { x: 0, y: 0, width: 200, height: 50 },
      expect.any(Object),
      expect.any(Object),
    )
    expect(mockTextSet).toHaveBeenCalledWith('wrapped text', expect.any(Object))
  })
})
