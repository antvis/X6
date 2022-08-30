(this["webpackJsonp@antv/x6-sites-demos-scene.sankey"]=this["webpackJsonp@antv/x6-sites-demos-scene.sankey"]||[]).push([[0],{80:function(h,u,e){h.exports=e(98)},86:function(h,u,e){},90:function(h,u,e){},91:function(h,u,e){"use strict";e.r(u),e.d(u,"host",function(){return E}),e.d(u,"getCodeSandboxParams",function(){return n}),e.d(u,"getStackblitzPrefillConfig",function(){return x});const E="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/scene/sankey";function n(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "d3-sankey": "^0.12.3",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1"
  },
  "devDependencies": {
    "@types/d3-sankey": "^0.11.1",
    "@types/react": "^16.9.19",
    "@types/react-dom": "^16.9.5",
    "typescript": "^4.1.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
react-app-env.d.ts
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,isBinary:!1},"public/index.html":{content:`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title></title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
  </body>
</html>
`,isBinary:!1},"src/app.css":{content:`.app {
  font-family: sans-serif;
  padding: 0;
  display: flex;
  padding: 16px 8px;
  height: 980px;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph } from '@antv/x6'
import { layout } from './layout'
import './curve'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
      scroller: {
        enabled: true,
      },
      connecting: {
        connectionPoint: 'anchor',
        connector: 'curve',
      },
    })

    const { nodes } = layout()
    const nodeMap: { [id: string]: any } = {}
    const colors = [
      'rgba(16, 142, 233, 0.6)',
      'rgba(255, 85, 0, 0.5)',
      'rgba(135, 208, 104, 0.5)',
    ]

    nodes.forEach((node: any) => {
      nodeMap[node.id] = node
      const { x0, x1, y0, y1 } = node
      this.graph.addNode({
        x: x0,
        y: y0,
        width: x1! - x0!,
        height: y1! - y0!,
        id: node.id,
        zIndex: 10,
        attrs: {
          label: {
            text: node.name,
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            refX: '100%',
            refX2: 8,
            fontSize: 12,
          },
        },
      })
    })

    nodes.forEach((node: any) => {
      if (node.dep) {
        const sourceNode = nodeMap[node.dep]
        const sourceHeight = sourceNode.y1 - sourceNode.y0
        const targetHeight = node.y1 - node.y0
        let acc: number = 0
        for (let i = 0, l = sourceNode.sourceLinks.length; i < l; i += 1) {
          const link = sourceNode.sourceLinks[i]
          const target = link.target
          if (target.id === node.id) {
            acc += targetHeight / 2
            break
          } else {
            acc += target.y1 - target.y0
          }
        }

        this.graph.addEdge({
          source: {
            cell: node.dep,
            anchor: { name: 'right', args: { dy: acc - sourceHeight / 2 } },
            magnet: 'rect',
          },
          target: { cell: node.id, anchor: { name: 'left' } },
          zIndex: 1,
          attrs: {
            line: {
              strokeWidth: targetHeight,
              stroke: colors[nodeMap[node.dep].depth],
              targetMarker: '',
            },
          },
        })
      }
    })

    this.graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
`,isBinary:!1},"src/curve.ts":{content:`import { Graph, Path } from '@antv/x6'

Graph.registerConnector('curve', (sourcePoint, targetPoint) => {
  const path = new Path()
  path.appendSegment(Path.createSegment('M', sourcePoint))
  path.appendSegment(
    Path.createSegment(
      'C',
      sourcePoint.x + 180,
      sourcePoint.y,
      targetPoint.x - 180,
      targetPoint.y,
      targetPoint.x,
      targetPoint.y,
    ),
  )
  return path.serialize()
})
`,isBinary:!1},"src/index.css":{content:`body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,isBinary:!1},"src/index.tsx":{content:`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"src/layout.ts":{content:`import { sankey } from 'd3-sankey'

interface DataItem {
  name: string
  count: number
  id: string
  dep?: string
}

const data: DataItem[] = [
  { name: '4S\u5E97', count: 131, id: '0' },
  { name: '\u670D\u52A1\u90E8', count: 66, id: '1', dep: '0' },
  { name: '\u9500\u552E\u90E8', count: 35, id: '2', dep: '0' },
  { name: '\u7BA1\u7406\u56E2\u961F', count: 8, id: '3', dep: '0' },
  { name: '\u884C\u653F\u4EBA\u4E8B\u90E8', count: 4, id: '4', dep: '0' },
  { name: '\u8D22\u52A1\u90E8', count: 8, id: '5', dep: '0' },
  { name: '\u5BA2\u670D\u90E8', count: 7, id: '6', dep: '0' },
  { name: '\u5E02\u573A\u4F01\u5212\u90E8', count: 3, id: '7', dep: '0' },

  // \u670D\u52A1\u90E8
  { name: '\u8F66\u95F4\u884C\u653F\u7BA1\u7406', count: 9, id: '8', dep: '1' },
  { name: '\u63A5\u5F85\u670D\u52A1', count: 11, id: '9', dep: '1' },
  { name: '\u4FDD\u9669\u670D\u52A1', count: 7, id: '10', dep: '1' },
  { name: '\u5907\u4EF6\u7BA1\u7406', count: 7, id: '11', dep: '1' },
  { name: '\u673A\u4FEE\u8F66\u95F4', count: 14, id: '12', dep: '1' },
  { name: '\u94A3\u55B7\u8F66\u95F4', count: 18, id: '13', dep: '1' },

  { name: '\u94A3\u55B7\u8F66\u95F41', count: 2, id: '24', dep: '13' },
  { name: '\u94A3\u55B7\u8F66\u95F42', count: 6, id: '25', dep: '13' },
  { name: '\u94A3\u55B7\u8F66\u95F43', count: 10, id: '26', dep: '13' },

  // \u9500\u552E\u90E8
  { name: '\u5C55\u5385', count: 17, id: '14', dep: '2' },
  { name: 'DCC', count: 3, id: '15', dep: '2' },
  { name: '\u533A\u57DF', count: 2, id: '16', dep: '2' },
  { name: '\u7CBE\u54C1\u9500\u552E', count: 4, id: '17', dep: '2' },
  { name: '\u4E8C\u624B\u8F66', count: 2, id: '18', dep: '2' },
  { name: '\u7269\u6D41\u4E2D\u5FC3', count: 3, id: '19', dep: '2' },
  { name: '\u8D27\u6B3E', count: 1, id: '20', dep: '2' },
  { name: '\u9500\u552E\u652F\u6301', count: 3, id: '21', dep: '2' },
]

export function layout() {
  const nodes: any[] = []
  const links: any[] = []
  data.forEach((d) => {
    nodes.push({ ...d })
    if (d.dep) {
      links.push({ source: d.dep, target: d.id, value: d.count })
    }
  })

  // @see https://github.com/d3/d3-sankey
  const execute = sankey()
    .nodeWidth(20)
    .nodePadding(12)
    .size([980, 760])
    .nodeId((d: any) => d.id)
    .nodeSort(() => {
      return 0
    })
    .iterations(32)

  return execute({ nodes, links })
}
`,isBinary:!1},"tsconfig.json":{content:`{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strictPropertyInitialization": false,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "jsx": "react",
    "target": "es5",
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "include": [
    "src"
  ]
}
`,isBinary:!1}}}}function x(){return{title:"scene/sankey",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2","d3-sankey":"^0.12.3",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "d3-sankey": "^0.12.3",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1"
  },
  "devDependencies": {
    "@types/d3-sankey": "^0.11.1",
    "@types/react": "^16.9.19",
    "@types/react-dom": "^16.9.5",
    "typescript": "^4.1.2"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
react-app-env.d.ts
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,"public/index.html":`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title></title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
  </body>
</html>
`,"src/app.css":`.app {
  font-family: sans-serif;
  padding: 0;
  display: flex;
  padding: 16px 8px;
  height: 980px;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph } from '@antv/x6'
import { layout } from './layout'
import './curve'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
      scroller: {
        enabled: true,
      },
      connecting: {
        connectionPoint: 'anchor',
        connector: 'curve',
      },
    })

    const { nodes } = layout()
    const nodeMap: { [id: string]: any } = {}
    const colors = [
      'rgba(16, 142, 233, 0.6)',
      'rgba(255, 85, 0, 0.5)',
      'rgba(135, 208, 104, 0.5)',
    ]

    nodes.forEach((node: any) => {
      nodeMap[node.id] = node
      const { x0, x1, y0, y1 } = node
      this.graph.addNode({
        x: x0,
        y: y0,
        width: x1! - x0!,
        height: y1! - y0!,
        id: node.id,
        zIndex: 10,
        attrs: {
          label: {
            text: node.name,
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            refX: '100%',
            refX2: 8,
            fontSize: 12,
          },
        },
      })
    })

    nodes.forEach((node: any) => {
      if (node.dep) {
        const sourceNode = nodeMap[node.dep]
        const sourceHeight = sourceNode.y1 - sourceNode.y0
        const targetHeight = node.y1 - node.y0
        let acc: number = 0
        for (let i = 0, l = sourceNode.sourceLinks.length; i < l; i += 1) {
          const link = sourceNode.sourceLinks[i]
          const target = link.target
          if (target.id === node.id) {
            acc += targetHeight / 2
            break
          } else {
            acc += target.y1 - target.y0
          }
        }

        this.graph.addEdge({
          source: {
            cell: node.dep,
            anchor: { name: 'right', args: { dy: acc - sourceHeight / 2 } },
            magnet: 'rect',
          },
          target: { cell: node.id, anchor: { name: 'left' } },
          zIndex: 1,
          attrs: {
            line: {
              strokeWidth: targetHeight,
              stroke: colors[nodeMap[node.dep].depth],
              targetMarker: '',
            },
          },
        })
      }
    })

    this.graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
`,"src/curve.ts":`import { Graph, Path } from '@antv/x6'

Graph.registerConnector('curve', (sourcePoint, targetPoint) => {
  const path = new Path()
  path.appendSegment(Path.createSegment('M', sourcePoint))
  path.appendSegment(
    Path.createSegment(
      'C',
      sourcePoint.x + 180,
      sourcePoint.y,
      targetPoint.x - 180,
      targetPoint.y,
      targetPoint.x,
      targetPoint.y,
    ),
  )
  return path.serialize()
})
`,"src/index.css":`body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,"src/index.tsx":`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,"src/layout.ts":`import { sankey } from 'd3-sankey'

interface DataItem {
  name: string
  count: number
  id: string
  dep?: string
}

const data: DataItem[] = [
  { name: '4S\u5E97', count: 131, id: '0' },
  { name: '\u670D\u52A1\u90E8', count: 66, id: '1', dep: '0' },
  { name: '\u9500\u552E\u90E8', count: 35, id: '2', dep: '0' },
  { name: '\u7BA1\u7406\u56E2\u961F', count: 8, id: '3', dep: '0' },
  { name: '\u884C\u653F\u4EBA\u4E8B\u90E8', count: 4, id: '4', dep: '0' },
  { name: '\u8D22\u52A1\u90E8', count: 8, id: '5', dep: '0' },
  { name: '\u5BA2\u670D\u90E8', count: 7, id: '6', dep: '0' },
  { name: '\u5E02\u573A\u4F01\u5212\u90E8', count: 3, id: '7', dep: '0' },

  // \u670D\u52A1\u90E8
  { name: '\u8F66\u95F4\u884C\u653F\u7BA1\u7406', count: 9, id: '8', dep: '1' },
  { name: '\u63A5\u5F85\u670D\u52A1', count: 11, id: '9', dep: '1' },
  { name: '\u4FDD\u9669\u670D\u52A1', count: 7, id: '10', dep: '1' },
  { name: '\u5907\u4EF6\u7BA1\u7406', count: 7, id: '11', dep: '1' },
  { name: '\u673A\u4FEE\u8F66\u95F4', count: 14, id: '12', dep: '1' },
  { name: '\u94A3\u55B7\u8F66\u95F4', count: 18, id: '13', dep: '1' },

  { name: '\u94A3\u55B7\u8F66\u95F41', count: 2, id: '24', dep: '13' },
  { name: '\u94A3\u55B7\u8F66\u95F42', count: 6, id: '25', dep: '13' },
  { name: '\u94A3\u55B7\u8F66\u95F43', count: 10, id: '26', dep: '13' },

  // \u9500\u552E\u90E8
  { name: '\u5C55\u5385', count: 17, id: '14', dep: '2' },
  { name: 'DCC', count: 3, id: '15', dep: '2' },
  { name: '\u533A\u57DF', count: 2, id: '16', dep: '2' },
  { name: '\u7CBE\u54C1\u9500\u552E', count: 4, id: '17', dep: '2' },
  { name: '\u4E8C\u624B\u8F66', count: 2, id: '18', dep: '2' },
  { name: '\u7269\u6D41\u4E2D\u5FC3', count: 3, id: '19', dep: '2' },
  { name: '\u8D27\u6B3E', count: 1, id: '20', dep: '2' },
  { name: '\u9500\u552E\u652F\u6301', count: 3, id: '21', dep: '2' },
]

export function layout() {
  const nodes: any[] = []
  const links: any[] = []
  data.forEach((d) => {
    nodes.push({ ...d })
    if (d.dep) {
      links.push({ source: d.dep, target: d.id, value: d.count })
    }
  })

  // @see https://github.com/d3/d3-sankey
  const execute = sankey()
    .nodeWidth(20)
    .nodePadding(12)
    .size([980, 760])
    .nodeId((d: any) => d.id)
    .nodeSort(() => {
      return 0
    })
    .iterations(32)

  return execute({ nodes, links })
}
`,"tsconfig.json":`{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strictPropertyInitialization": false,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "jsx": "react",
    "target": "es5",
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "include": [
    "src"
  ]
}
`}}}},96:function(h,u,e){},98:function(h,u,e){"use strict";e.r(u);var E=e(0),n=e.n(E),x=e(22),N=e.n(x),b=e(1),C=e(2),A=e(3),O=e(4),f=e(34),U=e(58),k=e(76),P=[{name:"4S\u5E97",count:131,id:"0"},{name:"\u670D\u52A1\u90E8",count:66,id:"1",dep:"0"},{name:"\u9500\u552E\u90E8",count:35,id:"2",dep:"0"},{name:"\u7BA1\u7406\u56E2\u961F",count:8,id:"3",dep:"0"},{name:"\u884C\u653F\u4EBA\u4E8B\u90E8",count:4,id:"4",dep:"0"},{name:"\u8D22\u52A1\u90E8",count:8,id:"5",dep:"0"},{name:"\u5BA2\u670D\u90E8",count:7,id:"6",dep:"0"},{name:"\u5E02\u573A\u4F01\u5212\u90E8",count:3,id:"7",dep:"0"},{name:"\u8F66\u95F4\u884C\u653F\u7BA1\u7406",count:9,id:"8",dep:"1"},{name:"\u63A5\u5F85\u670D\u52A1",count:11,id:"9",dep:"1"},{name:"\u4FDD\u9669\u670D\u52A1",count:7,id:"10",dep:"1"},{name:"\u5907\u4EF6\u7BA1\u7406",count:7,id:"11",dep:"1"},{name:"\u673A\u4FEE\u8F66\u95F4",count:14,id:"12",dep:"1"},{name:"\u94A3\u55B7\u8F66\u95F4",count:18,id:"13",dep:"1"},{name:"\u94A3\u55B7\u8F66\u95F41",count:2,id:"24",dep:"13"},{name:"\u94A3\u55B7\u8F66\u95F42",count:6,id:"25",dep:"13"},{name:"\u94A3\u55B7\u8F66\u95F43",count:10,id:"26",dep:"13"},{name:"\u5C55\u5385",count:17,id:"14",dep:"2"},{name:"DCC",count:3,id:"15",dep:"2"},{name:"\u533A\u57DF",count:2,id:"16",dep:"2"},{name:"\u7CBE\u54C1\u9500\u552E",count:4,id:"17",dep:"2"},{name:"\u4E8C\u624B\u8F66",count:2,id:"18",dep:"2"},{name:"\u7269\u6D41\u4E2D\u5FC3",count:3,id:"19",dep:"2"},{name:"\u8D27\u6B3E",count:1,id:"20",dep:"2"},{name:"\u9500\u552E\u652F\u6301",count:3,id:"21",dep:"2"}];function R(){var d=[],s=[];P.forEach(function(o){d.push(Object(U.a)({},o)),o.dep&&s.push({source:o.dep,target:o.id,value:o.count})});var t=Object(k.a)().nodeWidth(20).nodePadding(12).size([980,760]).nodeId(function(o){return o.id}).nodeSort(function(){return 0}).iterations(32);return t({nodes:d,links:s})}f.a.registerConnector("curve",function(d,s){var t=new f.b;return t.appendSegment(f.b.createSegment("M",d)),t.appendSegment(f.b.createSegment("C",d.x+180,d.y,s.x-180,s.y,s.x,s.y)),t.serialize()});var Z=e(86),X=function(d){Object(A.a)(t,d);var s=Object(O.a)(t);function t(){var o;Object(b.a)(this,t);for(var a=arguments.length,l=new Array(a),r=0;r<a;r++)l[r]=arguments[r];return o=s.call.apply(s,[this].concat(l)),o.container=void 0,o.graph=void 0,o.refContainer=function(c){o.container=c},o}return Object(C.a)(t,[{key:"componentDidMount",value:function(){var a=this;this.graph=new f.a({container:this.container,grid:!0,scroller:{enabled:!0},connecting:{connectionPoint:"anchor",connector:"curve"}});var l=R(),r=l.nodes,c={},p=["rgba(16, 142, 233, 0.6)","rgba(255, 85, 0, 0.5)","rgba(135, 208, 104, 0.5)"];r.forEach(function(i){c[i.id]=i;var m=i.x0,M=i.x1,g=i.y0,y=i.y1;a.graph.addNode({x:m,y:g,width:M-m,height:y-g,id:i.id,zIndex:10,attrs:{label:{text:i.name,textAnchor:"start",textVerticalAnchor:"middle",refX:"100%",refX2:8,fontSize:12}}})}),r.forEach(function(i){if(i.dep){for(var m=c[i.dep],M=m.y1-m.y0,g=i.y1-i.y0,y=0,w=0,W=m.sourceLinks.length;w<W;w+=1){var Y=m.sourceLinks[w],L=Y.target;if(L.id===i.id){y+=g/2;break}else y+=L.y1-L.y0}a.graph.addEdge({source:{cell:i.dep,anchor:{name:"right",args:{dy:y-M/2}},magnet:"rect"},target:{cell:i.id,anchor:{name:"left"}},zIndex:1,attrs:{line:{strokeWidth:g,stroke:p[c[i.dep].depth],targetMarker:""}}})}}),this.graph.centerContent()}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(n.a.Component),T=e(107),j=e(103),I=e(108),z=e(109),v=e(106),K=e(87),V=e(59),Q=e(90),S=e(91),H=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},B=function(d){Object(A.a)(t,d);var s=Object(O.a)(t);function t(){return Object(b.a)(this,t),s.apply(this,arguments)}return Object(C.a)(t,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(T.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(j.a,{component:H}))),n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(S.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(I.a,null))),n.a.createElement(v.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(V.getParameters)(S.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(z.a,null)))))}}]),t}(n.a.Component),G=e(104),F=e(73),$=e(96),D=function(d){Object(A.a)(t,d);var s=Object(O.a)(t);function t(o){var a;return Object(b.a)(this,t),a=s.call(this,o),a.refContainer=function(l){a.container=l},t.restoreIframeSize(),a}return Object(C.a)(t,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){a.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var l=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(l+16,"px"),a.style.border="0",a.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(B,null),this.props.children)}}]),t}(n.a.Component);(function(d){var s=window.location.pathname,t="x6-iframe-size";function o(){var r=localStorage.getItem(t),c;if(r)try{c=JSON.parse(r)}catch(p){}else c={};return c}function a(){var r=window.frameElement;if(r){var c=r.style,p={width:c.width,height:c.height},i=o();i[s]=p,localStorage.setItem(t,JSON.stringify(i))}}d.saveIframeSize=a;function l(){var r=window.frameElement;if(r){var c=o(),p=c[s];p&&(r.style.width=p.width||"100%",r.style.height=p.height||"auto")}}d.restoreIframeSize=l})(D||(D={}));var q=e(97),J=function(s){var t=s.children;return n.a.createElement(G.a.ErrorBoundary,null,n.a.createElement(F.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(D,null,t))};N.a.render(n.a.createElement(J,null,n.a.createElement(X,null)),document.getElementById("root"))}},[[80,1,2]]]);
