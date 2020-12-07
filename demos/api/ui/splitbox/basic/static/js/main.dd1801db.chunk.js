(this["webpackJsonpapi.ui.splitbox.basic"]=this["webpackJsonpapi.ui.splitbox.basic"]||[]).push([[0],{102:function(h,f,s){},125:function(h,f,s){"use strict";s.r(f);var S=s(0),r=s.n(S),z=s(10),j=s.n(z),v=s(6),E=s(7),g=s(12),b=s(11),L=s(50),P=s(37),M=s.n(P),A=s(3),D=s.n(A),T=function(d){Object(g.a)(n,d);var u=Object(b.a)(n);function n(){return Object(v.a)(this,n),u.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){var e=this.props,t=e.refIt,o=e.className,a=e.index,c=e.currentSize,l=e.oppositeSize,p=e.vertical,m=Object.assign(Object.assign({},this.props.style),{overflow:"hidden",position:"absolute",zIndex:1});return p?(m.bottom=0,m.top=0):(m.left=0,m.right=0),c!=null?p?(m.width=c,a===1?m.left=0:m.right=0):(m.height=c,a===1?m.top=0:m.bottom=0):p?a===1?(m.left=0,m.right=l):(m.left=l,m.right=0):a===1?(m.top=0,m.bottom=l):(m.top=l,m.bottom=0),r.a.createElement("div",{ref:t,style:m,className:o},this.props.children)}}]),n}(r.a.PureComponent),B=s(43),X=s.n(B),R=0,N=window.requestAnimationFrame||window.webkitRequestAnimationFrame,I=(window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout).bind(window),F=N?N.bind(window):function(d){var u=Date.now(),n=Math.max(0,16-(u-R));return R=u+n,window.setTimeout(function(){d(Date.now())},n)},_=function(){function d(u){var n=this;Object(v.a)(this,d),this.onMouseMove=function(i){var e=i.clientX,t=i.clientY;n.deltaX+=e-n.clientX,n.deltaY+=t-n.clientY,n.animationFrameID==null&&(n.animationFrameID=F(n.triggerOnMouseMoveCallback)),n.clientX=e,n.clientY=t,i.preventDefault()},this.onMouseUp=function(){n.animationFrameID&&(I(n.animationFrameID),n.triggerOnMouseMoveCallback()),n.triggerOnMouseMoveEndCallback(!1)},this.triggerOnMouseMoveCallback=function(){n.animationFrameID=null,n.onMouseMoveCallback(n.deltaX,n.deltaY,{clientX:n.clientX,clientY:n.clientY}),n.deltaX=0,n.deltaY=0},this.triggerOnMouseMoveEndCallback=function(i){n.onMouseMoveEndCallback(i)},this.elem=u.elem||document.documentElement,this.onMouseMoveCallback=u.onMouseMove,this.onMouseMoveEndCallback=u.onMouseMoveEnd,this.animationFrameID=null}return Object(E.a)(d,[{key:"capture",value:function(n){this.captured||(this.removeMouseMoveEvent=X()(this.elem,"mousemove",this.onMouseMove).remove,this.removeMouseUpEvent=X()(this.elem,"mouseup",this.onMouseUp).remove),this.captured=!0,this.dragging||(this.clientX=n.clientX,this.clientY=n.clientY,this.deltaX=0,this.deltaY=0,this.dragging=!0),n.preventDefault()}},{key:"release",value:function(){this.captured&&(this.removeMouseMoveEvent!=null&&(this.removeMouseMoveEvent(),this.removeMouseMoveEvent=null),this.removeMouseUpEvent!=null&&(this.removeMouseUpEvent(),this.removeMouseUpEvent=null)),this.captured=!1,this.dragging&&(this.dragging=!1,this.clientX=0,this.clientY=0,this.deltaX=0,this.deltaY=0)}},{key:"isDragging",value:function(){return this.dragging}}]),d}(),Y=function(d){Object(g.a)(n,d);var u=Object(b.a)(n);function n(){var i;return Object(v.a)(this,n),i=u.apply(this,arguments),i.onMouseDown=function(e){i.mouseMoveTracker.capture(e),i.props.onMouseDown(e)},i.onMouseMove=function(e,t,o){i.props.onMouseMove!=null&&i.props.onMouseMove(e,t,o)},i.onMouseMoveEnd=function(){i.mouseMoveTracker.release(),i.props.onMouseMoveEnd!=null&&i.props.onMouseMoveEnd()},i.onClick=function(e){i.props.onClick&&i.props.onClick(e)},i.onDoubleClick=function(e){i.props.onDoubleClick&&i.props.onDoubleClick(e)},i}return Object(E.a)(n,[{key:"UNSAFE_componentWillMount",value:function(){this.mouseMoveTracker=new _({onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd})}},{key:"componentWillUnmount",value:function(){this.mouseMoveTracker.release()}},{key:"render",value:function(){var e=this.props,t=e.className,o=e.style;return r.a.createElement("div",{style:o,className:t,onClick:this.onClick,ref:this.props.refIt,onDoubleClick:this.onDoubleClick,onMouseDown:this.onMouseDown})}}]),n}(r.a.PureComponent),x=function(d){Object(g.a)(n,d);var u=Object(b.a)(n);function n(i){var e;return Object(v.a)(this,n),e=u.call(this,i),e.onMouseDown=function(){var t=e.getRange(),o=t.maxSize,a=t.minSize;e.minSize=a,e.maxSize=o,e.curSize=e.getPrimarySize(),e.rawSize=e.curSize,e.resizing=!0,e.createMask(),e.updateCursor(e.curSize,a,o)},e.onMouseMove=function(t,o){if(e.props.resizable&&e.resizing){var a=e.getDelta(t,o);if(a===0)return;if(e.rawSize<e.minSize||e.rawSize>e.maxSize){e.rawSize-=a;return}e.rawSize-=a,e.curSize=e.rawSize,e.curSize=M()(e.curSize,e.minSize,e.maxSize),e.setPrimarySize(e.curSize),e.updateCursor(e.curSize,e.minSize,e.maxSize),e.props.onResizing&&e.props.onResizing(e.curSize)}},e.onMouseMoveEnd=function(){if(e.props.resizable&&e.resizing){if(e.props.onResizeEnd&&e.props.onResizeEnd(e.curSize),e.props.refresh){var t=e.isPrimaryFirst();e.setState({box1Size:t?e.curSize:void 0,box2Size:t?void 0:e.curSize})}e.resizing=!1,e.removeMask()}},e.refContainer=function(t){e.container=t},e.refResizer=function(t){e.resizerElem=t},e.state=e.getNextState(i),e}return Object(E.a)(n,[{key:"UNSAFE_componentWillReceiveProps",value:function(e){var t=this.getNextState(e);this.setState(t)}},{key:"getNextState",value:function(e){var t=e.size,o=e.defaultSize,a=e.primary,c=t??(o??"25%");return{box1Size:a==="first"?c:void 0,box2Size:a==="second"?c:void 0}}},{key:"isVertical",value:function(){return this.props.split==="vertical"}},{key:"isPrimaryFirst",value:function(){return this.props.primary==="first"}},{key:"getDelta",value:function(e,t){var o=this.props.step,a=this.isVertical(),c=this.isPrimaryFirst(),l=a?e:t;if(l===0)return 0;o&&Math.abs(l)>=o&&(l=~~(l/o)*o),l=c?-l:l;var p=c?this.box1Elem:this.box2Elem,m=c?this.box2Elem:this.box1Elem,C=parseInt(window.getComputedStyle(p).order,10),O=parseInt(window.getComputedStyle(m).order,10);return C>O&&(l=-l),l}},{key:"getRange",value:function(){for(var e=this.props,t=e.maxSize,o=e.minSize,a=this.container.getBoundingClientRect(),c=this.isVertical()?a.width:a.height,l=o!==void 0?o:0,p=t!==void 0?t:0;l<0;)l=c+l;for(;p<=0;)p=c+p;return{minSize:M()(l,0,c),maxSize:M()(p,0,c)}}},{key:"getPrimarySize",value:function(){var e=this.isPrimaryFirst()?this.box1Elem:this.box2Elem;return this.isVertical()?e.getBoundingClientRect().width:e.getBoundingClientRect().height}},{key:"setPrimarySize",value:function(e){var t=this.isPrimaryFirst(),o=t?this.box1Elem:this.box2Elem,a=t?this.box2Elem:this.box1Elem,c=this.resizerElem,l="".concat(e,"px");this.isVertical()?(o.style.width=l,t?(a.style.left=l,c.style.left=l):(a.style.right=l,c.style.right=l)):(o.style.height=l,t?(a.style.top=l,c.style.top=l):(a.style.bottom=l,c.style.bottom=l))}},{key:"updateCursor",value:function(e,t,o){var a="";this.isVertical()?e===t?a=this.isPrimaryFirst()?"e-resize":"w-resize":e===o?a=this.isPrimaryFirst()?"w-resize":"e-resize":a="col-resize":e===t?a=this.isPrimaryFirst()?"s-resize":"n-resize":e===o?a=this.isPrimaryFirst()?"n-resize":"s-resize":a="row-resize",this.maskElem.style.cursor=a}},{key:"createMask",value:function(){var e=document.createElement("div");e.style.position="absolute",e.style.top="0",e.style.right="0",e.style.bottom="0",e.style.left="0",e.style.zIndex="9999",document.body.appendChild(e),this.maskElem=e}},{key:"removeMask",value:function(){this.maskElem.parentNode&&this.maskElem.parentNode.removeChild(this.maskElem)}},{key:"renderBox",value:function(e,t){var o=this,a=t===1?"first":"second",c=this.props.primary===a,l=t===1?this.state.box1Size:this.state.box2Size,p=t===1?this.state.box2Size:this.state.box1Size,m=Object.assign(Object.assign({},this.props.boxStyle),c?this.props.primaryBoxStyle:this.props.secondBoxStyle),C=D()("".concat(e,"-item"),c?"".concat(e,"-item-primary"):"".concat(e,"-item-second")),O=function(U){t===1?o.box1Elem=U:o.box2Elem=U},ne=this.props.children;return r.a.createElement(T,{key:"box".concat(t),refIt:O,style:m,index:t,className:C,currentSize:l,oppositeSize:p,vertical:this.isVertical(),isPrimary:c},ne[t-1])}},{key:"renderResizer",value:function(e){var t=Object.assign({},this.props.resizerStyle);return t.position="absolute",t.zIndex=2,this.isVertical()?(t.top=0,t.bottom=0,this.props.resizable===!0&&(t.cursor="col-resize"),this.isPrimaryFirst()?t.left=this.state.box1Size:t.right=this.state.box2Size):(t.left=0,t.right=0,this.props.resizable===!0&&(t.cursor="row-resize"),this.isPrimaryFirst()?t.top=this.state.box1Size:t.bottom=this.state.box2Size),r.a.createElement(Y,{key:"resizer",style:t,className:"".concat(e,"-resizer"),refIt:this.refResizer,onClick:this.props.onResizerClick,onMouseDown:this.onMouseDown,onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd,onDoubleClick:this.props.onResizerDoubleClick})}},{key:"render",value:function(){var e=Object.assign(Object.assign({},this.props.style),{overflow:"hidden",position:"relative",width:"100%",height:"100%"}),t="".concat(this.props.prefixCls,"-split-box"),o=D()(t,"".concat(t,"-").concat(this.props.split),Object(L.a)({},"".concat(t,"-disabled"),!this.props.resizable));return r.a.createElement("div",{style:e,className:o,ref:this.refContainer},this.renderBox(t,1),this.renderResizer(t),this.renderBox(t,2))}}]),n}(r.a.PureComponent);(function(d){d.defaultProps={resizable:!0,split:"vertical",primary:"first",prefixCls:"x6",defaultSize:"25%"}})(x||(x={}));var ie=s(77),re=s(78),V=function(d){Object(g.a)(n,d);var u=Object(b.a)(n);function n(){return Object(v.a)(this,n),u.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){return r.a.createElement("div",{style:{height:400}},r.a.createElement("div",{style:{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:"#f5f5f5",userSelect:"none"}},r.a.createElement(x,{split:"horizontal",minSize:80,maxSize:-80,defaultSize:"80%",primary:"second"},r.a.createElement("div",{style:{width:"100%",height:"100%",background:"#fff7e6"}}),r.a.createElement(x,{split:"vertical",minSize:40,maxSize:-160,defaultSize:240,primary:"first"},r.a.createElement("div",{style:{width:"100%",height:"100%",background:"#fff0f6"}}),r.a.createElement("div",{style:{width:"100%",height:"100%"}},r.a.createElement(x,{split:"vertical",minSize:40,maxSize:-80,defaultSize:"40%",primary:"second"},r.a.createElement("div",{style:{width:"100%",height:"100%"}},r.a.createElement(x,{split:"horizontal",minSize:40,maxSize:-40,defaultSize:80,primary:"first"},r.a.createElement("div",{style:{width:"100%",height:"100%",background:"#e6f7ff"}}),r.a.createElement("div",{style:{width:"100%",height:"100%",background:"#e6fffb"}}))),r.a.createElement("div",{style:{width:"100%",height:"100%",background:"#f6ffed"}})))))))}}]),n}(r.a.Component),H=s(132),J=s(128),W=s(133),G=s(134),$=s(135),y=s(130),oe=s(82),Z=s(51),K=s(52),se=s(86),w=s(85),Q=function(){return r.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},r.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},q=function(d){Object(g.a)(n,d);var u=Object(b.a)(n);function n(){return Object(v.a)(this,n),u.apply(this,arguments)}return Object(E.a)(n,[{key:"render",value:function(){return r.a.createElement("div",{className:"demo-toolbar"},r.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},r.a.createElement(H.a,{onClick:function(){window.location.reload()}})),window.frameElement&&r.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},r.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},r.a.createElement(J.a,{component:Q}))),r.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},r.a.createElement("a",{href:"".concat(w.host),rel:"noopener noreferrer",target:"_blank"},r.a.createElement(W.a,null))),r.a.createElement(y.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},r.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},r.a.createElement("input",{type:"hidden",name:"parameters",value:Object(K.getParameters)(w.getCodeSandboxParams())}),r.a.createElement("button",{type:"submit"},r.a.createElement(G.a,null)))),r.a.createElement(y.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},r.a.createElement($.a,{onClick:function(){Z.a.openProject(w.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),n}(r.a.Component),ee=s(131),ae=s(102),k=function(d){Object(g.a)(n,d);var u=Object(b.a)(n);function n(i){var e;return Object(v.a)(this,n),e=u.call(this,i),e.refContainer=function(t){e.container=t},n.restoreIframeSize(),e}return Object(E.a)(n,[{key:"componentDidMount",value:function(){var e=this;if(this.updateIframeSize(),window.ResizeObserver){var t=new window.ResizeObserver(function(){e.updateIframeSize()});t.observe(this.container)}else window.addEventListener("resize",function(){return e.updateIframeSize()});setTimeout(function(){var o=document.getElementById("loading");o&&o.parentNode&&o.parentNode.removeChild(o)},1e3)}},{key:"updateIframeSize",value:function(){var e=window.frameElement;if(e){var t=this.container.scrollHeight||this.container.clientHeight;e.style.width="100%",e.style.height="".concat(t+16,"px"),e.style.border="0",e.style.overflow="hidden",n.saveIframeSize()}}},{key:"render",value:function(){return r.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},r.a.createElement(q,null),this.props.children)}}]),n}(r.a.Component);(function(d){var u=window.location.pathname,n="x6-iframe-size";function i(){var o=localStorage.getItem(n),a;if(o)try{a=JSON.parse(o)}catch(c){}else a={};return a}function e(){var o=window.frameElement;if(o){var a=o.style,c={width:a.width,height:a.height},l=i();l[u]=c,localStorage.setItem(n,JSON.stringify(l))}}d.saveIframeSize=e;function t(){var o=window.frameElement;if(o){var a=i(),c=a[u];c&&(o.style.width=c.width||"100%",o.style.height=c.height||"auto")}}d.restoreIframeSize=t})(k||(k={}));var le=s(103),te=function(u){var n=u.children;return r.a.createElement(ee.a.ErrorBoundary,null,r.a.createElement(k,null,n))};j.a.render(r.a.createElement(te,null,r.a.createElement(V,null)),document.getElementById("root"))},72:function(h,f,s){h.exports=s(125)},77:function(h,f,s){},78:function(h,f,s){},85:function(h,f,s){"use strict";s.r(f),s.d(f,"host",function(){return S}),s.d(f,"getCodeSandboxParams",function(){return r}),s.d(f,"getStackblitzPrefillConfig",function(){return z});const S="https://github.com/antvis/X6/tree/master//home/runner/work/X6/X6/sites/x6-sites-demos/packages/api/ui/splitbox/basic";function r(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`,isBinary:!1}}}}function z(){return{title:"api/ui/splitbox/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.1.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
`}}}},86:function(h,f,s){}},[[72,1,2]]]);
