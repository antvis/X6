(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.attrs.edge-subelement-labels"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.attrs.edge-subelement-labels"]||[]).push([[0],{70:function(p,d,n){p.exports=n(88)},76:function(p,d,n){},80:function(p,d,n){},81:function(p,d,n){"use strict";n.r(d),n.d(d,"host",function(){return v}),n.d(d,"getCodeSandboxParams",function(){return e}),n.d(d,"getStackblitzPrefillConfig",function(){return x});const v="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/attrs/edge-subelement-labels";function e(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1"
  },
  "devDependencies": {
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
}

.app-content {
  flex: 1;
  height: 280px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Interp } from '@antv/x6'
import './app.css'

Graph.registerEdge(
  'custom-edge',
  {
    markup: [
      {
        tagName: 'path',
        selector: 'line',
      },
      {
        tagName: 'path',
        selector: 'offsetLabelPositiveConnector',
      },
      {
        tagName: 'path',
        selector: 'offsetLabelNegativeConnector',
      },
      {
        tagName: 'path',
        selector: 'offsetLabelAbsoluteConnector',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelMarker',
      },
      {
        tagName: 'rect',
        selector: 'relativeLabelBody',
      },
      {
        tagName: 'text',
        selector: 'relativeLabel',
      },
      {
        tagName: 'rect',
        selector: 'absoluteLabelBody',
      },
      {
        tagName: 'text',
        selector: 'absoluteLabel',
      },
      {
        tagName: 'rect',
        selector: 'absoluteReverseLabelBody',
      },
      {
        tagName: 'text',
        selector: 'absoluteReverseLabel',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelPositiveBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelPositive',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelNegativeBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelNegative',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelAbsoluteBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelAbsolute',
      },
    ],
    attrs: {
      line: {
        connection: true,
        fill: 'none',
        stroke: '#333333',
        strokeWidth: 2,
        strokeLinejoin: 'round',
        targetMarker: {
          tagName: 'path',
          d: 'M 10 -5 0 0 10 5 z',
        },
      },
      relativeLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      relativeLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      absoluteLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      absoluteLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      absoluteReverseLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      absoluteReverseLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelPositive: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelPositiveBody: {
        width: 120,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelNegative: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelNegativeBody: {
        width: 120,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelAbsolute: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelAbsoluteBody: {
        width: 140,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelMarker: {
        atConnectionRatio: 0.66,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        text: '\uFF0A',
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        fontSize: 32,
        fontWeight: 'bold',
      },
      offsetLabelPositiveConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 40',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -40',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelAbsoluteConnector: {
        atConnectionRatioIgnoreGradient: 0.66,
        d: 'M 0 0 -40 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const edge = graph.addEdge({
      shape: 'custom-edge',
      source: { x: 100, y: 60 },
      target: { x: 500, y: 60 },
      vertices: [{ x: 300, y: 160 }],
      attrs: {
        relativeLabel: {
          atConnectionRatio: 0.25,
          text: '0.25',
        },
        relativeLabelBody: {
          atConnectionRatio: 0.25,
        },
        absoluteLabel: {
          atConnectionLength: 150,
          text: '150',
        },
        absoluteLabelBody: {
          atConnectionLength: 150,
        },
        absoluteReverseLabel: {
          atConnectionLength: -100,
          text: '-100',
        },
        absoluteReverseLabelBody: {
          atConnectionLength: -100,
        },
        offsetLabelPositive: {
          atConnectionRatio: 0.66,
          y: 40,
          text: 'keepGradient: 0,40',
        },
        offsetLabelPositiveBody: {
          atConnectionRatio: 0.66,
          x: -60, // 0 + -60
          y: 30, // 40 + -10
        },
        offsetLabelNegative: {
          atConnectionRatio: 0.66,
          y: -40,
          text: 'keepGradient: 0,-40',
        },
        offsetLabelNegativeBody: {
          atConnectionRatio: 0.66,
          x: -60, // 0 + -60
          y: -50, // -40 + -10
        },
        offsetLabelAbsolute: {
          atConnectionRatioIgnoreGradient: 0.66,
          x: -40,
          y: 80,
          text: 'ignoreGradient: -40,80',
        },
        offsetLabelAbsoluteBody: {
          atConnectionRatioIgnoreGradient: 0.66,
          x: -110, // -40 + -70
          y: 70, // 80 + -10
        },
      },
    })

    let currentTransitions = 0
    let oscillateToggle = false

    function contract() {
      edge.transition(
        'source',
        { x: 200, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 400, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.transition(
        'source',
        { x: 100, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 500, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'vertices/0',
        { x: 300, y: 60 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = false
    }

    contract()

    edge.on('transition:start', () => {
      currentTransitions += 1
    })

    edge.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        if (oscillateToggle) {
          oscillate()
        } else {
          contract()
        }
      }
    })
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

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"tsconfig.json":{content:`{
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
`,isBinary:!1}}}}function x(){return{title:"tutorial/intermediate/attrs/edge-subelement-labels",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6": "latest",
    "antd": "^4.4.2",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-scripts": "^3.4.1"
  },
  "devDependencies": {
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
}

.app-content {
  flex: 1;
  height: 280px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph, Interp } from '@antv/x6'
import './app.css'

Graph.registerEdge(
  'custom-edge',
  {
    markup: [
      {
        tagName: 'path',
        selector: 'line',
      },
      {
        tagName: 'path',
        selector: 'offsetLabelPositiveConnector',
      },
      {
        tagName: 'path',
        selector: 'offsetLabelNegativeConnector',
      },
      {
        tagName: 'path',
        selector: 'offsetLabelAbsoluteConnector',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelMarker',
      },
      {
        tagName: 'rect',
        selector: 'relativeLabelBody',
      },
      {
        tagName: 'text',
        selector: 'relativeLabel',
      },
      {
        tagName: 'rect',
        selector: 'absoluteLabelBody',
      },
      {
        tagName: 'text',
        selector: 'absoluteLabel',
      },
      {
        tagName: 'rect',
        selector: 'absoluteReverseLabelBody',
      },
      {
        tagName: 'text',
        selector: 'absoluteReverseLabel',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelPositiveBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelPositive',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelNegativeBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelNegative',
      },
      {
        tagName: 'rect',
        selector: 'offsetLabelAbsoluteBody',
      },
      {
        tagName: 'text',
        selector: 'offsetLabelAbsolute',
      },
    ],
    attrs: {
      line: {
        connection: true,
        fill: 'none',
        stroke: '#333333',
        strokeWidth: 2,
        strokeLinejoin: 'round',
        targetMarker: {
          tagName: 'path',
          d: 'M 10 -5 0 0 10 5 z',
        },
      },
      relativeLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      relativeLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      absoluteLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      absoluteLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      absoluteReverseLabel: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      absoluteReverseLabelBody: {
        x: -15,
        y: -10,
        width: 30,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelPositive: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelPositiveBody: {
        width: 120,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelNegative: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelNegativeBody: {
        width: 120,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelAbsolute: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: 'black',
        fontSize: 12,
      },
      offsetLabelAbsoluteBody: {
        width: 140,
        height: 20,
        fill: 'white',
        stroke: 'black',
      },
      offsetLabelMarker: {
        atConnectionRatio: 0.66,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        text: '\uFF0A',
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        fontSize: 32,
        fontWeight: 'bold',
      },
      offsetLabelPositiveConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 40',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -40',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelAbsoluteConnector: {
        atConnectionRatioIgnoreGradient: 0.66,
        d: 'M 0 0 -40 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const edge = graph.addEdge({
      shape: 'custom-edge',
      source: { x: 100, y: 60 },
      target: { x: 500, y: 60 },
      vertices: [{ x: 300, y: 160 }],
      attrs: {
        relativeLabel: {
          atConnectionRatio: 0.25,
          text: '0.25',
        },
        relativeLabelBody: {
          atConnectionRatio: 0.25,
        },
        absoluteLabel: {
          atConnectionLength: 150,
          text: '150',
        },
        absoluteLabelBody: {
          atConnectionLength: 150,
        },
        absoluteReverseLabel: {
          atConnectionLength: -100,
          text: '-100',
        },
        absoluteReverseLabelBody: {
          atConnectionLength: -100,
        },
        offsetLabelPositive: {
          atConnectionRatio: 0.66,
          y: 40,
          text: 'keepGradient: 0,40',
        },
        offsetLabelPositiveBody: {
          atConnectionRatio: 0.66,
          x: -60, // 0 + -60
          y: 30, // 40 + -10
        },
        offsetLabelNegative: {
          atConnectionRatio: 0.66,
          y: -40,
          text: 'keepGradient: 0,-40',
        },
        offsetLabelNegativeBody: {
          atConnectionRatio: 0.66,
          x: -60, // 0 + -60
          y: -50, // -40 + -10
        },
        offsetLabelAbsolute: {
          atConnectionRatioIgnoreGradient: 0.66,
          x: -40,
          y: 80,
          text: 'ignoreGradient: -40,80',
        },
        offsetLabelAbsoluteBody: {
          atConnectionRatioIgnoreGradient: 0.66,
          x: -110, // -40 + -70
          y: 70, // 80 + -10
        },
      },
    })

    let currentTransitions = 0
    let oscillateToggle = false

    function contract() {
      edge.transition(
        'source',
        { x: 200, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 400, y: 100 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = true
    }

    function oscillate() {
      edge.transition(
        'source',
        { x: 100, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 500, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'vertices/0',
        { x: 300, y: 60 },
        {
          delay: 1000,
          duration: 4000,
          timing(time) {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = false
    }

    contract()

    edge.on('transition:start', () => {
      currentTransitions += 1
    })

    edge.on('transition:complete', () => {
      currentTransitions -= 1

      if (currentTransitions === 0) {
        if (oscillateToggle) {
          oscillate()
        } else {
          contract()
        }
      }
    })
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

ReactDOM.render(<App />, document.getElementById('root'))`,"tsconfig.json":`{
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
`}}}},86:function(p,d,n){},88:function(p,d,n){"use strict";n.r(d);var v=n(0),e=n.n(v),x=n(20),N=n.n(x),y=n(1),L=n(2),E=n(3),C=n(4),f=n(29),z=n(76);f.a.registerEdge("custom-edge",{markup:[{tagName:"path",selector:"line"},{tagName:"path",selector:"offsetLabelPositiveConnector"},{tagName:"path",selector:"offsetLabelNegativeConnector"},{tagName:"path",selector:"offsetLabelAbsoluteConnector"},{tagName:"text",selector:"offsetLabelMarker"},{tagName:"rect",selector:"relativeLabelBody"},{tagName:"text",selector:"relativeLabel"},{tagName:"rect",selector:"absoluteLabelBody"},{tagName:"text",selector:"absoluteLabel"},{tagName:"rect",selector:"absoluteReverseLabelBody"},{tagName:"text",selector:"absoluteReverseLabel"},{tagName:"rect",selector:"offsetLabelPositiveBody"},{tagName:"text",selector:"offsetLabelPositive"},{tagName:"rect",selector:"offsetLabelNegativeBody"},{tagName:"text",selector:"offsetLabelNegative"},{tagName:"rect",selector:"offsetLabelAbsoluteBody"},{tagName:"text",selector:"offsetLabelAbsolute"}],attrs:{line:{connection:!0,fill:"none",stroke:"#333333",strokeWidth:2,strokeLinejoin:"round",targetMarker:{tagName:"path",d:"M 10 -5 0 0 10 5 z"}},relativeLabel:{textAnchor:"middle",textVerticalAnchor:"middle",fill:"black",fontSize:12},relativeLabelBody:{x:-15,y:-10,width:30,height:20,fill:"white",stroke:"black"},absoluteLabel:{textAnchor:"middle",textVerticalAnchor:"middle",fill:"black",fontSize:12},absoluteLabelBody:{x:-15,y:-10,width:30,height:20,fill:"white",stroke:"black"},absoluteReverseLabel:{textAnchor:"middle",textVerticalAnchor:"middle",fill:"black",fontSize:12},absoluteReverseLabelBody:{x:-15,y:-10,width:30,height:20,fill:"white",stroke:"black"},offsetLabelPositive:{textAnchor:"middle",textVerticalAnchor:"middle",fill:"black",fontSize:12},offsetLabelPositiveBody:{width:120,height:20,fill:"white",stroke:"black"},offsetLabelNegative:{textAnchor:"middle",textVerticalAnchor:"middle",fill:"black",fontSize:12},offsetLabelNegativeBody:{width:120,height:20,fill:"white",stroke:"black"},offsetLabelAbsolute:{textAnchor:"middle",textVerticalAnchor:"middle",fill:"black",fontSize:12},offsetLabelAbsoluteBody:{width:140,height:20,fill:"white",stroke:"black"},offsetLabelMarker:{atConnectionRatio:.66,textAnchor:"middle",textVerticalAnchor:"middle",text:"\uFF0A",fill:"red",stroke:"black",strokeWidth:1,fontSize:32,fontWeight:"bold"},offsetLabelPositiveConnector:{atConnectionRatio:.66,d:"M 0 0 0 40",stroke:"black",strokeDasharray:"5 5"},offsetLabelNegativeConnector:{atConnectionRatio:.66,d:"M 0 0 0 -40",stroke:"black",strokeDasharray:"5 5"},offsetLabelAbsoluteConnector:{atConnectionRatioIgnoreGradient:.66,d:"M 0 0 -40 80",stroke:"black",strokeDasharray:"5 5"}}},!0);var R=function(m){Object(E.a)(t,m);var c=Object(C.a)(t);function t(){var l;Object(y.a)(this,t);for(var a=arguments.length,i=new Array(a),o=0;o<a;o++)i[o]=arguments[o];return l=c.call.apply(c,[this].concat(i)),l.container=void 0,l.refContainer=function(s){l.container=s},l}return Object(L.a)(t,[{key:"componentDidMount",value:function(){var a=new f.a({container:this.container,grid:!0,interacting:!1}),i=a.addEdge({shape:"custom-edge",source:{x:100,y:60},target:{x:500,y:60},vertices:[{x:300,y:160}],attrs:{relativeLabel:{atConnectionRatio:.25,text:"0.25"},relativeLabelBody:{atConnectionRatio:.25},absoluteLabel:{atConnectionLength:150,text:"150"},absoluteLabelBody:{atConnectionLength:150},absoluteReverseLabel:{atConnectionLength:-100,text:"-100"},absoluteReverseLabelBody:{atConnectionLength:-100},offsetLabelPositive:{atConnectionRatio:.66,y:40,text:"keepGradient: 0,40"},offsetLabelPositiveBody:{atConnectionRatio:.66,x:-60,y:30},offsetLabelNegative:{atConnectionRatio:.66,y:-40,text:"keepGradient: 0,-40"},offsetLabelNegativeBody:{atConnectionRatio:.66,x:-60,y:-50},offsetLabelAbsolute:{atConnectionRatioIgnoreGradient:.66,x:-40,y:80,text:"ignoreGradient: -40,80"},offsetLabelAbsoluteBody:{atConnectionRatioIgnoreGradient:.66,x:-110,y:70}}}),o=0,s=!1;function u(){i.transition("source",{x:200,y:100},{delay:1e3,duration:4e3,timing:function(r){return r<=.5?2*r:2*(1-r)},interp:f.b.object}),i.transition("target",{x:400,y:100},{delay:1e3,duration:4e3,timing:function(r){return r<=.5?2*r:2*(1-r)},interp:f.b.object}),s=!0}function g(){i.transition("source",{x:100,y:200},{delay:1e3,duration:4e3,timing:function(r){return r<=.5?2*r:2*(1-r)},interp:f.b.object}),i.transition("target",{x:500,y:200},{delay:1e3,duration:4e3,timing:function(r){return r<=.5?2*r:2*(1-r)},interp:f.b.object}),i.transition("vertices/0",{x:300,y:60},{delay:1e3,duration:4e3,timing:function(r){return r<=.5?2*r:2*(1-r)},interp:f.b.object}),s=!1}u(),i.on("transition:start",function(){o+=1}),i.on("transition:complete",function(){o-=1,o===0&&(s?g():u())})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component),w=n(95),M=n(91),D=n(96),O=n(97),b=n(94),V=n(77),B=n(51),P=n(80),k=n(81),S=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},T=function(m){Object(E.a)(t,m);var c=Object(C.a)(t);function t(){return Object(y.a)(this,t),c.apply(this,arguments)}return Object(L.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(w.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,{component:S}))),e.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(k.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(D.a,null))),e.a.createElement(b.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(B.getParameters)(k.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(O.a,null)))))}}]),t}(e.a.Component),U=n(92),j=n(65),X=n(86),A=function(m){Object(E.a)(t,m);var c=Object(C.a)(t);function t(l){var a;return Object(y.a)(this,t),a=c.call(this,l),a.refContainer=function(i){a.container=i},t.restoreIframeSize(),a}return Object(L.a)(t,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){a.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var i=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(i+16,"px"),a.style.border="0",a.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(T,null),this.props.children)}}]),t}(e.a.Component);(function(m){var c=window.location.pathname,t="x6-iframe-size";function l(){var o=localStorage.getItem(t),s;if(o)try{s=JSON.parse(o)}catch(u){}else s={};return s}function a(){var o=window.frameElement;if(o){var s=o.style,u={width:s.width,height:s.height},g=l();g[c]=u,localStorage.setItem(t,JSON.stringify(g))}}m.saveIframeSize=a;function i(){var o=window.frameElement;if(o){var s=l(),u=s[c];u&&(o.style.width=u.width||"100%",o.style.height=u.height||"auto")}}m.restoreIframeSize=i})(A||(A={}));var G=n(87),I=function(c){var t=c.children;return e.a.createElement(U.a.ErrorBoundary,null,e.a.createElement(j.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(A,null,t))};N.a.render(e.a.createElement(I,null,e.a.createElement(R,null)),document.getElementById("root"))}},[[70,1,2]]]);
