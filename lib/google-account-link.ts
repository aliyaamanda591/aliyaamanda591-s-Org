import type { GoogleIdentity } from './firebase-google';
import { safeGooglePhoto } from './profile-photo.js';

export async function syncVerifiedGooglePhoto(db:D1Database,userId:string,value:unknown){
 const photo=safeGooglePhoto(value);if(!photo)return;
 for(let attempt=0;attempt<3;attempt++){
  const row=await db.prepare('SELECT data,revision FROM portfolios WHERE user_id=?').bind(userId).first<{data:string;revision:number}>();
  if(!row){const state={transactions:[],assets:[],profile:{displayName:'',photo:'',googlePhoto:photo},logs:[],sheetUrl:'',lastBackup:''};const inserted=await db.prepare('INSERT INTO portfolios (user_id,data,revision,updated_at) VALUES (?,?,0,?) ON CONFLICT(user_id) DO NOTHING RETURNING revision').bind(userId,JSON.stringify(state),new Date().toISOString()).first();if(inserted)return;continue;}
  let state;try{state=JSON.parse(row.data);}catch{return;}
  if(!state||typeof state!=='object'||Array.isArray(state))return;
  const profile=state.profile&&typeof state.profile==='object'&&!Array.isArray(state.profile)?state.profile:{};
  if(profile.googlePhoto===photo)return;
  // Merge only provider metadata. Never overwrite custom photos, preferences or holdings.
  state.profile={...profile,googlePhoto:photo};
  const updated=await db.prepare('UPDATE portfolios SET data=?,revision=revision+1,updated_at=? WHERE user_id=? AND revision=? RETURNING revision').bind(JSON.stringify(state),new Date().toISOString(),userId,row.revision).first();if(updated)return;
 }
}
type Credential={user_id:string;version:number};
export async function linkVerifiedGoogleAccount(db:D1Database,google:GoogleIdentity):Promise<Credential>{
 const get=()=>db.prepare('SELECT user_id,version FROM credentials WHERE email=?').bind(google.email).first<Credential>();
 let credential=await get();
 if(!credential){
  const account=await db.prepare('SELECT user_id FROM accounts WHERE lower(email)=? ORDER BY created_at LIMIT 1').bind(google.email).first<{user_id:string}>();
  const userId=account?.user_id||'google_'+google.uid,now=new Date().toISOString();
  await db.batch([db.prepare('INSERT INTO accounts (user_id,email,display_name,created_at,last_seen_at) VALUES (?,?,?,?,?) ON CONFLICT(user_id) DO NOTHING').bind(userId,google.email,google.displayName,now,now),db.prepare('INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?,?,?,1,1,?) ON CONFLICT(email) DO NOTHING').bind(userId,google.email,'!firebase-google-only','',now)]);
  credential=await get();
 }
 if(!credential)throw Error('Akun belum berhasil dihubungkan.');
 // An unverified email/password registration does not establish ownership of
 // the email. A verified Google owner must not inherit its password, recovery
 // code or sessions. Keep the account ID and portfolio; revoke only access.
 await db.batch([
  db.prepare("UPDATE credentials SET password_hash='!firebase-google-only',recovery_hash='',version=version+1,email_verified=1,updated_at=? WHERE user_id=? AND email_verified=0").bind(new Date().toISOString(),credential.user_id),
  db.prepare('DELETE FROM sessions WHERE user_id=? AND credential_version<>(SELECT version FROM credentials WHERE user_id=?)').bind(credential.user_id,credential.user_id),
  db.prepare('UPDATE accounts SET last_seen_at=? WHERE user_id=?').bind(new Date().toISOString(),credential.user_id)
 ]);
 credential=await get();
 if(!credential)throw Error('Akun belum berhasil dihubungkan.');
 try{await syncVerifiedGooglePhoto(db,credential.user_id,google.photoURL);}catch{/* Optional photo metadata must not block sign-in. */}
 return credential;
}
