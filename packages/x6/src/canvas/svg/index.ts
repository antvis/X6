/* tslint:disable:no-parameter-reassignment */

import { Url } from '../../util'
import { DomUtil } from '../../dom'
import { SvgCanvas2DText } from './text'

export class SvgCanvas2D extends SvgCanvas2DText {
  begin() {
    super.begin()
    this.elem = this.createElement('path')
  }

  rect(x: number, y: number, w: number, h: number) {
    const state = this.state
    this.elem = this.createElement('rect')
    DomUtil.setAttributes(this.elem, {
      x: this.format((x + state.tx) * state.scale),
      y: this.format((y + state.ty) * state.scale),
      width: this.format(w * state.scale),
      height: this.format(h * state.scale),
    })
  }

  roundRect(
    x: number,
    y: number,
    w: number,
    h: number,
    dx: number,
    dy: number,
  ) {
    this.rect(x, y, w, h)

    if (dx > 0) {
      this.elem!.setAttribute('rx', `${this.format(dx * this.state.scale)}`)
    }

    if (dy > 0) {
      this.elem!.setAttribute('ry', `${this.format(dy * this.state.scale)}`)
    }
  }

  ellipse(x: number, y: number, w: number, h: number) {
    const state = this.state
    this.elem = this.createElement('ellipse')
    DomUtil.setAttributes(this.elem, {
      cx: this.format((x + w / 2 + state.tx) * state.scale),
      cy: this.format((y + h / 2 + state.ty) * state.scale),
      rx: (w / 2) * state.scale,
      ry: (h / 2) * state.scale,
    })
  }

  link(href?: string | null) {
    if (href == null) {
      this.root = this.originalRoot!
    } else {
      this.originalRoot = this.root
      const a = this.createElement('a')
      if (a.setAttributeNS == null) {
        a.setAttribute('xlink:href', href)
      } else {
        a.setAttributeNS(SvgCanvas2D.NS_XLINK, 'xlink:href', href)
      }

      this.root.appendChild(a)
      this.root = a
    }
  }

  imageOffset: number = 0

  image(
    x: number,
    y: number,
    w: number,
    h: number,
    src: string,
    aspect: boolean = true,
    flipH: boolean = false,
    flipV: boolean = false,
  ) {
    const state = this.state

    src = Url.toAbsolute(src)
    x += state.tx
    y += state.ty

    const img = this.createElement('image')
    DomUtil.setAttributes(img, {
      x: this.format(x * state.scale) + this.imageOffset,
      y: this.format(y * state.scale) + this.imageOffset,
      width: this.format(w * state.scale),
      height: this.format(h * state.scale),
    })

    if (img.setAttributeNS == null) {
      img.setAttribute('xlink:href', src)
    } else {
      img.setAttributeNS(SvgCanvas2D.NS_XLINK, 'xlink:href', src)
    }

    if (!aspect) {
      img.setAttribute('preserveAspectRatio', 'none')
    }

    if (state.opacity < 1 || state.fillOpacity < 1) {
      img.setAttribute('opacity', `${state.opacity * state.fillOpacity}`)
    }

    let transform = this.state.transform || ''
    if (flipH || flipV) {
      let sx = 1
      let sy = 1
      let tx = 0
      let ty = 0

      if (flipH) {
        sx = -1
        tx = -w - 2 * x
      }

      if (flipV) {
        sy = -1
        ty = -h - 2 * y
      }

      // adds image tansformation to existing transform
      transform += `scale(${sx},${sy})`
      transform += `translate(${tx * state.scale},${ty * state.scale})`
    }

    if (transform.length > 0) {
      img.setAttribute('transform', transform)
    }

    if (!this.pointerEvents) {
      img.setAttribute('pointer-events', 'none')
    }

    this.root.appendChild(img)
  }

  reset() {
    super.reset()
    this.gradients = {}
  }

  rotate(deg: number, flipH: boolean, flipV: boolean, cx: number, cy: number) {
    if (deg !== 0 || flipH || flipV) {
      const state = this.state

      cx += state.tx
      cy += state.ty
      cx *= state.scale
      cy *= state.scale

      state.transform = state.transform || ''

      if (flipH && flipV) {
        deg += 180
      } else if (flipH !== flipV) {
        const tx = flipH ? cx : 0
        const sx = flipH ? -1 : 1
        const ty = flipV ? cy : 0
        const sy = flipV ? -1 : 1

        state.transform +=
          `translate(${this.format(tx)},${this.format(ty)})` +
          `scale(${this.format(sx)},${this.format(sy)})` +
          `translate(${this.format(-tx)},${this.format(-ty)})`
      }

      if (flipH ? !flipV : flipV) {
        deg *= -1
      }

      if (deg !== 0) {
        state.transform += `rotate(${this.format(deg)},${this.format(
          cx,
        )},${this.format(cy)})`
      }

      state.rotation = state.rotation + deg
      state.rotationCenterX = cx
      state.rotationCenterY = cy
    }
  }

  stroke() {
    this.addNode(false, true)
  }

  fill() {
    this.addNode(true, false)
  }

  fillAndStroke() {
    this.addNode(true, true)
  }
}

export namespace SvgCanvas2D {
  export type Gradients = { [key: string]: SVGGradientElement }
  export const NS_SVG = 'http://www.w3.org/2000/svg'
  export const NS_XHTML = 'http://www.w3.org/1999/xhtml'
  export const NS_XLINK = 'http://www.w3.org/1999/xlink'
}
