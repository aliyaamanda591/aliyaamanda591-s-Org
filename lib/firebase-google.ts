import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';
import { safeGooglePhoto } from './profile-photo.js';

export const FIREBASE_PROJECT_ID='sidaps-portfolio';
const googleKeys=createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),{timeoutDuration:6500,cacheMaxAge:3600000,cooldownDuration:30000});
export type GoogleIdentity={uid:string;email:string;displayName:string;photoURL?:string};

// Only signed Firebase Google tokens for this exact project can create a website session.
export async function verifyGoogleToken(token:unknown,key:JWTVerifyGetKey=googleKeys):Promise<GoogleIdentity>{
 if(typeof token!=='string'||token.length<100||token.length>7000)throw Error('Token Google tidak valid.');
 const {payload,protectedHeader}=await jwtVerify(token,key,{algorithms:['RS256'],audience:FIREBASE_PROJECT_ID,issuer:'https://securetoken.google.com/'+FIREBASE_PROJECT_ID,requiredClaims:['sub','iat','exp','auth_time','email','email_verified'],maxTokenAge:'10 minutes',clockTolerance:15});
 const now=Math.floor(Date.now()/1000),firebase=payload.firebase as {sign_in_provider?:string}|undefined;
 if(!protectedHeader.kid||!payload.sub||payload.sub.length>128||typeof payload.auth_time!=='number'||payload.auth_time>now+15||payload.auth_time<now-600||payload.email_verified!==true||firebase?.sign_in_provider!=='google.com'||typeof payload.email!=='string'||payload.email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))throw Error('Identitas Google belum terverifikasi.');
 const photoURL=safeGooglePhoto(payload.picture);
 return {uid:payload.sub,email:payload.email.trim().toLowerCase(),displayName:typeof payload.name==='string'?payload.name.trim().slice(0,60):payload.email.split('@')[0].slice(0,60),...(photoURL?{photoURL}:{})};
}
