(this["webpackJsonp@antv/x6-sites-demos-api.graph.auto-resize"]=this["webpackJsonp@antv/x6-sites-demos-api.graph.auto-resize"]||[]).push([[0],{73:function(v,h,s){v.exports=s(95)},79:function(v,h,s){},80:function(v,h,s){},87:function(v,h,s){},88:function(v,h,s){"use strict";s.r(h),s.d(h,"host",function(){return f}),s.d(h,"getCodeSandboxParams",function(){return a}),s.d(h,"getStackblitzPrefillConfig",function(){return M});const f="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/graph/auto-resize";function a(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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

.app-content {
  flex: 1;
  height: 240px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #ffe58f;
}
`,isBinary:!1},"src/app.tsx":{content:`import * as React from 'react'
import { Graph } from '@antv/x6'
import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css'
import './app.css'

export default class Example extends React.Component {
  private graphContainer1: HTMLDivElement
  private graphContainer2: HTMLDivElement

  componentDidMount() {
    const graph1 = new Graph({
      container: this.graphContainer1,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      scroller: true,
      autoResize: true,
    })

    const rect = graph1.addNode({
      x: 300,
      y: 300,
      width: 90,
      height: 60,
    })

    const circle = graph1.addNode({
      x: 400,
      y: 400,
      width: 40,
      height: 40,
    })

    graph1.addEdge({
      source: rect,
      target: circle,
    })

    graph1.centerContent()

    const graph2 = new Graph({
      container: this.graphContainer2,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      autoResize: true,
    })

    const source = graph2.addNode({
      x: 40,
      y: 40,
      width: 80,
      height: 40,
    })

    const target = graph2.addNode({
      x: 120,
      y: 100,
      width: 80,
      height: 40,
    })

    graph2.addEdge({
      source,
      target,
    })
  }

  refContainer1 = (container: HTMLDivElement) => {
    this.graphContainer1 = container
  }

  refContainer2 = (container: HTMLDivElement) => {
    this.graphContainer2 = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content">
          <SplitBox>
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              <div
                ref={this.refContainer1}
                style={{ flex: 1, margin: 24 }}
                className="x6-graph"
              />
            </div>
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              <div
                ref={this.refContainer2}
                style={{ flex: 1, margin: 24 }}
                className="x6-graph"
              />
            </div>
          </SplitBox>
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
`,isBinary:!1},"src/index.tsx":{content:`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"tsconfig.json":{content:`{
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
`,isBinary:!1}}}}function M(){return{title:"api/graph/auto-resize",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest","@antv/x6":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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

.app-content {
  flex: 1;
  height: 240px;
  margin-left: 8px;
  margin-right: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}

.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #ffe58f;
}
`,"src/app.tsx":`import * as React from 'react'
import { Graph } from '@antv/x6'
import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css'
import './app.css'

export default class Example extends React.Component {
  private graphContainer1: HTMLDivElement
  private graphContainer2: HTMLDivElement

  componentDidMount() {
    const graph1 = new Graph({
      container: this.graphContainer1,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      scroller: true,
      autoResize: true,
    })

    const rect = graph1.addNode({
      x: 300,
      y: 300,
      width: 90,
      height: 60,
    })

    const circle = graph1.addNode({
      x: 400,
      y: 400,
      width: 40,
      height: 40,
    })

    graph1.addEdge({
      source: rect,
      target: circle,
    })

    graph1.centerContent()

    const graph2 = new Graph({
      container: this.graphContainer2,
      background: {
        color: '#f5f5f5',
      },
      grid: true,
      autoResize: true,
    })

    const source = graph2.addNode({
      x: 40,
      y: 40,
      width: 80,
      height: 40,
    })

    const target = graph2.addNode({
      x: 120,
      y: 100,
      width: 80,
      height: 40,
    })

    graph2.addEdge({
      source,
      target,
    })
  }

  refContainer1 = (container: HTMLDivElement) => {
    this.graphContainer1 = container
  }

  refContainer2 = (container: HTMLDivElement) => {
    this.graphContainer2 = container
  }

  render() {
    return (
      <div className="app">
        <div className="app-content">
          <SplitBox>
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              <div
                ref={this.refContainer1}
                style={{ flex: 1, margin: 24 }}
                className="x6-graph"
              />
            </div>
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              <div
                ref={this.refContainer2}
                style={{ flex: 1, margin: 24 }}
                className="x6-graph"
              />
            </div>
          </SplitBox>
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
`,"src/index.tsx":`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,"tsconfig.json":`{
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
`}}}},93:function(v,h,s){},95:function(v,h,s){"use strict";s.r(h);var f=s(0),a=s.n(f),M=s(20),T=s.n(M),g=s(1),E=s(2),x=s(3),y=s(4),D=s(51),j=s(6),X=s(43),z=s.n(X),P=s(12),U=s.n(P),V=function(u){Object(x.a)(t,u);var d=Object(y.a)(t);function t(){return Object(g.a)(this,t),d.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){var e=this.props,n=e.refIt,i=e.className,o=e.index,c=e.currentSize,l=e.oppositeSize,m=e.vertical,p=Object.assign(Object.assign({},this.props.style),{overflow:"hidden",position:"absolute",zIndex:1});return m?(p.bottom=0,p.top=0):(p.left=0,p.right=0),c!=null?m?(p.width=c,o===1?p.left=0:p.right=0):(p.height=c,o===1?p.top=0:p.bottom=0):m?o===1?(p.left=0,p.right=l):(p.left=l,p.right=0):o===1?(p.top=0,p.bottom=l):(p.top=l,p.bottom=0),a.a.createElement("div",{ref:n,style:p,className:i},this.props.children)}}]),t}(a.a.PureComponent),I=s(46),A=s.n(I),N=0,R=window.requestAnimationFrame||window.webkitRequestAnimationFrame,B=(window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout).bind(window),F=R?R.bind(window):function(u){var d=Date.now(),t=Math.max(0,16-(d-N));return N=d+t,window.setTimeout(function(){u(Date.now())},t)},H=function(){function u(d){var t=this;Object(g.a)(this,u),this.onMouseMove=function(r){var e=r.clientX,n=r.clientY;t.deltaX+=e-t.clientX,t.deltaY+=n-t.clientY,t.animationFrameID==null&&(t.animationFrameID=F(t.triggerOnMouseMoveCallback)),t.clientX=e,t.clientY=n,r.preventDefault()},this.onMouseUp=function(){t.animationFrameID&&(B(t.animationFrameID),t.triggerOnMouseMoveCallback()),t.triggerOnMouseMoveEndCallback(!1)},this.triggerOnMouseMoveCallback=function(){t.animationFrameID=null,t.onMouseMoveCallback(t.deltaX,t.deltaY,{clientX:t.clientX,clientY:t.clientY}),t.deltaX=0,t.deltaY=0},this.triggerOnMouseMoveEndCallback=function(r){t.onMouseMoveEndCallback(r)},this.elem=d.elem||document.documentElement,this.onMouseMoveCallback=d.onMouseMove,this.onMouseMoveEndCallback=d.onMouseMoveEnd,this.animationFrameID=null}return Object(E.a)(u,[{key:"capture",value:function(t){this.captured||(this.removeMouseMoveEvent=A()(this.elem,"mousemove",this.onMouseMove).remove,this.removeMouseUpEvent=A()(this.elem,"mouseup",this.onMouseUp).remove),this.captured=!0,this.dragging||(this.clientX=t.clientX,this.clientY=t.clientY,this.deltaX=0,this.deltaY=0,this.dragging=!0),t.preventDefault()}},{key:"release",value:function(){this.captured&&(this.removeMouseMoveEvent!=null&&(this.removeMouseMoveEvent(),this.removeMouseMoveEvent=null),this.removeMouseUpEvent!=null&&(this.removeMouseUpEvent(),this.removeMouseUpEvent=null)),this.captured=!1,this.dragging&&(this.dragging=!1,this.clientX=0,this.clientY=0,this.deltaX=0,this.deltaY=0)}},{key:"isDragging",value:function(){return this.dragging}}]),u}(),Y=function(u){Object(x.a)(t,u);var d=Object(y.a)(t);function t(){var r;return Object(g.a)(this,t),r=d.apply(this,arguments),r.onMouseDown=function(e){r.mouseMoveTracker.capture(e),r.props.onMouseDown(e)},r.onMouseMove=function(e,n,i){r.props.onMouseMove!=null&&r.props.onMouseMove(e,n,i)},r.onMouseMoveEnd=function(){r.mouseMoveTracker.release(),r.props.onMouseMoveEnd!=null&&r.props.onMouseMoveEnd()},r.onClick=function(e){r.props.onClick&&r.props.onClick(e)},r.onDoubleClick=function(e){r.props.onDoubleClick&&r.props.onDoubleClick(e)},r}return Object(E.a)(t,[{key:"UNSAFE_componentWillMount",value:function(){this.mouseMoveTracker=new H({onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd})}},{key:"componentWillUnmount",value:function(){this.mouseMoveTracker.release()}},{key:"render",value:function(){var e=this.props,n=e.className,i=e.style;return a.a.createElement("div",{role:"button",style:i,className:n,onClick:this.onClick,ref:this.props.refIt,onMouseDown:this.onMouseDown,onDoubleClick:this.onDoubleClick})}}]),t}(a.a.PureComponent),C=function(u){Object(x.a)(t,u);var d=Object(y.a)(t);function t(r){var e;return Object(g.a)(this,t),e=d.call(this,r),e.onMouseDown=function(){var n=e.getRange(),i=n.maxSize,o=n.minSize;e.minSize=o,e.maxSize=i,e.curSize=e.getPrimarySize(),e.rawSize=e.curSize,e.resizing=!0,e.createMask(),e.updateCursor(e.curSize,o,i)},e.onMouseMove=function(n,i){if(e.props.resizable&&e.resizing){var o=e.getDelta(n,i);if(o===0)return;if(e.rawSize<e.minSize||e.rawSize>e.maxSize){e.rawSize-=o;return}e.rawSize-=o,e.curSize=e.rawSize,e.curSize=z()(e.curSize,e.minSize,e.maxSize),e.setPrimarySize(e.curSize),e.updateCursor(e.curSize,e.minSize,e.maxSize),e.props.onResizing&&e.props.onResizing(e.curSize)}},e.onMouseMoveEnd=function(){if(e.props.resizable&&e.resizing){if(e.props.onResizeEnd&&e.props.onResizeEnd(e.curSize),e.props.refresh){var n=e.isPrimaryFirst();e.setState({box1Size:n?e.curSize:void 0,box2Size:n?void 0:e.curSize})}e.resizing=!1,e.removeMask()}},e.refContainer=function(n){e.container=n},e.refResizer=function(n){e.resizerElem=n},e.state=e.getNextState(r),e}return Object(E.a)(t,[{key:"UNSAFE_componentWillReceiveProps",value:function(e){var n=this.getNextState(e);this.setState(n)}},{key:"getNextState",value:function(e){var n=e.size,i=e.defaultSize,o=e.primary,c=n??(i??"25%");return{box1Size:o==="first"?c:void 0,box2Size:o==="second"?c:void 0}}},{key:"isVertical",value:function(){return this.props.split==="vertical"}},{key:"isPrimaryFirst",value:function(){return this.props.primary==="first"}},{key:"getDelta",value:function(e,n){var i=this.props.step,o=this.isVertical(),c=this.isPrimaryFirst(),l=o?e:n;if(l===0)return 0;i&&Math.abs(l)>=i&&(l=~~(l/i)*i),l=c?-l:l;var m=c?this.box1Elem:this.box2Elem,p=c?this.box2Elem:this.box1Elem,S=parseInt(window.getComputedStyle(m).order,10),O=parseInt(window.getComputedStyle(p).order,10);return S>O&&(l=-l),l}},{key:"getRange",value:function(){for(var e=this.props,n=e.maxSize,i=e.minSize,o=this.container.getBoundingClientRect(),c=this.isVertical()?o.width:o.height,l=i!==void 0?i:0,m=n!==void 0?n:0;l<0;)l=c+l;for(;m<=0;)m=c+m;return{minSize:z()(l,0,c),maxSize:z()(m,0,c)}}},{key:"getPrimarySize",value:function(){var e=this.isPrimaryFirst()?this.box1Elem:this.box2Elem;return this.isVertical()?e.getBoundingClientRect().width:e.getBoundingClientRect().height}},{key:"setPrimarySize",value:function(e){var n=this.isPrimaryFirst(),i=n?this.box1Elem:this.box2Elem,o=n?this.box2Elem:this.box1Elem,c=this.resizerElem,l="".concat(e,"px");this.isVertical()?(i.style.width=l,n?(o.style.left=l,c.style.left=l):(o.style.right=l,c.style.right=l)):(i.style.height=l,n?(o.style.top=l,c.style.top=l):(o.style.bottom=l,c.style.bottom=l))}},{key:"updateCursor",value:function(e,n,i){var o="";this.isVertical()?e===n?o=this.isPrimaryFirst()?"e-resize":"w-resize":e===i?o=this.isPrimaryFirst()?"w-resize":"e-resize":o="col-resize":e===n?o=this.isPrimaryFirst()?"s-resize":"n-resize":e===i?o=this.isPrimaryFirst()?"n-resize":"s-resize":o="row-resize",this.maskElem.style.cursor=o}},{key:"createMask",value:function(){var e=document.createElement("div");e.style.position="absolute",e.style.top="0",e.style.right="0",e.style.bottom="0",e.style.left="0",e.style.zIndex="9999",document.body.appendChild(e),this.maskElem=e}},{key:"removeMask",value:function(){this.maskElem.parentNode&&this.maskElem.parentNode.removeChild(this.maskElem)}},{key:"renderBox",value:function(e,n){var i=this,o=n===1?"first":"second",c=this.props.primary===o,l=n===1?this.state.box1Size:this.state.box2Size,m=n===1?this.state.box2Size:this.state.box1Size,p=Object.assign(Object.assign({},this.props.boxStyle),c?this.props.primaryBoxStyle:this.props.secondBoxStyle),S=U()("".concat(e,"-item"),c?"".concat(e,"-item-primary"):"".concat(e,"-item-second")),O=function(L){n===1?i.box1Elem=L:i.box2Elem=L},te=this.props.children;return a.a.createElement(V,{key:"box".concat(n),refIt:O,style:p,index:n,className:S,currentSize:l,oppositeSize:m,vertical:this.isVertical(),isPrimary:c},te[n-1])}},{key:"renderResizer",value:function(e){var n=Object.assign({},this.props.resizerStyle);return n.position="absolute",n.zIndex=2,this.isVertical()?(n.top=0,n.bottom=0,this.props.resizable===!0&&(n.cursor="col-resize"),this.isPrimaryFirst()?n.left=this.state.box1Size:n.right=this.state.box2Size):(n.left=0,n.right=0,this.props.resizable===!0&&(n.cursor="row-resize"),this.isPrimaryFirst()?n.top=this.state.box1Size:n.bottom=this.state.box2Size),a.a.createElement(Y,{key:"resizer",style:n,className:"".concat(e,"-resizer"),refIt:this.refResizer,onClick:this.props.onResizerClick,onMouseDown:this.onMouseDown,onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd,onDoubleClick:this.props.onResizerDoubleClick})}},{key:"render",value:function(){var e=Object.assign(Object.assign({},this.props.style),{overflow:"hidden",position:"relative",width:"100%",height:"100%"}),n="".concat(this.props.prefixCls,"-split-box"),i=U()(n,"".concat(n,"-").concat(this.props.split),Object(j.a)({},"".concat(n,"-disabled"),!this.props.resizable));return a.a.createElement("div",{style:e,className:i,ref:this.refContainer},this.renderBox(n,1),this.renderResizer(n),this.renderBox(n,2))}}]),t}(a.a.PureComponent);(function(u){u.defaultProps={resizable:!0,split:"vertical",primary:"first",prefixCls:"x6",defaultSize:"25%"}})(C||(C={}));var re=s(79),ie=s(80),G=function(u){Object(x.a)(t,u);var d=Object(y.a)(t);function t(){var r;Object(g.a)(this,t);for(var e=arguments.length,n=new Array(e),i=0;i<e;i++)n[i]=arguments[i];return r=d.call.apply(d,[this].concat(n)),r.graphContainer1=void 0,r.graphContainer2=void 0,r.refContainer1=function(o){r.graphContainer1=o},r.refContainer2=function(o){r.graphContainer2=o},r}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var e=new D.a({container:this.graphContainer1,background:{color:"#f5f5f5"},grid:!0,scroller:!0,autoResize:!0}),n=e.addNode({x:300,y:300,width:90,height:60}),i=e.addNode({x:400,y:400,width:40,height:40});e.addEdge({source:n,target:i}),e.centerContent();var o=new D.a({container:this.graphContainer2,background:{color:"#f5f5f5"},grid:!0,autoResize:!0}),c=o.addNode({x:40,y:40,width:80,height:40}),l=o.addNode({x:120,y:100,width:80,height:40});o.addEdge({source:c,target:l})}},{key:"render",value:function(){return f.createElement("div",{className:"app"},f.createElement("div",{className:"app-content"},f.createElement(C,null,f.createElement("div",{style:{width:"100%",height:"100%",display:"flex"}},f.createElement("div",{ref:this.refContainer1,style:{flex:1,margin:24},className:"x6-graph"})),f.createElement("div",{style:{width:"100%",height:"100%",display:"flex"}},f.createElement("div",{ref:this.refContainer2,style:{flex:1,margin:24},className:"x6-graph"})))))}}]),t}(f.Component),J=s(103),W=s(99),$=s(104),Z=s(105),b=s(102),oe=s(84),K=s(54),ae=s(87),k=s(88),Q=function(){return a.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},a.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},_=function(u){Object(x.a)(t,u);var d=Object(y.a)(t);function t(){return Object(g.a)(this,t),d.apply(this,arguments)}return Object(E.a)(t,[{key:"render",value:function(){return a.a.createElement("div",{className:"demo-toolbar"},a.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},a.a.createElement(J.a,{onClick:function(){window.location.reload()}})),window.frameElement&&a.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},a.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},a.a.createElement(W.a,{component:Q}))),a.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},a.a.createElement("a",{href:"".concat(k.host),rel:"noopener noreferrer",target:"_blank"},a.a.createElement($.a,null))),a.a.createElement(b.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},a.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},a.a.createElement("input",{type:"hidden",name:"parameters",value:Object(K.getParameters)(k.getCodeSandboxParams())}),a.a.createElement("button",{type:"submit"},a.a.createElement(Z.a,null)))))}}]),t}(a.a.Component),q=s(100),ee=s(68),se=s(93),w=function(u){Object(x.a)(t,u);var d=Object(y.a)(t);function t(r){var e;return Object(g.a)(this,t),e=d.call(this,r),e.refContainer=function(n){e.container=n},t.restoreIframeSize(),e}return Object(E.a)(t,[{key:"componentDidMount",value:function(){var e=this;if(this.updateIframeSize(),window.ResizeObserver){var n=new window.ResizeObserver(function(){e.updateIframeSize()});n.observe(this.container)}else window.addEventListener("resize",function(){return e.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var e=window.frameElement;if(e){var n=this.container.scrollHeight||this.container.clientHeight;e.style.width="100%",e.style.height="".concat(n+16,"px"),e.style.border="0",e.style.overflow="hidden",t.saveIframeSize()}}},{key:"render",value:function(){return a.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},a.a.createElement(_,null),this.props.children)}}]),t}(a.a.Component);(function(u){var d=window.location.pathname,t="x6-iframe-size";function r(){var i=localStorage.getItem(t),o;if(i)try{o=JSON.parse(i)}catch(c){}else o={};return o}function e(){var i=window.frameElement;if(i){var o=i.style,c={width:o.width,height:o.height},l=r();l[d]=c,localStorage.setItem(t,JSON.stringify(l))}}u.saveIframeSize=e;function n(){var i=window.frameElement;if(i){var o=r(),c=o[d];c&&(i.style.width=c.width||"100%",i.style.height=c.height||"auto")}}u.restoreIframeSize=n})(w||(w={}));var le=s(94),ne=function(d){var t=d.children;return a.a.createElement(q.a.ErrorBoundary,null,a.a.createElement(ee.a,null,a.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),a.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),a.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),a.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),a.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),a.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),a.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),a.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),a.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),a.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),a.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),a.a.createElement(w,null,t))};T.a.render(a.a.createElement(ne,null,a.a.createElement("div",{className:"bar"}),a.a.createElement(G,null)),document.getElementById("root"))}},[[73,1,2]]]);
