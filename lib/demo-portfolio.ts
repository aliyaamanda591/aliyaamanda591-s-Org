/** Public, per-page playground. No identity, session cookie, D1 row, or real holdings. */
export const demoPrices: Record<string,number> = {
 'BBCA.JK':9600,'BMRI.JK':5050,'BBRI.JK':4200,'TLKM.JK':3000,'BBNI.JK':4800,
 'indodax:btcidr':1200000000,'indodax:solidr':2300000,'indodax:ethidr':48000000,
 'BTC':1200000000,'SOL':2300000,'ETH':48000000,'XAU':2000000,'XAU15_RETAIL':1100000,
};
const examples = [
 {name:'BBCA',company:'PT Bank Central Asia Tbk',unit:'lembar',kind:'stock',symbol:'BBCA.JK',quantity:100,capital:1000000,platform:'Stockbit'},
 {name:'BMRI',company:'PT Bank Mandiri (Persero) Tbk',unit:'lembar',kind:'stock',symbol:'BMRI.JK',quantity:200,capital:980000,platform:'GROWIN'},
 {name:'BTC INDODAX',company:'Bitcoin',unit:'BTC',kind:'crypto',symbol:'indodax:btcidr',quantity:0.001,capital:1100000,platform:'INDODAX'},
 {name:'SOL INDODAX',company:'Solana',unit:'SOL',kind:'crypto',symbol:'indodax:solidr',quantity:2,capital:4800000,platform:'Pintu'},
 {name:'EMAS K24',company:'Emas fisik · 24 karat',unit:'gram',kind:'gold24',symbol:'XAU',quantity:2,capital:3800000,platform:'Pegadaian'},
];
export function createDemoBootstrap(){return {
 demo:true,revision:0,demoPrices:{...demoPrices},
 user:{id:'sidaps-public-demo',username:'Trader Demo',email:'',authMethod:'demo',hasPassword:false,roles:['guest']},
 state:{transactions:examples.map((a,i)=>({id:'demo-buy-'+i,date:['2026-06-10','2026-07-12','2026-08-05','2026-09-17','2026-10-02'][i],type:'MASUK',trade:'buy',quantityDelta:a.quantity,amount:a.capital,asset:a.name,description:'Contoh pembelian '+a.name.replace(' INDODAX',''),platform:a.platform})),
 assets:examples.map(({capital,platform,...a})=>({...a,valueSnapshot:Math.round(a.quantity*demoPrices[a.symbol]),manualPrice:null,archived:false})),
 profile:{displayName:'Trader Demo',photo:'',photoMode:'none'},logs:[],sheetUrl:'',lastBackup:''}
};}
export function renderDemoPortfolio(shell:string){
 const replace=(before:string,after:string)=>{if(!shell.includes(before))throw Error('Demo shell integration missing: '+before.slice(0,60));shell=shell.replace(before,after);};
 replace('/*__CLOUD_BOOTSTRAP__*/null',JSON.stringify(createDemoBootstrap()).replaceAll('<','\\u003c'));
 // Defense in depth: even a visitor with a real session open cannot send account requests from this page.
 replace('const cloudNativeFetch=window.fetch.bind(window);',`const demoBrowserFetch=window.fetch.bind(window);
const cloudNativeFetch=(input,options)=>{const path=new URL(typeof input==='string'?input:input.url,location.href).pathname;if(/^\\/api\\/(state|auth|admin)(?:\\/|$)/.test(path))return Promise.reject(Error('Mode demo tidak mengakses akun pribadi.'));return demoBrowserFetch(input,options);};`);
 replace('const cloudDeviceStorage=(()=>{try{return window.localStorage;}catch{return null;}})();','const cloudDeviceStorage=null;');
 replace('async function cloudSave(){',"async function cloudSave(){cloudDirty=false;cloudSetSyncStatus('Mode demo · perubahan hanya selama halaman ini terbuka','ok');return;");
 replace('async function cloudFlushBeforeLogout(){',"async function cloudFlushBeforeLogout(){location.href='/?view=landing';return;");
 replace('function priceFor(a){',"function priceFor(a){return cloudBoot.demoPrices[a.kind==='gold15'?'XAU15_RETAIL':a.symbol]??(Number(a.manualPrice)>0?Number(a.manualPrice):null);");
 replace('function quoteState(a){',"function quoteState(a){return {label:'HARGA DEMO',className:'cached',detail:'Harga ilustrasi tetap untuk latihan, bukan harga pasar atau rekomendasi transaksi.'};");
 replace('function refreshPrices({force=true}={}){',"function refreshPrices({force=true}={}){render();priceStatus.textContent='Mode demo · harga ilustrasi tetap';return Promise.resolve();");
 replace('function marketBadgeHtml(a){',"function marketBadgeHtml(a){return '<div class=\"market-session\">Simulasi · bukan transaksi sungguhan</div>';");
 replace("cloudSetSyncStatus('Tersinkron ke akun pribadi','ok')","cloudSetSyncStatus('Mode demo · data contoh, tidak tersimpan ke akun','ok')");
 replace("member:'Anggota',guest:'Tamu'","member:'Anggota',guest:'Demo'");
 shell=shell.replaceAll('Akun pribadi online','Sesi demo sementara').replaceAll('Backup lengkap melalui menu Developer','Mode demo · perubahan tidak disimpan').replace("profileLoginNote.textContent='Email untuk masuk: '+(a.email||a.username);","profileLoginNote.textContent='Profil demo · bukan akun terdaftar.';").replaceAll('harga setiap 5 menit','harga ilustrasi tetap').replaceAll('↻ Perbarui harga','↻ Harga contoh');
 replace('</head>','<meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="/demo-mode.css?v=1"></head>');
 replace('</body>','<script src="/demo-mode.js?v=1"></script></body>');
 return shell;
}
