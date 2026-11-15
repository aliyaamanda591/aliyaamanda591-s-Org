export const portfolioCoreStateScriptHtml = `<script>
const cloudBoot=/*__CLOUD_BOOTSTRAP__*/null;
const cloudNativeFetch=window.fetch.bind(window);
let cloudRevision=cloudBoot?.revision||0,cloudReady=false,cloudSaveTimer=null,cloudSaving=false,cloudDirty=false,cloudConflict=false;
const cloudMemory=new Map();
const cloudDeviceStorage=(()=>{try{return window.localStorage;}catch{return null;}})();
const cloudPrivacyStorageKey='sidaps_hide_balances_v1:'+(cloudBoot?.user?.id||'guest');
const cloudPriceStorageKey='sidaps_last_quotes_v1:'+(cloudBoot?.user?.id||'guest');
const cloudDeviceKey=key=>key==='sidaps_hide_balances_v1'?cloudPrivacyStorageKey:key==='denny_price_cache_v3'?cloudPriceStorageKey:null;
const cloudKeyFields={'denny_transactions_v2':'transactions','denny_assets_v2':'assets','denny_profile_v1':'profile','denny_logs':'logs','denny_sheet_url':'sheetUrl','denny_last_backup':'lastBackup'};
for(const [key,field]of Object.entries(cloudKeyFields)){const value=cloudBoot?.state?.[field];if(value!==undefined&&value!==null)cloudMemory.set(key,['sheetUrl','lastBackup'].includes(field)?String(value):JSON.stringify(value));}
const localStorage={getItem(key){const deviceKey=cloudDeviceKey(key);if(deviceKey){try{return cloudDeviceStorage?.getItem(deviceKey)??cloudMemory.get(key)??null;}catch{return cloudMemory.get(key)??null;}}return cloudMemory.get(key)??null;},setItem(key,value){cloudMemory.set(key,String(value));const deviceKey=cloudDeviceKey(key);if(deviceKey){try{cloudDeviceStorage?.setItem(deviceKey,String(value));}catch{}return;}if(cloudReady&&cloudBoot?.user&&cloudKeyFields[key]){cloudDirty=true;clearTimeout(cloudSaveTimer);cloudSaveTimer=setTimeout(cloudSave,300);}},removeItem(key){cloudMemory.delete(key);const deviceKey=cloudDeviceKey(key);if(deviceKey){try{cloudDeviceStorage?.removeItem(deviceKey);}catch{}}},toJSON(){return Object.fromEntries(cloudMemory);}};
function cloudSetSyncStatus(message,state=''){const el=document.getElementById('cloudSyncStatus');if(el){el.textContent=message;el.className='cloud-sync '+state;}}
function cloudState(){const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{return fallback;}};return {transactions:read('denny_transactions_v2',[]),assets:read('denny_assets_v2',[]),profile:read('denny_profile_v1',{}),logs:read('denny_logs',[]),sheetUrl:localStorage.getItem('denny_sheet_url')||'',lastBackup:localStorage.getItem('denny_last_backup')||''};}
async function cloudSave(){if(!cloudBoot?.user||cloudConflict||cloudSaving||!cloudDirty)return;cloudSaving=true;cloudDirty=false;cloudSetSyncStatus('Menyimpan perubahan…');try{const response=await cloudNativeFetch('/api/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({revision:cloudRevision,state:cloudState()})});const result=await response.json();if(!response.ok){if(response.status===409)cloudConflict=true;throw Error(result.error||'Data belum tersimpan');}cloudRevision=result.revision;cloudSetSyncStatus('Tersimpan di akun pribadi','ok');}catch(error){cloudDirty=true;cloudSetSyncStatus(error.message+' · Unduh backup sebelum menutup halaman.','error');}finally{cloudSaving=false;if(cloudDirty&&!cloudConflict)cloudSaveTimer=setTimeout(cloudSave,15000);}}
async function cloudFlushBeforeLogout(){clearTimeout(cloudSaveTimer);if(cloudSaving){cloudSetSyncStatus('Tunggu penyimpanan selesai sebelum keluar.');return;}if(cloudDirty)await cloudSave();if(cloudDirty){cloudSetSyncStatus('Perubahan belum tersimpan. Unduh backup sebelum keluar.','error');return;}try{const response=await cloudNativeFetch('/api/auth/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});const data=await response.json();if(!response.ok)throw Error();location.href=data.redirect||'/';}catch{cloudSetSyncStatus('Belum dapat keluar. Coba lagi.','error');}}
window.addEventListener('beforeunload',e=>{if(cloudDirty||cloudSaving){e.preventDefault();e.returnValue='';}});
const fetch=(input,options)=>{const url=String(input);let target=null;if(url==='https://indodax.com/api/tickers')target='/api/prices/crypto';else if(url==='https://indodax.com/api/pairs')target='/api/prices/crypto-pairs';else if(url.includes('scanner.tradingview.com/indonesia/scan'))target='/api/prices/stocks';else if(url.includes('api.coingecko.com/')){const ids=new URL(url).searchParams.get('ids')||'bitcoin';target='/api/prices/coins?ids='+encodeURIComponent(ids);}else if(url.includes('api.gold-api.com/'))target='/api/prices/gold';else if(url.includes('open.er-api.com/'))target='/api/prices/fx';else if(url.includes('rajaemas.id/api/proxy/prices'))target='/api/prices/gold15';else if(url.includes('finance.yahoo.com/v8/finance/chart/')){const m=url.match(/chart\\/([A-Z]{4}\\.JK)/);if(m)target='/api/prices/yahoo?symbol='+m[1];}return cloudNativeFetch(target||input,options);};

const initialTx=[];
const initialAssets=[];
let transactions=JSON.parse(localStorage.getItem('denny_transactions_v2')||'null');
if(!transactions)transactions=JSON.parse(JSON.stringify(initialTx));
let assets=JSON.parse(localStorage.getItem('denny_assets_v2')||'null');
if(!assets)assets=JSON.parse(JSON.stringify(initialAssets));
else assets=assets.map(old=>{const base=initialAssets.find(a=>a.name===old.name||old.name.startsWith(a.name));return base?{...base,...old,name:base.name}:old;});
function normalizeAutomaticK15(){assets.forEach(a=>{if(a.kind==='gold15'||a.name==='EMAS K15'){a.kind='gold15';a.symbol='XAU';a.manualPrice=null;a.pricingMode='market';}});}
normalizeAutomaticK15();
const aliases={'EMAS FISIK K24 (9 (5 G))':'EMAS K24','EMAS FISIK K15 (10G)':'EMAS K15','EMAS K24':'EMAS K24','EMAS K15':'EMAS K15'};
const key=s=>aliases[s]||s;
let quotes={},usdIdr=null,editing=null;
const PRICE_CACHE_KEY='denny_price_cache_v3';
let quoteMeta={},fxMeta=null,refreshJob=null,priceFailures=new Set(),priceLoading=false;
const REFRESH_INTERVAL_MS=5*60*1000;
let lastRefreshAt=0,closedStockChecks={};
// Regular IDX schedule, Asia/Jakarta. Official calendar: KSEI PENG-0002/DIR/KSEI/0126.
const IDX_HOLIDAYS=new Set(['2026-01-01','2026-01-16','2026-02-16','2026-02-17','2026-03-18','2026-03-19','2026-03-20','2026-03-23','2026-03-24','2026-04-03','2026-05-01','2026-05-14','2026-05-15','2026-05-27','2026-05-28','2026-06-01','2026-06-16','2026-08-17','2026-08-25','2026-12-24','2026-12-25','2026-12-31']);
function jakartaParts(now=Date.now()){const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(now)).map(x=>[x.type,x.value]));return {date:p.year+'-'+p.month+'-'+p.day,year:p.year,weekday:p.weekday,minute:Number(p.hour)*60+Number(p.minute)};}
function idxSession(now=Date.now()){const p=jakartaParts(now),m=p.minute;const state=(label,active=false,kind='closed')=>({label,active,kind,date:p.date,calendarKnown:p.year==='2026'});if(p.weekday==='Sat'||p.weekday==='Sun')return state('Bursa tutup · akhir pekan');if(IDX_HOLIDAYS.has(p.date))return state('Bursa tutup · libur bursa');if(m<525)return state('Bursa belum buka · mulai 08.45 WIB');if(m<540)return state('Prapembukaan · BEI',true,'opening');const breakStart=p.weekday==='Fri'?690:720,breakEnd=p.weekday==='Fri'?840:810;if(m<breakStart)return state('Bursa buka · sesi I',true,'open');if(m<breakEnd)return state('Istirahat bursa · jeda siang · sesi II '+(p.weekday==='Fri'?'14.00':'13.30')+' WIB',false,'break');if(m<950)return state('Bursa buka · sesi II',true,'open');if(m<960)return state('Prapenutupan · BEI',true,'closing');if(m<962)return state('Pencocokan penutupan · BEI',true,'closing');if(m<975)return state('Pascapenutupan · BEI',true,'closing');return state('Bursa tutup · selesai 16.15 WIB');}

/* Login reminder uses the same Jakarta schedule as asset market badges. */
function loginMarketState(now=Date.now()){
 const session=idxSession(now);let tone='closed',badge='BURSA TUTUP',title='Mau lihat apa? Bursa sedang tutup 😴',message='Pasar boleh istirahat, rencana tetap jalan. Cek catatan portofoliomu atau siapkan strategi untuk sesi berikutnya.';
 if(session.kind==='open'){tone='open';badge='BURSA BUKA';title='Bursa buka. Semangat, trader!';message='Mulai dengan kepala dingin. Jalankan rencanamu, jaga disiplin, dan tetap kelola risiko.';}
 else if(session.kind==='break'){tone='break';badge='ISTIRAHAT SIANG';title='Bursa sedang jeda istirahat siang ☕';message='Perdagangan saham berhenti sementara. Selamat makan siang! Sesi II kembali pukul '+(jakartaParts(now).weekday==='Fri'?'14.00':'13.30')+' WIB. Harga saham yang terlihat adalah harga terakhir.';}
 else if(session.kind==='opening'){tone='opening';badge='PRAPEMBUKAAN';title='Bersiap, trader. Sesi I mulai 09.00 WIB!';message='Cek rencana dan batas risikomu. Tidak perlu terburu-buru, peluang bisa dinilai dengan tenang.';}
 else if(session.kind==='closing'){tone='closing';badge='SESI PENUTUPAN';title='Sesi penutupan. Tetap disiplin sampai akhir.';message='Perdagangan reguler sesi II sudah selesai. Waktunya meninjau posisi dan merapikan catatan hari ini.';}
 const p=jakartaParts(now),breakStart=p.weekday==='Fri'?690:720;
 if(session.kind==='open'&&p.minute>=breakStart-15&&p.minute<breakStart){badge='SEBENTAR LAGI ISTIRAHAT';title='Bursa jeda siang dalam '+(breakStart-p.minute)+' menit';message='Sesi I selesai pukul '+(p.weekday==='Fri'?'11.30':'12.00')+' WIB. Sesi II kembali pukul '+(p.weekday==='Fri'?'14.00':'13.30')+' WIB. Siapkan waktu istirahatmu.';}
 if(session.kind==='closed'&&p.minute>=975&&p.weekday!=='Sat'&&p.weekday!=='Sun'&&!IDX_HOLIDAYS.has(p.date)){message='Sesi perdagangan hari ini sudah selesai. Harga saham ditampilkan dari harga terakhir yang tersedia; perdagangan berlanjut pada hari bursa berikutnya.';}
 const detail=session.label+' · Jadwal pasar reguler BEI'+(session.calendarKnown?'':' · Kalender libur tahun '+jakartaParts(now).year+' belum tersedia');
 return {tone,badge,title,message,detail};
}
function compactLoginMarketLabel(now=Date.now()){
 const s=idxSession(now),p=jakartaParts(now),start=p.weekday==='Fri'?690:720;
 if(s.kind==='break')return 'Jeda siang · kembali '+(p.weekday==='Fri'?'14.00':'13.30');
 if(s.kind==='open'&&p.minute>=start-15&&p.minute<start)return 'Jeda siang dalam '+(start-p.minute)+' menit';
 if(s.kind==='closing')return 'Sesi penutupan bursa';
 if(s.kind==='opening')return 'Prapembukaan bursa';
 return s.label.replace(' · mulai 08.45 WIB',' · 08.45 WIB').replace(' · selesai 16.15 WIB','');
}
function updateLoginMarket(now=Date.now()){
 const state=loginMarketState(now),set=(id,value)=>{const el=document.getElementById(id);if(el&&el.textContent!==value)el.textContent=value;};
 const card=document.getElementById('loginMarket');if(!card)return;card.className='login-market market-board '+state.tone;
 set('loginMarketBadge',compactLoginMarketLabel(now));set('loginMarketTitle',state.title);set('loginMarketMessage',state.message);set('loginMarketSession',state.detail);
 set('loginMarketClock',new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(now))+' WIB');
 document.getElementById('loginMarketClock').setAttribute('datetime',new Date(now).toISOString());set('marketBoardDate',new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(now)));
}
updateLoginMarket();
setInterval(()=>{if(!document.hidden)updateLoginMarket();},15000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateLoginMarket();});
window.addEventListener('focus',()=>updateLoginMarket());

function lastCompletedIdxClose(now=Date.now()){const d=jakartaParts(now).date;for(let back=0;back<370;back++){const day=new Date(Date.parse(d+'T00:00:00Z')-back*86400000),date=day.toISOString().slice(0,10),week=day.getUTCDay(),close=Date.parse(date+'T16:15:00+07:00');if(week!==0&&week!==6&&!IDX_HOLIDAYS.has(date)&&close<=now)return close;}return 0;}
function shouldFetchStock(a,now=Date.now(),force=false){if(a.archived)return false;if(force||!Number.isFinite(quotes[a.symbol]))return true;if(idxSession(now).active)return true;return Math.max(quoteMeta[a.symbol]?.fetchedAt||0,closedStockChecks[a.symbol]||0)<lastCompletedIdxClose(now);}
function marketBadgeHtml(a){if(a.kind==='crypto')return '<div class="market-session open"><span aria-hidden="true"></span>Pasar kripto · 24 jam</div>';if(a.kind!=='stock')return '';const s=idxSession();return '<div class="market-session '+s.kind+'" title="Jadwal pasar reguler BEI, waktu Jakarta (WIB). Bukan indikator suspensi tiap saham."><span aria-hidden="true"></span>'+esc(s.label)+(s.calendarKnown?'':' · jadwal reguler')+'</div>';}
function updateMarketSummary(now=Date.now()){const notice=loginMarketState(now),set=(id,value)=>{const el=document.getElementById(id);if(el&&el.textContent!==value)el.textContent=value;};const card=document.getElementById('dashboardMarketNotice');if(card)card.className='dashboard-market-notice '+notice.tone;set('dashboardMarketBadge',notice.badge);set('dashboardMarketTitle',notice.title);set('dashboardMarketMessage',notice.message);const s=idxSession(now);idxMarketStatus.textContent=s.label+' · status sesi otomatis 15 detik · harga setiap 5 menit'+(s.calendarKnown?'':' · kalender libur tahun '+jakartaParts().year+' belum tersedia');idxMarketStatus.className='idx-market-summary '+s.kind;}

try{const c=JSON.parse(localStorage.getItem(PRICE_CACHE_KEY)||'null');if(c){lastRefreshAt=c.stockFeedVersion==='batch-idx-v1'?Number(c.lastRefreshAt)||0:0;closedStockChecks=c.closedStockChecks||{};for(const [symbol,p] of Object.entries(c.quotes||{})){if(Number.isFinite(p)&&p>0&&c.meta?.[symbol]?.fetchedAt){quotes[symbol]=p;quoteMeta[symbol]=c.meta[symbol];}}if(Number.isFinite(c.usdIdr)&&c.usdIdr>0){usdIdr=c.usdIdr;fxMeta=c.fxMeta;}}}catch(e){}
function persistPrices(){try{localStorage.setItem(PRICE_CACHE_KEY,JSON.stringify({quotes,meta:quoteMeta,usdIdr,fxMeta,lastRefreshAt,closedStockChecks,stockFeedVersion:'batch-idx-v1'}));}catch(e){}}
function storeQuote(symbol,price,source,marketAt=null,metadata={}){price=Number(price);if(!Number.isFinite(price)||price<=0)throw Error('Harga tidak valid');quotes[symbol]=price;quoteMeta[symbol]={source,fetchedAt:Number.isFinite(metadata.fetchedAt)?Math.min(Date.now(),metadata.fetchedAt):Date.now(),marketAt,stale:metadata.stale===true,fallback:metadata.fallback===true};priceFailures.delete(symbol);persistPrices();render();}
`;
