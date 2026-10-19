document.addEventListener('DOMContentLoaded',()=>{
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const header=$('.site-header'),menu=$('.menu-button');
 function closeMenu(){header?.classList.remove('menu-open');menu?.setAttribute('aria-expanded','false')}
 menu?.addEventListener('click',()=>{const on=header.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(on))});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const was=header?.classList.contains('menu-open');closeMenu();if(was)menu.focus()}});$$('.nav-links a').forEach(a=>a.addEventListener('click',closeMenu));
 const reading=$('[data-reading]');if(reading){let light=false;try{light=localStorage.getItem('journey-reading')==='light'}catch{}function apply(){document.body.classList.toggle('reading-light',light);reading.textContent=light?'深色阅读':'纸白阅读';reading.setAttribute('aria-pressed',String(light))}apply();reading.addEventListener('click',()=>{light=!light;apply();try{localStorage.setItem('journey-reading',light?'light':'dark')}catch{}})}
 $$('[data-install]').forEach(box=>{const command=$('[data-command]',box),copy=$('[data-copy]',box);$$('[data-target]',box).forEach(btn=>btn.addEventListener('click',()=>{const dir=btn.dataset.target==='codex'?'~/.agents/skills/journey':'~/.claude/skills/journey';command.textContent='git clone --depth 1 https://github.com/cguodesign/customer-journey-map-skill '+dir;$$('[data-target]',box).forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));copy.textContent='复制'}));copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(command.textContent);copy.textContent='已复制'}catch{const range=document.createRange();range.selectNodeContents(command);const selection=getSelection();selection.removeAllRanges();selection.addRange(range);copy.textContent='已选中，请复制'}setTimeout(()=>copy.textContent='复制',2000)})});
 const room=$('[data-room]');if(room&&window.ROOM_DATA){let version='before',selected='find-room';function render(){const steps=ROOM_DATA[version],step=steps.find(s=>s.id===selected)||steps[0];selected=step.id;const list=$('[data-room-steps]');list.replaceChildren();steps.forEach((s,i)=>{const b=document.createElement('button');b.className='room-step';b.type='button';b.setAttribute('aria-pressed',String(s===step));b.textContent=String(i+1).padStart(2,'0')+' / '+s.title;const val=document.createElement('span');val.textContent=s.fields.emotionValence+' / 情绪';b.append(val);b.addEventListener('click',()=>{selected=s.id;render()});list.append(b)});const detail=$('[data-room-detail]');detail.replaceChildren();const h=document.createElement('h2');h.textContent=step.title;detail.append(h);const dl=document.createElement('dl');[['description','行为'],['emotion','感受'],['waitTime','等待'],['momentOfTruth','关键时刻'],['next','下一步']].forEach(([key,label])=>{if(!step.fields[key])return;const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=step.fields[key];dl.append(dt,dd)});if(Object.keys(step.provenance).length){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent='来源标记 · 示例设定';dd.textContent=Object.values(step.provenance).join('；');dl.append(dt,dd)}detail.append(dl);const points=steps.map((s,i)=>(20+i*400/(steps.length-1))+','+(70-Number(s.fields.emotionValence||0)*30));$('[data-room-curve]').setAttribute('d','M'+points.join('L'));$$('[data-room-version]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.roomVersion===version)))}$$('[data-room-version]').forEach(b=>b.addEventListener('click',()=>{version=b.dataset.roomVersion;render()}));render()}
 const docLinks=$$('.docs-sidebar a');function docLocation(){docLinks.forEach(a=>{if(a.hash){if(a.hash===location.hash)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')}else if(a.pathname===location.pathname){if(!location.hash)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}})}addEventListener('hashchange',docLocation);docLocation();
 const docs=$('.docs-layout');
 function alignDocFragment(){
  if(!docs||!location.hash)return;
  let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}
  const section=document.getElementById(id);if(!section||!docs.contains(section))return;
  const target=section.querySelector('h2')||section;
  const top=scrollY+target.getBoundingClientRect().top-(header?.getBoundingClientRect().height||0)-24;
  window.scrollTo({top:Math.max(0,top),behavior:'instant'});
 }
 if(docs){
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname!==location.pathname||u.search!==location.search||!u.hash)return;let target;try{target=document.getElementById(decodeURIComponent(u.hash.slice(1)))}catch{return}if(!target||!docs.contains(target))return;e.preventDefault();if(location.hash!==u.hash)history.pushState(null,'',u);docLocation();alignDocFragment()});
  addEventListener('hashchange',alignDocFragment);
  // Run after the browser's initial fragment positioning and dynamic field list.
  if(document.readyState==='complete')alignDocFragment();else addEventListener('load',()=>requestAnimationFrame(alignDocFragment),{once:true});
 }
 const schema=$('#schema-results');if(schema){
  let category='all';const rows=$$('.field[data-search]',schema),groups=$$('[data-field-group]',schema),controls=$('#schema-categories');
  const options=[['all','全部'],...groups.map(g=>[g.dataset.fieldGroup,g.dataset.groupZh,g.dataset.groupEn])];
  function render(){const q=$('#schema-search').value.trim().toLowerCase();let count=0;rows.forEach(row=>{const show=(category==='all'||row.dataset.category===category)&&row.dataset.search.toLowerCase().includes(q);row.hidden=!show;if(show)count++});groups.forEach(group=>group.hidden=!$$('.field',group).some(row=>!row.hidden));$('.schema-empty',schema).hidden=count!==0;$('#schema-count').textContent=count+' / '+rows.length+' 字段'}
  options.forEach(([key,label,en])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.en=en||'All';b.setAttribute('aria-pressed',String(key===category));b.addEventListener('click',()=>{category=key;$$('button',controls).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()});controls.append(b)});
  $('#schema-search').addEventListener('input',render);render();
 }
});
