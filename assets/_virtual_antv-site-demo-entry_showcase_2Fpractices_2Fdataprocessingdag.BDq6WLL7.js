import{i as e}from"./rolldown-runtime.COiEfhsA.js";import{Ft as t,Lt as n,g as r,hn as i,i as a,k as o}from"./src.DTJrlHdG.js";import{t as s}from"./insert-css.Bh27PzyC.js";import{t as c}from"./react.DcD9sFub.js";import{t as l}from"./jsx-runtime.BIPumRIh.js";import{t as u}from"./classnames.DK96wqRZ.js";import{I as d,st as f}from"./es.QL2eVVfB.js";import{n as p}from"./es.dS3zHT5J.js";import{t as m}from"./data-processing-dag.CnGDc_Oo.js";var h=e(l()),g=e(c()),_=e(u()),v=e(s());function y(e){let t,n=e[0],r=1;for(;r<e.length;){let i=e[r],a=e[r+1];if(r+=2,(i===`optionalAccess`||i===`optionalCall`)&&n==null)return;i===`access`||i===`optionalAccess`?(t=n,n=a(n)):(i===`call`||i===`optionalCall`)&&(n=a((...e)=>n.call(t,...e)),t=void 0)}return n}var b;(function(e){e.INPUT=`INPUT`,e.FILTER=`FILTER`,e.JOIN=`JOIN`,e.UNION=`UNION`,e.AGG=`AGG`,e.OUTPUT=`OUTPUT`})(b||={});var x;(function(e){e.DEFAULT=`default`,e.SUCCESS=`success`,e.ERROR=`error`})(x||={});var S=[{type:b.FILTER,name:`数据筛选`},{type:b.JOIN,name:`数据连接`},{type:b.UNION,name:`数据合并`},{type:b.AGG,name:`数据聚合`},{type:b.OUTPUT,name:`数据输出`}],C={INPUT:`https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*RXnuTpQ22xkAAAAAAAAAAAAADtOHAQ/original`,FILTER:`https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*ZJ6qToit8P4AAAAAAAAAAAAADtOHAQ/original`,JOIN:`https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*EHqyQoDeBvIAAAAAAAAAAAAADtOHAQ/original`,UNION:`https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*k4eyRaXv8gsAAAAAAAAAAAAADtOHAQ/original`,AGG:`https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*TKG8R6nfYiAAAAAAAAAAAAAADtOHAQ/original`,OUTPUT:`https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*zUgORbGg1HIAAAAAAAAAAAAADtOHAQ/original`},w=(e,t,n=250,r=100)=>{let i=[];t.getEdges().forEach(t=>{let n=y([t,`access`,e=>e.toJSON,`call`,e=>e(),`optionalAccess`,e=>e.data]);n.source===e.id&&i.push(n.target)});let a=e.getPosition(),o=1/0,s=-1/0;return t.getNodes().forEach(e=>{if(i.indexOf(e.id)>-1){let t=e.getPosition();t.x<o&&(o=t.x),t.y>s&&(s=t.y)}}),{x:o===1/0?a.x+n:o,y:s===-1/0?a.y:s+r}},T=(e,t)=>{let n=[];switch(e){case b.INPUT:n=[{id:`${t}-out`,group:`out`}];break;case b.OUTPUT:n=[{id:`${t}-in`,group:`in`}];break;default:n=[{id:`${t}-in`,group:`in`},{id:`${t}-out`,group:`out`}]}return n},E=(e,n,r)=>{let i=n.getNodes().filter(t=>y([t,`access`,e=>e.getData,`call`,e=>e(),`optionalAccess`,e=>e.type])===e),a=y([S,`optionalAccess`,e=>e.find,`call`,t=>t(t=>t.type===e),`optionalAccess`,e=>e.name]),o=t(),s={id:o,shape:`data-processing-dag-node`,x:y([r,`optionalAccess`,e=>e.x]),y:y([r,`optionalAccess`,e=>e.y]),ports:T(e,o),data:{name:`${a}_${i.length+1}`,type:e}};return n.addNode(s)},D=(e,n,r)=>{let i={id:t(),shape:`data-processing-curve`,source:{cell:e,port:`${e}-out`},target:{cell:n,port:`${n}-in`},zIndex:-1,data:{source:e,target:n}};r&&r.addEdge(i)},O=class e extends g.Component{constructor(...t){super(...t),e.prototype.__init.call(this),e.prototype.__init2.call(this),e.prototype.__init3.call(this),e.prototype.__init4.call(this),e.prototype.__init5.call(this),e.prototype.__init6.call(this),e.prototype.__init7.call(this)}__init(){this.state={plusActionSelected:!1}}__init2(){this.createDownstream=e=>{let{node:t}=this.props,{graph:n}=t.model||{};if(n){let r=E(e,n,w(t,n)),i=t.id,a=r.id;D(i,a,n)}}}__init3(){this.clickPlusDragMenu=e=>{this.createDownstream(e),this.setState({plusActionSelected:!1})}}__init4(){this.getPlusDagMenu=()=>(0,h.jsx)(`ul`,{children:S.map(e=>{let t=(0,h.jsxs)(`a`,{onClick:()=>this.clickPlusDragMenu(e.type),children:[(0,h.jsx)(`i`,{className:`node-mini-logo`,style:{backgroundImage:`url(${C[e.type]})`}}),(0,h.jsx)(`span`,{children:e.name})]});return(0,h.jsx)(`li`,{className:`each-sub-menu`,children:t},e.type)})})}__init5(){this.onPlusDropdownOpenChange=e=>{this.setState({plusActionSelected:e})}}__init6(){this.onMainMouseEnter=()=>{let{node:e}=this.props;(e.getPorts()||[]).forEach(t=>{e.setPortProp(t.id,`attrs/circle`,{fill:`#fff`,stroke:`#85A5FF`})})}}__init7(){this.onMainMouseLeave=()=>{let{node:e}=this.props;(e.getPorts()||[]).forEach(t=>{e.setPortProp(t.id,`attrs/circle`,{fill:`transparent`,stroke:`transparent`})})}}render(){let{plusActionSelected:e}=this.state,{node:t}=this.props,{name:n,type:r,status:i,statusMsg:a}=y([t,`optionalAccess`,e=>e.getData,`call`,e=>e()]);return(0,h.jsxs)(`div`,{className:`data-processing-dag-node`,children:[(0,h.jsxs)(`div`,{className:`main-area`,onMouseEnter:this.onMainMouseEnter,onMouseLeave:this.onMainMouseLeave,children:[(0,h.jsxs)(`div`,{className:`main-info`,children:[(0,h.jsx)(`i`,{className:`node-logo`,style:{backgroundImage:`url(${C[r]})`}}),(0,h.jsx)(f,{title:n,mouseEnterDelay:.8,children:(0,h.jsx)(`div`,{className:`ellipsis-row node-name`,children:n})})]}),(0,h.jsxs)(`div`,{className:`status-action`,children:[i===x.ERROR&&(0,h.jsx)(f,{title:a,children:(0,h.jsx)(`i`,{className:`status-icon status-icon-error`})}),i===x.SUCCESS&&(0,h.jsx)(`i`,{className:`status-icon status-icon-success`}),(0,h.jsx)(`div`,{className:`more-action-container`,children:(0,h.jsx)(`i`,{className:`more-action`})})]})]}),r!==b.OUTPUT&&(0,h.jsx)(`div`,{className:`plus-dag`,children:(0,h.jsx)(d,{dropdownRender:this.getPlusDagMenu,overlayClassName:`processing-node-menu`,trigger:[`click`],placement:`bottom`,open:e,onOpenChange:this.onPlusDropdownOpenChange,children:(0,h.jsx)(`i`,{className:(0,_.default)(`plus-action`,{"plus-action-selected":e})})})})]})}};p({shape:`data-processing-dag-node`,width:212,height:48,component:O,ports:{groups:{in:{position:`left`,attrs:{circle:{r:4,magnet:!0,stroke:`transparent`,strokeWidth:1,fill:`transparent`}}},out:{position:{name:`right`,args:{dx:-32}},attrs:{circle:{r:4,magnet:!0,stroke:`transparent`,strokeWidth:1,fill:`transparent`}}}}}}),r.registerConnector(`curveConnector`,(e,t)=>{let r=Math.abs(t.x-e.x),i=new n;return i.appendSegment(n.createSegment(`M`,e.x-4,e.y)),i.appendSegment(n.createSegment(`L`,e.x+12,e.y)),i.appendSegment(n.createSegment(`C`,e.x<t.x?e.x+r/2:e.x-r/2,e.y,e.x<t.x?t.x-r/2:t.x+r/2,t.y,t.x-6,t.y)),i.appendSegment(n.createSegment(`L`,t.x+2,t.y)),i.serialize()},!0),o.config({markup:[{tagName:`path`,selector:`wrap`,attrs:{fill:`none`,cursor:`pointer`,stroke:`transparent`,strokeLinecap:`round`}},{tagName:`path`,selector:`line`,attrs:{fill:`none`,pointerEvents:`none`}}],connector:{name:`curveConnector`},attrs:{wrap:{connection:!0,strokeWidth:10,strokeLinejoin:`round`},line:{connection:!0,stroke:`#A2B1C3`,strokeWidth:1,targetMarker:{name:`classic`,size:6}}}}),r.registerEdge(`data-processing-curve`,o,!0);var k=new r({container:document.getElementById(`container`),panning:{enabled:!0,eventTypes:[`leftMouseDown`,`mouseWheel`]},mousewheel:{enabled:!0,modifiers:`ctrl`,factor:1.1,maxScale:1.5,minScale:.5},highlighting:{magnetAdsorbed:{name:`stroke`,args:{attrs:{fill:`#fff`,stroke:`#31d0c6`,strokeWidth:4}}}},connecting:{snap:!0,allowBlank:!1,allowLoop:!1,highlight:!0,sourceAnchor:{name:`left`,args:{dx:i?4:8}},targetAnchor:{name:`right`,args:{dx:i?4:-8}},createEdge(){return k.createEdge({shape:`data-processing-curve`,attrs:{line:{strokeDasharray:`5 5`}},zIndex:-1})},validateConnection({sourceMagnet:e,targetMagnet:t}){return!(!e||e.getAttribute(`port-group`)===`in`||!t||t.getAttribute(`port-group`)!==`in`)}}});k.use(new a({multiple:!0,rubberEdge:!0,rubberNode:!0,modifiers:`shift`,rubberband:!0}));var A=[{id:`node-0`,status:`success`},{id:`node-1`,status:`success`},{id:`node-2`,status:`success`},{id:`node-3`,status:`success`},{id:`node-4`,status:`error`,statusMsg:`错误信息示例`}],j=[{id:`edge-0`,status:`success`},{id:`edge-1`,status:`success`},{id:`edge-2`,status:`success`},{id:`edge-3`,status:`success`}],M=()=>{A.forEach(e=>{let{id:t,status:n,statusMsg:r}=e,i=k.getCellById(t),a=i.getData()||{};i.setData({...a,status:n,statusMsg:r})})},N=()=>{k.getEdges().forEach(e=>{e.attr({line:{stroke:`#3471F9`}}),e.attr(`line/strokeDasharray`,5),e.attr(`line/style/animation`,`running-line 30s infinite linear`)})},P=()=>{k.getEdges().forEach(e=>{e.attr(`line/strokeDasharray`,0),e.attr(`line/style/animation`,``)}),j.forEach(e=>{let{id:t,status:n}=e,r=k.getCellById(t);n===`success`&&r.attr(`line/stroke`,`#52c41a`),n===`error`&&r.attr(`line/stroke`,`#ff4d4f`)}),k.select(`node-2`)};Promise.resolve(m).then(e=>{k.fromJSON(e),k.zoomToFit({padding:{left:10,right:10}}),setTimeout(()=>{N()},2e3),setTimeout(()=>{M(),P()},3e3)}),(0,v.default)(`
  .data-processing-dag-node {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .main-area {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 12px;
    width: 180px;
    height: 48px;
    color: rgba(0, 0, 0, 65%);
    font-size: 12px;
    font-family: PingFangSC;
    line-height: 24px;
    background-color: #fff;
    box-shadow: 0 -1px 4px 0 rgba(209, 209, 209, 50%), 1px 1px 4px 0 rgba(217, 217, 217, 50%);
    border-radius: 2px;
    border: 1px solid transparent;
  }
  .main-area:hover {
    border: 1px solid rgba(0, 0, 0, 10%);
    box-shadow: 0 -2px 4px 0 rgba(209, 209, 209, 50%), 2px 2px 4px 0 rgba(217, 217, 217, 50%);
  }

  .node-logo {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }

  .node-name {
    overflow: hidden;
    display: inline-block;
    width: 70px;
    margin-left: 6px;
    color: rgba(0, 0, 0, 65%);
    font-size: 12px;
    font-family: PingFangSC;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .status-action {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .status-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
  }

  .status-icon-error {
    background: url('https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ')
      no-repeat center center / 100% 100%;
  }

  .status-icon-success {
    background: url('https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ')
      no-repeat center center / 100% 100%;
  }

  .more-action-container {
    margin-left: 12px;
    width: 15px;
    height: 15px;
    text-align: center;
    cursor: pointer;
  }

  .more-action {
    display: inline-block;
    width: 3px;
    height: 15px;
    background: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*tFw7SIy-ttQAAAAAAAAAAAAADtOHAQ/original')
      no-repeat center center / 100% 100%;
  }

  .plus-dag {
    visibility: hidden;
    position: relative;
    margin-left: 12px;
    height: 48px;
  }

  .plus-action {
    position: absolute;
    top: calc(50% - 8px);
    left: 0;
    width: 16px;
    height: 16px;
    background: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*ScX2R4ODfokAAAAAAAAAAAAADtOHAQ/original')
      no-repeat center center / 100% 100%;
    cursor: pointer;
  }
  .plus-action:hover {
    background-image: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*tRaoS5XhsuQAAAAAAAAAAAAADtOHAQ/original');
  }

  .plus-action:active,
  .plus-action-selected {
    background-image: url('https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*k9cnSaSmlw4AAAAAAAAAAAAADtOHAQ/original');
  }

  .x6-node-selected .main-area {
    border-color: #3471f9;
  }

  .x6-node-selected .plus-dag {
    visibility: visible;
  }

  .processing-node-menu {
    padding: 2px 0;
    width: 105px;
    background-color: #fff;
    box-shadow: 0 9px 28px 8px rgba(0, 0, 0, 5%), 0 6px 16px 0 rgba(0, 0, 0, 8%),
      0 3px 6px -4px rgba(0, 0, 0, 12%);
    border-radius: 2px;
  }
  .processing-node-menu ul {
    margin: 0;
    padding: 0;
  }
  .processing-node-menu li {
    list-style:none;
  }

  .each-sub-menu {
    padding: 6px 12px;
    width: 100%;
  }

  .each-sub-menu:hover {
    background-color: rgba(0, 0, 0, 4%);
  }

  .each-sub-menu a {
    display: inline-block;
    width: 100%;
    height: 16px;
    font-family: PingFangSC;
    font-weight: 400;
    font-size: 12px;
    color: rgba(0, 0, 0, 65%);
  }

  .each-sub-menu span {
    margin-left: 8px;
    vertical-align: top;
  }

  .each-disabled-sub-menu a {
    cursor: not-allowed;
      color: rgba(0, 0, 0, 35%);
  }

  .node-mini-logo {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    vertical-align: top;
  }

  @keyframes running-line {
    to {
      stroke-dashoffset: -1000;
    }
  }
`);export{E as createNode};