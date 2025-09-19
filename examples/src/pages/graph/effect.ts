import { FunctionExt, Graph, Rectangle, Vector } from '@antv/x6'
import { FitToContentCard } from './fit-card'
import { ScaleContentToFitCard } from './scale-card'

export function createEffect(graph: Graph) {
  const vSvg = Vector.create(graph.view.svg)
  const vVertical = Vector.create('path').attr('d', 'M -10000 -1 L 10000 -1')
  const vHorizontal = Vector.create('path').attr('d', 'M -1 -10000 L -1 10000')
  const vRect = Vector.create('rect')
  const vAxisX = vVertical.clone().addClass('axis')
  const vAxisY = vHorizontal.clone().addClass('axis')
  const vBBox = vRect.clone().addClass('bbox')
  const hideBBox = FunctionExt.debounce(() => {
    vBBox.removeClass('active')
  }, 500)

  const vElements: Vector[] = []

  vSvg.append([vAxisX, vAxisY, vBBox])

  return {
    showAll() {
      vElements.forEach((item) => {
        item.addClass('active')
      })
    },
    hideAll() {
      vElements.forEach((item) => {
        item.removeClass('active')
      })
    },
    removeAll() {
      while (vElements.length > 0) {
        vElements.pop()?.remove()
      }
    },

    updateContentBbox(bbox: Rectangle) {
      vBBox.attr(bbox.toJSON()).addClass('active')
      hideBBox()
    },

    afterFit(graph: Graph, options: FitToContentCard.State) {
      this.removeAll()

      const padding = options.padding
      const gridWidth = options.gridWidth
      const gridHeight = options.gridHeight
      const allowNewOrigin = options.allowNewOrigin
      const bbox = graph.getContentBBox()
      const origin = { x: graph.options.x, y: graph.options.y }

      const translatedX =
        allowNewOrigin === 'any' ||
        (allowNewOrigin === 'positive' && bbox.x - origin.x >= 0) ||
        (allowNewOrigin === 'negative' && bbox.x - origin.x < 0)
      const translatedY =
        allowNewOrigin === 'any' ||
        (allowNewOrigin === 'positive' && bbox.y - origin.y >= 0) ||
        (allowNewOrigin === 'negative' && bbox.y - origin.y < 0)

      if (padding) {
        const vPaddingRight = vHorizontal
          .clone()
          .addClass('padding')
          .translate(graph.options.width - padding / 2, 0, { absolute: true })
          .attr('stroke-width', padding)

        const vPaddingBottom = vVertical
          .clone()
          .addClass('padding')
          .translate(0, graph.options.height - padding / 2, {
            absolute: true,
          })
          .attr('stroke-width', padding)

        vSvg.append([vPaddingBottom, vPaddingRight])
        vElements.push(vPaddingBottom, vPaddingRight)
      }

      if (padding && (translatedX || translatedY)) {
        const paddings = []

        if (translatedY) {
          const vPaddingTop = vVertical
            .clone()
            .addClass('padding')
            .translate(0, padding / 2, { absolute: true })
            .attr('stroke-width', padding)

          paddings.push(vPaddingTop)
        }

        if (translatedX) {
          const svgPaddingLeft = vHorizontal
            .clone()
            .addClass('padding')
            .translate(padding / 2, 0, { absolute: true })
            .attr('stroke-width', padding)

          paddings.push(svgPaddingLeft)
        }

        if (paddings.length) {
          vSvg.append(paddings)
          vElements.push(...paddings)
        }
      }

      if (gridWidth > 2) {
        let x = gridWidth

        if (translatedX) {
          x += padding
        }

        do {
          const vGridX = vHorizontal
            .clone()
            .translate(x, 0, { absolute: true })
            .addClass('grid')
          vSvg.append(vGridX)
          vElements.push(vGridX)

          x += gridWidth
        } while (x < graph.options.width - padding)
      }

      if (gridHeight > 2) {
        let y = gridHeight

        if (translatedY) {
          y += padding
        }

        do {
          const vGridY = vVertical
            .clone()
            .translate(0, y, { absolute: true })
            .addClass('grid')
          vSvg.append(vGridY)
          vElements.push(vGridY)
          y += gridHeight
        } while (y < graph.options.height - padding)
      }
      this.showAll()
    },

    afterScaleToFit(graph: Graph, options: ScaleContentToFitCard.State) {
      this.removeAll()

      const padding = options.padding
      if (padding) {
        const vPaddingRight = vHorizontal
          .clone()
          .addClass('padding')
          .translate(graph.options.width - padding / 2, 0, { absolute: true })
          .attr('stroke-width', padding)

        const vPaddingBottom = vVertical
          .clone()
          .addClass('padding')
          .translate(0, graph.options.height - padding / 2, {
            absolute: true,
          })
          .attr('stroke-width', padding)

        const vPaddingLeft = vVertical
          .clone()
          .addClass('padding')
          .translate(0, padding / 2, { absolute: true })
          .attr('stroke-width', padding)

        const vPaddingTop = vHorizontal
          .clone()
          .addClass('padding')
          .translate(padding / 2, 0, { absolute: true })
          .attr('stroke-width', padding)

        vSvg.append([vPaddingBottom, vPaddingRight, vPaddingTop, vPaddingLeft])
        vElements.push(vPaddingBottom, vPaddingRight, vPaddingTop, vPaddingLeft)
      }

      this.showAll()
    },
  }
}
