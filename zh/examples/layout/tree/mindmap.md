---
title: "脑图树"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/layout/tree/mindmap/"
version: "3.x"
---

# 脑图树

[运行示例](https://x6.antv.antgroup.com/zh/examples/layout/tree/mindmap/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import exampleData from '../../../data/algorithm-category.json'
import { Graph, Model } from '@antv/x6'
import Hierarchy from '@antv/hierarchy'

const graph = new Graph({
  container: document.getElementById('container')!,
  connecting: {
    connector: 'smooth',
  },
})

Promise.resolve(exampleData)
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
        return 80
      },
      getVGap() {
        return 1
      },
      getSide: () => {
        return 'right'
      },
    })

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
              fill: '#5F95FF',
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
                stroke: '#A2B1C3',
                strokeWidth: 1,
                targetMarker: null,
              },
            },
          })
          traverse(item)
        })
      }
    }
    traverse(result)

    graph.fromJSON(model)
  })

interface HierarchyResult {
  id: number
  x: number
  y: number
  children: HierarchyResult[]
}
```

## examples/data/algorithm-category.json

```json
{
  "id": "Modeling Methods",
  "children": [
    {
      "id": "Classification",
      "children": [
        {
          "id": "Logistic regression"
        },
        {
          "id": "Linear discriminant analysis"
        },
        {
          "id": "Rules"
        },
        {
          "id": "Decision trees"
        },
        {
          "id": "Naive Bayes"
        },
        {
          "id": "K nearest neighbor"
        },
        {
          "id": "Probabilistic neural network"
        },
        {
          "id": "Support vector machine"
        }
      ]
    },
    {
      "id": "Consensus",
      "children": [
        {
          "id": "Models diversity",
          "children": [
            {
              "id": "Different initializations"
            },
            {
              "id": "Different parameter choices"
            },
            {
              "id": "Different architectures"
            },
            {
              "id": "Different modeling methods"
            },
            {
              "id": "Different training sets"
            },
            {
              "id": "Different feature sets"
            }
          ]
        },
        {
          "id": "Methods",
          "children": [
            {
              "id": "Classifier selection"
            },
            {
              "id": "Classifier fusion"
            }
          ]
        },
        {
          "id": "Common",
          "children": [
            {
              "id": "Bagging"
            },
            {
              "id": "Boosting"
            },
            {
              "id": "AdaBoost"
            }
          ]
        }
      ]
    },
    {
      "id": "Regression",
      "children": [
        {
          "id": "Multiple linear regression"
        },
        {
          "id": "Partial least squares"
        },
        {
          "id": "Multi-layer feedforward neural network"
        },
        {
          "id": "General regression neural network"
        },
        {
          "id": "Support vector regression"
        }
      ]
    }
  ]
}
```
