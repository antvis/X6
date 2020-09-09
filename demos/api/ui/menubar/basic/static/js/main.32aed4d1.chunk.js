(this["webpackJsonpapi.ui.menubar.basic"]=this["webpackJsonpapi.ui.menubar.basic"]||[]).push([[0],{115:function(b,E,o){"use strict";o.r(E),o.d(E,"host",function(){return N}),o.d(E,"getCodeSandboxParams",function(){return n}),o.d(E,"getStackblitzPrefillConfig",function(){return U});const N="https://github.com/antvis/X6/tree/master//home/runner/work/X6/X6/examples/x6-example-sites/packages/api/ui/menubar/basic";function n(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, Menubar } from '@antv/x6-components'
import '@antv/x6-components/es/menu/style/index.css'
import '@antv/x6-components/es/menubar/style/index.css'
import 'antd/dist/antd.css'

const MenuItem = Menu.Item // tslint:disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const MenubarItem = Menubar.Item // tslint:disable-line

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onMenuItemClick = () => {
    this.onMenuClick('undo')
  }

  render() {
    return (
      <div style={{ height: 240, padding: 32 }}>
        <div
          style={{
            background: '#f5f5f5',
            display: 'flex',
            height: 30,
            paddingLeft: 12,
            paddingRight: 12,
            margin: '-24px -24px 0 -24px',
          }}
        >
          <Menubar extra={<div>Extra Component</div>}>
            <MenubarItem text="File">
              <Menu>
                <MenuItem hotkey="Cmd+N">New File</MenuItem>
                <MenuItem hotkey="Cmd+Shift+N">New Window</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+O">Open...</MenuItem>
                <MenuItem>Open Workspace...</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+S">Save</MenuItem>
                <MenuItem hotkey="Cmd+Shift+S">Save As...</MenuItem>
                <MenuItem hotkey="Cmd+Alt+S">Save All</MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Edit">
              <Menu>
                <MenuItem name="undo" hotkey="Cmd+Z">
                  Undo
                </MenuItem>
                <MenuItem name="redo" hotkey="Cmd+Shift+Z">
                  Redo
                </MenuItem>
                <Divider />
                <MenuItem name="cut" hotkey="Cmd+X">
                  Cut
                </MenuItem>
                <MenuItem name="copy" hotkey="Cmd+C">
                  Copy
                </MenuItem>
                <MenuItem name="paste" hotkey="Cmd+V" disabled={true}>
                  Paste
                </MenuItem>
                <Divider />
                <MenuItem name="find" hotkey="Cmd+F">
                  Find
                </MenuItem>
                <MenuItem name="replace" hotkey="Cmd+Alt+F">
                  Replace
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="View">
              <Menu>
                <MenuItem name="zen" hotkey="Cmd+K Z">
                  Zen Mode
                </MenuItem>
                <MenuItem name="fullscreen" hotkey="Cmd+Shift+F">
                  Full Screen
                </MenuItem>
                <Divider />
                <SubMenu text="Appearance">
                  <MenuItem name="side-bar">Show Side Bar</MenuItem>
                  <MenuItem name="status-bar">Show Status Bar</MenuItem>
                  <MenuItem name="activity-bar">Show Activity Bar</MenuItem>
                  <MenuItem name="editor-area">Show Editor Area</MenuItem>
                  <MenuItem name="show-panel">Show Panel</MenuItem>
                </SubMenu>
                <Divider />
                <MenuItem name="zoomin" hotkey="Cmd +">
                  Zoom In
                </MenuItem>
                <MenuItem name="zoomout" hotkey="Cmd -">
                  Zoom Out
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Help">
              <Menu>
                <MenuItem name="welcome">Welcome</MenuItem>
                <MenuItem name="documention">Documention</MenuItem>
                <MenuItem name="about">Aoubt</MenuItem>
              </Menu>
            </MenubarItem>
          </Menubar>
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
`,isBinary:!1}}}}function U(){return{title:"api/ui/menubar/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, Menubar } from '@antv/x6-components'
import '@antv/x6-components/es/menu/style/index.css'
import '@antv/x6-components/es/menubar/style/index.css'
import 'antd/dist/antd.css'

const MenuItem = Menu.Item // tslint:disable-line
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider
const MenubarItem = Menubar.Item // tslint:disable-line

export default class Example extends React.Component {
  onMenuClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onMenuItemClick = () => {
    this.onMenuClick('undo')
  }

  render() {
    return (
      <div style={{ height: 240, padding: 32 }}>
        <div
          style={{
            background: '#f5f5f5',
            display: 'flex',
            height: 30,
            paddingLeft: 12,
            paddingRight: 12,
            margin: '-24px -24px 0 -24px',
          }}
        >
          <Menubar extra={<div>Extra Component</div>}>
            <MenubarItem text="File">
              <Menu>
                <MenuItem hotkey="Cmd+N">New File</MenuItem>
                <MenuItem hotkey="Cmd+Shift+N">New Window</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+O">Open...</MenuItem>
                <MenuItem>Open Workspace...</MenuItem>
                <Divider />
                <MenuItem hotkey="Cmd+S">Save</MenuItem>
                <MenuItem hotkey="Cmd+Shift+S">Save As...</MenuItem>
                <MenuItem hotkey="Cmd+Alt+S">Save All</MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Edit">
              <Menu>
                <MenuItem name="undo" hotkey="Cmd+Z">
                  Undo
                </MenuItem>
                <MenuItem name="redo" hotkey="Cmd+Shift+Z">
                  Redo
                </MenuItem>
                <Divider />
                <MenuItem name="cut" hotkey="Cmd+X">
                  Cut
                </MenuItem>
                <MenuItem name="copy" hotkey="Cmd+C">
                  Copy
                </MenuItem>
                <MenuItem name="paste" hotkey="Cmd+V" disabled={true}>
                  Paste
                </MenuItem>
                <Divider />
                <MenuItem name="find" hotkey="Cmd+F">
                  Find
                </MenuItem>
                <MenuItem name="replace" hotkey="Cmd+Alt+F">
                  Replace
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="View">
              <Menu>
                <MenuItem name="zen" hotkey="Cmd+K Z">
                  Zen Mode
                </MenuItem>
                <MenuItem name="fullscreen" hotkey="Cmd+Shift+F">
                  Full Screen
                </MenuItem>
                <Divider />
                <SubMenu text="Appearance">
                  <MenuItem name="side-bar">Show Side Bar</MenuItem>
                  <MenuItem name="status-bar">Show Status Bar</MenuItem>
                  <MenuItem name="activity-bar">Show Activity Bar</MenuItem>
                  <MenuItem name="editor-area">Show Editor Area</MenuItem>
                  <MenuItem name="show-panel">Show Panel</MenuItem>
                </SubMenu>
                <Divider />
                <MenuItem name="zoomin" hotkey="Cmd +">
                  Zoom In
                </MenuItem>
                <MenuItem name="zoomout" hotkey="Cmd -">
                  Zoom Out
                </MenuItem>
              </Menu>
            </MenubarItem>
            <MenubarItem text="Help">
              <Menu>
                <MenuItem name="welcome">Welcome</MenuItem>
                <MenuItem name="documention">Documention</MenuItem>
                <MenuItem name="about">Aoubt</MenuItem>
              </Menu>
            </MenubarItem>
          </Menubar>
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
`}}}},116:function(b,E,o){},120:function(b,E,o){},132:function(b,E,o){"use strict";o.r(E);var N=o(0),n=o.n(N),U=o(4),L=o.n(U),C=o(8),x=o(9),y=o(11),g=o(10),T=o(137),M=o(19),H=o(3),_=o.n(H),S=n.a.createContext({}),O=function(s){Object(y.a)(a,s);var l=Object(g.a)(a);function a(){var t;return Object(C.a)(this,a),t=l.apply(this,arguments),t.onHotkey=function(){t.triggerHandler()},t.onClick=function(e){t.triggerHandler(e)},t}return Object(x.a)(a,[{key:"componentDidMount",value:function(){var e=this.props.hotkey;e&&this.props.context.registerHotkey(e,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var e=this.props.hotkey;e&&this.props.context.unregisterHotkey(e,this.onHotkey)}},{key:"triggerHandler",value:function(e){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,e),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return n.a.createElement("div",Object.assign({},a.getProps(this.props)),a.getContent(this.props,this.onClick))}}]),a}(n.a.PureComponent);(function(s){function l(t,e){var r,i=t.className,c=t.disabled,m=t.active,d=t.hidden,p=t.context.prefixCls,v="".concat(p,"-item");return{className:_()(v,e,(r={},Object(M.a)(r,"".concat(v,"-active"),m),Object(M.a)(r,"".concat(v,"-hidden"),d),Object(M.a)(r,"".concat(v,"-disabled"),c),r),i)}}s.getProps=l;function a(t,e,r,i){var c=t.icon,m=t.text,d=t.hotkey,p=t.children,v=t.context.prefixCls,f="".concat(v,"-item");return n.a.createElement(n.a.Fragment,null,n.a.createElement("button",{className:"".concat(f,"-button"),onClick:e},c&&n.a.isValidElement(c)&&n.a.createElement("span",{className:"".concat(f,"-icon")},c),n.a.createElement("span",{className:"".concat(f,"-text")},m||p),d&&n.a.createElement("span",{className:"".concat(f,"-hotkey")},d),r),i)}s.getContent=a})(O||(O={}));var F=function(l){return n.a.createElement(S.Consumer,null,function(a){return n.a.createElement(O,Object.assign({context:a},l))})},z=function(){return n.a.createElement(S.Consumer,null,function(l){var a=l.prefixCls;return n.a.createElement("div",{className:"".concat(a,"-item ").concat(a,"-item-divider")})})},B=function(s,l){var a={};for(var t in s)Object.prototype.hasOwnProperty.call(s,t)&&l.indexOf(t)<0&&(a[t]=s[t]);if(s!=null&&typeof Object.getOwnPropertySymbols=="function")for(var e=0,t=Object.getOwnPropertySymbols(s);e<t.length;e++)l.indexOf(t[e])<0&&Object.prototype.propertyIsEnumerable.call(s,t[e])&&(a[t[e]]=s[t[e]]);return a},V=function(l){var a=l.hotkey,t=l.children,e=B(l,["hotkey","children"]);return n.a.createElement(S.Consumer,null,function(r){var i=r.prefixCls,c=O.getProps(Object.assign({context:r},l),"".concat(i,"-submenu"));return n.a.createElement("div",Object.assign({},c),O.getContent(Object.assign({context:r},e),null,n.a.createElement("span",{className:"".concat(i,"-submenu-arrow")}),n.a.createElement("div",{className:"".concat(i,"-submenu-menu")},t)))})},h=function(s){Object(y.a)(a,s);var l=Object(g.a)(a);function a(){var t;return Object(C.a)(this,a),t=l.apply(this,arguments),t.onClick=function(e,r){t.props.stopPropagation&&r!=null&&r.stopPropagation(),t.props.onClick&&t.props.onClick(e)},t.registerHotkey=function(e,r){t.props.registerHotkey&&t.props.registerHotkey(e,r)},t.unregisterHotkey=function(e,r){t.props.unregisterHotkey&&t.props.unregisterHotkey(e,r)},t}return Object(x.a)(a,[{key:"render",value:function(){var e=this.props,r=e.prefixCls,i=e.className,c=e.children,m=e.hasIcon,d="".concat(r,"-menu"),p=S.Provider,v={prefixCls:d,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return n.a.createElement("div",{className:_()(d,Object(M.a)({},"".concat(d,"-has-icon"),m),i)},n.a.createElement(p,{value:v},c))}}]),a}(n.a.PureComponent);(function(s){s.Item=F,s.Divider=z,s.SubMenu=V,s.defaultProps={prefixCls:"x6",stopPropagation:!1}})(h||(h={}));var Z=o(36),A=o.n(Z),j=n.a.createContext({}),W=function(s){Object(y.a)(a,s);var l=Object(g.a)(a);function a(t){var e;return Object(C.a)(this,a),e=l.call(this,t),e.onDocumentClick=function(){e.deactive()},e.onClick=function(r){e.props.context.activeMenubar(),e.removeDeactive(r.currentTarget.parentElement),e.active()},e.onMouseEnter=function(r){if(e.props.context.menubarActived&&!e.state.active&&!e.isPrevMenuHiddening(r)){var i=r.currentTarget,c=i.parentElement.childNodes;c.forEach(function(m){m===i?e.removeDeactive(m):e.callDeactive(m)}),e.active()}},e.onMouseLeave=function(r){var i=r.relatedTarget,c=r.currentTarget;if(e.props.context.menubarActived&&e.state.active&&!e.isPrevMenuHiddening(r)){var m=c.parentElement.childNodes,d=!1;if(i!==window)for(var p=0,v=m.length;p<v;p+=1){var f=m[p];if(f===i||f.contains(i)){d=!0;break}}d?e.deactive():e.cacheDeactive(c)}},e.active=function(){e.setState({active:!0}),e.removeDocClickEvent||(e.removeDocClickEvent=A()(document.documentElement,"click",e.onDocumentClick).remove)},e.deactive=function(){e.setState({active:!1}),e.removeDocClickEvent&&(e.removeDocClickEvent(),e.removeDocClickEvent=null)},e.popupClassName="".concat(t.context.prefixCls,"-item-dropdown"),e.state={active:!1},e}return Object(x.a)(a,[{key:"isPrevMenuHiddening",value:function(e){var r=e.nativeEvent.toElement;if(r&&r.className===this.popupClassName)return!0;for(var i=e.currentTarget,c=i.parentElement.childNodes,m=0,d=c.length;m<d;m+=1){var p=c[m],v=p.querySelector(".".concat(this.popupClassName));if(v.contains(r))return!0}return!1}},{key:"cacheDeactive",value:function(e){e.DEACTIVE=this.deactive}},{key:"callDeactive",value:function(e){e.DEACTIVE&&(e.DEACTIVE(),delete e.DEACTIVE)}},{key:"removeDeactive",value:function(e){delete e.DEACTIVE}},{key:"render",value:function(){var e,r=this.props,i=r.text,c=r.children,m=r.hidden,d=this.props.context,p=d.prefixCls,v=d.menubarActived,f=v&&this.state.active,I="".concat(p,"-item");return n.a.createElement("div",{className:_()(I,(e={},Object(M.a)(e,"".concat(I,"-hidden"),m),Object(M.a)(e,"".concat(I,"-hover"),v),Object(M.a)(e,"".concat(I,"-active"),f),e)),onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},n.a.createElement("div",{className:_()("".concat(I,"-text"),Object(M.a)({},"".concat(I,"-text-active"),f)),onClick:this.onClick},i),n.a.createElement("div",{className:this.popupClassName},c))}}]),a}(n.a.PureComponent),J=function(l){return n.a.createElement(j.Consumer,null,function(a){return n.a.createElement(W,Object.assign({context:a},l))})},w=function(s){Object(y.a)(a,s);var l=Object(g.a)(a);function a(){var t;return Object(C.a)(this,a),t=l.apply(this,arguments),t.state={active:!1},t.onDocumentClick=function(){t.setState({active:!1}),t.unbindDocEvent()},t.activeMenubar=function(){t.setState({active:!0}),t.removeDocClickEvent||(t.removeDocClickEvent=A()(document.documentElement,"click",t.onDocumentClick).remove)},t}return Object(x.a)(a,[{key:"componentWillUnmount",value:function(){this.unbindDocEvent()}},{key:"unbindDocEvent",value:function(){this.removeDocClickEvent&&(this.removeDocClickEvent(),this.removeDocClickEvent=null)}},{key:"render",value:function(){var e=this.props,r=e.prefixCls,i=e.className,c=e.children,m=e.extra,d="".concat(r,"-menubar"),p={prefixCls:d,activeMenubar:this.activeMenubar,menubarActived:this.state.active};return n.a.createElement("div",{className:_()(d,i)},n.a.createElement("div",{className:"".concat(d,"-content")},n.a.createElement("div",{className:"".concat(d,"-content-inner")},n.a.createElement(j.Provider,{value:p},c)),m&&n.a.createElement("div",{className:"".concat(d,"-content-extras")},m)))}}]),a}(n.a.PureComponent);(function(s){s.Item=J,s.defaultProps={prefixCls:"x6"}})(w||(w={}));var se=o(83),le=o(84),ce=o(54),u=h.Item,$=h.SubMenu,k=h.Divider,R=w.Item,Y=function(s){Object(y.a)(a,s);var l=Object(g.a)(a);function a(){var t;Object(C.a)(this,a);for(var e=arguments.length,r=new Array(e),i=0;i<e;i++)r[i]=arguments[i];return t=l.call.apply(l,[this].concat(r)),t.onMenuClick=function(c){T.b.success("".concat(c," clicked"),10)},t.onMenuItemClick=function(){t.onMenuClick("undo")},t}return Object(x.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{style:{height:240,padding:32}},n.a.createElement("div",{style:{background:"#f5f5f5",display:"flex",height:30,paddingLeft:12,paddingRight:12,margin:"-24px -24px 0 -24px"}},n.a.createElement(w,{extra:n.a.createElement("div",null,"Extra Component")},n.a.createElement(R,{text:"File"},n.a.createElement(h,null,n.a.createElement(u,{hotkey:"Cmd+N"},"New File"),n.a.createElement(u,{hotkey:"Cmd+Shift+N"},"New Window"),n.a.createElement(k,null),n.a.createElement(u,{hotkey:"Cmd+O"},"Open..."),n.a.createElement(u,null,"Open Workspace..."),n.a.createElement(k,null),n.a.createElement(u,{hotkey:"Cmd+S"},"Save"),n.a.createElement(u,{hotkey:"Cmd+Shift+S"},"Save As..."),n.a.createElement(u,{hotkey:"Cmd+Alt+S"},"Save All"))),n.a.createElement(R,{text:"Edit"},n.a.createElement(h,null,n.a.createElement(u,{name:"undo",hotkey:"Cmd+Z"},"Undo"),n.a.createElement(u,{name:"redo",hotkey:"Cmd+Shift+Z"},"Redo"),n.a.createElement(k,null),n.a.createElement(u,{name:"cut",hotkey:"Cmd+X"},"Cut"),n.a.createElement(u,{name:"copy",hotkey:"Cmd+C"},"Copy"),n.a.createElement(u,{name:"paste",hotkey:"Cmd+V",disabled:!0},"Paste"),n.a.createElement(k,null),n.a.createElement(u,{name:"find",hotkey:"Cmd+F"},"Find"),n.a.createElement(u,{name:"replace",hotkey:"Cmd+Alt+F"},"Replace"))),n.a.createElement(R,{text:"View"},n.a.createElement(h,null,n.a.createElement(u,{name:"zen",hotkey:"Cmd+K Z"},"Zen Mode"),n.a.createElement(u,{name:"fullscreen",hotkey:"Cmd+Shift+F"},"Full Screen"),n.a.createElement(k,null),n.a.createElement($,{text:"Appearance"},n.a.createElement(u,{name:"side-bar"},"Show Side Bar"),n.a.createElement(u,{name:"status-bar"},"Show Status Bar"),n.a.createElement(u,{name:"activity-bar"},"Show Activity Bar"),n.a.createElement(u,{name:"editor-area"},"Show Editor Area"),n.a.createElement(u,{name:"show-panel"},"Show Panel")),n.a.createElement(k,null),n.a.createElement(u,{name:"zoomin",hotkey:"Cmd +"},"Zoom In"),n.a.createElement(u,{name:"zoomout",hotkey:"Cmd -"},"Zoom Out"))),n.a.createElement(R,{text:"Help"},n.a.createElement(h,null,n.a.createElement(u,{name:"welcome"},"Welcome"),n.a.createElement(u,{name:"documention"},"Documention"),n.a.createElement(u,{name:"about"},"Aoubt"))))))}}]),a}(n.a.Component),G=o(140),K=o(135),Q=o(141),q=o(142),ee=o(143),D=o(138),ne=o(65),te=o(66),me=o(116),P=o(115),ae=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},re=function(s){Object(y.a)(a,s);var l=Object(g.a)(a);function a(){return Object(C.a)(this,a),l.apply(this,arguments)}return Object(x.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(D.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},n.a.createElement(G.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(D.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(K.a,{component:ae}))),n.a.createElement(D.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(P.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(Q.a,null))),n.a.createElement(D.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(te.getParameters)(P.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(q.a,null)))),n.a.createElement(D.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},n.a.createElement(ee.a,{onClick:function(){ne.a.openProject(P.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),a}(n.a.Component),oe=o(139),ue=o(120),X=function(s){Object(y.a)(a,s);var l=Object(g.a)(a);function a(t){var e;return Object(C.a)(this,a),e=l.call(this,t),e.refContainer=function(r){e.container=r},a.restoreIframeSize(),e}return Object(x.a)(a,[{key:"componentDidMount",value:function(){var e=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){e.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return e.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var e=window.frameElement;if(e){var r=this.container.scrollHeight||this.container.clientHeight;e.style.width="100%",e.style.height="".concat(r+16,"px"),e.style.border="0",e.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(re,null),this.props.children)}}]),a}(n.a.Component);(function(s){var l=window.location.pathname,a="x6-iframe-size";function t(){var i=localStorage.getItem(a),c;if(i)try{c=JSON.parse(i)}catch(m){}else c={};return c}function e(){var i=window.frameElement;if(i){var c=i.style,m={width:c.width,height:c.height},d=t();d[l]=m,localStorage.setItem(a,JSON.stringify(d))}}s.saveIframeSize=e;function r(){var i=window.frameElement;if(i){var c=t(),m=c[l];m&&(i.style.width=m.width||"100%",i.style.height=m.height||"auto")}}s.restoreIframeSize=r})(X||(X={}));var de=o(121),ie=function(l){var a=l.children;return n.a.createElement(oe.a.ErrorBoundary,null,n.a.createElement(X,null,a))};L.a.render(n.a.createElement(ie,null,n.a.createElement(Y,null)),document.getElementById("root"))},78:function(b,E,o){b.exports=o(132)},83:function(b,E,o){},84:function(b,E,o){}},[[78,1,2]]]);
