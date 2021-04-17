(this["webpackJsonp@antv/x6-sites-demos-api.ui.color-picker.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.color-picker.basic"]||[]).push([[0],{132:function(p,d,t){p.exports=t(261)},137:function(p,d,t){},257:function(p,d,t){},258:function(p,d,t){"use strict";t.r(d),t.d(d,"host",function(){return b}),t.d(d,"getCodeSandboxParams",function(){return n}),t.d(d,"getStackblitzPrefillConfig",function(){return x});const b="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/color-picker/basic";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { ColorPicker } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/color-picker/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24, height: 400 }}>
        <div style={{ width: 120 }}>
          <ColorPicker color="#333333" />
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
`,isBinary:!1}}}}function x(){return{title:"api/ui/color-picker/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { ColorPicker } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/color-picker/style/index.css'

export default class Example extends React.PureComponent {
  render() {
    return (
      <div style={{ padding: 24, height: 400 }}>
        <div style={{ width: 120 }}>
          <ColorPicker color="#333333" />
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
`}}}},259:function(p,d,t){},261:function(p,d,t){"use strict";t.r(d);var b=t(0),n=t.n(b),x=t(13),X=t.n(x),f=t(23),h=t(24),E=t(27),v=t(26),D=t(105),L=t(7),w=t.n(L),j=t(269),Y=t(138),R=t(106),N=t.n(R),M=t(128),S=function(s,l){var o={};for(var r in s)Object.prototype.hasOwnProperty.call(s,r)&&l.indexOf(r)<0&&(o[r]=s[r]);if(s!=null&&typeof Object.getOwnPropertySymbols=="function")for(var e=0,r=Object.getOwnPropertySymbols(s);e<r.length;e++)l.indexOf(r[e])<0&&Object.prototype.propertyIsEnumerable.call(s,r[e])&&(o[r[e]]=s[r[e]]);return o},y=function(s){Object(E.a)(o,s);var l=Object(v.a)(o);function o(r){var e;return Object(f.a)(this,o),e=l.call(this,r),e.onDocumentClick=function(i){var a=i.target;if(a===e.container||e.container.contains(a))return;e.setState({active:!1}),e.unbindDocEvent()},e.handleChange=function(i,a){e.props.onChange&&e.props.onChange(i,a),e.setState({active:!1,color:i.rgb}),e.unbindDocEvent()},e.handleClick=function(i){i.stopPropagation(),e.state.active?(e.setState({active:!1}),e.unbindDocEvent()):(e.setState({active:!0}),e.removeDocClickEvent||(e.removeDocClickEvent=N()(document.documentElement,"click",e.onDocumentClick).remove))},e.refContainer=function(i){e.container=i},e.state={active:!1,color:r.color},e}return Object(h.a)(o,[{key:"componentWillUnmount",value:function(){this.unbindDocEvent()}},{key:"unbindDocEvent",value:function(){this.removeDocClickEvent&&(this.removeDocClickEvent(),this.removeDocClickEvent=null)}},{key:"renderPicker",value:function(){var e=this.props,i=e.prefixCls,a=e.disabled,c=e.style,m=S(e,["prefixCls","disabled","style"]);return n.a.createElement(M.a,Object.assign({width:"240px"},m,{onChange:this.handleChange}))}},{key:"render",value:function(){var e=this.state.color,i=this.props,a=i.disabled,c=i.overlayProps,m=i.style,u="".concat(this.props.prefixCls,"-color-picker"),O={};a?O.visible=!1:O.visible=this.state.active;var W=typeof e=="string"?e:"rgba(".concat(e.r,",").concat(e.g,",").concat(e.b,",").concat(e.a,")");return n.a.createElement(j.a,Object.assign({placement:"topLeft"},c,O,{content:this.renderPicker(),overlayClassName:"".concat(u,"-overlay")}),n.a.createElement("div",{style:m,ref:this.refContainer,onClick:this.handleClick,className:w()(u,Object(D.a)({},"".concat(u,"-disabled"),a))},n.a.createElement("div",{className:"".concat(u,"-block"),style:{backgroundColor:a?"#c4c4c4":W}})))}}]),o}(n.a.Component);(function(s){s.defaultProps={prefixCls:"x6",color:"#1890FF"}})(y||(y={}));var G=t(137),A=function(s){Object(E.a)(o,s);var l=Object(v.a)(o);function o(){return Object(f.a)(this,o),l.apply(this,arguments)}return Object(h.a)(o,[{key:"render",value:function(){return n.a.createElement("div",{style:{padding:24,height:400}},n.a.createElement("div",{style:{width:120}},n.a.createElement(y,{color:"#333333"})))}}]),o}(n.a.PureComponent),U=t(270),P=t(266),T=t(271),I=t(272),g=t(130),Z=t(254),z=t(122),K=t(257),k=t(258),B=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},H=function(s){Object(E.a)(o,s);var l=Object(v.a)(o);function o(){return Object(f.a)(this,o),l.apply(this,arguments)}return Object(h.a)(o,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(U.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(P.a,{component:B}))),n.a.createElement(g.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(k.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(T.a,null))),n.a.createElement(g.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(z.getParameters)(k.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(I.a,null)))))}}]),o}(n.a.Component),F=t(267),J=t(125),$=t(259),C=function(s){Object(E.a)(o,s);var l=Object(v.a)(o);function o(r){var e;return Object(f.a)(this,o),e=l.call(this,r),e.refContainer=function(i){e.container=i},o.restoreIframeSize(),e}return Object(h.a)(o,[{key:"componentDidMount",value:function(){var e=this;if(this.updateIframeSize(),window.ResizeObserver){var i=new window.ResizeObserver(function(){e.updateIframeSize()});i.observe(this.container)}else window.addEventListener("resize",function(){return e.updateIframeSize()});setTimeout(function(){var a=document.getElementById("loading");a&&a.parentNode&&a.parentNode.removeChild(a)},1e3)}},{key:"updateIframeSize",value:function(){var e=window.frameElement;if(e){var i=this.container.scrollHeight||this.container.clientHeight;e.style.width="100%",e.style.height="".concat(i+16,"px"),e.style.border="0",e.style.overflow="hidden",o.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(H,null),this.props.children)}}]),o}(n.a.Component);(function(s){var l=window.location.pathname,o="x6-iframe-size";function r(){var a=localStorage.getItem(o),c;if(a)try{c=JSON.parse(a)}catch(m){}else c={};return c}function e(){var a=window.frameElement;if(a){var c=a.style,m={width:c.width,height:c.height},u=r();u[l]=m,localStorage.setItem(o,JSON.stringify(u))}}s.saveIframeSize=e;function i(){var a=window.frameElement;if(a){var c=r(),m=c[l];m&&(a.style.width=m.width||"100%",a.style.height=m.height||"auto")}}s.restoreIframeSize=i})(C||(C={}));var Q=t(260),V=function(l){var o=l.children;return n.a.createElement(F.a.ErrorBoundary,null,n.a.createElement(J.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(C,null,o))};X.a.render(n.a.createElement(V,null,n.a.createElement(A,null)),document.getElementById("root"))}},[[132,1,2]]]);
