/* Conventional journey-map structure. Summaries translate fields in the local snapshot. */
(()=>{
 const data=window.JOB_DATA;if(!data)return;
 const steps=data.milestones.flatMap(m=>m.steps),byID=new Map(steps.map(s=>[s.id,s]));
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const titles=['看到职位','判断是否适合','点击申请','创建账户','填写申请','提交申请','收到确认','AI 筛选','快速拒绝','等待消息','查询与跟进','收到回复','被拒绝','没有下文','进入面试'];
 const title=s=>titles[steps.indexOf(s)],stages=['发现职位','提交申请','筛选与等待','收到结果'];
 const endings={'outcome-advance':'进入面试','outcome-rejection':'收到拒信','outcome-ghosted':'始终无回复','outcome-fast-rejection':'筛选后快速拒绝'};
 const translations={
  'read-and-assess-fit':{thinking:'“大部分要求都符合，但不是全部。值得花时间申请吗？”',painPoint:'职位要求模糊或过高，难以判断是否适合。',opportunity:'区分必须满足的条件与加分项。'},
  'see-the-posting':{thinking:'“这份工作可能适合我，先看看要求。”'},
  'create-account':{painPoint:'还没看到申请表，就必须先注册账户。',opportunity:'允许先申请，提交时再注册；或支持访客申请。'},
  'fill-application-form':{painPoint:'上传了简历，还要重复填写；解析出错后要手动修正。',opportunity:'只解析一次，让申请人确认，避免重复填写相同信息。'},
  'wait-in-silence':{thinking:'“有人看过申请吗？要不要跟进，又怕打扰他们。”',painPoint:'不知道是否有人看过，没有状态、时间线或明确结果。',opportunity:'展示真实的内部进度，例如正在审核、通常需要两周。'},
  'receive-confirmation':{painPoint:'自动回复没有说明下一步或时间安排。',opportunity:'告诉申请人接下来会发生什么，以及预计时间。'},
  'outcome-fast-rejection':{thinking:'“至少知道结果了，但真的有人看过吗？”',painPoint:'没有不匹配的原因，也不知道决定来自算法。',opportunity:'及时、坦诚地说明拒绝原因，让申请得到明确回应。'},
  'outcome-rejection':{painPoint:'等了数周，只收到没有反馈的模板拒信。',opportunity:'及时、有人情味的回复，哪怕只提供少量个性化反馈。'},
  'outcome-ghosted':{painPoint:'始终没有结果，只能自己猜测已被拒绝。',opportunity:'岗位关闭时自动通知申请人，结束无期限的等待。'}
 };
 const channelText={'LinkedIn / job board / careers page':'LinkedIn / 招聘网站 / 企业招聘页','Careers portal (ATS-hosted)':'招聘门户（ATS）','Careers portal':'招聘门户','Email':'邮件','Automated (no visible touchpoint for Maya)':'自动筛选（用户不可见）','Portal, then email, then LinkedIn':'门户 → 邮件 → LinkedIn','Email (rejection or advance), or silence':'邮件通知，或没有回应','Email / recruiter call':'邮件 / 招聘人员来电'};
 function path(ending){const visited=new Set();function search(s){if(!s||visited.has(s.id))return null;if(s.id===ending)return[s];visited.add(s.id);for(const ref of [s.fields.next||[]].flat()){const result=search(byID.get(String(ref).split('→').pop().trim()));if(result)return[s,...result]}return null}return search(steps[0])||[]}
 function groups(ending){const route=path(ending);return data.milestones.map(m=>({...m,steps:m.steps.filter(s=>route.includes(s))}))}
 function representative(group,key){const preferred=['wait-in-silence','fill-application-form','read-and-assess-fit','outcome-fast-rejection','outcome-rejection','outcome-ghosted'];return preferred.map(id=>group.steps.find(s=>s.id===id&&s.fields[key]!==undefined)).find(Boolean)||group.steps.find(s=>s.fields[key]!==undefined)}
 function excerpt(s,key){return translations[s.id]?.[key]||([s.fields[key]].flat().join(' · '))}
 function curve(gs,compact=false){const cw=220,w=880,h=154,points=gs.flatMap((g,k)=>g.steps.map((s,i)=>({s,x:k*cw+20+(i+.5)*(cw-40)/Math.max(1,g.steps.length),v:s.fields.emotionValence===undefined?null:Number(s.fields.emotionValence)}))),lookup=new Map(points.map(p=>[p.s.id,p])),y=v=>72-v*23;let b='';
  [-2,0,2].forEach(v=>b+=`<path d="M0 ${y(v)}H${w}" class="cjm-emotion-grid"/>`);[1,2,3].forEach(i=>b+=`<path d="M${i*cw} 0V${h}" class="cjm-column-rule"/>`);
  for(const p of points){if(p.v===null)continue;for(const ref of [p.s.fields.next||[]].flat()){const n=lookup.get(String(ref).split('→').pop().trim());if(n&&n.v!==null)b+=`<path class="cjm-emotion-line" d="M${p.x} ${y(p.v)}L${n.x} ${y(n.v)}"/>`}}
  for(const p of points){const text=p.v===null?'未记录':p.v>0?'+'+p.v:p.v;let mark=p.v===null?`<path class="cjm-missing-guide" d="M${p.x} 36V99"/><text class="cjm-missing-label" x="${p.x}" y="16" text-anchor="middle">${escape(title(p.s))}</text><text class="cjm-missing-label" x="${p.x}" y="29" text-anchor="middle">情绪未记录</text><circle class="cjm-missing-dot" cx="${p.x}" cy="72" r="4"/>`:`<circle class="cjm-emotion-dot" cx="${p.x}" cy="${y(p.v)}" r="4"/><text class="cjm-chart-value" x="${p.x}" y="${y(p.v)-12}" text-anchor="middle">${text}</text>`;mark+=`<text class="cjm-chart-label" x="${p.x}" y="145" text-anchor="middle">${compact||p.v===null?'':escape(title(p.s))}</text>`;b+=compact?mark:`<g class="plot-target" tabindex="0" role="button" aria-label="查看 ${escape(title(p.s))}" data-step="${p.s.id}"><rect x="${p.x-16}" y="0" width="32" height="154" fill="transparent"/>${mark}</g>`}
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="当前路径的情绪曲线；AI 筛选未记录情绪，曲线在此断开">${b}</svg>`
 }
 function render(compact=false,ending='outcome-advance'){
  const gs=groups(ending),route=path(ending),button=(s,text,cls='')=>compact?`<span>${escape(text)}</span>`:`<button class="cjm-source ${cls}" data-step="${s.id}" title="查看 ${escape(title(s))} 的原始字段">${escape(text)}</button>`;
  const empty=(g,text)=>`<span class="cjm-empty">${g.steps.length?text:'此路径未进入该阶段'}</span>`;
  function cell(g,key){if(key==='actions')return g.steps.length?`<ol class="cjm-action-list">${g.steps.map(s=>`<li>${button(s,title(s))}</li>`).join('')}</ol>`:empty(g,'');
   if(key==='channel'){const unique=[...new Map(g.steps.filter(s=>s.fields.channel).map(s=>[s.fields.channel,s])).values()];return unique.length?`<div class="cjm-touchpoints">${unique.map(s=>button(s,channelText[s.fields.channel]||s.fields.channel)).join('')}</div>`:empty(g,'未记录触点')}
   const s=representative(g,key);return s?button(s,excerpt(s,key),'cjm-note')+`<small class="cjm-source-caption">${escape(title(s))}</small>`:empty(g,'未记录'+{thinking:'想法',painPoint:'痛点',opportunity:'机会'}[key]);
  }
  const rows=[['actions','行为','ACTIONS'],['thinking','想法','THOUGHTS'],['channel','触点','TOUCHPOINTS'],['emotion','情绪','EMOTIONS'],['painPoint','痛点','PAIN POINTS'],['opportunity','机会','OPPORTUNITIES']];
  const table=`<table class="journey-matrix"><caption class="sr-only">Maya 的用户旅程地图：阶段、行为、想法、触点、情绪、痛点与机会</caption><colgroup><col class="cjm-axis-col">${gs.map(()=>'<col>').join('')}</colgroup><thead><tr><th scope="col" class="cjm-axis">阶段 <span>STAGES →</span></th>${gs.map((g,i)=>`<th scope="col"><small>0${i+1}</small><strong>${stages[i]}</strong><span>${g.steps.length?g.steps.length+' 个步骤':'—'}</span></th>`).join('')}</tr></thead><tbody>${rows.map(([key,label,en])=>`<tr class="cjm-row cjm-${key}"><th scope="row" class="cjm-axis">${label}<span>${en}</span>${key==='emotion'?'<small>+2 积极<br>0 中性<br>−2 消极</small>':''}</th>${key==='emotion'?`<td colspan="4" class="cjm-curve-cell">${curve(gs,compact)}</td>`:gs.map(g=>`<td>${cell(g,key)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  if(compact)return `<div class="cjm-preview" aria-label="用户旅程地图概览：四个阶段与六个体验维度"><div class="cjm-preview-inner">${table}</div></div>`;
  return `<section class="cjm"><header class="cjm-context"><div class="cjm-person"><span class="cjm-avatar" aria-hidden="true">M</span><div><strong>Maya</strong><span>在职求职者 · 通过线上门户申请工作</span></div></div><div class="cjm-goal"><small>目标</small><p>申请一份适合自己的工作，获得明确的后续回应。</p></div><label class="cjm-route">查看路径<select data-journey-outcome>${Object.entries(endings).map(([id,label])=>`<option value="${id}"${id===ending?' selected':''}>${label}</option>`).join('')}</select><span>${route.length} 个步骤 · 共 15 个源步骤</span></label></header><div class="cjm-scroll" tabindex="0" aria-label="用户旅程地图，可横向滚动">${table}</div><footer class="cjm-note-footer"><span>阶段内展示关键字段的中文摘要；点击内容可检查原文。空白项保留为未记录。</span><span>当前结局：${endings[ending]}</span></footer></section>`
 }
 window.JourneyMap={render,path};
})();
