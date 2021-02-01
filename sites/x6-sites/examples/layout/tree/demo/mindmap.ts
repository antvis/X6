import { Graph, Model } from '@antv/x6'
import Hierarchy from '@antv/hierarchy'

const graph = new Graph({
  container: document.getElementById('container')!,
  grid: true,
  connecting: {
    connector: 'smooth'
  }
})

fetch('../data/algorithm-category.json')
  .then((response) => response.json())
  .then((data) => {
    const result = Hierarchy.mindmap(data, {
      direction: 'H',
      getHeight() {
        return 16
      },
      getWidth() {
        return 16
      },
      getHGap() {
        return 100
      },
      getVGap() {
        return 1
      },
      getSide: () => {
        return 'right'
      },
    });
    
    const model: Model.FromJSONData = { nodes: [], edges: [] }
    const traverse = (data: HierarchyResult) => {
      if (data) {
        model.nodes?.push({
          id: `${data.id}`,
          x: data.x + 250,
          y: data.y + 250,
          shape: 'circle',
          width: 16,
          height: 16,
          attrs: {
            body: {
              fill: '#855af2',
              stroke: 'transparent',
            },
          },
        })
      }
      if (data.children) {
        data.children.forEach((item: HierarchyResult) => {
          model.edges?.push({
            source: `${data.id}`,
            target: `${item.id}`,
            attrs: {
              line: {
                stroke: '#ccc',
                strokeWidth: 1,
                targetMarker: null
              }
            }
          })
          traverse(item)
        })
      }
    }
    traverse(result)

    graph.fromJSON(model)
  })

  interface HierarchyResult {
    id: number,
    x: number,
    y: number,
    children: HierarchyResult[]
  }