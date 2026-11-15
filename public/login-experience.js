/* Progressive, login-only enhancement. Existing authentication owns every request. */
(()=>{
 const root=document.documentElement,entry=document.getElementById('loginEntry'),intro=document.getElementById('sidapsIntro'),form=document.getElementById('emailAuthForm');
 if(!entry||!form)return;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 let busy=false,success=false,introTimer=null,transition=null;
 function finishIntro(focus=false){
  clearTimeout(introTimer);clearTimeout(window.sidapsIntroWatchdog);root.classList.remove('login-intro-pending');entry.inert=false;entry.removeAttribute('aria-hidden');
  if(intro){intro.hidden=true;intro.setAttribute('aria-hidden','true');}
  if(focus)document.getElementById('authTitle')?.focus({preventScroll:true});
 }
 window.SidapsLoginExperience={skipIntro:()=>finishIntro(true),async authenticated(){
  if(success)return;success=true;finishIntro();
  const message=document.getElementById('emailAuthMessage');message.textContent='Berhasil. Membuka portofoliomu…';message.setAttribute('data-state','success');
  document.body.classList.add('login-leaving');
  if(!reduced?.matches&&!document.hidden)await new Promise(resolve=>setTimeout(resolve,180));
  location.reload();
 }};
 // Replay on every login-page load and back/forward restoration, without storage.
 function startIntro(){
  clearTimeout(introTimer);clearTimeout(window.sidapsIntroWatchdog);
  if(reduced?.matches||!intro||document.hidden){finishIntro();return;}
  root.classList.remove('login-intro-pending');
  intro.hidden=false;intro.setAttribute('aria-hidden','false');entry.inert=true;entry.setAttribute('aria-hidden','true');
  // One layout read resets the finite CSS sequence, including a restored page.
  void intro.offsetWidth;root.classList.add('login-intro-pending');
  introTimer=setTimeout(()=>finishIntro(),2280);
 }
 document.getElementById('introSkip')?.addEventListener('click',()=>finishIntro(true));
 intro?.querySelector('img')?.addEventListener('error',()=>finishIntro(),{once:true});
 startIntro();
 document.addEventListener('visibilitychange',()=>{if(document.hidden){document.body.setAttribute('data-page-hidden','');finishIntro();transition?.cancel();}else document.body.removeAttribute('data-page-hidden');});
 reduced?.addEventListener?.('change',event=>{if(event.matches){finishIntro();transition?.cancel();}});
 function setBusy(kind,on){
  busy=on;
  if(on)document.body.setAttribute('data-auth-busy',kind);else document.body.removeAttribute('data-auth-busy');
  form.setAttribute('aria-busy',String(on));
  const email=document.getElementById('emailSubmit'),google=document.getElementById('googleSignInButton');
  email.setAttribute('aria-busy',String(on&&kind==='email'));google?.setAttribute('aria-busy',String(on&&kind==='google'));
 }
 const submit=form.onsubmit;
 if(typeof submit==='function')form.onsubmit=async function(event){
  if(busy||success){event.preventDefault();return;}
  finishIntro();setBusy('email',true);
  try{return await submit.call(this,event);}finally{if(!success)setBusy('email',false);}
 };
 const google=window.googleSignIn;
 if(typeof google==='function')window.googleSignIn=async function(){
  if(busy||success||document.getElementById('googleSignInButton')?.disabled)return;
  finishIntro();setBusy('google',true);
  try{return await google();}finally{if(!success)setBusy('google',false);}
 };
 const mode=window.cloudAuthSetMode;
 if(typeof mode==='function')window.cloudAuthSetMode=function(value){
  if(busy||success)return;
  mode(value);document.getElementById('emailAuthMessage')?.removeAttribute('data-state');
  document.querySelectorAll('[aria-invalid=true]').forEach(input=>{input.removeAttribute('aria-invalid');input.setCustomValidity('');});
  if(!reduced?.matches&&!document.hidden&&typeof form.animate==='function'){
   transition?.cancel();transition=form.animate([{opacity:.4,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'ease-out'});
  }
 };
 // Stop mode switches and duplicate button activation while an existing request is pending.
 entry.addEventListener('click',event=>{if((busy||success)&&event.target.closest('button,a')){event.preventDefault();event.stopImmediatePropagation();}},true);
 form.addEventListener('invalid',event=>{
  const input=event.target;input.setAttribute('aria-invalid','true');
  if(input.validity.typeMismatch)input.setCustomValidity('Masukkan alamat email yang valid, misalnya nama@email.com.');
  else if(input.validity.valueMissing)input.setCustomValidity('Lengkapi kolom ini terlebih dahulu.');
 },true);
 form.addEventListener('input',event=>{if(event.target.matches('input')){event.target.setCustomValidity('');event.target.removeAttribute('aria-invalid');}});
 window.addEventListener('pageshow',event=>{if(event.persisted){success=false;setBusy('email',false);document.body.classList.remove('login-leaving');startIntro();}});
})();
