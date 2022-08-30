(this["webpackJsonp@antv/x6-sites-demos-api.registry.filter.drop-shadow"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.filter.drop-shadow"]||[]).push([[0],{103:function(u,p,t){},106:function(u,p,t){},107:function(u,p,t){"use strict";t.r(p),t.d(p,"host",function(){return b}),t.d(p,"getCodeSandboxParams",function(){return n}),t.d(p,"getStackblitzPrefillConfig",function(){return w});const b="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/filter/drop-shadow";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
      y: 80,
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
    return \`dropShadow\\n\\ncolor: \${args.color}\\ndx: \${args.dx}        \\ndy: \${args.dy}        \\nblur: \${args.blur}            \\nopacity: \${args.opacity}               \\n\`
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
          name: 'dropShadow',
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
  dx: number
  dy: number
  blur: number
  opacity: number
}

export const defaults: State = {
  color: Color.randomHex(),
  dx: 10,
  dy: 10,
  blur: 5,
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

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
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
          <Col span={6}>dx</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.dx.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>dy</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.dy.toFixed(2)}</div>
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
`,isBinary:!1}}}}function w(){return{title:"api/registry/filter/drop-shadow",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
      y: 80,
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
    return \`dropShadow\\n\\ncolor: \${args.color}\\ndx: \${args.dx}        \\ndy: \${args.dy}        \\nblur: \${args.blur}            \\nopacity: \${args.opacity}               \\n\`
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
          name: 'dropShadow',
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
  dx: number
  dy: number
  blur: number
  opacity: number
}

export const defaults: State = {
  color: Color.randomHex(),
  dx: 10,
  dy: 10,
  blur: 5,
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

  onDxChanged = (dx: number) => {
    this.setState({ dx }, () => {
      this.notifyChange()
    })
  }

  onDyChanged = (dy: number) => {
    this.setState({ dy }, () => {
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
          <Col span={6}>dx</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.dx}
              onChange={this.onDxChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.dx.toFixed(2)}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={6}>dy</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={20}
              step={1}
              value={this.state.dy}
              onChange={this.onDyChanged}
            />
          </Col>
          <Col span={2}>
            <div className="slider-value">{this.state.dy.toFixed(2)}</div>
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
`}}}},110:function(u,p,t){},112:function(u,p,t){"use strict";t.r(p);var b=t(0),n=t.n(b),w=t(32),A=t.n(w),U=t(63),f=t(3),g=t(4),v=t(6),C=t(7),E=t(59),N=t(116),h=t(60),i=t(46),L=t(118),x=t(117),k=t(77),S={color:E.a.randomHex(),dx:10,dy:10,blur:5,opacity:.5},M=function(c){Object(v.a)(a,c);var l=Object(C.a)(a);function a(){var e;Object(f.a)(this,a);for(var o=arguments.length,d=new Array(o),s=0;s<o;s++)d[s]=arguments[s];return e=l.call.apply(l,[this].concat(d)),e.state=S,e.onColorChanged=function(r){e.setState({color:r.target.value},function(){e.notifyChange()})},e.onDxChanged=function(r){e.setState({dx:r},function(){e.notifyChange()})},e.onDyChanged=function(r){e.setState({dy:r},function(){e.notifyChange()})},e.onBlurChanged=function(r){e.setState({blur:r},function(){e.notifyChange()})},e.onOpacityChanged=function(r){e.setState({opacity:r},function(){e.notifyChange()})},e}return Object(g.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(Object(U.a)({},this.state))}},{key:"render",value:function(){return n.a.createElement(N.a,{title:"Settings",size:"small",bordered:!1,style:{width:320}},n.a.createElement(h.a,{align:"middle"},n.a.createElement(i.a,{span:6},"color"),n.a.createElement(i.a,{span:14},n.a.createElement(L.a,{type:"color",value:this.state.color,style:{width:"100%"},onChange:this.onColorChanged}))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(i.a,{span:6},"dx"),n.a.createElement(i.a,{span:14},n.a.createElement(x.a,{min:0,max:20,step:1,value:this.state.dx,onChange:this.onDxChanged})),n.a.createElement(i.a,{span:2},n.a.createElement("div",{className:"slider-value"},this.state.dx.toFixed(2)))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(i.a,{span:6},"dy"),n.a.createElement(i.a,{span:14},n.a.createElement(x.a,{min:0,max:20,step:1,value:this.state.dy,onChange:this.onDyChanged})),n.a.createElement(i.a,{span:2},n.a.createElement("div",{className:"slider-value"},this.state.dy.toFixed(2)))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(i.a,{span:6},"blur"),n.a.createElement(i.a,{span:14},n.a.createElement(x.a,{min:0,max:20,step:1,value:this.state.blur,onChange:this.onBlurChanged})),n.a.createElement(i.a,{span:2},n.a.createElement("div",{className:"slider-value"},this.state.blur.toFixed(2)))),n.a.createElement(h.a,{align:"middle"},n.a.createElement(i.a,{span:6},"opacity"),n.a.createElement(i.a,{span:14},n.a.createElement(x.a,{min:.05,max:1,step:.05,value:this.state.opacity,onChange:this.onOpacityChanged})),n.a.createElement(i.a,{span:2},n.a.createElement("div",{className:"slider-value"},this.state.opacity.toFixed(2)))))}}]),a}(n.a.Component),G=t(103),P=function(c){Object(v.a)(a,c);var l=Object(C.a)(a);function a(){var e;Object(f.a)(this,a);for(var o=arguments.length,d=new Array(o),s=0;s<o;s++)d[s]=arguments[s];return e=l.call.apply(l,[this].concat(d)),e.container=void 0,e.graph=void 0,e.node=void 0,e.onChanged=function(r){e.node.attr({label:{text:e.getText(r),fill:E.a.invert(r.color,!0)},body:{stroke:r.color,fill:E.a.lighten(r.color,40),filter:{name:"dropShadow",args:Object(U.a)({},r)}}})},e.refContainer=function(r){e.container=r},e}return Object(g.a)(a,[{key:"componentDidMount",value:function(){this.graph=new E.b({container:this.container,grid:!0}),this.node=this.graph.addNode({x:40,y:80,width:400,height:160,attrs:{body:{rx:10,ry:10}}}),this.onChanged(S)}},{key:"getText",value:function(o){return`dropShadow

color: `.concat(o.color,`
dx: `).concat(o.dx,`        
dy: `).concat(o.dy,`        
blur: `).concat(o.blur,`            
opacity: `).concat(o.opacity,`               
`)}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-side"},n.a.createElement(M,{onChange:this.onChanged})),n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(n.a.Component),T=t(121),j=t(115),X=t(122),_=t(123),y=t(92),I=t(87),J=t(106),O=t(107),V=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},z=function(c){Object(v.a)(a,c);var l=Object(C.a)(a);function a(){return Object(f.a)(this,a),l.apply(this,arguments)}return Object(g.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(T.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(j.a,{component:V}))),n.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(O.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(X.a,null))),n.a.createElement(y.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(I.getParameters)(O.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(_.a,null)))))}}]),a}(n.a.Component),B=t(119),F=t(88),$=t(110),R=function(c){Object(v.a)(a,c);var l=Object(C.a)(a);function a(e){var o;return Object(f.a)(this,a),o=l.call(this,e),o.refContainer=function(d){o.container=d},a.restoreIframeSize(),o}return Object(g.a)(a,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){o.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var s=document.getElementById("loading");s&&s.parentNode&&s.parentNode.removeChild(s)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var d=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(d+16,"px"),o.style.border="0",o.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(z,null),this.props.children)}}]),a}(n.a.Component);(function(c){var l=window.location.pathname,a="x6-iframe-size";function e(){var s=localStorage.getItem(a),r;if(s)try{r=JSON.parse(s)}catch(m){}else r={};return r}function o(){var s=window.frameElement;if(s){var r=s.style,m={width:r.width,height:r.height},D=e();D[l]=m,localStorage.setItem(a,JSON.stringify(D))}}c.saveIframeSize=o;function d(){var s=window.frameElement;if(s){var r=e(),m=r[l];m&&(s.style.width=m.width||"100%",s.style.height=m.height||"auto")}}c.restoreIframeSize=d})(R||(R={}));var Y=t(111),H=function(l){var a=l.children;return n.a.createElement(B.a.ErrorBoundary,null,n.a.createElement(F.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(R,null,a))};A.a.render(n.a.createElement(H,null,n.a.createElement(P,null)),document.getElementById("root"))},95:function(u,p,t){u.exports=t(112)}},[[95,1,2]]]);
