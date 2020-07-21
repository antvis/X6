import { ObjectExt } from '../util'
import { Rectangle } from '../geometry'
import { Background } from '../registry'
import { Base } from './base'

export class BackgroundManager extends Base {
  protected optionCache: BackgroundManager.Options | null

  protected get container() {
    return this.view.container
  }

  protected get elem() {
    return this.view.background
  }

  protected init() {
    this.graph.on('scale', this.update, this)
    this.graph.on('translate', this.update, this)

    if (this.options.background) {
      this.draw(this.options.background)
    }
  }

  protected updateBackgroundImage(options: BackgroundManager.Options = {}) {
    let backgroundSize = options.size || 'auto auto'
    let backgroundPosition = options.position || 'center'

    const scale = this.graph.scale()
    const ts = this.graph.translate()

    // backgroundPosition
    if (typeof backgroundPosition === 'object') {
      const x = ts.tx + scale.sx * (backgroundPosition.x || 0)
      const y = ts.ty + scale.sy * (backgroundPosition.y || 0)
      backgroundPosition = `${x}px ${y}px`
    }

    // backgroundSize
    if (typeof backgroundSize === 'object') {
      backgroundSize = Rectangle.fromSize(backgroundSize).scale(
        scale.sx,
        scale.sy,
      )
      backgroundSize = `${backgroundSize.width}px ${backgroundSize.height}px`
    }

    this.view.$(this.elem).css({
      backgroundSize,
      backgroundPosition,
    })
  }

  protected drawBackgroundImage(
    img?: HTMLImageElement | null,
    options: BackgroundManager.Options = {},
  ) {
    if (!(img instanceof HTMLImageElement)) {
      this.elem.style.backgroundImage = ''
      return
    }

    let uri
    const opacity = options.opacity || 1
    const backgroundSize = options.size
    let backgroundRepeat = options.repeat || 'no-repeat'

    const pattern = Background.registry.get(backgroundRepeat)
    if (typeof pattern === 'function') {
      const quality = (options as Background.ManaualItem).quality || 1
      img.width *= quality
      img.height *= quality
      const canvas = pattern(img, options)
      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(
          'Background pattern must return an HTML Canvas instance',
        )
      }

      uri = canvas.toDataURL('image/png')

      // `repeat` was changed in pattern function
      if (options.repeat && backgroundRepeat !== options.repeat) {
        backgroundRepeat = options.repeat
      } else {
        backgroundRepeat = 'repeat'
      }

      if (typeof backgroundSize === 'object') {
        // recalculate the tile size if an object passed in
        backgroundSize.width *= canvas.width / img.width
        backgroundSize.height *= canvas.height / img.height
      } else if (backgroundSize === undefined) {
        // calcule the tile size if no provided
        options.size = {
          width: canvas.width / quality,
          height: canvas.height / quality,
        }
      }
    } else {
      uri = img.src
      if (backgroundSize === undefined) {
        options.size = {
          width: img.width,
          height: img.height,
        }
      }
    }

    this.view.$(this.elem).css({
      opacity,
      backgroundRepeat,
      backgroundImage: `url(${uri})`,
    })

    this.updateBackgroundImage(options)
  }

  protected updateBackgroundColor(color?: string | null) {
    this.container.style.backgroundColor = color || ''
  }

  update() {
    if (this.optionCache) {
      this.updateBackgroundImage(this.optionCache)
    }
  }

  draw(options: BackgroundManager.Options = {}) {
    this.updateBackgroundColor(options.color)

    if (options.image) {
      const img = document.createElement('img')
      img.onload = () => this.drawBackgroundImage(img, options)
      img.setAttribute('crossorigin', 'anonymous')
      img.src = options.image
      this.optionCache = ObjectExt.clone(options)
    } else {
      this.drawBackgroundImage(null)
      this.optionCache = null
    }
  }

  clear() {
    this.draw()
  }

  @Base.dispose()
  dispose() {
    this.graph.off('scale', this.update, this)
    this.graph.off('translate', this.update, this)
    this.clear()
  }
}

export namespace BackgroundManager {
  export type Options =
    | Background.Options
    | Background.NativeItem
    | Background.ManaualItem
}
