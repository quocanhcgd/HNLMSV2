// Generate docs/12-diagrams/Workflows-Canvas.html from the 8 workflow files (11-workflows/WF-*.md).
// Usage: node scripts/generate-workflows-canvas.js
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'docs', '11-workflows');
const files = fs.readdirSync(dir).filter(f => /^WF-\d{2}.*\.md$/.test(f)).sort();

function stripEmoji(s){ return (s||'')
  .replace(/<br\s*\/?>/gi,' ')
  .replace(/[\u{2300}-\u{23FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1FAFF}\u{FE0F}\u200D\u200E\u2066-\u2069\u061C]/gu,'')
  .replace(/^[\s\[]+/,'').replace(/[\s\]]+$/,'').replace(/\s{2,}/g,' ').trim(); }

// Split a phase block into "**Label:**" sections.
function phaseSections(b){
  const out={}; const re=/\*\*([A-Za-z0-9 ,&/]+?)\*\*:\s*([\s\S]*?)(?=\*\*[A-Za-z0-9 ,&/]+?\*\*:|^### |^---$|\n## |\z)/gm;
  let mm; while((mm=re.exec(b))){
    const key=mm[1].trim(), val=mm[2];
    const lines=val.split('\n').map(s=>s.trim()).filter(Boolean);
    const items=lines.filter(s=>/^[-*▶🔹📝🧾✅📌]|\d+[.)]/.test(s)).map(s=>s.replace(/^(?:[-*▶🔹📝🧾✅📌]+|\d+[.)])\s*/,'').replace(/\[\[|\]\]/g,'').trim());
    out[key]={text:val.trim(), list:items.length?items:[]};
  }
  return out;
}
function clean(x){return String(x||'').replace(/\[\[|\]\]/g,'').trim();}
// Condensed numbered steps (e.g. "1. Trigger Event:") from a phase body.
function numberedSteps(body){
  const out=[]; const re=/^\s*\d+\.\s+\*{0,2}\s*([A-Za-z][^\*\n:]{0,70})\*{0,2}\s*:/gm; let m;
  while((m=re.exec(body))){ const t=m[1].replace(/\s+/g,' ').trim(); if(t&&out.indexOf(t)<0) out.push(t); }
  return out;
}
function parsePhases(txt){
  const lines=txt.split('\n');
  let start=-1, kind='h3';
  for(let i=0;i<lines.length;i++){ if(/^##\s*Phase Breakdown/.test(lines[i])){start=i;kind='h3';break;} }
  if(start<0){ for(let i=0;i<lines.length;i++){ if(/^##\s+(Phase|Channel)\b/.test(lines[i])){start=i;kind='h2';break;} } }
  if(start<0) return [];
  let end=lines.length;
  for(let i=start+1;i<lines.length;i++){
    if(/^##\s+/.test(lines[i])){
      if(kind==='h3'){ end=i; break; }
      if(!/^##\s*(Phase|Channel)\b/.test(lines[i])){ end=i; break; }
    }
  }
  const region=lines.slice(start,end).join('\n');
  const re=kind==='h3'?/^###\s+Phase\b[^\n]*/gm:/^##\s+(?:Phase|Channel)\b[^\n]*/gm;
  const heads=[...region.matchAll(re)];
  const phases=[];
  for(let hi=0;hi<heads.length;hi++){
    const hl=heads[hi][0];
    const title=hl.replace(/^#{1,3}\s+(?:Phase|Channel)\s*\d+[.:]?\s*/,'').trim();
    const b0=heads[hi].index+hl.length;
    const b1=hi+1<heads.length?heads[hi+1].index:region.length;
    const body=region.slice(b0,b1);
    const sec=phaseSections(body);
    const act=(sec['Actors']||{list:[],text:''});
    phases.push({
      title: clean(title)||hl.trim(),
      objective: clean((sec['Objective']||{}).text),
      trigger: clean((sec['Trigger']||{}).text),
      actors: (act.list.length?act.list:[act.text]).filter(Boolean).map(clean),
      actions: (function(){ var a=((((sec['Actions']||{}).list)||[]).concat(((sec['Process']||{}).list)||[])).map(s=>clean(s)).filter(Boolean); return (a.length?a:numberedSteps(body)).slice(0,16); })(),
      criteria: (((sec['Success Criteria']||{}).list)||[]).map(clean).filter(Boolean)
    });
  }
  return phases;
}
function norm(t){return String(t||'').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();}
function toks(t){return norm(t).split(' ').filter(w=>w.length>1);}
function phaseScore(label, ph){
  const ntok=new Set(toks(label)); const btok=new Set(toks(ph.title+' '+ph.objective+' '+(ph.actions||[]).join(' ')));
  let sc=0; toks(ph.title).forEach(t=>{ if(ntok.has(t)) sc+=3; }); ntok.forEach(t=>{ if(btok.has(t)) sc+=1; });
  return sc;
}
function mapNodeToPhase(n, phases){
  let best=0, bi=0;
  for(let i=0;i<phases.length;i++){ const s=phaseScore(n.label, phases[i]); if(s>best){best=s;bi=i;} }
  return phases.length?bi:-1;
}

function parseMermaid(block){
  const lines = block.split('\n');
  const nodes = new Map(); const edges = []; const roles = {}; const order = [];
  for(const raw of lines){
    let line = raw.trim();
    if(!line || line.startsWith('graph') || line.startsWith('subgraph') || line.startsWith('end') || line.startsWith('%%')) continue;
    const cm = line.match(/^class\s+([A-Za-z0-9_,\s]+?)\s+([A-Za-z_]+)$/);
    if(cm){ for(const id of cm[1].split(',')){ const k=id.trim(); if(k) roles[k]=cm[2].trim(); } continue; }
    if(line.startsWith('classDef') || line.startsWith('style') || line.startsWith('linkStyle')) continue;
    const ndef = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*(?:\{\{\s*([^}]*)\}\}|\(\s*\(\s*([^)]*)\)\s*\)|\[\s*\[\s*([^\]]*)\]\s*\]|\(\s*([^)]*)\s*\)|\[\s*([^\]]*)\s*\])$/);
    if(ndef && !line.includes('-->') && !line.includes('-.->') && !line.includes('==>') && !line.includes('---')){
      const id=ndef[1]; const label=(ndef[2]||ndef[3]||ndef[4]||ndef[5]||ndef[6]||'').trim();
      let shape='rect';
      if(ndef[2]) shape='hex'; else if(ndef[3]) shape='circle'; else if(ndef[4]) shape='round'; else if(ndef[5]) shape='round';
      if(!nodes.has(id)){ nodes.set(id,{id,label:stripEmoji(label)||id,shape,role:roles[id]||''}); order.push(id); }
      else { if(label) nodes.get(id).label=stripEmoji(label); nodes.get(id).role=roles[id]||nodes.get(id).role; }
      continue;
    }
    const arrows = line.match(/(?:-->|-\.->|==>|--|==|~~~)/g) || [];
    if(!arrows.length) continue;
    const parts = line.split(/(?:-->|-\.->|==>|--|==|~~~)/);
    let fromId=null;
    for(let i=0;i<parts.length;i++){
      const seg = parts[i];
      const lm = seg.match(/^\s*\|\s*([^|]*?)\s*\|\s*/);
      const cleanSeg = lm ? seg.replace(/^\s*\|\s*[^|]*?\s*\|\s*/,'') : seg;
      const idm = cleanSeg.match(/([A-Za-z][A-Za-z0-9_]*)/);
      if(!idm) continue;
      const id = idm[1];
      if(!nodes.has(id)){ nodes.set(id,{id,label:id,shape:'rect',role:roles[id]||''}); order.push(id); }
      const bl = cleanSeg.slice(idm.index + id.length).match(/\[\[\s*([^\]]*?)\s*\]\]|\(\s*\(\s*([^)]*?)\s*\)\s*\)|\{\{\s*([^}]*?)\s*\}\}|\{\s*([^}]*?)\s*\}|\[\s*([^\]]*?)\s*\]|\(\s*([^)]*?)\s*\)/);
      if(bl){
        const lbl = stripEmoji((bl[1]||bl[2]||bl[3]||bl[4]||bl[5]||bl[6]||'').trim());
        if(lbl) nodes.get(id).label = lbl;
        if(bl[2]) nodes.get(id).shape='circle'; else if(bl[3]) nodes.get(id).shape='hex'; else if(bl[4]) nodes.get(id).shape='diamond'; else if(bl[5]) nodes.get(id).shape='rect'; else if(bl[6]) nodes.get(id).shape='round';
      }
      if(i>0 && fromId){ const dashed = arrows[i-1]==='-.->'||arrows[i-1]==='---'||arrows[i-1]==='-.-'; edges.push({from:fromId,to:id,label:lm?stripEmoji(lm[1]):'',dashed}); }
      fromId = id;
    }
  }
  return { nodes:[...nodes.values()], edges };
}
function extract(file, idx){
  const txt = fs.readFileSync(path.join(dir,file),'utf8');
  const title = (txt.match(/^#\s+(.*)$/m)||[])[1]||file;
  const meta = {};
  const fm = txt.match(/^---\s*\n([\s\S]*?)\n---/);
  if(fm){ for(const l of fm[1].split('\n')){ const mm=l.match(/^(\w+):\s*(.*)$/); if(mm) meta[mm[1]]=mm[2].trim(); } }
  const m = txt.match(/```mermaid\s*\n([\s\S]*?)```/);
  const data = m ? parseMermaid(m[1]) : {nodes:[],edges:[]};
  const phases = parsePhases(txt);
  data.nodes.forEach(n=>{ n.p = mapNodeToPhase(n, phases); });
  let scope='MVP';
  if(/Roadmap P3/.test(txt)) scope='P3'; else if(/Roadmap P2/.test(txt)) scope='P2';
  return { id:'wf_'+String(idx).padStart(2,'0'), file, title:stripEmoji(title), category:meta.category||'', phases:meta.phases||'', estimated:meta.estimated_time||'', scope, nodes:data.nodes, edges:data.edges, phases, doc:renderDoc(txt) };
}
// ---------- Markdown -> HTML (Obsidian-style document view) ----------
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function inline(s){
  s=esc(s);
  s=s.replace(/`([^`]+)`/g,(m,c)=>'<code>'+c+'</code>');
  s=s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,(m,alt,src,t)=>'<img alt="'+alt+'" src="'+src+'"'+(t?' title="'+t+'"':'')+'>');
  s=s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  s=s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(m,a,b)=>'<span class="wl">'+esc(b||a)+'</span>');
  s=s.replace(/\*\*\*([^*]+)\*\*\*/g,'<b><i>$1</i></b>');
  s=s.replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
  s=s.replace(/__([^_]+)__/g,'<b>$1</b>');
  s=s.replace(/\*([^*]+)\*/g,'<i>$1</i>');
  s=s.replace(/_([^_]+)_/g,'<i>$1</i>');
  s=s.replace(/~~([^~]+)~~/g,'<s>$1</s>');
  return s;
}
function slug(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-');}
function renderTable(lines){
  const sep=lines[1]||'';
  if(sep.indexOf('-')<0||!/^\|?[\s:|-]+\|?$/.test(sep)) return null;
  const cells=ln=>ln.split('|').slice(1,-1).map(s=>s.trim());
  const head=cells(lines[0]);
  const aligns=(sep.split('|').slice(1,-1)).map(s=>{const t=s.trim();return t.startsWith(':')&&t.endsWith(':')?'center':t.endsWith(':')?'right':'left';});
  const body=lines.slice(2).map(cells);
  let h='<table><thead><tr>'+head.map((c,i)=>'<th style="text-align:'+(aligns[i]||'left')+'">'+inline(c)+'</th>').join('')+'</tr></thead><tbody>';
  body.forEach(r=>{h+='<tr>'+head.map((_,i)=>'<td style="text-align:'+(aligns[i]||'left')+'">'+inline(r[i]||'')+'</td>').join('')+'</tr>';});
  return h+'</tbody></table>';
}
function renderList(lines){
  const items=[];
  for(const l of lines){
    const m=l.match(/^(\s*)(?:\d+[.)]|[-*+])\s+(.*)$/);
    if(!m) return null;
    items.push({ind:Math.floor(m[1].length/2), txt:m[2]});
  }
  const ordered=/^\s*\d+[.)]\s/.test(lines[0]);
  let out='',i=0;
  function walk(ind){
    let r='',cur=null;
    while(i<items.length&&items[i].ind===ind){
      const it=items[i];
      const tag=ordered?'ol':'ul';
      if(cur!==tag){ if(cur) r+='</'+cur+'>'; r+='<'+tag+(ordered?' start="1"':'')+'>'; cur=tag; }
      let txt=inline(it.txt);
      const tm=txt.match(/^(\[([ xX])\]\s*)/);
      if(tm){ txt='<span class="task">'+(/x/i.test(tm[2])?'☑':'☐')+'</span> '+txt.slice(tm[1].length); }
      r+='<li>'+txt;
      if(i+1<items.length&&items[i+1].ind>ind){i++;r+=walk(ind+1);}
      r+='</li>';i++;
    }
    if(cur)r+='</'+cur+'>';
    return r;
  }
  return walk(items[0].ind);
}
function renderQuote(lines){
  const body=lines.map(l=>l.replace(/^\s*>\s?/,'')).join('\n');
  const cm=lines[0].replace(/^\s*>\s?/,'').match(/^\[!(\w+)\]\s*(.*)$/);
  if(cm){
    const t=cm[1].toLowerCase();
    const colors={note:'#3b82f6',tip:'#10b981',warning:'#f59e0b',danger:'#ef4444',info:'#38bdf8'};
    const c=colors[t]||'#3b82f6';
    return '<div class="callout" style="border-left-color:'+c+'"><b style="color:'+c+'">'+esc(cm[2]||t)+'</b><div>'+inline(body.replace(/^\[!\w+\]\s*[^\n]*\n?/,''))+'</div></div>';
  }
  return '<blockquote>'+inline(body)+'</blockquote>';
}
function renderPara(lines){
  return '<p>'+lines.map(l=>inline(l.replace(/ {2,}$/,' @@BR@@'))).join(' ').replace(/@@BR@@/g,'<br>')+'</p>';
}
function renderBlock(lines){
  const t=renderTable(lines); if(t) return t;
  if(lines.length===1&&/^\s*(---+|\*\*\*+|___+)\s*$/.test(lines[0])) return '<hr>';
  const hm=lines[0].match(/^(#{1,6})\s+(.*)$/);
  if(hm){
    const lv=hm[1].length;
    let h='<h'+lv+' id="'+slug(hm[2])+'">'+inline(hm[2])+'</h'+lv+'>';
    if(lines.length>1) h+=renderBlock(lines.slice(1));
    return h;
  }
  if(lines.every(l=>/^\s*>\s?/.test(l))) return renderQuote(lines);
  const li0=lines.findIndex(l=>/^\s*(?:[-*+]|\d+[.)])\s+/.test(l));
  if(li0>0) return renderPara(lines.slice(0,li0))+renderBlock(lines.slice(li0));
  const lst=renderList(lines); if(lst) return lst;
  return renderPara(lines);
}
function renderBlocks(txt){
  const blocks=[];let cur=[];
  const flush=()=>{if(cur.length){blocks.push(cur);cur=[];}};
  for(const l of txt.split('\n')){ if(l.trim()==='')flush(); else cur.push(l); }
  flush();
  return blocks.map(renderBlock).join('\n');
}
function renderDoc(md){
  let txt=md.replace(/^---\s*\n[\s\S]*?\n---\s*\n/,'');
  const fenceRe=/^```([^\n]*)$/gm;
  const mms=[...txt.matchAll(fenceRe)];
  let out='', pos=0;
  for(let k=0;k<mms.length;k+=2){
    const open=mms[k], close=mms[k+1];
    if(!close){ out+=renderBlocks(txt.slice(pos)); pos=txt.length; break; }
    out+=renderBlocks(txt.slice(pos, open.index));
    const lang=(open[1]||'').trim();
    const code=txt.slice(open.index+open[0].length, close.index).replace(/^\n+/,'').replace(/\n+$/,'');
    if(lang==='mermaid'){ out+='<div class="md-hint">📐 Sơ đồ tương tác của workflow này nằm ở chế độ <b>Sơ đồ</b> (nút phía trên).</div>'; }
    else{ out+='<pre><code class="lang-'+esc(lang||'txt')+'">'+esc(code)+'</code></pre>'; }
    pos=close.index+close[0].length;
  }
  if(pos<txt.length) out+=renderBlocks(txt.slice(pos));
  return out;
}

const list = files.map(extract);
const json = JSON.stringify(list).replace(/</g,'\\u003c');
const tplPath = path.join(root,'docs','12-diagrams','Workflows-Canvas.template.html');
const outPath = path.join(root,'docs','12-diagrams','Workflows-Canvas.html');
const tpl = fs.readFileSync(tplPath,'utf8');
const out = tpl.replace('const WORKFLOWS = __DATA__;','const WORKFLOWS = '+json+';');
fs.writeFileSync(outPath, out);
console.log('Generated:', path.relative(root, outPath), '('+out.length+' bytes)');
console.log('Workflows:', list.map(w=>w.id+' n='+w.nodes.length+' e='+w.edges.length+' '+w.scope).join('  '));
