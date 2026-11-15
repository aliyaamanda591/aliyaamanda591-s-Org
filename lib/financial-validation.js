// Pure validation shared verbatim by the browser importer and the server.
// Existing fractional holdings remain readable; new stock mutations are checked
// separately so correcting a legacy record never locks an account out.
export function validateFinancialData(raw) {
 const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
 const text=(v,n)=>typeof v==='string'&&v.length<=n;
 const nonempty=(v,n)=>text(v,n)&&v.trim().length>0;
 const finite=v=>typeof v==='number'&&Number.isFinite(v);
 const date=v=>text(v,10)&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
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

/** @param {any} state @param {any} [previous] */
export function validateStockMutations(state,previous={assets:[],transactions:[]}) {
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

/** @param {any} state @param {any} [previous] */
export function validateLedgerMutations(state,previous={transactions:[],assets:[]}) {
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
