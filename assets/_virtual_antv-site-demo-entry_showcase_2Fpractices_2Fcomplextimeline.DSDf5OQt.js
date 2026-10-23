import{i as e}from"./rolldown-runtime.COiEfhsA.js";import{g as t}from"./src.DTJrlHdG.js";import{t as n}from"./insert-css.Bh27PzyC.js";import{t as r}from"./react.DcD9sFub.js";import{n as i}from"./es.dS3zHT5J.js";import{t as a}from"./complex-timeline.CtcHF1e1.js";var o=e(n()),s=e(r());function c(e){let t,n=e[0],r=1;for(;r<e.length;){let i=e[r],a=e[r+1];if(r+=2,(i===`optionalAccess`||i===`optionalCall`)&&n==null)return;i===`access`||i===`optionalAccess`?(t=n,n=a(n)):(i===`call`||i===`optionalCall`)&&(n=a((...e)=>n.call(t,...e)),t=void 0)}return n}v();var l={card:{width:80,height:104,gap:16},layout:{columnSpacing:40,cardsBottomOffset:68,milestoneSpacing:500},timeline:{y:750,startX:200,endX:2200,height:16},gradient:`timeline-gradient`},u=s.memo(({node:e})=>{let{headline:t,date:n,color:r,lineHeight:i}=e.getData();return s.createElement(`div`,{className:`milestone-column`},[s.createElement(`div`,{className:`milestone-top`,key:`top`},[s.createElement(`div`,{className:`milestone-big-dot`,key:`dot`,style:{backgroundColor:r}}),s.createElement(`div`,{className:`milestone-headline`,key:`headline`,style:{color:r}},t)]),s.createElement(`div`,{className:`milestone-spine`,key:`spine`,style:{backgroundColor:r,height:`${i}px`}}),s.createElement(`div`,{className:`milestone-date`,key:`date`},n)])}),d=s.memo(({node:e})=>{let{subtitle:t}=e.getData();return s.createElement(`div`,{className:`subtitle-text`},t)}),f=s.memo(({node:e})=>{let{title:t,bgColor:n}=e.getData();return s.createElement(`div`,{className:`event-card-vertical`,style:{backgroundColor:n}},s.createElement(`div`,{className:`event-card-title`},t))});i({shape:`milestone-column-node`,width:250,height:800,effect:[`data`],component:u}),i({shape:`subtitle-node`,width:150,height:20,effect:[`data`],component:d}),i({shape:`event-card-node`,width:l.card.width,height:l.card.height,effect:[`data`],component:f});var p=new t({container:document.getElementById(`graph-container`),background:{color:`#FFFFFF`},grid:{size:24,visible:!0,args:{color:`#E0E0E0`,thickness:2}},panning:{enabled:!0,eventTypes:[`leftMouseDown`,`mouseWheel`]},mousewheel:{enabled:!0,modifiers:`ctrl`,factor:1.1,maxScale:3,minScale:.1},interacting:{nodeMovable:e=>e.cell.shape===`event-card-node`,edgeMovable:!1}});p.defineGradient({type:`linearGradient`,id:l.gradient,attrs:{x1:`0%`,y1:`0%`,x2:`100%`,y2:`0%`},stops:[{offset:`0%`,color:`#8A2BE2`},{offset:`33%`,color:`#4169E1`},{offset:`66%`,color:`#FFD700`},{offset:`100%`,color:`#2E8B57`}]});function m(e,t,n){let r=0,i=0;for(;i<e;)r++,i+=r;let a=[],o=n-l.layout.cardsBottomOffset,s=0;for(let t=r;t>=1;t--){let n=Math.min(t,e-s);if(n<=0)break;let r=o-l.card.height;a.push({y:r,count:n}),s+=n,o=r-l.card.gap}a.reverse();let c=[];return a.forEach((e,n)=>{for(let r=0;r<e.count;r++)c.push({x:t+r*(l.card.width+l.card.gap),y:e.y,row:n+1})}),{positions:c,topY:a.length>0?a[0].y:n-l.layout.cardsBottomOffset}}function h(e){let t=[],{timeline:n,layout:r}=l;return t.push(p.createNode({shape:`rect`,x:n.startX,y:n.y-n.height/2,width:n.endX-n.startX,height:n.height,attrs:{body:{fill:`url(#${l.gradient})`,stroke:`none`,rx:8,ry:8}},zIndex:5})),[n.startX,n.endX].forEach(e=>{t.push(p.createNode({shape:`circle`,x:e-10,y:n.y-10,width:20,height:20,attrs:{body:{fill:`#333333`,stroke:`none`}},zIndex:10}))}),e.forEach((e,i)=>{let a=n.startX+100+i*r.milestoneSpacing,o=a,s=a+r.columnSpacing,{positions:c,topY:l}=m(e.events.length,s,n.y),u=l-35,d=u-45,f=n.y-(d+34),h=n.y-d+40;t.push(p.createNode({id:`${e.id}-column`,shape:`milestone-column-node`,x:o-125,y:d,width:250,height:h,data:{headline:e.headline,date:e.date,color:e.color,lineHeight:f},zIndex:3})),t.push(p.createNode({id:`${e.id}-timeline-dot`,shape:`circle`,x:o-9,y:n.y-9,width:18,height:18,attrs:{body:{fill:e.color,stroke:`#FFFFFF`,strokeWidth:2}},zIndex:15})),t.push(p.createNode({shape:`subtitle-node`,x:s,y:u,data:{subtitle:e.subtitle},zIndex:7})),e.events.forEach((n,r)=>{let i=c[r];t.push(p.createNode({id:n.id,shape:`event-card-node`,x:i.x,y:i.y,data:{title:n.title,bgColor:e.lightColor},zIndex:8}))})}),t}p.on(`node:mouseenter`,({node:e})=>{e.shape===`event-card-node`&&e.setZIndex(100)}),p.on(`node:mouseleave`,({node:e})=>{e.shape===`event-card-node`&&e.setZIndex(8)});var g=!0;p.on(`render:done`,()=>{g&&(g=!1,p.zoomToFit({padding:20,maxScale:1}),_())});function _(){c([document,`access`,e=>e.getElementById,`call`,e=>e(`graph-container`),`optionalAccess`,e=>e.classList,`access`,e=>e.add,`call`,e=>e(`graph-visible`)])}Promise.resolve(a).then(e=>{let t=h(e);p.resetCells(t)}).catch(()=>{console.error(`数据加载失败`)});function v(){let e=document.getElementById(`container`);if(!e)return;let t=document.createElement(`div`);t.id=`graph-container`,e.appendChild(t),(0,o.default)(`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    #container { width: 100vw; height: 100vh; overflow: hidden; background: #FFFFFF; }
    #graph-container {
      width: 100%; height: 100%; background: #FFFFFF;
      opacity: 0; transition: opacity 0.3s ease-in-out;
      position: absolute; top: 0; left: 0;
    }
    #graph-container.graph-visible { opacity: 1; }

    .milestone-column {
      display: flex; flex-direction: column; align-items: center;
      font-family: Inter, Helvetica, Arial, sans-serif;
      width: 100%; height: 100%;
    }
    .milestone-top { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
    .milestone-big-dot { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; }
    .milestone-headline { font-size: 18px; font-weight: 700; line-height: 1.2; white-space: nowrap; }
    .milestone-spine { width: 2px; flex-shrink: 0; }
    .milestone-date { font-size: 12px; color: #888888; text-align: center; margin-top: 30px; }

    .subtitle-text { font-size: 13px; font-weight: 400; color: #888888; font-family: Inter, Helvetica, Arial, sans-serif; }

    .event-card-vertical {
      width: 100%; height: 100%; border-radius: 4px;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.06);
      display: flex; align-items: center; justify-content: center;
      padding: 14px 8px; font-family: Inter, Helvetica, Arial, sans-serif;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: move;
    }
    .event-card-vertical:hover { box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12); }
    .event-card-title {
      font-size: 11px; color: #333333; text-align: center;
      line-height: 1.4; word-break: break-word; pointer-events: none;
    }
  `)}