// Public IDX schedule, shared with the portfolio.
(()=>{
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


})();