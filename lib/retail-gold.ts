export const RETAIL_KARATS = ['K24 99,9%','K24 99%',...Array.from({length:22},(_,i)=>'K'+(23-i))];
export const RETAIL_SOURCES = [
  { id: 'iloveemas', name: 'I Love Emas', url: 'https://iloveemas.co.id/harga/' },
  { id: 'superemas', name: 'Super Emas', url: 'https://www.superemas.id/' },
  { id: 'halomas', name: 'Halo Mas', url: 'https://haloemas.co.id/' },
] as const;
type Source = typeof RETAIL_SOURCES[number];
export type RetailQuote = { price: number; marketAt: number; fetchedAt: number; source: string; sourceUrl: string; fallback: boolean; stale: boolean };
const clean = (text: string) => text.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;|&#xA0;/gi, ' ').replace(/\s+/g, ' ').trim();
function sourceDate(text: string) {
  const months: Record<string, number> = {january:1,januari:1,february:2,februari:2,march:3,maret:3,april:4,may:5,mei:5,june:6,juni:6,july:7,juli:7,august:8,agustus:8,september:9,october:10,oktober:10,november:11,december:12,desember:12};
  const m = clean(text).match(/(\d{1,2})\s+([a-z]+)\s*,?\s*(20\d{2})[\s\S]*?(\d{1,2})[.:](\d{2})\s*\(?\s*(WIB|WITA|WIT)\b/i);
  if (!m || !months[m[2].toLowerCase()]) throw Error('Tanggal sumber emas tidak tersedia');
  const [,day,month,year,hour,minute,zone] = m;
  if (+hour > 23 || +minute > 59 || +day < 1 || +day > 31) throw Error('Tanggal sumber tidak valid');
  return Date.parse(`${year}-${String(months[month.toLowerCase()]).padStart(2,'0')}-${day.padStart(2,'0')}T${hour.padStart(2,'0')}:${minute}:00+${zone.toUpperCase()==='WIB'?'07':zone.toUpperCase()==='WITA'?'08':'09'}:00`);
}
export function parseRetailPage(source: Source, html: string, now = Date.now(), label = 'K15'): RetailQuote {
  if (!RETAIL_KARATS.includes(label)) throw Error('Kadar emas tidak valid');
  const normalized = (s:string) => clean(s).replace(/\s+/g,'').replace(',','.').toUpperCase();
  const tableRow = (section:string) => [...section.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(r=>[...r[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(c=>clean(c[1]))).find(c=>normalized(c[0]||'')===normalized(label));
  let row: string[] | RegExpMatchArray | null = null, dateText = '';
  if (source.id === 'iloveemas') {
    const buy = html.slice(html.indexOf('harga-kami-beli'));
    const section = buy.match(/id=["']perhiasan-emas["'][\s\S]*?<table\b[^>]*>([\s\S]*?)<\/table>/i)?.[1] || '';
    row = tableRow(section) || null;
    dateText = html.match(/class=["']last-updated["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] || '';
  } else if (source.id === 'superemas') {
    if (!html.includes('HARGA BUYBACK')) throw Error('Jenis harga Super Emas berubah');
    const found = [...html.matchAll(/class=["']se-price-row["'][^>]*>\s*<span>([\s\S]*?)<\/span>\s*<strong>([^<]+)<\/strong>/gi)].find(r=>normalized(r[1])===normalized(label));
    row = found ? [label,found[2]] : null;
    dateText = html.match(/class=["']se-price-update["'][^>]*>([\s\S]*?)<\/strong>/i)?.[1] || '';
  } else {
    const start = html.indexOf('Harga Beli Perhiasan Emas');
    if (start < 0) throw Error('Jenis harga Halo Mas berubah');
    const section = html.slice(start);
    row = tableRow(section) || null;
    dateText = section.match(/Last Updated\s*:[\s\S]*?<\/strong>/i)?.[0] || '';
  }
  if (!row || !/^Rp\s*[\d.,\s]+$/i.test(clean(row[1]))) throw Error('Harga kadar emas tidak ditemukan');
  const price = Number(clean(row[1]).replace(/[^\d]/g,'')), marketAt = sourceDate(dateText);
  if (!Number.isFinite(price) || price < 100000 || price > 10000000 || !Number.isFinite(marketAt) || marketAt > now + 300000) throw Error('Harga/tanggal emas tidak valid');
  return { price, marketAt, fetchedAt: now, source: source.name+' · buyback '+label+'/gram', sourceUrl: source.url, fallback: source.id !== 'iloveemas', stale: now-marketAt > 36*3600000 };
}
export class RetailGoldService {
  private last: RetailQuote | null = null;
  private expires = 0;
  private pending: Promise<RetailQuote> | null = null;
  async get(fetcher: typeof fetch = fetch, now = Date.now()): Promise<RetailQuote> {
    if (this.last && now < this.expires) return this.last;
    if (this.pending) return this.pending;
    this.pending = (async () => {
      let old: RetailQuote | null = this.last;
      for (const source of RETAIL_SOURCES) {
        try {
          const response = await fetcher(source.url, {headers:{Accept:'text/html','User-Agent':'SidapsPortfolio/1.0'},signal:AbortSignal.timeout(2300)});
          if (!response.ok) throw Error('Sumber HTTP '+response.status);
          if (Number(response.headers.get('content-length')) > 2000000) throw Error('Sumber terlalu besar');
          const html = await response.text(); if (html.length > 2000000) throw Error('Sumber terlalu besar');
          const q = parseRetailPage(source, html, now);
          if (!q.stale) { this.last=q; this.expires=now+300000; return q; }
          if (!old || q.marketAt > old.marketAt) old=q;
        } catch { /* Try the next independent retailer; never invent a spot-derived buyback. */ }
      }
      if (old) { this.last={...old,stale:true}; this.expires=now+60000; return this.last; }
      throw Error('Semua sumber K15 belum tersedia');
    })();
    try {return await this.pending;} finally {this.pending=null;}
  }
}
export const retailGold = new RetailGoldService();

// One request per retailer serves all supported karats, with independent retained quotes.
export class RetailGoldTableService {
 private last:Record<string,RetailQuote>={}; private expires=0; private pending:Promise<Record<string,RetailQuote>>|null=null;
 async get(fetcher:typeof fetch=fetch,now=Date.now()):Promise<Record<string,RetailQuote>> {
  if(Object.keys(this.last).length&&now<this.expires)return this.last;
  if(this.pending)return this.pending;
  this.pending=(async()=>{
   const result:Record<string,RetailQuote>={};
   for(const source of RETAIL_SOURCES){
    try {const response=await fetcher(source.url,{headers:{Accept:'text/html','User-Agent':'SidapsPortfolio/1.0'},signal:AbortSignal.timeout(2300)});
     if(!response.ok||Number(response.headers.get('content-length'))>2000000)continue;
     const html=await response.text();if(html.length>2000000)continue;
     for(const label of RETAIL_KARATS){if(result[label]&&!result[label].stale)continue;try{const q=parseRetailPage(source,html,now,label);if(!result[label]||!q.stale||q.marketAt>result[label].marketAt)result[label]=q;}catch{}}
     if(RETAIL_KARATS.every(label=>result[label]&&!result[label].stale))break;
    }catch{}
   }
   for(const label of RETAIL_KARATS){const old=this.last[label];if(old&&(!result[label]||result[label].stale&&old.marketAt>result[label].marketAt))result[label]={...old,stale:true};}
   if(!Object.keys(result).length)throw Error('Sumber harga kadar emas belum tersedia');
   this.last=result;this.expires=now+(RETAIL_KARATS.every(label=>result[label]&&!result[label].stale)?300000:60000);return result;
  })();try{return await this.pending;}finally{this.pending=null;}
 }
}
export const retailGoldTable=new RetailGoldTableService();
