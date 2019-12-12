import { Image } from './image'

const content =
  '<g fill="none" fill-rule="nonzero"><path fill="#EDC92C" d="M15.874 12.317L8.4.27a.477.477 0 0 0-.812 0L.092 12.35a.477.477 0 0 0 .405.73H15.491a.477.477 0 0 0 .383-.763z"/><path fill="#000" d="M7.44 8.097l-.155-2.319c-.03-.452-.043-.776-.043-.973 0-.268.07-.477.21-.627a.723.723 0 0 1 .554-.225c.278 0 .464.096.557.288.094.192.14.469.14.83 0 .213-.01.43-.033.649l-.208 2.387c-.023.284-.071.502-.146.653a.38.38 0 0 1-.368.228c-.174 0-.295-.073-.363-.22-.068-.147-.116-.37-.145-.67zm.537 3.186a.761.761 0 0 1-.515-.191c-.147-.127-.22-.306-.22-.535 0-.2.07-.37.21-.511.14-.14.312-.21.516-.21.203 0 .376.07.52.21.144.14.216.31.216.511 0 .226-.073.403-.218.532a.742.742 0 0 1-.509.194z"/></g>'

describe('Image.fromSvg', () => {
  it('should prase svg string to image', () => {
    const img = Image.fromSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14">${content}</svg>`,
    )
    expect(img.width).toBe(16)
    expect(img.height).toBe(14)

    const src = img.toString()
    expect(src).toBe(img.src)

    const clone = img.valueOf()
    expect(clone.src).toBe(img.src)
    expect(clone.width).toBe(img.width)
    expect(clone.height).toBe(img.height)
    console.log(img.src)
  })

  it('should use specified width and height', () => {
    const img = Image.fromSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14">${content}</svg>`,
      32,
      32,
    )
    expect(img.width).toBe(32)
    expect(img.height).toBe(32)
  })

  it('should prase width and height from viewbox', () => {
    const img = Image.fromSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14">${content}</svg>`,
    )
    expect(img.width).toBe(16)
    expect(img.height).toBe(14)
  })

  it('should prase width from viewbox', () => {
    const img = Image.fromSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" height="14">${content}</svg>`,
    )
    expect(img.width).toBe(16)
    expect(img.height).toBe(14)
  })

  it('should prase height from viewbox', () => {
    const img = Image.fromSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" width="16">${content}</svg>`,
    )
    expect(img.width).toBe(16)
    expect(img.height).toBe(14)
  })

  it('should throw error when can not prase width', () => {
    const fn1 = () => {
      Image.fromSvg(
        `<svg xmlns="http://www.w3.org/2000/svg" width="x">${content}</svg>`,
      )
    }

    expect(fn1).toThrowError()

    const fn2 = () => {
      Image.fromSvg(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 x 14">${content}</svg>`,
      )
    }

    expect(fn2).toThrowError()
  })

  it('should throw error when can not prase height', () => {
    const fn1 = () => {
      Image.fromSvg(
        `<svg xmlns="http://www.w3.org/2000/svg" height="x">${content}</svg>`,
      )
    }

    expect(fn1).toThrowError()

    const fn2 = () => {
      Image.fromSvg(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 x">${content}</svg>`,
      )
    }

    expect(fn2).toThrowError()
  })

  // it.skip('should work width old browser', () => {
  //   const btoa = window.btoa
  //   window.btoa = null
  //   const img = Image.fromSvg(
  //     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" height="14">${content}</svg>`,
  //   )
  //   expect(img.width).toBe(16)
  //   expect(img.height).toBe(14)
  //   window.btoa = btoa
  // })
})
