function correctGoogleLoginOrigin(){if(location.hostname!=='sidaps-portfolio.sidaps.workers.dev.')return false;const url=new URL(location.href);url.hostname='sidaps-portfolio.sidaps.workers.dev';location.replace(url.href);return true;}
// Domain failures can outlive an authorization change in an already-open SDK instance.
async function showGoogleDomainRecovery(message){
 let allowed=false;
 try{const response=await cloudNativeFetch('https://identitytoolkit.googleapis.com/v1/projects?key='+encodeURIComponent(FIREBASE_WEB_CONFIG.apiKey),{signal:AbortSignal.timeout(5000)});if(response.ok){const config=await response.json();allowed=Array.isArray(config.authorizedDomains)&&config.authorizedDomains.includes(location.hostname);}}catch{}
 message.textContent=allowed?'Izin login untuk alamat ini sudah aktif. Muat ulang halaman, lalu pilih akun Google kembali.':'Login Google belum tersedia pada alamat ini. Buka alamat resmi Sidaps untuk melanjutkan.';
 message.setAttribute('data-state','error');const help=document.getElementById('googleAuthHelp');if(help)help.hidden=false;
}

let firebaseGoogleReady=null,firebaseGoogleSdk=null;
async function prepareGoogleSignIn(){
 if(correctGoogleLoginOrigin())return null;
 if(firebaseGoogleReady)return firebaseGoogleReady;
 const button=document.getElementById('googleSignInButton'),message=document.getElementById('googleAuthMessage');button.disabled=true;
 firebaseGoogleReady=(async()=>{
  const [appSdk,authSdk]=await Promise.all([import('https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js')]);
  const app=appSdk.getApps().find(a=>a.name==='sidaps-google')||appSdk.initializeApp(FIREBASE_WEB_CONFIG,'sidaps-google'),auth=authSdk.getAuth(app);
  await authSdk.setPersistence(auth,authSdk.inMemoryPersistence);auth.languageCode='id';
  const provider=new authSdk.GoogleAuthProvider(); // Let Google reuse its current account; do not force the chooser on every login.
  firebaseGoogleSdk={authSdk,auth,provider};button.disabled=false;document.getElementById('googleSignInText').textContent='Lanjutkan dengan Google';message.textContent='';return firebaseGoogleSdk;
 })().catch(()=>{firebaseGoogleReady=null;button.disabled=false;document.getElementById('googleSignInText').textContent='Coba muat login Google';message.textContent='Login Google belum dapat dimuat. Email/password tetap bisa digunakan.';return null;});
 return firebaseGoogleReady;
}
async function googleSignIn(){
 if(correctGoogleLoginOrigin())return;
 const button=document.getElementById('googleSignInButton'),message=document.getElementById('googleAuthMessage');
 if(!firebaseGoogleSdk){await prepareGoogleSignIn();if(firebaseGoogleSdk)message.textContent='Google siap. Tekan Lanjutkan dengan Google.';return;}
 if(button.disabled)return;
 const help=document.getElementById('googleAuthHelp');if(help)help.hidden=true;
 button.disabled=true;message.setAttribute('data-state','busy');message.textContent='Pilih akun pada jendela Google…';
 try{const {authSdk,auth,provider}=firebaseGoogleSdk,result=await authSdk.signInWithPopup(auth,provider);message.textContent='Menghubungkan akun…';const idToken=await result.user.getIdToken();await emailAuthRequest('google',{idToken});authSdk.signOut(auth).catch(()=>{});location.reload();}
 catch(error){const messages={'auth/popup-closed-by-user':'Login Google dibatalkan.','auth/cancelled-popup-request':'Jendela login sebelumnya dibatalkan.','auth/popup-blocked':'Browser memblokir jendela Google. Izinkan popup untuk website ini lalu coba lagi.','auth/unauthorized-domain':'Domain website belum diizinkan untuk login Google.','auth/network-request-failed':'Koneksi ke Google terputus. Periksa internet, lalu coba lagi.'};message.setAttribute('data-state','error');if(error.code==='auth/unauthorized-domain')await showGoogleDomainRecovery(message);else message.textContent=messages[error.code]||'Login Google belum berhasil. Silakan coba lagi.';try{firebaseGoogleSdk.authSdk.signOut(firebaseGoogleSdk.auth).catch(()=>{});}catch{}}
 finally{button.disabled=false;}
}
if(!getAuth())prepareGoogleSignIn();
