(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.grid.playground"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.grid.playground"]||[]).push([[0],{104:function(u,h,t){u.exports=t(121)},112:function(u,h,t){},115:function(u,h,t){},116:function(u,h,t){"use strict";t.r(h),t.d(h,"host",function(){return S}),t.d(h,"getCodeSandboxParams",function(){return e}),t.d(h,"getStackblitzPrefillConfig",function(){return R});const S="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/grid/playground";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { Graph } from '@antv/x6'
import { Settings } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
    })

    const source = this.graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      x: 200,
      y: 180,
      width: 100,
      height: 40,
      label: 'Grid',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onGridChanged = (options: any) => {
    this.graph.drawGrid(options)
  }

  onGridSizeChanged = (size: number) => {
    this.graph.setGridSize(size)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings
            onChange={this.onGridChanged}
            onGridSizeChange={this.onGridSizeChanged}
          />
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
import { Input, Select, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onGridSizeChange: (size: number) => void
  onChange: (res: any) => void
}

export interface State {
  type: string
  size: number
  color: string
  thickness: number
  colorSecond: string
  thicknessSecond: number
  factor: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'dot',
    size: 10,
    color: '#aaaaaa',
    thickness: 1,
    colorSecond: '#888888',
    thicknessSecond: 3,
    factor: 4,
  }

  notifyChange() {
    if (this.state.type === 'doubleMesh') {
      this.props.onChange({
        type: this.state.type,
        args: [
          {
            color: this.state.color,
            thickness: this.state.thickness,
          },
          {
            color: this.state.colorSecond,
            thickness: this.state.thicknessSecond,
            factor: this.state.factor,
          },
        ],
      })
    } else {
      this.props.onChange({
        type: this.state.type,
        args: [
          {
            color: this.state.color,
            thickness: this.state.thickness,
          },
        ],
      })
    }
  }

  onTypeChanged = (type: string) => {
    this.setState({ type }, () => {
      this.notifyChange()
    })
  }

  onSizeChanged = (size: number) => {
    this.setState({ size }, () => {
      this.props.onGridSizeChange(this.state.size)
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onSecondaryColorChanged = (e: any) => {
    this.setState({ colorSecond: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onThicknessChanged = (thickness: number) => {
    this.setState({ thickness }, () => {
      this.notifyChange()
    })
  }

  onSecondaryThicknessChanged = (thicknessSecond: number) => {
    this.setState({ thicknessSecond }, () => {
      this.notifyChange()
    })
  }

  onFactorChanged = (factor: number) => {
    this.setState({ factor }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Grid Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={8}>Grid Type</Col>
          <Col span={13}>
            <Select
              style={{ width: '100%' }}
              value={this.state.type}
              onChange={this.onTypeChanged}
            >
              <Select.Option value="dot">Dot</Select.Option>
              <Select.Option value="fixedDot">Fixed Dot</Select.Option>
              <Select.Option value="mesh">Mesh</Select.Option>
              <Select.Option value="doubleMesh">Double Mesh</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Grid Size</Col>
          <Col span={13}>
            <Slider
              min={1}
              max={20}
              step={1}
              value={this.state.size}
              onChange={this.onSizeChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.size}</div>
          </Col>
        </Row>
        {this.state.type === 'doubleMesh' ? (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Primary Color</Col>
              <Col span={13}>
                <Input
                  type="color"
                  value={this.state.color}
                  style={{ width: '100%' }}
                  onChange={this.onColorChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Primary Thickness</Col>
              <Col span={13}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thickness}
                  onChange={this.onThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Secondary Color</Col>
              <Col span={13}>
                <Input
                  type="color"
                  value={this.state.colorSecond}
                  style={{ width: '100%' }}
                  onChange={this.onSecondaryColorChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Secondary Thickness</Col>
              <Col span={13}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thicknessSecond}
                  onChange={this.onSecondaryThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thicknessSecond.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Scale Factor</Col>
              <Col span={13}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={this.state.factor}
                  onChange={this.onFactorChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">{this.state.factor}</div>
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Grid Color</Col>
              <Col span={13}>
                <Input
                  type="color"
                  value={this.state.color}
                  style={{ width: '100%' }}
                  onChange={this.onColorChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Thickness</Col>
              <Col span={13}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thickness}
                  onChange={this.onThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
          </React.Fragment>
        )}
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
`,isBinary:!1}}}}function R(){return{title:"tutorial/basic/grid/playground",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { Graph } from '@antv/x6'
import { Settings } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
    })

    const source = this.graph.addNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'Hello',
    })

    const target = this.graph.addNode({
      x: 200,
      y: 180,
      width: 100,
      height: 40,
      label: 'Grid',
    })

    this.graph.addEdge({
      source,
      target,
    })
  }

  onGridChanged = (options: any) => {
    this.graph.drawGrid(options)
  }

  onGridSizeChanged = (size: number) => {
    this.graph.setGridSize(size)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings
            onChange={this.onGridChanged}
            onGridSizeChange={this.onGridSizeChanged}
          />
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
import { Input, Select, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onGridSizeChange: (size: number) => void
  onChange: (res: any) => void
}

export interface State {
  type: string
  size: number
  color: string
  thickness: number
  colorSecond: string
  thicknessSecond: number
  factor: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    type: 'dot',
    size: 10,
    color: '#aaaaaa',
    thickness: 1,
    colorSecond: '#888888',
    thicknessSecond: 3,
    factor: 4,
  }

  notifyChange() {
    if (this.state.type === 'doubleMesh') {
      this.props.onChange({
        type: this.state.type,
        args: [
          {
            color: this.state.color,
            thickness: this.state.thickness,
          },
          {
            color: this.state.colorSecond,
            thickness: this.state.thicknessSecond,
            factor: this.state.factor,
          },
        ],
      })
    } else {
      this.props.onChange({
        type: this.state.type,
        args: [
          {
            color: this.state.color,
            thickness: this.state.thickness,
          },
        ],
      })
    }
  }

  onTypeChanged = (type: string) => {
    this.setState({ type }, () => {
      this.notifyChange()
    })
  }

  onSizeChanged = (size: number) => {
    this.setState({ size }, () => {
      this.props.onGridSizeChange(this.state.size)
    })
  }

  onColorChanged = (e: any) => {
    this.setState({ color: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onSecondaryColorChanged = (e: any) => {
    this.setState({ colorSecond: e.target.value }, () => {
      this.notifyChange()
    })
  }

  onThicknessChanged = (thickness: number) => {
    this.setState({ thickness }, () => {
      this.notifyChange()
    })
  }

  onSecondaryThicknessChanged = (thicknessSecond: number) => {
    this.setState({ thicknessSecond }, () => {
      this.notifyChange()
    })
  }

  onFactorChanged = (factor: number) => {
    this.setState({ factor }, () => {
      this.notifyChange()
    })
  }

  render() {
    return (
      <Card
        title="Grid Settings"
        size="small"
        bordered={false}
        style={{ width: 320 }}
      >
        <Row align="middle">
          <Col span={8}>Grid Type</Col>
          <Col span={13}>
            <Select
              style={{ width: '100%' }}
              value={this.state.type}
              onChange={this.onTypeChanged}
            >
              <Select.Option value="dot">Dot</Select.Option>
              <Select.Option value="fixedDot">Fixed Dot</Select.Option>
              <Select.Option value="mesh">Mesh</Select.Option>
              <Select.Option value="doubleMesh">Double Mesh</Select.Option>
            </Select>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={8}>Grid Size</Col>
          <Col span={13}>
            <Slider
              min={1}
              max={20}
              step={1}
              value={this.state.size}
              onChange={this.onSizeChanged}
            />
          </Col>
          <Col span={1}>
            <div className="slider-value">{this.state.size}</div>
          </Col>
        </Row>
        {this.state.type === 'doubleMesh' ? (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Primary Color</Col>
              <Col span={13}>
                <Input
                  type="color"
                  value={this.state.color}
                  style={{ width: '100%' }}
                  onChange={this.onColorChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Primary Thickness</Col>
              <Col span={13}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thickness}
                  onChange={this.onThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Secondary Color</Col>
              <Col span={13}>
                <Input
                  type="color"
                  value={this.state.colorSecond}
                  style={{ width: '100%' }}
                  onChange={this.onSecondaryColorChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Secondary Thickness</Col>
              <Col span={13}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thicknessSecond}
                  onChange={this.onSecondaryThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thicknessSecond.toFixed(1)}
                </div>
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Scale Factor</Col>
              <Col span={13}>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={this.state.factor}
                  onChange={this.onFactorChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">{this.state.factor}</div>
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Row align="middle">
              <Col span={8}>Grid Color</Col>
              <Col span={13}>
                <Input
                  type="color"
                  value={this.state.color}
                  style={{ width: '100%' }}
                  onChange={this.onColorChanged}
                />
              </Col>
            </Row>
            <Row align="middle">
              <Col span={8}>Thickness</Col>
              <Col span={13}>
                <Slider
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={this.state.thickness}
                  onChange={this.onThicknessChanged}
                />
              </Col>
              <Col span={1}>
                <div className="slider-value">
                  {this.state.thickness.toFixed(1)}
                </div>
              </Col>
            </Row>
          </React.Fragment>
        )}
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
`}}}},119:function(u,h,t){},121:function(u,h,t){"use strict";t.r(h);var S=t(0),e=t.n(S),R=t(31),O=t.n(R),C=t(3),E=t(5),v=t(8),y=t(9),k=t(97),P=t(125),p=t(65),r=t(51),g=t(130),f=t(126),_=t(127),V=t(85),D=function(c){Object(v.a)(a,c);var d=Object(y.a)(a);function a(){var n;Object(C.a)(this,a);for(var s=arguments.length,l=new Array(s),i=0;i<s;i++)l[i]=arguments[i];return n=d.call.apply(d,[this].concat(l)),n.state={type:"dot",size:10,color:"#aaaaaa",thickness:1,colorSecond:"#888888",thicknessSecond:3,factor:4},n.onTypeChanged=function(o){n.setState({type:o},function(){n.notifyChange()})},n.onSizeChanged=function(o){n.setState({size:o},function(){n.props.onGridSizeChange(n.state.size)})},n.onColorChanged=function(o){n.setState({color:o.target.value},function(){n.notifyChange()})},n.onSecondaryColorChanged=function(o){n.setState({colorSecond:o.target.value},function(){n.notifyChange()})},n.onThicknessChanged=function(o){n.setState({thickness:o},function(){n.notifyChange()})},n.onSecondaryThicknessChanged=function(o){n.setState({thicknessSecond:o},function(){n.notifyChange()})},n.onFactorChanged=function(o){n.setState({factor:o},function(){n.notifyChange()})},n}return Object(E.a)(a,[{key:"notifyChange",value:function(){this.state.type==="doubleMesh"?this.props.onChange({type:this.state.type,args:[{color:this.state.color,thickness:this.state.thickness},{color:this.state.colorSecond,thickness:this.state.thicknessSecond,factor:this.state.factor}]}):this.props.onChange({type:this.state.type,args:[{color:this.state.color,thickness:this.state.thickness}]})}},{key:"render",value:function(){return e.a.createElement(P.a,{title:"Grid Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(p.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Grid Type"),e.a.createElement(r.a,{span:13},e.a.createElement(g.a,{style:{width:"100%"},value:this.state.type,onChange:this.onTypeChanged},e.a.createElement(g.a.Option,{value:"dot"},"Dot"),e.a.createElement(g.a.Option,{value:"fixedDot"},"Fixed Dot"),e.a.createElement(g.a.Option,{value:"mesh"},"Mesh"),e.a.createElement(g.a.Option,{value:"doubleMesh"},"Double Mesh")))),e.a.createElement(p.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Grid Size"),e.a.createElement(r.a,{span:13},e.a.createElement(f.a,{min:1,max:20,step:1,value:this.state.size,onChange:this.onSizeChanged})),e.a.createElement(r.a,{span:1},e.a.createElement("div",{className:"slider-value"},this.state.size))),this.state.type==="doubleMesh"?e.a.createElement(e.a.Fragment,null,e.a.createElement(p.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Primary Color"),e.a.createElement(r.a,{span:13},e.a.createElement(_.a,{type:"color",value:this.state.color,style:{width:"100%"},onChange:this.onColorChanged}))),e.a.createElement(p.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Primary Thickness"),e.a.createElement(r.a,{span:13},e.a.createElement(f.a,{min:.5,max:10,step:.5,value:this.state.thickness,onChange:this.onThicknessChanged})),e.a.createElement(r.a,{span:1},e.a.createElement("div",{className:"slider-value"},this.state.thickness.toFixed(1)))),e.a.createElement(p.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Secondary Color"),e.a.createElement(r.a,{span:13},e.a.createElement(_.a,{type:"color",value:this.state.colorSecond,style:{width:"100%"},onChange:this.onSecondaryColorChanged}))),e.a.createElement(p.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Secondary Thickness"),e.a.createElement(r.a,{span:13},e.a.createElement(f.a,{min:.5,max:10,step:.5,value:this.state.thicknessSecond,onChange:this.onSecondaryThicknessChanged})),e.a.createElement(r.a,{span:1},e.a.createElement("div",{className:"slider-value"},this.state.thicknessSecond.toFixed(1)))),e.a.createElement(p.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Scale Factor"),e.a.createElement(r.a,{span:13},e.a.createElement(f.a,{min:1,max:10,step:1,value:this.state.factor,onChange:this.onFactorChanged})),e.a.createElement(r.a,{span:1},e.a.createElement("div",{className:"slider-value"},this.state.factor)))):e.a.createElement(e.a.Fragment,null,e.a.createElement(p.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Grid Color"),e.a.createElement(r.a,{span:13},e.a.createElement(_.a,{type:"color",value:this.state.color,style:{width:"100%"},onChange:this.onColorChanged}))),e.a.createElement(p.a,{align:"middle"},e.a.createElement(r.a,{span:8},"Thickness"),e.a.createElement(r.a,{span:13},e.a.createElement(f.a,{min:.5,max:10,step:.5,value:this.state.thickness,onChange:this.onThicknessChanged})),e.a.createElement(r.a,{span:1},e.a.createElement("div",{className:"slider-value"},this.state.thickness.toFixed(1))))))}}]),a}(e.a.Component),H=t(112),T=function(c){Object(v.a)(a,c);var d=Object(y.a)(a);function a(){var n;Object(C.a)(this,a);for(var s=arguments.length,l=new Array(s),i=0;i<s;i++)l[i]=arguments[i];return n=d.call.apply(d,[this].concat(l)),n.container=void 0,n.graph=void 0,n.onGridChanged=function(o){n.graph.drawGrid(o)},n.onGridSizeChanged=function(o){n.graph.setGridSize(o)},n.refContainer=function(o){n.container=o},n}return Object(E.a)(a,[{key:"componentDidMount",value:function(){this.graph=new k.a({container:this.container,grid:{visible:!0}});var s=this.graph.addNode({x:40,y:40,width:100,height:40,label:"Hello"}),l=this.graph.addNode({x:200,y:180,width:100,height:40,label:"Grid"});this.graph.addEdge({source:s,target:l})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(D,{onChange:this.onGridChanged,onGridSizeChange:this.onGridSizeChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),a}(e.a.Component),N=t(131),z=t(124),A=t(132),M=t(133),x=t(101),L=t(93),B=t(115),w=t(116),X=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},j=function(c){Object(v.a)(a,c);var d=Object(y.a)(a);function a(){return Object(C.a)(this,a),d.apply(this,arguments)}return Object(E.a)(a,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(N.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(z.a,{component:X}))),e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(A.a,null))),e.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(L.getParameters)(w.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(M.a,null)))))}}]),a}(e.a.Component),G=t(128),F=t(94),J=t(119),b=function(c){Object(v.a)(a,c);var d=Object(y.a)(a);function a(n){var s;return Object(C.a)(this,a),s=d.call(this,n),s.refContainer=function(l){s.container=l},a.restoreIframeSize(),s}return Object(E.a)(a,[{key:"componentDidMount",value:function(){var s=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){s.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return s.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var s=window.frameElement;if(s){var l=this.container.scrollHeight||this.container.clientHeight;s.style.width="100%",s.style.height="".concat(l+16,"px"),s.style.border="0",s.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(j,null),this.props.children)}}]),a}(e.a.Component);(function(c){var d=window.location.pathname,a="x6-iframe-size";function n(){var i=localStorage.getItem(a),o;if(i)try{o=JSON.parse(i)}catch(m){}else o={};return o}function s(){var i=window.frameElement;if(i){var o=i.style,m={width:o.width,height:o.height},U=n();U[d]=m,localStorage.setItem(a,JSON.stringify(U))}}c.saveIframeSize=s;function l(){var i=window.frameElement;if(i){var o=n(),m=o[d];m&&(i.style.width=m.width||"100%",i.style.height=m.height||"auto")}}c.restoreIframeSize=l})(b||(b={}));var Y=t(120),I=function(d){var a=d.children;return e.a.createElement(G.a.ErrorBoundary,null,e.a.createElement(F.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(b,null,a))};O.a.render(e.a.createElement(I,null,e.a.createElement(T,null)),document.getElementById("root"))}},[[104,1,2]]]);
