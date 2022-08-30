(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.selection.playground"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.selection.playground"]||[]).push([[0],{100:function(m,h,t){},103:function(m,h,t){},104:function(m,h,t){"use strict";t.r(h),t.d(h,"host",function(){return y}),t.d(h,"getCodeSandboxParams",function(){return e}),t.d(h,"getStackblitzPrefillConfig",function(){return R});const y="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/selection/playground";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { Graph, StringExt, JQuery } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      },
    })

    this.graph.addNode({
      x: 320,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
    })

    const source = this.graph.addNode({
      x: 80,
      y: 50,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 240,
      y: 200,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSettingChanged = (options: State) => {
    this.graph.toggleMultipleSelection(options.multiple)
    this.graph.toggleSelectionMovable(options.movable)
    this.graph.toggleRubberband(options.rubberband)
    this.graph.toggleStrictRubberband(options.strict)
    this.graph.setSelectionFilter(options.filter)
    this.graph.setRubberbandModifiers(options.modifiers as any)
    this.graph.setSelectionDisplayContent(
      options.content
        ? (selection) => {
            return StringExt.template(
              '<%= length %> node<%= length > 1 ? "s":"" %> selected.',
            )({ length: selection.length })
          }
        : null,
    )

    JQuery(this.graph.selection.widget.container).toggleClass(
      'my-selection',
      options.className,
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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
import { Checkbox, Switch, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  className: boolean
  multiple: boolean
  rubberband: boolean
  strict: boolean
  movable: boolean
  modifiers: string[]
  filter?: string[]
  content: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    className: false,
    multiple: true,
    rubberband: true,
    movable: true,
    strict: false,
    modifiers: [],
    content: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onMultipleChanged = (multiple: boolean) => {
    this.setState({ multiple }, () => {
      this.notifyChange()
    })
  }

  onMovableChanged = (movable: boolean) => {
    this.setState({ movable }, () => {
      this.notifyChange()
    })
  }

  onRubberbandChanged = (rubberband: boolean) => {
    this.setState({ rubberband }, () => {
      this.notifyChange()
    })
  }

  onStrictChanged = (strict: boolean) => {
    this.setState({ strict }, () => {
      this.notifyChange()
    })
  }

  onModifiersChange = (modifiers: any) => {
    this.setState({ modifiers }, () => {
      this.notifyChange()
    })
  }

  onClassNameChanged = (e: any) => {
    this.setState({ className: e.target.checked }, () => {
      this.notifyChange()
    })
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

  onContentChanged = (e: any) => {
    this.setState({ content: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Selection Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={14}>Enable Multiple Select</Col>
          <Col span={10}>
            <Switch
              checked={this.state.multiple}
              onChange={this.onMultipleChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={14}>Selection Movable</Col>
          <Col span={10}>
            <Switch
              checked={this.state.movable}
              onChange={this.onMovableChanged}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            margin: '0 -12px',
          }}
        >
          <Col span={24} style={{ borderBottom: '1px solid #e9e9e9' }} />
        </Row>
        <Row align="middle">
          <Col span={14}>Enable Rubberband</Col>
          <Col span={10}>
            <Switch
              checked={this.state.rubberband}
              onChange={this.onRubberbandChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={14}>Is Strict Contains</Col>
          <Col span={10}>
            <Switch
              checked={this.state.strict}
              onChange={this.onStrictChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Modifier Key</Col>
          <Col span={16}>
            <Checkbox.Group
              options={['alt', 'ctrl', 'shift']}
              value={this.state.modifiers}
              onChange={this.onModifiersChange}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            margin: '0 -12px',
          }}
        >
          <Col span={24} style={{ borderBottom: '1px solid #e9e9e9' }} />
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.className}
              onChange={this.onClassNameChanged}
            >
              Add custom className(my-selection)
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.filter != null}
              onChange={this.onFilterChanged}
            >
              Add filter (exclude circle)
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.content}
              onChange={this.onContentChanged}
            >
              Add content(display selected count)
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
`,isBinary:!1}}}}function R(){return{title:"tutorial/basic/selection/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
`,"src/app.tsx":`import React from 'react'
import { Graph, StringExt, JQuery } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: { visible: true },
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      },
    })

    this.graph.addNode({
      x: 320,
      y: 100,
      width: 100,
      height: 40,
      label: 'Rect',
    })

    const source = this.graph.addNode({
      x: 80,
      y: 50,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      shape: 'circle',
      x: 240,
      y: 200,
      width: 60,
      height: 60,
      label: 'World',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onSettingChanged = (options: State) => {
    this.graph.toggleMultipleSelection(options.multiple)
    this.graph.toggleSelectionMovable(options.movable)
    this.graph.toggleRubberband(options.rubberband)
    this.graph.toggleStrictRubberband(options.strict)
    this.graph.setSelectionFilter(options.filter)
    this.graph.setRubberbandModifiers(options.modifiers as any)
    this.graph.setSelectionDisplayContent(
      options.content
        ? (selection) => {
            return StringExt.template(
              '<%= length %> node<%= length > 1 ? "s":"" %> selected.',
            )({ length: selection.length })
          }
        : null,
    )

    JQuery(this.graph.selection.widget.container).toggleClass(
      'my-selection',
      options.className,
    )
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingChanged} />
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
import { Checkbox, Switch, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  className: boolean
  multiple: boolean
  rubberband: boolean
  strict: boolean
  movable: boolean
  modifiers: string[]
  filter?: string[]
  content: boolean
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    className: false,
    multiple: true,
    rubberband: true,
    movable: true,
    strict: false,
    modifiers: [],
    content: false,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onMultipleChanged = (multiple: boolean) => {
    this.setState({ multiple }, () => {
      this.notifyChange()
    })
  }

  onMovableChanged = (movable: boolean) => {
    this.setState({ movable }, () => {
      this.notifyChange()
    })
  }

  onRubberbandChanged = (rubberband: boolean) => {
    this.setState({ rubberband }, () => {
      this.notifyChange()
    })
  }

  onStrictChanged = (strict: boolean) => {
    this.setState({ strict }, () => {
      this.notifyChange()
    })
  }

  onModifiersChange = (modifiers: any) => {
    this.setState({ modifiers }, () => {
      this.notifyChange()
    })
  }

  onClassNameChanged = (e: any) => {
    this.setState({ className: e.target.checked }, () => {
      this.notifyChange()
    })
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

  onContentChanged = (e: any) => {
    this.setState({ content: e.target.checked }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Selection Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={14}>Enable Multiple Select</Col>
          <Col span={10}>
            <Switch
              checked={this.state.multiple}
              onChange={this.onMultipleChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={14}>Selection Movable</Col>
          <Col span={10}>
            <Switch
              checked={this.state.movable}
              onChange={this.onMovableChanged}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            margin: '0 -12px',
          }}
        >
          <Col span={24} style={{ borderBottom: '1px solid #e9e9e9' }} />
        </Row>
        <Row align="middle">
          <Col span={14}>Enable Rubberband</Col>
          <Col span={10}>
            <Switch
              checked={this.state.rubberband}
              onChange={this.onRubberbandChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={14}>Is Strict Contains</Col>
          <Col span={10}>
            <Switch
              checked={this.state.strict}
              onChange={this.onStrictChanged}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Modifier Key</Col>
          <Col span={16}>
            <Checkbox.Group
              options={['alt', 'ctrl', 'shift']}
              value={this.state.modifiers}
              onChange={this.onModifiersChange}
            />
          </Col>
        </Row>
        <Row
          align="middle"
          style={{
            margin: '0 -12px',
          }}
        >
          <Col span={24} style={{ borderBottom: '1px solid #e9e9e9' }} />
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.className}
              onChange={this.onClassNameChanged}
            >
              Add custom className(my-selection)
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.filter != null}
              onChange={this.onFilterChanged}
            >
              Add filter (exclude circle)
            </Checkbox>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24}>
            <Checkbox
              checked={this.state.content}
              onChange={this.onContentChanged}
            >
              Add content(display selected count)
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
`}}}},107:function(m,h,t){},109:function(m,h,t){"use strict";t.r(h);var y=t(0),e=t.n(y),R=t(33),N=t.n(R),g=t(1),f=t(2),b=t(3),C=t(4),S=t(70),A=t(78),O=t(113),u=t(58),r=t(38),E=t(117),v=t(118),H=t(75),D=function(c){Object(b.a)(o,c);var d=Object(C.a)(o);function o(){var n;Object(g.a)(this,o);for(var s=arguments.length,l=new Array(s),i=0;i<s;i++)l[i]=arguments[i];return n=d.call.apply(d,[this].concat(l)),n.state={className:!1,multiple:!0,rubberband:!0,movable:!0,strict:!1,modifiers:[],content:!1},n.onMultipleChanged=function(a){n.setState({multiple:a},function(){n.notifyChange()})},n.onMovableChanged=function(a){n.setState({movable:a},function(){n.notifyChange()})},n.onRubberbandChanged=function(a){n.setState({rubberband:a},function(){n.notifyChange()})},n.onStrictChanged=function(a){n.setState({strict:a},function(){n.notifyChange()})},n.onModifiersChange=function(a){n.setState({modifiers:a},function(){n.notifyChange()})},n.onClassNameChanged=function(a){n.setState({className:a.target.checked},function(){n.notifyChange()})},n.onFilterChanged=function(a){n.setState({filter:a.target.checked?["circle"]:void 0},function(){n.notifyChange()})},n.onContentChanged=function(a){n.setState({content:a.target.checked},function(){n.notifyChange()})},n}return Object(f.a)(o,[{key:"notifyChange",value:function(){this.props.onChange(Object(A.a)({},this.state))}},{key:"render",value:function(){return e.a.createElement(O.a,{title:"Selection Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(u.a,{align:"middle"},e.a.createElement(r.a,{span:14},"Enable Multiple Select"),e.a.createElement(r.a,{span:10},e.a.createElement(E.a,{checked:this.state.multiple,onChange:this.onMultipleChanged}))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(r.a,{span:14},"Selection Movable"),e.a.createElement(r.a,{span:10},e.a.createElement(E.a,{checked:this.state.movable,onChange:this.onMovableChanged}))),e.a.createElement(u.a,{align:"middle",style:{margin:"0 -12px"}},e.a.createElement(r.a,{span:24,style:{borderBottom:"1px solid #e9e9e9"}})),e.a.createElement(u.a,{align:"middle"},e.a.createElement(r.a,{span:14},"Enable Rubberband"),e.a.createElement(r.a,{span:10},e.a.createElement(E.a,{checked:this.state.rubberband,onChange:this.onRubberbandChanged}))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(r.a,{span:14},"Is Strict Contains"),e.a.createElement(r.a,{span:10},e.a.createElement(E.a,{checked:this.state.strict,onChange:this.onStrictChanged}))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Modifier Key"),e.a.createElement(r.a,{span:16},e.a.createElement(v.a.Group,{options:["alt","ctrl","shift"],value:this.state.modifiers,onChange:this.onModifiersChange}))),e.a.createElement(u.a,{align:"middle",style:{margin:"0 -12px"}},e.a.createElement(r.a,{span:24,style:{borderBottom:"1px solid #e9e9e9"}})),e.a.createElement(u.a,{align:"middle"},e.a.createElement(r.a,{span:24},e.a.createElement(v.a,{checked:this.state.className,onChange:this.onClassNameChanged},"Add custom className(my-selection)"))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(r.a,{span:24},e.a.createElement(v.a,{checked:this.state.filter!=null,onChange:this.onFilterChanged},"Add filter (exclude circle)"))),e.a.createElement(u.a,{align:"middle"},e.a.createElement(r.a,{span:24},e.a.createElement(v.a,{checked:this.state.content,onChange:this.onContentChanged},"Add content(display selected count)"))))}}]),o}(e.a.Component),F=t(100),L=function(c){Object(b.a)(o,c);var d=Object(C.a)(o);function o(){var n;Object(g.a)(this,o);for(var s=arguments.length,l=new Array(s),i=0;i<s;i++)l[i]=arguments[i];return n=d.call.apply(d,[this].concat(l)),n.container=void 0,n.graph=void 0,n.onSettingChanged=function(a){n.graph.toggleMultipleSelection(a.multiple),n.graph.toggleSelectionMovable(a.movable),n.graph.toggleRubberband(a.rubberband),n.graph.toggleStrictRubberband(a.strict),n.graph.setSelectionFilter(a.filter),n.graph.setRubberbandModifiers(a.modifiers),n.graph.setSelectionDisplayContent(a.content?function(p){return S.c.template('<%= length %> node<%= length > 1 ? "s":"" %> selected.')({length:p.length})}:null),Object(S.b)(n.graph.selection.widget.container).toggleClass("my-selection",a.className)},n.refContainer=function(a){n.container=a},n}return Object(f.a)(o,[{key:"componentDidMount",value:function(){this.graph=new S.a({container:this.container,grid:{visible:!0},selecting:{enabled:!0,multiple:!0,rubberband:!0,movable:!0,showNodeSelectionBox:!0}}),this.graph.addNode({x:320,y:100,width:100,height:40,label:"Rect"});var s=this.graph.addNode({x:80,y:50,width:100,height:40,label:"Hello"}),l=this.graph.addNode({shape:"circle",x:240,y:200,width:60,height:60,label:"World"});this.graph.addEdge({source:s,target:l})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(D,{onChange:this.onSettingChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),o}(e.a.Component),_=t(119),P=t(112),k=t(120),j=t(121),x=t(116),X=t(86),J=t(103),U=t(104),T=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},I=function(c){Object(b.a)(o,c);var d=Object(C.a)(o);function o(){return Object(g.a)(this,o),d.apply(this,arguments)}return Object(f.a)(o,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(_.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(P.a,{component:T}))),e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(U.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(k.a,null))),e.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(X.getParameters)(U.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(j.a,null)))))}}]),o}(e.a.Component),V=t(114),z=t(87),G=t(107),w=function(c){Object(b.a)(o,c);var d=Object(C.a)(o);function o(n){var s;return Object(g.a)(this,o),s=d.call(this,n),s.refContainer=function(l){s.container=l},o.restoreIframeSize(),s}return Object(f.a)(o,[{key:"componentDidMount",value:function(){var s=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){s.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return s.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var s=window.frameElement;if(s){var l=this.container.scrollHeight||this.container.clientHeight;s.style.width="100%",s.style.height="".concat(l+16,"px"),s.style.border="0",s.style.overflow="hidden",o.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(I,null),this.props.children)}}]),o}(e.a.Component);(function(c){var d=window.location.pathname,o="x6-iframe-size";function n(){var i=localStorage.getItem(o),a;if(i)try{a=JSON.parse(i)}catch(p){}else a={};return a}function s(){var i=window.frameElement;if(i){var a=i.style,p={width:a.width,height:a.height},M=n();M[d]=p,localStorage.setItem(o,JSON.stringify(M))}}c.saveIframeSize=s;function l(){var i=window.frameElement;if(i){var a=n(),p=a[d];p&&(i.style.width=p.width||"100%",i.style.height=p.height||"auto")}}c.restoreIframeSize=l})(w||(w={}));var W=t(108),B=function(d){var o=d.children;return e.a.createElement(V.a.ErrorBoundary,null,e.a.createElement(z.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(w,null,o))};N.a.render(e.a.createElement(B,null,e.a.createElement(L,null)),document.getElementById("root"))},92:function(m,h,t){m.exports=t(109)}},[[92,1,2]]]);
