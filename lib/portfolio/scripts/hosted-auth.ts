export const portfolioHostedAuthScriptHtml = `/* ===== HOSTED IDENTITY: validated by Sites on the server ===== */
function getAuth(){return cloudBoot?.user||null;}
function enterApp(){document.getElementById("appBoot")?.remove();hideAllPasswords();const a=getAuth();if(!a)return;document.body.classList.remove('locked');authBack.classList.remove('show');renderUserIdentity();userChip.style.display='flex';devTab.style.display='';devTab.textContent=a.roles.includes('admin')?'⚙ Admin & Developer':'⚙ Akun & data';document.querySelectorAll('[data-owner-only]').forEach(el=>el.hidden=!a.roles.includes('admin'));}
function logout(){cloudFlushBeforeLogout();}
function finishSetup(){enterApp();}
const LOG_LIMIT=60,LOG_PAGE_SIZE=10;let logPage=1;
function getLogs(){try{const logs=JSON.parse(localStorage.getItem('denny_logs')||'[]');return Array.isArray(logs)?logs.filter(l=>l&&typeof l.m==='string'&&Number.isFinite(Date.parse(l.t))).slice(0,LOG_LIMIT):[];}catch(e){return[]}}
function renderActivityLogs(){const logs=getLogs(),pages=Math.max(1,Math.ceil(logs.length/LOG_PAGE_SIZE));logPage=Math.min(pages,Math.max(1,logPage));const start=(logPage-1)*LOG_PAGE_SIZE,visible=logs.slice(start,start+LOG_PAGE_SIZE);devLogs.innerHTML=visible.map(l=>{const state=/gagal/i.test(l.m)?'failed':/berhasil|dibuat|ditambahkan/i.test(l.m)?'success':'';return '<tr><td>'+new Date(l.t).toLocaleString('id-ID')+'</td><td><span class="log-event '+state+'">'+esc(l.m)+'</span></td></tr>';}).join('')||'<tr><td colspan="2" class="empty">Belum ada log</td></tr>';logCount.textContent=logs.length+' / '+LOG_LIMIT+' catatan';logRange.textContent=logs.length?'Menampilkan '+(start+1)+'–'+(start+visible.length)+' dari '+logs.length+' catatan':'Belum ada aktivitas';logPageInfo.textContent=logPage+' / '+pages;logPrev.disabled=logPage<=1;logNext.disabled=logPage>=pages;}
function changeLogPage(delta){logPage+=delta;renderActivityLogs();logViewport.scrollTop=0;}
function logEvent(m){try{const l=getLogs();l.unshift({t:new Date().toISOString(),m});localStorage.setItem('denny_logs',JSON.stringify(l.slice(0,LOG_LIMIT)));logPage=1;}catch(e){}}

/* ===== DEVELOPER ===== */
let activeDevView='overview';
function showDevView(view){if(!['overview','security','activity','members','advanced'].includes(view))return;activeDevView=view;document.querySelectorAll('.dev-view').forEach(panel=>panel.classList.toggle('active',panel.id==='dev-'+view));document.querySelectorAll('.dev-nav-btn').forEach(button=>{const selected=button.dataset.devView===view;button.classList.toggle('active',selected);button.setAttribute('aria-current',selected?'page':'false');});if(view==='activity')renderActivityLogs();if(view==='members'&&typeof loadAccountDirectory==='function')loadAccountDirectory();}

function renderDev(){const a=getAuth()||{roles:[]};let size=0;try{size=new Blob([JSON.stringify(localStorage)]).size;}catch(e){}
adminUsername.textContent=profileName(a);adminAvatar.innerHTML=profileAvatarHtml(getProfile(),a.username||'D');adminRoles.innerHTML=(a.roles||[]).map(role=>'<span>'+esc(roleCaption(role))+'</span>').join('');adminSince.textContent=a.created?'Akun dibuat '+new Date(a.created).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}):'Akun pribadi online';const login=getLogs().find(l=>l.m==='Login berhasil');adminLastLogin.textContent=login?'Login terakhir '+new Date(login.t).toLocaleString('id-ID'):'';const lastBackup=localStorage.getItem('denny_last_backup');devBackupTime.textContent=lastBackup?'Backup terakhir '+new Date(lastBackup).toLocaleString('id-ID'):'Belum ada backup yang tercatat di browser ini.';devSourceSummary.textContent=priceStatus.textContent;renderArchivedAssets();showDevView(activeDevView);devStats.innerHTML=[['ASET AKTIF',assets.filter(a=>!a.archived).length+' aset'],['RIWAYAT TRANSAKSI',transactions.length+' catatan'],['KARTU DIARSIPKAN',assets.filter(a=>a.archived).length+' aset'],['DATA AKUN',(size/1024).toFixed(1)+' KB']].map(x=>'<div class="card"><div class="label">'+x[0]+'</div><div class="metric" style="font-size:17px">'+x[1]+'</div></div>').join('');
devJson.value=JSON.stringify({transactions,assets},null,2);
devPrices.textContent=JSON.stringify({status:priceStatus.textContent,kursUsdIdr:usdIdr,sumberGoogleSheets:sheetUrlRaw()||DEFAULT_SHEET+' (default)',hargaDariGoogleSheets:sheetPrices,quotes},null,2);
renderActivityLogs();}
devTab.addEventListener('click',renderDev);
function validateFinancialData(raw) {
 const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
 const text=(v,n)=>typeof v==='string'&&v.length<=n;
 const nonempty=(v,n)=>text(v,n)&&v.trim().length>0;
 const finite=v=>typeof v==='number'&&Number.isFinite(v);
 const date=v=>text(v,10)&&/^\\d{4}-\\d{2}-\\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
 if(!object(raw)||!Array.isArray(raw.transactions)||!Array.isArray(raw.assets)||raw.transactions.length>20000||raw.assets.length>200)throw Error('Data portofolio tidak valid atau terlalu besar.');
 const assets=raw.assets.map(a=>{
  if(!object(a)||!nonempty(a.name,100)||!nonempty(a.unit,30)||!['stock','crypto','gold24','gold15','goldRetail'].includes(a.kind)||(a.quantity!==null&&(!finite(a.quantity)||a.quantity<0))||!text(a.symbol,30)||!finite(a.valueSnapshot)||a.valueSnapshot<0||(a.manualPrice!=null&&(!finite(a.manualPrice)||a.manualPrice<0)))throw Error('Aset tidak valid.');
  if(a.kind==='stock'&&(!/^[A-Z]{4}$/.test(a.name)||a.symbol!==a.name+'.JK'))throw Error('Kode saham tidak valid.');
  if(a.kind==='goldRetail'&&(a.unit!=='gram'||!/^XAU_RETAIL_(?:K(?:[2-9]|1[0-9]|2[0-3])|K24_99|K24_999)$/.test(a.symbol)))throw Error('Kadar emas tidak valid.');
  return {name:a.name,unit:a.unit,kind:a.kind,quantity:a.quantity,symbol:a.kind==='gold15'?'XAU':a.symbol,valueSnapshot:a.valueSnapshot,manualPrice:['gold15','goldRetail'].includes(a.kind)?null:a.manualPrice??null,archived:a.archived===true,company:text(a.company,150)?a.company:''};
 });
 const transactions=raw.transactions.map(t=>{
  if(!object(t)||!nonempty(t.id,100)||!date(t.date)||!['MASUK','KELUAR'].includes(t.type)||!finite(t.amount)||t.amount<=0||!nonempty(t.asset,100)||!text(t.description??'',500)||!text(t.platform??'',100))throw Error('Transaksi tidak valid.');
  const out={id:t.id,date:t.date,type:t.type,amount:t.amount,asset:t.asset,description:t.description||'',platform:t.platform||''};
  if(t.trade!==undefined){
   if(!['buy','sell'].includes(t.trade)||!finite(t.quantityDelta)||(t.trade==='buy'&&(t.quantityDelta<=0||t.type!=='MASUK'))||(t.trade==='sell'&&(t.quantityDelta>=0||t.type!=='KELUAR')))throw Error('Jumlah unit transaksi tidak valid.');
   out.trade=t.trade;out.quantityDelta=t.quantityDelta;
   if(t.trade==='sell'){
    if(!finite(t.costBasis)||t.costBasis<0||!finite(t.realizedPnl)||Math.abs(t.realizedPnl-(t.amount-t.costBasis))>.02)throw Error('Modal penjualan tidak valid.');
    out.costBasis=t.costBasis;out.realizedPnl=t.realizedPnl;
   }
  }
  return out;
 });
 if(new Set(transactions.map(t=>t.id)).size!==transactions.length)throw Error('ID transaksi berulang.');
 if(new Set(assets.map(a=>a.name)).size!==assets.length)throw Error('Nama aset berulang.');
 return {transactions,assets};
}
function validateStockMutations(state,previous={assets:[],transactions:[]}) {
 const oldAssets=new Map((previous.assets||[]).map(a=>[a.name,a]));
 const oldTransactions=new Map((previous.transactions||[]).map(t=>[t.id,t]));
 const stockNames=new Set([...state.assets,...previous.assets||[]].filter(a=>a.kind==='stock').map(a=>a.name));
 for(const a of state.assets){
  if(a.kind==='stock'&&a.quantity!==null&&!Number.isInteger(a.quantity)&&a.quantity!==oldAssets.get(a.name)?.quantity){
   const old=oldAssets.get(a.name),oldQty=Number(old?.quantity),added=state.transactions.filter(t=>t.asset===a.name&&!oldTransactions.has(t.id));
   // Only a sale may reduce a pre-existing fractional position.
   const sold=added.filter(t=>t.trade==='sell').reduce((n,t)=>n-t.quantityDelta,0);
   if(!old||Number.isInteger(oldQty)||a.quantity>=oldQty||added.some(t=>t.trade!=='sell')||Math.abs(oldQty-sold-a.quantity)>1e-8)throw Error('Jumlah saham harus dalam lembar utuh.');
  }
 }
 for(const t of state.transactions){
  if(!t.trade||!stockNames.has(t.asset)||Number.isInteger(t.quantityDelta))continue;
  const old=oldTransactions.get(t.id);
  if(old&&JSON.stringify(old)===JSON.stringify(t))continue;
  const held=oldAssets.get(t.asset)?.quantity;
  if(t.trade==='sell'&&typeof held==='number'&&!Number.isInteger(held)&&Math.abs(held+t.quantityDelta)<1e-8)continue;
  throw Error('Jumlah saham harus dalam lembar utuh.');
 }
}
function validateLedgerMutations(state,previous={transactions:[],assets:[]}) {
 const key=s=>({'EMAS FISIK K24 (9 (5 G))':'EMAS K24','EMAS FISIK K15 (10G)':'EMAS K15'}[s]||s);
 const capital=(rows,name)=>rows.filter(t=>key(t.asset)===key(name)).reduce((n,t)=>n+(t.trade==='sell'?-Number(t.costBasis||0):t.type==='MASUK'?Number(t.amount):-Number(t.amount)),0);
 for(const a of state.assets){
  const now=capital(state.transactions,a.name),old=capital(previous.transactions||[],a.name);
  if(now<-.02&&now<old-.02)throw Error('Modal aset menjadi negatif. Periksa transaksi pembelian dan penjualan terkait.');
 }
 const remaining=new Map(state.transactions.map(t=>[t.id,t]));
 for(const old of previous.transactions||[]){
  if(old.trade||old.type!=='MASUK')continue;
  const current=remaining.get(old.id),changed=!current||current.amount!==old.amount||current.asset!==old.asset||current.type!==old.type;
  if(changed&&state.transactions.some(t=>t.trade==='sell'&&key(t.asset)===key(old.asset)&&(previous.transactions||[]).some(p=>p.id===t.id)))throw Error('Pembelian lama masih menjadi dasar modal penjualan. Hapus penjualan terkait terlebih dahulu.');
 }
}
function importState(d){
 if(d.schemaVersion!==undefined&&d.schemaVersion!==2)throw Error('Versi backup belum didukung.');
 const finance=validateFinancialData(d),current=cloudState();
 const next={...finance,profile:d.profile===undefined?getProfile():safeProfile(d.profile),logs:d.logs===undefined?current.logs:(Array.isArray(d.logs)?d.logs:[]).filter(l=>l&&typeof l.m==='string'&&l.m.length<=500&&typeof l.t==='string'&&Number.isFinite(Date.parse(l.t))).slice(0,60),sheetUrl:d.sheetUrl===undefined?current.sheetUrl:d.sheetUrl,lastBackup:d.lastBackup===undefined?current.lastBackup:d.lastBackup};
 if(typeof next.sheetUrl!=='string'||next.sheetUrl.length>1500||typeof next.lastBackup!=='string'||next.lastBackup.length>60)throw Error('Pengaturan backup tidak valid.');
 validateStockMutations(next,current);validateLedgerMutations(next,current);
 if(JSON.stringify(next).length>1900000)throw Error('Data melebihi batas penyimpanan akun.');
 return next;
}
function validData(d){try{importState(d);return true;}catch{return false;}}
async function applyData(d,label){
 let next;try{next=importState(d);}catch(error){alert('Backup ditolak: '+error.message);return false;}
 if(!confirm('Ganti data portofolio dengan backup ini?'))return false;
 if(cloudSaving||cloudConflict){alert('Tunggu penyimpanan selesai atau muat ulang sebelum mengimpor. Data saat ini tetap dipertahankan.');return false;}
 if(cloudDirty){await cloudSave();if(cloudDirty){alert('Perubahan saat ini belum tersimpan. Impor dibatalkan.');return false;}}
 if(cloudBoot?.user&&!cloudBoot?.demo){
  try{const response=await cloudNativeFetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:cloudRevision,state:next})});const result=await response.json();if(!response.ok)throw Error(result.error||'Backup belum dapat disimpan.');cloudRevision=result.revision;}catch(error){alert('Impor dibatalkan: '+error.message+' Data sebelumnya tetap dipertahankan.');return false;}
 }
 clearTimeout(cloudSaveTimer);const wasReady=cloudReady;cloudReady=false;
 transactions=next.transactions;assets=next.assets;normalizeAutomaticK15();save();
 localStorage.setItem('denny_profile_v1',JSON.stringify(next.profile));localStorage.setItem('denny_logs',JSON.stringify(next.logs));localStorage.setItem('denny_sheet_url',next.sheetUrl);localStorage.setItem('denny_last_backup',next.lastBackup);sheetUrlInput.value=next.sheetUrl;
 if(d.settings&&typeof d.settings.balancesHidden==='boolean'){balancesHidden=d.settings.balancesHidden;localStorage.setItem('sidaps_hide_balances_v1',balancesHidden?'1':'0');}
 if(d.settings&&['system','light','dark'].includes(d.settings.appearance)){try{cloudDeviceStorage?.setItem('sidaps_appearance_v1',d.settings.appearance);window.dispatchEvent(new Event('sidaps-appearance-change'));}catch{}}
 cloudReady=wasReady;render();renderUserIdentity();logEvent(label);renderDev();return true;
}
async function devApply(){try{await applyData(JSON.parse(devJson.value),'Data diubah lewat editor JSON');}catch(e){alert('JSON tidak valid: '+e.message);}}
function accountBackup(){const state=cloudState();let appearance='system';try{appearance=cloudDeviceStorage?.getItem('sidaps_appearance_v1')||'system';}catch{}return {format:'sidaps-portfolio',schemaVersion:2,exported:new Date().toISOString(),...state,transactions,assets,profile:getProfile(),settings:{balancesHidden,appearance}};}
function devExport(){const blob=new Blob([JSON.stringify(accountBackup(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sidaps-backup-'+localDate()+'.json';a.click();URL.revokeObjectURL(a.href);localStorage.setItem('denny_last_backup',new Date().toISOString());logEvent('Backup diunduh');renderDev();}
devImport.onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>2000000)throw Error('File terlalu besar.');await applyData(JSON.parse(await f.text()),'Data diimpor dari '+f.name);}catch(x){alert('File tidak valid: '+x.message);}e.target.value='';};
function devClearCache(){logEvent('Pembaruan harga diminta; harga terakhir dipertahankan');refreshPrices().then(renderDev);}
function devChangePw(e){e.preventDefault();alert('Login dikelola melalui akun ChatGPT.');}
function devNewRecovery(){alert('Pemulihan login dikelola melalui akun ChatGPT.');}
function devResetData(){if(!confirm('Reset semua transaksi dan pengaturan aset ke data bawaan?'))return;transactions=JSON.parse(JSON.stringify(initialTx));assets=JSON.parse(JSON.stringify(initialAssets));save();render();logEvent('Data direset ke bawaan');renderDev();}
function devDeleteAccount(){alert('Hubungi pemilik situs untuk penghapusan akun online.');}
/* ===== ANIMASI LOGIN ===== */
(function(){return; // Minimal login intentionally has no background animation.
if(matchMedia('(max-width:760px), (pointer:coarse), (prefers-reduced-motion:reduce)').matches)return;
const cv=authCanvas,ctx=cv.getContext('2d'),CW=28,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let W=0,H=0,candles=[],off=0,price=100,t0=0,run=false;
function size(){const d=Math.min(window.devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0);}
function nc(){const o=price,c=o+(Math.random()-.5)*9+(100-o)*.035,hi=Math.max(o,c)+Math.random()*4,lo=Math.min(o,c)-Math.random()*4;price=c;return{o,c,hi,lo};}
function seed(){candles=[];price=100;for(let i=0;i<Math.ceil(W/CW)+4;i++)candles.push(nc());}
function draw(){ctx.clearRect(0,0,W,H);
ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=1;for(let y=H*.12;y<H;y+=64){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}for(let x=-off;x<W;x+=CW*4){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
let mn=1e9,mx=-1e9;candles.forEach(c=>{mn=Math.min(mn,c.lo);mx=Math.max(mx,c.hi);});const Y=v=>H*.8-(v-mn)/((mx-mn)||1)*H*.5;
candles.forEach((c,i)=>{const x=i*CW-off+CW/2,up=c.c>=c.o,col=up?'#22e39b':'#ff5c7a';ctx.globalAlpha=.5;ctx.strokeStyle=col;ctx.fillStyle=col;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,Y(c.hi));ctx.lineTo(x,Y(c.lo));ctx.stroke();const top=Y(Math.max(c.o,c.c)),h=Math.max(3,Math.abs(Y(c.o)-Y(c.c)));ctx.fillRect(x-7,top,14,h);});
ctx.globalAlpha=1;ctx.beginPath();candles.forEach((c,i)=>{const x=i*CW-off+CW/2;i?ctx.lineTo(x,Y(c.c)):ctx.moveTo(x,Y(c.c));});
const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'#ead9ae');g.addColorStop(.5,'#d2ac60');g.addColorStop(1,'#c39370');ctx.strokeStyle=g;ctx.lineWidth=3;ctx.shadowColor='#d2ac60';ctx.shadowBlur=16;ctx.stroke();ctx.shadowBlur=0;
ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();const ag=ctx.createLinearGradient(0,H*.3,0,H);ag.addColorStop(0,'rgba(210,172,96,.22)');ag.addColorStop(1,'rgba(210,172,96,0)');ctx.fillStyle=ag;ctx.fill();
const last=candles[candles.length-2],lx=(candles.length-2)*CW-off+CW/2,ly=Y(last.c),pr=6+3*Math.sin(Date.now()/250);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(lx,ly,4,0,7);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(lx,ly,pr+4,0,7);ctx.stroke();}
function frame(ts){if(!run)return;requestAnimationFrame(frame);const dt=Math.min(ts-(t0||ts),50);t0=ts;off+=dt*.035;while(off>=CW){off-=CW;candles.shift();candles.push(nc());}draw();}
function start(){if(run)return;size();if(!candles.length)seed();run=true;t0=0;if(reduce){draw();run=false;return;}requestAnimationFrame(frame);}
function stop(){run=false;}
addEventListener('resize',()=>{if(run){size();seed();}});
new MutationObserver(()=>authBack.classList.contains('show')?start():stop()).observe(authBack,{attributes:true,attributeFilter:['class']});
/* koin melayang */
const set=[['₿','#f7931a','#ffd27a'],['Ξ','#627eea','#b3c0ff'],['$','#16c784','#7ff3c8'],['◎','#9945ff','#14f195'],['Rp','#e0a800','#ffe58f'],['▲','#ec4899','#ffa6d6'],['Ł','#345d9d','#8fb4f0'],['Ð','#c2a633','#fff0a0']];
let html='';for(let i=0;i<16;i++){const c=set[i%set.length],s=34+Math.round(Math.random()*34),x=Math.round(Math.random()*94),d=14+Math.round(Math.random()*14),dl=-Math.round(Math.random()*d);html+='<span class="coin" style="--x:'+x+'%;--s:'+s+'px;--d:'+d+'s;--dl:'+dl+'s;--c1:'+c[1]+';--c2:'+c[2]+'"><i>'+c[0]+'</i></span>';}
authCoins.innerHTML=html;
/* Information board replaces the decorative symbol tickers. */

})();
let directoryState={page:1,pages:1,count:0,rows:[],sequence:0,search:''};
let supportTarget=null;
function directoryIsOwner(){return !!getAuth()?.roles?.includes('admin');}
function mountAccountDirectory(){
 const root=document.getElementById('accountDirectoryRoot');if(!root||root.dataset.mounted)return;
 root.dataset.mounted='true';
 root.innerHTML=\`<form id="directorySearchForm" class="account-directory-toolbar"><input id="directorySearch" type="search" maxlength="150" placeholder="Cari nama atau email terdaftar" aria-label="Cari akun"><button class="btn primary" type="submit">Cari akun</button><button class="btn soft" type="button" onclick="loadAccountDirectory(directoryState.page)">↻ Muat ulang</button><button class="btn soft" type="button" id="directoryExport" onclick="exportDirectoryPage()" disabled>Unduh halaman CSV</button></form><p id="directoryMessage" class="account-directory-meta" role="status" aria-live="polite"></p><div class="tablewrap account-directory-table"><table><thead><tr><th>Nama & email</th><th>Peran akun</th><th>Terdaftar / terakhir aktif</th><th>Bantuan akun</th><th>Tindakan</th></tr></thead><tbody id="directoryRows"></tbody></table></div><div class="directory-pagination"><button class="btn soft" type="button" id="directoryPrevious" onclick="loadAccountDirectory(directoryState.page-1)">← Sebelumnya</button><span id="directoryPageInfo"></span><button class="btn soft" type="button" id="directoryNext" onclick="loadAccountDirectory(directoryState.page+1)">Berikutnya →</button></div><div class="directory-help"><h4>Pemulihan login & akun baru</h4><p>Login website menggunakan ChatGPT. Pemilik situs tidak menyimpan, melihat, atau mereset password ChatGPT/Google pengguna.</p><p>Untuk login dengan Google, pemulihan dilakukan oleh pemilik email melalui <a href="https://accounts.google.com/signin/recovery" target="_blank" rel="noopener">pemulihan akun Google</a>. Untuk login memakai password ChatGPT, ikuti <a href="https://help.openai.com/en/articles/4936828-resetting-or-changing-your-chatgpt-password" target="_blank" rel="noopener">panduan pemulihan ChatGPT</a>.</p><p>Jika pengguna memilih akun baru, ia masuk melalui tombol Masuk / Daftar dengan identitas barunya. Portofolio baru dimulai kosong; data akun lama tetap berada pada pemilik akun lama. Catat proses bantuannya melalui tombol Catat bantuan.</p></div>\`;
 document.getElementById('directorySearchForm').onsubmit=e=>{e.preventDefault();directoryState.search=document.getElementById('directorySearch').value.trim();loadAccountDirectory(1);};
 const help=root.querySelector('.directory-help');if(help)help.innerHTML='<h4>Pemulihan login & akun baru</h4><p>Sandi website disimpan sebagai hash dan tidak dapat dilihat admin. Jika lupa, pengguna memilih <b>Lupa sandi?</b> untuk meminta OTP ke email terdaftar. Pengiriman OTP memerlukan layanan email yang sudah diaktifkan pengelola.</p><p>OTP berlaku 10 menit. Pengguna memasukkan OTP dan sandi baru sendiri; jangan meminta pengguna membagikan OTP kepada admin. Kode pemulihan lama tetap tersedia sebagai cadangan. Untuk Gmail, pengguna juga dapat melanjutkan dengan Google menggunakan email yang sama.</p><p>Admin hanya mencatat bantuan, tanpa mengakses portofolio atau mengganti sandi pengguna. Akun baru dimulai kosong; data akun lama tidak dipindahkan atau dihapus.</p>';
}
function directoryDate(value){if(!value)return 'Belum tercatat';const date=new Date(value);return Number.isFinite(date.getTime())?date.toLocaleString('id-ID',{timeZone:'Asia/Jakarta',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})+' WIB':'Belum tercatat';}
async function loadAccountDirectory(page=directoryState.page){
 if(!directoryIsOwner())return;mountAccountDirectory();const message=document.getElementById('directoryMessage');if(!message)return;
 const sequence=++directoryState.sequence;message.textContent='Memuat daftar akun…';
 try{const response=await cloudNativeFetch('/api/admin/accounts?page='+Math.max(1,page)+'&q='+encodeURIComponent(directoryState.search),{cache:'no-store'});const data=await response.json();if(sequence!==directoryState.sequence)return;if(!response.ok)throw Error(data.error||'Daftar belum tersedia');directoryState={...directoryState,page:data.page,pages:data.pages,count:data.count,rows:data.accounts||[]};renderAccountDirectory();}
 catch(error){if(sequence!==directoryState.sequence)return;message.textContent=error.message;}
}
function renderAccountDirectory(){
 const d=directoryState;document.getElementById('directoryMessage').textContent=d.count+' akun'+(d.search?' sesuai pencarian':' terdaftar')+' · hanya informasi akun; transaksi pengguna tidak ditampilkan.';
 document.getElementById('directoryRows').innerHTML=d.rows.map((a,i)=>{const status={none:'Belum ada permintaan',open:'Perlu bantuan',resolved:'Selesai'}[a.supportStatus]||'Belum ada permintaan';return '<tr><td><span class="account-name">'+esc(a.displayName||'Anggota')+'</span><small>'+esc(a.email)+'</small></td><td>'+(a.roles||['member']).map(role=>'<span class="directory-role">'+esc(roleCaption(role))+'</span>').join('')+'</td><td>'+esc(directoryDate(a.createdAt))+'<small>Aktif: '+esc(directoryDate(a.lastSeenAt))+'</small></td><td><span class="directory-state '+(a.supportStatus==='open'?'open':a.supportStatus==='resolved'?'resolved':'')+'">'+status+'</span>'+(a.supportNote?'<small>'+esc(a.supportNote)+'</small>':'')+'</td><td><div class="directory-actions"><button type="button" class="btn soft" onclick="openMemberSupport('+i+')">Catat bantuan</button><button type="button" class="btn soft" onclick="copyMemberEmail('+i+')">Salin email</button></div></td></tr>';}).join('')||'<tr><td colspan="5" class="empty">Tidak ada akun yang sesuai.</td></tr>';
 document.getElementById('directoryPageInfo').textContent='Halaman '+d.page+' / '+d.pages;
 document.getElementById('directoryPrevious').disabled=d.page<=1;document.getElementById('directoryNext').disabled=d.page>=d.pages;document.getElementById('directoryExport').disabled=!d.rows.length;
}
async function copyMemberEmail(i){const row=directoryState.rows[i];if(!directoryIsOwner()||!row)return;try{await navigator.clipboard.writeText(row.email);document.getElementById('directoryMessage').textContent='Email disalin: '+row.email;}catch{document.getElementById('directoryMessage').textContent='Salin email secara manual dari tabel: '+row.email;}}
function exportDirectoryPage(){if(!directoryIsOwner())return;const rows=[['Nama','Email','Peran','Terdaftar','Terakhir aktif','Status bantuan','Catatan'],...directoryState.rows.map(a=>[a.displayName,a.email,a.roles.map(roleCaption).join(' / '),a.createdAt,a.lastSeenAt||'',a.supportStatus,a.supportNote||''])];const cell=value=>{let text=String(value??'');if(/^[=+@\\-\\t\\r]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};const blob=new Blob(['\\ufeff'+rows.map(row=>row.map(cell).join(',')).join('\\r\\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='daftar-anggota-halaman-'+directoryState.page+'.csv';link.click();URL.revokeObjectURL(url);}
function mountMemberSupport(){if(document.getElementById('memberSupportModal'))return;const el=document.createElement('div');el.id='memberSupportModal';el.className='modalback';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','memberSupportTitle');el.innerHTML=\`<div class="modal account-support-dialog"><h3 id="memberSupportTitle">Catatan bantuan akun</h3><p id="memberSupportEmail" class="account-support-email"></p><form id="memberSupportForm"><div class="field"><label for="memberSupportStatus">STATUS BANTUAN</label><select id="memberSupportStatus"><option value="none">Belum ada permintaan</option><option value="open">Perlu bantuan</option><option value="resolved">Selesai</option></select></div><div class="field" style="margin-top:16px"><label for="memberSupportNote">CATATAN ADMIN (MAKSIMAL 600 KARAKTER)</label><textarea id="memberSupportNote" maxlength="600" placeholder="Contoh: Pengguna lupa login; diarahkan ke pemulihan Google. Jangan masukkan password atau OTP."></textarea></div><p class="account-support-hint">Catatan ini hanya untuk bantuan akun. Tidak mengubah email, hak akses, password, ataupun transaksi pengguna.</p><p id="memberSupportMessage" class="profile-message" role="status"></p><div class="modalactions"><button type="button" class="btn soft" onclick="closeMemberSupport()">Batal</button><button type="submit" class="btn primary" id="memberSupportSave">Simpan catatan</button></div></form></div>\`;document.body.appendChild(el);document.getElementById('memberSupportForm').onsubmit=saveMemberSupport;}
function openMemberSupport(i){if(!directoryIsOwner()||!directoryState.rows[i])return;mountMemberSupport();supportTarget={...directoryState.rows[i]};document.getElementById('memberSupportEmail').textContent=(supportTarget.displayName||'Anggota')+' · '+supportTarget.email;document.getElementById('memberSupportStatus').value=supportTarget.supportStatus||'none';document.getElementById('memberSupportNote').value=supportTarget.supportNote||'';document.getElementById('memberSupportMessage').textContent='';document.getElementById('memberSupportModal').classList.add('show');document.getElementById('memberSupportNote').focus();}
function closeMemberSupport(){document.getElementById('memberSupportModal')?.classList.remove('show');supportTarget=null;}
async function saveMemberSupport(e){e.preventDefault();if(!supportTarget||!directoryIsOwner())return;const button=document.getElementById('memberSupportSave');button.disabled=true;try{const response=await cloudNativeFetch('/api/admin/accounts',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:supportTarget.id,status:document.getElementById('memberSupportStatus').value,note:document.getElementById('memberSupportNote').value})}),data=await response.json();if(!response.ok)throw Error(data.error||'Catatan belum tersimpan');logEvent('Catatan bantuan akun diperbarui');closeMemberSupport();loadAccountDirectory(directoryState.page);}catch(error){document.getElementById('memberSupportMessage').textContent=error.message;}finally{button.disabled=false;}}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('memberSupportModal')?.classList.contains('show'))closeMemberSupport();});

let emailAuthMode='login';
function emailPasswordEye(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/><path class="eye-slash" d="m3 3 18 18"/></svg>';}
function cloudAuthSetMode(mode){emailAuthMode=mode;authBack.setAttribute('data-auth-mode',mode);const register=mode==='register',recover=mode==='recover';const security=document.getElementById('registerSecurityNote');if(security)security.hidden=!register;authTitle.textContent=register?'Buat akun pribadi':recover?'Pulihkan sandi':'Selamat datang';authSub.textContent=register?'Daftar dengan email dan password khusus website ini.':recover?'Gunakan email dan kode pemulihan yang kamu simpan.':'Masuk untuk melanjutkan catatan investasimu.';document.getElementById('emailNameField').hidden=!register;document.getElementById('emailName').required=register;document.getElementById('emailRecoveryField').hidden=!recover;document.getElementById('emailRecovery').required=recover;document.getElementById('emailConfirmField').hidden=mode==='login';document.getElementById('emailConfirm').required=mode!=='login';document.getElementById('emailPassword').autocomplete=mode==='login'?'current-password':'new-password';document.getElementById('emailPassword').minLength=mode==='login'?1:8;document.getElementById('emailPassword').value='';document.getElementById('emailConfirm').value='';document.getElementById('emailRecovery').value='';document.getElementById('emailSubmit').textContent=register?'Buat akun':recover?'Simpan password baru':'Masuk';document.getElementById('emailAuthMessage').textContent='';hideAllPasswords();}
async function emailAuthRequest(action,body){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{const response=await cloudNativeFetch('/api/auth/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal});let data;try{data=await response.json();}catch{throw Error('Server belum merespons dengan benar. Silakan coba lagi.');}if(!response.ok)throw Error(data.error||'Permintaan belum berhasil.');return data;}catch(error){if(controller.signal.aborted)throw Error('Koneksi terlalu lama. Periksa internet, lalu coba lagi.');throw error;}finally{clearTimeout(timeout);}}
document.getElementById('emailAuthForm').onsubmit=async e=>{e.preventDefault();const button=document.getElementById('emailSubmit'),message=document.getElementById('emailAuthMessage');button.disabled=true;message.textContent='Memproses…';try{const body={email:document.getElementById('emailAddress').value,displayName:document.getElementById('emailName').value,password:document.getElementById('emailPassword').value,confirm:document.getElementById('emailConfirm').value,recoveryCode:document.getElementById('emailRecovery').value};await emailAuthRequest(emailAuthMode==='register'?'register':emailAuthMode==='recover'?'recover':'login',body);document.getElementById('emailPassword').value='';document.getElementById('emailConfirm').value='';document.getElementById('emailRecovery').value='';message.textContent='';location.reload();}catch(error){message.textContent=error.message;}finally{button.disabled=false;}};
function updateCloudPasswordForm(){const user=getAuth();if(!user)return;const platform=(user.authMethod==='platform'||(user.authMethod==='google'&&!user.hasPassword));document.getElementById('cloudOldPasswordField').hidden=platform;document.getElementById('cloudOldPassword').required=!platform;document.getElementById('cloudPasswordIntro').textContent=platform?'Identitas akunmu sudah terverifikasi. Buat password website untuk email '+(user.email||user.username)+'. Data portofolio tetap terhubung ke akun yang sama.':'Ubah password website untuk '+(user.email||user.username)+'. Password Google/Gmail kamu tidak berubah.';document.getElementById('cloudPasswordSave').textContent=platform?'Aktifkan / perbarui password website':'Ubah password website';}
document.getElementById('cloudPasswordForm').onsubmit=async e=>{e.preventDefault();const button=document.getElementById('cloudPasswordSave'),message=document.getElementById('cloudPasswordMessage');button.disabled=true;message.textContent='Menyimpan…';try{const data=await emailAuthRequest((getAuth()?.authMethod==='platform'||(getAuth()?.authMethod==='google'&&!getAuth()?.hasPassword))?'activate':'change-password',{oldPassword:document.getElementById('cloudOldPassword').value,password:document.getElementById('cloudNewPassword').value,confirm:document.getElementById('cloudConfirmPassword').value});document.getElementById('cloudPasswordForm').reset();hideAllPasswords();message.textContent=data.message||'Kata sandi berhasil diperbarui.';}catch(error){message.textContent=error.message;}finally{button.disabled=false;}};
updateCloudPasswordForm();

const FIREBASE_WEB_CONFIG={"apiKey":"AIzaSyBoiv_DYguZua_-0Ls43mEqYAMXsVDWmcg","authDomain":"sidaps-portfolio.firebaseapp.com","projectId":"sidaps-portfolio","storageBucket":"sidaps-portfolio.firebasestorage.app","messagingSenderId":"810538821573","appId":"1:810538821573:web:0fb00cdb12304c54d94dac"};
function correctGoogleLoginOrigin(){if(location.hostname!=='sidaps-portfolio.sidaps.workers.dev.')return false;const url=new URL(location.href);url.hostname='sidaps-portfolio.sidaps.workers.dev';location.replace(url.href);return true;}
// Domain failures can outlive an authorization change in an already-open SDK instance.
async function showGoogleDomainRecovery(message){
 let allowed=false;
 try{const response=await cloudNativeFetch('https://identitytoolkit.googleapis.com/v1/projects?key='+encodeURIComponent(FIREBASE_WEB_CONFIG.apiKey),{signal:AbortSignal.timeout(5000)});if(response.ok){const config=await response.json();allowed=Array.isArray(config.authorizedDomains)&&config.authorizedDomains.includes(location.hostname);}}catch{}
 message.textContent=allowed?'Izin login untuk alamat ini sudah aktif. Muat ulang halaman, lalu pilih akun Google kembali.':'Login Google belum tersedia pada alamat ini. Buka alamat resmi Sidaps untuk melanjutkan.';
 message.setAttribute('data-state','error');const help=document.getElementById('googleAuthHelp');if(help)help.hidden=false;
}\r

let firebaseGoogleReady=null,firebaseGoogleSdk=null;
async function prepareGoogleSignIn(){
 if(correctGoogleLoginOrigin())return null;
 if(firebaseGoogleReady)return firebaseGoogleReady;
 const button=document.getElementById('googleSignInButton'),message=document.getElementById('googleAuthMessage');button.disabled=true;
 firebaseGoogleReady=(async()=>{
  const [appSdk,authSdk]=await Promise.all([import('https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js')]);
  const app=appSdk.getApps().find(a=>a.name==='sidaps-google')||appSdk.initializeApp(FIREBASE_WEB_CONFIG,'sidaps-google'),auth=authSdk.getAuth(app);
  await authSdk.setPersistence(auth,authSdk.inMemoryPersistence);auth.languageCode='id';
  const provider=new authSdk.GoogleAuthProvider(); // Let Google reuse its current account; do not force the chooser on every login.
  firebaseGoogleSdk={authSdk,auth,provider};button.disabled=false;document.getElementById('googleSignInText').textContent='Lanjutkan dengan Google';message.textContent='';return firebaseGoogleSdk;
 })().catch(()=>{firebaseGoogleReady=null;button.disabled=false;document.getElementById('googleSignInText').textContent='Coba muat login Google';message.textContent='Login Google belum dapat dimuat. Email/password tetap bisa digunakan.';return null;});
 return firebaseGoogleReady;
}
async function googleSignIn(){
 if(correctGoogleLoginOrigin())return;
 const button=document.getElementById('googleSignInButton'),message=document.getElementById('googleAuthMessage');
 if(!firebaseGoogleSdk){await prepareGoogleSignIn();if(firebaseGoogleSdk)message.textContent='Google siap. Tekan Lanjutkan dengan Google.';return;}
 if(button.disabled)return;
 const help=document.getElementById('googleAuthHelp');if(help)help.hidden=true;
 button.disabled=true;message.setAttribute('data-state','busy');message.textContent='Pilih akun pada jendela Google…';
 try{const {authSdk,auth,provider}=firebaseGoogleSdk,result=await authSdk.signInWithPopup(auth,provider);message.textContent='Menghubungkan akun…';const idToken=await result.user.getIdToken();await emailAuthRequest('google',{idToken});authSdk.signOut(auth).catch(()=>{});location.reload();}
 catch(error){const messages={'auth/popup-closed-by-user':'Login Google dibatalkan.','auth/cancelled-popup-request':'Jendela login sebelumnya dibatalkan.','auth/popup-blocked':'Browser memblokir jendela Google. Izinkan popup untuk website ini lalu coba lagi.','auth/unauthorized-domain':'Domain website belum diizinkan untuk login Google.','auth/network-request-failed':'Koneksi ke Google terputus. Periksa internet, lalu coba lagi.'};message.setAttribute('data-state','error');if(error.code==='auth/unauthorized-domain')await showGoogleDomainRecovery(message);else message.textContent=messages[error.code]||'Login Google belum berhasil. Silakan coba lagi.';try{firebaseGoogleSdk.authSdk.signOut(firebaseGoogleSdk.auth).catch(()=>{});}catch{}}
 finally{button.disabled=false;}
}
if(!getAuth())prepareGoogleSignIn();

/* ===== INIT HOSTED ACCOUNT ===== */
cloudReady=true;
if(getAuth()){enterApp();cloudSetSyncStatus('Tersinkron ke akun pribadi','ok');}else{authBack.classList.add('show');cloudAuthSetMode('login');authForm.style.display='none';authAlt.style.display='none';authCodeBox.style.display='none';}
if(getAuth()?.roles.includes('admin'))cloudNativeFetch('/api/admin/accounts').then(r=>r.ok?r.json():null).then(d=>{if(d)cloudAccountCount.textContent=d.count+' akun terdaftar';}).catch(()=>{});
</script>`;
