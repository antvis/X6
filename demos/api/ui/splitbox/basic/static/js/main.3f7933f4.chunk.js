(this["webpackJsonp@antv/x6-sites-demos-api.ui.splitbox.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.splitbox.basic"]||[]).push([[0],{59:function(h,f,a){h.exports=a(80)},64:function(h,f,a){},65:function(h,f,a){},72:function(h,f,a){},73:function(h,f,a){"use strict";a.r(f),a.d(f,"host",function(){return S}),a.d(f,"getCodeSandboxParams",function(){return i}),a.d(f,"getStackblitzPrefillConfig",function(){return z});const S="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/splitbox/basic";function i(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6-react-components": "1.x",
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
`,isBinary:!1},"src/app.css":{content:`.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #e9e9e9;
}
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css'
import './app.css'

export default class Example extends React.Component {
  render() {
    return (
      <div style={{ height: 400 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f5f5f5',
            userSelect: 'none',
          }}
        >
          <SplitBox
            split="horizontal"
            minSize={80}
            maxSize={-80}
            defaultSize={'80%'}
            primary="second"
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#fff7e6',
              }}
            />
            <SplitBox
              split="vertical"
              minSize={40}
              maxSize={-160}
              defaultSize={240}
              primary="first"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#fff0f6',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <SplitBox
                  split="vertical"
                  minSize={40}
                  maxSize={-80}
                  defaultSize={'40%'}
                  primary="second"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <SplitBox
                      split="horizontal"
                      minSize={40}
                      maxSize={-40}
                      defaultSize={80}
                      primary="first"
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6f7ff',
                        }}
                      />
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6fffb',
                        }}
                      />
                    </SplitBox>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#f6ffed',
                    }}
                  />
                </SplitBox>
              </div>
            </SplitBox>
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

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
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
`,isBinary:!1}}}}function z(){return{title:"api/ui/splitbox/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"1.x",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6-react-components": "1.x",
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
`,"src/app.css":`.x6-split-box-horizontal > .x6-split-box-resizer,
.x6-split-box-vertical > .x6-split-box-resizer {
  background: #e9e9e9;
}
`,"src/app.tsx":`import React from 'react'
import { SplitBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/split-box/style/index.css'
import './app.css'

export default class Example extends React.Component {
  render() {
    return (
      <div style={{ height: 400 }}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f5f5f5',
            userSelect: 'none',
          }}
        >
          <SplitBox
            split="horizontal"
            minSize={80}
            maxSize={-80}
            defaultSize={'80%'}
            primary="second"
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                background: '#fff7e6',
              }}
            />
            <SplitBox
              split="vertical"
              minSize={40}
              maxSize={-160}
              defaultSize={240}
              primary="first"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#fff0f6',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <SplitBox
                  split="vertical"
                  minSize={40}
                  maxSize={-80}
                  defaultSize={'40%'}
                  primary="second"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <SplitBox
                      split="horizontal"
                      minSize={40}
                      maxSize={-40}
                      defaultSize={80}
                      primary="first"
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6f7ff',
                        }}
                      />
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6fffb',
                        }}
                      />
                    </SplitBox>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#f6ffed',
                    }}
                  />
                </SplitBox>
              </div>
            </SplitBox>
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

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
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
`}}}},78:function(h,f,a){},80:function(h,f,a){"use strict";a.r(f);var S=a(0),i=a.n(S),z=a(13),j=a.n(z),v=a(10),E=a(11),y=a(15),g=a(14),L=a(39),P=a(32),M=a.n(P),X=a(5),U=a.n(X),T=function(u){Object(y.a)(n,u);var d=Object(g.a)(n);function n(){return Object(v.a)(this,n),d.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){var e=this.props,t=e.refIt,o=e.className,s=e.index,c=e.currentSize,l=e.oppositeSize,p=e.vertical,m=Object.assign(Object.assign({},this.props.style),{overflow:"hidden",position:"absolute",zIndex:1});return p?(m.bottom=0,m.top=0):(m.left=0,m.right=0),c!=null?p?(m.width=c,s===1?m.left=0:m.right=0):(m.height=c,s===1?m.top=0:m.bottom=0):p?s===1?(m.left=0,m.right=l):(m.left=l,m.right=0):s===1?(m.top=0,m.bottom=l):(m.top=l,m.bottom=0),i.a.createElement("div",{ref:t,style:m,className:o},this.props.children)}}]),n}(i.a.PureComponent),B=a(33),k=a.n(B),D=0,A=window.requestAnimationFrame||window.webkitRequestAnimationFrame,I=(window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout).bind(window),V=A?A.bind(window):function(u){var d=Date.now(),n=Math.max(0,16-(d-D));return D=d+n,window.setTimeout(function(){u(Date.now())},n)},F=function(){function u(d){var n=this;Object(v.a)(this,u),this.onMouseMove=function(r){var e=r.clientX,t=r.clientY;n.deltaX+=e-n.clientX,n.deltaY+=t-n.clientY,n.animationFrameID==null&&(n.animationFrameID=V(n.triggerOnMouseMoveCallback)),n.clientX=e,n.clientY=t,r.preventDefault()},this.onMouseUp=function(){n.animationFrameID&&(I(n.animationFrameID),n.triggerOnMouseMoveCallback()),n.triggerOnMouseMoveEndCallback(!1)},this.triggerOnMouseMoveCallback=function(){n.animationFrameID=null,n.onMouseMoveCallback(n.deltaX,n.deltaY,{clientX:n.clientX,clientY:n.clientY}),n.deltaX=0,n.deltaY=0},this.triggerOnMouseMoveEndCallback=function(r){n.onMouseMoveEndCallback(r)},this.elem=d.elem||document.documentElement,this.onMouseMoveCallback=d.onMouseMove,this.onMouseMoveEndCallback=d.onMouseMoveEnd,this.animationFrameID=null}return Object(E.a)(u,[{key:"capture",value:function(n){this.captured||(this.removeMouseMoveEvent=k()(this.elem,"mousemove",this.onMouseMove).remove,this.removeMouseUpEvent=k()(this.elem,"mouseup",this.onMouseUp).remove),this.captured=!0,this.dragging||(this.clientX=n.clientX,this.clientY=n.clientY,this.deltaX=0,this.deltaY=0,this.dragging=!0),n.preventDefault()}},{key:"release",value:function(){this.captured&&(this.removeMouseMoveEvent!=null&&(this.removeMouseMoveEvent(),this.removeMouseMoveEvent=null),this.removeMouseUpEvent!=null&&(this.removeMouseUpEvent(),this.removeMouseUpEvent=null)),this.captured=!1,this.dragging&&(this.dragging=!1,this.clientX=0,this.clientY=0,this.deltaX=0,this.deltaY=0)}},{key:"isDragging",value:function(){return this.dragging}}]),u}(),_=function(u){Object(y.a)(n,u);var d=Object(g.a)(n);function n(){var r;return Object(v.a)(this,n),r=d.apply(this,arguments),r.onMouseDown=function(e){r.mouseMoveTracker.capture(e),r.props.onMouseDown(e)},r.onMouseMove=function(e,t,o){r.props.onMouseMove!=null&&r.props.onMouseMove(e,t,o)},r.onMouseMoveEnd=function(){r.mouseMoveTracker.release(),r.props.onMouseMoveEnd!=null&&r.props.onMouseMoveEnd()},r.onClick=function(e){r.props.onClick&&r.props.onClick(e)},r.onDoubleClick=function(e){r.props.onDoubleClick&&r.props.onDoubleClick(e)},r}return Object(E.a)(n,[{key:"UNSAFE_componentWillMount",value:function(){this.mouseMoveTracker=new F({onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd})}},{key:"componentWillUnmount",value:function(){this.mouseMoveTracker.release()}},{key:"render",value:function(){var e=this.props,t=e.className,o=e.style;return i.a.createElement("div",{role:"button",style:o,className:t,onClick:this.onClick,ref:this.props.refIt,onMouseDown:this.onMouseDown,onDoubleClick:this.onDoubleClick})}}]),n}(i.a.PureComponent),x=function(u){Object(y.a)(n,u);var d=Object(g.a)(n);function n(r){var e;return Object(v.a)(this,n),e=d.call(this,r),e.onMouseDown=function(){var t=e.getRange(),o=t.maxSize,s=t.minSize;e.minSize=s,e.maxSize=o,e.curSize=e.getPrimarySize(),e.rawSize=e.curSize,e.resizing=!0,e.createMask(),e.updateCursor(e.curSize,s,o)},e.onMouseMove=function(t,o){if(e.props.resizable&&e.resizing){var s=e.getDelta(t,o);if(s===0)return;if(e.rawSize<e.minSize||e.rawSize>e.maxSize){e.rawSize-=s;return}e.rawSize-=s,e.curSize=e.rawSize,e.curSize=M()(e.curSize,e.minSize,e.maxSize),e.setPrimarySize(e.curSize),e.updateCursor(e.curSize,e.minSize,e.maxSize),e.props.onResizing&&e.props.onResizing(e.curSize)}},e.onMouseMoveEnd=function(){if(e.props.resizable&&e.resizing){if(e.props.onResizeEnd&&e.props.onResizeEnd(e.curSize),e.props.refresh){var t=e.isPrimaryFirst();e.setState({box1Size:t?e.curSize:void 0,box2Size:t?void 0:e.curSize})}e.resizing=!1,e.removeMask()}},e.refContainer=function(t){e.container=t},e.refResizer=function(t){e.resizerElem=t},e.state=e.getNextState(r),e}return Object(E.a)(n,[{key:"UNSAFE_componentWillReceiveProps",value:function(e){var t=this.getNextState(e);this.setState(t)}},{key:"getNextState",value:function(e){var t=e.size,o=e.defaultSize,s=e.primary,c=t??(o??"25%");return{box1Size:s==="first"?c:void 0,box2Size:s==="second"?c:void 0}}},{key:"isVertical",value:function(){return this.props.split==="vertical"}},{key:"isPrimaryFirst",value:function(){return this.props.primary==="first"}},{key:"getDelta",value:function(e,t){var o=this.props.step,s=this.isVertical(),c=this.isPrimaryFirst(),l=s?e:t;if(l===0)return 0;o&&Math.abs(l)>=o&&(l=~~(l/o)*o),l=c?-l:l;var p=c?this.box1Elem:this.box2Elem,m=c?this.box2Elem:this.box1Elem,C=parseInt(window.getComputedStyle(p).order,10),O=parseInt(window.getComputedStyle(m).order,10);return C>O&&(l=-l),l}},{key:"getRange",value:function(){for(var e=this.props,t=e.maxSize,o=e.minSize,s=this.container.getBoundingClientRect(),c=this.isVertical()?s.width:s.height,l=o!==void 0?o:0,p=t!==void 0?t:0;l<0;)l=c+l;for(;p<=0;)p=c+p;return{minSize:M()(l,0,c),maxSize:M()(p,0,c)}}},{key:"getPrimarySize",value:function(){var e=this.isPrimaryFirst()?this.box1Elem:this.box2Elem;return this.isVertical()?e.getBoundingClientRect().width:e.getBoundingClientRect().height}},{key:"setPrimarySize",value:function(e){var t=this.isPrimaryFirst(),o=t?this.box1Elem:this.box2Elem,s=t?this.box2Elem:this.box1Elem,c=this.resizerElem,l="".concat(e,"px");this.isVertical()?(o.style.width=l,t?(s.style.left=l,c.style.left=l):(s.style.right=l,c.style.right=l)):(o.style.height=l,t?(s.style.top=l,c.style.top=l):(s.style.bottom=l,c.style.bottom=l))}},{key:"updateCursor",value:function(e,t,o){var s="";this.isVertical()?e===t?s=this.isPrimaryFirst()?"e-resize":"w-resize":e===o?s=this.isPrimaryFirst()?"w-resize":"e-resize":s="col-resize":e===t?s=this.isPrimaryFirst()?"s-resize":"n-resize":e===o?s=this.isPrimaryFirst()?"n-resize":"s-resize":s="row-resize",this.maskElem.style.cursor=s}},{key:"createMask",value:function(){var e=document.createElement("div");e.style.position="absolute",e.style.top="0",e.style.right="0",e.style.bottom="0",e.style.left="0",e.style.zIndex="9999",document.body.appendChild(e),this.maskElem=e}},{key:"removeMask",value:function(){this.maskElem.parentNode&&this.maskElem.parentNode.removeChild(this.maskElem)}},{key:"renderBox",value:function(e,t){var o=this,s=t===1?"first":"second",c=this.props.primary===s,l=t===1?this.state.box1Size:this.state.box2Size,p=t===1?this.state.box2Size:this.state.box1Size,m=Object.assign(Object.assign({},this.props.boxStyle),c?this.props.primaryBoxStyle:this.props.secondBoxStyle),C=U()("".concat(e,"-item"),c?"".concat(e,"-item-primary"):"".concat(e,"-item-second")),O=function(N){t===1?o.box1Elem=N:o.box2Elem=N},te=this.props.children;return i.a.createElement(T,{key:"box".concat(t),refIt:O,style:m,index:t,className:C,currentSize:l,oppositeSize:p,vertical:this.isVertical(),isPrimary:c},te[t-1])}},{key:"renderResizer",value:function(e){var t=Object.assign({},this.props.resizerStyle);return t.position="absolute",t.zIndex=2,this.isVertical()?(t.top=0,t.bottom=0,this.props.resizable===!0&&(t.cursor="col-resize"),this.isPrimaryFirst()?t.left=this.state.box1Size:t.right=this.state.box2Size):(t.left=0,t.right=0,this.props.resizable===!0&&(t.cursor="row-resize"),this.isPrimaryFirst()?t.top=this.state.box1Size:t.bottom=this.state.box2Size),i.a.createElement(_,{key:"resizer",style:t,className:"".concat(e,"-resizer"),refIt:this.refResizer,onClick:this.props.onResizerClick,onMouseDown:this.onMouseDown,onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd,onDoubleClick:this.props.onResizerDoubleClick})}},{key:"render",value:function(){var e=Object.assign(Object.assign({},this.props.style),{overflow:"hidden",position:"relative",width:"100%",height:"100%"}),t="".concat(this.props.prefixCls,"-split-box"),o=U()(t,"".concat(t,"-").concat(this.props.split),Object(L.a)({},"".concat(t,"-disabled"),!this.props.resizable));return i.a.createElement("div",{style:e,className:o,ref:this.refContainer},this.renderBox(t,1),this.renderResizer(t),this.renderBox(t,2))}}]),n}(i.a.PureComponent);(function(u){u.defaultProps={resizable:!0,split:"vertical",primary:"first",prefixCls:"x6",defaultSize:"25%"}})(x||(x={}));var ne=a(64),ie=a(65),Y=function(u){Object(y.a)(n,u);var d=Object(g.a)(n);function n(){return Object(v.a)(this,n),d.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){return i.a.createElement("div",{style:{height:400}},i.a.createElement("div",{style:{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:"#f5f5f5",userSelect:"none"}},i.a.createElement(x,{split:"horizontal",minSize:80,maxSize:-80,defaultSize:"80%",primary:"second"},i.a.createElement("div",{style:{width:"100%",height:"100%",background:"#fff7e6"}}),i.a.createElement(x,{split:"vertical",minSize:40,maxSize:-160,defaultSize:240,primary:"first"},i.a.createElement("div",{style:{width:"100%",height:"100%",background:"#fff0f6"}}),i.a.createElement("div",{style:{width:"100%",height:"100%"}},i.a.createElement(x,{split:"vertical",minSize:40,maxSize:-80,defaultSize:"40%",primary:"second"},i.a.createElement("div",{style:{width:"100%",height:"100%"}},i.a.createElement(x,{split:"horizontal",minSize:40,maxSize:-40,defaultSize:80,primary:"first"},i.a.createElement("div",{style:{width:"100%",height:"100%",background:"#e6f7ff"}}),i.a.createElement("div",{style:{width:"100%",height:"100%",background:"#e6fffb"}}))),i.a.createElement("div",{style:{width:"100%",height:"100%",background:"#f6ffed"}})))))))}}]),n}(i.a.Component),H=a(88),J=a(84),W=a(89),G=a(90),b=a(87),re=a(69),$=a(40),oe=a(72),R=a(73),Z=function(){return i.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},i.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},K=function(u){Object(y.a)(n,u);var d=Object(g.a)(n);function n(){return Object(v.a)(this,n),d.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){return i.a.createElement("div",{className:"demo-toolbar"},i.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},i.a.createElement(H.a,{onClick:function(){window.location.reload()}})),window.frameElement&&i.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},i.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},i.a.createElement(J.a,{component:Z}))),i.a.createElement(b.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},i.a.createElement("a",{href:"".concat(R.host),rel:"noopener noreferrer",target:"_blank"},i.a.createElement(W.a,null))),i.a.createElement(b.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},i.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},i.a.createElement("input",{type:"hidden",name:"parameters",value:Object($.getParameters)(R.getCodeSandboxParams())}),i.a.createElement("button",{type:"submit"},i.a.createElement(G.a,null)))))}}]),n}(i.a.Component),Q=a(85),q=a(54),se=a(78),w=function(u){Object(y.a)(n,u);var d=Object(g.a)(n);function n(r){var e;return Object(v.a)(this,n),e=d.call(this,r),e.refContainer=function(t){e.container=t},n.restoreIframeSize(),e}return Object(E.a)(n,[{key:"componentDidMount",value:function(){var e=this;if(this.updateIframeSize(),window.ResizeObserver){var t=new window.ResizeObserver(function(){e.updateIframeSize()});t.observe(this.container)}else window.addEventListener("resize",function(){return e.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var e=window.frameElement;if(e){var t=this.container.scrollHeight||this.container.clientHeight;e.style.width="100%",e.style.height="".concat(t+16,"px"),e.style.border="0",e.style.overflow="hidden",n.saveIframeSize()}}},{key:"render",value:function(){return i.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},i.a.createElement(K,null),this.props.children)}}]),n}(i.a.Component);(function(u){var d=window.location.pathname,n="x6-iframe-size";function r(){var o=localStorage.getItem(n),s;if(o)try{s=JSON.parse(o)}catch(c){}else s={};return s}function e(){var o=window.frameElement;if(o){var s=o.style,c={width:s.width,height:s.height},l=r();l[d]=c,localStorage.setItem(n,JSON.stringify(l))}}u.saveIframeSize=e;function t(){var o=window.frameElement;if(o){var s=r(),c=s[d];c&&(o.style.width=c.width||"100%",o.style.height=c.height||"auto")}}u.restoreIframeSize=t})(w||(w={}));var ae=a(79),ee=function(d){var n=d.children;return i.a.createElement(Q.a.ErrorBoundary,null,i.a.createElement(q.a,null,i.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),i.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),i.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),i.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),i.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),i.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),i.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),i.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),i.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),i.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),i.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),i.a.createElement(w,null,n))};j.a.render(i.a.createElement(ee,null,i.a.createElement(Y,null)),document.getElementById("root"))}},[[59,1,2]]]);
