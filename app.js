'use strict';
const STORAGE_KEY = 'cashu-nexus-demo-v2';
const INITIAL_STATE = {
  balance: 125000,
  tx: [
    { id:'tx-001', name:'Received ecash', note:'Sample payment', detail:'Today · 09:42 · demo', amount:25000, kind:'in', timestamp:Date.now()-3600000 },
    { id:'tx-002', name:'Sent ecash', note:'Coffee with Alex', detail:'Yesterday · 18:10 · demo', amount:-8000, kind:'out', timestamp:Date.now()-86400000 },
    { id:'tx-003', name:'Wallet adjustment', note:'Illustrative entry', detail:'Nov 21 · 12:04 · demo', amount:12000, kind:'swap', timestamp:Date.now()-259200000 }
  ],
  mints: [
    { id:'mint-example-1', name:'Cashu.space', url:'https://cashu.space', note:'Example bookmark · not verified' },
    { id:'mint-example-2', name:'OpenCash', url:'https://opencash.example', note:'Example bookmark · fictional placeholder' }
  ]
};
let state = loadState();
let balanceHidden = false;
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const fmt = value => Number(value).toLocaleString('en-US');
function cloneInitial(){ return JSON.parse(JSON.stringify(INITIAL_STATE)); }
function loadState(){
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); if(saved && Number.isFinite(saved.balance) && Array.isArray(saved.tx) && Array.isArray(saved.mints)) return saved; }
  catch(error){ console.warn('Could not load demo state:', error); }
  return cloneInitial();
}
function saveState(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(error){ toast('Browser storage is unavailable'); } }
function toast(message){ const node=$('#toast'); node.textContent=message; node.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>node.classList.remove('show'),2400); }
function go(view){
  const target=$('#'+view); if(!target) return;
  $$('.view').forEach(section=>section.classList.toggle('active',section.id===view));
  $$('[data-view]').forEach(button=>{const isActive=button.dataset.view===view;button.classList.toggle('active',isActive);if(isActive)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
  $('#crumb').textContent=view.charAt(0).toUpperCase()+view.slice(1);
  history.replaceState(null,'','#'+view);
  window.scrollTo({top:0,behavior:'smooth'});
  if(view==='activity') renderActivity();
}
$$('[data-view]').forEach(button=>button.addEventListener('click',()=>go(button.dataset.view)));
$$('[data-go]').forEach(button=>button.addEventListener('click',()=>go(button.dataset.go)));
function txMarkup(tx){
  const icon=tx.kind==='in'?'↙':tx.kind==='out'?'↗':'⟳';
  const amountClass=tx.amount>0?'positive':tx.amount<0?'negative':'';
  const amountText=(tx.amount>0?'+':'')+fmt(tx.amount)+' sats';
  const wrapper=document.createElement('div'); wrapper.className='transaction';
  const iconNode=document.createElement('div'); iconNode.className='tx-icon '+(tx.kind==='out'?'out':tx.kind==='swap'?'swap':''); iconNode.textContent=icon;
  const meta=document.createElement('div'); meta.className='tx-meta';
  const name=document.createElement('b'); name.textContent=tx.name;
  const detail=document.createElement('small'); detail.textContent=tx.detail+(tx.note?' · '+tx.note:'');
  meta.append(name,detail);
  const amount=document.createElement('div'); amount.className='tx-amount '+amountClass; amount.textContent=amountText;
  wrapper.append(iconNode,meta,amount); return wrapper;
}
function renderMints(){
  $('#mintCount').innerHTML=state.mints.length+' <em>saved</em>';
  $('#mintListCount').textContent=state.mints.length;
  const mini=$('#overviewMints'); mini.replaceChildren();
  const directory=$('#mintDirectory'); directory.replaceChildren();
  $('#emptyMints').classList.toggle('hidden',state.mints.length!==0);
  if(!state.mints.length){ mini.innerHTML='<div class="empty-state">No mint bookmarks yet.</div>'; return; }
  state.mints.forEach(mint=>{
    const avatar=document.createElement('div'); avatar.className='mint-avatar'; avatar.textContent=(mint.name||'M').slice(0,1).toUpperCase();
    const meta=document.createElement('div'); meta.className='mint-meta';
    const name=document.createElement('b'); name.textContent=mint.name;
    const url=document.createElement('small'); url.textContent=mint.url;
    meta.append(name,url);
    const miniRow=document.createElement('div'); miniRow.className='mint-mini'; miniRow.append(avatar.cloneNode(true),meta.cloneNode(true));
    const directoryRow=document.createElement('div'); directoryRow.className='mint-row';
    const directoryMeta=meta.cloneNode(true); const note=document.createElement('small'); note.textContent=mint.note||'Saved locally · not verified'; directoryMeta.append(note);
    const remove=document.createElement('button'); remove.className='remove-mint'; remove.type='button'; remove.textContent='Remove'; remove.setAttribute('aria-label','Remove '+mint.name); remove.addEventListener('click',()=>removeMint(mint.id));
    directoryRow.append(avatar.cloneNode(true),directoryMeta,remove); mini.append(miniRow); directory.append(directoryRow);
  });
}
function renderActivity(){
  const query=($('#activitySearch')?.value||'').trim().toLowerCase();
  const filter=$('#activityFilter')?.value||'all';
  const filtered=state.tx.filter(tx=> (filter==='all'||tx.kind===filter) && [tx.name,tx.note,tx.detail].join(' ').toLowerCase().includes(query));
  const all=$('#allActivity'); all.replaceChildren(); filtered.forEach(tx=>all.append(txMarkup(tx)));
  $('#emptyActivity').classList.toggle('hidden',filtered.length!==0);
  const recent=$('#recentActivity'); recent.replaceChildren(); state.tx.slice(0,4).forEach(tx=>recent.append(txMarkup(tx)));
  $('#emptyRecent').classList.toggle('hidden',state.tx.length!==0);
  const received=state.tx.filter(tx=>tx.kind==='in').reduce((sum,tx)=>sum+Math.max(0,tx.amount),0);
  const sent=state.tx.filter(tx=>tx.kind==='out').reduce((sum,tx)=>sum+Math.abs(Math.min(0,tx.amount)),0);
  $('#receivedTotal').innerHTML=fmt(received)+' <em>sats</em>';
  $('#sentTotal').innerHTML=fmt(sent)+' <em>sats</em>';
}
function render(){
  $('#balanceValue').innerHTML=balanceHidden?'•••••• <span>sats</span>':fmt(state.balance)+' <span>sats</span>';
  renderActivity(); renderMints();
}
$('#toggleBalance').addEventListener('click',()=>{balanceHidden=!balanceHidden;render();$('#toggleBalance').textContent=balanceHidden?'◎':'◉';});
$('#previewSend').addEventListener('click',()=>{
  const token=$('#tokenInput').value.trim();
  if(!token){toast('Enter a sample placeholder first');$('#tokenInput').focus();return;}
  if(!/^cashu/i.test(token)){toast('A Cashu token usually starts with “cashu”');return;}
  $('#reviewNote').textContent=$('#sendNote').value.trim()||'No note';
  $('#sendReview').classList.remove('hidden');
  $('#sendReview').scrollIntoView({behavior:'smooth',block:'nearest'});
});
$('#clearSend').addEventListener('click',()=>{$('#tokenInput').value='';$('#sendNote').value='';$('#sendReview').classList.add('hidden');toast('Form cleared');});
$('#addDemoSend').addEventListener('click',()=>{
  const note=$('#sendNote').value.trim();
  const amount=1000;
  if(state.balance<amount){toast('Demo balance is too low');return;}
  state.balance-=amount;
  state.tx.unshift({id:crypto.randomUUID?.()||String(Date.now()),name:'Demo send preview',note,detail:'Just now · local demo',amount:-amount,kind:'out',timestamp:Date.now()});
  saveState();render();$('#sendReview').classList.add('hidden');$('#tokenInput').value='';$('#sendNote').value='';toast('Sample activity added — no payment sent');go('activity');
});
$$('[data-amount]').forEach(button=>button.addEventListener('click',()=>{$('#receiveAmount').value=button.dataset.amount;$$('[data-amount]').forEach(b=>b.classList.toggle('selected',b===button));}));
$('#makeRequest').addEventListener('click',()=>{
  const amount=Number($('#receiveAmount').value);
  if(!Number.isSafeInteger(amount)||amount<1||amount>2100000000000000){toast('Enter a whole-number amount of sats');$('#receiveAmount').focus();return;}
  const ref=(globalThis.crypto?.getRandomValues?Array.from(crypto.getRandomValues(new Uint8Array(5)),n=>n.toString(16).padStart(2,'0')).join('') : Math.random().toString(36).slice(2,12)).toUpperCase();
  const note=$('#receiveNote').value.trim();
  $('#requestCode').textContent='NEXUS-DEMO-REQUEST-'+amount+'-SATS-'+ref+(note?'\nNOTE: '+note:'')+'\nNOT A CASHU INVOICE';
  $('#requestResult').classList.remove('hidden');
});
$('#copyRequest').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#requestCode').textContent);toast('Demo string copied');}catch(error){toast('Clipboard unavailable — select and copy the string');}});
$('#addMint').addEventListener('click',()=>{
  const raw=$('#mintUrl').value.trim(); if(!raw){toast('Enter a mint URL');return;}
  let parsed; try{parsed=new URL(raw);}catch(error){toast('Enter a complete URL, including https://');return;}
  if(!['https:','http:'].includes(parsed.protocol)){toast('Only http:// or https:// URLs are accepted');return;}
  if(state.mints.some(m=>m.url.replace(/\/$/,'')===parsed.href.replace(/\/$/,''))){toast('This URL is already saved');return;}
  state.mints.unshift({id:globalThis.crypto?.randomUUID?.()||String(Date.now()),name:parsed.hostname.replace(/^www\./,''),url:parsed.href,note:'Added locally · not verified'});
  saveState();renderMints();$('#mintUrl').value='';toast('Saved as a local bookmark');
});
function removeMint(id){state.mints=state.mints.filter(m=>m.id!==id);saveState();renderMints();toast('Mint bookmark removed');}
$('#activitySearch').addEventListener('input',renderActivity);$('#activityFilter').addEventListener('change',renderActivity);
function exportCsv(){
  const rows=[['ID','Name','Note','Type','Amount (sats)','Detail'],...state.tx.map(tx=>[tx.id,tx.name,tx.note||'',tx.kind,tx.amount,tx.detail])];
  const csv=rows.map(row=>row.map(value=>'"'+String(value??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='cashu-nexus-demo-activity.csv';document.body.append(link);link.click();link.remove();URL.revokeObjectURL(url);toast('CSV exported');
}
$('#exportCsv').addEventListener('click',exportCsv);$('#settingsExport').addEventListener('click',exportCsv);
$('#resetDemo').addEventListener('click',()=>{if(!confirm('Reset the local demo balance, activity and mint bookmarks?'))return;state=cloneInitial();saveState();render();toast('Demo restored to its starting state');go('overview');});
$('#helpButton').addEventListener('click',()=>$('#helpModal').classList.remove('hidden'));
function closeModal(){$('#helpModal').classList.add('hidden');}
$('#closeHelp').addEventListener('click',closeModal);$('#gotIt').addEventListener('click',closeModal);$('#helpModal').addEventListener('click',event=>{if(event.target.id==='helpModal')closeModal();});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal();});
const initialView=location.hash.slice(1);render();if(initialView&&$('#'+initialView)?.classList.contains('view'))go(initialView);
