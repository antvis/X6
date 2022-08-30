(this["webpackJsonp@antv/x6-sites-demos-api.registry.attr.x-align"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.attr.x-align"]||[]).push([[0],{102:function(p,c,n){},103:function(p,c,n){"use strict";n.r(c),n.d(c,"host",function(){return y}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return R});const y="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/attr/x-align";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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

.app-left {
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
import { Graph, Cell } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Cell

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 400,
      height: 250,
      grid: {
        visible: true,
      },
    })

    this.node = graph.addNode({
      x: 60,
      y: 60,
      width: 280,
      height: 120,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'path',
          selector: 'hLine',
        },
        {
          tagName: 'path',
          selector: 'vLine',
        },
        {
          tagName: 'rect',
          selector: 'ref',
        },
        {
          tagName: 'circle',
          selector: 'dot',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
        },
        dot: {
          r: 3,
          fill: 'red',
          stroke: 'none',
          refX: 0.5,
          refY: 0.5,
        },
        ref: {
          width: 70,
          height: 30,
          refX: 0.5,
          refY: 0.5,
          // xAlign: 'middle',
          // yAlign: 'middle',
          fill: 'rgba(9, 113, 241, 0.8)',
          stroke: 'rgba(9, 113, 241, 0.8)',
        },
        label: {
          fontSize: 14,
          // refX: 0.5,
          // refY: 0.5,
          // textAnchor: "middle",
          // textVerticalAnchor: "middle",
          fill: '#333333',
          fontFamily: 'Arial, helvetica, sans-serif',
        },
        hLine: {
          refY: 0.5,
          d: 'M -30 0 310 0',
          stroke: 'green',
          strokeDasharray: '5 5',
        },
        vLine: {
          refX: 0.5,
          d: 'M 0 -30 0 150',
          stroke: 'green',
          strokeDasharray: '5 5',
        },
      },
    })
  }

  onAttrsChanged = (attrs: State) => {
    this.node.attr({
      ref: attrs,
      hLine: { refY: attrs.refY },
      vLine: { refX: attrs.refX },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div ref={this.refContainer} className="app-content" />
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
import { Radio, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  refX: number
  refY: number
  xAlign?: string
  yAlign?: string
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    refX: 0.5,
    refY: 0.5,
    xAlign: 'left',
    yAlign: 'top',
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onRefXChanged = (refX: number) => {
    this.setState({ refX }, () => {
      this.notifyChange()
    })
  }

  onRefYChanged = (refY: number) => {
    this.setState({ refY }, () => {
      this.notifyChange()
    })
  }

  onXAlignChange = (e: any) => {
    this.setState(
      {
        xAlign: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  onYAlignChange = (e: any) => {
    this.setState(
      {
        yAlign: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card title="Attrs" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>refX</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.refX}
              onChange={this.onRefXChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">
              {(this.state.refX * 100).toFixed(0)}%
            </div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>refY</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.refY}
              onChange={this.onRefYChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">
              {(this.state.refY * 100).toFixed(0)}%
            </div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>xAlign</Col>
          <Col span={19}>
            <Radio.Group
              onChange={this.onXAlignChange}
              value={this.state.xAlign}
            >
              <Radio value={'left'}>Left</Radio>
              <Radio value={'middle'}>Middle</Radio>
              <Radio value={'right'}>Right</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>yAlign</Col>
          <Col span={19}>
            <Radio.Group
              onChange={this.onYAlignChange}
              value={this.state.yAlign}
            >
              <Radio value={'top'}>Top</Radio>
              <Radio value={'middle'}>Middle</Radio>
              <Radio value={'bottom'}>Bottom</Radio>
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
`,isBinary:!1}}}}function R(){return{title:"api/registry/attr/x-align",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

.app-left {
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
import { Graph, Cell } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Cell

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 400,
      height: 250,
      grid: {
        visible: true,
      },
    })

    this.node = graph.addNode({
      x: 60,
      y: 60,
      width: 280,
      height: 120,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'path',
          selector: 'hLine',
        },
        {
          tagName: 'path',
          selector: 'vLine',
        },
        {
          tagName: 'rect',
          selector: 'ref',
        },
        {
          tagName: 'circle',
          selector: 'dot',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        body: {
          refWidth: '100%',
          refHeight: '100%',
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 1,
        },
        dot: {
          r: 3,
          fill: 'red',
          stroke: 'none',
          refX: 0.5,
          refY: 0.5,
        },
        ref: {
          width: 70,
          height: 30,
          refX: 0.5,
          refY: 0.5,
          // xAlign: 'middle',
          // yAlign: 'middle',
          fill: 'rgba(9, 113, 241, 0.8)',
          stroke: 'rgba(9, 113, 241, 0.8)',
        },
        label: {
          fontSize: 14,
          // refX: 0.5,
          // refY: 0.5,
          // textAnchor: "middle",
          // textVerticalAnchor: "middle",
          fill: '#333333',
          fontFamily: 'Arial, helvetica, sans-serif',
        },
        hLine: {
          refY: 0.5,
          d: 'M -30 0 310 0',
          stroke: 'green',
          strokeDasharray: '5 5',
        },
        vLine: {
          refX: 0.5,
          d: 'M 0 -30 0 150',
          stroke: 'green',
          strokeDasharray: '5 5',
        },
      },
    })
  }

  onAttrsChanged = (attrs: State) => {
    this.node.attr({
      ref: attrs,
      hLine: { refY: attrs.refY },
      vLine: { refX: attrs.refX },
    } as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
          <Settings onChange={this.onAttrsChanged} />
        </div>
        <div ref={this.refContainer} className="app-content" />
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
import { Radio, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  refX: number
  refY: number
  xAlign?: string
  yAlign?: string
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    refX: 0.5,
    refY: 0.5,
    xAlign: 'left',
    yAlign: 'top',
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onRefXChanged = (refX: number) => {
    this.setState({ refX }, () => {
      this.notifyChange()
    })
  }

  onRefYChanged = (refY: number) => {
    this.setState({ refY }, () => {
      this.notifyChange()
    })
  }

  onXAlignChange = (e: any) => {
    this.setState(
      {
        xAlign: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  onYAlignChange = (e: any) => {
    this.setState(
      {
        yAlign: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card title="Attrs" size="small" bordered={false} style={{ width: 320 }}>
        <Row align="middle">
          <Col span={5}>refX</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.refX}
              onChange={this.onRefXChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">
              {(this.state.refX * 100).toFixed(0)}%
            </div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>refY</Col>
          <Col span={14}>
            <Slider
              min={0}
              max={0.99}
              step={0.01}
              value={this.state.refY}
              onChange={this.onRefYChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">
              {(this.state.refY * 100).toFixed(0)}%
            </div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>xAlign</Col>
          <Col span={19}>
            <Radio.Group
              onChange={this.onXAlignChange}
              value={this.state.xAlign}
            >
              <Radio value={'left'}>Left</Radio>
              <Radio value={'middle'}>Middle</Radio>
              <Radio value={'right'}>Right</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>yAlign</Col>
          <Col span={19}>
            <Radio.Group
              onChange={this.onYAlignChange}
              value={this.state.yAlign}
            >
              <Radio value={'top'}>Top</Radio>
              <Radio value={'middle'}>Middle</Radio>
              <Radio value={'bottom'}>Bottom</Radio>
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
`}}}},106:function(p,c,n){},108:function(p,c,n){"use strict";n.r(c);var y=n(0),e=n.n(y),R=n(30),X=n.n(R),h=n(2),g=n(3),v=n(5),E=n(6),L=n(87),N=n(112),x=n(57),m=n(40),b=n(113),f=n(116),I=n(73),S=function(d){Object(v.a)(a,d);var s=Object(E.a)(a);function a(){var t;Object(h.a)(this,a);for(var r=arguments.length,l=new Array(r),o=0;o<r;o++)l[o]=arguments[o];return t=s.call.apply(s,[this].concat(l)),t.state={refX:.5,refY:.5,xAlign:"left",yAlign:"top"},t.onRefXChanged=function(i){t.setState({refX:i},function(){t.notifyChange()})},t.onRefYChanged=function(i){t.setState({refY:i},function(){t.notifyChange()})},t.onXAlignChange=function(i){t.setState({xAlign:i.target.value},function(){t.notifyChange()})},t.onYAlignChange=function(i){t.setState({yAlign:i.target.value},function(){t.notifyChange()})},t}return Object(g.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return e.a.createElement(N.a,{title:"Attrs",size:"small",bordered:!1,style:{width:320}},e.a.createElement(x.a,{align:"middle"},e.a.createElement(m.a,{span:5},"refX"),e.a.createElement(m.a,{span:14},e.a.createElement(b.a,{min:0,max:.99,step:.01,value:this.state.refX,onChange:this.onRefXChanged})),e.a.createElement(m.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},(this.state.refX*100).toFixed(0),"%"))),e.a.createElement(x.a,{align:"middle"},e.a.createElement(m.a,{span:5},"refY"),e.a.createElement(m.a,{span:14},e.a.createElement(b.a,{min:0,max:.99,step:.01,value:this.state.refY,onChange:this.onRefYChanged})),e.a.createElement(m.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},(this.state.refY*100).toFixed(0),"%"))),e.a.createElement(x.a,{align:"middle"},e.a.createElement(m.a,{span:5},"xAlign"),e.a.createElement(m.a,{span:19},e.a.createElement(f.a.Group,{onChange:this.onXAlignChange,value:this.state.xAlign},e.a.createElement(f.a,{value:"left"},"Left"),e.a.createElement(f.a,{value:"middle"},"Middle"),e.a.createElement(f.a,{value:"right"},"Right")))),e.a.createElement(x.a,{align:"middle"},e.a.createElement(m.a,{span:5},"yAlign"),e.a.createElement(m.a,{span:19},e.a.createElement(f.a.Group,{onChange:this.onYAlignChange,value:this.state.yAlign},e.a.createElement(f.a,{value:"top"},"Top"),e.a.createElement(f.a,{value:"middle"},"Middle"),e.a.createElement(f.a,{value:"bottom"},"Bottom")))))}}]),a}(e.a.Component),B=n(99),O=function(d){Object(v.a)(a,d);var s=Object(E.a)(a);function a(){var t;Object(h.a)(this,a);for(var r=arguments.length,l=new Array(r),o=0;o<r;o++)l[o]=arguments[o];return t=s.call.apply(s,[this].concat(l)),t.container=void 0,t.node=void 0,t.onAttrsChanged=function(i){t.node.attr({ref:i,hLine:{refY:i.refY},vLine:{refX:i.refX}})},t.refContainer=function(i){t.container=i},t}return Object(g.a)(a,[{key:"componentDidMount",value:function(){var r=new L.a({container:this.container,width:400,height:250,grid:{visible:!0}});this.node=r.addNode({x:60,y:60,width:280,height:120,markup:[{tagName:"rect",selector:"body"},{tagName:"path",selector:"hLine"},{tagName:"path",selector:"vLine"},{tagName:"rect",selector:"ref"},{tagName:"circle",selector:"dot"},{tagName:"text",selector:"label"}],attrs:{body:{refWidth:"100%",refHeight:"100%",fill:"#ffffff",stroke:"#333333",strokeWidth:1},dot:{r:3,fill:"red",stroke:"none",refX:.5,refY:.5},ref:{width:70,height:30,refX:.5,refY:.5,fill:"rgba(9, 113, 241, 0.8)",stroke:"rgba(9, 113, 241, 0.8)"},label:{fontSize:14,fill:"#333333",fontFamily:"Arial, helvetica, sans-serif"},hLine:{refY:.5,d:"M -30 0 310 0",stroke:"green",strokeDasharray:"5 5"},vLine:{refX:.5,d:"M 0 -30 0 150",stroke:"green",strokeDasharray:"5 5"}}})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-left"},e.a.createElement(S,{onChange:this.onAttrsChanged})),e.a.createElement("div",{ref:this.refContainer,className:"app-content"}))}}]),a}(e.a.Component),D=n(117),M=n(111),P=n(118),T=n(119),C=n(89),Y=n(83),H=n(102),w=n(103),j=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},_=function(d){Object(v.a)(a,d);var s=Object(E.a)(a);function a(){return Object(h.a)(this,a),s.apply(this,arguments)}return Object(g.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(D.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(M.a,{component:j}))),e.a.createElement(C.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(P.a,null))),e.a.createElement(C.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(Y.getParameters)(w.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(T.a,null)))))}}]),a}(e.a.Component),k=n(114),V=n(84),F=n(106),A=function(d){Object(v.a)(a,d);var s=Object(E.a)(a);function a(t){var r;return Object(h.a)(this,a),r=s.call(this,t),r.refContainer=function(l){r.container=l},a.restoreIframeSize(),r}return Object(g.a)(a,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){r.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var l=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(l+16,"px"),r.style.border="0",r.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(_,null),this.props.children)}}]),a}(e.a.Component);(function(d){var s=window.location.pathname,a="x6-iframe-size";function t(){var o=localStorage.getItem(a),i;if(o)try{i=JSON.parse(o)}catch(u){}else i={};return i}function r(){var o=window.frameElement;if(o){var i=o.style,u={width:i.width,height:i.height},U=t();U[s]=u,localStorage.setItem(a,JSON.stringify(U))}}d.saveIframeSize=r;function l(){var o=window.frameElement;if(o){var i=t(),u=i[s];u&&(o.style.width=u.width||"100%",o.style.height=u.height||"auto")}}d.restoreIframeSize=l})(A||(A={}));var G=n(107),z=function(s){var a=s.children;return e.a.createElement(k.a.ErrorBoundary,null,e.a.createElement(V.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(A,null,a))};X.a.render(e.a.createElement(z,null,e.a.createElement(O,null)),document.getElementById("root"))},91:function(p,c,n){p.exports=n(108)},99:function(p,c,n){}},[[91,1,2]]]);
