(this["webpackJsonp@antv/x6-sites-demos-api.registry.filter.highlight"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.filter.highlight"]||[]).push([[0],{103:function(u,p,e){},106:function(u,p,e){},107:function(u,p,e){"use strict";e.r(p),e.d(p,"host",function(){return y}),e.d(p,"getCodeSandboxParams",function(){return n}),e.d(p,"getStackblitzPrefillConfig",function(){return b});const y="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/filter/highlight";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
  user-select: none;
}

.ant-card-head-title {
  text-align: center;
}

.ant-row {
  margin: 16px 0;
  text-align: left;
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
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 55,
      width: 400,
      height: 160,
      attrs: {
        body: {
          rx: 10,
          ry: 10,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return \`highlight\\n\\ncolor: \${args.color}\\ndx: \${args.width}        \\ndy: \${args.blur}        \\nopacity: \${args.opacity}               \\n\`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'highlight',
          args: { ...args },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
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
import { Color } from '@antv/x6'
import { Input, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  width: number
  blur: number
  opacity: number
}

export const defaults: State = {
  color: Color.randomHex(),
  width: 10,
  blur: 1,
  opacity: 0.5,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      this.notifyChange()
    })
  }

  onBlurChanged = (blur: number) => {
    this.setState({ blur }, () => {
      this.notifyChange()
    })
  }

  onOpacityChanged = (opacity: number) => {
    this.setState({ opacity }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>color</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>width</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.width}
              onChange={this.onWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.width.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>blur</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.blur}
              onChange={this.onBlurChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.blur.toFixed(2)}</div>
          </Col>
        </Row>

        <Row align="middle">
          <Col span={6}>opacity</Col>
          <Col span={14}>
            <Slider
              min={0.05}
              max={1}
              step={0.05}
              value={this.state.opacity}
              onChange={this.onOpacityChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.opacity.toFixed(2)}</div>
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
`,isBinary:!1}}}}function b(){return{title:"api/registry/filter/highlight",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  user-select: none;
}

.ant-card-head-title {
  text-align: center;
}

.ant-row {
  margin: 16px 0;
  text-align: left;
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
import { Graph, Node, Color } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private node: Node

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
    })

    this.node = this.graph.addNode({
      x: 40,
      y: 55,
      width: 400,
      height: 160,
      attrs: {
        body: {
          rx: 10,
          ry: 10,
        },
      },
    })

    this.onChanged(defaults)
  }

  getText(args: State) {
    return \`highlight\\n\\ncolor: \${args.color}\\ndx: \${args.width}        \\ndy: \${args.blur}        \\nopacity: \${args.opacity}               \\n\`
  }

  onChanged = (args: State) => {
    this.node.attr({
      label: {
        text: this.getText(args),
        fill: Color.invert(args.color, true),
      },
      body: {
        stroke: args.color,
        fill: Color.lighten(args.color, 40),
        filter: {
          name: 'highlight',
          args: { ...args },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onChanged} />
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
import { Color } from '@antv/x6'
import { Input, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  color: string
  width: number
  blur: number
  opacity: number
}

export const defaults: State = {
  color: Color.randomHex(),
  width: 10,
  blur: 1,
  opacity: 0.5,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onWidthChanged = (width: number) => {
    this.setState({ width }, () => {
      this.notifyChange()
    })
  }

  onBlurChanged = (blur: number) => {
    this.setState({ blur }, () => {
      this.notifyChange()
    })
  }

  onOpacityChanged = (opacity: number) => {
    this.setState({ opacity }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>color</Col>
          <Col span={14}>
            <Input
              type="color"
              value={this.state.color}
              style={{ width: '100%' }}
              onChange={this.onColorChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>width</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.width}
              onChange={this.onWidthChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.width.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>blur</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.blur}
              onChange={this.onBlurChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.blur.toFixed(2)}</div>
          </Col>
        </Row>

        <Row align="middle">
          <Col span={6}>opacity</Col>
          <Col span={14}>
            <Slider
              min={0.05}
              max={1}
              step={0.05}
              value={this.state.opacity}
              onChange={this.onOpacityChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.opacity.toFixed(2)}</div>
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
`}}}},110:function(u,p,e){},112:function(u,p,e){"use strict";e.r(p);var y=e(0),n=e.n(y),b=e(32),N=e.n(b),U=e(63),h=e(3),f=e(4),g=e(6),v=e(7),E=e(59),L=e(116),C=e(60),c=e(46),D=e(118),w=e(117),F=e(77),S={color:E.a.randomHex(),width:10,blur:1,opacity:.5},M=function(d){Object(g.a)(a,d);var i=Object(v.a)(a);function a(){var t;Object(h.a)(this,a);for(var o=arguments.length,l=new Array(o),r=0;r<o;r++)l[r]=arguments[r];return t=i.call.apply(i,[this].concat(l)),t.state=S,t.onColorChanged=function(s){t.setState({color:s.target.value},function(){t.notifyChange()})},t.onWidthChanged=function(s){t.setState({width:s},function(){t.notifyChange()})},t.onBlurChanged=function(s){t.setState({blur:s},function(){t.notifyChange()})},t.onOpacityChanged=function(s){t.setState({opacity:s},function(){t.notifyChange()})},t}return Object(f.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(Object(U.a)({},this.state))}},{key:"render",value:function(){return n.a.createElement(L.a,{title:"Settings",size:"small",bordered:!1,style:{width:320}},n.a.createElement(C.a,{align:"middle"},n.a.createElement(c.a,{span:6},"color"),n.a.createElement(c.a,{span:14},n.a.createElement(D.a,{type:"color",value:this.state.color,style:{width:"100%"},onChange:this.onColorChanged}))),n.a.createElement(C.a,{align:"middle"},n.a.createElement(c.a,{span:6},"width"),n.a.createElement(c.a,{span:14},n.a.createElement(w.a,{min:0,max:20,step:1,value:this.state.width,onChange:this.onWidthChanged})),n.a.createElement(c.a,{span:2},n.a.createElement("div",{className:"slider-value"},this.state.width.toFixed(2)))),n.a.createElement(C.a,{align:"middle"},n.a.createElement(c.a,{span:6},"blur"),n.a.createElement(c.a,{span:14},n.a.createElement(w.a,{min:0,max:20,step:1,value:this.state.blur,onChange:this.onBlurChanged})),n.a.createElement(c.a,{span:2},n.a.createElement("div",{className:"slider-value"},this.state.blur.toFixed(2)))),n.a.createElement(C.a,{align:"middle"},n.a.createElement(c.a,{span:6},"opacity"),n.a.createElement(c.a,{span:14},n.a.createElement(w.a,{min:.05,max:1,step:.05,value:this.state.opacity,onChange:this.onOpacityChanged})),n.a.createElement(c.a,{span:2},n.a.createElement("div",{className:"slider-value"},this.state.opacity.toFixed(2)))))}}]),a}(n.a.Component),G=e(103),T=function(d){Object(g.a)(a,d);var i=Object(v.a)(a);function a(){var t;Object(h.a)(this,a);for(var o=arguments.length,l=new Array(o),r=0;r<o;r++)l[r]=arguments[r];return t=i.call.apply(i,[this].concat(l)),t.container=void 0,t.graph=void 0,t.node=void 0,t.onChanged=function(s){t.node.attr({label:{text:t.getText(s),fill:E.a.invert(s.color,!0)},body:{stroke:s.color,fill:E.a.lighten(s.color,40),filter:{name:"highlight",args:Object(U.a)({},s)}}})},t.refContainer=function(s){t.container=s},t}return Object(f.a)(a,[{key:"componentDidMount",value:function(){this.graph=new E.b({container:this.container,grid:!0}),this.node=this.graph.addNode({x:40,y:55,width:400,height:160,attrs:{body:{rx:10,ry:10}}}),this.onChanged(S)}},{key:"getText",value:function(o){return`highlight

color: `.concat(o.color,`
dx: `).concat(o.width,`        
dy: `).concat(o.blur,`        
opacity: `).concat(o.opacity,`               
`)}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-side"},n.a.createElement(M,{onChange:this.onChanged})),n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(n.a.Component),j=e(121),X=e(115),P=e(122),I=e(123),x=e(92),V=e(87),J=e(106),O=e(107),z=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},_=function(d){Object(g.a)(a,d);var i=Object(v.a)(a);function a(){return Object(h.a)(this,a),i.apply(this,arguments)}return Object(f.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(j.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(X.a,{component:z}))),n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(O.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(P.a,null))),n.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(V.getParameters)(O.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(I.a,null)))))}}]),a}(n.a.Component),B=e(119),H=e(88),W=e(110),R=function(d){Object(g.a)(a,d);var i=Object(v.a)(a);function a(t){var o;return Object(h.a)(this,a),o=i.call(this,t),o.refContainer=function(l){o.container=l},a.restoreIframeSize(),o}return Object(f.a)(a,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){o.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var l=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(l+16,"px"),o.style.border="0",o.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(_,null),this.props.children)}}]),a}(n.a.Component);(function(d){var i=window.location.pathname,a="x6-iframe-size";function t(){var r=localStorage.getItem(a),s;if(r)try{s=JSON.parse(r)}catch(m){}else s={};return s}function o(){var r=window.frameElement;if(r){var s=r.style,m={width:s.width,height:s.height},A=t();A[i]=m,localStorage.setItem(a,JSON.stringify(A))}}d.saveIframeSize=o;function l(){var r=window.frameElement;if(r){var s=t(),m=s[i];m&&(r.style.width=m.width||"100%",r.style.height=m.height||"auto")}}d.restoreIframeSize=l})(R||(R={}));var $=e(111),k=function(i){var a=i.children;return n.a.createElement(B.a.ErrorBoundary,null,n.a.createElement(H.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(R,null,a))};N.a.render(n.a.createElement(k,null,n.a.createElement(T,null)),document.getElementById("root"))},95:function(u,p,e){u.exports=e(112)}},[[95,1,2]]]);
