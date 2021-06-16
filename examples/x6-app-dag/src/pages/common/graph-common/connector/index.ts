import { Graph } from '@antv/x6'

Graph.registerConnector(
  'pai',
  (s, t) => {
    const offset = 4
    const control = 80
    const v1 = { x: s.x, y: s.y + offset + control }
    const v2 = { x: t.x, y: t.y - offset - control }

    return `M ${s.x} ${s.y}
       L ${s.x} ${s.y + offset}
       C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${t.x} ${t.y - offset}
       L ${t.x} ${t.y}
      `
  },
  true,
)
