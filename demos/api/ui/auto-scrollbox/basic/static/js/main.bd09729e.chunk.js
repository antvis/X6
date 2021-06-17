(this["webpackJsonp@antv/x6-sites-demos-api.ui.auto-scrollbox.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.auto-scrollbox.basic"]||[]).push([[0],{64:function(y,v,s){y.exports=s(85)},69:function(y,v,s){},70:function(y,v,s){},77:function(y,v,s){},78:function(y,v,s){"use strict";s.r(v),s.d(v,"host",function(){return P}),s.d(v,"getCodeSandboxParams",function(){return l}),s.d(v,"getStackblitzPrefillConfig",function(){return U});const P="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/auto-scrollbox/basic";function l(){return{files:{"package.json":{isBinary:!1,content:`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { AutoScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'
import '@antv/x6-react-components/es/auto-scroll-box/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ width: 300, height: 200, border: '1px solid #f0f0f0' }}>
          <AutoScrollBox>
            <div
              style={{
                position: 'relative',
                width: 1200,
                height: 3000,
                cursor: 'grab',
                background:
                  'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
              }}
            >
              <div style={{ position: 'absolute', top: 8, left: 8 }}>
                Top-Left-Corner
              </div>
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                Top-Right-Corner
              </div>
              <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                Bottom-Left-Corner
              </div>
              <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                Bottom-Right-Corner
              </div>
            </div>
          </AutoScrollBox>
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
`,isBinary:!1}}}}function U(){return{title:"api/ui/auto-scrollbox/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
  "dependencies": {
    "@antv/x6-react-components": "latest",
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
`,"src/app.tsx":`import React from 'react'
import { AutoScrollBox } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/scroll-box/style/index.css'
import '@antv/x6-react-components/es/auto-scroll-box/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ width: 300, height: 200, border: '1px solid #f0f0f0' }}>
          <AutoScrollBox>
            <div
              style={{
                position: 'relative',
                width: 1200,
                height: 3000,
                cursor: 'grab',
                background:
                  'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
              }}
            >
              <div style={{ position: 'absolute', top: 8, left: 8 }}>
                Top-Left-Corner
              </div>
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                Top-Right-Corner
              </div>
              <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                Bottom-Left-Corner
              </div>
              <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                Bottom-Right-Corner
              </div>
            </div>
          </AutoScrollBox>
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
`}}}},83:function(y,v,s){},85:function(y,v,s){"use strict";s.r(v);var P=s(0),l=s.n(P),U=s(12),ae=s.n(U),b=s(8),w=s(10),M=s(15),X=s(14),_=s(36),R=s(31),ie=s(24),k=s.n(ie),le=s(5),N=s.n(le),C=!!(typeof window!="undefined"&&window.document&&window.document.createElement),Ie=typeof Worker!="undefined",je=C&&!!(window.addEventListener||window.attachEvent),We=C&&!!window.screen,Ye=!C,I={},V=["Webkit","ms","Moz","O"],K=C?document.createElement("div").style:{},se=/-(.)/g;function ce(o){return o.replace(se,function(a,n){return n.toUpperCase()})}function ue(o){for(var a=0;a<V.length;a+=1){var n=V[a]+o;if(n in K)return n}return null}function O(o){var a=ce(o);if(I[a]===void 0){var n=a.charAt(0).toUpperCase()+a.slice(1);I[a]=a in K?a:ue(n)}return I[a]}var Fe=function(){return!!O("animationName")},Be=function(){return!!O("transition")},de=function(){return!!O("transform")},he=function(){return!!O("perspective")},G=O("transform"),pe=O("backfaceVisibility"),me=function(){if(de()){var o=window?window.navigator.userAgent:"",a=/Safari\//.test(o)&&!/Chrome\//.test(o);return!a&&he()?function(n,e,t){n[G]="translate3d(".concat(e,"px,").concat(t,"px,0)"),n[pe]="hidden"}:function(n,e,t){n[G]="translate(".concat(e,"px,").concat(t,"px)")}}return function(n,e,t){n.left="".concat(e,"px"),n.top="".concat(t,"px")}}(),fe=function(){return!0},ve=function(){return!1};function D(o){return typeof o!="function"?o?fe:ve:o}function _e(o,a,n){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:!1;e?(o.left="".concat(a,"px"),o.top="".concat(n,"px")):me(o,a,n)}function ge(o,a,n){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:window.setTimeout,t=arguments.length>4&&arguments[4]!==void 0?arguments[4]:window.clearTimeout,r,i=function c(){for(var h=arguments.length,u=new Array(h),d=0;d<h;d++)u[d]=arguments[d];c.reset();var p=function(){o.apply(n,u)};r=e(p,a)};return i.reset=function(){t(r)},i}var Ee=s(44),J;C&&(J=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0);function be(o,a){if((!C||a)&&!("addEventListener"in document))return!1;var n="on".concat(o),e=n in document;if(!e){var t=document.createElement("div");t.setAttribute(n,"return;"),e=typeof t[n]=="function"}return!e&&J&&o==="wheel"&&(e=document.implementation.hasFeature("Events.wheel","3.0")),e}var Z=10,$=40,Q=800,Se=new Ee.UAParser,we=Se.getResult(),xe=we.browser.name==="Firefox";function ye(o){var a=0,n=0,e=0,t=0;return"detail"in o&&(n=o.detail),"wheelDelta"in o&&(n=-o.wheelDelta/120),"wheelDeltaY"in o&&(n=-o.wheelDeltaY/120),"wheelDeltaX"in o&&(a=-o.wheelDeltaX/120),"axis"in o&&o.axis===o.HORIZONTAL_AXIS&&(a=n,n=0),e=a*Z,t=n*Z,"deltaY"in o&&(t=o.deltaY),"deltaX"in o&&(e=o.deltaX),(e||t)&&o.deltaMode&&(o.deltaMode===1?(e*=$,t*=$):(e*=Q,t*=Q)),e&&!a&&(a=e<1?-1:1),t&&!n&&(n=t<1?-1:1),{spinX:a,spinY:n,pixelX:e,pixelY:t}}function Ve(){return xe?"DOMMouseScroll":be("wheel")?"wheel":"mousewheel"}var q=0,ee=window.requestAnimationFrame||window.webkitRequestAnimationFrame,Te=(window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.clearTimeout).bind(window),A=ee?ee.bind(window):function(o){var a=Date.now(),n=Math.max(0,16-(a-q));return q=a+n,window.setTimeout(function(){o(Date.now())},n)},te=function o(a){var n=this;Object(b.a)(this,o),this.onWheel=function(e){var t=ye(e),r=t.pixelX,i=t.pixelY,c=n.deltaX+r,h=n.deltaY+i,u=n.shouldHandleScrollX(c,h),d=n.shouldHandleScrollY(h,c);if(!u&&!d)return;n.deltaX+=u?r:0,n.deltaY+=d?i:0;var p;(n.deltaX!==0||n.deltaY!==0)&&(n.stopPropagation()&&e.stopPropagation(),p=!0),p===!0&&n.animationFrameID==null&&(n.animationFrameID=A(n.didWheel))},this.didWheel=function(){n.animationFrameID=null,n.callback&&n.callback(n.deltaX,n.deltaY),n.deltaX=0,n.deltaY=0},this.callback=a.onWheel,this.stopPropagation=D(a.stopPropagation),this.shouldHandleScrollX=D(a.shouldHandleScrollX),this.shouldHandleScrollY=D(a.shouldHandleScrollY),this.deltaX=0,this.deltaY=0},j=function(){function o(a){var n=this;Object(b.a)(this,o),this.didTouchMove=function(){n.dragAnimationId=null,n.callback(n.deltaX,n.deltaY),n.accumulatedDeltaX+=n.deltaX,n.accumulatedDeltaY+=n.deltaY,n.deltaX=0,n.deltaY=0},this.track=function(){var e=Date.now(),t=e-n.lastFrameTimestamp,r=n.velocityX,i=n.velocityY,c=.8;t<o.TRACKER_TIMEOUT&&(c*=t/o.TRACKER_TIMEOUT),r===0&&i===0&&(c=1),n.velocityX=c*(o.TRACKER_TIMEOUT*n.accumulatedDeltaX/(1+t)),c<1&&(n.velocityX+=(1-c)*r),n.velocityY=c*(o.TRACKER_TIMEOUT*n.accumulatedDeltaY/(1+t)),c<1&&(n.velocityY+=(1-c)*i),n.accumulatedDeltaX=0,n.accumulatedDeltaY=0,n.lastFrameTimestamp=e},this.startAutoScroll=function(){n.autoScrollTimestamp=Date.now(),(n.deltaX>0||n.deltaY>0)&&n.didTouchMove(),n.track(),n.autoScroll()},this.autoScroll=function(){var e=Date.now()-n.autoScrollTimestamp,t=o.DECELERATION_AMPLITUDE*Math.exp(-e/o.DECELERATION_FACTOR),r=t*n.velocityX,i=t*n.velocityY;(Math.abs(r)<=5||!n.handleScrollX(r,i))&&(r=0),(Math.abs(i)<=5||!n.handleScrollY(i,r))&&(i=0),(r!==0||i!==0)&&(n.callback(r,i),A(n.autoScroll))},this.trackerId=null,this.dragAnimationId=null,this.deltaX=0,this.deltaY=0,this.lastTouchX=0,this.lastTouchY=0,this.velocityX=0,this.velocityY=0,this.accumulatedDeltaX=0,this.accumulatedDeltaY=0,this.lastFrameTimestamp=Date.now(),this.autoScrollTimestamp=Date.now(),this.callback=a.onTouchScroll,this.handleScrollX=D(a.shouldHandleScrollX),this.handleScrollY=D(a.shouldHandleScrollY),this.stopPropagation=D(a.stopPropagation)}return Object(w.a)(o,[{key:"onTouchStart",value:function(n){this.lastTouchX=n.touches[0].pageX,this.lastTouchY=n.touches[0].pageY,this.velocityX=0,this.velocityY=0,this.accumulatedDeltaX=0,this.accumulatedDeltaY=0,this.lastFrameTimestamp=Date.now(),this.trackerId!=null&&clearInterval(this.trackerId),this.trackerId=window.setInterval(this.track,o.TRACKER_TIMEOUT),this.stopPropagation()&&n.stopPropagation()}},{key:"onTouchEnd",value:function(n){this.onTouchCancel(n),A(this.startAutoScroll)}},{key:"onTouchCancel",value:function(n){this.trackerId!=null&&(clearInterval(this.trackerId),this.trackerId=null),this.stopPropagation()&&n.stopPropagation()}},{key:"onTouchMove",value:function(n){var e=n.touches[0].pageX,t=n.touches[0].pageY;this.deltaX=o.MOVE_AMPLITUDE*(this.lastTouchX-e),this.deltaY=o.MOVE_AMPLITUDE*(this.lastTouchY-t);var r=this.handleScrollX(this.deltaX,this.deltaY),i=this.handleScrollY(this.deltaY,this.deltaX);if(!r&&!i)return;r?this.lastTouchX=e:this.deltaX=0,i?this.lastTouchY=t:this.deltaY=0,n.preventDefault();var c=!1;(Math.abs(this.deltaX)>2||Math.abs(this.deltaY)>2)&&(this.stopPropagation()&&n.stopPropagation(),c=!0),c&&this.dragAnimationId==null&&(this.dragAnimationId=A(this.didTouchMove))}}]),o}();(function(o){o.MOVE_AMPLITUDE=1.6,o.DECELERATION_AMPLITUDE=1.6,o.DECELERATION_FACTOR=325,o.TRACKER_TIMEOUT=100})(j||(j={}));var Me=s(37),ne=s.n(Me),oe=function(){function o(a){var n=this;Object(b.a)(this,o),this.onMouseMove=function(e){var t=e.clientX,r=e.clientY;n.deltaX+=t-n.clientX,n.deltaY+=r-n.clientY,n.animationFrameID==null&&(n.animationFrameID=A(n.triggerOnMouseMoveCallback)),n.clientX=t,n.clientY=r,e.preventDefault()},this.onMouseUp=function(){n.animationFrameID&&(Te(n.animationFrameID),n.triggerOnMouseMoveCallback()),n.triggerOnMouseMoveEndCallback(!1)},this.triggerOnMouseMoveCallback=function(){n.animationFrameID=null,n.onMouseMoveCallback(n.deltaX,n.deltaY,{clientX:n.clientX,clientY:n.clientY}),n.deltaX=0,n.deltaY=0},this.triggerOnMouseMoveEndCallback=function(e){n.onMouseMoveEndCallback(e)},this.elem=a.elem||document.documentElement,this.onMouseMoveCallback=a.onMouseMove,this.onMouseMoveEndCallback=a.onMouseMoveEnd,this.animationFrameID=null}return Object(w.a)(o,[{key:"capture",value:function(n){this.captured||(this.removeMouseMoveEvent=ne()(this.elem,"mousemove",this.onMouseMove).remove,this.removeMouseUpEvent=ne()(this.elem,"mouseup",this.onMouseUp).remove),this.captured=!0,this.dragging||(this.clientX=n.clientX,this.clientY=n.clientY,this.deltaX=0,this.deltaY=0,this.dragging=!0),n.preventDefault()}},{key:"release",value:function(){this.captured&&(this.removeMouseMoveEvent!=null&&(this.removeMouseMoveEvent(),this.removeMouseMoveEvent=null),this.removeMouseUpEvent!=null&&(this.removeMouseUpEvent(),this.removeMouseUpEvent=null)),this.captured=!1,this.dragging&&(this.dragging=!1,this.clientX=0,this.clientY=0,this.deltaX=0,this.deltaY=0)}},{key:"isDragging",value:function(){return this.dragging}}]),o}(),Xe=s(17),g=s.n(Xe),T=function(o){Object(M.a)(n,o);var a=Object(X.a)(n);function n(){var e;return Object(b.a)(this,n),e=a.apply(this,arguments),e.triggerCallback=function(t){var r=e.props.contentSize-e.props.containerSize,i=k()(t,0,r);i!==e.props.scrollPosition&&e.props.onScroll(i)},e.onWheel=function(t){e.triggerCallback(e.props.scrollPosition+t)},e.onWheelX=function(t,r){Math.abs(t)>=Math.abs(r)&&e.onWheel(t)},e.onWheelY=function(t,r){Math.abs(t)<=Math.abs(r)&&e.onWheel(r)},e.onKeyDown=function(t){var r=t.keyCode;if(r===g.a.TAB)return;var i=e.props,c=i.contentSize,h=i.containerSize,u=e.props.keyboardScrollAmount,d=0;if(e.isHorizontal())switch(r){case g.a.HOME:d=-1,u=c;break;case g.a.LEFT:d=-1;break;case g.a.RIGHT:d=1;break;default:return}else switch(r){case g.a.SPACE:t.shiftKey?d=-1:d=1;break;case g.a.HOME:d=-1,u=c;break;case g.a.UP:d=-1;break;case g.a.DOWN:d=1;break;case g.a.PAGE_UP:d=-1,u=h;break;case g.a.PAGE_DOWN:d=1,u=h;break;default:return}t.preventDefault(),e.triggerCallback(e.props.scrollPosition+u*d)},e.onMouseDown=function(t){if(t.target!==e.thumbElem){var r=t.nativeEvent,i=e.isHorizontal()?r.offsetX||r.layerX:r.offsetY||r.layerY;e.triggerCallback((i-e.thumbSize*.5)/e.scale)}else e.mouseMoveTracker.capture(t);e.props.stopPropagation&&t.stopPropagation(),e.containerElem.focus()},e.onMouseMove=function(t,r){var i=e.isHorizontal()?t:r;i!==0&&(i/=e.scale,e.triggerCallback(e.props.scrollPosition+i))},e.onMouseMoveEnd=function(){e.mouseMoveTracker.release()},e.refContainer=function(t){e.containerElem=t},e.refThumb=function(t){e.thumbElem=t},e}return Object(w.a)(n,[{key:"UNSAFE_componentWillMount",value:function(){this.wheelHandler=new te({onWheel:this.isHorizontal()?this.onWheelX:this.onWheelY,shouldHandleScrollX:!0,shouldHandleScrollY:!0,stopPropagation:this.props.stopPropagation}),this.mouseMoveTracker=new oe({elem:document.documentElement,onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd})}},{key:"componentWillUnmount",value:function(){this.mouseMoveTracker.release()}},{key:"isHorizontal",value:function(){return this.props.orientation==="horizontal"}},{key:"fixPosition",value:function(t){var r=this.props.contentSize-this.props.containerSize;return k()(t,0,r)}},{key:"render",value:function(){var t,r=this.props,i=r.prefixCls,c=r.className,h=r.scrollPosition,u=r.containerSize,d=r.contentSize,p=r.miniThumbSize,E=r.zIndex,S=r.scrollbarSize;if(u<1||d<=u)return null;var f=u/d,m=u*f;m<p&&(f=(u-p)/(d-u),m=p),this.scale=f,this.thumbSize=m;var x,L,B=this.isHorizontal();B?(x={width:u,height:S},L={width:m,transform:"translate(".concat(h*f,"px, 0)")}):(x={width:S,height:u},L={height:m,transform:"translate(0, ".concat(h*f,"px)")}),E&&(x.zIndex=E);var z="".concat(i,"-scrollbar");return l.a.createElement("div",{role:"button",className:N()(z,(t={},Object(R.a)(t,"".concat(z,"-vertical"),!B),Object(R.a)(t,"".concat(z,"-horizontal"),B),t),c),style:x,tabIndex:0,ref:this.refContainer,onKeyDown:this.onKeyDown,onMouseDown:this.onMouseDown,onWheel:this.wheelHandler.onWheel},l.a.createElement("div",{ref:this.refThumb,style:L,className:"".concat(z,"-thumb")}))}}]),n}(l.a.PureComponent);(function(o){o.defaultProps={prefixCls:"x6",orientation:"vertical",contentSize:0,containerSize:0,defaultPosition:0,scrollbarSize:4,miniThumbSize:16,keyboardScrollAmount:40}})(T||(T={}));var W=function(o){Object(M.a)(n,o);var a=Object(X.a)(n);function n(){var e;return Object(b.a)(this,n),e=a.apply(this,arguments),e.onScroll=function(t,r){e.scrolling||e.triggerScrollStart(),Math.abs(r)>Math.abs(t)&&e.state.hasVerticalBar?e.scrollVertical(r,!0):t&&e.state.hasHorizontalBar&&e.scrollHorizontal(t,!0),e.triggerScrollStop()},e.onVerticalScroll=function(t){if(t===e.state.scrollTop)return;e.scrolling||e.triggerScrollStart(),e.scrollVertical(t,!1),e.triggerScrollStop()},e.onHorizontalScroll=function(t){if(t===e.state.scrollLeft)return;e.scrolling||e.triggerScrollStart(),e.scrollHorizontal(t,!1),e.triggerScrollStop()},e.shouldHandleWheelX=function(t){return!e.state.hasHorizontalBar||t===0?!1:(t=Math.round(t),t===0?!1:t<0&&e.state.scrollLeft>0||t>=0&&e.state.scrollLeft<e.state.maxScrollLeft)},e.shouldHandleWheelY=function(t){return!e.state.hasVerticalBar||t===0?!1:(t=Math.round(t),t===0?!1:t<0&&e.state.scrollTop>0||t>=0&&e.state.scrollTop<e.state.maxScrollTop)},e.shouldHandleTouchX=function(t){return e.props.touchable?e.shouldHandleWheelX(t):!1},e.shouldHandleTouchY=function(t){return e.props.touchable?e.shouldHandleWheelY(t):!1},e.onMouseDown=function(t){e.mouseMoveTracker!=null&&e.mouseMoveTracker.capture(t)},e.onMouseMove=function(t,r){e.scrolling||e.triggerScrollStart(),e.scrollVertical(r,!0),e.scrollHorizontal(t,!0)},e.onMouseMoveEnd=function(){e.mouseMoveTracker!=null&&e.mouseMoveTracker.release(),e.triggerScrollStop()},e.refContainer=function(t){e.containerElem=t},e.refContent=function(t){e.contentElem=t},e.onWheel=function(t){e.wheelHandler!=null&&e.wheelHandler.onWheel(t)},e}return Object(w.a)(n,[{key:"UNSAFE_componentWillMount",value:function(){this.triggerScrollStop=ge(this.triggerScrollStopSync,200,this),this.wheelHandler=new te({onWheel:this.onScroll,shouldHandleScrollX:this.shouldHandleWheelX,shouldHandleScrollY:this.shouldHandleWheelY,stopPropagation:this.props.stopPropagation}),this.props.touchable&&(this.touchHandler=new j({onTouchScroll:this.onScroll,shouldHandleScrollX:this.shouldHandleTouchX,shouldHandleScrollY:this.shouldHandleTouchY,stopPropagation:this.props.stopPropagation})),this.props.dragable&&(this.mouseMoveTracker=new oe({elem:document.documentElement,onMouseMove:this.onMouseMove,onMouseMoveEnd:this.onMouseMoveEnd})),this.setState(this.calculateState())}},{key:"componentDidMount",value:function(){this.mounted=!0,this.setState(this.calculateState())}},{key:"UNSAFE_componentWillReceiveProps",value:function(t){this.setState(this.calculateState(t))}},{key:"componentWillUnmount",value:function(){this.wheelHandler=null,this.props.touchable&&(this.touchHandler=null),this.props.dragable&&this.mouseMoveTracker!=null&&(this.mouseMoveTracker.release(),this.mouseMoveTracker=null);var t=this.triggerScrollStop;t.reset(),this.triggerScrollStopSync()}},{key:"calculateState",value:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:this.props,r=t.containerWidth!==void 0&&t.containerWidth!==this.props.containerWidth?t.containerWidth:this.props.containerWidth!==void 0?this.props.containerWidth:this.containerElem&&this.containerElem.clientWidth||0,i=t.containerHeight!==void 0&&t.containerHeight!==this.props.containerHeight?t.containerHeight:this.props.containerHeight!==void 0?this.props.containerHeight:this.containerElem&&this.containerElem.clientHeight||0,c=t.contentWidth!==void 0&&t.contentWidth!==this.props.contentWidth?t.contentWidth:this.props.contentWidth!==void 0?this.props.contentWidth:this.contentElem&&this.contentElem.scrollWidth||0,h=t.contentHeight!==void 0&&t.contentHeight!==this.props.contentHeight?t.contentHeight:this.props.contentHeight!==void 0?this.props.contentHeight:this.contentElem&&this.contentElem.scrollHeight||0,u=h>i,d=c>r,p=0,E=0,S=0,f=0,m=i,x=r;u&&(d&&(m-=t.scrollbarSize),S=h-m,t.scrollTop!==this.props.scrollTop?p=t.scrollTop:p=(this.state?this.state.scrollTop:t.scrollTop)||0),d&&(u&&(x-=t.scrollbarSize),f=c-x,t.scrollLeft!==this.props.scrollLeft?E=t.scrollLeft:E=(this.state?this.state.scrollLeft:t.scrollLeft)||0);var L={containerWidth:r,containerHeight:i,contentWidth:c,contentHeight:h,verticalBarHeight:m,horizontalBarWidth:x,hasVerticalBar:u,hasHorizontalBar:d,maxScrollTop:S,maxScrollLeft:f,scrollTop:k()(p,0,S),scrollLeft:k()(E,0,f)};return L}},{key:"scrollVertical",value:function(t,r){var i=k()(r?this.state.scrollTop+t:t,0,this.state.maxScrollTop);this.props.onVerticalScroll&&this.props.onVerticalScroll(i),this.setState({scrollTop:i})}},{key:"scrollHorizontal",value:function(t,r){var i=k()(r?this.state.scrollLeft+t:t,0,this.state.maxScrollLeft);this.props.onHorizontalScroll&&this.props.onHorizontalScroll(i),this.setState({scrollLeft:i})}},{key:"triggerScrollStart",value:function(){if(this.scrolling)return;this.scrolling=!0,this.props.onScrollStart&&this.props.onScrollStart(this.state.scrollLeft,this.state.scrollTop)}},{key:"triggerScrollStopSync",value:function(){if(!this.scrolling)return;this.scrolling=!1,this.props.onScrollEnd&&this.props.onScrollEnd(this.state.scrollLeft,this.state.scrollTop)}},{key:"getScrollbarProps",value:function(){return{zIndex:this.props.zIndex,miniThumbSize:this.props.miniThumbSize,scrollbarSize:this.props.scrollbarSize,keyboardScrollAmount:this.props.keyboardScrollAmount,stopPropagation:!0}}},{key:"renderVerticalBar",value:function(){if(this.state.hasVerticalBar)return l.a.createElement(T,Object.assign({orientation:"vertical",scrollPosition:this.state.scrollTop,contentSize:this.state.contentHeight,containerSize:this.state.verticalBarHeight,onScroll:this.onVerticalScroll},this.getScrollbarProps()))}},{key:"renderHorizontalBar",value:function(){if(this.state.hasHorizontalBar)return l.a.createElement(T,Object.assign({orientation:"horizontal",scrollPosition:this.state.scrollLeft,contentSize:this.state.contentWidth,containerSize:this.state.horizontalBarWidth,onScroll:this.onHorizontalScroll},this.getScrollbarProps()))}},{key:"render",value:function(){var t={};this.props.touchable&&(t.onTouchStart=this.touchHandler.onTouchStart,t.onTouchEnd=this.touchHandler.onTouchEnd,t.onTouchMove=this.touchHandler.onTouchMove,t.onTouchCancel=this.touchHandler.onTouchCancel),this.props.dragable&&(t.onMouseDown=this.onMouseDown);var r={},i={};(this.props.containerWidth!=null||this.mounted)&&(i.width=this.state.containerWidth),(this.props.containerHeight!=null||this.mounted)&&(i.height=this.state.containerHeight),(this.props.contentWidth!=null||this.mounted)&&(r.width=this.state.contentWidth),(this.props.contentHeight!=null||this.mounted)&&(r.height=this.state.contentHeight),this.mounted&&(r.transform="translate(-".concat(this.state.scrollLeft,"px, -").concat(this.state.scrollTop,"px)"));var c=this.props,h=c.prefixCls,u=c.scrollbarAutoHide,d="".concat(h,"-scroll-box");return l.a.createElement("div",Object.assign({},t,{style:Object.assign(Object.assign({},this.props.containerStyle),i),ref:this.refContainer,onWheel:this.onWheel,className:N()(d,Object(R.a)({},"".concat(d,"-auto-hide"),u),this.props.containerClassName)}),l.a.createElement("div",{style:Object.assign(Object.assign({},this.props.contentStyle),r),ref:this.refContent,className:N()("".concat(d,"-content"),this.props.contentClassName)},this.props.children),this.renderVerticalBar(),this.renderHorizontalBar())}}]),n}(l.a.PureComponent);(function(o){o.defaultProps={prefixCls:"x6",scrollTop:0,scrollLeft:0,dragable:!0,touchable:!0,scrollbarAutoHide:!0,scrollbarSize:T.defaultProps.scrollbarSize,miniThumbSize:T.defaultProps.miniThumbSize,keyboardScrollAmount:T.defaultProps.keyboardScrollAmount}})(W||(W={}));var ke=function(o,a){var n={};for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&a.indexOf(e)<0&&(n[e]=o[e]);if(o!=null&&typeof Object.getOwnPropertySymbols=="function")for(var t=0,e=Object.getOwnPropertySymbols(o);t<e.length;t++)a.indexOf(e[t])<0&&Object.prototype.propertyIsEnumerable.call(o,e[t])&&(n[e[t]]=o[e[t]]);return n},Y=function(o){Object(M.a)(n,o);var a=Object(X.a)(n);function n(e){var t;return Object(b.a)(this,n),t=a.call(this,e),t.onContentResize=function(r,i){t.props.scrollX&&t.setState({contentWidth:r}),t.props.scrollY&&t.setState({contentHeight:i})},t.state={contentWidth:null,contentHeight:null},t}return Object(w.a)(n,[{key:"render",value:function(){var t=this,r=this.props,i=r.prefixCls,c=r.children,h=r.scrollX,u=r.scrollY,d=r.scrollBoxProps,p=ke(r,["prefixCls","children","scrollX","scrollY","scrollBoxProps"]);return l.a.createElement(_.a,Object.assign({handleWidth:h,handleHeight:u},p),function(E){var S=E.width,f=E.height,m={};return h||(m.contentWidth=S),u||(m.contentHeight=f),t.state.contentWidth!=null&&(m.contentWidth=t.state.contentWidth),t.state.contentHeight!=null&&(m.contentHeight=t.state.contentHeight),l.a.createElement(W,Object.assign({dragable:!1,scrollbarSize:3},d,{containerWidth:S,containerHeight:f}),l.a.createElement("div",{className:"".concat(i,"-auto-scroll-box-content")},l.a.createElement(_.a,{handleWidth:h,handleHeight:u,skipOnMount:!0,onResize:t.onContentResize},c)))})}}]),n}(l.a.PureComponent);(function(o){o.defaultProps={prefixCls:"x6",scrollX:!0,scrollY:!0}})(Y||(Y={}));var Ke=s(69),Ge=s(70),Ce=function(o){Object(M.a)(n,o);var a=Object(X.a)(n);function n(){return Object(b.a)(this,n),a.apply(this,arguments)}return Object(w.a)(n,[{key:"render",value:function(){return l.a.createElement("div",{style:{padding:24}},l.a.createElement("div",{style:{width:300,height:200,border:"1px solid #f0f0f0"}},l.a.createElement(Y,null,l.a.createElement("div",{style:{position:"relative",width:1200,height:3e3,cursor:"grab",background:"linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%), linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%), linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)"}},l.a.createElement("div",{style:{position:"absolute",top:8,left:8}},"Top-Left-Corner"),l.a.createElement("div",{style:{position:"absolute",top:8,right:8}},"Top-Right-Corner"),l.a.createElement("div",{style:{position:"absolute",bottom:8,left:8}},"Bottom-Left-Corner"),l.a.createElement("div",{style:{position:"absolute",bottom:8,right:8}},"Bottom-Right-Corner")))))}}]),n}(l.a.PureComponent),Oe=s(94),De=s(90),Ae=s(95),Le=s(96),H=s(93),Je=s(74),He=s(45),Ze=s(77),re=s(78),ze=function(){return l.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},l.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},Pe=function(o){Object(M.a)(n,o);var a=Object(X.a)(n);function n(){return Object(b.a)(this,n),a.apply(this,arguments)}return Object(w.a)(n,[{key:"render",value:function(){return l.a.createElement("div",{className:"demo-toolbar"},l.a.createElement(H.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},l.a.createElement(Oe.a,{onClick:function(){window.location.reload()}})),window.frameElement&&l.a.createElement(H.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},l.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},l.a.createElement(De.a,{component:ze}))),l.a.createElement(H.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},l.a.createElement("a",{href:"".concat(re.host),rel:"noopener noreferrer",target:"_blank"},l.a.createElement(Ae.a,null))),l.a.createElement(H.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},l.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},l.a.createElement("input",{type:"hidden",name:"parameters",value:Object(He.getParameters)(re.getCodeSandboxParams())}),l.a.createElement("button",{type:"submit"},l.a.createElement(Le.a,null)))))}}]),n}(l.a.Component),Ue=s(91),Re=s(59),$e=s(83),F=function(o){Object(M.a)(n,o);var a=Object(X.a)(n);function n(e){var t;return Object(b.a)(this,n),t=a.call(this,e),t.refContainer=function(r){t.container=r},n.restoreIframeSize(),t}return Object(w.a)(n,[{key:"componentDidMount",value:function(){var t=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){t.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return t.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var t=window.frameElement;if(t){var r=this.container.scrollHeight||this.container.clientHeight;t.style.width="100%",t.style.height="".concat(r+16,"px"),t.style.border="0",t.style.overflow="hidden",n.saveIframeSize()}}},{key:"render",value:function(){return l.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},l.a.createElement(Pe,null),this.props.children)}}]),n}(l.a.Component);(function(o){var a=window.location.pathname,n="x6-iframe-size";function e(){var i=localStorage.getItem(n),c;if(i)try{c=JSON.parse(i)}catch(h){}else c={};return c}function t(){var i=window.frameElement;if(i){var c=i.style,h={width:c.width,height:c.height},u=e();u[a]=h,localStorage.setItem(n,JSON.stringify(u))}}o.saveIframeSize=t;function r(){var i=window.frameElement;if(i){var c=e(),h=c[a];h&&(i.style.width=h.width||"100%",i.style.height=h.height||"auto")}}o.restoreIframeSize=r})(F||(F={}));var Qe=s(84),Ne=function(a){var n=a.children;return l.a.createElement(Ue.a.ErrorBoundary,null,l.a.createElement(Re.a,null,l.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),l.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),l.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),l.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),l.a.createElement(F,null,n))};ae.a.render(l.a.createElement(Ne,null,l.a.createElement(Ce,null)),document.getElementById("root"))}},[[64,1,2]]]);
