/* Site language: independent of chart themes, shared by every page and the embedded story. */
(()=>{
 const button=document.querySelector('[data-doc-language]');if(!button)return;
 const originalTitle=document.title;
 const dictionary=window.DOCS_EN||{},records=new WeakMap(),attributeRecords=new WeakMap();let language='zh',pending=false;
 try{language=new URLSearchParams(location.search).get('lang')||localStorage.getItem('journey-doc-language')||'zh'}catch{}
 language=language==='en'?'en':'zh';
 // Strings the charts compose at runtime: translate the fixed frame, look the parts up.
 const T=x=>dictionary[x]||x;
 const patterns=[
  [/^查看 (.+) 的原始字段$/,m=>`View raw fields for ${T(m[1])}`],
  [/^查看 (.+)$/,m=>`View ${T(m[1])}`],
  [/^(\d+) 个步骤 · 共 (\d+) 个源步骤$/,m=>`${m[1]} steps · ${m[2]} source steps in total`],
  [/^(\d+) 个步骤$/,m=>`${m[1]} steps`],
  [/^阶段总览 · (\d+) 个步骤$/,m=>`Stage overview · ${m[1]} steps`],
  [/^当前结局：(.+)$/,m=>`Current ending: ${T(m[1])}`],
  [/^情绪 (\S+) · 查看原始字段 ↗$/,m=>`Emotion ${m[1]} · View raw fields ↗`],
  [/^未定量 · (.+)$/,m=>`Not quantified · ${m[1]}`],
  [/^了解 ([A-Z]+) ↗$/,m=>`Learn about ${m[1]} ↗`],
  [/^([+−-]?\d+) \/ 情绪$/,m=>`${m[1]} / emotion`],
  [/^(\d+) \/ (.+)$/,m=>dictionary[m[2]]?`${m[1]} / ${dictionary[m[2]]}`:null],
 ];
 function english(text){
  const trimmed=text.trim();if(dictionary[trimmed])return text.replace(trimmed,dictionary[trimmed]);
  for(const [re,fn] of patterns){const m=trimmed.match(re);const out=m&&fn(m);if(out)return text.replace(trimmed,out)}
  if(/^下载 .+ ↓$/.test(trimmed))return text.replace('下载 ','Download ');
  return text.split('\n').map(line=>{const t=line.trim();return dictionary[t]?line.replace(t,dictionary[t]):line}).join('\n');
 }
 function refresh(){
  observer.disconnect();pending=false;
  document.querySelectorAll('[data-en]').forEach(el=>{if(el.dataset.docZh===undefined)el.dataset.docZh=el.textContent;el.textContent=language==='en'?el.dataset.en:el.dataset.docZh});
  const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while(node=walk.nextNode()){
   if(node.parentElement.closest('script,style,[data-en],[data-doc-language]'))continue;
   const previous=records.get(node),source=previous&&node.nodeValue===previous.output?previous.source:node.nodeValue;
   const output=language==='en'?english(source):source;if(node.nodeValue!==output)node.nodeValue=output;records.set(node,{source,output});
  }
  document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el=>{
   let values=attributeRecords.get(el)||{};
   for(const key of ['placeholder','aria-label','title'])if(el.hasAttribute(key)){const previous=values[key],current=el.getAttribute(key),source=previous&&current===previous.output?previous.source:current;const output=language==='en'?(el.getAttribute('data-en-'+key)||english(source)):source;el.setAttribute(key,output);values[key]={source,output}}
   attributeRecords.set(el,values);
  });
  button.textContent=language==='en'?'中文':'EN';button.setAttribute('aria-label',language==='en'?'Switch to Chinese':'Switch to English');
  document.documentElement.lang=language==='en'?'en':'zh-CN';if(document.title===originalTitle||document.title===english(originalTitle))document.title=language==='en'?english(originalTitle):originalTitle;
  document.querySelectorAll('a[href]').forEach(a=>{const u=new URL(a.href,location.href);if(u.origin===location.origin&&u.pathname.includes('/docs/')){u.searchParams.set('lang',language);a.href=u.href}});
  observer.observe(document.body,{childList:true,characterData:true,subtree:true});
 }
 const observer=new MutationObserver(()=>{if(!pending){pending=true;queueMicrotask(refresh)}});
 function apply(persist){document.documentElement.lang=language==='en'?'en':'zh-CN';if(persist){try{localStorage.setItem('journey-doc-language',language)}catch{}}const u=new URL(location.href);u.searchParams.set('lang',language);history.replaceState(history.state,'',u);refresh();document.dispatchEvent(new CustomEvent('journey:language',{detail:{language}}))}
 button.addEventListener('click',()=>{language=language==='en'?'zh':'en';apply(true)});
 // The embedded story shares this setting; follow it when it changes there.
 window.addEventListener('storage',e=>{if(e.key!=='journey-doc-language'||!e.newValue)return;const next=e.newValue==='en'?'en':'zh';if(next!==language){language=next;apply(false)}});
 window.JourneyDocs={translate:english,get language(){return language}};apply(false);
})();
