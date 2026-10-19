/* The final scene brings human experience into a shared journey map. */
(()=>{
 const section=document.getElementById('features'),panel=section?.querySelector('.finale-panel');if(!panel)return;
 const canvas=panel.querySelector('canvas'),ctx=canvas.getContext('2d'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=document.body.classList.contains('motion-paused'),active=false,raf=0,last=0,elapsed=0,w=0,h=0;
 const calm=()=>motion.matches||paused;
 const button=document.createElement('button');button.className='finale-motion';button.type='button';
 panel.querySelector('.finale-bottom').insertBefore(button,panel.querySelector('[data-replay]'));
 function label(){const en=document.documentElement.lang==='en';button.textContent=calm()?(en?'▶ Motion':'▶ 动态'):(en?'Ⅱ Pause':'Ⅱ 暂停');button.setAttribute('aria-label',calm()?(en?'Resume particle animation':'播放粒子动画'):(en?'Pause particle animation':'暂停粒子动画'));button.setAttribute('aria-pressed',String(!calm()));button.disabled=motion.matches}
 function draw(){JourneyArt.draw(ctx,w,h,elapsed/1000,{finale:true,still:calm(),en:document.documentElement.lang.startsWith('en')})}
 function size(){w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);draw()}
 function tick(now){raf=0;if(!active||document.hidden)return;if(last)elapsed+=Math.min(50,now-last);last=now;draw();if(!calm())raf=requestAnimationFrame(tick)}
 function run(){last=0;if(active&&!raf&&!document.hidden)raf=requestAnimationFrame(tick)}
 function update(){
  // Replace the whole scene as soon as the gallery's sticky viewport ends.
  const next=section.getBoundingClientRect().top<=innerHeight;
  if(next===active)return;active=next;document.body.classList.toggle('finale-active',active);
  panel.inert=!active;panel.setAttribute('aria-hidden',String(!active));
  document.querySelectorAll('main>.act,.site-header').forEach(el=>el.inert=active);
  if(active){paused=document.body.classList.contains('motion-paused');panel.classList.toggle('finale-still',calm());elapsed=0;size();label();run()}
  else if(raf){cancelAnimationFrame(raf);raf=0}
 }
 button.addEventListener('click',()=>{paused=!paused;panel.classList.toggle('finale-still',calm());label();if(calm()){if(raf)cancelAnimationFrame(raf);raf=0;draw()}else{elapsed=Math.max(elapsed,2100);run()}});
 addEventListener('scroll',update,{passive:true});addEventListener('resize',()=>{size();update()});
 addEventListener('pageshow',update);addEventListener('load',update);
 if(document.fonts?.ready)document.fonts.ready.then(update);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0}else run()});
 motion.addEventListener('change',()=>{label();panel.classList.toggle('finale-still',calm());if(calm()){if(raf)cancelAnimationFrame(raf);raf=0;draw()}else run()});
 panel.querySelector('[data-replay]').addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();window.scrollTo({top:0,behavior:'instant'});history.replaceState(null,'',location.pathname+location.search+'#intro');update();document.getElementById('heroTitle')?.focus({preventScroll:true});
 });
 size();label();update();
})();
