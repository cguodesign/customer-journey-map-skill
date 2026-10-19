/* Theme UI uses the exact preset files compiled by build_themes.py.
   Scoped tokens keep website chrome stable while chart themes change. */
(()=>{
 const presets=window.JOURNEY_THEMES;if(!presets)return;
 const assetBase=new URL('.',document.currentScript.src);
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const allSeeds=[...new Set(Object.values(presets).flatMap(p=>Object.keys(p.seeds)))];
 let agent='claude',theme='graphite';
 const queryTheme=new URLSearchParams(location.search).get('theme');
 try{theme=localStorage.getItem('journey-example-theme')||theme}catch{}
 if(queryTheme)theme=queryTheme;if(!presets[theme])theme='graphite';
 const layout=$('[data-template-layout]'),interaction=$('[data-template-interaction]');
 const combos={
  'card-grid':['scroll-driven','focus-context','multi-view'],
  timeline:['scroll-driven','focus-context','zoom-pan'],
  swimlane:['scroll-driven','focus-context','zoom-pan'],
  'emotion-curve':['scroll-driven','multi-view'],
  storyboard:['scroll-driven','focus-context'],
  'flow-graph':['scroll-driven','focus-context','zoom-pan'],
  'time-to-scale':['scroll-driven'],'coverage-xray':['scroll-driven']
 };
 const interactionNames={'scroll-driven':'滚动阅读','focus-context':'总览 + 局部','zoom-pan':'缩放与平移','multi-view':'多视图切换'};
 const descriptions={
  'card-grid':'按里程碑分组，把每个步骤组织成可展开的卡片。',
  timeline:'时间轴保留事件顺序；需要比较真实时长时，选择时长比例图。',
  swimlane:'用泳道区分用户、前台、后台和支持层，呈现交接关系。',
  'emotion-curve':'用 emotionValence 绘制情绪变化，未知值不补成零。',
  storyboard:'一格一步，映射场景、行为、想法、角色与时间，适合逐幕讲述。',
  'flow-graph':'从 next 与分支条件建立连线，保留循环和多个结局。',
  'time-to-scale':'按 duration / waitTime 编码实际时长；无法量化的值保留原文。',
  'coverage-xray':'呈现字段覆盖与来源标记，帮助作者发现空白与待验证的判断。'
 };
 function command(){
  const dir=agent==='codex'?'$HOME/.agents/skills/journey':'$HOME/.claude/skills/journey';
  const lines=[`JOURNEY_SKILL="${dir}"`];
  if(theme==='graphite')lines.push('# 先下载 graphite.css，再把它装进 skill 的主题目录', 'cp "$HOME/Downloads/graphite.css" "$JOURNEY_SKILL/assets/theme/presets/graphite.css"');
  lines.push(`bash "$JOURNEY_SKILL/scripts/journey.sh" theme map.html --init --preset ${theme}`);
  return lines.join('\n');
 }
 function recipe(){
  const en=!!window.JourneyDocs&&JourneyDocs.language==='en';
  $$('[data-theme-command]').forEach(el=>el.textContent=command());
  $$('[data-theme-current]').forEach(el=>el.textContent=presets[theme].label.split(' · ')[0]);
  $$('[data-theme-summary]').forEach(el=>el.textContent=presets[theme].label);
  $$('[data-theme-note]').forEach(el=>el.textContent=theme==='graphite'?'Graphite 是官网新增主题。先下载下方 CSS；默认从 Downloads 复制，保存到别处时请调整路径。':'这是 skill 内置预设。下面按所选安装目录调用真实的 theme 命令。');
  $$('[data-preset-download]').forEach(el=>{el.href=new URL(`theme/presets/${theme}.css`,assetBase);el.download=theme+'.css';el.textContent=`下载 ${theme}.css ↓`});
  $$('[data-theme-example]').forEach(el=>{const u=new URL(el.href);u.searchParams.set('theme',theme);el.href=u});
  if(!layout)return;
  $('[data-template-description]').textContent=descriptions[layout.value];
  $('[data-layout-download]').href=new URL(`template-library/rendering/${layout.value}.html`,assetBase);
  $('[data-interaction-download]').href=new URL(`template-library/interaction/${interaction.value}.html`,assetBase);
  const invocation=agent==='codex'?'$journey':'/journey';
  $('[data-template-prompt]').textContent=`${invocation}\n读取 .journey/job-application.md，为产品与设计评审生成 map.html。\n使用 Express 的 Interactive HTML 表达：\n- 布局参考：assets/templates/rendering/${layout.value}.html\n- 交互参考：assets/templates/interaction/${interaction.value}.html\n- 目的：${descriptions[layout.value]}\n所有数据来自这份旅程；保留缺失值、分支和来源标记。\n颜色只使用 Journey 语义 token；生成后运行 theme 命令应用 ${theme} 主题。`+(theme==='graphite'?'\nGraphite 若尚未安装，请先使用我下载的 graphite.css。':'');
  if(en)$('[data-template-prompt]').textContent=`${invocation}\nRead .journey/job-application.md and generate map.html for a product and design review.\nUse Express / Interactive HTML:\n- Layout reference: assets/templates/rendering/${layout.value}.html\n- Interaction reference: assets/templates/interaction/${interaction.value}.html\n- Purpose: ${JourneyDocs.translate(descriptions[layout.value])}\nUse only this journey's data. Preserve missing values, branches and provenance.\nUse Journey semantic colour tokens. After generating the HTML, apply the ${theme} theme with the theme command.`+(theme==='graphite'?'\nIf Graphite is not installed, use my downloaded graphite.css first.':'');
 }
 function apply(name,persist=false){
  theme=presets[name]?name:'graphite';const p=presets[theme];
  $$('[data-journey-theme]').forEach(el=>{
   allSeeds.forEach(key=>el.style.removeProperty(key));
   el.dataset.theme=p.mode;el.dataset.preset=theme;
   // Same mechanism as the skill's switcher: reseed Tier 1, let Tier 2 derive.
   Object.entries(p.seeds).forEach(([key,value])=>el.style.setProperty(key,value));
  });
  $$('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===theme)));
  if(persist){try{localStorage.setItem('journey-example-theme',theme)}catch{}
   const u=new URL(location.href);u.searchParams.set('theme',theme);history.replaceState(history.state,'',u);
  }
  recipe();
 }
 $$('[data-theme-picker]').forEach(box=>Object.entries(presets).forEach(([key,p])=>{
  const b=document.createElement('button');b.type='button';b.dataset.themeChoice=key;b.setAttribute('aria-pressed','false');
  const dot=document.createElement('span');dot.className='theme-swatch';dot.setAttribute('aria-hidden','true');dot.style.setProperty('--swatch-surface',p.seeds['--brand-surface']);dot.style.setProperty('--swatch-accent',p.seeds['--brand-primary']);
  const label=document.createElement('span');label.className='theme-name';label.textContent=p.label;b.title=p.label;b.setAttribute('aria-label',p.label);b.append(dot,label);b.addEventListener('click',()=>apply(key,true));box.append(b);
 }));
 function updateInteractions(){const previous=interaction.value;interaction.replaceChildren();combos[layout.value].forEach(key=>{const option=document.createElement('option');option.value=key;option.textContent=interactionNames[key];interaction.append(option)});if(combos[layout.value].includes(previous))interaction.value=previous;recipe()}
 if(layout){layout.addEventListener('change',updateInteractions);interaction.addEventListener('change',recipe);updateInteractions()}
 $$('[data-recipe-agent]').forEach(b=>b.addEventListener('click',()=>{agent=b.dataset.recipeAgent;$$('[data-recipe-agent]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));recipe()}));
 $$('[data-copy-recipe]').forEach(b=>b.addEventListener('click',async()=>{
  const target=b.dataset.copyRecipe==='local'?b.parentElement.querySelector('pre'):b.dataset.copyRecipe==='prompt'?$('[data-template-prompt]'):$('[data-theme-command]');
  const label=b.textContent;try{await navigator.clipboard.writeText(target.textContent);b.textContent='已复制'}catch{const r=document.createRange();r.selectNodeContents(target);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='已选中，请复制'}b.setAttribute('aria-live','polite');setTimeout(()=>b.textContent=label,2200);
 }));
 document.addEventListener('journey:language',recipe);
 apply(theme);
})();
