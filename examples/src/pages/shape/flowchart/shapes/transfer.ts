import { JSONObject, NumberExt, Path, Shape } from '../../@antv/x6'

interface KnobsAttrValue extends JSONObject {
  tail: number
  ridgeX: number
  ridgeY: number
}

Shape.Path.define({
  title: 'Transfer',
  shape: 'flowchart_transfer',
  overwrite: true,
  width: 100,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      knobs: {
        tail: 0,
        ridgeX: 0.6,
        ridgeY: 0.3,
      },
    },
  },
  attrHooks: {
    knobs: {
      set(val, { refBBox }) {
        if (typeof val === 'object') {
          const v = val as KnobsAttrValue
          const { width, height } = refBBox
          const tail = NumberExt.clamp(width * v.tail, 0, v.ridgeX * width)
          const ridgeX = NumberExt.clamp(
            width * v.ridgeX,
            v.tail * width,
            width,
          )
          const ridgeY = NumberExt.clamp(height * v.ridgeY, 0, height / 2)

          return {
            d: new Path()
              .moveTo(0, ridgeY)
              .lineTo(ridgeX, ridgeY)
              .lineTo(ridgeX, 0)
              .lineTo(width, height / 2)
              .lineTo(ridgeX, height)
              .lineTo(ridgeX, height - ridgeY)
              .lineTo(0, height - ridgeY)
              .lineTo(tail, height / 2)
              .close()
              .serialize(),
          }
        }
      },
    },
  },
  knob: [
    {
      position({ node }) {
        const bbox = node.getBBox()
        const tail = node.attr<number>('body/knobs/tail')
        return {
          x: tail * bbox.width,
          y: bbox.height / 2,
        }
      },
      onMouseMove({ node, data, deltaX }) {
        if (deltaX !== 0) {
          const key = 'body/knobs/tail'
          const previous = node.attr<number>(key)

          if (data.tail == null) {
            data.tail = previous
          }

          const bbox = node.getBBox()
          const ridgeX = node.attr<number>('body/knobs/ridgeX')
          const current = NumberExt.clamp(
            data.tail + deltaX / bbox.width,
            0,
            ridgeX,
          )
          if (current !== previous) {
            node.attr(key, current)
          }
        }
      },
    },
    {
      position({ node }) {
        const bbox = node.getBBox()
        const ridgeX = node.attr<number>('body/knobs/ridgeX')
        const ridgeY = node.attr<number>('body/knobs/ridgeY')
        return { x: bbox.width * ridgeX, y: bbox.height * ridgeY }
      },
      onMouseMove({ node, data, deltaX, deltaY }) {
        if (deltaX !== 0 || deltaY !== 0) {
          const bbox = node.getBBox()
          const tail = node.attr<number>('body/knobs/tail')
          const previousX = node.attr<number>('body/knobs/ridgeX')
          const previousY = node.attr<number>('body/knobs/ridgeY')

          if (data.ridgeX == null) {
            data.ridgeX = previousX
          }

          if (data.ridgeY == null) {
            data.ridgeY = previousY
          }

          const currentX = NumberExt.clamp(
            data.ridgeX + deltaX / bbox.width,
            tail,
            1,
          )
          const currentY = NumberExt.clamp(
            data.ridgeY + deltaY / bbox.height,
            0,
            0.5,
          )

          if (currentX !== previousX || currentY !== previousY) {
            node.attr({
              body: {
                knobs: {
                  ridgeX: currentX,
                  ridgeY: currentY,
                },
              },
            })
          }
        }
      },
    },
  ],
})
