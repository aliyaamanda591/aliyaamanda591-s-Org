// Public, fixed watchlist only. Never reads accounts or portfolio records.
export type MarketQuote = { code:string; name:string; kind:'stock'|'crypto'|'index'; price:number; change:number|null; points:number[]; period:string; source:string; marketAt:string; fetchedAt:string; stale:boolean; estimated?:boolean; changeLabel?:string };
export type MarketAsset={code:string;name:string;kind:string;cg:string;pair:string};
const stocks = [['BMRI','Bank Mandiri'],['BBCA','Bank Central Asia'],['BBRI','Bank Rakyat Indonesia'],['TLKM','Telkom Indonesia']];
const coins = [['bitcoin','BTC','Bitcoin'],['ethereum','ETH','Ethereum'],['solana','SOL','Solana']];
const positive = (n:unknown):n is number => typeof n==='number'&&Number.isFinite(n)&&n>0;
const finite = (n:unknown):n is number => typeof n==='number'&&Number.isFinite(n);
function points(raw:unknown):number[]{ return Array.isArray(raw)?raw.filter(positive).filter((_,i,a)=>i%Math.max(1,Math.ceil(a.length/60))===0||i===a.length-1):[]; }
export function yahooQuote(data:any,code:string,name:string,now:number):MarketQuote {
  const r=data?.chart?.result?.[0],m=r?.meta;
  if(m?.symbol!==(code==='IHSG'?'^JKSE':code+'.JK')||m.currency!=='IDR'||!positive(m.regularMarketPrice)||!positive(m.regularMarketTime))throw Error('Invalid equity quote');
  const previous=m.chartPreviousClose??m.previousClose;
  return {code,name,kind:code==='IHSG'?'index':'stock',price:m.regularMarketPrice,change:positive(previous)?(m.regularMarketPrice/previous-1)*100:null,points:points(r.indicators?.quote?.[0]?.close),period:'Sesi terakhir',source:'Yahoo Finance · dapat tertunda',marketAt:new Date(m.regularMarketTime*1000).toISOString(),fetchedAt:new Date(now).toISOString(),stale:false};
}
export function coinQuotes(data:any,now:number,selected=coins):MarketQuote[]{
  if(!Array.isArray(data))throw Error('Invalid crypto quotes');
  return selected.flatMap(([id,code,name])=>{const q=data.find((d:any)=>d.id===id);if(!positive(q?.current_price)||!Number.isFinite(Date.parse(q.last_updated)))return [];
    return [{code,name,kind:'crypto' as const,price:q.current_price,change:finite(q.price_change_percentage_24h_in_currency)?q.price_change_percentage_24h_in_currency:finite(q.price_change_percentage_24h)?q.price_change_percentage_24h:null,points:points(q.sparkline_in_7d?.price),period:'7 hari',source:'CoinGecko',marketAt:q.last_updated,fetchedAt:new Date(now).toISOString(),stale:false}];});
}
export function createMarketBoard(fetcher:typeof fetch=fetch,clock=Date.now,selection?:MarketAsset[]){
  const selectedStocks=selection?selection.filter(a=>a.kind!=='crypto').map(a=>[a.code,a.name]):stocks;
  const selectedCoins=selection?selection.filter(a=>a.kind==='crypto').map(a=>[a.cg,a.code,a.name,a.pair]):coins;
  const saved=new Map<string,MarketQuote>();let expires=0,pending:Promise<MarketQuote[]>|null=null;
  async function json(url:string,init?:RequestInit):Promise<any>{const r=await fetcher(url,{...init,headers:{Accept:'application/json','User-Agent':'SidapsPortfolio/1.0',...init?.headers},signal:AbortSignal.timeout(4000)});if(!r.ok)throw Error('Market source unavailable');return r.json();}
  async function refresh(){
    const now=clock(),fresh=new Map<string,MarketQuote>();
    const results=await Promise.allSettled([
      ...selectedStocks.map(async([code,name])=>{const symbol=code==='IHSG'?'%5EJKSE':code+'.JK';const q=yahooQuote(await json('https://query1.finance.yahoo.com/v8/finance/chart/'+symbol+'?range=1d&interval=5m'),code,name,now);fresh.set(code,q);}),
      (async()=>{const ids=selectedCoins.map(c=>c[0]).filter(Boolean);if(!ids.length)return;for(const q of coinQuotes(await json('https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&ids='+encodeURIComponent(ids.join(','))+'&sparkline=true&price_change_percentage=24h'),now,selectedCoins))fresh.set(q.code,q);})()
    ]);
    // Independent quote fallback; no manufactured charts or percentage changes.
    const missing=selectedStocks.filter(([code])=>!fresh.has(code));
    await Promise.allSettled([
      missing.length?(async()=>{const d=await json('https://scanner.tradingview.com/indonesia/scan',{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({symbols:{tickers:missing.map(([c])=>'IDX:'+(c==='IHSG'?'COMPOSITE':c))},columns:['name','close','change']})});for(const row of d?.data||[]){const [code,price,change]=row.d||[];const entry=missing.find(([c])=>c===code||(c==='IHSG'&&code==='COMPOSITE'));if(entry&&positive(price))fresh.set(entry[0],{code:entry[0],name:entry[1],kind:entry[0]==='IHSG'?'index':'stock',price,change:finite(change)?change:null,points:[],period:'Grafik belum tersedia',source:'TradingView · dapat tertunda',marketAt:'',fetchedAt:new Date(now).toISOString(),stale:false});}})():Promise.resolve(),
      selectedCoins.length&&(results[selectedStocks.length].status==='rejected'||selectedCoins.some(([,code])=>!fresh.has(code)))?(async()=>{
        // These independent fallbacks run together to keep the total deadline bounded.
        const [indodax,fx,...history]=await Promise.allSettled([
          json('https://indodax.com/api/tickers'),
          json('https://query1.finance.yahoo.com/v8/finance/chart/IDR=X?range=1d&interval=15m'),
          ...selectedCoins.map(([,code])=>json('https://query1.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(code)+'-USD?range=1d&interval=15m'))
        ]);
        const f=fx.status==='fulfilled'?fx.value?.chart?.result?.[0]?.meta:null;
        for(const [i,[,code,name,pair]]of selectedCoins.entries()){
          if(fresh.has(code))continue;
          const d=indodax.status==='fulfilled'?indodax.value:null,price=Number(d?.tickers?.[pair||code.toLowerCase()+'_idr']?.last);
          if(positive(price)){fresh.set(code,{code,name,kind:'crypto',price,change:null,points:[],period:'Grafik belum tersedia',source:'Indodax',marketAt:positive(d?.server_time)?new Date(d.server_time*1000).toISOString():'',fetchedAt:new Date(now).toISOString(),stale:false});continue;}
          const h=history[i],r=h.status==='fulfilled'?h.value?.chart?.result?.[0]:null,m=r?.meta;
          if(f?.symbol!=='IDR=X'||f.currency!=='IDR'||!positive(f.regularMarketPrice)||m?.symbol!==code+'-USD'||m.currency!=='USD'||!positive(m.regularMarketPrice)||!positive(m.regularMarketTime))continue;
          const previous=m.chartPreviousClose??m.previousClose;
          fresh.set(code,{code,name,kind:'crypto',price:m.regularMarketPrice*f.regularMarketPrice,change:positive(previous)?(m.regularMarketPrice/previous-1)*100:null,points:points(r.indicators?.quote?.[0]?.close),period:'Sesi hari ini · USD',source:'Yahoo Finance · konversi USD/IDR',marketAt:new Date(m.regularMarketTime*1000).toISOString(),fetchedAt:new Date(now).toISOString(),stale:false,estimated:true,changeLabel:'sesi USD'});
        }
      })():Promise.resolve()
    ]);
    for(const [code,q]of fresh)saved.set(code,q);
    expires=clock()+(fresh.size===selectedStocks.length+selectedCoins.length?300000:30000);
    return [...saved.values()].map(q=>({...q,stale:!fresh.has(q.code)}));
  }
  let last:MarketQuote[]=[];
  return {async get(){if(clock()<expires)return last;if(!pending)pending=refresh().then(q=>(last=q)).finally(()=>{pending=null;});return pending;}};
}
export const marketBoard=createMarketBoard();
