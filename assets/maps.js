/* Every diagram is derived from the shipped journey snapshot, including thumbnails. */
(()=>{
 const data=window.JOB_DATA, steps=data?.milestones.flatMap(m=>m.steps)||[];
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const value=v=>Array.isArray(v)?v.join(' · '):String(v??'');
 const names=['看到职位','判断是否适合','点击申请','创建账户','填写申请','提交申请','收到确认','AI 筛选','快速拒绝','等待消息','查询与跟进','收到回复','被拒绝','没有下文','进入面试'];
 const labels=s=>names[steps.indexOf(s)]||s.title||s.id;
 const num=s=>s.fields.emotionValence===undefined?null:Number(s.fields.emotionValence);
 const line=(x1,y1,x2,y2,c='grid-line')=>`<path class="${c}" d="M${x1} ${y1}L${x2} ${y2}"/>`;
 const txt=(x,y,v,c='plot-label',anchor='start')=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${anchor}">${esc(v)}</text>`;
 const svg=(body,w,h,title)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg"><title>${esc(title)}</title>${body}</svg>`;
 const target=(s,body,compact)=>`<g ${compact?'':`class="plot-target" tabindex="0" role="button" aria-label="查看 ${esc(labels(s))}" data-step="${esc(s.id)}"`}><title>${esc(s.id)}</title>${body}</g>`;
 function emotion(list=steps,compact=false){const w=1080,h=330,x=i=>70+i*940/(list.length-1),y=v=>146-v*45;let body='';[-2,-1,0,1,2].forEach(v=>{body+=line(60,y(v),1030,y(v))+txt(38,y(v)+4,v>0?'+'+v:v,'plot-axis','end')});list.forEach((s,i)=>{const from=num(s);if(from===null)return;const refs=Array.isArray(s.fields.next)?s.fields.next:s.fields.next?[s.fields.next]:[];refs.forEach(ref=>{const j=list.findIndex(t=>t.id===String(ref).split('→').pop().trim());if(j>=0&&num(list[j])!==null)body+=line(x(i),y(from),x(j),y(num(list[j])),'plot-edge')})});list.forEach((s,i)=>{const v=num(s);if(v===null){body+=txt(x(i),148,'—','plot-axis','middle');return}body+=target(s,`<circle cx="${x(i)}" cy="${y(v)}" r="18" fill="transparent"/><circle class="plot-dot" cx="${x(i)}" cy="${y(v)}" r="4"/>`+txt(x(i),y(v)-15,v>0?'+'+v:v,'plot-value','middle'),compact)});list.forEach((s,i)=>{body+=txt(x(i),278,String(i+1).padStart(2,'0'),'plot-axis','middle');if(!compact)body+=txt(x(i),303,list===steps?labels(s):s.title,'plot-small','middle')});return svg(body,w,h,'emotionValence 原始数值；横轴为文件中的步骤顺序，缺失值保留断点')}
 function temporal(compact){let b='';const x=t=>285+Math.log10(Math.max(1,t))/Math.log10(86400)*290;[1,60,3600,86400].forEach((v,i)=>{b+=line(x(v),40,x(v),635)+txt(x(v),22,['1s','1m','1h','1d'][i],'plot-axis','middle')});b+=txt(625,22,'DURATION / WAIT TIME');steps.forEach((s,i)=>{const y=63+i*38,raw=value(s.fields.duration),wait=value(s.fields.waitTime),m=raw.match(/^(?:~|Within )?(\d+)(?:-(\d+))?\s*(sec|min|hour)/i);let mark='';if(m){const unit=/sec/i.test(m[3])?1:/min/i.test(m[3])?60:3600,lo=Number(m[1])*unit,hi=Number(m[2]||m[1])*unit;mark=line(285,y,x(hi),y,'plot-edge')+`<circle class="plot-dot" cx="${x(hi)}" cy="${y}" r="3"/>`;if(hi!==lo)mark+=`<path class="plot-range" d="M${x(lo)} ${y}H${x(hi)}"/>`;if(/^Within/.test(raw))mark+=txt(x(hi)-12,y-9,'≤','plot-value')}else mark=txt(425,y+4,'未定量','plot-axis','middle');const text=wait||raw||'未记录';b+=target(s,`<rect x="15" y="${y-17}" width="1045" height="35" fill="transparent"/>`+txt(26,y+4,String(i+1).padStart(2,'0'),'plot-axis')+txt(67,y+4,labels(s))+mark+txt(625,y+4,text.length>58?text.slice(0,56)+'…':text,'plot-small'),compact)+line(20,y+20,1058,y+20)});return svg(b,1080,660,'时间记录：可量化时长按对数刻度呈现；不确定时长保留原文')}
 function actors(compact){let b='';data.personas.forEach((p,row)=>{const y=75+row*60;b+=txt(22,y+5,p.name)+txt(22,y+21,p.type,'plot-axis')+line(170,y,1045,y);steps.forEach((s,i)=>{const x=200+i*58,has=(s.fields.persona||[]).includes(p.name);b+=target(s,`<circle cx="${x}" cy="${y}" r="${has?6:2}" class="${has?'plot-dot':'plot-empty'}"/>`,compact)})});steps.forEach((s,i)=>b+=txt(200+i*58,408,String(i+1).padStart(2,'0'),'plot-axis','middle'));b+=txt(20,448,'PERSONA × STEP · 实心点表示该步骤记录了这个角色');return svg(b,1080,480,'角色协作矩阵，根据每步 persona 字段绘制')}
 const covFields=['emotionValence','thinking','duration','waitTime','handoff','frontstage','backstage','systems','painPoint','momentOfTruth','failureMode','recoveryPath','next'];
 function coverage(compact){let b='';covFields.forEach((key,row)=>{const y=48+row*28;b+=txt(20,y+5,key,'plot-small');steps.forEach((s,i)=>{const x=215+i*56,has=Object.hasOwn(s.fields,key),prov=s.meta?.provenance?.[key];b+=target(s,`<rect x="${x-6}" y="${y-6}" width="12" height="12" class="${has?'coverage-filled':'coverage-empty'}"/>`+(prov?`<circle class="source-mark" cx="${x+9}" cy="${y-8}" r="3"/>`:''),compact)})});steps.forEach((s,i)=>b+=txt(215+i*56,440,String(i+1).padStart(2,'0'),'plot-axis','middle'));return svg(b,1080,475,'13 个常用字段的记录矩阵；空框表示未记录，小圆点表示带来源标记')}
 function board(compact){let b='';steps.forEach((s,i)=>{const col=i%5,row=Math.floor(i/5),x=16+col*213,y=15+row*177,f=s.fields;const text=value(f.description),words=text.match(/.{1,27}(?:\s|$)|.{1,27}/g)||[];let cell=`<rect class="board-frame" x="${x}" y="${y}" width="201" height="163"/>`+txt(x+13,y+24,String(i+1).padStart(2,'0'),'plot-axis')+txt(x+13,y+50,labels(s),'plot-value');words.slice(0,3).forEach((t,k)=>cell+=txt(x+13,y+74+k*17,t,'plot-small'));cell+=txt(x+13,y+146,(f.persona||[]).join(' / ').slice(0,27),'plot-axis');b+=target(s,cell,compact)});return svg(b,1080,560,'故事板：每一帧使用步骤 description 与 persona 原文')}
 function graph(compact){
  const stageNames=['发现职位','提交申请','筛选与等待','收到结果'];
  if(compact){
   const places=[[25,50],[285,50],[25,170],[285,170]],bw=210,bh=65;let b='';
   const stageFor=id=>data.milestones.findIndex(m=>m.steps.some(s=>s.id===id));const pairs=new Set();
   steps.forEach(s=>{const from=stageFor(s.id),refs=[s.fields.next||[]].flat();refs.forEach(ref=>{const to=stageFor(String(ref).split('→').pop().trim());if(to>=0&&to!==from)pairs.add(from+':'+to)})});
   for(const pair of pairs){const [from,to]=pair.split(':').map(Number),[x,y]=places[from],[xx,yy]=places[to];if(y===yy){b+=`<path class="plot-edge" d="M${x+bw} ${y+bh/2}H${xx-5}"/><path class="plot-edge" d="M${xx-11} ${yy+bh/2-4}L${xx-5} ${yy+bh/2}L${xx-11} ${yy+bh/2+4}"/>`}else{b+=`<path class="plot-edge" d="M${x+bw/2} ${y+bh}V142H${xx+bw/2}V${yy-5}"/><path class="plot-edge" d="M${xx+bw/2-4} ${yy-11}L${xx+bw/2} ${yy-5}L${xx+bw/2+4} ${yy-11}"/>`}}
   data.milestones.forEach((m,i)=>{const [x,y]=places[i];b+=`<rect class="flow-box" x="${x}" y="${y}" width="${bw}" height="${bh}"/>`+txt(x+16,y+26,stageNames[i],'flow-preview-title')+txt(x+16,y+49,m.steps.length+' 个步骤','flow-preview-count')+txt(x+bw-17,y+28,String(i+1).padStart(2,'0'),'plot-axis','end')});
   b+=txt(25,23,'阶段总览 · '+steps.length+' 个步骤','flow-preview-count');return svg(b,520,260,'由实际里程碑汇总的流程概览；打开后查看完整步骤与分支')
  }
  const positions=[[125,130],[125,245],[380,130],[380,245],[380,360],[380,475],[635,130],[635,245],[690,375],[600,490],[600,605],[965,130],[965,375],[965,490],[965,605]],w=1130,h=685,hw=86,hh=27;let b='';
  [0,1,2,3].forEach(i=>{const x=[30,285,540,870][i];b+=txt(x,35,'0'+(i+1)+' / '+stageNames[i],'flow-stage-label');b+=line(x,52,[220,475,815,1055][i],52)});
  const refsFor=s=>Array.isArray(s.fields.next)?s.fields.next:s.fields.next?[s.fields.next]:[];
  const edge=(d,ex,ey,dir)=>{const arrow=dir==='down'?`M${ex-4} ${ey-7}L${ex} ${ey}L${ex+4} ${ey-7}`:dir==='left'?`M${ex+7} ${ey-4}L${ex} ${ey}L${ex+7} ${ey+4}`:`M${ex-7} ${ey-4}L${ex} ${ey}L${ex-7} ${ey+4}`;return `<path class="plot-edge" d="${d}"/><path class="plot-edge" d="${arrow}"/>`};
  const translated={'no match':'不匹配','match':'匹配','rejection':'拒绝','advance':'推进面试','no response ever':'始终无回复'};
  steps.forEach((s,i)=>refsFor(s).forEach(ref=>{
   const id=String(ref).split('→').pop().trim(),j=steps.findIndex(t=>t.id===id),[x,y]=positions[i],condition=String(ref).split('→')[0].trim();
   if(j<0){b+=edge(`M${x} ${y+hh}V655`,x,655,'down')+txt(x,675,'面试旅程 ↗','plot-small','middle');return}
   const [xx,yy]=positions[j];let d,ex,ey,dir='down';
   if(i===11){const rail=1090;ex=xx+hw;ey=yy;dir='left';d=`M${x+hw} ${y}H${rail}V${yy}H${ex}`;b+=txt(xx+5,yy-38,translated[condition]||condition,'flow-condition','middle')}
   else if(i===7){ex=xx;ey=yy-hh;d=`M${x} ${y+hh}V305H${xx}V${ey}`;b+=txt(xx+(j===8?16:-16),337,translated[condition]||condition,'flow-condition',j===8?'start':'end')}
   else if(Math.abs(x-xx)<60){ex=xx;ey=yy-hh;d=`M${x} ${y+hh}V${ey}`}
   else {const rail=i===10?830:(x+xx)/2;ex=xx-hw;ey=yy;dir='right';d=`M${x+hw} ${y}H${rail}V${yy}H${ex}`}
   b+=edge(d,ex,ey,dir);
  }));
  steps.forEach((s,i)=>{const [x,y]=positions[i],decision=refsFor(s).length>1;let body=`<rect class="flow-box${decision?' flow-decision':''}" x="${x-hw}" y="${y-hh}" width="${hw*2}" height="${hh*2}" rx="2"/>`+txt(x-hw+12,y+4,String(i+1).padStart(2,'0'),'plot-axis')+txt(x+9,y+5,labels(s),'flow-node-label','middle');if(decision)body+=`<path class="decision-mark" d="M${x+hw-13} ${y-12}l4 4-4 4-4-4z"/>`;b+=target(s,body,false)});
  return svg(b,w,h,'按四个里程碑排列的流程图；所有连线来自 next 字段')
 }
 function cards(compact){
  if(compact){let b='';steps.slice(0,6).forEach((s,i)=>{const x=15+(i%3)*350,y=15+Math.floor(i/3)*145;b+=`<rect class="board-frame" x="${x}" y="${y}" width="330" height="125"/>`+txt(x+20,y+30,String(i+1).padStart(2,'0'),'plot-axis')+txt(x+20,y+62,labels(s),'flow-preview-title')+txt(x+20,y+95,value(s.fields.persona),'plot-small')});return svg(b,1080,310,'卡片网格，前六个步骤预览')}
  return '<div class="step-card-groups">'+data.milestones.map((m,i)=>`<section><h3>${['发现职位','提交申请','筛选与等待','收到结果'][i]}</h3><div class="step-card-grid">`+m.steps.map(s=>`<button class="step-card" data-step="${esc(s.id)}"><span class="plot-index">${String(steps.indexOf(s)+1).padStart(2,'0')} / ${esc(value(s.fields.persona))}</span><strong>${esc(labels(s))}</strong><span class="step-card-body">${esc(value(s.fields.description))}</span><span class="step-card-emotion">${num(s)===null?'情绪未记录':'情绪 '+(num(s)>0?'+':'')+num(s)} · 查看原始字段 ↗</span></button>`).join('')+'</div></section>').join('')+'</div>';
 }
 function scaledTime(compact){
  const parse=raw=>{const m=raw.match(/^(~|Within )?(\d+)(?:-(\d+))?\s*(sec|min|hour)/i);if(!m)return null;const unit=/sec/i.test(m[4])?1:/min/i.test(m[4])?60:3600;return{lo:Number(m[2])*unit,hi:Number(m[3]||m[2])*unit,upper:m[1]==='Within ',approx:m[1]==='~'}};
  const records=steps.map(s=>({s,raw:value(s.fields.duration),n:parse(value(s.fields.duration))}));const max=Math.max(...records.map(r=>r.n?.hi||0));const x=v=>230+v/max*630;let b='';
  [0,6,12,18,24].forEach(h=>b+=line(x(h*3600),40,x(h*3600),660)+txt(x(h*3600),24,h+'h','plot-axis','middle'));
  records.forEach(({s,raw,n},i)=>{const y=64+i*40;let mark=txt(240,y+4,'未定量 · '+(value(s.fields.waitTime)||raw||'未记录').slice(0,50),'plot-small');if(n){mark=`<rect class="scaled-bar${n.upper?' scaled-upper':''}" x="230" y="${y-5}" width="${630*n.hi/max}" height="10"/>`;if(n.hi>n.lo)mark+=`<rect class="scaled-range" x="${x(n.lo)}" y="${y-7}" width="${630*(n.hi-n.lo)/max}" height="14"/>`;mark+=txt(890,y+4,raw,'plot-small')}
   b+=target(s,`<rect x="10" y="${y-17}" width="1190" height="37" fill="transparent"/>`+txt(18,y+4,String(i+1).padStart(2,'0'),'plot-axis')+txt(55,y+4,labels(s))+mark,compact)+line(10,y+20,1200,y+20);
  });return svg(b,1220,690,'线性时长比例图：0–24 小时，各行独立，未知等待不虚构为数值');
 }
 function swimlane(compact){
  const n=compact?5:steps.length,cw=218,left=165,w=left+n*cw+20,rows=[['用户行为',['doing','description']],['前台行动',['frontstageAction','frontstage']],['后台行动',['backstageAction','backstage']],['支持系统',['systems']]];let b='';
  steps.slice(0,n).forEach((s,i)=>b+=txt(left+i*cw+14,32,String(i+1).padStart(2,'0')+' / '+labels(s),'flow-stage-label'));
  rows.forEach(([label,keys],row)=>{const y=58+row*160;b+=txt(16,y+30,label,'flow-stage-label');steps.slice(0,n).forEach((s,i)=>{const x=left+i*cw,raw=keys.map(k=>value(s.fields[k])).find(Boolean)||'未记录',chunks=raw.match(/.{1,26}(?:\s|$)|.{1,26}/g)||[];let cell=`<rect class="board-frame" x="${x}" y="${y}" width="${cw}" height="160"/>`;chunks.slice(0,6).forEach((t,j)=>cell+=txt(x+12,y+25+j*21,t,'plot-label'));if(chunks.length>6)cell+=txt(x+12,y+150,'… 点击读完整字段','plot-small');b+=target(s,cell,compact)})});
  const diagram=svg(b,w,720,'服务蓝图：用户行为、前台行动、后台行动、支持系统；未记录处保留为空');
  return compact?diagram:`<div class="zoom-shell"><div class="zoom-tools"><span>拖动画布 · Ctrl / ⌘ + 滚轮缩放</span><div><button type="button" data-zoom="out" aria-label="缩小画布">−</button><button type="button" data-zoom="fit">全图</button><button type="button" data-zoom="in" aria-label="放大画布">＋</button></div></div><div class="zoom-viewport" tabindex="0" role="group" aria-label="可缩放泳道图：方向键平移，加减键缩放，0 查看全图">${diagram}</div></div>`;
 }
 function wireZoom(){
  const viewport=$('.zoom-viewport');if(!viewport)return;const art=viewport.querySelector('svg'),original=art.viewBox.baseVal,totalW=original.width,totalH=original.height;
  let scale=1,cx=totalW/2,cy=totalH/2,start=null,moved=false;
  function apply(){const width=totalW/scale,height=totalH/scale;cx=Math.max(width/2,Math.min(totalW-width/2,cx));cy=Math.max(height/2,Math.min(totalH-height/2,cy));art.setAttribute('viewBox',[cx-width/2,cy-height/2,width,height].join(' '));viewport.dataset.zoom=scale.toFixed(2)}
  function zoom(f){scale=Math.max(1,Math.min(16,scale*f));apply()}
  work.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.zoom==='fit'){scale=1;cx=totalW/2;cy=totalH/2;apply()}else zoom(b.dataset.zoom==='in'?1.5:1/1.5)}));
  viewport.addEventListener('wheel',e=>{if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();zoom(e.deltaY<0?1.12:1/1.12)},{passive:false});
  viewport.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,y:e.clientY,cx,cy};moved=false});
  viewport.addEventListener('pointermove',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.hypot(dx,dy)>5){moved=true;viewport.setPointerCapture(e.pointerId)}const unit=Math.max(totalW/scale/viewport.clientWidth,totalH/scale/viewport.clientHeight);cx=start.cx-dx*unit;cy=start.cy-dy*unit;apply()});
  const end=()=>{start=null};viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);viewport.addEventListener('lostpointercapture',end);
  viewport.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
  viewport.addEventListener('keydown',e=>{if(e.target!==viewport)return;const d=totalW/scale*.08;if(e.key==='+'||e.key==='=')zoom(1.5);else if(e.key==='-')zoom(1/1.5);else if(e.key==='0'){scale=1;cx=totalW/2;cy=totalH/2;apply()}else if(e.key.startsWith('Arrow')){if(e.key==='ArrowLeft')cx-=d;if(e.key==='ArrowRight')cx+=d;if(e.key==='ArrowUp')cy-=d;if(e.key==='ArrowDown')cy+=d;apply()}else return;e.preventDefault()});apply();
 }

 let currentOutcome='outcome-advance';
 const VIEW_BASIS={coverage:'coverage-xray',storyboard:'storyboard',flow:'flow-graph',cards:'card-grid',swimlane:'swimlane + zoom-pan',scale:'time-to-scale'};
 const views={cards:{title:'卡片网格 · 每一步都能展开检查',kicker:'07 / STEP CARDS',explain:'按里程碑组织全部 15 个步骤。卡片保留原始描述，点击后读取完整字段。',legend:'内容直接来自旅程数据；不同结局作为独立步骤保留。',render:cards},swimlane:{title:'服务蓝图 · 一张可以探索的画布',kicker:'08 / ZOOM & PAN',explain:'从用户行为向下看前台、后台与系统。缩放和拖动，在全貌与局部之间切换。',legend:'各层直接读取对应字段，未记录处不会自动推断。方向键平移，＋ / − 缩放，0 查看全图。',render:swimlane},scale:{title:'时长比例图 · 等待有多长？',kicker:'09 / TIME TO SCALE',explain:'使用 0–24 小时的线性刻度，保留原文中的范围、近似值与上限。未知等待单独标记。',legend:'每行独立，不可相加为总旅程。虚线框表示上限；短任务可能细至不足一个像素，这正是实际比例。',render:scaledTime},journey:{title:'用户旅程图',kicker:'01 / CUSTOMER JOURNEY MAP',explain:'横向看阶段，纵向看人的经历。切换结局，查看不同路径。',legend:'情绪数值来自 emotionValence；没有记录的值保留断点。点击步骤可检查原始字段。',render:c=>JourneyMap.render(c,currentOutcome)},time:{title:'时间花在了哪里？',kicker:'02 / TIME',explain:'明确的数值按对数刻度绘制。范围用粗线，未定量的等待保留原文。',legend:'刻度为秒 / 分钟 / 小时 / 天；每行是单步时长，不是累计时间。≤ 表示上限。',render:temporal},blueprint:{title:'一个步骤，牵动哪些角色？',kicker:'03 / PEOPLE',explain:'角色直接来自 persona 字段。点击一列，在原文里继续查看交接与前后台工作。',legend:'实心点 = 该步骤中记录了此角色 · 点的大小不代表工作量。',render:actors},coverage:{title:'记录了什么，还缺少什么？',kicker:'04 / FIELDS & PROVENANCE',explain:'检查 13 个常用字段。实心方块表示有记录，空框表示没有记录。',legend:'小圆点 = 有来源标记。本例只有两个 backstage 字段标记 auto-composite；其余未标记，不能据此认定为事实。',render:coverage},storyboard:{title:'跟着 Maya，重新走一遍。',kicker:'05 / STORYBOARD',explain:'每一帧展示 description 和 persona 原文；选择后可阅读完整行为与想法。',legend:'编号与源文件顺序一致。结局包含多个分支。',render:board},flow:{title:'流程图 · 从发现职位到结果',kicker:'06 / PATHS',explain:'连接只来自 next 字段。AI 筛选与最终回复分别形成分支；进入面试指向另一张地图。',legend:'箭头来自 next 引用 · 分支标签为中文译文，选中节点可查看原始条件。',render:graph}};
 document.querySelectorAll('[data-preview]').forEach(el=>{const v=views[el.dataset.preview];if(v)el.innerHTML=v.render(true)});
 document.querySelectorAll('[data-room-preview]').forEach(el=>{if(!window.ROOM_DATA)return;el.innerHTML='<div class="room-preview-label">BEFORE / emotionValence</div>'+emotion(ROOM_DATA.before,true)+'<div class="room-preview-label">AFTER / emotionValence</div>'+emotion(ROOM_DATA.after,true)});
 const work=document.querySelector('[data-map-workbench]');if(!work||!data)return;
 const $=s=>work.querySelector(s);let view='journey',selected=null;
 const disclosure=$('[data-step-disclosure]');
 const rawJSON=JSON.stringify(data,null,2);
 const coloredJSON=esc(rawJSON).replace(/(&quot;(?:[^&]|&(?!quot;))*?&quot;)(\s*:)?|\b(true|false|null)\b|(-?\b\d+(?:\.\d+)?\b)/g,(match,string,key,literal,number)=>string?`<span class="json-${key?'key':'string'}">${string}</span>${key||''}`:`<span class="json-literal">${literal||number}</span>`);
 $('[data-raw-json]').innerHTML=coloredJSON;
 $('[data-source-copy]').addEventListener('click',async e=>{const b=e.currentTarget;try{await navigator.clipboard.writeText(rawJSON);b.textContent='已复制'}catch{const range=document.createRange();range.selectNodeContents($('[data-raw-json]'));getSelection().removeAllRanges();getSelection().addRange(range);b.textContent='已选中，请复制'}setTimeout(()=>b.textContent='复制 JSON',2000)});
 function inspect(){
  work.querySelectorAll('[data-step]').forEach(el=>{const on=el.dataset.step===selected;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',String(on))});
  const s=steps.find(s=>s.id===selected);
  $('[data-selection-label]').textContent=s?labels(s):'选择图中任一步骤';
  if(!s){$('[data-map-detail]').innerHTML='<p class="inspector-empty">选择左侧步骤，查看它的原始字段。</p>';return}
  const f=s.fields,preferred={journey:['description','thinking','channel','emotion','emotionValence','painPoint','opportunity'],time:['duration','waitTime','pacing'],blueprint:['persona','handoff','frontstage','backstage','supportProcesses','lineOfVisibility'],coverage:covFields,storyboard:['description','persona','thinking','emotion'],flow:['next','branchCondition','failureMode','recoveryPath'],cards:['description','persona','thinking','emotion','next'],swimlane:['doing','description','frontstage','frontstageAction','backstage','backstageAction','systems'],scale:['duration','waitTime','pacing']}[view];
  const mainKeys=preferred.filter(k=>Object.hasOwn(f,k)),otherKeys=Object.keys(f).filter(k=>!preferred.includes(k));
  const fields=keys=>keys.map(k=>`<dt>${esc(k)}${s.meta?.provenance?.[k]?`<span class="provenance-tag">${esc(s.meta.provenance[k])}</span>`:''}</dt><dd>${esc(value(f[k]))}</dd>`).join('');
  $('[data-map-detail]').innerHTML=`<div class="eyebrow">SOURCE / STEP ${String(steps.indexOf(s)+1).padStart(2,'0')}</div><h3>${esc(labels(s))}</h3><code class="source-id">${esc(s.id)}</code><dl>${fields(mainKeys)}</dl>${otherKeys.length?`<details class="more-fields"><summary>其他原始字段 <span>${otherKeys.length}</span></summary><dl>${fields(otherKeys)}</dl></details>`:''}`;
  $('[data-map-detail]').scrollTop=0;
 }
 function wire(){work.querySelectorAll('[data-step]').forEach(el=>{
  function choose(){selected=el.dataset.step;inspect();disclosure.open=true;
   if(el.closest('[data-map-canvas]')){disclosure.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});disclosure.querySelector('summary').focus({preventScroll:true})}
  }
  el.addEventListener('click',choose);
  if(el.tagName.toLowerCase()!=='button')el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}})
 })}
 function render(key,update=true){view=views[key]?key:'journey';const visibleSteps=view==='journey'?JourneyMap.path(currentOutcome):steps;if(selected&&!visibleSteps.some(s=>s.id===selected)){selected=null;disclosure.open=false;}const v=views[view];$('[data-map-kicker]').textContent=v.kicker+' · '+(VIEW_BASIS[view]?'TEMPLATE · '+VIEW_BASIS[view]:'CUSTOM LAYOUT');$('[data-map-title]').textContent=v.title;$('[data-map-explainer]').textContent=v.explain;$('[data-map-legend]').textContent=v.legend;$('[data-map-canvas]').dataset.chart=view;$('[data-map-canvas]').innerHTML=v.render(false);$('[data-map-steps]').innerHTML=visibleSteps.map((s,i)=>`<button data-step="${esc(s.id)}"><span>${String(steps.indexOf(s)+1).padStart(2,'0')}</span>${esc(labels(s))}</button>`).join('');work.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));const tabs=$('[data-demo-tabs]'),active=work.querySelector('[data-view="'+view+'"]');if(active){const box=tabs.getBoundingClientRect(),item=active.getBoundingClientRect();if(item.right>box.right)tabs.scrollLeft+=item.right-box.right+10;else if(item.left<box.left)tabs.scrollLeft-=box.left-item.left+10;}if(update){const u=new URL(location.href);u.searchParams.set('view',view);history.replaceState(history.state,'',u)}wireZoom();wire();inspect();const outcome=$('[data-journey-outcome]');outcome?.addEventListener('change',()=>{currentOutcome=outcome.value;render('journey');$('[data-journey-outcome]').focus({preventScroll:true})})}
 work.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.view)));render(new URLSearchParams(location.search).get('view'));
})();
