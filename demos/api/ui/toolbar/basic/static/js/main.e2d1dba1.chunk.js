(this["webpackJsonp@antv/x6-sites-demos-api.ui.toolbar.basic"]=this["webpackJsonp@antv/x6-sites-demos-api.ui.toolbar.basic"]||[]).push([[0],{100:function(O,p,t){},102:function(O,p,t){"use strict";t.r(p);var b=t(0),n=t.n(b),P=t(16),L=t.n(P),k=t(20),y=t(21),A=t(24),T=t(23),Z=t(81),m=t(108),D=t(109),Y=t(88),$=t(89),K=t(66),_=t(111),E=t(112),g=t(113),f=t(114),h=t(115),U=t(116),R=t(117),C=t(118),I=t(119),e=m.a.Item,o=m.a.Group,w=function(u){Object(A.a)(i,u);var c=Object(T.a)(i);function i(){var r;Object(k.a)(this,i);for(var a=arguments.length,d=new Array(a),l=0;l<a;l++)d[l]=arguments[l];return r=c.call.apply(c,[this].concat(d)),r.onClick=function(s){Z.b.success("".concat(s," clicked"),10)},r.onItemClick=function(){r.onClick("undo")},r}return Object(y.a)(i,[{key:"renderZoomDropdown",value:function(){var a=D.a.Item,d=D.a.Divider;return n.a.createElement(D.a,null,n.a.createElement(a,{name:"resetView",hotkey:"Cmd+H"},"Reset View"),n.a.createElement(a,{name:"fitWindow",hotkey:"Cmd+Shift+H"},"Fit Window"),n.a.createElement(d,null),n.a.createElement(a,{name:"25"},"25%"),n.a.createElement(a,{name:"50"},"50%"),n.a.createElement(a,{name:"75"},"75%"),n.a.createElement(a,{name:"100"},"100%"),n.a.createElement(a,{name:"125"},"125%"),n.a.createElement(a,{name:"150"},"150%"),n.a.createElement(a,{name:"200"},"200%"),n.a.createElement(a,{name:"300"},"300%"),n.a.createElement(a,{name:"400"},"400%"))}},{key:"render",value:function(){return n.a.createElement("div",{style:{padding:24}},n.a.createElement("div",{style:{background:"#f5f5f5",paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,size:"big",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"zoom",tooltipAsTitle:!0,tooltip:"Zoom (Alt+Mousewheel)",dropdown:this.renderZoomDropdown()},n.a.createElement("span",{style:{display:"inline-block",width:40,textAlign:"right"}},"100%"))),n.a.createElement(o,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(_.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(o,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(U.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(R.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(C.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{size:"big",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(_.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(o,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(U.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(R.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(C.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(_.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(o,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(U.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(R.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(C.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(_.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(o,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(U.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(R.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(C.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,size:"small",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(_.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(o,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(U.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(R.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(C.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{size:"small",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(_.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(o,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(o,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(U.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(R.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(C.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,size:"big",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{size:"big",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})," "))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})," "))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,size:"small",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{size:"small",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(o,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})," "))))}}]),i}(n.a.Component),z=t(120),B=t(106),X=t(121),N=t(122),x=t(107),j=t(75),Q=t(96),M=t(97),V=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},H=function(u){Object(A.a)(i,u);var c=Object(T.a)(i);function i(){return Object(k.a)(this,i),c.apply(this,arguments)}return Object(y.a)(i,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u91CD\u65B0\u52A0\u8F7D",mouseEnterDelay:.5},n.a.createElement(z.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728\u65B0\u7A97\u53E3\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(B.a,{component:V}))),n.a.createElement(x.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"\u5728 Github \u4E2D\u67E5\u770B",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(M.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(X.a,null))),n.a.createElement(x.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"\u5728 CodeSandbox \u4E2D\u6253\u5F00",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(j.getParameters)(M.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(N.a,null)))))}}]),i}(n.a.Component),F=t(110),J=t(76),q=t(100),G=function(u){Object(A.a)(i,u);var c=Object(T.a)(i);function i(r){var a;return Object(k.a)(this,i),a=c.call(this,r),a.refContainer=function(d){a.container=d},i.restoreIframeSize(),a}return Object(y.a)(i,[{key:"componentDidMount",value:function(){var a=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){a.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return a.updateIframeSize()});setTimeout(function(){var l=document.getElementById("loading");l&&l.parentNode&&l.parentNode.removeChild(l)},1e3)}},{key:"updateIframeSize",value:function(){var a=window.frameElement;if(a){var d=this.container.scrollHeight||this.container.clientHeight;a.style.width="100%",a.style.height="".concat(d+16,"px"),a.style.border="0",a.style.overflow="hidden",i.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(H,null),this.props.children)}}]),i}(n.a.Component);(function(u){var c=window.location.pathname,i="x6-iframe-size";function r(){var l=localStorage.getItem(i),s;if(l)try{s=JSON.parse(l)}catch(v){}else s={};return s}function a(){var l=window.frameElement;if(l){var s=l.style,v={width:s.width,height:s.height},S=r();S[c]=v,localStorage.setItem(i,JSON.stringify(S))}}u.saveIframeSize=a;function d(){var l=window.frameElement;if(l){var s=r(),v=s[c];v&&(l.style.width=v.width||"100%",l.style.height=v.height||"auto")}}u.restoreIframeSize=d})(G||(G={}));var nn=t(101),W=function(c){var i=c.children;return n.a.createElement(F.a.ErrorBoundary,null,n.a.createElement(J.a,null,n.a.createElement("link",{rel:"icon",href:"/favicon-32x32.png",type:"image/png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"48x48",href:"/icons/icon-48x48.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"72x72",href:"/icons/icon-72x72.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"96x96",href:"/icons/icon-96x96.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"144x144",href:"/icons/icon-144x144.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"192x192",href:"/icons/icon-192x192.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"256x256",href:"/icons/icon-256x256.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"384x384",href:"/icons/icon-384x384.png"}),n.a.createElement("link",{rel:"apple-touch-icon",sizes:"512x512",href:"/icons/icon-512x512.png"}),n.a.createElement("link",{rel:"manifest",href:"/manifest.webmanifest"}),n.a.createElement("link",{rel:"sitemap",type:"application/xml",href:"/sitemap.xml"})),n.a.createElement(G,null,i))};L.a.render(n.a.createElement(W,null,n.a.createElement(w,null)),document.getElementById("root"))},83:function(O,p,t){O.exports=t(102)},96:function(O,p,t){},97:function(O,p,t){"use strict";t.r(p),t.d(p,"host",function(){return b}),t.d(p,"getCodeSandboxParams",function(){return n}),t.d(p,"getStackblitzPrefillConfig",function(){return P});const b="https://github.com/antvis/X6/tree/master/sites/x6-sites-demos/packages/api/ui/toolbar/basic";function n(){return{files:{"package.json":{isBinary:!1,content:`{
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
import { message } from 'antd'
import { Menu, Toolbar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/toolbar/style/index.css'
import 'antd/dist/antd.css'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RedoOutlined,
  UndoOutlined,
  DeleteOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons'

const Item = Toolbar.Item // eslint-disable-line
const Group = Toolbar.Group // eslint-disable-line

export default class Example extends React.Component {
  onClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onItemClick = () => {
    this.onClick('undo')
  }

  renderZoomDropdown() {
    const MenuItem = Menu.Item // eslint-disable-line
    const Divider = Menu.Divider // eslint-disable-line

    return (
      <Menu>
        <MenuItem name="resetView" hotkey="Cmd+H">
          Reset View
        </MenuItem>
        <MenuItem name="fitWindow" hotkey="Cmd+Shift+H">
          Fit Window
        </MenuItem>
        <Divider />
        <MenuItem name="25">25%</MenuItem>
        <MenuItem name="50">50%</MenuItem>
        <MenuItem name="75">75%</MenuItem>
        <MenuItem name="100">100%</MenuItem>
        <MenuItem name="125">125%</MenuItem>
        <MenuItem name="150">150%</MenuItem>
        <MenuItem name="200">200%</MenuItem>
        <MenuItem name="300">300%</MenuItem>
        <MenuItem name="400">400%</MenuItem>
      </Menu>
    )
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ background: '#f5f5f5', paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoom"
                tooltipAsTitle={true}
                tooltip="Zoom (Alt+Mousewheel)"
                dropdown={this.renderZoomDropdown()}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 40,
                    textAlign: 'right',
                  }}
                >
                  100%
                </span>
              </Item>
            </Group>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar extra={<span>Extra Component</span>}>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar onClick={this.onClick} extra={<span>Extra Component</span>}>
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
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
`,isBinary:!1}}}}function P(){return{title:"api/ui/toolbar/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":`{
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
import { message } from 'antd'
import { Menu, Toolbar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/toolbar/style/index.css'
import 'antd/dist/antd.css'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RedoOutlined,
  UndoOutlined,
  DeleteOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons'

const Item = Toolbar.Item // eslint-disable-line
const Group = Toolbar.Group // eslint-disable-line

export default class Example extends React.Component {
  onClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onItemClick = () => {
    this.onClick('undo')
  }

  renderZoomDropdown() {
    const MenuItem = Menu.Item // eslint-disable-line
    const Divider = Menu.Divider // eslint-disable-line

    return (
      <Menu>
        <MenuItem name="resetView" hotkey="Cmd+H">
          Reset View
        </MenuItem>
        <MenuItem name="fitWindow" hotkey="Cmd+Shift+H">
          Fit Window
        </MenuItem>
        <Divider />
        <MenuItem name="25">25%</MenuItem>
        <MenuItem name="50">50%</MenuItem>
        <MenuItem name="75">75%</MenuItem>
        <MenuItem name="100">100%</MenuItem>
        <MenuItem name="125">125%</MenuItem>
        <MenuItem name="150">150%</MenuItem>
        <MenuItem name="200">200%</MenuItem>
        <MenuItem name="300">300%</MenuItem>
        <MenuItem name="400">400%</MenuItem>
      </Menu>
    )
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ background: '#f5f5f5', paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoom"
                tooltipAsTitle={true}
                tooltip="Zoom (Alt+Mousewheel)"
                dropdown={this.renderZoomDropdown()}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 40,
                    textAlign: 'right',
                  }}
                >
                  100%
                </span>
              </Item>
            </Group>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar extra={<span>Extra Component</span>}>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar onClick={this.onClick} extra={<span>Extra Component</span>}>
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
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
`}}}}},[[83,1,2]]]);
