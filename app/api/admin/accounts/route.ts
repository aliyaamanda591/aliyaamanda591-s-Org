import { authenticatedUser, database, isOwner, isOwnerEmail } from "@/lib/account-store";
export const dynamic = "force-dynamic";
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{"Cache-Control":"private, no-store"}});
export async function GET(request:Request) {
  try {
    const user=await authenticatedUser();if(!isOwner(user))return json({error:"Hanya pemilik situs."},403);
    const url=new URL(request.url),search=(url.searchParams.get("q")||"").trim().slice(0,150);
    const requested=Number(url.searchParams.get("page")||1),page=Number.isSafeInteger(requested)&&requested>0?Math.min(requested,100000):1,pageSize=25;
    const query=search.replace(/[\\%_]/g,"\\$&"),pattern='%'+query+'%';
    const where=" WHERE (email LIKE ? ESCAPE '\\' OR display_name LIKE ? ESCAPE '\\' OR profile_display_name LIKE ? ESCAPE '\\')";
    const count=await database().prepare("SELECT COUNT(*) AS count FROM accounts"+where).bind(pattern,pattern,pattern).first<{count:number}>();
    const total=count?.count||0,pages=Math.max(1,Math.ceil(total/pageSize)),current=Math.min(page,pages);
    // Do not join portfolios: directory access exposes account metadata only.
    const result=await database().prepare("SELECT user_id,email,display_name,profile_display_name,created_at,last_seen_at,support_status,support_note,support_updated_at FROM accounts"+where+" ORDER BY created_at DESC,user_id LIMIT ? OFFSET ?").bind(pattern,pattern,pattern,pageSize,(current-1)*pageSize).all<{
      user_id:string;email:string;display_name:string;profile_display_name:string|null;created_at:string;last_seen_at:string|null;support_status:string;support_note:string;support_updated_at:string|null;
    }>();
    return json({count:total,page:current,pages,pageSize,accounts:result.results.map(row=>({id:row.user_id,email:row.email,displayName:row.profile_display_name||row.display_name,createdAt:row.created_at,lastSeenAt:row.last_seen_at,roles:isOwnerEmail(row.email)?["admin","developer"]:["member"],supportStatus:row.support_status,supportNote:row.support_note,supportUpdatedAt:row.support_updated_at}))});
  }catch(error){if(error instanceof Response)return error;return json({error:"Daftar akun belum dapat dimuat."},503);}
}
export async function PATCH(request:Request){
  try{
    const user=await authenticatedUser();if(!isOwner(user))return json({error:"Hanya pemilik situs."},403);
    if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:"Permintaan tidak diizinkan."},403);
    const text=await request.text();if(text.length>3000)return json({error:"Catatan terlalu panjang."},413);
    const body=JSON.parse(text);
    if(typeof body.id!=='string'||body.id.length>150||typeof body.note!=='string'||body.note.length>600||!["none","open","resolved"].includes(body.status))return json({error:"Catatan bantuan tidak valid."},400);
    if(Object.keys(body).some(key=>!["id","note","status"].includes(key)))return json({error:"Hanya catatan dan status bantuan yang dapat diubah."},400);
    const updatedAt=new Date().toISOString();
    const result=await database().prepare("UPDATE accounts SET support_note=?,support_status=?,support_updated_at=? WHERE user_id=? RETURNING user_id").bind(body.note.trim(),body.status,updatedAt,body.id).first();
    return result?json({saved:true,updatedAt}):json({error:"Akun tidak ditemukan."},404);
  }catch(error){if(error instanceof Response)return error;return json({error:"Catatan bantuan belum tersimpan."},400);}
}
