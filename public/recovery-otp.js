/* Email OTP recovery; the existing login, signup, and Google flows are retained. */
(()=>{
 const form=document.getElementById('emailAuthForm'),email=document.getElementById('emailAddress'),oldField=document.getElementById('emailRecoveryField');
 if(!form||!email||!oldField||typeof window.cloudAuthSetMode!=='function')return;
 const password=document.getElementById('emailPassword'),confirm=document.getElementById('emailConfirm'),submit=document.getElementById('emailSubmit'),message=document.getElementById('emailAuthMessage');
 const passwordField=password.closest('.field'),confirmField=document.getElementById('emailConfirmField');
 const field=document.createElement('div');field.className='field';field.id='emailOtpField';field.hidden=true;
 field.innerHTML='<label for="emailOtp">OTP dari email</label><input id="emailOtp" class="recovery-otp-input" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" minlength="6" maxlength="6" placeholder="6 digit OTP" aria-describedby="emailOtpHint"><small id="emailOtpHint">Berlaku 10 menit. Jangan bagikan OTP kepada siapa pun.</small>';
 oldField.before(field);const otp=document.getElementById('emailOtp');
 const actions=document.createElement('div');actions.className='recovery-otp-actions';actions.hidden=true;
 actions.innerHTML='<button type="button" class="btn soft" id="otpResend">Kirim ulang OTP</button><button type="button" class="btn ghost" id="otpChangeEmail">Ganti email</button><button type="button" class="btn ghost" id="otpUseLegacy">Pakai kode pemulihan lama</button>';
 submit.after(actions);
 const resend=document.getElementById('otpResend'),change=document.getElementById('otpChangeEmail'),legacy=document.getElementById('otpUseLegacy');
 const baseMode=window.cloudAuthSetMode,baseSubmit=form.onsubmit;
 let recovering=false,stage='email',requestId='',sentEmail='',retryAt=0,timer=null,busy=false;
 function notice(text,state){message.textContent=text;message.setAttribute('data-state',state);}
 function updateCountdown(){
  clearTimeout(timer);if(!recovering||stage!=='verify')return;
  const seconds=Math.max(0,Math.ceil((retryAt-Date.now())/1000));resend.textContent=seconds?'Kirim ulang dalam '+seconds+' dtk':'Kirim ulang OTP';resend.disabled=busy||seconds>0;
  if(seconds)timer=setTimeout(updateCountdown,1000);
 }
 function render(){
  field.hidden=!recovering||stage!=='verify';otp.required=recovering&&stage==='verify';
  oldField.hidden=!recovering||stage!=='legacy';document.getElementById('emailRecovery').required=recovering&&stage==='legacy';
  const needsPassword=!recovering||stage!=='email';passwordField.hidden=!needsPassword;password.required=needsPassword;
  if(recovering){confirmField.hidden=stage==='email';confirm.required=stage!=='email';}
  email.readOnly=recovering&&stage==='verify';actions.hidden=!recovering;resend.hidden=change.hidden=stage!=='verify';
  legacy.textContent=stage==='legacy'?'Gunakan OTP email':'Pakai kode pemulihan lama';
  if(recovering){document.getElementById('authSub').textContent=stage==='legacy'?'Kode lama tetap tersedia sebagai cadangan.':stage==='verify'?'Periksa email dan folder Spam, lalu masukkan OTP dan sandi baru.':'Kirim OTP ke email terdaftar. Tidak perlu kode pemulihan yang dulu disimpan.';submit.textContent=stage==='email'?'Kirim OTP ke email':'Simpan sandi baru';}
  updateCountdown();
 }
 function setMode(value){if(busy)return;clearTimeout(timer);baseMode(value);recovering=value==='recover';stage='email';requestId='';sentEmail='';otp.value='';email.readOnly=false;passwordField.hidden=false;render();}
 window.cloudAuthSetMode=setMode;
 function emailStage(){if(busy)return;requestId='';stage='email';otp.value='';password.value=confirm.value='';render();notice('Masukkan email terdaftar, lalu minta OTP.','');email.focus();}
 change.onclick=emailStage;
 resend.onclick=()=>{if(busy||Date.now()<retryAt)return;emailStage();form.requestSubmit();};
 legacy.onclick=()=>{if(busy)return;if(stage==='legacy'){setMode('recover');return;}clearTimeout(timer);stage='legacy';requestId='';otp.value='';password.value=confirm.value='';render();notice('Gunakan kode lama hanya jika masih tersimpan.','');};
 form.onsubmit=async function(event){
  if(!recovering||stage==='legacy')return baseSubmit.call(this,event);
  event.preventDefault();if(busy)return;busy=true;submit.disabled=true;legacy.disabled=change.disabled=resend.disabled=true;
  notice(stage==='email'?'Mengirim permintaan OTP…':'Memeriksa OTP dan menyimpan sandi…','');
  try{
   if(stage==='email'){
    const data=await emailAuthRequest('request-otp',{email:email.value});
    requestId=data.requestId;sentEmail=email.value;retryAt=Date.now()+data.retryAfter*1000;stage='verify';render();notice(data.message,'success');otp.focus();
   }else{
    await emailAuthRequest('reset-otp',{email:sentEmail,requestId,otp:otp.value.trim(),password:password.value,confirm:confirm.value});
    busy=false;const address=sentEmail;setMode('login');email.value=address;notice('Sandi berhasil diperbarui. Masuk dengan sandi baru.','success');password.focus();
   }
  }catch(error){notice(error.message||'Pemulihan belum berhasil. Coba lagi.','error');}
  finally{busy=false;submit.disabled=false;legacy.disabled=change.disabled=false;updateCountdown();}
 };
 window.addEventListener('pagehide',()=>clearTimeout(timer));
 render();
})();
