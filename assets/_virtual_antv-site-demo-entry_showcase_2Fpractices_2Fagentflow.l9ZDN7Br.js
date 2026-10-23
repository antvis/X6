import{i as e}from"./rolldown-runtime.COiEfhsA.js";import{g as t,n,r}from"./src.DTJrlHdG.js";import{t as i}from"./insert-css.Bh27PzyC.js";import{t as a}from"./react.DcD9sFub.js";import{n as o}from"./es.dS3zHT5J.js";import{t as s}from"./agent-flow.Bni9H-tn.js";var c=e(i()),l=e(a());function u(e,t){return e??t()}function d(e){let t,n=e[0],r=1;for(;r<e.length;){let i=e[r],a=e[r+1];if(r+=2,(i===`optionalAccess`||i===`optionalCall`)&&n==null)return;i===`access`||i===`optionalAccess`?(t=n,n=a(n)):(i===`call`||i===`optionalCall`)&&(n=a((...e)=>n.call(t,...e)),t=void 0)}return n}L();var f=260,p=96,m=3,h=`#C2C8D5`,g=`#5F95FF`,_=new t({container:document.getElementById(`graph-container`),grid:!0,mousewheel:{enabled:!0,minScale:.5,maxScale:3},connecting:{connector:{name:`smooth`},connectionPoint:`anchor`,allowBlank:!1,snap:{radius:20},allowEdge:!1,allowLoop:!1,highlight:!0,createEdge(){return _.createEdge({shape:`agent-edge`})},validateConnection({targetMagnet:e}){return!!e}},highlighting:{magnetAdsorbed:{name:`stroke`,args:{attrs:{fill:g,stroke:g}}}}});_.use(new r),t.registerEdge(`agent-edge`,{inherit:`edge`,attrs:{line:{stroke:g,strokeWidth:2,targetMarker:`block`}}},!0);var v=new n({title:`智能体流程编排`,target:_,stencilGraphWidth:240,stencilGraphHeight:480,stencilGraphOptions:{panning:!0},collapsable:!0,groups:[{title:`业务逻辑`,name:`biz`,graphHeight:380,layoutOptions:{rowHeight:88}},{title:`知识库&数据`,name:`data`,graphHeight:300,layoutOptions:{rowHeight:88}}],layoutOptions:{columns:1,columnWidth:230,rowHeight:88,dx:8}});d([document,`access`,e=>e.getElementById,`call`,e=>e(`stencil`),`optionalAccess`,e=>e.appendChild,`call`,e=>e(v.container)]);var y={r:m,magnet:!0,stroke:h,strokeWidth:1,fill:h,style:{visibility:`hidden`}},b=e=>({position:e,attrs:{circle:{...y}}}),x={groups:{top:b(`top`),right:b(`right`),bottom:b(`bottom`),left:b(`left`)},items:[{id:`top`,group:`top`},{id:`right`,group:`right`},{id:`bottom`,group:`bottom`},{id:`left`,group:`left`}]},S=(e,t)=>_.getConnectedEdges(e).some(n=>n.getSourceCellId()===e.id&&n.getSourcePortId()===t||n.getTargetCellId()===e.id&&n.getTargetPortId()===t),C=(e,t,n)=>{e.setPortProp(t,`attrs/circle/style/visibility`,n?`visible`:`hidden`)},w=(e,t,n)=>{e.setPortProp(t,`attrs/circle/fill`,n),e.setPortProp(t,`attrs/circle/stroke`,n)},T=(e,t,n,r)=>{C(e,t,n),r&&w(e,t,r)},E=(e,t,n)=>{if(!e||!t||!n)return;let r=_.getCellById(e);r&&r.isNode()&&n(r,t)},D=(e,t)=>{let n=e.getPorts();for(let r=0;r<n.length;r+=1){let i=n[r].id;if(t)C(e,i,!0);else{let t=S(e,i);C(e,i,t),w(e,i,t?g:h)}}};_.on(`node:mouseenter`,({node:e})=>{D(e,!0)}),_.on(`node:mouseleave`,({node:e})=>{D(e,!1)}),_.on(`edge:mouseenter`,({edge:e})=>{e.addTools({name:`button-remove`,args:{distance:-40}})}),_.on(`edge:mouseleave`,({edge:e})=>{e.removeTools()}),_.on(`edge:connected`,({currentCell:e,currentPort:t})=>{t&&T(e,t,!0,g)}),_.on(`edge:added`,({edge:e})=>{E(e.getSourceCellId(),e.getSourcePortId(),(e,t)=>T(e,t,!0,g)),E(e.getTargetCellId(),e.getTargetPortId(),(e,t)=>T(e,t,!0,g))}),_.on(`edge:removed`,({edge:e})=>{E(e.getSourceCellId(),e.getSourcePortId(),(e,t)=>{S(e,t)||T(e,t,!1,h)}),E(e.getTargetCellId(),e.getTargetPortId(),(e,t)=>{S(e,t)||T(e,t,!1,h)})}),o({shape:`agent-react-card`,width:f,height:p,effect:[`data`],component:({node:e})=>{let t=e.getData(),n={key:u(d([t,`optionalAccess`,e=>e.key]),()=>`unknown`),iconText:u(d([t,`optionalAccess`,e=>e.iconText]),()=>``),title:u(d([t,`optionalAccess`,e=>e.title]),()=>``),desc:u(d([t,`optionalAccess`,e=>e.desc]),()=>``),theme:u(d([t,`optionalAccess`,e=>e.theme]),()=>`blue`),inputPlaceholder:d([t,`optionalAccess`,e=>e.inputPlaceholder])},r=u(n.theme,()=>`blue`);return l.createElement(`div`,{className:`agent-card ${r}`},[l.createElement(`div`,{className:`header`,key:`header`},[l.createElement(`div`,{className:`icon`,key:`icon`},n.iconText),l.createElement(`div`,{className:`title`,key:`title`},n.title),l.createElement(`div`,{className:`actions`,key:`actions`},[l.createElement(`span`,{className:`op`,key:`delete`,onClick:t=>{t.stopPropagation();let n=d([e.getData()||null,`optionalAccess`,e=>e.key]);n!==`start`&&n!==`end`&&e.remove()},title:`删除节点`},`✖️`)])]),n.inputPlaceholder?l.createElement(`div`,{className:`body`,key:`body`},[l.createElement(`span`,{className:`section`,key:`sec`},`节点内容`),l.createElement(`input`,{type:`text`,placeholder:n.inputPlaceholder})]):l.createElement(`div`,{className:`desc`,key:`desc`},n.desc)])}});var O=e=>_.createNode({shape:`agent-react-card`,width:f,height:p,data:e,ports:x}),k=({node:e})=>{let t=e.getData(),n=e.shape===`agent-end-card`?`end`:`start`;return l.createElement(`div`,{className:`flow-card ${n}`},[l.createElement(`div`,{className:`header`,key:`h`},[l.createElement(`div`,{className:`icon`,key:`i`},n===`end`?`E`:`S`),l.createElement(`div`,{className:`title`,key:`t`},t.title),t.badge?l.createElement(`div`,{className:`badge`,key:`b`},t.badge):null]),n===`start`?l.createElement(`div`,{className:`body`,key:`body`},[l.createElement(`span`,{className:`section`,key:`s`},`Agent 开始节点`)]):l.createElement(`div`,{className:`footer`,key:`f`},[l.createElement(`span`,{className:`section`,key:`s2`},`Agent 结束节点`)])])},A=e=>{o({shape:e,width:f,height:p,effect:[`data`],component:k})};A(`agent-start-card`),A(`agent-end-card`);var j=(e,t)=>_.createNode({shape:e===`start`?`agent-start-card`:`agent-end-card`,width:f,height:p,data:t,ports:x}),M=()=>j(`start`,{title:`开始`,badge:`触发器`}),N=()=>j(`end`,{title:`结束`,badge:`输出器`});t.registerNode(`agent-stencil-card`,{inherit:`rect`,width:220,height:66,markup:[{tagName:`rect`,selector:`body`},{tagName:`rect`,selector:`iconRect`},{tagName:`text`,selector:`iconLabel`},{tagName:`text`,selector:`title`},{tagName:`text`,selector:`desc`}],attrs:{body:{stroke:`#5F95FF`,strokeWidth:1,fill:`#fff`,rx:8,ry:8},iconRect:{width:32,height:32,rx:8,ry:8,refX:12,refY:20,fill:`#F0F5FF`},iconLabel:{refX:28,refY:36,textAnchor:`middle`,textVerticalAnchor:`middle`,fontSize:12,fontWeight:600,fill:`#1D39C4`},title:{refX:60,refY:26,textAnchor:`start`,textVerticalAnchor:`middle`,fontSize:14,fontWeight:600,fill:`#141414`,textWrap:{width:170,height:20,ellipsis:`…`}},desc:{refX:60,refY:46,textAnchor:`start`,textVerticalAnchor:`middle`,fontSize:12,fill:`rgba(0,0,0,0.65)`,textWrap:{width:170,height:32,ellipsis:`…`}}},ports:x},!0);var P=e=>{let t={blue:{rectFill:`#F0F5FF`,textFill:`#1D39C4`},green:{rectFill:`#E6FFFB`,textFill:`#08979C`},orange:{rectFill:`#FFF7E6`,textFill:`#FA8C16`},red:{rectFill:`#FFF1F0`,textFill:`#CF1322`}}[u(e.theme,()=>`blue`)];return _.createNode({shape:`agent-stencil-card`,attrs:{iconRect:{fill:t.rectFill},iconLabel:{text:e.iconText,fill:t.textFill},title:{text:e.title},desc:{text:e.desc}},data:{type:e.key},ports:x})},F=null,I=e=>F?u(F[e],()=>null):null;_.on(`node:added`,({node:e})=>{let t=d([e.getData(),`optionalAccess`,e=>e.type]);if(t&&e.shape!==`agent-react-card`){let n=I(t);if(n){let{x:t,y:r}=e.position(),i=O(n).position(t,r);e.remove(),_.addNode(i)}}}),(async()=>{F=await Promise.resolve(s),v.load([P(I(`llm`)),P(I(`code`)),P(I(`branch`)),P(I(`loop`))],`biz`),v.load([P(I(`kb`)),P(I(`mcp`)),P(I(`db`))],`data`);let e=_.addNode(M().position(60,60)),t=_.addNode(O(I(`llm`)).position(220,220)),n=_.addNode(N().position(360,380));_.addEdge({shape:`agent-edge`,source:{cell:e.id,port:`bottom`},target:{cell:t.id,port:`top`}}),_.addEdge({shape:`agent-edge`,source:{cell:t.id,port:`bottom`},target:{cell:n.id,port:`top`}})})().catch(e=>{console.error(e)});function L(){let e=document.getElementById(`container`);if(!e)return;let t=document.createElement(`div`);t.id=`stencil`;let n=document.createElement(`div`);n.id=`graph-container`,e.appendChild(t),e.appendChild(n),(0,c.default)(`
    #container {
      display: flex;
      border: 1px solid #dfe3e8;
      height: 480px;
    }
    #stencil {
      width: 260px;
      height: 100%;
      position: relative;
      border-right: 1px solid #dfe3e8;
      background: #fff;
    }
    #graph-container {
      width: calc(100% - 260px);
      height: 100%;
      background: #fff;
    }
    .x6-widget-stencil  { background-color: #fff; }
    .x6-widget-stencil-title { background-color: #fff; }
    .x6-widget-stencil-group-title { background-color: #fff !important; }

    /* agent card */
    .agent-card {
      display: flex;
      flex-direction: column;
      border: 1px solid #5F95FF;
      border-radius: 8px;
      box-sizing: border-box;
      padding: 12px;
      width: 260px;
      height: 96px;
      background: #fff;
      gap: 8px;
    }

    .agent-card .header { display: flex; align-items: center; gap: 12px; }
    .agent-card .icon {
      width: 32px; height: 32px; border-radius: 8px;
      background: #F0F5FF; color: #1D39C4; display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; font-family: Inter, PingFang SC, Arial;
    }
    .agent-card.green .icon { background: #E6FFFB; color: #08979C; }
    .agent-card.orange .icon { background: #FFF7E6; color: #FA8C16; }
    .agent-card.red .icon { background: #FFF1F0; color: #CF1322; }

    .agent-card .title { font-size: 16px; color: #141414; font-weight: 600; line-height: 20px; }
    .agent-card .desc { font-size: 13px; color: rgba(0,0,0,0.65); line-height: 18px; }
    .agent-card .body { display: flex; align-items: center; gap: 8px; }
    .agent-card .section { font-size: 12px; color: #8c8c8c; flex: 0 0 auto; white-space: nowrap; min-width: max-content; }
    .agent-card .body input {
      flex: 1; min-width: 0; height: 30px; border: 1px solid #5F95FF; border-radius: 6px; padding: 4px 8px; background: #FAFAFA; color: #141414;
    }
    .agent-card .actions { margin-left: auto; color: #8c8c8c; display: flex; gap: 8px; }
    .agent-card .actions .op { font-size: 14px; cursor: pointer; }

    /* start/end flow cards */
    .flow-card { display: flex; flex-direction: column; border: 1px solid #5F95FF; border-radius: 12px; background: #fff; width: 260px; height: 96px; box-sizing: border-box; padding: 12px; gap: 8px; }
    .flow-card .header { display: flex; align-items: center; gap: 12px; }
    .flow-card .icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
    .flow-card.start .icon { background: #EEF2FF; color: #5F95FF; }
    .flow-card.end .icon { background: #FFF1F0; color: #FF7875; }
    .flow-card .title { font-size: 16px; color: #141414; font-weight: 600; }
    .flow-card .badge { margin-left: auto; font-size: 12px; color: #8c8c8c; background: #F5F5F5; border-radius: 8px; padding: 2px 8px; }
    .flow-card .body { display: flex; align-items: center; gap: 8px; }
    .flow-card .section { font-size: 12px; color: #8c8c8c; }
    .flow-card .chips { display: flex; align-items: center; gap: 6px; flex: 1; flex-wrap: wrap; }
    .flow-card .chip { font-size: 12px; color: #595959; background: #FAFAFA; border: 1px solid #5F95FF; border-radius: 6px; padding: 2px 8px; }
    .flow-card .actions { margin-left: auto; color: #8c8c8c; }
    .flow-card .footer { display: flex; align-items: center; gap: 8px; }
  `)}