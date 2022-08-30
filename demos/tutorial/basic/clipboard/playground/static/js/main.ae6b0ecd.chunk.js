(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.clipboard.playground"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.clipboard.playground"]||[]).push([[0],{112:function(p,d,t){p.exports=t(130)},120:function(p,d,t){},124:function(p,d,t){},125:function(p,d,t){"use strict";t.r(d),t.d(d,"host",function(){return C}),t.d(d,"getCodeSandboxParams",function(){return e}),t.d(d,"getStackblitzPrefillConfig",function(){return b});const C="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/clipboard/playground";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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

.app-btns {
  margin-top: 16px;
  display: flex;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.app-btns .ant-btn {
  flex: 1;
  margin-right: 8px;
}

.app-btns .ant-btn:last-child {
  margin-right: 0;
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
import { Button, message } from 'antd'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private options: State

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
      },
      clipboard: {
        enabled: true,
        useLocalStorage: true,
      },
    })

    this.graph.addNode({
      x: 280,
      y: 80,
      width: 100,
      height: 40,
      label: 'Rect',
    })

    const source = this.graph.addNode({
      x: 32,
      y: 32,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 180,
      y: 160,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSettingsChanged = (options: State) => {
    this.options = { ...options }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onCopy = () => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      this.graph.copy(cells, this.options)
      message.success('\u590D\u5236\u6210\u529F')
    } else {
      message.info('\u8BF7\u5148\u9009\u4E2D\u8282\u70B9\u518D\u590D\u5236')
    }
  }

  onPaste = () => {
    if (this.graph.isClipboardEmpty()) {
      message.info('\u526A\u5207\u677F\u4E3A\u7A7A\uFF0C\u4E0D\u53EF\u7C98\u8D34')
    } else {
      const cells = this.graph.paste(this.options)
      this.graph.cleanSelection()
      this.graph.select(cells)
      message.success('\u7C98\u8D34\u6210\u529F')
    }
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
          <div className="app-btns">
            <Button onClick={this.onCopy} type="primary">
              Copy Selected Cells
            </Button>
            <Button onClick={this.onPaste} type="ghost" autoFocus={true}>
              Paste
            </Button>
          </div>
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
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  offset: number
  useLocalStorage: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    offset: 30,
    useLocalStorage: true,
  }

  componentDidMount() {
    this.notifyChange()
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onUseLocalStorageChanged = (e: any) => {
    this.setState({ useLocalStorage: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Clipboard Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={8}>Paste Offset</Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={10}
              max={80}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.useLocalStorage}
              onChange={this.onUseLocalStorageChanged}
            >
              Use LocalStorage
            </Checkbox>
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
`,isBinary:!1}}}}function b(){return{title:"tutorial/basic/clipboard/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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

.app-btns {
  margin-top: 16px;
  display: flex;
}

.app-content {
  flex: 1;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.app-btns .ant-btn {
  flex: 1;
  margin-right: 8px;
}

.app-btns .ant-btn:last-child {
  margin-right: 0;
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
import { Button, message } from 'antd'
import { Graph } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph
  private options: State

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
      },
      clipboard: {
        enabled: true,
        useLocalStorage: true,
      },
    })

    this.graph.addNode({
      x: 280,
      y: 80,
      width: 100,
      height: 40,
      label: 'Rect',
    })

    const source = this.graph.addNode({
      x: 32,
      y: 32,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 180,
      y: 160,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSettingsChanged = (options: State) => {
    this.options = { ...options }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onCopy = () => {
    const cells = this.graph.getSelectedCells()
    if (cells && cells.length) {
      this.graph.copy(cells, this.options)
      message.success('\u590D\u5236\u6210\u529F')
    } else {
      message.info('\u8BF7\u5148\u9009\u4E2D\u8282\u70B9\u518D\u590D\u5236')
    }
  }

  onPaste = () => {
    if (this.graph.isClipboardEmpty()) {
      message.info('\u526A\u5207\u677F\u4E3A\u7A7A\uFF0C\u4E0D\u53EF\u7C98\u8D34')
    } else {
      const cells = this.graph.paste(this.options)
      this.graph.cleanSelection()
      this.graph.select(cells)
      message.success('\u7C98\u8D34\u6210\u529F')
    }
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
          <div className="app-btns">
            <Button onClick={this.onCopy} type="primary">
              Copy Selected Cells
            </Button>
            <Button onClick={this.onPaste} type="ghost" autoFocus={true}>
              Paste
            </Button>
          </div>
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
import { Checkbox, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  offset: number
  useLocalStorage: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    offset: 30,
    useLocalStorage: true,
  }

  componentDidMount() {
    this.notifyChange()
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onUseLocalStorageChanged = (e: any) => {
    this.setState({ useLocalStorage: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Clipboard Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={8}>Paste Offset</Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={10}
              max={80}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.useLocalStorage}
              onChange={this.onUseLocalStorageChanged}
            >
              Use LocalStorage
            </Checkbox>
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
`}}}},128:function(p,d,t){},130:function(p,d,t){"use strict";t.r(d);var C=t(0),e=t.n(C),b=t(30),R=t.n(b),U=t(70),m=t(2),h=t(4),f=t(7),g=t(8),E=t(110),w=t(136),A=t(107),N=t(134),y=t(64),v=t(43),D=t(135),M=t(137),J=t(95),j=function(c){Object(f.a)(a,c);var l=Object(g.a)(a);function a(){var n;Object(m.a)(this,a);for(var o=arguments.length,i=new Array(o),s=0;s<o;s++)i[s]=arguments[s];return n=l.call.apply(l,[this].concat(i)),n.state={offset:30,useLocalStorage:!0},n.onUseLocalStorageChanged=function(r){n.setState({useLocalStorage:r.target.checked},function(){n.notifyChange()})},n.onOffsetChanged=function(r){n.setState({offset:r},function(){n.notifyChange()})},n}return Object(h.a)(a,[{key:"componentDidMount",value:function(){this.notifyChange()}},{key:"notifyChange",value:function(){this.props.onChange(Object(U.a)({},this.state))}},{key:"render",value:function(){return e.a.createElement(N.a,{title:"Clipboard Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(y.a,{align:"middle"},e.a.createElement(v.a,{span:8},"Paste Offset"),e.a.createElement(v.a,{span:2,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.offset))),e.a.createElement(y.a,{align:"middle"},e.a.createElement(v.a,{span:24},e.a.createElement(D.a,{min:10,max:80,step:1,value:this.state.offset,onChange:this.onOffsetChanged}))),e.a.createElement(y.a,{align:"middle"},e.a.createElement(v.a,{span:24},e.a.createElement(M.a,{checked:this.state.useLocalStorage,onChange:this.onUseLocalStorageChanged},"Use LocalStorage"))))}}]),a}(e.a.Component),W=t(120),X=function(c){Object(f.a)(a,c);var l=Object(g.a)(a);function a(){var n;Object(m.a)(this,a);for(var o=arguments.length,i=new Array(o),s=0;s<o;s++)i[s]=arguments[s];return n=l.call.apply(l,[this].concat(i)),n.container=void 0,n.graph=void 0,n.options=void 0,n.onSettingsChanged=function(r){n.options=Object(U.a)({},r)},n.refContainer=function(r){n.container=r},n.onCopy=function(){var r=n.graph.getSelectedCells();r&&r.length?(n.graph.copy(r,n.options),E.b.success("\u590D\u5236\u6210\u529F")):E.b.info("\u8BF7\u5148\u9009\u4E2D\u8282\u70B9\u518D\u590D\u5236")},n.onPaste=function(){if(n.graph.isClipboardEmpty())E.b.info("\u526A\u5207\u677F\u4E3A\u7A7A\uFF0C\u4E0D\u53EF\u7C98\u8D34");else{var r=n.graph.paste(n.options);n.graph.cleanSelection(),n.graph.select(r),E.b.success("\u7C98\u8D34\u6210\u529F")}},n}return Object(h.a)(a,[{key:"componentDidMount",value:function(){this.graph=new A.a({container:this.container,grid:{visible:!0},selecting:{enabled:!0,showNodeSelectionBox:!0},clipboard:{enabled:!0,useLocalStorage:!0}}),this.graph.addNode({x:280,y:80,width:100,height:40,label:"Rect"});var o=this.graph.addNode({x:32,y:32,width:100,height:40,label:"Hello"}),i=this.graph.addNode({shape:"circle",x:180,y:160,width:60,height:60,label:"World"});this.graph.addEdge({source:o,target:i})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(j,{onChange:this.onSettingsChanged}),e.a.createElement("div",{className:"app-btns"},e.a.createElement(w.a,{onClick:this.onCopy,type:"primary"},"Copy Selected Cells"),e.a.createElement(w.a,{onClick:this.onPaste,type:"ghost",autoFocus:!0},"Paste"))),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(e.a.Component),P=t(139),T=t(133),V=t(140),k=t(141),x=t(109),z=t(103),Y=t(124),L=t(125),B=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},I=function(c){Object(f.a)(a,c);var l=Object(g.a)(a);function a(){return Object(m.a)(this,a),l.apply(this,arguments)}return Object(h.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(P.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(T.a,{component:B}))),e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(L.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(V.a,null))),e.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(z.getParameters)(L.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(k.a,null)))))}}]),a}(e.a.Component),H=t(138),F=t(104),Z=t(128),S=function(c){Object(f.a)(a,c);var l=Object(g.a)(a);function a(n){var o;return Object(m.a)(this,a),o=l.call(this,n),o.refContainer=function(i){o.container=i},a.restoreIframeSize(),o}return Object(h.a)(a,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){o.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var s=document.getElementById("loading");s&&s.parentNode&&s.parentNode.removeChild(s)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var i=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(i+16,"px"),o.style.border="0",o.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(I,null),this.props.children)}}]),a}(e.a.Component);(function(c){var l=window.location.pathname,a="x6-iframe-size";function n(){var s=localStorage.getItem(a),r;if(s)try{r=JSON.parse(s)}catch(u){}else r={};return r}function o(){var s=window.frameElement;if(s){var r=s.style,u={width:r.width,height:r.height},O=n();O[l]=u,localStorage.setItem(a,JSON.stringify(O))}}c.saveIframeSize=o;function i(){var s=window.frameElement;if(s){var r=n(),u=r[l];u&&(s.style.width=u.width||"100%",s.style.height=u.height||"auto")}}c.restoreIframeSize=i})(S||(S={}));var K=t(129),G=function(l){var a=l.children;return e.a.createElement(H.a.ErrorBoundary,null,e.a.createElement(F.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(S,null,a))};R.a.render(e.a.createElement(G,null,e.a.createElement(X,null)),document.getElementById("root"))}},[[112,1,2]]]);
