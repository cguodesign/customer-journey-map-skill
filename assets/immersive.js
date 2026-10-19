/* A full-screen story stage. The underlying page and its scroll position stay intact. */
(()=>{
 if(window.parent!==window)return;
 const triggers=[...document.querySelectorAll('[data-story]')];if(!triggers.length)return;
 const rootURL=new URL(document.querySelector('.brand').href),storyURL=new URL('story/?lang=zh&embed=1',rootURL);
 storyURL.searchParams.set('v',document.querySelector('meta[name="journey-build"]')?.content||'1');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let stage=null,frame=null,opener=null,previousURL=null,previousTitle='',savedY=0,savedStyles=null,opened=false,exitTimer=0,loadTimer=0;
 function announce(on){document.dispatchEvent(new CustomEvent('journey:immersive',{detail:{active:on}}))}
 function exit(fromHistory=false){if(!opened)return;opened=false;clearTimeout(loadTimer);document.body.classList.remove('story-active','story-ready');stage.classList.add('story-exiting');announce(false);
  if(!fromHistory&&history.state?.journeyStory){history.back()}else if(!fromHistory&&location.hash==='#story'){history.replaceState(null,'',previousURL||rootURL)}
  document.title=previousTitle;stage.inert=true;
  exitTimer=setTimeout(()=>{stage.remove();stage=null;frame=null;document.body.classList.remove('story-loading');[...document.body.children].forEach(el=>{if(el.dataset.storyInert!==undefined){el.inert=el.dataset.storyInert==='true';delete el.dataset.storyInert}});Object.assign(document.body.style,savedStyles);window.scrollTo({top:savedY,behavior:'instant'});opener?.focus({preventScroll:true})},reduced.matches?0:400);
 }
 function open(el,fromHistory=false){if(opened||stage)return;opened=true;opener=el||triggers[0];previousURL=location.href;if(fromHistory){const back=new URL(location.href);back.hash='';previousURL=back.href}previousTitle=document.title;savedY=scrollY;savedStyles={position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,overflow:document.body.style.overflow};
  if(!fromHistory){const u=new URL(location.href);u.hash='story';history.pushState({journeyStory:true,returnURL:previousURL},'',u)}
  document.title=window.JourneyDocs?.language==='en'?'Walk In · Journey story':'推门即用 · Journey 故事';
  stage=document.createElement('section');stage.className='story-stage';stage.setAttribute('role','dialog');stage.setAttribute('aria-modal','true');stage.setAttribute('aria-label','推门即用，六幕沉浸式故事');
  stage.innerHTML='<div class="story-loading-copy" role="status"><span>JOURNEY / SIX ACTS</span><p>一条规则。一个被遗漏的人。</p><small>正在进入故事…</small><a class="story-fallback" hidden>独立打开故事 ↗</a></div><button class="story-close" aria-label="退出故事，返回原位置">× <span>退出故事</span><kbd>ESC</kbd></button><iframe class="story-frame" title="推门即用 · 六幕粒子故事" tabindex="0"></iframe>';
  [...document.body.children].forEach(node=>{if(['SCRIPT','STYLE'].includes(node.tagName))return;node.dataset.storyInert=String(node.inert);node.inert=true});document.body.append(stage);frame=stage.querySelector('iframe');stage.querySelector('.story-fallback').href=new URL('story/?lang=zh',rootURL).href;
  stage.querySelector('.story-close').addEventListener('click',()=>exit());Object.assign(document.body.style,{position:'fixed',top:-savedY+'px',width:'100%',overflow:'hidden'});announce(true);document.body.classList.add('story-loading');
  requestAnimationFrame(()=>document.body.classList.add('story-active'));storyURL.searchParams.set('lang',window.JourneyDocs?.language==='en'?'en':'zh');frame.src=storyURL.href;stage.querySelector('.story-close').focus();
  loadTimer=setTimeout(()=>{if(opened&&!document.body.classList.contains('story-ready')){stage.querySelector('small').textContent='故事载入较慢，可以退出后重试，或独立打开。';stage.querySelector('.story-fallback').hidden=false}},12000);
 }
 triggers.forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();open(a)}));
 addEventListener('message',e=>{if(!opened||e.origin!==location.origin||e.source!==frame?.contentWindow)return;if(e.data?.type==='journey:ready'){clearTimeout(loadTimer);document.body.classList.add('story-ready');stage.querySelector('.story-loading-copy').hidden=true}if(e.data?.type==='journey:exit')exit();if(e.data?.type==='journey:navigate'){const url=new URL(e.data.url,rootURL);if(url.origin===rootURL.origin&&url.pathname.startsWith(rootURL.pathname))location.assign(url.href)}});
 addEventListener('popstate',()=>{if(location.hash!=='#story'){exit(true)}else if(!opened){if(stage){clearTimeout(exitTimer);stage.remove();stage=null;Object.assign(document.body.style,savedStyles);[...document.body.children].forEach(el=>{if(el.dataset.storyInert!==undefined){el.inert=el.dataset.storyInert==='true';delete el.dataset.storyInert}})}open(null,true)}});
 document.addEventListener('keydown',e=>{if(!opened)return;if(e.key==='Escape'){e.preventDefault();exit()}if(e.key==='Tab'){const focus=stage.querySelectorAll('button,a:not([hidden]),iframe'),first=focus[0],last=focus[focus.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
 if(location.hash==='#story')open(null,true);
})();
