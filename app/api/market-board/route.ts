import { createMarketBoard } from '@/lib/market-board';
import { marketCatalog } from '@/lib/market-catalog';
export const dynamic='force-dynamic';
const catalog=new Map(marketCatalog.map(a=>[a.id,a]));
const services=new Map<string,ReturnType<typeof createMarketBoard>>();
export function selectMarketAssets(raw:string){
  if(raw.length>400)throw Error('Too many assets');
  const ids=[...new Set((raw||'index:IHSG').split(','))].sort();
  if(ids.length>6||ids.some(id=>!catalog.has(id)))throw Error('Invalid assets');
  const selected=ids.map(id=>catalog.get(id)!);
  if(new Set(selected.map(a=>a.kind)).size>1)throw Error('Mixed group');
  return {key:ids.join(','),selected};
}
export async function GET(request:Request){
  let selection;try{selection=selectMarketAssets(new URL(request.url).searchParams.get('assets')||'');}catch{return Response.json({error:'Pilih maksimal 6 aset dari katalog yang sama.'},{status:400});}
  const {key,selected}=selection;
  let service=services.get(key);
  if(!service){if(services.size>=120)services.delete(services.keys().next().value!);service=createMarketBoard(fetch,Date.now,selected);services.set(key,service);}
  const quotes=await service.get();
  return Response.json({quotes,checkedAt:new Date().toISOString(),refreshSeconds:300},{headers:{'Cache-Control':quotes.length?'public, max-age=30':'no-store'}});
}
