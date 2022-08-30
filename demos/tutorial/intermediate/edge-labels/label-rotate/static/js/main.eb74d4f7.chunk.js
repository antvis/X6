(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.edge-labels.label-rotate"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.edge-labels.label-rotate"]||[]).push([[0],{70:function(m,d,e){m.exports=e(88)},76:function(m,d,e){},80:function(m,d,e){},81:function(m,d,e){"use strict";e.r(d),e.d(d,"host",function(){return b}),e.d(d,"getCodeSandboxParams",function(){return n}),e.d(d,"getStackblitzPrefillConfig",function(){return v});const b="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/edge-labels/label-rotate";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 320px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Interp } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      background: {
        color: 'rgba(0, 255, 0, 0.3)',
      },
    })

    const edge = graph.addEdge({
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
      ],
      source: { x: 30, y: 120 },
      target: { x: 430, y: 120 },
      vertices: [{ x: 230, y: 200 }],
    })

    edge.attr({
      line: {
        connection: true,
        fill: 'none',
        stroke: '#333',
        strokeWidth: 2,
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
        d: 'M 0 0 0 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '70\xB0\\nkeepGradient',
        },
      },
      position: {
        distance: 0.05,
        angle: 70,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '0\xB0\\nkeepGradient',
        },
      },
      position: {
        distance: 0.3,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '45\xB0',
        },
      },
      position: {
        distance: 0.8,
        angle: 45,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '135\xB0',
        },
      },
      position: {
        distance: 0.9,
        angle: 135,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270\xB0\\nkeepGradient',
        },
      },
      position: {
        distance: 0.66,
        offset: 80,
        angle: 270,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270\xB0\\nkeepGradient\\nensureLegibility',
        },
      },
      position: {
        distance: 0.66,
        offset: -80,
        angle: 270,
        options: {
          keepGradient: true,
          ensureLegibility: true,
        },
      },
    })

    let currentTransitions = 0
    let oscillateToggle = false

    function contract() {
      edge.transition(
        'source',
        { x: 130, y: 120 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 330, y: 120 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
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
        { x: 30, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'vertices/0',
        { x: 230, y: 120 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 430, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = false
    }

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

    contract()
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
`,isBinary:!1}}}}function v(){return{title:"tutorial/intermediate/edge-labels/label-rotate",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 320px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { Graph, Interp } from '@antv/x6'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      background: {
        color: 'rgba(0, 255, 0, 0.3)',
      },
    })

    const edge = graph.addEdge({
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
      ],
      source: { x: 30, y: 120 },
      target: { x: 430, y: 120 },
      vertices: [{ x: 230, y: 200 }],
    })

    edge.attr({
      line: {
        connection: true,
        fill: 'none',
        stroke: '#333',
        strokeWidth: 2,
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
        d: 'M 0 0 0 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
      offsetLabelNegativeConnector: {
        atConnectionRatio: 0.66,
        d: 'M 0 0 0 -80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: '70\xB0\\nkeepGradient',
        },
      },
      position: {
        distance: 0.05,
        angle: 70,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '0\xB0\\nkeepGradient',
        },
      },
      position: {
        distance: 0.3,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '45\xB0',
        },
      },
      position: {
        distance: 0.8,
        angle: 45,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '135\xB0',
        },
      },
      position: {
        distance: 0.9,
        angle: 135,
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270\xB0\\nkeepGradient',
        },
      },
      position: {
        distance: 0.66,
        offset: 80,
        angle: 270,
        options: {
          keepGradient: true,
        },
      },
    })
    edge.appendLabel({
      attrs: {
        text: {
          text: '270\xB0\\nkeepGradient\\nensureLegibility',
        },
      },
      position: {
        distance: 0.66,
        offset: -80,
        angle: 270,
        options: {
          keepGradient: true,
          ensureLegibility: true,
        },
      },
    })

    let currentTransitions = 0
    let oscillateToggle = false

    function contract() {
      edge.transition(
        'source',
        { x: 130, y: 120 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 330, y: 120 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
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
        { x: 30, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'vertices/0',
        { x: 230, y: 120 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition(
        'target',
        { x: 430, y: 200 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      oscillateToggle = false
    }

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

    contract()
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
`}}}},86:function(m,d,e){},88:function(m,d,e){"use strict";e.r(d);var b=e(0),n=e.n(b),v=e(20),N=e.n(v),E=e(1),y=e(2),L=e(3),C=e(4),f=e(32),G=e(76),O=function(p){Object(L.a)(a,p);var c=Object(C.a)(a);function a(){var s;Object(E.a)(this,a);for(var r=arguments.length,t=new Array(r),o=0;o<r;o++)t[o]=arguments[o];return s=c.call.apply(c,[this].concat(t)),s.container=void 0,s.refContainer=function(l){s.container=l},s}return Object(y.a)(a,[{key:"componentDidMount",value:function(){var r=new f.a({container:this.container,grid:!0,background:{color:"rgba(0, 255, 0, 0.3)"}}),t=r.addEdge({markup:[{tagName:"path",selector:"line"},{tagName:"path",selector:"offsetLabelPositiveConnector"},{tagName:"path",selector:"offsetLabelNegativeConnector"},{tagName:"path",selector:"offsetLabelAbsoluteConnector"},{tagName:"text",selector:"offsetLabelMarker"}],source:{x:30,y:120},target:{x:430,y:120},vertices:[{x:230,y:200}]});t.attr({line:{connection:!0,fill:"none",stroke:"#333",strokeWidth:2},offsetLabelMarker:{atConnectionRatio:.66,textAnchor:"middle",textVerticalAnchor:"middle",text:"\uFF0A",fill:"red",stroke:"black",strokeWidth:1,fontSize:32,fontWeight:"bold"},offsetLabelPositiveConnector:{atConnectionRatio:.66,d:"M 0 0 0 80",stroke:"black",strokeDasharray:"5 5"},offsetLabelNegativeConnector:{atConnectionRatio:.66,d:"M 0 0 0 -80",stroke:"black",strokeDasharray:"5 5"}}),t.appendLabel({attrs:{text:{text:`70\xB0
keepGradient`}},position:{distance:.05,angle:70,options:{keepGradient:!0}}}),t.appendLabel({attrs:{text:{text:`0\xB0
keepGradient`}},position:{distance:.3,options:{keepGradient:!0}}}),t.appendLabel({attrs:{text:{text:"45\xB0"}},position:{distance:.8,angle:45}}),t.appendLabel({attrs:{text:{text:"135\xB0"}},position:{distance:.9,angle:135}}),t.appendLabel({attrs:{text:{text:`270\xB0
keepGradient`}},position:{distance:.66,offset:80,angle:270,options:{keepGradient:!0}}}),t.appendLabel({attrs:{text:{text:`270\xB0
keepGradient
ensureLegibility`}},position:{distance:.66,offset:-80,angle:270,options:{keepGradient:!0,ensureLegibility:!0}}});var o=0,l=!1;function u(){t.transition("source",{x:130,y:120},{delay:1e3,duration:4e3,timing:function(i){return i<=.5?2*i:2*(1-i)},interp:f.b.object}),t.transition("target",{x:330,y:120},{delay:1e3,duration:4e3,timing:function(i){return i<=.5?2*i:2*(1-i)},interp:f.b.object}),l=!0}function h(){t.transition("source",{x:30,y:200},{delay:1e3,duration:4e3,timing:function(i){return i<=.5?2*i:2*(1-i)},interp:f.b.object}),t.transition("vertices/0",{x:230,y:120},{delay:1e3,duration:4e3,timing:function(i){return i<=.5?2*i:2*(1-i)},interp:f.b.object}),t.transition("target",{x:430,y:200},{delay:1e3,duration:4e3,timing:function(i){return i<=.5?2*i:2*(1-i)},interp:f.b.object}),l=!1}t.on("transition:start",function(){o+=1}),t.on("transition:complete",function(){o-=1,o===0&&(l?h():u())}),u()}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(n.a.Component),D=e(95),M=e(91),w=e(96),T=e(97),g=e(94),V=e(77),U=e(51),z=e(80),A=e(81),R=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},j=function(p){Object(L.a)(a,p);var c=Object(C.a)(a);function a(){return Object(E.a)(this,a),c.apply(this,arguments)}return Object(y.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(M.a,{component:R}))),n.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(A.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(w.a,null))),n.a.createElement(g.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(U.getParameters)(A.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(T.a,null)))))}}]),a}(n.a.Component),S=e(92),I=e(65),P=e(86),k=function(p){Object(L.a)(a,p);var c=Object(C.a)(a);function a(s){var r;return Object(E.a)(this,a),r=c.call(this,s),r.refContainer=function(t){r.container=t},a.restoreIframeSize(),r}return Object(y.a)(a,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var t=new window.ResizeObserver(function(){r.updateIframeSize()});t.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var t=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(t+16,"px"),r.style.border="0",r.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(j,null),this.props.children)}}]),a}(n.a.Component);(function(p){var c=window.location.pathname,a="x6-iframe-size";function s(){var o=localStorage.getItem(a),l;if(o)try{l=JSON.parse(o)}catch(u){}else l={};return l}function r(){var o=window.frameElement;if(o){var l=o.style,u={width:l.width,height:l.height},h=s();h[c]=u,localStorage.setItem(a,JSON.stringify(h))}}p.saveIframeSize=r;function t(){var o=window.frameElement;if(o){var l=s(),u=l[c];u&&(o.style.width=u.width||"100%",o.style.height=u.height||"auto")}}p.restoreIframeSize=t})(k||(k={}));var B=e(87),X=function(c){var a=c.children;return n.a.createElement(S.a.ErrorBoundary,null,n.a.createElement(I.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(k,null,a))};N.a.render(n.a.createElement(X,null,n.a.createElement(O,null)),document.getElementById("root"))}},[[70,1,2]]]);
