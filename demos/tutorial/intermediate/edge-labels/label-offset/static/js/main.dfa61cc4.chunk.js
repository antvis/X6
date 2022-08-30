(this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.edge-labels.label-offset"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.intermediate.edge-labels.label-offset"]||[]).push([[0],{70:function(g,d,t){g.exports=t(88)},76:function(g,d,t){},80:function(g,d,t){},81:function(g,d,t){"use strict";t.r(d),t.d(d,"host",function(){return x}),t.d(d,"getCodeSandboxParams",function(){return n}),t.d(d,"getStackblitzPrefillConfig",function(){return v});const x="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/intermediate/edge-labels/label-offset";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 240px;
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
      source: { x: 30, y: 80 },
      target: { x: 430, y: 80 },
      vertices: [{ x: 230, y: 160 }],
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
      offsetLabelAbsoluteConnector: {
        atConnectionRatioIgnoreGradient: 0.66,
        d: 'M 0 0 -40 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: 40',
        },
      },
      position: {
        distance: 0.66,
        offset: 40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: -40',
        },
      },
      position: {
        distance: 0.66,
        offset: -40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: { x: -40, y: 80 }',
        },
      },
      position: {
        distance: 0.66,
        offset: {
          x: -40,
          y: 80,
        },
      },
    })

    let currentTransitions = 0
    let oscillateToggle = false

    function contract() {
      edge.transition(
        'source',
        { x: 130, y: 80 },
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
        { x: 330, y: 80 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition('labels/0/position/offset', 80, {
        delay: 1000,
        duration: 4000,
        timing: (time) => {
          return time <= 0.5 ? 2 * time : 2 * (1 - time)
        },
        interp: Interp.number,
      })

      edge.transition('labels/1/position/offset', -80, {
        delay: 1000,
        duration: 4000,
        timing: (time) => {
          return time <= 0.5 ? 2 * time : 2 * (1 - time)
        },
        interp: Interp.number,
      })

      oscillateToggle = true
    }

    function oscillate() {
      edge.transition(
        'source',
        { x: 30, y: 160 },
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
        { x: 230, y: 80 },
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
        { x: 430, y: 160 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition('labels/0/position/offset', 80, {
        delay: 1000,
        duration: 4000,
        timing: (time) => {
          return time <= 0.5 ? 2 * time : 2 * (1 - time)
        },
        interp: Interp.number,
      })

      edge.transition('labels/1/position/offset', -80, {
        delay: 1000,
        duration: 4000,
        timing: (time) => {
          return time <= 0.5 ? 2 * time : 2 * (1 - time)
        },
        interp: Interp.number,
      })

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
`,isBinary:!1}}}}function v(){return{title:"tutorial/intermediate/edge-labels/label-offset",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 240px;
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
      source: { x: 30, y: 80 },
      target: { x: 430, y: 80 },
      vertices: [{ x: 230, y: 160 }],
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
      offsetLabelAbsoluteConnector: {
        atConnectionRatioIgnoreGradient: 0.66,
        d: 'M 0 0 -40 80',
        stroke: 'black',
        strokeDasharray: '5 5',
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: 40',
        },
      },
      position: {
        distance: 0.66,
        offset: 40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: -40',
        },
      },
      position: {
        distance: 0.66,
        offset: -40,
      },
    })

    edge.appendLabel({
      attrs: {
        text: {
          text: 'offset: { x: -40, y: 80 }',
        },
      },
      position: {
        distance: 0.66,
        offset: {
          x: -40,
          y: 80,
        },
      },
    })

    let currentTransitions = 0
    let oscillateToggle = false

    function contract() {
      edge.transition(
        'source',
        { x: 130, y: 80 },
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
        { x: 330, y: 80 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition('labels/0/position/offset', 80, {
        delay: 1000,
        duration: 4000,
        timing: (time) => {
          return time <= 0.5 ? 2 * time : 2 * (1 - time)
        },
        interp: Interp.number,
      })

      edge.transition('labels/1/position/offset', -80, {
        delay: 1000,
        duration: 4000,
        timing: (time) => {
          return time <= 0.5 ? 2 * time : 2 * (1 - time)
        },
        interp: Interp.number,
      })

      oscillateToggle = true
    }

    function oscillate() {
      edge.transition(
        'source',
        { x: 30, y: 160 },
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
        { x: 230, y: 80 },
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
        { x: 430, y: 160 },
        {
          delay: 1000,
          duration: 4000,
          timing: (time) => {
            return time <= 0.5 ? 2 * time : 2 * (1 - time)
          },
          interp: Interp.object,
        },
      )

      edge.transition('labels/0/position/offset', 80, {
        delay: 1000,
        duration: 4000,
        timing: (time) => {
          return time <= 0.5 ? 2 * time : 2 * (1 - time)
        },
        interp: Interp.number,
      })

      edge.transition('labels/1/position/offset', -80, {
        delay: 1000,
        duration: 4000,
        timing: (time) => {
          return time <= 0.5 ? 2 * time : 2 * (1 - time)
        },
        interp: Interp.number,
      })

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
`}}}},86:function(g,d,t){},88:function(g,d,t){"use strict";t.r(d);var x=t(0),n=t.n(x),v=t(20),N=t.n(v),y=t(1),E=t(2),C=t(3),L=t(4),m=t(23),V=t(76),O=function(u){Object(C.a)(r,u);var c=Object(L.a)(r);function r(){var s;Object(y.a)(this,r);for(var i=arguments.length,o=new Array(i),a=0;a<i;a++)o[a]=arguments[a];return s=c.call.apply(c,[this].concat(o)),s.container=void 0,s.refContainer=function(l){s.container=l},s}return Object(E.a)(r,[{key:"componentDidMount",value:function(){var i=new m.a({container:this.container,grid:!0,background:{color:"rgba(0, 255, 0, 0.3)"}}),o=i.addEdge({markup:[{tagName:"path",selector:"line"},{tagName:"path",selector:"offsetLabelPositiveConnector"},{tagName:"path",selector:"offsetLabelNegativeConnector"},{tagName:"path",selector:"offsetLabelAbsoluteConnector"},{tagName:"text",selector:"offsetLabelMarker"}],source:{x:30,y:80},target:{x:430,y:80},vertices:[{x:230,y:160}]});o.attr({line:{connection:!0,fill:"none",stroke:"#333",strokeWidth:2},offsetLabelMarker:{atConnectionRatio:.66,textAnchor:"middle",textVerticalAnchor:"middle",text:"\uFF0A",fill:"red",stroke:"black",strokeWidth:1,fontSize:32,fontWeight:"bold"},offsetLabelPositiveConnector:{atConnectionRatio:.66,d:"M 0 0 0 80",stroke:"black",strokeDasharray:"5 5"},offsetLabelNegativeConnector:{atConnectionRatio:.66,d:"M 0 0 0 -80",stroke:"black",strokeDasharray:"5 5"},offsetLabelAbsoluteConnector:{atConnectionRatioIgnoreGradient:.66,d:"M 0 0 -40 80",stroke:"black",strokeDasharray:"5 5"}}),o.appendLabel({attrs:{text:{text:"offset: 40"}},position:{distance:.66,offset:40}}),o.appendLabel({attrs:{text:{text:"offset: -40"}},position:{distance:.66,offset:-40}}),o.appendLabel({attrs:{text:{text:"offset: { x: -40, y: 80 }"}},position:{distance:.66,offset:{x:-40,y:80}}});var a=0,l=!1;function p(){o.transition("source",{x:130,y:80},{delay:1e3,duration:4e3,timing:function(e){return e<=.5?2*e:2*(1-e)},interp:m.b.object}),o.transition("target",{x:330,y:80},{delay:1e3,duration:4e3,timing:function(e){return e<=.5?2*e:2*(1-e)},interp:m.b.object}),o.transition("labels/0/position/offset",80,{delay:1e3,duration:4e3,timing:function(e){return e<=.5?2*e:2*(1-e)},interp:m.b.number}),o.transition("labels/1/position/offset",-80,{delay:1e3,duration:4e3,timing:function(e){return e<=.5?2*e:2*(1-e)},interp:m.b.number}),l=!0}function h(){o.transition("source",{x:30,y:160},{delay:1e3,duration:4e3,timing:function(e){return e<=.5?2*e:2*(1-e)},interp:m.b.object}),o.transition("vertices/0",{x:230,y:80},{delay:1e3,duration:4e3,timing:function(e){return e<=.5?2*e:2*(1-e)},interp:m.b.object}),o.transition("target",{x:430,y:160},{delay:1e3,duration:4e3,timing:function(e){return e<=.5?2*e:2*(1-e)},interp:m.b.object}),o.transition("labels/0/position/offset",80,{delay:1e3,duration:4e3,timing:function(e){return e<=.5?2*e:2*(1-e)},interp:m.b.number}),o.transition("labels/1/position/offset",-80,{delay:1e3,duration:4e3,timing:function(e){return e<=.5?2*e:2*(1-e)},interp:m.b.number}),l=!1}o.on("transition:start",function(){a+=1}),o.on("transition:complete",function(){a-=1,a===0&&(l?h():p())}),p()}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),r}(n.a.Component),M=t(95),k=t(91),w=t(96),I=t(97),b=t(94),z=t(77),R=t(51),P=t(80),D=t(81),T=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},U=function(u){Object(C.a)(r,u);var c=Object(L.a)(r);function r(){return Object(y.a)(this,r),c.apply(this,arguments)}return Object(E.a)(r,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(M.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(k.a,{component:T}))),n.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(D.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(w.a,null))),n.a.createElement(b.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(R.getParameters)(D.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(I.a,null)))))}}]),r}(n.a.Component),j=t(92),S=t(65),B=t(86),A=function(u){Object(C.a)(r,u);var c=Object(L.a)(r);function r(s){var i;return Object(y.a)(this,r),i=c.call(this,s),i.refContainer=function(o){i.container=o},r.restoreIframeSize(),i}return Object(E.a)(r,[{key:"componentDidMount",value:function(){var i=this;if(this.updateIframeSize(),window.ResizeObserver){var o=new window.ResizeObserver(function(){i.updateIframeSize()});o.observe(this.container)}else window.addEventListener("resize",function(){return i.updateIframeSize()});setTimeout(function(){var a=document.getElementById("loading");a&&a.parentNode&&a.parentNode.removeChild(a)},1e3)}},{key:"updateIframeSize",value:function(){var i=window.frameElement;if(i){var o=this.container.scrollHeight||this.container.clientHeight;i.style.width="100%",i.style.height="".concat(o+16,"px"),i.style.border="0",i.style.overflow="hidden",r.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(U,null),this.props.children)}}]),r}(n.a.Component);(function(u){var c=window.location.pathname,r="x6-iframe-size";function s(){var a=localStorage.getItem(r),l;if(a)try{l=JSON.parse(a)}catch(p){}else l={};return l}function i(){var a=window.frameElement;if(a){var l=a.style,p={width:l.width,height:l.height},h=s();h[c]=p,localStorage.setItem(r,JSON.stringify(h))}}u.saveIframeSize=i;function o(){var a=window.frameElement;if(a){var l=s(),p=l[c];p&&(a.style.width=p.width||"100%",a.style.height=p.height||"auto")}}u.restoreIframeSize=o})(A||(A={}));var H=t(87),X=function(c){var r=c.children;return n.a.createElement(j.a.ErrorBoundary,null,n.a.createElement(S.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(A,null,r))};N.a.render(n.a.createElement(X,null,n.a.createElement(O,null)),document.getElementById("root"))}},[[70,1,2]]]);
