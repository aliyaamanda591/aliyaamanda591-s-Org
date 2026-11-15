export const loginAuthCardHtml = `<section class="authcard" aria-labelledby="authTitle">
<div class="auth-intro">
<div class="auth-intro-copy">
<h1 tabindex="-1" id="authTitle" style="font-size:25px;margin:0 0 10px;color:#f2f5fa">Selamat datang</h1>
<p id="authSub">Masuk untuk melanjutkan catatan investasimu.</p>
</div>
</div>
<div class="cloud-signin">
<form id="emailAuthForm">
<div class="field" id="emailNameField" hidden><label for="emailName">Nama tampilan</label>
<div class="login-input"><svg class="login-field-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="7" r="4"/>
<path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg><input id="emailName" minlength="2" maxlength="60" autocomplete="name">
</div>
</div>
<div class="field"><label for="emailAddress">Email</label>
<div class="login-input"><svg class="login-field-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="3"/>
<path d="m4 7 8 6 8-6"/></svg><input id="emailAddress" type="email" required maxlength="254" autocomplete="username" placeholder="nama@email.com">
</div>
</div>
<div class="field" id="emailRecoveryField" hidden><label for="emailRecovery">Kode pemulihan</label>
<div class="login-input"><svg class="login-field-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="5"/>
<path d="m12 12 9 9m-3-3 2-2m-5-1 2-2"/></svg><input id="emailRecovery" autocomplete="off" maxlength="80" placeholder="Kode yang disimpan saat mendaftar">
</div>
</div>
<div class="field"><label for="emailPassword">Kata sandi</label>
<div class="password-control"><svg class="login-field-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="10" width="14" height="11" rx="3"/>
<path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/></svg><input id="emailPassword" type="password" required minlength="8" maxlength="72" autocomplete="current-password"><button type="button" class="password-toggle" data-password-target="emailPassword" aria-controls="emailPassword" aria-label="Tampilkan sandi" aria-pressed="false" onclick="togglePasswordVisibility(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>
<path class="eye-slash" d="m3 3 18 18"/></svg></button>
</div>
</div>
<div class="field" id="emailConfirmField" hidden><label for="emailConfirm">Ulangi kata sandi</label>
<div class="password-control"><svg class="login-field-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="10" width="14" height="11" rx="3"/>
<path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/></svg><input id="emailConfirm" type="password" required minlength="8" maxlength="72" autocomplete="new-password"><button type="button" class="password-toggle" data-password-target="emailConfirm" aria-controls="emailConfirm" aria-label="Tampilkan sandi" aria-pressed="false" onclick="togglePasswordVisibility(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>
<path class="eye-slash" d="m3 3 18 18"/></svg></button>
</div>
</div>
<p class="profile-message" id="emailAuthMessage" role="status">
</p>
<div class="login-recovery-link"><button type="button" onclick="cloudAuthSetMode('recover')">Lupa sandi?</button>
</div><button type="submit" class="btn primary" id="emailSubmit">Masuk</button>
</form>
<div class="google-divider"><span>atau</span>
</div><button type="button" id="googleSignInButton" class="google-signin-button" onclick="googleSignIn()" disabled><svg viewBox="0 0 24 24" aria-hidden="true">
<path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.9-1.8 3-4.2 3-7.2z"/>
<path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.4c-.9.6-2 1-3.4 1-2.6 0-4.9-1.8-5.7-4.2H3v2.5A10 10 0 0 0 12 22z"/>
<path fill="#FBBC05" d="M6.3 13.9a6 6 0 0 1 0-3.8V7.6H3a10 10 0 0 0 0 8.8z"/>
<path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.6 9.6 0 0 0 12 2a10 10 0 0 0-9 5.6l3.3 2.5C7.1 7.7 9.4 5.9 12 5.9z"/></svg><span id="googleSignInText">Memuat login Google…</span></button>
<p id="googleAuthMessage" class="google-auth-message" role="status" aria-live="polite">
</p>
<div id="googleAuthHelp" class="google-auth-help" hidden><button type="button" onclick="location.reload()">Muat ulang halaman</button><a href="https://sidaps-portfolio.sidaps.workers.dev/?login=1" target="_top">Buka alamat resmi ↗</a>
</div>
<div class="email-auth-links"><span class="new-account-hint">Belum punya akun?</span><button type="button" onclick="cloudAuthSetMode('login')">Masuk</button><button type="button" onclick="cloudAuthSetMode('register')">Daftar</button>
</div><a class="demo-entry" href="/?demo=1">▷ Coba demo tanpa daftar</a>
<p class="signup-privacy" id="registerSecurityNote" hidden>Gunakan kata sandi minimal 8 karakter. Jika lupa kata sandi, kamu bisa meresetnya kapan saja lewat tautan yang dikirim ke emailmu. Portofolio setiap pengguna bersifat pribadi.</p>
</div>
</section>
</div>
</main>`;
