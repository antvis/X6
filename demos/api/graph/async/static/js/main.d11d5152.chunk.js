(this["webpackJsonp@antv/x6-sites-demos-api.graph.async"]=this["webpackJsonp@antv/x6-sites-demos-api.graph.async"]||[]).push([[0],{104:function(h,d,e){},107:function(h,d,e){},108:function(h,d,e){"use strict";e.r(d);var p=e(0),n=e.n(p),A=e(30),M=e.n(A),v=e(1),E=e(3),x=e(5),C=e(6),k=e(117),X=e(111),j=e(118),z=e(119),y=e(89),q=e(74),P=e(75),nn=e(98),O=e(99),I=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},V=function(c){Object(x.a)(a,c);var i=Object(C.a)(a);function a(){return Object(v.a)(this,a),i.apply(this,arguments)}return Object(E.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(k.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(X.a,{component:I}))),n.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(O.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(j.a,null))),n.a.createElement(y.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(P.getParameters)(O.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(z.a,null)))))}}]),a}(n.a.Component),H=e(114),B=e(80),en=e(104),R=function(c){Object(x.a)(a,c);var i=Object(C.a)(a);function a(t){var r;return Object(v.a)(this,a),r=i.call(this,t),r.refContainer=function(l){r.container=l},a.restoreIframeSize(),r}return Object(E.a)(a,[{key:"componentDidMount",value:function(){var r=this;if(this.updateIframeSize(),window.ResizeObserver){var l=new window.ResizeObserver(function(){r.updateIframeSize()});l.observe(this.container)}else window.addEventListener("resize",function(){return r.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var r=window.frameElement;if(r){var l=this.container.scrollHeight||this.container.clientHeight;r.style.width="100%",r.style.height="".concat(l+16,"px"),r.style.border="0",r.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(V,null),this.props.children)}}]),a}(n.a.Component);(function(c){var i=window.location.pathname,a="x6-iframe-size";function t(){var o=localStorage.getItem(a),s;if(o)try{s=JSON.parse(o)}catch(u){}else s={};return s}function r(){var o=window.frameElement;if(o){var s=o.style,u={width:s.width,height:s.height},b=t();b[i]=u,localStorage.setItem(a,JSON.stringify(b))}}c.saveIframeSize=r;function l(){var o=window.frameElement;if(o){var s=t(),u=s[i];u&&(o.style.width=u.width||"100%",o.style.height=u.height||"auto")}}c.restoreIframeSize=l})(R||(R={}));var tn=e(105),G=function(i){var a=i.children;return n.a.createElement(H.a.ErrorBoundary,null,n.a.createElement(B.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(R,null,a))},m=e(46),W=e(112),S=e(58),f=e(41),J=e(113),_=e(116),N={count:500,async:!0},F=function(c){Object(x.a)(a,c);var i=Object(C.a)(a);function a(){var t;Object(v.a)(this,a);for(var r=arguments.length,l=new Array(r),o=0;o<r;o++)l[o]=arguments[o];return t=i.call.apply(i,[this].concat(l)),t.state=N,t.onCountChanged=function(s){t.setState({count:s},function(){t.notifyChange()})},t.onAsyncChanged=function(s){t.setState({async:s},function(){t.notifyChange()})},t}return Object(E.a)(a,[{key:"notifyChange",value:function(){this.props.onChange(this.state)}},{key:"render",value:function(){return n.a.createElement(W.a,{title:"Settings",size:"small",bordered:!1,style:{width:320}},n.a.createElement(S.a,{align:"middle"},n.a.createElement(f.a,{span:5},"count"),n.a.createElement(f.a,{span:14},n.a.createElement(J.a,{min:10,max:5e3,step:1,value:this.state.count,onChange:this.onCountChanged})),n.a.createElement(f.a,{span:1,offset:1},n.a.createElement("div",{className:"slider-value"},this.state.count))),n.a.createElement(S.a,{align:"middle"},n.a.createElement(f.a,{span:5},"async"),n.a.createElement(f.a,{span:14},n.a.createElement(_.a,{checked:this.state.async,onChange:this.onAsyncChanged}))),n.a.createElement(S.a,{align:"middle"},n.a.createElement(f.a,{span:24,id:"elapsed"})))}}]),a}(n.a.Component),U=m.a.randomHex(),Y=m.a.randomHex();m.b.registerNode("performance_node",{width:80,height:30,zIndex:2,markup:[{tagName:"rect",selector:"body",attrs:{stroke:U,strokeWidth:2,fill:m.a.darken(U,40)}},{tagName:"text",selector:"label",attrs:{fill:m.a.invert(U,!0)}}],attrs:{body:{refWidth:"100%",refHeight:"100%"},label:{refX:"50%",refY:"50%",fontSize:12,textAnchor:"middle",textVerticalAnchor:"middle"}}},!0),m.b.registerEdge("performance_edge",{zIndex:1,markup:[{tagName:"path",selector:"wrap",attrs:{fill:"none",cursor:"pointer",stroke:"transparent",strokeWidth:10,strokeLinecap:"round"}},{tagName:"path",selector:"line"}],attrs:{wrap:{connection:!0},line:{connection:!0,stroke:Y,strokeWidth:1,targetMarker:"classic"}}},!0);var an=e(107),$=function(c){Object(x.a)(a,c);var i=Object(C.a)(a);function a(){var t;Object(v.a)(this,a);for(var r=arguments.length,l=new Array(r),o=0;o<r;o++)l[o]=arguments[o];return t=i.call.apply(i,[this].concat(l)),t.container=void 0,t.graph=void 0,t.onChanged=function(s){var u=t.graph.createNode({shape:"performance_node"}),b=t.graph.createEdge({shape:"performance_edge"}),D=[];Array.from({length:s.count/2}).forEach(function(K,g){var w=u.clone().position(g*110+20,20).attr("label/text",g+1),T=u.clone().position(g*100+20,150).attr("label/text",g+1+s.count/2),Q=b.clone().setSource(w).setTarget(T);D.push(w,T,Q)});var Z=new Date().getTime(),L=function(){var g=(new Date().getTime()-Z)/1e3,w=document.getElementById("elapsed");w.innerText="render ".concat(s.count," nodes and ").concat(s.count/2," edges in ").concat(g,"s")};t.graph.resize(s.count/2*110),t.graph.setAsync(s.async),t.graph.resetCells(D),s.async?t.graph.on("render:done",L):L()},t.refContainer=function(s){t.container=s},t}return Object(E.a)(a,[{key:"componentDidMount",value:function(){this.graph=new m.b({container:this.container,height:200,grid:{visible:!0}}),this.onChanged(N)}},{key:"render",value:function(){return p.createElement("div",{className:"app"},p.createElement("div",{className:"app-left"},p.createElement(F,{onChange:this.onChanged})),p.createElement("div",{className:"app-content"},p.createElement("div",{ref:this.refContainer})))}}]),a}(p.Component);M.a.render(n.a.createElement(G,null,n.a.createElement($,null)),document.getElementById("root"))},91:function(h,d,e){h.exports=e(108)},98:function(h,d,e){},99:function(h,d,e){"use strict";e.r(d),e.d(d,"host",function(){return p}),e.d(d,"getCodeSandboxParams",function(){return n}),e.d(d,"getStackblitzPrefillConfig",function(){return A});const p="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/graph/async";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { Graph, Cell } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './shapes'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      height: 200,
      grid: {
        visible: true,
      },
    })
    this.onChanged(defaults)
  }

  onChanged = (settgins: State) => {
    const node = this.graph.createNode({ shape: 'performance_node' })
    const edge = this.graph.createEdge({ shape: 'performance_edge' })
    const cells: Cell[] = []

    Array.from({ length: settgins.count / 2 }).forEach((_, n) => {
      const a = node
        .clone()
        .position(n * 110 + 20, 20)
        .attr('label/text', n + 1)
      const b = node
        .clone()
        .position(n * 100 + 20, 150)
        .attr('label/text', n + 1 + settgins.count / 2)
      const ab = edge.clone().setSource(a).setTarget(b)
      cells.push(a, b, ab)
    })

    const startTime = new Date().getTime()
    const showResult = () => {
      const duration = (new Date().getTime() - startTime) / 1000
      const elapsed = document.getElementById('elapsed')!

      elapsed.innerText = \`render \${settgins.count} nodes and \${
        settgins.count / 2
      } edges in \${duration}s\`
    }

    this.graph.resize((settgins.count / 2) * 110)
    this.graph.setAsync(settgins.async)
    this.graph.resetCells(cells)
    if (settgins.async) {
      this.graph.on('render:done', showResult)
    } else {
      showResult()
    }
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
        <div className="app-content">
          <div ref={this.refContainer} />
        </div>
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
import { Switch, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  count: number
  async: boolean
}

export const defaults: State = {
  count: 500,
  async: true,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCountChanged = (count: number) => {
    this.setState({ count }, () => {
      this.notifyChange()
    })
  }

  onAsyncChanged = (async: boolean) => {
    this.setState({ async }, () => {
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
          <Col span={5}>count</Col>
          <Col span={14}>
            <Slider
              min={10}
              max={5000}
              step={1}
              value={this.state.count}
              onChange={this.onCountChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.count}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>async</Col>
          <Col span={14}>
            <Switch checked={this.state.async} onChange={this.onAsyncChanged} />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24} id="elapsed"></Col>
        </Row>
      </Card>
    )
  }
}
`,isBinary:!1},"src/shapes.ts":{content:`import { Graph, Color } from '@antv/x6'

const color1 = Color.randomHex()
const color2 = Color.randomHex()

Graph.registerNode(
  'performance_node',
  {
    width: 80,
    height: 30,
    zIndex: 2,
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
        // \u5728 Markup \u4E2D\u5B9A\u4E49\u751F\u547D\u5468\u671F\u4E2D\u4E0D\u53D8\u7684\u539F\u751F\u5C5E\u6027\uFF0C\u4E0D\u80FD\u5B9A\u4E49\u7279\u6B8A\u5C5E\u6027
        attrs: {
          stroke: color1,
          strokeWidth: 2,
          fill: Color.darken(color1, 40),
        },
      },
      {
        tagName: 'text',
        selector: 'label',
        attrs: {
          fill: Color.invert(color1, true),
        },
      },
    ],
    attrs: {
      body: {
        // \u4F7F\u7528 ref-xxx \u5C5E\u6027\u65F6\uFF0C\u53EA\u8981\u6CA1\u6709\u540C\u65F6\u5B9A\u4E49 ref \u5C5E\u6027\uFF0C\u6240\u6709\u8BA1\u7B97\u90FD\u662F\u7EAF JavaScript \u8BA1\u7B97\uFF0C
        // \u56E0\u6B64\u8BA1\u7B97\u975E\u5E38\u5FEB\uFF1B\u4E00\u65E6\u5B9A\u4E49\u4E86 ref \u5C5E\u6027\uFF0C\u5C31\u9700\u8981\u5148\u57FA\u4E8E\u6D4F\u89C8\u5668\u7684\u5305\u56F4\u76D2\u8BA1\u7B97\u62FF\u5230 ref \u6307\u4EE3
        // \u5143\u7D20\u7684\u5305\u56F4\u76D2\uFF0C\u8BA1\u7B97\u5F00\u9500\u76F8\u5BF9\u8F83\u5927\u3002
        refWidth: '100%',
        refHeight: '100%',
      },
      label: {
        refX: '50%',
        refY: '50%',
        fontSize: 12,
        // \u5C3D\u91CF\u907F\u514D\u4F7F\u7528 \`xAlign\` \u548C \`yAlign\` \u5C5E\u6027\uFF0C\u56E0\u4E3A\u8FD9\u4E24\u4E2A\u5C5E\u6027\u7684\u8BA1\u7B97\u9996\u5148\u9700\u8981\u8BA1\u7B97
        // <SVGText> \u5143\u7D20\u7684\u5305\u56F4\u76D2\uFF0C\u901A\u5E38\u6D4F\u89C8\u5668\u7684\u5305\u56F4\u76D2\u8BA1\u7B97\u90FD\u4E0D\u662F\u90A3\u4E48\u5FEB\u3002
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
    },
  },
  true,
)
Graph.registerEdge(
  'performance_edge',
  {
    zIndex: 1,
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
          strokeWidth: 10,
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
      },
    ],
    attrs: {
      wrap: {
        connection: true,
      },
      line: {
        connection: true,
        stroke: color2,
        strokeWidth: 1,
        targetMarker: 'classic',
      },
    },
  },
  true,
)
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
`,isBinary:!1}}}}function A(){return{title:"api/graph/async",description:"",template:"create-react-app",dependencies:{"@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { Graph, Cell } from '@antv/x6'
import { Settings, State, defaults } from './settings'
import './shapes'
import './app.css'

export default class Example extends React.Component {
  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    this.graph = new Graph({
      container: this.container,
      height: 200,
      grid: {
        visible: true,
      },
    })
    this.onChanged(defaults)
  }

  onChanged = (settgins: State) => {
    const node = this.graph.createNode({ shape: 'performance_node' })
    const edge = this.graph.createEdge({ shape: 'performance_edge' })
    const cells: Cell[] = []

    Array.from({ length: settgins.count / 2 }).forEach((_, n) => {
      const a = node
        .clone()
        .position(n * 110 + 20, 20)
        .attr('label/text', n + 1)
      const b = node
        .clone()
        .position(n * 100 + 20, 150)
        .attr('label/text', n + 1 + settgins.count / 2)
      const ab = edge.clone().setSource(a).setTarget(b)
      cells.push(a, b, ab)
    })

    const startTime = new Date().getTime()
    const showResult = () => {
      const duration = (new Date().getTime() - startTime) / 1000
      const elapsed = document.getElementById('elapsed')!

      elapsed.innerText = \`render \${settgins.count} nodes and \${
        settgins.count / 2
      } edges in \${duration}s\`
    }

    this.graph.resize((settgins.count / 2) * 110)
    this.graph.setAsync(settgins.async)
    this.graph.resetCells(cells)
    if (settgins.async) {
      this.graph.on('render:done', showResult)
    } else {
      showResult()
    }
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
        <div className="app-content">
          <div ref={this.refContainer} />
        </div>
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
import { Switch, Slider, Card, Row, Col } from 'antd'
import 'antd/dist/antd.css'

export interface Props {
  onChange: (state: State) => void
}

export interface State {
  count: number
  async: boolean
}

export const defaults: State = {
  count: 500,
  async: true,
}

export class Settings extends React.Component<Props, State> {
  state: State = defaults

  notifyChange() {
    this.props.onChange(this.state)
  }

  onCountChanged = (count: number) => {
    this.setState({ count }, () => {
      this.notifyChange()
    })
  }

  onAsyncChanged = (async: boolean) => {
    this.setState({ async }, () => {
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
          <Col span={5}>count</Col>
          <Col span={14}>
            <Slider
              min={10}
              max={5000}
              step={1}
              value={this.state.count}
              onChange={this.onCountChanged}
            />
          </Col>
          <Col span={1} offset={1}>
            <div className="slider-value">{this.state.count}</div>
          </Col>
        </Row>
        <Row align="middle">
          <Col span={5}>async</Col>
          <Col span={14}>
            <Switch checked={this.state.async} onChange={this.onAsyncChanged} />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={24} id="elapsed"></Col>
        </Row>
      </Card>
    )
  }
}
`,"src/shapes.ts":`import { Graph, Color } from '@antv/x6'

const color1 = Color.randomHex()
const color2 = Color.randomHex()

Graph.registerNode(
  'performance_node',
  {
    width: 80,
    height: 30,
    zIndex: 2,
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
        // \u5728 Markup \u4E2D\u5B9A\u4E49\u751F\u547D\u5468\u671F\u4E2D\u4E0D\u53D8\u7684\u539F\u751F\u5C5E\u6027\uFF0C\u4E0D\u80FD\u5B9A\u4E49\u7279\u6B8A\u5C5E\u6027
        attrs: {
          stroke: color1,
          strokeWidth: 2,
          fill: Color.darken(color1, 40),
        },
      },
      {
        tagName: 'text',
        selector: 'label',
        attrs: {
          fill: Color.invert(color1, true),
        },
      },
    ],
    attrs: {
      body: {
        // \u4F7F\u7528 ref-xxx \u5C5E\u6027\u65F6\uFF0C\u53EA\u8981\u6CA1\u6709\u540C\u65F6\u5B9A\u4E49 ref \u5C5E\u6027\uFF0C\u6240\u6709\u8BA1\u7B97\u90FD\u662F\u7EAF JavaScript \u8BA1\u7B97\uFF0C
        // \u56E0\u6B64\u8BA1\u7B97\u975E\u5E38\u5FEB\uFF1B\u4E00\u65E6\u5B9A\u4E49\u4E86 ref \u5C5E\u6027\uFF0C\u5C31\u9700\u8981\u5148\u57FA\u4E8E\u6D4F\u89C8\u5668\u7684\u5305\u56F4\u76D2\u8BA1\u7B97\u62FF\u5230 ref \u6307\u4EE3
        // \u5143\u7D20\u7684\u5305\u56F4\u76D2\uFF0C\u8BA1\u7B97\u5F00\u9500\u76F8\u5BF9\u8F83\u5927\u3002
        refWidth: '100%',
        refHeight: '100%',
      },
      label: {
        refX: '50%',
        refY: '50%',
        fontSize: 12,
        // \u5C3D\u91CF\u907F\u514D\u4F7F\u7528 \`xAlign\` \u548C \`yAlign\` \u5C5E\u6027\uFF0C\u56E0\u4E3A\u8FD9\u4E24\u4E2A\u5C5E\u6027\u7684\u8BA1\u7B97\u9996\u5148\u9700\u8981\u8BA1\u7B97
        // <SVGText> \u5143\u7D20\u7684\u5305\u56F4\u76D2\uFF0C\u901A\u5E38\u6D4F\u89C8\u5668\u7684\u5305\u56F4\u76D2\u8BA1\u7B97\u90FD\u4E0D\u662F\u90A3\u4E48\u5FEB\u3002
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
    },
  },
  true,
)
Graph.registerEdge(
  'performance_edge',
  {
    zIndex: 1,
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
          strokeWidth: 10,
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
      },
    ],
    attrs: {
      wrap: {
        connection: true,
      },
      line: {
        connection: true,
        stroke: color2,
        strokeWidth: 1,
        targetMarker: 'classic',
      },
    },
  },
  true,
)
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
`}}}}},[[91,1,2]]]);
