(this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.group.expand-shrink"]=this["webpackJsonp@antv/x6-sites-demos-tutorial.basic.group.expand-shrink"]||[]).push([[0],{101:function(f,p,e){},102:function(f,p,e){"use strict";e.r(p),e.d(p,"host",function(){return z}),e.d(p,"getCodeSandboxParams",function(){return n}),e.d(p,"getStackblitzPrefillConfig",function(){return D});const z="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/tutorial/basic/group/expand-shrink";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
  height: 240px;
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
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private embedPadding: number = 20

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      embedding: {
        enabled: true,
      },
    })

    const source = graph.addNode({
      x: 80,
      y: 100,
      width: 80,
      height: 40,
      label: 'Child',
      zIndex: 10,
      attrs: {
        body: {
          stroke: 'none',
          fill: '#3199FF',
        },
        label: {
          fill: '#fff',
        },
      },
    })

    const target = graph.addNode({
      x: 280,
      y: 80,
      width: 80,
      height: 40,
      label: 'Child',
      zIndex: 10,
      attrs: {
        body: {
          stroke: 'none',
          fill: '#47C769',
        },
        label: {
          fill: '#fff',
        },
      },
    })

    const parent = graph.addNode({
      x: 40,
      y: 40,
      width: 360,
      height: 160,
      zIndex: 1,
      label: 'Parent',
      attrs: {
        body: {
          fill: '#fffbe6',
        },
      },
    })

    parent.addChild(source)
    parent.addChild(target)

    let ctrlPressed = false

    graph.on('node:embedding', ({ e }: { e: JQuery.MouseMoveEvent }) => {
      ctrlPressed = e.metaKey || e.ctrlKey
    })

    graph.on('node:embedded', () => {
      ctrlPressed = false
    })

    graph.on('node:change:size', ({ node, options }) => {
      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originSize', node.getSize())
      }
    })

    graph.on('node:change:position', ({ node, options }) => {
      if (options.skipParentHandler || ctrlPressed) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }

      const parent = node.getParent()
      if (parent && parent.isNode()) {
        let originSize = parent.prop('originSize')
        if (originSize == null) {
          originSize = parent.getSize()
          parent.prop('originSize', originSize)
        }

        let originPosition = parent.prop('originPosition')
        if (originPosition == null) {
          originPosition = parent.getPosition()
          parent.prop('originPosition', originPosition)
        }

        let x = originPosition.x
        let y = originPosition.y
        let cornerX = originPosition.x + originSize.width
        let cornerY = originPosition.y + originSize.height
        let hasChange = false

        const children = parent.getChildren()
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(this.embedPadding)
            const corner = bbox.getCorner()

            if (bbox.x < x) {
              x = bbox.x
              hasChange = true
            }

            if (bbox.y < y) {
              y = bbox.y
              hasChange = true
            }

            if (corner.x > cornerX) {
              cornerX = corner.x
              hasChange = true
            }

            if (corner.y > cornerY) {
              cornerY = corner.y
              hasChange = true
            }
          })
        }

        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y },
            },
            // Note that we also pass a flag so that we know we shouldn't
            // adjust the \`originPosition\` and \`originSize\` in our handlers.
            { skipParentHandler: true },
          )
        }
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onSettingsChanged = (state: State) => {
    this.embedPadding = state.padding
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
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
import { Card, Row, Col, Slider } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  padding: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    padding: 20,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onPaddingChanged = (padding: number) => {
    this.setState({ padding }, () => {
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
          <Col span={6}>Padding</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={40}
              step={1}
              value={this.state.padding}
              onChange={this.onPaddingChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.padding}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ borderTop: '1px solid #f0f0f0' }}>
          <Col style={{ padding: '24px 0 8px 0', color: '#666' }}>
            Press and hold on{' '}
            <strong style={{ color: '#faad14' }}>Ctrl or Command</strong> key,
            then move the child node to remove it from it's parent node.
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
`,isBinary:!1}}}}function D(){return{title:"tutorial/basic/group/expand-shrink",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
  height: 240px;
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
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private embedPadding: number = 20

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      embedding: {
        enabled: true,
      },
    })

    const source = graph.addNode({
      x: 80,
      y: 100,
      width: 80,
      height: 40,
      label: 'Child',
      zIndex: 10,
      attrs: {
        body: {
          stroke: 'none',
          fill: '#3199FF',
        },
        label: {
          fill: '#fff',
        },
      },
    })

    const target = graph.addNode({
      x: 280,
      y: 80,
      width: 80,
      height: 40,
      label: 'Child',
      zIndex: 10,
      attrs: {
        body: {
          stroke: 'none',
          fill: '#47C769',
        },
        label: {
          fill: '#fff',
        },
      },
    })

    const parent = graph.addNode({
      x: 40,
      y: 40,
      width: 360,
      height: 160,
      zIndex: 1,
      label: 'Parent',
      attrs: {
        body: {
          fill: '#fffbe6',
        },
      },
    })

    parent.addChild(source)
    parent.addChild(target)

    let ctrlPressed = false

    graph.on('node:embedding', ({ e }: { e: JQuery.MouseMoveEvent }) => {
      ctrlPressed = e.metaKey || e.ctrlKey
    })

    graph.on('node:embedded', () => {
      ctrlPressed = false
    })

    graph.on('node:change:size', ({ node, options }) => {
      if (options.skipParentHandler) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originSize', node.getSize())
      }
    })

    graph.on('node:change:position', ({ node, options }) => {
      if (options.skipParentHandler || ctrlPressed) {
        return
      }

      const children = node.getChildren()
      if (children && children.length) {
        node.prop('originPosition', node.getPosition())
      }

      const parent = node.getParent()
      if (parent && parent.isNode()) {
        let originSize = parent.prop('originSize')
        if (originSize == null) {
          originSize = parent.getSize()
          parent.prop('originSize', originSize)
        }

        let originPosition = parent.prop('originPosition')
        if (originPosition == null) {
          originPosition = parent.getPosition()
          parent.prop('originPosition', originPosition)
        }

        let x = originPosition.x
        let y = originPosition.y
        let cornerX = originPosition.x + originSize.width
        let cornerY = originPosition.y + originSize.height
        let hasChange = false

        const children = parent.getChildren()
        if (children) {
          children.forEach((child) => {
            const bbox = child.getBBox().inflate(this.embedPadding)
            const corner = bbox.getCorner()

            if (bbox.x < x) {
              x = bbox.x
              hasChange = true
            }

            if (bbox.y < y) {
              y = bbox.y
              hasChange = true
            }

            if (corner.x > cornerX) {
              cornerX = corner.x
              hasChange = true
            }

            if (corner.y > cornerY) {
              cornerY = corner.y
              hasChange = true
            }
          })
        }

        if (hasChange) {
          parent.prop(
            {
              position: { x, y },
              size: { width: cornerX - x, height: cornerY - y },
            },
            // Note that we also pass a flag so that we know we shouldn't
            // adjust the \`originPosition\` and \`originSize\` in our handlers.
            { skipParentHandler: true },
          )
        }
      }
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onSettingsChanged = (state: State) => {
    this.embedPadding = state.padding
  }

  render() {
    return (
      <div className="app">
        <div className="app-side">
          <Settings onChange={this.onSettingsChanged} />
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
import { Card, Row, Col, Slider } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (res: State) => void
}

export interface State {
  padding: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    padding: 20,
  }

  notifyChange() {
    this.props.onChange({
      ...this.state,
    })
  }

  onPaddingChanged = (padding: number) => {
    this.setState({ padding }, () => {
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
          <Col span={6}>Padding</Col>
          <Col span={12}>
            <Slider
              min={0}
              max={40}
              step={1}
              value={this.state.padding}
              onChange={this.onPaddingChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.padding}</div>
          </Col>
        </Row>
        <Row align="middle" style={{ borderTop: '1px solid #f0f0f0' }}>
          <Col style={{ padding: '24px 0 8px 0', color: '#666' }}>
            Press and hold on{' '}
            <strong style={{ color: '#faad14' }}>Ctrl or Command</strong> key,
            then move the child node to remove it from it's parent node.
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
`}}}},105:function(f,p,e){},107:function(f,p,e){"use strict";e.r(p);var z=e(0),n=e.n(z),D=e(31),V=e.n(D),C=e(1),w=e(3),P=e(4),S=e(5),H=e(86),B=e(74),F=e(111),T=e(57),U=e(41),J=e(112),rn=e(71),Y=function(l){Object(P.a)(t,l);var d=Object(S.a)(t);function t(){var o;Object(C.a)(this,t);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return o=d.call.apply(d,[this].concat(i)),o.state={padding:20},o.onPaddingChanged=function(s){o.setState({padding:s},function(){o.notifyChange()})},o}return Object(w.a)(t,[{key:"notifyChange",value:function(){this.props.onChange(Object(B.a)({},this.state))}},{key:"render",value:function(){return n.a.createElement(F.a,{title:"Settings",size:"small",bordered:!1,style:{width:320}},n.a.createElement(T.a,{align:"middle"},n.a.createElement(U.a,{span:6},"Padding"),n.a.createElement(U.a,{span:12},n.a.createElement(J.a,{min:0,max:40,step:1,value:this.state.padding,onChange:this.onPaddingChanged})),n.a.createElement(U.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.padding))),n.a.createElement(T.a,{align:"middle",style:{borderTop:"1px solid #f0f0f0"}},n.a.createElement(U.a,{style:{padding:"24px 0 8px 0",color:"#666"}},"Press and hold on"," ",n.a.createElement("strong",{style:{color:"#faad14"}},"Ctrl or Command")," key, then move the child node to remove it from it's parent node.")))}}]),t}(n.a.Component),an=e(98),G=function(l){Object(P.a)(t,l);var d=Object(S.a)(t);function t(){var o;Object(C.a)(this,t);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return o=d.call.apply(d,[this].concat(i)),o.container=void 0,o.embedPadding=20,o.refContainer=function(s){o.container=s},o.onSettingsChanged=function(s){o.embedPadding=s.padding},o}return Object(w.a)(t,[{key:"componentDidMount",value:function(){var a=this,i=new H.a({container:this.container,grid:!0,embedding:{enabled:!0}}),r=i.addNode({x:80,y:100,width:80,height:40,label:"Child",zIndex:10,attrs:{body:{stroke:"none",fill:"#3199FF"},label:{fill:"#fff"}}}),s=i.addNode({x:280,y:80,width:80,height:40,label:"Child",zIndex:10,attrs:{body:{stroke:"none",fill:"#47C769"},label:{fill:"#fff"}}}),m=i.addNode({x:40,y:40,width:360,height:160,zIndex:1,label:"Parent",attrs:{body:{fill:"#fffbe6"}}});m.addChild(r),m.addChild(s);var x=!1;i.on("node:embedding",function(h){var c=h.e;x=c.metaKey||c.ctrlKey}),i.on("node:embedded",function(){x=!1}),i.on("node:change:size",function(h){var c=h.node,M=h.options;if(M.skipParentHandler)return;var v=c.getChildren();v&&v.length&&c.prop("originSize",c.getSize())}),i.on("node:change:position",function(h){var c=h.node,M=h.options;if(M.skipParentHandler||x)return;var v=c.getChildren();v&&v.length&&c.prop("originPosition",c.getPosition());var u=c.getParent();if(u&&u.isNode()){var E=u.prop("originSize");E==null&&(E=u.getSize(),u.prop("originSize",E));var g=u.prop("originPosition");g==null&&(g=u.getPosition(),u.prop("originPosition",g));var R=g.x,A=g.y,X=g.x+E.width,j=g.y+E.height,b=!1,k=u.getChildren();k&&k.forEach(function(on){var y=on.getBBox().inflate(a.embedPadding),N=y.getCorner();y.x<R&&(R=y.x,b=!0),y.y<A&&(A=y.y,b=!0),N.x>X&&(X=N.x,b=!0),N.y>j&&(j=N.y,b=!0)}),b&&u.prop({position:{x:R,y:A},size:{width:X-R,height:j-A}},{skipParentHandler:!0})}})}},{key:"render",value:function(){return n.a.createElement("div",{className:"app"},n.a.createElement("div",{className:"app-side"},n.a.createElement(Y,{onChange:this.onSettingsChanged})),n.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),t}(n.a.Component),K=e(115),W=e(110),Q=e(116),Z=e(117),O=e(88),$=e(82),sn=e(101),I=e(102),_=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},q=function(l){Object(P.a)(t,l);var d=Object(S.a)(t);function t(){return Object(C.a)(this,t),d.apply(this,arguments)}return Object(w.a)(t,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(K.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(W.a,{component:_}))),n.a.createElement(O.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(I.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(Q.a,null))),n.a.createElement(O.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object($.getParameters)(I.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(Z.a,null)))))}}]),t}(n.a.Component),nn=e(113),en=e(83),dn=e(105),L=function(l){Object(P.a)(t,l);var d=Object(S.a)(t);function t(o){var a;return Object(C.a)(this,t),a=d.call(this,o),a.refContainer=function(i){a.container=i},t.restoreIframeSize(),a}return Object(w.a)(t,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){a.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var r=document.getElementById("loading");r&&r.parentNode&&r.parentNode.removeChild(r)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var i=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(i+16,"px"),a.style.border="0",a.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(q,null),this.props.children)}}]),t}(n.a.Component);(function(l){var d=window.location.pathname,t="x6-iframe-size";function o(){var r=localStorage.getItem(t),s;if(r)try{s=JSON.parse(r)}catch(m){}else s={};return s}function a(){var r=window.frameElement;if(r){var s=r.style,m={width:s.width,height:s.height},x=o();x[d]=m,localStorage.setItem(t,JSON.stringify(x))}}l.saveIframeSize=a;function i(){var r=window.frameElement;if(r){var s=o(),m=s[d];m&&(r.style.width=m.width||"100%",r.style.height=m.height||"auto")}}l.restoreIframeSize=i})(L||(L={}));var ln=e(106),tn=function(d){var t=d.children;return n.a.createElement(nn.a.ErrorBoundary,null,n.a.createElement(en.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(L,null,t))};V.a.render(n.a.createElement(tn,null,n.a.createElement(G,null)),document.getElementById("root"))},90:function(f,p,e){f.exports=e(107)},98:function(f,p,e){}},[[90,1,2]]]);
