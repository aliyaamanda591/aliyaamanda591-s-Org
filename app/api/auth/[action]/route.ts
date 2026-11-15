import { AuthError, handleEmailAuth } from '@/lib/email-auth';
export const dynamic='force-dynamic';
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){
 const respond=(data:unknown,status=200,cookie?:string)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store',...(cookie?{'Set-Cookie':cookie}:{})}});
 try{if(request.headers.get('origin')!==new URL(request.url).origin)return respond({error:'Permintaan tidak diizinkan.'},403);const raw=await request.text();if(raw.length>8192)return respond({error:'Permintaan terlalu besar.'},413);let body;try{body=JSON.parse(raw||'{}');}catch{return respond({error:'Data tidak valid.'},400);}if(!body||typeof body!=='object'||Array.isArray(body))return respond({error:'Data tidak valid.'},400);const {action}=await params;const result=await handleEmailAuth(action,body,request);return respond(result.data,200,result.cookie);}
 catch(error){if(error instanceof AuthError)return respond({error:error.message},error.status);if(error instanceof Error&&/Password|password|email|konfirmasi/i.test(error.message)&&!/(SQL|D1|constraint)/i.test(error.message))return respond({error:error.message},400);return respond({error:'Layanan akun belum tersedia. Coba lagi sebentar.'},503);}
}
