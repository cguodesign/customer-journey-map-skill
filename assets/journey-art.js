/* Shared illustration, sampled from the four-step meeting-room example.
   A recognisable journey matrix replaces the unrelated ring / doorway motifs. */
(()=>{
 function model(){
  let seed=617;const rnd=()=>((seed=seed*16807%2147483647)-1)/2147483646,points=[],labels=[];
  const dot=(x,y,b=.6,z=0)=>points.push([x,y,z,b]);
  function line(x,y,xx,yy,b=.5){const n=Math.ceil(Math.hypot(xx-x,yy-y)*220);for(let i=0;i<=n;i++){const u=i/n;dot(x+(xx-x)*u+(rnd()-.5)*.006,y+(yy-y)*u+(rnd()-.5)*.006,b*(.6+rnd()*.4))}}
  const left=-1.28,right=1.48,top=.82,bottom=-.66,cw=(right-left)/4;
  [top,.49,.02,-.4,bottom].forEach(y=>line(left,y,right,y,.42));
  for(let j=0;j<=4;j++)line(left+j*cw,top,left+j*cw,bottom,.3);
  const xs=Array.from({length:4},(_,i)=>left+cw*(i+.5)),values=[0,1,1,0],ys=values.map(v=>-.24+v*.13);
  for(let j=0;j<3;j++)line(xs[j],ys[j],xs[j+1],ys[j+1],1);
  xs.forEach((x,j)=>{for(let i=0;i<100;i++){let a=rnd()*6.283,r=Math.sqrt(rnd())*.025;dot(x+Math.cos(a)*r,ys[j]+Math.sin(a)*r,1)} });
  const rows=[['想聊一下','推门即用','一起讨论','散会'],['需要一面白板','空房，直接进入','白板讨论 20 分钟','提前结束'],['门禁 / 日历','走廊观察','讨论记录','门口传感器']];
  const english=[['Need to talk','Walk in','Discuss','Leave'],['Need a whiteboard','Enter an empty room','20 min at the board','Finish early'],['Badge / calendar','Hallway observation','Meeting notes','Door sensor']];
  // The third step has no source annotation in the example; keep that gap visible.
  rows[2][2]='依据待补充';english[2][2]='Source not recorded';
  [.66,.26,-.54].forEach((y,k)=>xs.forEach((x,j)=>labels.push({x,y,t:rows[k][j],en:english[k][j],small:k>0})));
  labels.push({x:-1.54,y:.66,t:'阶段',en:'STAGE'},{x:-1.54,y:.26,t:'行为',en:'ACTION'},{x:-1.54,y:-.19,t:'感受',en:'EMOTION'},{x:-1.54,y:-.54,t:'依据',en:'SOURCE'});
  xs.forEach((x,j)=>labels.push({x,y:ys[j]+.08,t:values[j]>0?'+'+values[j]:'0',en:values[j]>0?'+'+values[j]:'0',small:true}));
  // Two people remain below their map; the visual begins with human experience.
  for(const x of [-.5,-.18]){
   for(let i=0;i<160;i++){const a=rnd()*6.283;dot(x+Math.cos(a)*.042,-.85+Math.sin(a)*.05,.8)}
   for(let i=0;i<450;i++){const u=rnd(),side=rnd()>.5?1:-1;dot(x+side*(u<.5?.05:.025)+(rnd()-.5)*.025,-.92-u*.32,.6+rnd()*.4)}
   line(x-.05,-.95,x-.1,-1.1,.6);line(x+.05,-.95,x+.1,-1.1,.6);
  }
  labels.push({x:.55,y:-1.05,t:'从人的经历，到共同的理解',en:'FROM EXPERIENCE TO SHARED UNDERSTANDING',small:true});
  return{points,labels};
 }
 function draw(ctx,w,h,t,{finale=false,still=false,en=false}={}){
  const m=data,mobile=w<760,cx=w*(mobile?.53:.76),cy=h*(mobile?(finale?.72:.77):.49),scale=mobile?w*.27:Math.min(w*.135,h*.31),assemble=still?1:Math.min(1,t/2.2),ease=1-Math.pow(1-assemble,4);
  const project=(x,y)=>[cx+(x+y*.08)*scale,cy-y*scale];
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#e7e8e2';
  for(let i=0;i<m.points.length;i++){
   const [x,y,z,b]=m.points[i],a=i*2.399,spread=(1-ease)*(1+(i%23)/23),p=project(x+Math.cos(a)*spread,y+Math.sin(a)*spread);
   const highlight=still?0:Math.pow(Math.max(0,Math.cos(x*2.4-t*.8)),12)*.25;
   ctx.globalAlpha=Math.min(1,b+highlight);const s=i%19===0?1.6:1;ctx.fillRect(p[0],p[1],s,s);
  }
  // Incoming notes retain a trace of their origin as they join the matrix.
  for(let i=0;i<110;i++){const phase=still?i/110:(i/110+t*.055)%1,x=-2.3+phase*1.05,y=Math.sin(i*7.1)*.7;const p=project(x,y);ctx.globalAlpha=Math.sin(phase*Math.PI)*.3;ctx.fillRect(p[0],p[1],1,1)}
  ctx.textAlign='center';ctx.textBaseline='middle';
  const labelOpacity=Math.max(0,(ease-.75)*4);
  for(const l of m.labels){const p=project(l.x,l.y);ctx.globalAlpha=labelOpacity*(l.small?.72:.95);ctx.font=(mobile?(l.small?8:10):(l.small?11:13))+'px "Noto Sans SC",sans-serif';ctx.fillText(en?l.en:l.t,p[0],p[1])}
  ctx.globalAlpha=1;
 }
 const data=model();window.JourneyArt={model,draw};
})();
