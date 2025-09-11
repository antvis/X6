import { NumberExt, Shape } from '../../@antv/x6'

Shape.Path.define({
  shape: 'flowchart_internal_storage',
  overwrite: true,
  width: 80,
  height: 80,
  markup: [
    {
      tagName: 'rect',
      selector: 'bg',
    },
    {
      tagName: 'path',
      groupSelector: 'line',
      selector: 'h',
    },
    {
      tagName: 'path',
      groupSelector: 'line',
      selector: 'v',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    bg: {
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      refWidth: '100%',
      refHeight: '100%',
      round: 8,
    },
    line: {
      stroke: '#000',
      strokeWidth: 1,
    },
    h: {
      hPos: 24,
    },
    v: {
      vPos: 24,
    },
  },
  attrHooks: {
    round: {
      set(v, { refBBox }) {
        if (typeof v === 'number') {
          const { width, height } = refBBox
          const r = Math.min(width / 2, height / 2, v)
          return {
            rx: r,
            ry: r,
          }
        }
      },
    },
    hPos: {
      set(v, { cell, refBBox }) {
        if (typeof v === 'number') {
          const { width, height } = refBBox
          const round = cell.attr<number>('bg/round')
          const offset = NumberExt.clamp(v, round, height - round)
          return { d: `M 0 ${offset}  L ${width} ${offset}` }
        }
      },
    },
    vPos: {
      set(v, { cell, refBBox }) {
        if (typeof v === 'number') {
          const { width, height } = refBBox
          const round = cell.attr<number>('bg/round')
          const offset = NumberExt.clamp(v, round, width - round)
          return { d: `M ${offset} 0 L ${offset} ${height}` }
        }
      },
    },
  },
  knob: [
    {
      position({ node }) {
        const bbox = node.getBBox()
        const round = node.attr<number>('bg/round')
        return { x: bbox.width - round, y: round }
      },
      onMouseMove({ node, data, deltaX }) {
        if (deltaX !== 0) {
          const bbox = node.getBBox()
          const key = 'bg/round'
          const previous = node.attr<number>(key)
          if (data.round == null) {
            data.round = previous
          }
          const min = 0
          const max = Math.min(bbox.width, bbox.height) / 2
          const current = NumberExt.clamp(data.round - deltaX, min, max)
          if (current !== previous) {
            node.attr(key, current)
          }
        }
      },
    },
    {
      position({ node }) {
        const hPos = node.attr<number>('h/hPos')
        const vPos = node.attr<number>('v/vPos')
        return { x: vPos, y: hPos }
      },
      onMouseMove({ node, data, deltaX, deltaY }) {
        if (deltaX !== 0 || deltaY !== 0) {
          const bbox = node.getBBox()
          const { width, height } = bbox
          const hPos = node.attr<number>('h/hPos')
          const vPos = node.attr<number>('v/vPos')
          const round = node.attr<number>('bg/round')

          if (data.hPos == null || data.vPos == null) {
            data.hPos = hPos
            data.vPos = vPos
          }

          const x = NumberExt.clamp(data.vPos + deltaX, round, width - round)
          const y = NumberExt.clamp(data.hPos + deltaY, round, height - round)

          if (x !== vPos || y !== hPos) {
            node.attr({
              v: { vPos: x },
              h: { hPos: y },
            })
          }
        }
      },
    },
  ],
})
