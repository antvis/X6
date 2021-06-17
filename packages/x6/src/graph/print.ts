import { Size, KeyValue } from '../types'
import { Rectangle } from '../geometry'
import { NumberExt, JQuery, Dom, Unit, Vector } from '../util'
import { Base } from './base'

export class PrintManager extends Base {
  show(options: Partial<PrintManager.Options> = {}) {
    const localOptions = {
      ...PrintManager.defaultOptions,
      ...options,
    } as PrintManager.Options

    const $pages = this.createPrintPages(localOptions)
    localOptions.ready(
      $pages,
      ($pages) => this.showPrintWindow($pages, localOptions),
      {
        sheetSize: this.getSheetSize(localOptions),
      },
    )
  }

  protected get className() {
    return this.view.prefixClassName('graph-print')
  }

  protected showPrintWindow(
    $pages: JQuery<HTMLElement>[] | false,
    options: PrintManager.Options,
  ) {
    if ($pages) {
      const $body = JQuery(document.body)
      const $container = JQuery(this.view.container)
      const bodyClassName = this.view.prefixClassName('graph-printing')
      $body.addClass(bodyClassName)
      const $detached = $container.children().detach()
      $pages.forEach(($page) => {
        $page
          .removeClass(`${this.className}-preview`)
          .addClass(`${this.className}-ready`)
          .appendTo($body)
      })

      let ret = false
      const cb = () => {
        if (!ret) {
          ret = true
          $body.removeClass(bodyClassName)
          $pages.forEach(($page) => $page.remove())
          $container.append($detached)
          JQuery(`#${this.styleSheetId}`).remove()
          this.graph.trigger('after:print', options)
          JQuery(window).off('afterprint', cb)
        }
      }

      JQuery(window).one('afterprint', cb)
      setTimeout(cb, 200)
      window.print()
    }
  }

  protected createPrintPage(
    pageArea: Rectangle.RectangleLike,
    options: PrintManager.Options,
  ) {
    this.graph.trigger('before:print', options)

    const $page = JQuery('<div/>').addClass(this.className)
    const $wrap = JQuery('<div/>')
      .addClass(this.view.prefixClassName('graph-print-inner'))
      .css('position', 'relative')

    if (options.size) {
      $page.addClass(`${this.className}-size-${options.size}`)
    }

    const vSVG = Vector.create(this.view.svg).clone()
    const vStage = vSVG.findOne(
      `.${this.view.prefixClassName('graph-svg-stage')}`,
    )!

    $wrap.append(vSVG.node)

    const sheetSize = this.getSheetSize(options)
    const graphArea = this.graph.transform.getGraphArea()
    const s = this.graph.transform.getScale()
    const ts = this.graph.translate()
    const matrix = Dom.createSVGMatrix().translate(ts.tx / s.sx, ts.ty / s.sy)
    const info = this.getPageInfo(graphArea, pageArea, sheetSize)
    const scale = info.scale
    const bbox = info.bbox

    $wrap.css({
      left: 0,
      top: 0,
    })

    vSVG.attr({
      width: bbox.width * scale,
      height: bbox.height * scale,
      style: 'position:relative',
      viewBox: [bbox.x, bbox.y, bbox.width, bbox.height].join(' '),
    })

    vStage.attr('transform', Dom.matrixToTransformString(matrix))
    $page.append($wrap)
    $page.addClass(`${this.className}-preview`)

    return {
      $page,
      sheetSize,
    }
  }

  protected createPrintPages(options: PrintManager.Options) {
    let ret
    const area = this.getPrintArea(options)
    const $pages = []

    if (options.page) {
      const pageSize = this.getPageSize(area, options.page)
      const pageAreas = this.getPageAreas(area, pageSize)
      pageAreas.forEach((pageArea) => {
        ret = this.createPrintPage(pageArea, options)
        $pages.push(ret.$page)
      })
    } else {
      ret = this.createPrintPage(area, options)
      $pages.push(ret.$page)
    }

    if (ret) {
      const size = {
        width: ret.sheetSize.cssWidth,
        height: ret.sheetSize.cssHeight,
      }
      this.updatePrintStyle(size, options)
    }

    return $pages
  }

  protected get styleSheetId() {
    return this.view.prefixClassName('graph-print-style')
  }

