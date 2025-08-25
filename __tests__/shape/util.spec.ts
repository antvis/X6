import * as sinon from 'sinon'
import { describe, expect, it, vi } from 'vitest'
import { ObjectExt } from '../../src/common'
import { Base } from '../../src/shape/base'
import { createShape, getImageUrlHook, getMarkup } from '../../src/shape/util'

describe('shape/util', () => {
  it('getMarkup should return markup with default selector', () => {
    const result = getMarkup('rect')
    expect(result).toEqual([
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ])
  })
  it('getMarkup should return markup with custom selector', () => {
    const result = getMarkup('circle', 'custom')
    expect(result).toEqual([
      {
        tagName: 'circle',
        selector: 'custom',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ])
  })

  it('getImageUrlHook should return hook function with default attrName', () => {
    const hook = getImageUrlHook()
    expect(typeof hook).toBe('function')
  })

  it('getImageUrlHooks hould return hook function with custom attrName', () => {
    const hook = getImageUrlHook('href')
    expect(typeof hook).toBe('function')
  })

  it('getImageUrlHook should handle metadata with imageUrl, imageWidth, and imageHeight when attrs.image exists', () => {
    const hook = getImageUrlHook()
    const metadata = {
      imageUrl: 'test.jpg',
      imageWidth: 100,
      imageHeight: 200,
      attrs: {
        image: { x: 10 },
      },
    }

    // @ts-expect-error
    const result = hook(metadata)
    expect(result.attrs.image).toEqual({
      x: 10,
      'xlink:href': 'test.jpg',
      width: 100,
      height: 200,
    })
  })

  it('getImageUrlHooks should handle metadata with imageUrl when attrs.image is null', () => {
    const hook = getImageUrlHook()
    const metadata = {
      imageUrl: 'test.jpg',
      attrs: {
        image: null,
      },
    }

    // @ts-expect-error
    const result = hook(metadata)
    expect(result.attrs.image).toEqual({
      'xlink:href': 'test.jpg',
    })
  })

  it('getImageUrlHooks should handle metadata when attrs is undefined', () => {
    const hook = getImageUrlHook()
    const metadata = {
      imageUrl: 'test.jpg',
      imageWidth: 100,
    }

    // @ts-expect-error
    const result = hook(metadata)
    expect(result.attrs.image).toEqual({
      'xlink:href': 'test.jpg',
      width: 100,
    })
  })

  it('getImageUrlHooks should handle metadata with only imageUrl', () => {
    const hook = getImageUrlHook('href')
    const metadata = {
      imageUrl: 'test.jpg',
      attrs: { image: {} },
    }

    // @ts-expect-error
    const result = hook(metadata)
    expect(result.attrs.image).toEqual({
      href: 'test.jpg',
    })
  })

  it('getImageUrlHooks should handle metadata with only imageWidth', () => {
    const hook = getImageUrlHook()
    const metadata = {
      imageWidth: 100,
      attrs: { image: {} },
    }

    // @ts-expect-error
    const result = hook(metadata)
    expect(result.attrs.image).toEqual({
      width: 100,
    })
  })

  it('getImageUrlHooks should handle metadata with only imageHeight', () => {
    const hook = getImageUrlHook()
    const metadata = {
      imageHeight: 200,
      attrs: { image: {} },
    }

    // @ts-expect-error
    const result = hook(metadata)
    expect(result.attrs.image).toEqual({
      height: 200,
    })
  })

  it('getImageUrlHooks should return unchanged metadata when no image properties are provided', () => {
    const hook = getImageUrlHook()
    const metadata = {
      otherProp: 'value',
      attrs: { someAttr: 'value' },
    }

    // @ts-expect-error
    const result = hook(metadata)
    expect(result).toEqual(metadata)
  })

  it('getImageUrlHooks should exclude image properties from returned metadata', () => {
    const hook = getImageUrlHook()
    const metadata = {
      imageUrl: 'test.jpg',
      imageWidth: 100,
      imageHeight: 200,
      otherProp: 'value',
    }

    // @ts-expect-error
    const result = hook(metadata)
    expect(result.imageUrl).toBeUndefined()
    expect(result.imageWidth).toBeUndefined()
    expect(result.imageHeight).toBeUndefined()
    expect(result.otherProp).toBe('value')
  })

  it('createShape should create shape with default options', () => {
    const result = createShape('rect', { width: 100 })

    expect(result.getMarkup()).toEqual([
      {
        selector: 'body',
        tagName: 'rect',
      },
      {
        selector: 'label',
        tagName: 'text',
      },
    ])

    expect(result.getDefaults()).toEqual({
      angle: 0,
      attrs: {
        rect: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 2,
        },
        text: {
          fill: '#000000',
          fontFamily: 'Arial, helvetica, sans-serif',
          fontSize: 14,
          refX: 0.5,
          refY: 0.5,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
        },
      },
      position: {
        x: 0,
        y: 0,
      },
      shape: 'rect',
      size: {
        height: 1,
        width: 1,
      },
      visible: true,
      width: 100,
    })
  })
})
