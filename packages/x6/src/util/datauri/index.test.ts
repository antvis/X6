import { DataUri } from './index'

describe('DataUri', () => {
  describe('#isDataUrl', () => {
    it('should return true with dataurl', () => {
      expect(DataUri.isDataUrl('data:image')).toBeTruthy()
    })

    it('should return false with invalid dataurl', () => {
      expect(DataUri.isDataUrl('abc')).toBeFalsy()
    })
  })

  describe('#imageToDataUri', () => {
    const oldXMLHttpRequest = window.XMLHttpRequest
    const oldFileReader = window.FileReader
    let onloadHandle: any = null
    let onerrorHandle: any = null

    beforeEach(() => {
      (window as any).FileReader = null;
      (window as any).XMLHttpRequest = jest.fn(() => ({
        open: jest.fn(),
        send: jest.fn(),
        readyState: 4,
        status: 200,
        response: 10,
        addEventListener: (name: string, handle: any) => {
          if (name === 'load') {
            onloadHandle = handle
          }
          if (name === 'error') {
            onerrorHandle = handle
          }
        }
      }))
    })

    afterEach(() => {
      window.XMLHttpRequest = oldXMLHttpRequest
      window.FileReader = oldFileReader
    })

    it('should run setTimeout with dataurl', async () => {
      const callback = jest.fn()
      DataUri.imageToDataUri('data:image', callback)
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 10)
      })
      expect(callback.mock.calls.length).toBe(1)
    })

    it('should return datauri with image loaded', () => {
      const callback = jest.fn()
      DataUri.imageToDataUri('test.svg', callback)
      onloadHandle()
      expect(callback.mock.calls.length).toBe(1)
      expect(callback.mock.calls[0][1]).toBe('data:image/svg+xml;base64,AAAAAAAAAAAAAA==')
    })

    it('should return datauri with image load error', () => {
      const callback = jest.fn()
      DataUri.imageToDataUri('test.svg', callback)
      onerrorHandle()
      expect(callback.mock.calls.length).toBe(1)
      expect(callback.mock.calls[0][0]).toEqual(new Error(`Failed to load image: test.svg`))
    })
  })

  describe('#dataUriToBlob', () => {
    it('should return correct blob data with base64 datauri', () => {
      const blob: Blob = DataUri.dataUriToBlob('data:image/svg+xml;base64,AAAAAAAAAAAAAGFiY2RlZmc=')
      expect(blob.type).toBe('image/svg+xml')
    })

    it('should return correct blob data with datauri', () => {
      const blob: Blob = DataUri.dataUriToBlob('data:image/svg+xml,AAAAAAAAAAAAAGFiY2RlZmc=')
      expect(blob.type).toBe('image/svg+xml')
    })
  })

  describe('#svgToDataUrl', () => {
    it('should return dataurl of a svg string', () => {
      expect(DataUri.svgToDataUrl('<svg width="100" height="100"></svg>', {
        width: 100,
        height: 100
      })).toBe('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%3E%3C%2Fsvg%3E')
    })

    it('should return dataurl of a svg string without option', () => {
      expect(DataUri.svgToDataUrl('<svg width="100" height="100"></svg>'))
        .toBe('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%3E%3C%2Fsvg%3E')

      expect(DataUri.svgToDataUrl('<svg viewBox="0 0 100 100"></svg>'))
        .toBe('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20100%20100%22%3E%3C%2Fsvg%3E')
    })

    it('should throw error when no width or no height', () => {
      expect(() => {
        DataUri.svgToDataUrl('<svg></svg>')
      }).toThrowError('Can not parse width from svg string')

      expect(() => {
        DataUri.svgToDataUrl('<svg width="100"></svg>')
      }).toThrowError('Can not parse height from svg string')
    })
  })
})