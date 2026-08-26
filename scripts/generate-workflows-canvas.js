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
  return { id:'wf_'+String(idx).padStart(2,'0'), file, title:stripEmoji(title), category:meta.category||'', phases:meta.phases||'', estimated:meta.estimated_time||'', scope, nodes:data.nodes, edges:data.edges, phases };
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
