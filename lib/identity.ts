import { headers } from './request-context';
import type { ChatGPTUser } from '@/app/chatgpt-auth';
import { database } from './database';
import { digest, SESSION_COOKIE } from './auth-crypto';
export type AccountIdentity=ChatGPTUser&{authMethod:'email'|'platform'|'google';hasPassword:boolean;emailVerified:boolean};
export async function resolveIdentity():Promise<AccountIdentity|null>{
 const requestHeaders=await headers();const cookie=requestHeaders.get('cookie')||'';
 const token=cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith(SESSION_COOKIE+'='))?.slice(SESSION_COOKIE.length+1);
 if(token&&/^[a-f0-9]{64}$/.test(token)){
  const row=await database().prepare('SELECT a.user_id,a.email,a.display_name,a.profile_display_name,c.email_verified,c.password_hash FROM sessions s JOIN credentials c ON c.user_id=s.user_id JOIN accounts a ON a.user_id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND s.credential_version=c.version').bind(await digest(token),Date.now()).first<{user_id:string;email:string;display_name:string;profile_display_name:string|null;email_verified:number;password_hash:string}>();
  if(row){const hasPassword=!row.password_hash.startsWith('!firebase-');return {userId:row.user_id,email:row.email,displayName:row.profile_display_name||row.display_name,fullName:row.profile_display_name||row.display_name,authMethod:hasPassword?'email':'google',hasPassword,emailVerified:row.email_verified===1};}
 }
 return null;
}
