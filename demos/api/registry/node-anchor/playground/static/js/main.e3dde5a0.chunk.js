(this["webpackJsonp@antv/x6-sites-demos-api.registry.node-anchor.playground"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.node-anchor.playground"]||[]).push([[0],{101:function(m,u,n){},102:function(m,u,n){"use strict";n.r(u),n.d(u,"host",function(){return M}),n.d(u,"getCodeSandboxParams",function(){return e}),n.d(u,"getStackblitzPrefillConfig",function(){return w});const M="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/node-anchor/playground";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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

.app-side {
  width: 336px;
  bottom: 0;
  padding: 0 8px;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.ant-card-head-title {
  text-align: center;
}

.ant-row {
  margin: 16px 0;
  text-align: left;
}

.ant-radio-wrapper {
  width: 120px;
}

.slider-value {
  background: #eee;
  color: #333333;
  padding: 3px 7px;
  border-radius: 10px;
  display: inline-block;
  font-size: 12px;
  margin-left: 8px;
  line-height: 1.25;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const rect1 = graph.addNode({
      x: 160,
      y: 80,
      width: 100,
      height: 40,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
      },
    })

    const rect2 = graph.addNode({
      x: 460,
      y: 80,
      width: 100,
      height: 40,
      markup: [
        { tagName: 'rect', selector: 'body' },
        { tagName: 'rect', selector: 'port' },
      ],
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
        port: {
          x: 10,
          y: 10,
          width: 30,
          height: 10,
          strokeWidth: 1,
          stroke: '#fe8550',
        },
      },
    })

    const edge1 = graph.addEdge({
      source: { x: 100, y: 100 },
      target: { cell: rect1.id },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    const edge2 = graph.addEdge({
      source: { x: 320, y: 100 },
      target: { cell: rect2, selector: 'port' },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      edge1.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 210, y: 100 }
          const radius = 140
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })

      edge2.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 485, y: 95 }
          const radius = 120
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })
    }

    animate()

    edge1.on('transition:complete', animate)

    this.edge1 = edge1
    this.edge2 = edge2
  }

  onAttrsChanged = ({ type }: State) => {
    this.edge1.prop('target/anchor', { name: type })
    this.edge2.prop('target/anchor', { name: type })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
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

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"src/settings.tsx":{content:`import React from 'react'
import { Radio, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'center',
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Anchor" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group onChange={this.onChange} value={this.state.type}>
              <Radio value="center">center</Radio>
              <Radio value="nodeCenter">nodeCenter</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="midSide">midSide</Radio>
              <Radio value="top">top</Radio>
              <Radio value="bottom">bottom</Radio>
              <Radio value="left">left</Radio>
              <Radio value="right">right</Radio>
              <Radio value="topLeft">topLeft</Radio>
              <Radio value="topRight">topRight</Radio>
              <Radio value="bottomLeft">bottomLeft</Radio>
              <Radio value="bottomRight">bottomRight</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
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
`,isBinary:!1}}}}function w(){return{title:"api/registry/node-anchor/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

.app-side {
  width: 336px;
  bottom: 0;
  padding: 0 8px;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.ant-card {
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.ant-card-head-title {
  text-align: center;
}

.ant-row {
  margin: 16px 0;
  text-align: left;
}

.ant-radio-wrapper {
  width: 120px;
}

.slider-value {
  background: #eee;
  color: #333333;
  padding: 3px 7px;
  border-radius: 10px;
  display: inline-block;
  font-size: 12px;
  margin-left: 8px;
  line-height: 1.25;
}
`,"src/app.tsx":`import React from 'react'
import { Graph, Edge } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      interacting: false,
    })

    const rect1 = graph.addNode({
      x: 160,
      y: 80,
      width: 100,
      height: 40,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
      },
    })

    const rect2 = graph.addNode({
      x: 460,
      y: 80,
      width: 100,
      height: 40,
      markup: [
        { tagName: 'rect', selector: 'body' },
        { tagName: 'rect', selector: 'port' },
      ],
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: '#31d0c6',
        },
        port: {
          x: 10,
          y: 10,
          width: 30,
          height: 10,
          strokeWidth: 1,
          stroke: '#fe8550',
        },
      },
    })

    const edge1 = graph.addEdge({
      source: { x: 100, y: 100 },
      target: { cell: rect1.id },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    const edge2 = graph.addEdge({
      source: { x: 320, y: 100 },
      target: { cell: rect2, selector: 'port' },
      attrs: {
        line: {
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
    })

    function animate() {
      edge1.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 210, y: 100 }
          const radius = 140
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })

      edge2.transition('source', 9.36 / 60, {
        duration: 5000,
        interp: (start, startTime) => {
          const corr = startTime * (2 * Math.PI) - Math.PI / 2
          const origin = { x: 485, y: 95 }
          const radius = 120
          return function (t) {
            return {
              x: origin.x + radius * Math.cos(t * 2 * Math.PI + corr),
              y: origin.y + radius * Math.sin(t * 2 * Math.PI + corr),
            }
          }
        },
      })
    }

    animate()

    edge1.on('transition:complete', animate)

    this.edge1 = edge1
    this.edge2 = edge2
  }

  onAttrsChanged = ({ type }: State) => {
    this.edge1.prop('target/anchor', { name: type })
    this.edge2.prop('target/anchor', { name: type })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onAttrsChanged} />
        </div>
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