  protected updatePrintStyle(
    size: KeyValue<string>,
    options: PrintManager.Options,
  ) {
    const sizeCSS = Object.keys(size).reduce(
      (memo, key) => `${memo} ${key}:${size[key]};`,
      '',
    )

    const margin = NumberExt.normalizeSides(options.margin)
    const marginUnit = options.marginUnit || ''
    const sheetUnit = options.sheetUnit || ''

    const css = `
      @media print {
        .${this.className}.${this.className}-ready {
          ${sizeCSS}
        }

        @page {
          margin:
          ${[
            margin.top + marginUnit,
            margin.right + marginUnit,
            margin.bottom + marginUnit,
            margin.left + marginUnit,
          ].join(' ')};
          size: ${options.sheet.width + sheetUnit} ${
      options.sheet.height + sheetUnit
    };

        .${this.className}.${this.className}-preview {
          ${sizeCSS}
        }
      }`

    const id = this.styleSheetId
    const $style = JQuery(`#${id}`)
    if ($style.length) {
      $style.html(css)
    } else {
      JQuery('head').append(
        `'<style type="text/css" id="${id}">${css}</style>'`, // lgtm[js/html-constructed-from-input]
      )
    }
  }

  protected getPrintArea(options: PrintManager.Options) {
    let area = options.area
    if (!area) {
      const padding = NumberExt.normalizeSides(options.padding)
      area = this.graph.getContentArea().moveAndExpand({
        x: -padding.left,
        y: -padding.top,
        width: padding.left + padding.right,
        height: padding.top + padding.bottom,
      })
    }
    return area
  }

  protected getPageSize(
    area: Rectangle.RectangleLike,
    poster: PrintManager.Page,
  ): Size {
    if (typeof poster === 'object') {
      const raw = poster as any
      const page = {
        width: raw.width,
        height: raw.height,
      }

      if (page.width == null) {
        page.width = Math.ceil(area.width / (raw.columns || 1))
      }

      if (page.height == null) {
        page.height = Math.ceil(area.height / (raw.rows || 1))
      }

      return page
    }

    return {
      width: area.width,
      height: area.height,
    }
  }

  protected getPageAreas(area: Rectangle.RectangleLike, pageSize: Size) {
    const pages = []
    const width = pageSize.width
    const height = pageSize.height

    for (let w = 0, n = 0; w < area.height && n < 200; w += height, n += 1) {
      for (let h = 0, m = 0; h < area.width && m < 200; h += width, m += 1) {
        pages.push(new Rectangle(area.x + h, area.y + w, width, height))
      }
    }

    return pages
  }

  protected getSheetSize(
    options: PrintManager.Options,
  ): PrintManager.SheetSize {
    const sheet = options.sheet
    const margin = NumberExt.normalizeSides(options.margin)
    const marginUnit = options.marginUnit || ''
    const sheetUnit = options.sheetUnit || ''

    const cssWidth =
      // eslint-disable-next-line
      `calc(${sheet.width}${sheetUnit} - ${
        margin.left + margin.right
      }${marginUnit})`

    const cssHeight =
      // eslint-disable-next-line
      `calc(${sheet.height}${sheetUnit} - ${
        margin.top + margin.bottom
      }${marginUnit})`

    const ret = Unit.measure(cssWidth, cssHeight)
    return {
      cssWidth,
      cssHeight,
      width: ret.width,
      height: ret.height,
    }
  }

  protected getPageInfo(
    graphArea: Rectangle.RectangleLike,
    pageArea: Rectangle.RectangleLike,
    sheetSize: Size,
  ) {
    const bbox = new Rectangle(
      pageArea.x - graphArea.x,
      pageArea.y - graphArea.y,
      pageArea.width,
      pageArea.height,
    )
    const pageRatio = bbox.width / bbox.height
    const graphRatio = sheetSize.width / sheetSize.height

    return {
      bbox,
      scale:
        graphRatio < pageRatio
          ? sheetSize.width / bbox.width
          : sheetSize.height / bbox.height,
      fitHorizontal: graphRatio < pageRatio,
    }
  }

  @Base.dispose()
  dispose() {}
}

export namespace PrintManager {
  export type Page =
    | boolean
    | Size
    | {
        rows: number
        columns: number
      }

  export interface Options {
    size?: string
    sheet: Size
    sheetUnit?: Unit
    area?: Rectangle.RectangleLike
    page?: Page
    margin?: NumberExt.SideOptions
    marginUnit?: Unit
    padding?: NumberExt.SideOptions
    ready: (
      $pages: JQuery<HTMLElement>[],
      readyToPrint: ($pages: JQuery<HTMLElement>[] | false) => any,
      options: {
        sheetSize: SheetSize
      },
    ) => any
  }

  export interface SheetSize extends Size {
    cssWidth: string
    cssHeight: string
  }

  export const defaultOptions: Options = {
    page: false,
    sheet: {
      width: 210,
      height: 297,
    },
    sheetUnit: 'mm',
    margin: 0.4,
    marginUnit: 'in',
    padding: 5,
    ready: ($pages, readyToPrint) => readyToPrint($pages),
  }
}
