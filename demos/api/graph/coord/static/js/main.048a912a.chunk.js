(this["webpackJsonp@antv/x6-sites-demos-api.graph.coord"]=this["webpackJsonp@antv/x6-sites-demos-api.graph.coord"]||[]).push([[0],{100:function(f,m,t){"use strict";t.r(m),t.d(m,"host",function(){return u}),t.d(m,"getCodeSandboxParams",function(){return e}),t.d(m,"getStackblitzPrefillConfig",function(){return T});const u="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/graph/coord";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
`,isBinary:!1},"src/app.css":{content:`#root {
  width: 5000px;
  height: 5000px;
  position: relative;
}

.bar {
  position: absolute;
  height: 2px;
  top: 48px;
  left: 0;
  right: 0;
  background: linear-gradient(to right, #9198e5, #e66465);
}

.app {
  font-family: sans-serif;
  padding: 0;
  display: flex;
  padding: 16px 8px;
}

.app-left {
  width: 336px;
  top: 64px;
  padding: 0 8px;
  position: fixed;
  z-index: 10;
}

.app-content {
  flex: 1;
  height: 318px;
  margin-left: 344px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
  overflow: auto;
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

#elapsed {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
  font-variant: tabular-nums;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  border-radius: 2px;
}
`,isBinary:!1},"src/app.tsx":{content:`import * as React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = this.graph.addNode({
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      label: 'hello',
    })

    const target = this.graph.addNode({
      x: 240,
      y: 300,
      width: 80,
      height: 40,
      label: 'world',
    })

    this.graph.addEdge({ source, target })
    this.onChanged(defaults)
    this.start()
  }

  start() {
    const root = document.getElementById('root')!
    const v = document.createElement('div')
    const h = document.createElement('div')
    const c = document.createElement('div')

    v.style.position = 'absolute'
    v.style.width = '1px'
    v.style.top = '0'
    v.style.bottom = '0'
    v.style.left = '-100px'
    v.style.zIndex = \`99\`
    v.style.borderLeft = '1px dashed red'

    h.style.position = 'absolute'
    h.style.height = '1px'
    h.style.left = '0'
    h.style.right = '0'
    h.style.top = '-100px'
    h.style.zIndex = \`99\`
    h.style.borderTop = '1px dashed red'

    c.style.position = 'absolute'
    c.style.display = 'inline-block'
    c.style.fontSize = '12px'
    c.style.zIndex = \`99\`
    c.style.padding = '4px 8px'
    c.style.borderRadius = '2px'
    c.style.lineHeight = '20px'
    c.style.background = '#f6ffed'
    c.style.border = '1px solid #b7eb8f'

    root.appendChild(v)
    root.appendChild(h)
    root.appendChild(c)

    document.addEventListener('mousemove', (e) => {
      const target = e.target as HTMLElement
      if (
        this.container.contains(target) ||
        this.container === target ||
        target === v ||
        target === h ||
        target === c
      ) {
        const pageX = e.pageX
        const pageY = e.pageY
        const clientX = e.clientX
        const clientY = e.clientY
        v.style.left = \`\${pageX + 2}px\`
        h.style.top = \`\${pageY + 2}px\`

        c.style.left = \`\${pageX + 10}px\`
        c.style.top = \`\${pageY + 10}px\`

        const p1 = this.graph.pageToLocal(pageX, pageY)
        const p2 = this.graph.localToPage(p1)
        const p3 = this.graph.localToClient(p1)
        const p4 = this.graph.localToGraph(p1)

        c.innerHTML = \`
      <div>Mouse Page Position(e.pageX, e.pageY): \${pageX} x \${pageY}</div>
      <div>Mouse Client Position(e.clientX, e.clientY): \${clientX} x \${clientY}</div>
      <div>Local Position: \${p1.x} x \${p1.y}</div>
      <div>Local to Page: \${p2.x} x \${p2.y}</div>
      <div>Local to Client: \${p3.x} x \${p3.y}</div>
      <div>Local to Graph: \${p4.x} x \${p4.y}</div>
      \`
      } else {
        v.style.left = \`\${-1000}px\`
        h.style.top = \`\${-1000}px\`
        c.style.left = \`\${-10000}px\`
        c.style.top = \`\${-10000}px\`
      }
    })
  }

  onChanged = (settgins: State) => {
    this.graph.scale(settgins.scale)
    this.graph.translate(settgins.tx, settgins.ty)
    document.documentElement.scrollLeft = settgins.scrollLeft
    document.documentElement.scrollTop = settgins.scrollTop
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
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
`,isBinary:!1},"src/index.tsx":{content:`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"src/settings.tsx":{content:`import React from 'react'
import { Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  scale: number
  tx: number
  ty: number
  scrollLeft: number
  scrollTop: number
}

export const defaults: State = {
  scale: 0.5,
  tx: 20,
  ty: 20,
  scrollLeft: 50,
  scrollTop: 0,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  componentDidMount() {
    document.addEventListener('scroll', () => {
      this.setState({
        scrollLeft: window.scrollX,
        scrollTop: window.scrollY,
      })
    })
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onScaleChanged = (scale: number) => {
    this.setState({ scale }, () => {
      this.notifyChange()
    })
  }

  onTxChanged = (tx: number) => {
    this.setState({ tx }, () => {
      this.notifyChange()
    })
  }

  onTyChanged = (ty: number) => {
    this.setState({ ty }, () => {
      this.notifyChange()
    })
  }

  onScrollLeftChanged = (scrollX: number) => {
    this.setState({ scrollLeft: scrollX }, () => {
      this.notifyChange()
    })
  }

  onScrollTopChanged = (scrollY: number) => {
    this.setState({ scrollTop: scrollY }, () => {
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
          <Col span={7}>scale</Col>
          <Col span={12}>
            <Slider
              min={0.1}
              max={2}
              step={0.1}
              value={this.state.scale}
              onChange={this.onScaleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scale}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>translateX</Col>
          <Col span={12}>
            <Slider
              min={-50}
              max={50}
              step={1}
              value={this.state.tx}
              onChange={this.onTxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.tx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>translateY</Col>
          <Col span={12}>
            <Slider
              min={-50}
              max={50}
              step={1}
              value={this.state.ty}
              onChange={this.onTyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.ty}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>scrollLeft</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={document.body.scrollWidth - document.body.clientWidth}
              step={1}
              value={this.state.scrollLeft}
              onChange={this.onScrollLeftChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scrollLeft}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>scrollTop</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={document.body.scrollHeight - document.body.clientHeight}
              step={1}
              value={this.state.scrollTop}
              onChange={this.onScrollTopChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scrollTop}</div>
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
`,isBinary:!1}}}}function T(){return{title:"api/graph/coord",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
`,"src/app.css":`#root {
  width: 5000px;
  height: 5000px;
  position: relative;
}

.bar {
  position: absolute;
  height: 2px;
  top: 48px;
  left: 0;
  right: 0;
  background: linear-gradient(to right, #9198e5, #e66465);
}

.app {
  font-family: sans-serif;
  padding: 0;
  display: flex;
  padding: 16px 8px;
}

.app-left {
  width: 336px;
  top: 64px;
  padding: 0 8px;
  position: fixed;
  z-index: 10;
}

.app-content {
  flex: 1;
  height: 318px;
  margin-left: 344px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
  overflow: auto;
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

#elapsed {
  color: #52c41a;
  background: #f6ffed;
  border-color: #b7eb8f;
  font-variant: tabular-nums;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  border-radius: 2px;
}
`,"src/app.tsx":`import * as React from 'react'
import { Graph } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      grid: true,
    })

    const source = this.graph.addNode({
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      label: 'hello',
    })

    const target = this.graph.addNode({
      x: 240,
      y: 300,
      width: 80,
      height: 40,
      label: 'world',
    })

    this.graph.addEdge({ source, target })
    this.onChanged(defaults)
    this.start()
  }

  start() {
    const root = document.getElementById('root')!
    const v = document.createElement('div')
    const h = document.createElement('div')
    const c = document.createElement('div')

    v.style.position = 'absolute'
    v.style.width = '1px'
    v.style.top = '0'
    v.style.bottom = '0'
    v.style.left = '-100px'
    v.style.zIndex = \`99\`
    v.style.borderLeft = '1px dashed red'

    h.style.position = 'absolute'
    h.style.height = '1px'
    h.style.left = '0'
    h.style.right = '0'
    h.style.top = '-100px'
    h.style.zIndex = \`99\`
    h.style.borderTop = '1px dashed red'

    c.style.position = 'absolute'
    c.style.display = 'inline-block'
    c.style.fontSize = '12px'
    c.style.zIndex = \`99\`
    c.style.padding = '4px 8px'
    c.style.borderRadius = '2px'
    c.style.lineHeight = '20px'
    c.style.background = '#f6ffed'
    c.style.border = '1px solid #b7eb8f'

    root.appendChild(v)
    root.appendChild(h)
    root.appendChild(c)

    document.addEventListener('mousemove', (e) => {
      const target = e.target as HTMLElement
      if (
        this.container.contains(target) ||
        this.container === target ||
        target === v ||
        target === h ||
        target === c
      ) {
        const pageX = e.pageX
        const pageY = e.pageY
        const clientX = e.clientX
        const clientY = e.clientY
        v.style.left = \`\${pageX + 2}px\`
        h.style.top = \`\${pageY + 2}px\`

        c.style.left = \`\${pageX + 10}px\`
        c.style.top = \`\${pageY + 10}px\`

        const p1 = this.graph.pageToLocal(pageX, pageY)
        const p2 = this.graph.localToPage(p1)
        const p3 = this.graph.localToClient(p1)
        const p4 = this.graph.localToGraph(p1)

        c.innerHTML = \`
      <div>Mouse Page Position(e.pageX, e.pageY): \${pageX} x \${pageY}</div>
      <div>Mouse Client Position(e.clientX, e.clientY): \${clientX} x \${clientY}</div>
      <div>Local Position: \${p1.x} x \${p1.y}</div>
      <div>Local to Page: \${p2.x} x \${p2.y}</div>
      <div>Local to Client: \${p3.x} x \${p3.y}</div>
      <div>Local to Graph: \${p4.x} x \${p4.y}</div>
      \`
      } else {
        v.style.left = \`\${-1000}px\`
        h.style.top = \`\${-1000}px\`
        c.style.left = \`\${-10000}px\`
        c.style.top = \`\${-10000}px\`
      }
    })
  }

  onChanged = (settgins: State) => {
    this.graph.scale(settgins.scale)
    this.graph.translate(settgins.tx, settgins.ty)
    document.documentElement.scrollLeft = settgins.scrollLeft
    document.documentElement.scrollTop = settgins.scrollTop
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-left">
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
`,"src/index.tsx":`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,"src/settings.tsx":`import React from 'react'
import { Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  scale: number
  tx: number
  ty: number
  scrollLeft: number
  scrollTop: number
}

export const defaults: State = {
  scale: 0.5,
  tx: 20,
  ty: 20,
  scrollLeft: 50,
  scrollTop: 0,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  componentDidMount() {
    document.addEventListener('scroll', () => {
      this.setState({
        scrollLeft: window.scrollX,
        scrollTop: window.scrollY,
      })
    })
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onScaleChanged = (scale: number) => {
    this.setState({ scale }, () => {
      this.notifyChange()
    })
  }

  onTxChanged = (tx: number) => {
    this.setState({ tx }, () => {
      this.notifyChange()
    })
  }

  onTyChanged = (ty: number) => {
    this.setState({ ty }, () => {
      this.notifyChange()
    })
  }

  onScrollLeftChanged = (scrollX: number) => {
    this.setState({ scrollLeft: scrollX }, () => {
      this.notifyChange()
    })
  }

  onScrollTopChanged = (scrollY: number) => {
    this.setState({ scrollTop: scrollY }, () => {
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
          <Col span={7}>scale</Col>
          <Col span={12}>
            <Slider
              min={0.1}
              max={2}
              step={0.1}
              value={this.state.scale}
              onChange={this.onScaleChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scale}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>translateX</Col>
          <Col span={12}>
            <Slider
              min={-50}
              max={50}
              step={1}
              value={this.state.tx}
              onChange={this.onTxChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.tx}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>translateY</Col>
          <Col span={12}>
            <Slider
              min={-50}
              max={50}
              step={1}
              value={this.state.ty}
              onChange={this.onTyChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.ty}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>scrollLeft</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={document.body.scrollWidth - document.body.clientWidth}
              step={1}
              value={this.state.scrollLeft}
              onChange={this.onScrollLeftChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scrollLeft}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={7}>scrollTop</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={document.body.scrollHeight - document.body.clientHeight}
              step={1}
              value={this.state.scrollTop}
              onChange={this.onScrollTopChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.scrollTop}</div>
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
`}}}},103:function(f,m,t){},105:function(f,m,t){"use strict";t.r(m);var u=t(0),e=t.n(u),T=t(30),D=t.n(T),E=t(1),C=t(3),b=t(4),w=t(5),_=t(84),M=t(109),g=t(56),c=t(40),v=t(110),K=t(70),O={scale:.5,tx:20,ty:20,scrollLeft:50,scrollTop:0},j=function(p){Object(b.a)(l,p);var d=Object(w.a)(l);function l(){var n;Object(E.a)(this,l);for(var s=arguments.length,r=new Array(s),o=0;o<s;o++)r[o]=arguments[o];return n=d.call.apply(d,[this].concat(r)),n.state=O,n.onScaleChanged=function(a){n.setState({scale:a},function(){n.notifyChange()})},n.onTxChanged=function(a){n.setState({tx:a},function(){n.notifyChange()})},n.onTyChanged=function(a){n.setState({ty:a},function(){n.notifyChange()})},n.onScrollLeftChanged=function(a){n.setState({scrollLeft:a},function(){n.notifyChange()})},n.onScrollTopChanged=function(a){n.setState({scrollTop:a},function(){n.notifyChange()})},n}return Object(C.a)(l,[{key:"componentDidMount",value:function(){var s=this;document.addEventListener("scroll",function(){s.setState({scrollLeft:window.scrollX,scrollTop:window.scrollY})})}},{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return e.a.createElement(M.a,{title:"Settings",size:"small",bordered:!1,style:{width:320}},e.a.createElement(g.a,{align:"middle"},e.a.createElement(c.a,{span:7},"scale"),e.a.createElement(c.a,{span:12},e.a.createElement(v.a,{min:.1,max:2,step:.1,value:this.state.scale,onChange:this.onScaleChanged})),e.a.createElement(c.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.scale))),e.a.createElement(g.a,{align:"middle"},e.a.createElement(c.a,{span:7},"translateX"),e.a.createElement(c.a,{span:12},e.a.createElement(v.a,{min:-50,max:50,step:1,value:this.state.tx,onChange:this.onTxChanged})),e.a.createElement(c.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.tx))),e.a.createElement(g.a,{align:"middle"},e.a.createElement(c.a,{span:7},"translateY"),e.a.createElement(c.a,{span:12},e.a.createElement(v.a,{min:-50,max:50,step:1,value:this.state.ty,onChange:this.onTyChanged})),e.a.createElement(c.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.ty))),e.a.createElement(g.a,{align:"middle"},e.a.createElement(c.a,{span:7},"scrollLeft"),e.a.createElement(c.a,{span:12},e.a.createElement(v.a,{min:0,max:document.body.scrollWidth-document.body.clientWidth,step:1,value:this.state.scrollLeft,onChange:this.onScrollLeftChanged})),e.a.createElement(c.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.scrollLeft))),e.a.createElement(g.a,{align:"middle"},e.a.createElement(c.a,{span:7},"scrollTop"),e.a.createElement(c.a,{span:12},e.a.createElement(v.a,{min:0,max:document.body.scrollHeight-document.body.clientHeight,step:1,value:this.state.scrollTop,onChange:this.onScrollTopChanged})),e.a.createElement(c.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.scrollTop))))}}]),l}(e.a.Component),Q=t(96),z=function(p){Object(b.a)(l,p);var d=Object(w.a)(l);function l(){var n;Object(E.a)(this,l);for(var s=arguments.length,r=new Array(s),o=0;o<s;o++)r[o]=arguments[o];return n=d.call.apply(d,[this].concat(r)),n.container=void 0,n.graph=void 0,n.onChanged=function(a){n.graph.scale(a.scale),n.graph.translate(a.tx,a.ty),document.documentElement.scrollLeft=a.scrollLeft,document.documentElement.scrollTop=a.scrollTop},n.refContainer=function(a){n.container=a},n}return Object(C.a)(l,[{key:"componentDidMount",value:function(){this.graph=new _.a({container:this.container,grid:!0});var s=this.graph.addNode({x:100,y:100,width:80,height:40,label:"hello"}),r=this.graph.addNode({x:240,y:300,width:80,height:40,label:"world"});this.graph.addEdge({source:s,target:r}),this.onChanged(O),this.start()}},{key:"start",value:function(){var s=this,r=document.getElementById("root"),o=document.createElement("div"),a=document.createElement("div"),i=document.createElement("div");o.style.position="absolute",o.style.width="1px",o.style.top="0",o.style.bottom="0",o.style.left="-100px",o.style.zIndex="99",o.style.borderLeft="1px dashed red",a.style.position="absolute",a.style.height="1px",a.style.left="0",a.style.right="0",a.style.top="-100px",a.style.zIndex="99",a.style.borderTop="1px dashed red",i.style.position="absolute",i.style.display="inline-block",i.style.fontSize="12px",i.style.zIndex="99",i.style.padding="4px 8px",i.style.borderRadius="2px",i.style.lineHeight="20px",i.style.background="#f6ffed",i.style.border="1px solid #b7eb8f",r.appendChild(o),r.appendChild(a),r.appendChild(i),document.addEventListener("mousemove",function(h){var x=h.target;if(s.container.contains(x)||s.container===x||x===o||x===a||x===i){var S=h.pageX,R=h.pageY,W=h.clientX,Z=h.clientY;o.style.left="".concat(S+2,"px"),a.style.top="".concat(R+2,"px"),i.style.left="".concat(S+10,"px"),i.style.top="".concat(R+10,"px");var y=s.graph.pageToLocal(S,R),N=s.graph.localToPage(y),P=s.graph.localToClient(y),A=s.graph.localToGraph(y);i.innerHTML=`
      <div>Mouse Page Position(e.pageX, e.pageY): `.concat(S," x ").concat(R,`</div>
      <div>Mouse Client Position(e.clientX, e.clientY): `).concat(W," x ").concat(Z,`</div>
      <div>Local Position: `).concat(y.x," x ").concat(y.y,`</div>
      <div>Local to Page: `).concat(N.x," x ").concat(N.y,`</div>
      <div>Local to Client: `).concat(P.x," x ").concat(P.y,`</div>
      <div>Local to Graph: `).concat(A.x," x ").concat(A.y,`</div>
      `)}else o.style.left="".concat(-1e3,"px"),a.style.top="".concat(-1e3,"px"),i.style.left="".concat(-1e4,"px"),i.style.top="".concat(-1e4,"px")})}},{key:"render",value:function(){return u.createElement("div",{className:"app"},u.createElement("div",{className:"app-left"},u.createElement(j,{onChange:this.onChanged})),u.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),l}(u.Component),I=t(113),$=t(108),Y=t(114),V=t(115),L=t(86),H=t(80),q=t(99),X=t(100),k=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},B=function(p){Object(b.a)(l,p);var d=Object(w.a)(l);function l(){return Object(E.a)(this,l),d.apply(this,arguments)}return Object(C.a)(l,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(L.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(I.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(L.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement($.a,{component:k}))),e.a.createElement(L.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(X.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(Y.a,null))),e.a.createElement(L.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(H.getParameters)(X.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(V.a,null)))))}}]),l}(e.a.Component),G=t(111),F=t(81),ee=t(103),U=function(p){Object(b.a)(l,p);var d=Object(w.a)(l);function l(n){var s;return Object(E.a)(this,l),s=d.call(this,n),s.refContainer=function(r){s.container=r},l.restoreIframeSize(),s}return Object(C.a)(l,[{key:"componentDidMount",value:function(){var s=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){s.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return s.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var s=window.frameElement;if(s){var r=this.container.scrollHeight||this.container.clientHeight;s.style.width="100%",s.style.height="".concat(r+16,"px"),s.style.border="0",s.style.overflow="hidden",l.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(B,null),this.props.children)}}]),l}(e.a.Component);(function(p){var d=window.location.pathname,l="x6-iframe-size";function n(){var o=localStorage.getItem(l),a;if(o)try{a=JSON.parse(o)}catch(i){}else a={};return a}function s(){var o=window.frameElement;if(o){var a=o.style,i={width:a.width,height:a.height},h=n();h[d]=i,localStorage.setItem(l,JSON.stringify(h))}}p.saveIframeSize=s;function r(){var o=window.frameElement;if(o){var a=n(),i=a[d];i&&(o.style.width=i.width||"100%",o.style.height=i.height||"auto")}}p.restoreIframeSize=r})(U||(U={}));var ne=t(104),J=function(d){var l=d.children;return e.a.createElement(G.a.ErrorBoundary,null,e.a.createElement(F.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(U,null,l))};D.a.render(e.a.createElement(J,null,e.a.createElement("div",{className:"bar"}),e.a.createElement(z,null)),document.getElementById("root"))},88:function(f,m,t){f.exports=t(105)},96:function(f,m,t){},99:function(f,m,t){}},[[88,1,2]]]);
