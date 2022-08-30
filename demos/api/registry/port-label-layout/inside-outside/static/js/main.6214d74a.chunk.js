(this["webpackJsonp@antv/x6-sites-demos-api.registry.port-label-layout.inside-outside"]=this["webpackJsonp@antv/x6-sites-demos-api.registry.port-label-layout.inside-outside"]||[]).push([[0],{102:function(u,c,n){},103:function(u,c,n){"use strict";n.r(c),n.d(c,"host",function(){return C}),n.d(c,"getCodeSandboxParams",function(){return e}),n.d(c,"getStackblitzPrefillConfig",function(){return b});const C="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/registry/port-label-layout/inside-outside";function e(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
    })

    this.node = graph.addNode({
      shape: 'ellipse',
      x: 70,
      y: 85,
      width: 260,
      height: 100,
      attrs: {
        label: {
          text: 'outside',
          fill: '#888',
          fontSize: 12,
        },
        body: {
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          a: {
            position: {
              name: 'ellipseSpread',
              args: {
                compensateRotate: true,
              },
            },
            label: {
              position: {
                name: 'outside',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#31d0c6',
                strokeWidth: 2,
                r: 10,
                magnet: true,
              },
              text: {
                fill: '#6a6c8a',
                fontSize: 12,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({ attrs: { text: { text: \`P \${index}\` } }, group: 'a' })
    })
  }

  onAttrsChanged = ({ position, offset }: State) => {
    this.node.prop('ports/groups/a/label/position', {
      name: position,
      args: { offset },
    })

    this.node.attr('label/text', position)
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
import { Radio, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  offset: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'outside',
    offset: 15,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
    }

    return (
      <Card
        title="Port Label Position"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row
          align="middle"
          justify="center"
          style={{
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16,
            marginBottom: 16,
          }}
        >
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'inside'}>
                inside
              </Radio>
              <Radio style={radioStyle} value={'outside'}>
                outside
              </Radio>
              <Radio style={radioStyle} value={'insideOriented'}>
                insideOriented
              </Radio>
              <Radio style={radioStyle} value={'outsideOriented'}>
                outsideOriented
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 16 }}>
            offset
          </Col>
          <Col span={14}>
            <Slider
              min={-30}
              max={30}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
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
`,isBinary:!1}}}}function b(){return{title:"api/registry/port-label-layout/inside-outside",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { Graph, Node } from '@antv/x6'
import { Settings, State } from './settings'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private node: Node

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: {
        visible: true,
      },
    })

    this.node = graph.addNode({
      shape: 'ellipse',
      x: 70,
      y: 85,
      width: 260,
      height: 100,
      attrs: {
        label: {
          text: 'outside',
          fill: '#888',
          fontSize: 12,
        },
        body: {
          strokeWidth: 1,
        },
      },
      ports: {
        groups: {
          a: {
            position: {
              name: 'ellipseSpread',
              args: {
                compensateRotate: true,
              },
            },
            label: {
              position: {
                name: 'outside',
              },
            },
            attrs: {
              circle: {
                fill: '#ffffff',
                stroke: '#31d0c6',
                strokeWidth: 2,
                r: 10,
                magnet: true,
              },
              text: {
                fill: '#6a6c8a',
                fontSize: 12,
              },
            },
          },
        },
      },
    })

    Array.from({ length: 10 }).forEach((_, index) => {
      this.node.addPort({ attrs: { text: { text: \`P \${index}\` } }, group: 'a' })
    })
  }

  onAttrsChanged = ({ position, offset }: State) => {
    this.node.prop('ports/groups/a/label/position', {
      name: position,
      args: { offset },
    })

    this.node.attr('label/text', position)
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
import { Radio, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  position: string
  offset: number
}

export class Settings extends React.Component<Props, State> {
  state: State = {
    position: 'outside',
    offset: 15,
  }

  notifyChange() {
    this.props.onChange(this.state)
  }

  onOffsetChanged = (offset: number) => {
    this.setState({ offset }, () => {
      this.notifyChange()
    })
  }

  onPositionChange = (e: any) => {
    this.setState(
      {
        position: e.target.value,
      },
      () => {
        this.notifyChange()
      },
    )
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '36px',
      lineHeight: '36px',
    }

    return (
      <Card
        title="Port Label Position"
        size="small"
        bordered={false}
        style={{ width: 240 }}
      >
        <Row
          align="middle"
          justify="center"
          style={{
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: 16,
            marginBottom: 16,
          }}
        >
          <Col>
            <Radio.Group
              value={this.state.position}
              onChange={this.onPositionChange}
            >
              <Radio style={radioStyle} value={'inside'}>
                inside
              </Radio>
              <Radio style={radioStyle} value={'outside'}>
                outside
              </Radio>
              <Radio style={radioStyle} value={'insideOriented'}>
                insideOriented
              </Radio>
              <Radio style={radioStyle} value={'outsideOriented'}>
                outsideOriented
              </Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5} style={{ textAlign: 'right', paddingRight: 16 }}>
            offset
          </Col>
          <Col span={14}>
            <Slider
              min={-30}
              max={30}
              step={1}
              value={this.state.offset}
              onChange={this.onOffsetChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.offset}</div>
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
`}}}},106:function(u,c,n){},108:function(u,c,n){"use strict";n.r(c);var C=n(0),e=n.n(C),b=n(30),A=n.n(b),f=n(2),h=n(3),g=n(5),v=n(6),U=n(87),w=n(112),O=n(57),E=n(40),m=n(116),L=n(113),H=n(73),D=function(d){Object(g.a)(o,d);var l=Object(v.a)(o);function o(){var t;Object(f.a)(this,o);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return t=l.call.apply(l,[this].concat(r)),t.state={position:"outside",offset:15},t.onOffsetChanged=function(i){t.setState({offset:i},function(){t.notifyChange()})},t.onPositionChange=function(i){t.setState({position:i.target.value},function(){t.notifyChange()})},t}return Object(h.a)(o,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){var a={display:"block",height:"36px",lineHeight:"36px"};return e.a.createElement(w.a,{title:"Port Label Position",size:"small",bordered:!1,style:{width:240}},e.a.createElement(O.a,{align:"middle",justify:"center",style:{borderBottom:"1px solid #f0f0f0",paddingBottom:16,marginBottom:16}},e.a.createElement(E.a,null,e.a.createElement(m.a.Group,{value:this.state.position,onChange:this.onPositionChange},e.a.createElement(m.a,{style:a,value:"inside"},"inside"),e.a.createElement(m.a,{style:a,value:"outside"},"outside"),e.a.createElement(m.a,{style:a,value:"insideOriented"},"insideOriented"),e.a.createElement(m.a,{style:a,value:"outsideOriented"},"outsideOriented")))),e.a.createElement(O.a,{align:"middle"},e.a.createElement(E.a,{span:5,style:{textAlign:"right",paddingRight:16}},"offset"),e.a.createElement(E.a,{span:14},e.a.createElement(L.a,{min:-30,max:30,step:1,value:this.state.offset,onChange:this.onOffsetChanged})),e.a.createElement(E.a,{span:1,offset:1},e.a.createElement("div",{className:"slider-value"},this.state.offset))))}}]),o}(e.a.Component),G=n(99),N=function(d){Object(g.a)(o,d);var l=Object(v.a)(o);function o(){var t;Object(f.a)(this,o);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return t=l.call.apply(l,[this].concat(r)),t.container=void 0,t.node=void 0,t.onAttrsChanged=function(i){var p=i.position,y=i.offset;t.node.prop("ports/groups/a/label/position",{name:p,args:{offset:y}}),t.node.attr("label/text",p)},t.refContainer=function(i){t.container=i},t}return Object(h.a)(o,[{key:"componentDidMount",value:function(){var a=this,r=new U.a({container:this.container,grid:{visible:!0}});this.node=r.addNode({shape:"ellipse",x:70,y:85,width:260,height:100,attrs:{label:{text:"outside",fill:"#888",fontSize:12},body:{strokeWidth:1}},ports:{groups:{a:{position:{name:"ellipseSpread",args:{compensateRotate:!0}},label:{position:{name:"outside"}},attrs:{circle:{fill:"#ffffff",stroke:"#31d0c6",strokeWidth:2,r:10,magnet:!0},text:{fill:"#6a6c8a",fontSize:12}}}}}}),Array.from({length:10}).forEach(function(s,i){a.node.addPort({attrs:{text:{text:"P ".concat(i)}},group:"a"})})}},{key:"render",value:function(){return e.a.createElement("div",{className:"app"},e.a.createElement("div",{className:"app-side"},e.a.createElement(D,{onChange:this.onAttrsChanged})),e.a.createElement("div",{className:"app-content",ref:this.refContainer}))}}]),o}(e.a.Component),M=n(117),P=n(111),j=n(118),X=n(119),x=n(89),T=n(83),F=n(102),S=n(103),z=function(){return e.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},e.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},V=function(d){Object(g.a)(o,d);var l=Object(v.a)(o);function o(){return Object(f.a)(this,o),l.apply(this,arguments)}return Object(h.a)(o,[{key:"render",value:function(){return e.a.createElement("div",{className:"demo-toolbar"},e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},e.a.createElement(M.a,{onClick:function(){window.location.reload()}})),window.frameElement&&e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(P.a,{component:z}))),e.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},e.a.createElement("a",{href:"".concat(S.host),rel:"noopener noreferrer",target:"_blank"},e.a.createElement(j.a,null))),e.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},e.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},e.a.createElement("input",{type:"hidden",name:"parameters",value:Object(T.getParameters)(S.getCodeSandboxParams())}),e.a.createElement("button",{type:"submit"},e.a.createElement(X.a,null)))))}}]),o}(e.a.Component),I=n(114),B=n(84),J=n(106),R=function(d){Object(g.a)(o,d);var l=Object(v.a)(o);function o(t){var a;return Object(f.a)(this,o),a=l.call(this,t),a.refContainer=function(r){a.container=r},o.restoreIframeSize(),a}return Object(h.a)(o,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){a.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var s=document.getElementById("loading");s&&s.parentNode&&s.parentNode.removeChild(s)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var r=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(r+16,"px"),a.style.border="0",a.style.overflow="hidden",o.saveIframeSize()}}},{key:"render",value:function(){return e.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},e.a.createElement(V,null),this.props.children)}}]),o}(e.a.Component);(function(d){var l=window.location.pathname,o="x6-iframe-size";function t(){var s=localStorage.getItem(o),i;if(s)try{i=JSON.parse(s)}catch(p){}else i={};return i}function a(){var s=window.frameElement;if(s){var i=s.style,p={width:i.width,height:i.height},y=t();y[l]=p,localStorage.setItem(o,JSON.stringify(y))}}d.saveIframeSize=a;function r(){var s=window.frameElement;if(s){var i=t(),p=i[l];p&&(s.style.width=p.width||"100%",s.style.height=p.height||"auto")}}d.restoreIframeSize=r})(R||(R={}));var W=n(107),k=function(l){var o=l.children;return e.a.createElement(I.a.ErrorBoundary,null,e.a.createElement(B.a,null,e.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),e.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),e.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),e.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),e.a.createElement(R,null,o))};A.a.render(e.a.createElement(k,null,e.a.createElement(N,null)),document.getElementById("root"))},91:function(u,c,n){u.exports=n(108)},99:function(u,c,n){}},[[91,1,2]]]);
