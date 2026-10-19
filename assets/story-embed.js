(()=>{
 if(window.parent===window||!new URLSearchParams(location.search).has('embed'))return;
 document.documentElement.classList.add('story-embedded');
 const send=(type,extra={})=>parent.postMessage({type,...extra},location.origin);
 const nav=document.querySelector('.site-header');
 // Keep the engine's language and motion controls, remove the website navigation.
 nav?.querySelector('.nav-links')?.remove();nav?.querySelector('.brand')?.remove();nav?.querySelector('.menu-button')?.remove();nav?.querySelector('.button')?.remove();
 const label=document.createElement('span');label.className='embedded-label';label.innerHTML='<span>JOURNEY</span><span>推门即用</span>';nav?.prepend(label);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();send('journey:exit')}});
 document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const url=new URL(a.href,location.href);if(url.origin!==location.origin)return;if(url.pathname===location.pathname){if(url.hash){e.preventDefault();document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});history.replaceState(null,'',url.href)}return}e.preventDefault();if(url.pathname===new URL('../',location.href).pathname){send('journey:exit')}else{send('journey:navigate',{url:url.href})}});
 // Guard focus when tabbing across the embedded document boundary.
 document.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const all=[...document.querySelectorAll('a,button,input,[tabindex="0"]')].filter(el=>el.getClientRects().length),first=all[0],last=all.at(-1);if((e.shiftKey&&document.activeElement===first)||(!e.shiftKey&&document.activeElement===last)){e.preventDefault();parent.document.querySelector('.story-close')?.focus()}});
 requestAnimationFrame(()=>requestAnimationFrame(()=>send('journey:ready')));
})();
