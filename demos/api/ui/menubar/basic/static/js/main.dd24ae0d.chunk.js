(this["webpackJsonpapi.ui.menubar.basic"]=this["webpackJsonpapi.ui.menubar.basic"]||[]).push([[0],{115:function(b,E,o){"use strict";o.r(E),o.d(E,"host",function(){return w}),o.d(E,"getCodeSandboxParams",function(){return n}),o.d(E,"getStackblitzPrefillConfig",function(){return R});const w="https://github.com/antvis/X6/tree/master//Users/wenyu/vector/code/AntV/X6/sites/x6-sites-demos/packages/api/ui/menubar/basic";function n(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, Menubar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/menubar/style/index.css'
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
`,isBinary:!1}}}}function R(){return{title:"api/ui/menubar/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

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
import { Menu, Menubar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/menubar/style/index.css'
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
`}}}},116:function(b,E,o){},120:function(b,E,o){},132:function(b,E,o){"use strict";o.r(E);var w=o(0),n=o.n(w),R=o(4),T=o.n(R),y=o(8),C=o(9),g=o(11),x=o(10),X=o(137),M=o(19),V=o(3),k=o.n(V),A=n.a.createContext({}),O=function(i){Object(g.a)(a,i);var c=Object(x.a)(a);function a(){var t;return Object(y.a)(this,a),t=c.apply(this,arguments),t.onHotkey=function(){t.triggerHandler()},t.onClick=function(e){t.triggerHandler(e)},t}return Object(C.a)(a,[{key:"componentDidMount",value:function(){var e=this.props.hotkey;e&&this.props.context.registerHotkey(e,this.onHotkey)}},{key:"componentWillUnmount",value:function(){var e=this.props.hotkey;e&&this.props.context.unregisterHotkey(e,this.onHotkey)}},{key:"triggerHandler",value:function(e){!this.props.disabled&&!this.props.hidden&&(this.props.name&&this.props.context.onClick(this.props.name,e),this.props.onClick&&this.props.onClick())}},{key:"render",value:function(){return n.a.createElement("div",Object.assign({},a.getProps(this.props)),a.getContent(this.props,this.onClick))}}]),a}(n.a.PureComponent);(function(i){function c(t,e){var r,s=t.className,l=t.disabled,u=t.active,d=t.hidden,p=t.context.prefixCls,v="".concat(p,"-item");return{className:k()(v,e,(r={},Object(M.a)(r,"".concat(v,"-active"),u),Object(M.a)(r,"".concat(v,"-hidden"),d),Object(M.a)(r,"".concat(v,"-disabled"),l),r),s)}}i.getProps=c;function a(t,e,r,s){var l=t.icon,u=t.text,d=t.hotkey,p=t.children,v=t.context.prefixCls,f="".concat(v,"-item");return n.a.createElement(n.a.Fragment,null,n.a.createElement("button",{className:"".concat(f,"-button"),onClick:e},l&&n.a.isValidElement(l)&&n.a.createElement("span",{className:"".concat(f,"-icon")},l),n.a.createElement("span",{className:"".concat(f,"-text")},u||p),d&&n.a.createElement("span",{className:"".concat(f,"-hotkey")},d),r),s)}i.getContent=a})(O||(O={}));var H=function(c){return n.a.createElement(A.Consumer,null,function(a){return n.a.createElement(O,Object.assign({context:a},c))})},F=function(){return n.a.createElement(A.Consumer,null,function(c){var a=c.prefixCls;return n.a.createElement("div",{className:"".concat(a,"-item ").concat(a,"-item-divider")})})},z=function(i,c){var a={};for(var t in i)Object.prototype.hasOwnProperty.call(i,t)&&c.indexOf(t)<0&&(a[t]=i[t]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var e=0,t=Object.getOwnPropertySymbols(i);e<t.length;e++)c.indexOf(t[e])<0&&Object.prototype.propertyIsEnumerable.call(i,t[e])&&(a[t[e]]=i[t[e]]);return a},B=function(c){var a=c.hotkey,t=c.children,e=z(c,["hotkey","children"]);return n.a.createElement(A.Consumer,null,function(r){var s=r.prefixCls,l=O.getProps(Object.assign({context:r},c),"".concat(s,"-submenu"));return n.a.createElement("div",Object.assign({},l),O.getContent(Object.assign({context:r},e),null,n.a.createElement("span",{className:"".concat(s,"-submenu-arrow")}),n.a.createElement("div",{className:"".concat(s,"-submenu-menu")},t)))})},h=function(i){Object(g.a)(a,i);var c=Object(x.a)(a);function a(){var t;return Object(y.a)(this,a),t=c.apply(this,arguments),t.onClick=function(e,r){t.props.stopPropagation&&r!=null&&r.stopPropagation(),t.props.onClick&&t.props.onClick(e)},t.registerHotkey=function(e,r){t.props.registerHotkey&&t.props.registerHotkey(e,r)},t.unregisterHotkey=function(e,r){t.props.unregisterHotkey&&t.props.unregisterHotkey(e,r)},t}return Object(C.a)(a,[{key:"render",value:function(){var e=this.props,r=e.prefixCls,s=e.className,l=e.children,u=e.hasIcon,d="".concat(r,"-menu"),p=A.Provider,v={prefixCls:d,onClick:this.onClick,registerHotkey:this.registerHotkey,unregisterHotkey:this.unregisterHotkey};return n.a.createElement("div",{className:k()(d,Object(M.a)({},"".concat(d,"-has-icon"),u),s)},n.a.createElement(p,{value:v},l))}}]),a}(n.a.PureComponent);(function(i){i.Item=H,i.Divider=F,i.SubMenu=B,i.defaultProps={prefixCls:"x6",stopPropagation:!1}})(h||(h={}));var Z=o(36),j=o.n(Z),L=n.a.createContext({}),W=function(i){Object(g.a)(a,i);var c=Object(x.a)(a);function a(t){var e;return Object(y.a)(this,a),e=c.call(this,t),e.onDocumentClick=function(){e.deactive()},e.onClick=function(r){e.props.context.activeMenubar(),e.removeDeactive(r.currentTarget.parentElement),e.active()},e.onMouseEnter=function(r){if(e.props.context.menubarActived&&!e.state.active&&!e.isPrevMenuHiddening(r)){var s=r.currentTarget,l=s.parentElement.childNodes;l.forEach(function(u){u===s?e.removeDeactive(u):e.callDeactive(u)}),e.active()}},e.onMouseLeave=function(r){var s=r.relatedTarget,l=r.currentTarget;if(e.props.context.menubarActived&&e.state.active&&!e.isPrevMenuHiddening(r)){var u=l.parentElement.childNodes,d=!1;if(s!==window)for(var p=0,v=u.length;p<v;p+=1){var f=u[p];if(f===s||f.contains(s)){d=!0;break}}d?e.deactive():e.cacheDeactive(l)}},e.active=function(){e.setState({active:!0}),e.removeDocClickEvent||(e.removeDocClickEvent=j()(document.documentElement,"click",e.onDocumentClick).remove)},e.deactive=function(){e.setState({active:!1}),e.removeDocClickEvent&&(e.removeDocClickEvent(),e.removeDocClickEvent=null)},e.popupClassName="".concat(t.context.prefixCls,"-item-dropdown"),e.state={active:!1},e}return Object(C.a)(a,[{key:"isPrevMenuHiddening",value:function(e){var r=e.nativeEvent.toElement;if(r&&r.className===this.popupClassName)return!0;for(var s=e.currentTarget,l=s.parentElement.childNodes,u=0,d=l.length;u<d;u+=1){var p=l[u],v=p.querySelector(".".concat(this.popupClassName));if(v.contains(r))return!0}return!1}},{key:"cacheDeactive",value:function(e){e.DEACTIVE=this.deactive}},{key:"callDeactive",value:function(e){e.DEACTIVE&&(e.DEACTIVE(),delete e.DEACTIVE)}},{key:"removeDeactive",value:function(e){delete e.DEACTIVE}},{key:"render",value:function(){var e,r=this.props,s=r.text,l=r.children,u=r.hidden,d=this.props.context,p=d.prefixCls,v=d.menubarActived,f=v&&this.state.active,_="".concat(p,"-item");return n.a.createElement("div",{className:k()(_,(e={},Object(M.a)(e,"".concat(_,"-hidden"),u),Object(M.a)(e,"".concat(_,"-hover"),v),Object(M.a)(e,"".concat(_,"-active"),f),e)),onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave},n.a.createElement("div",{className:k()("".concat(_,"-text"),Object(M.a)({},"".concat(_,"-text-active"),f)),onClick:this.onClick},s),n.a.createElement("div",{className:this.popupClassName},l))}}]),a}(n.a.PureComponent),J=function(c){return n.a.createElement(L.Consumer,null,function(a){return n.a.createElement(W,Object.assign({context:a},c))})},D=function(i){Object(g.a)(a,i);var c=Object(x.a)(a);function a(){var t;return Object(y.a)(this,a),t=c.apply(this,arguments),t.state={active:!1},t.onDocumentClick=function(){t.setState({active:!1}),t.unbindDocEvent()},t.activeMenubar=function(){t.setState({active:!0}),t.removeDocClickEvent||(t.removeDocClickEvent=j()(document.documentElement,"click",t.onDocumentClick).remove)},t}return Object(C.a)(a,[{key:"componentWillUnmount",value:function(){this.unbindDocEvent()}},{key:"unbindDocEvent",value:function(){this.removeDocClickEvent&&(this.removeDocClickEvent(),this.removeDocClickEvent=null)}},{key:"render",value:function(){var e=this.props,r=e.prefixCls,s=e.className,l=e.children,u=e.extra,d="".concat(r,"-menubar"),p={prefixCls:d,activeMenubar:this.activeMenubar,menubarActived:this.state.active};return n.a.createElement("div",{className:k()(d,s)},n.a.createElement("div",{className:"".concat(d,"-content")},n.a.createElement("div",{className:"".concat(d,"-content-inner")},n.a.createElement(L.Provider,{value:p},l)),u&&n.a.createElement("div",{className:"".concat(d,"-content-extras")},u)))}}]),a}(n.a.PureComponent);(function(i){i.Item=J,i.defaultProps={prefixCls:"x6"}})(D||(D={}));var ie=o(83),ce=o(84),le=o(54),m=h.Item,$=h.SubMenu,I=h.Divider,S=D.Item,Y=function(i){Object(g.a)(a,i);var c=Object(x.a)(a);function a(){var t;Object(y.a)(this,a);for(var e=arguments.length,r=new Array(e),s=0;s<e;s++)r[s]=arguments[s];return t=c.call.apply(c,[this].concat(r)),t.onMenuClick=function(l){X.b.success("".concat(l," clicked"),10)},t.onMenuItemClick=function(){t.onMenuClick("undo")},t}return Object(C.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{style:{height:240,padding:32}},n.a.createElement("div",{style:{background:"#f5f5f5",display:"flex",height:30,paddingLeft:12,paddingRight:12,margin:"-24px -24px 0 -24px"}},n.a.createElement(D,{extra:n.a.createElement("div",null,"Extra Component")},n.a.createElement(S,{text:"File"},n.a.createElement(h,null,n.a.createElement(m,{hotkey:"Cmd+N"},"New File"),n.a.createElement(m,{hotkey:"Cmd+Shift+N"},"New Window"),n.a.createElement(I,null),n.a.createElement(m,{hotkey:"Cmd+O"},"Open..."),n.a.createElement(m,null,"Open Workspace..."),n.a.createElement(I,null),n.a.createElement(m,{hotkey:"Cmd+S"},"Save"),n.a.createElement(m,{hotkey:"Cmd+Shift+S"},"Save As..."),n.a.createElement(m,{hotkey:"Cmd+Alt+S"},"Save All"))),n.a.createElement(S,{text:"Edit"},n.a.createElement(h,null,n.a.createElement(m,{name:"undo",hotkey:"Cmd+Z"},"Undo"),n.a.createElement(m,{name:"redo",hotkey:"Cmd+Shift+Z"},"Redo"),n.a.createElement(I,null),n.a.createElement(m,{name:"cut",hotkey:"Cmd+X"},"Cut"),n.a.createElement(m,{name:"copy",hotkey:"Cmd+C"},"Copy"),n.a.createElement(m,{name:"paste",hotkey:"Cmd+V",disabled:!0},"Paste"),n.a.createElement(I,null),n.a.createElement(m,{name:"find",hotkey:"Cmd+F"},"Find"),n.a.createElement(m,{name:"replace",hotkey:"Cmd+Alt+F"},"Replace"))),n.a.createElement(S,{text:"View"},n.a.createElement(h,null,n.a.createElement(m,{name:"zen",hotkey:"Cmd+K Z"},"Zen Mode"),n.a.createElement(m,{name:"fullscreen",hotkey:"Cmd+Shift+F"},"Full Screen"),n.a.createElement(I,null),n.a.createElement($,{text:"Appearance"},n.a.createElement(m,{name:"side-bar"},"Show Side Bar"),n.a.createElement(m,{name:"status-bar"},"Show Status Bar"),n.a.createElement(m,{name:"activity-bar"},"Show Activity Bar"),n.a.createElement(m,{name:"editor-area"},"Show Editor Area"),n.a.createElement(m,{name:"show-panel"},"Show Panel")),n.a.createElement(I,null),n.a.createElement(m,{name:"zoomin",hotkey:"Cmd +"},"Zoom In"),n.a.createElement(m,{name:"zoomout",hotkey:"Cmd -"},"Zoom Out"))),n.a.createElement(S,{text:"Help"},n.a.createElement(h,null,n.a.createElement(m,{name:"welcome"},"Welcome"),n.a.createElement(m,{name:"documention"},"Documention"),n.a.createElement(m,{name:"about"},"Aoubt"))))))}}]),a}(n.a.Component),G=o(140),K=o(135),Q=o(141),q=o(142),ee=o(143),U=o(138),ne=o(65),te=o(66),ue=o(116),N=o(115),ae=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},re=function(i){Object(g.a)(a,i);var c=Object(x.a)(a);function a(){return Object(y.a)(this,a),c.apply(this,arguments)}return Object(C.a)(a,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(U.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},n.a.createElement(G.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(U.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(K.a,{component:ae}))),n.a.createElement(U.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(N.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(Q.a,null))),n.a.createElement(U.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(te.getParameters)(N.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(q.a,null)))),n.a.createElement(U.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},n.a.createElement(ee.a,{onClick:function(){ne.a.openProject(N.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),a}(n.a.Component),oe=o(139),me=o(120),P=function(i){Object(g.a)(a,i);var c=Object(x.a)(a);function a(t){var e;return Object(y.a)(this,a),e=c.call(this,t),e.refContainer=function(r){e.container=r},a.restoreIframeSize(),e}return Object(C.a)(a,[{key:"componentDidMount",value:function(){var e=this;if(this.updateIframeSize(),window.ResizeObserver){var r=new window.ResizeObserver(function(){e.updateIframeSize()});r.observe(this.container)}else window.addEventListener("resize",function(){return e.updateIframeSize()});setTimeout(function(){var s=document.getElementById("loading");s&&s.parentNode&&s.parentNode.removeChild(s)},1e3)}},{key:"updateIframeSize",value:function(){var e=window.frameElement;if(e){var r=this.container.scrollHeight||this.container.clientHeight;e.style.width="100%",e.style.height="".concat(r+16,"px"),e.style.border="0",e.style.overflow="hidden",a.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(re,null),this.props.children)}}]),a}(n.a.Component);(function(i){var c=window.location.pathname,a="x6-iframe-size";function t(){var s=localStorage.getItem(a),l;if(s)try{l=JSON.parse(s)}catch(u){}else l={};return l}function e(){var s=window.frameElement;if(s){var l=s.style,u={width:l.width,height:l.height},d=t();d[c]=u,localStorage.setItem(a,JSON.stringify(d))}}i.saveIframeSize=e;function r(){var s=window.frameElement;if(s){var l=t(),u=l[c];u&&(s.style.width=u.width||"100%",s.style.height=u.height||"auto")}}i.restoreIframeSize=r})(P||(P={}));var de=o(121),se=function(c){var a=c.children;return n.a.createElement(oe.a.ErrorBoundary,null,n.a.createElement(P,null,a))};T.a.render(n.a.createElement(se,null,n.a.createElement(Y,null)),document.getElementById("root"))},78:function(b,E,o){b.exports=o(132)},83:function(b,E,o){},84:function(b,E,o){}},[[78,1,2]]]);
