import { getChatGPTUser } from '@/app/chatgpt-auth';
import { database } from './database';
import { resolveIdentity } from './identity';
import { ensureAccount, isOwnerEmail } from './account-store';
import { canonicalEmail, checkPassword, digest, hashPassword, normalizedRecovery, randomToken, recoveryCode, sessionCookie } from './auth-crypto';
import { verifyGoogleToken } from './firebase-google';
import { linkVerifiedGoogleAccount } from './google-account-link';
import { PasswordResetError, requestPasswordReset, finishPasswordReset } from './password-reset';
import { recoveryMailSender } from './recovery-mail';

export class AuthError extends Error{constructor(message:string,public status=400){super(message);}}
type Credential={user_id:string;email:string;password_hash:string;recovery_hash:string;version:number;email_verified:number};
async function getCredential(email:string){return database().prepare('SELECT user_id,email,password_hash,recovery_hash,version,email_verified FROM credentials WHERE email=?').bind(email).first<Credential>();}
async function limit(key:string,max:number,windowMs:number){const now=Date.now();const row=await database().prepare('INSERT INTO auth_limits (key,attempts,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN window_start<? THEN 1 ELSE attempts+1 END,window_start=CASE WHEN window_start<? THEN ? ELSE window_start END RETURNING attempts').bind(await digest(key),now,now-windowMs,now-windowMs,now).first<{attempts:number}>();if(!row||row.attempts>max)throw new AuthError('Terlalu banyak percobaan. Coba lagi dalam 15 menit.',429);}
async function issueSession(userId:string,version:number){const token=randomToken(),expires=Date.now()+7*86400000;await database().batch([database().prepare('DELETE FROM sessions WHERE expires_at<?').bind(Date.now()),database().prepare('DELETE FROM auth_limits WHERE window_start<?').bind(Date.now()-86400000),database().prepare('INSERT INTO sessions (token_hash,user_id,credential_version,expires_at,created_at) VALUES (?,?,?,?,?)').bind(await digest(token),userId,version,expires,new Date().toISOString())]);return sessionCookie(token,expires);}
function passwordInput(body:Record<string,unknown>){if(body.password!==body.confirm)throw new AuthError('Konfirmasi password tidak sama.');return body.password;}
async function replacePassword(credential:Credential,password:unknown,expectedRecovery?:string){const code=recoveryCode(),encoded=await hashPassword(password),recoveryHash=await digest('recovery:'+normalizedRecovery(code));const sql='UPDATE credentials SET password_hash=?,recovery_hash=?,version=version+1,updated_at=?'+(expectedRecovery?'':'')+' WHERE user_id=?'+(expectedRecovery?' AND recovery_hash=?':'')+' RETURNING version';const args=[encoded,recoveryHash,new Date().toISOString(),credential.user_id,...(expectedRecovery?[expectedRecovery]:[])];const updated=await database().prepare(sql).bind(...args).first<{version:number}>();if(!updated)throw new AuthError('Kode pemulihan sudah tidak berlaku.');await database().prepare('DELETE FROM sessions WHERE user_id=?').bind(credential.user_id).run();return {code,cookie:await issueSession(credential.user_id,updated.version)};}
export async function handleEmailAuth(action:string,body:Record<string,unknown>,request:Request):Promise<{data:Record<string,unknown>;cookie?:string}>{
 const ip=request.headers.get('cf-connecting-ip')||request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';
 if(action==='google'){
  await limit('google-ip:'+ip,30,15*60000);
  let google;try{google=await verifyGoogleToken(body.idToken);}catch{throw new AuthError('Login Google tidak valid atau sudah kedaluwarsa. Silakan coba lagi.',401);}
  let credential;try{credential=await linkVerifiedGoogleAccount(database(),google);}catch{throw new AuthError('Akun Google belum berhasil dihubungkan. Coba lagi.',503);}
  return {data:{ok:true},cookie:await issueSession(credential.user_id,credential.version)};
 }
 if(action==='logout'){const {SESSION_COOKIE}=await import('./auth-crypto');const cookie=request.headers.get('cookie')?.split(';').map(c=>c.trim()).find(c=>c.startsWith(SESSION_COOKIE+'='))?.slice(SESSION_COOKIE.length+1);if(cookie&&/^[a-f0-9]{64}$/.test(cookie))await database().prepare('DELETE FROM sessions WHERE token_hash=?').bind(await digest(cookie)).run();const platform=await getChatGPTUser();return {data:{redirect:platform?'/signout-with-chatgpt?return_to=%2F':'/'},cookie:sessionCookie('',0)};}
 if(!['register','login','recover','request-otp','reset-otp','activate','change-password'].includes(action))throw new AuthError('Halaman tidak ditemukan.',404);
 await limit('auth-ip:'+ip,60,15*60000);
 if(action==='request-otp'||action==='reset-otp'){
  try{
   const email=canonicalEmail(body.email);
   if(action==='request-otp'){
    const sender=recoveryMailSender(process.env);
    await limit('otp-send-ip:'+ip,10,15*60000);
    await limit('otp-send-email:'+email,5,15*60000);
    return {data:await requestPasswordReset(database(),email,sender)};
   }
   await limit('otp-check-ip:'+ip,30,15*60000);
   await limit('otp-check-email:'+email,15,15*60000);
   await finishPasswordReset(database(),body);
   return {data:{ok:true,message:'Sandi berhasil diperbarui. Silakan masuk dengan sandi baru.'}};
  }catch(error){if(error instanceof PasswordResetError)throw new AuthError(error.message,error.status);throw error;}
 }
 if(action==='register'){
  const email=canonicalEmail(body.email),name=typeof body.displayName==='string'?body.displayName.trim():'';if(name.length<2||name.length>60)throw new AuthError('Nama tampilan harus 2–60 karakter.');await limit('register-ip:'+ip,10,15*60000);
  if(isOwnerEmail(email))throw new AuthError('Akun pemilik sudah disediakan. Gunakan Hubungkan akun lama untuk mengaktifkan password.',409);
  const existing=await database().prepare('SELECT user_id FROM accounts WHERE lower(email)=?').bind(email).first();if(existing||await getCredential(email))throw new AuthError('Email sudah terdaftar. Gunakan Masuk, Pemulihan, atau Hubungkan akun lama.',409);
  const encoded=await hashPassword(passwordInput(body)),code=recoveryCode(),userId='email_'+crypto.randomUUID(),now=new Date().toISOString();
  try{await database().batch([database().prepare('INSERT INTO accounts (user_id,email,display_name,created_at,last_seen_at) VALUES (?,?,?,?,?)').bind(userId,email,name,now,now),database().prepare('INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?,?,?,1,0,?)').bind(userId,email,encoded,await digest('recovery:'+normalizedRecovery(code)),now)]);}catch{throw new AuthError('Pendaftaran belum berhasil. Email mungkin sudah terdaftar.',409);}
  return {data:{ok:true,recoveryCode:code},cookie:await issueSession(userId,1)};
 }
 if(action==='login'){
  const email=canonicalEmail(body.email);await limit('login-email:'+email,12,15*60000);const credential=await getCredential(email);
  const valid=credential?await checkPassword(body.password,credential.password_hash):await hashPassword('unavailable-password-account').then(()=>false);
  if(!credential||!valid)throw new AuthError('Email atau password salah.',401);
  await database().prepare('UPDATE accounts SET last_seen_at=? WHERE user_id=?').bind(new Date().toISOString(),credential.user_id).run();return {data:{ok:true},cookie:await issueSession(credential.user_id,credential.version)};
 }
 if(action==='recover'){
  const email=canonicalEmail(body.email);await limit('recover-email:'+email,5,15*60000);const code=normalizedRecovery(body.recoveryCode),credential=await getCredential(email),encoded=await digest('recovery:'+code);
  if(code.length!==48||!credential||credential.recovery_hash!==encoded)throw new AuthError('Email atau kode pemulihan tidak sesuai.',401);
  const result=await replacePassword(credential,passwordInput(body),encoded);return {data:{ok:true,recoveryCode:result.code},cookie:result.cookie};
 }
 if(action==='activate'){
  const platform=await getChatGPTUser()||await resolveIdentity().then(user=>user?.authMethod==='google'&&user.emailVerified&&!user.hasPassword?user:null);if(!platform)throw new AuthError('Hubungkan akun lama atau masuk dengan Google terlebih dahulu.',401);
  const email=canonicalEmail(platform.email);await limit('activate-email:'+email,8,15*60000);const password=passwordInput(body),existing=await getCredential(email);
  if(existing){const result=await replacePassword(existing,password);await database().prepare('UPDATE credentials SET email_verified=1 WHERE user_id=?').bind(existing.user_id).run();return {data:{ok:true,recoveryCode:result.code},cookie:result.cookie};}
  await ensureAccount(platform);const encoded=await hashPassword(password),code=recoveryCode();await database().prepare('INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?,?,?,1,1,?)').bind(platform.userId,email,encoded,await digest('recovery:'+normalizedRecovery(code)),new Date().toISOString()).run();return {data:{ok:true,recoveryCode:code},cookie:await issueSession(platform.userId,1)};
 }
 const user=await resolveIdentity();if(!user)throw new AuthError('Silakan masuk kembali.',401);const credential=await getCredential(canonicalEmail(user.email));if(!credential||!await checkPassword(body.oldPassword,credential.password_hash))throw new AuthError('Password saat ini salah.',401);await limit('change-email:'+user.email,8,15*60000);const result=await replacePassword(credential,passwordInput(body));return {data:{ok:true,recoveryCode:result.code},cookie:result.cookie};
}
