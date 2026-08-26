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
  let scope='MVP';
  if(/Roadmap P3/.test(txt)) scope='P3'; else if(/Roadmap P2/.test(txt)) scope='P2';
  return { id:'wf_'+String(idx).padStart(2,'0'), file, title:stripEmoji(title), category:meta.category||'', phases:meta.phases||'', estimated:meta.estimated_time||'', scope, nodes:data.nodes, edges:data.edges };
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