ReactDOM.render(<App />, document.getElementById('root'))`,"src/settings.tsx":`import React from 'react'
import { Radio, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  type: string
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'center',
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onChange = (e: any) => {
    this.setState({ type: e.target.value }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card title="Anchor" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={22} offset={2}>
            <Radio.Group onChange={this.onChange} value={this.state.type}>
              <Radio value="center">center</Radio>
              <Radio value="nodeCenter">nodeCenter</Radio>
              <Radio value="orth">orth</Radio>
              <Radio value="midSide">midSide</Radio>
              <Radio value="top">top</Radio>
              <Radio value="bottom">bottom</Radio>
              <Radio value="left">left</Radio>
              <Radio value="right">right</Radio>
              <Radio value="topLeft">topLeft</Radio>
              <Radio value="topRight">topRight</Radio>
              <Radio value="bottomLeft">bottomLeft</Radio>
              <Radio value="bottomRight">bottomRight</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </Card>
    )
  }
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
`}}}},105:function(m,u,n){},107:function(m,u,n){"use strict";n.r(u);var M=n(0),e=n.n(M),w=n(31),L=n.n(w),x=n(1),y=n(2),R=n(3),b=n(4),S=n(87),N=n(111),D=n(56),P=n(37),l=n(115),Y=n(73),T=function(c){Object(R.a)(t,c);var d=Object(b.a)(t);function t(){var a;Object(x.a)(this,t);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return a=d.call.apply(d,[this].concat(s)),a.state={type:"center"},a.onChange=function(i){a.setState({type:i.target.value},function(){a.notifyChange()})},a}return Object(y.a)(t,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return e.a.createElement(N.a,{title:"Anchor",size:"small",bordered:!1,style:{width:320}},e.a.createElement(D.a,{align:"middle"},e.a.createElement(P.a,{span:22,offset:2},e.a.createElement(l.a.Group,{onChange:this.onChange,value:this.state.type},e.a.createElement(l.a,{value:"center"},"center"),e.a.createElement(l.a,{value:"nodeCenter"},"nodeCenter"),e.a.createElement(l.a,{value:"orth"},"orth"),e.a.createElement(l.a,{value:"midSide"},"midSide"),e.a.createElement(l.a,{value:"top"},"top"),e.a.createElement(l.a,{value:"bottom"},"bottom"),e.a.createElement(l.a,{value:"left"},"left"),e.a.createElement(l.a,{value:"right"},"right"),e.a.createElement(l.a,{value:"topLeft"},"topLeft"),e.a.createElement(l.a,{value:"topRight"},"topRight"),e.a.createElement(l.a,{value:"bottomLeft"},"bottomLeft"),e.a.createElement(l.a,{value:"bottomRight"},"bottomRight")))))}}]),t}(e.a.Component),Z=n(98),I=function(c){Object(R.a)(t,c);var d=Object(b.a)(t);function t(){var a;Object(x.a)(this,t);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return a=d.call.apply(d,[this].concat(s)),a.container=void 0,a.edge1=void 0,a.edge2=void 0,a.onAttrsChanged=function(i){var p=i.type;a.edge1.prop("target/anchor",{name:p}),a.edge2.prop("target/anchor",{name:p})},a.refContainer=function(i){a.container=i},a}return Object(y.a)(t,[{key:"componentDidMount",value:function(){var r=new S.a({container:this.container,grid:!0,interacting:!1}),s=r.addNode({x:160,y:80,width:100,height:40,attrs:{body:{strokeWidth:1,stroke:"#31d0c6"}}}),o=r.addNode({x:460,y:80,width:100,height:40,markup:[{tagName:"rect",selector:"body"},{tagName:"rect",selector:"port"}],attrs:{body:{strokeWidth:1,stroke:"#31d0c6"},port:{x:10,y:10,width:30,height:10,strokeWidth:1,stroke:"#fe8550"}}}),i=r.addEdge({source:{x:100,y:100},target:{cell:s.id},attrs:{line:{strokeWidth:1,targetMarker:"classic"}}}),p=r.addEdge({source:{x:320,y:100},target:{cell:o,selector:"port"},attrs:{line:{strokeWidth:1,targetMarker:"classic"}}});function h(){i.transition("source",9.36/60,{duration:5e3,interp:function(_,A){var g=A*(2*Math.PI)-Math.PI/2,f={x:210,y:100},v=140;return function(E){return{x:f.x+v*Math.cos(E*2*Math.PI+g),y:f.y+v*Math.sin(E*2*Math.PI+g)}}}}),p.transition("source",9.36/60,{duration:5e3,interp:function(_,A){var g=A*(2*Math.PI)-Math.PI/2,f={x:485,y:95},v=120;return function(E){return{x:f.x+v*Math.cos(E*2*Math.PI+g),y:f.y+v*Math.sin(E*2*Math.PI+g)}}}})}h(),i.on("transition:complete",h),this.edge1=i,this.edge2=p}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(T,{onChange:this.onAttrsChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(e.a.Component),j=n(116),X=n(110),k=n(117),z=n(118),C=n(114),V=n(83),K=n(101),O=n(102),B=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},W=function(c){Object(R.a)(t,c);var d=Object(b.a)(t);function t(){return Object(x.a)(this,t),d.apply(this,arguments)}return Object(y.a)(t,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(j.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(X.a,{component:B}))),e.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(O.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(k.a,null))),e.a.createElement(C.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(V.getParameters)(O.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(z.a,null)))))}}]),t}(e.a.Component),H=n(112),G=n(84),Q=n(105),U=function(c){Object(R.a)(t,c);var d=Object(b.a)(t);function t(a){var r;return Object(x.a)(this,t),r=d.call(this,a),r.refContainer=function(s){r.container=s},t.restoreIframeSize(),r}return Object(y.a)(t,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var s=new window.ResizeObserver(function(){r.updateIframeSize()});s.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var s=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(s+16,"px"),r.style.border="0",r.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(W,null),this.props.children)}}]),t}(e.a.Component);(function(c){var d=window.location.pathname,t="x6-iframe-size";function a(){var o=localStorage.getItem(t),i;if(o)try{i=JSON.parse(o)}catch(p){}else i={};return i}function r(){var o=window.frameElement;if(o){var i=o.style,p={width:i.width,height:i.height},h=a();h[d]=p,localStorage.setItem(t,JSON.stringify(h))}}c.saveIframeSize=r;function s(){var o=window.frameElement;if(o){var i=a(),p=i[d];p&&(o.style.width=p.width||"100%",o.style.height=p.height||"auto")}}c.restoreIframeSize=s})(U||(U={}));var $=n(106),F=function(d){var t=d.children;return e.a.createElement(H.a.ErrorBoundary,null,e.a.createElement(G.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(U,null,t))};L.a.render(e.a.createElement(F,null,e.a.createElement(I,null)),document.getElementById("root"))},90:function(m,u,n){m.exports=n(107)},98:function(m,u,n){}},[[90,1,2]]]);
