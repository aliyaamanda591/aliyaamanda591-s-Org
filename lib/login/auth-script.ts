export const loginAuthScriptHtml = `<script>const authBack=document.getElementById('authBack'),authTitle=document.getElementById('authTitle'),authSub=document.getElementById('authSub');
const cloudNativeFetch=window.fetch.bind(window);function getAuth(){return null;}
function hideAllPasswords(){document.querySelectorAll('[data-password-target]').forEach(button=>{const input=document.getElementById(button.dataset.passwordTarget);if(input)input.type='password';button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','Tampilkan sandi');});}
function togglePasswordVisibility(button){const input=document.getElementById(button.dataset.passwordTarget);if(!input)return;const show=input.type==='password';input.type=show?'text':'password';button.setAttribute('aria-pressed',String(show));button.setAttribute('aria-label',show?'Sembunyikan sandi':'Tampilkan sandi');}
let emailAuthMode='login';
function emailPasswordEye(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/><path class="eye-slash" d="m3 3 18 18"/></svg>';}
function cloudAuthSetMode(mode){emailAuthMode=mode;authBack.setAttribute('data-auth-mode',mode);const register=mode==='register',recover=mode==='recover';const security=document.getElementById('registerSecurityNote');if(security)security.hidden=!register;authTitle.textContent=register?'Buat akun pribadi':recover?'Pulihkan sandi':'Selamat datang';authSub.textContent=register?'Daftar dengan email dan kata sandi (minimal 8 karakter).':recover?'Masukkan email akunmu untuk menerima tautan reset sandi.':'Masuk untuk melanjutkan catatan investasimu.';document.getElementById('emailNameField').hidden=!register;document.getElementById('emailName').required=register;document.getElementById('emailRecoveryField').hidden=!recover;document.getElementById('emailRecovery').required=recover;document.getElementById('emailConfirmField').hidden=mode==='login';document.getElementById('emailConfirm').required=mode!=='login';document.getElementById('emailPassword').autocomplete=mode==='login'?'current-password':'new-password';document.getElementById('emailPassword').minLength=mode==='login'?1:8;document.getElementById('emailPassword').value='';document.getElementById('emailConfirm').value='';document.getElementById('emailRecovery').value='';document.getElementById('emailSubmit').textContent=register?'Buat akun':recover?'Simpan password baru':'Masuk';document.getElementById('emailAuthMessage').textContent='';hideAllPasswords();}
async function emailAuthRequest(action,body){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{const response=await cloudNativeFetch('/api/auth/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal});let data;try{data=await response.json();}catch{throw Error('Server belum merespons dengan benar. Silakan coba lagi.');}if(!response.ok)throw Error(data.error||'Permintaan belum berhasil.');return data;}catch(error){if(controller.signal.aborted)throw Error('Koneksi terlalu lama. Periksa internet, lalu coba lagi.');throw error;}finally{clearTimeout(timeout);}}
document.getElementById('emailAuthForm').onsubmit=async e=>{e.preventDefault();const button=document.getElementById('emailSubmit'),message=document.getElementById('emailAuthMessage');button.disabled=true;message.textContent='Memproses…';try{const body={email:document.getElementById('emailAddress').value,displayName:document.getElementById('emailName').value,password:document.getElementById('emailPassword').value,confirm:document.getElementById('emailConfirm').value,recoveryCode:document.getElementById('emailRecovery').value};await emailAuthRequest(emailAuthMode==='register'?'register':emailAuthMode==='recover'?'recover':'login',body);document.getElementById('emailPassword').value='';document.getElementById('emailConfirm').value='';document.getElementById('emailRecovery').value='';message.textContent='';if(window.SidapsLoginExperience)await window.SidapsLoginExperience.authenticated();else location.reload();}catch(error){message.textContent=error.message;}finally{button.disabled=false;}};

const FIREBASE_WEB_CONFIG={"apiKey":"AIzaSyBoiv_DYguZua_-0Ls43mEqYAMXsVDWmcg","authDomain":"sidaps-portfolio.firebaseapp.com","projectId":"sidaps-portfolio","storageBucket":"sidaps-portfolio.firebasestorage.app","messagingSenderId":"810538821573","appId":"1:810538821573:web:0fb00cdb12304c54d94dac"};
function correctGoogleLoginOrigin(){if(location.hostname!=='sidaps-portfolio.sidaps.workers.dev.')return false;const url=new URL(location.href);url.hostname='sidaps-portfolio.sidaps.workers.dev';location.replace(url.href);return true;}
// Domain failures can outlive an authorization change in an already-open SDK instance.
async function showGoogleDomainRecovery(message){
 let allowed=false;
 try{const response=await cloudNativeFetch('https://identitytoolkit.googleapis.com/v1/projects?key='+encodeURIComponent(FIREBASE_WEB_CONFIG.apiKey),{signal:AbortSignal.timeout(5000)});if(response.ok){const config=await response.json();allowed=Array.isArray(config.authorizedDomains)&&config.authorizedDomains.includes(location.hostname);}}catch{}
 message.textContent=allowed?'Izin login untuk alamat ini sudah aktif. Muat ulang halaman, lalu pilih akun Google kembali.':'Login Google belum tersedia pada alamat ini. Buka alamat resmi Sidaps untuk melanjutkan.';
 message.setAttribute('data-state','error');const help=document.getElementById('googleAuthHelp');if(help)help.hidden=false;
}\r

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
 try{const {authSdk,auth,provider}=firebaseGoogleSdk,result=await authSdk.signInWithPopup(auth,provider);message.textContent='Menghubungkan akun…';const idToken=await result.user.getIdToken();await emailAuthRequest('google',{idToken});authSdk.signOut(auth).catch(()=>{});if(window.SidapsLoginExperience)await window.SidapsLoginExperience.authenticated();else location.reload();}
 catch(error){const messages={'auth/popup-closed-by-user':'Login Google dibatalkan.','auth/cancelled-popup-request':'Jendela login sebelumnya dibatalkan.','auth/popup-blocked':'Browser memblokir jendela Google. Izinkan popup untuk website ini lalu coba lagi.','auth/unauthorized-domain':'Domain website belum diizinkan untuk login Google.','auth/network-request-failed':'Koneksi ke Google terputus. Periksa internet, lalu coba lagi.'};message.setAttribute('data-state','error');if(error.code==='auth/unauthorized-domain')await showGoogleDomainRecovery(message);else message.textContent=messages[error.code]||'Login Google belum berhasil. Silakan coba lagi.';try{firebaseGoogleSdk.authSdk.signOut(firebaseGoogleSdk.auth).catch(()=>{});}catch{}}
 finally{button.disabled=false;}
}
if(!getAuth())prepareGoogleSignIn();

cloudAuthSetMode('login');</script><script src="/recovery-otp.js?v=6" defer></script><script src="/login-experience.js?v=4" defer></script></body></html>`;
