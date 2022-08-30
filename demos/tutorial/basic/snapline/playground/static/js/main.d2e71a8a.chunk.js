(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.snapline.playground"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.snapline.playground"]||[]).push([[0],{102:function(h,c,t){},103:function(h,c,t){"use strict";t.r(c),t.d(c,"host",function(){return y}),t.d(c,"getCodeSandboxParams",function(){return e}),t.d(c,"getStackblitzPrefillConfig",function(){return b});const y="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/snapline/playground";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { Graph, JQuery } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      snapline: {
        enabled: true,
        clean: false,
      },
    })

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Drag Me',
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
      x: 160,
      y: 180,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSnaplineChanged = (options: State) => {
    this.graph.setSnaplineTolerance(options.tolerance)
    this.graph.setSnaplineFilter(options.filter)

    if (options.sharp) {
      this.graph.enableSharpSnapline()
    } else {
      this.graph.disableSharpSnapline()
    }

    if (options.resizing) {
      this.graph.enableSnaplineOnResizing()
    } else {
      this.graph.disableSnaplineOnResizing()
    }

    JQuery(this.graph.snapline.widget.container).toggleClass(
      'my-snapline',
      options.className != null,
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSnaplineChanged} />
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
  tolerance: number
  sharp: boolean
  resizing: boolean
  className?: string
  filter?: string[]
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    tolerance: 10,
    sharp: false,
    resizing: false,
  }

  tryToJSON(val: string) {
    try {
      return JSON.parse(val)
    } catch (error) {
      return val
    }
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onSharpChanged = (e: any) => {
    this.setState({ sharp: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onResingChanged = (e: any) => {
    this.setState({ resizing: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onToleranceChanged = (tolerance: number) => {
    this.setState({ tolerance }, () => {
      this.notifyChange()
    })
  }

  onClassNameChanged = (e: any) => {
    this.setState(
      {
        className: e.target.checked ? 'my-snapline' : undefined,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  onFilterChanged = (e: any) => {
    this.setState(
      {
        filter: e.target.checked ? ['circle'] : undefined,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card
        title="Snapline Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Tolerance</Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.tolerance}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.tolerance}
              onChange={this.onToleranceChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox checked={this.state.sharp} onChange={this.onSharpChanged}>
              Sharp Line
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.resizing}
              onChange={this.onResingChanged}
            >
              Snap on Resizing
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.className != null}
              onChange={this.onClassNameChanged}
            >
              Add Custom ClassName(my-snapline)
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.filter != null}
              onChange={this.onFilterChanged}
            >
              Add Filter(Exclude circle)
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
`,isBinary:!1}}}}function b(){return{title:"tutorial/basic/snapline/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { Graph, JQuery } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      snapline: {
        enabled: true,
        clean: false,
      },
    })

    this.graph.addNode({
      x: 200,
      y: 100,
      width: 100,
      height: 40,
      label: 'Drag Me',
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
      x: 160,
      y: 180,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSnaplineChanged = (options: State) => {
    this.graph.setSnaplineTolerance(options.tolerance)
    this.graph.setSnaplineFilter(options.filter)

    if (options.sharp) {
      this.graph.enableSharpSnapline()
    } else {
      this.graph.disableSharpSnapline()
    }

    if (options.resizing) {
      this.graph.enableSnaplineOnResizing()
    } else {
      this.graph.disableSnaplineOnResizing()
    }

    JQuery(this.graph.snapline.widget.container).toggleClass(
      'my-snapline',
      options.className != null,
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSnaplineChanged} />
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
  tolerance: number
  sharp: boolean
  resizing: boolean
  className?: string
  filter?: string[]
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    tolerance: 10,
    sharp: false,
    resizing: false,
  }

  tryToJSON(val: string) {
    try {
      return JSON.parse(val)
    } catch (error) {
      return val
    }
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onSharpChanged = (e: any) => {
    this.setState({ sharp: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onResingChanged = (e: any) => {
    this.setState({ resizing: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  onToleranceChanged = (tolerance: number) => {
    this.setState({ tolerance }, () => {
      this.notifyChange()
    })
  }

  onClassNameChanged = (e: any) => {
    this.setState(
      {
        className: e.target.checked ? 'my-snapline' : undefined,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  onFilterChanged = (e: any) => {
    this.setState(
      {
        filter: e.target.checked ? ['circle'] : undefined,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    return (
      <Card
        title="Snapline Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={6}>Tolerance</Col>
          <Col span={2} offset={1}>
            <div className="slider-value">{this.state.tolerance}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={this.state.tolerance}
              onChange={this.onToleranceChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox checked={this.state.sharp} onChange={this.onSharpChanged}>
              Sharp Line
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.resizing}
              onChange={this.onResingChanged}
            >
              Snap on Resizing
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.className != null}
              onChange={this.onClassNameChanged}
            >
              Add Custom ClassName(my-snapline)
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.filter != null}
              onChange={this.onFilterChanged}
            >
              Add Filter(Exclude circle)
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
`}}}},106:function(h,c,t){},108:function(h,c,t){"use strict";t.r(c);var y=t(0),e=t.n(y),b=t(31),O=t.n(b),g=t(2),f=t(3),E=t(5),C=t(6),R=t(71),U=t(76),A=t(112),u=t(57),p=t(41),L=t(113),v=t(116),H=t(73),D=function(d){Object(E.a)(a,d);var l=Object(C.a)(a);function a(){var n;Object(g.a)(this,a);for(var s=arguments.length,i=new Array(s),r=0;r<s;r++)i[r]=arguments[r];return n=l.call.apply(l,[this].concat(i)),n.state={tolerance:10,sharp:!1,resizing:!1},n.onSharpChanged=function(o){n.setState({sharp:o.target.checked},function(){n.notifyChange()})},n.onResingChanged=function(o){n.setState({resizing:o.target.checked},function(){n.notifyChange()})},n.onToleranceChanged=function(o){n.setState({tolerance:o},function(){n.notifyChange()})},n.onClassNameChanged=function(o){n.setState({className:o.target.checked?"my-snapline":void 0},function(){n.notifyChange()})},n.onFilterChanged=function(o){n.setState({filter:o.target.checked?["circle"]:void 0},function(){n.notifyChange()})},n}return Object(f.a)(a,[{key:"tryToJSON",value:function(s){try{return JSON.parse(s)}catch(i){return s}}},{key:"notifyChange",value:function(){this.props.onChange(Object(U.a)({},this.state))}},{key:"render",value:function(){return e.a.createElement(A.a,{title:"Snapline Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(u.a,{align:"middle"},e.a.createElement(p.a,{span:6},"Tolerance"),e.a.createElement(p.a,{span:2,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.tolerance))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(p.a,{span:24},e.a.createElement(L.a,{min:1,max:30,step:1,value:this.state.tolerance,onChange:this.onToleranceChanged}))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(p.a,{span:24},e.a.createElement(v.a,{checked:this.state.sharp,onChange:this.onSharpChanged},"Sharp Line"))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(p.a,{span:24},e.a.createElement(v.a,{checked:this.state.resizing,onChange:this.onResingChanged},"Snap on Resizing"))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(p.a,{span:24},e.a.createElement(v.a,{checked:this.state.className!=null,onChange:this.onClassNameChanged},"Add Custom ClassName(my-snapline)"))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(p.a,{span:24},e.a.createElement(v.a,{checked:this.state.filter!=null,onChange:this.onFilterChanged},"Add Filter(Exclude circle)"))))}}]),a}(e.a.Component),B=t(99),T=function(d){Object(E.a)(a,d);var l=Object(C.a)(a);function a(){var n;Object(g.a)(this,a);for(var s=arguments.length,i=new Array(s),r=0;r<s;r++)i[r]=arguments[r];return n=l.call.apply(l,[this].concat(i)),n.container=void 0,n.graph=void 0,n.onSnaplineChanged=function(o){n.graph.setSnaplineTolerance(o.tolerance),n.graph.setSnaplineFilter(o.filter),o.sharp?n.graph.enableSharpSnapline():n.graph.disableSharpSnapline(),o.resizing?n.graph.enableSnaplineOnResizing():n.graph.disableSnaplineOnResizing(),Object(R.b)(n.graph.snapline.widget.container).toggleClass("my-snapline",o.className!=null)},n.refContainer=function(o){n.container=o},n}return Object(f.a)(a,[{key:"componentDidMount",value:function(){this.graph=new R.a({container:this.container,grid:{visible:!0},snapline:{enabled:!0,clean:!1}}),this.graph.addNode({x:200,y:100,width:100,height:40,label:"Drag Me"});var s=this.graph.addNode({x:32,y:32,width:100,height:40,label:"Hello"}),i=this.graph.addNode({shape:"circle",x:160,y:180,width:60,height:60,label:"World"});this.graph.addEdge({source:s,target:i})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(D,{onChange:this.onSnaplineChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(e.a.Component),M=t(117),k=t(111),j=t(118),z=t(119),x=t(89),X=t(84),_=t(102),w=t(103),P=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},V=function(d){Object(E.a)(a,d);var l=Object(C.a)(a);function a(){return Object(g.a)(this,a),l.apply(this,arguments)}return Object(f.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(M.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(k.a,{component:P}))),e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(j.a,null))),e.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(X.getParameters)(w.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(z.a,null)))))}}]),a}(e.a.Component),I=t(114),F=t(85),G=t(106),S=function(d){Object(E.a)(a,d);var l=Object(C.a)(a);function a(n){var s;return Object(g.a)(this,a),s=l.call(this,n),s.refContainer=function(i){s.container=i},a.restoreIframeSize(),s}return Object(f.a)(a,[{key:"componentDidMount",value:function(){var s=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){s.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return s.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var s=window.frameElement;if(s){var i=this.container.scrollHeight||this.container.clientHeight;s.style.width="100%",s.style.height="".concat(i+16,"px"),s.style.border="0",s.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(V,null),this.props.children)}}]),a}(e.a.Component);(function(d){var l=window.location.pathname,a="x6-iframe-size";function n(){var r=localStorage.getItem(a),o;if(r)try{o=JSON.parse(r)}catch(m){}else o={};return o}function s(){var r=window.frameElement;if(r){var o=r.style,m={width:o.width,height:o.height},N=n();N[l]=m,localStorage.setItem(a,JSON.stringify(N))}}d.saveIframeSize=s;function i(){var r=window.frameElement;if(r){var o=n(),m=o[l];m&&(r.style.width=m.width||"100%",r.style.height=m.height||"auto")}}d.restoreIframeSize=i})(S||(S={}));var W=t(107),J=function(l){var a=l.children;return e.a.createElement(I.a.ErrorBoundary,null,e.a.createElement(F.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(S,null,a))};O.a.render(e.a.createElement(J,null,e.a.createElement(T,null)),document.getElementById("root"))},91:function(h,c,t){h.exports=t(108)},99:function(h,c,t){}},[[91,1,2]]]);
