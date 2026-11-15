/* Sidaps Portfolio — Dedicated, Distraction-Free Password Reset & New Password Experience */
(() => {
  const form = document.getElementById('emailAuthForm');
  const email = document.getElementById('emailAddress');
  const oldField = document.getElementById('emailRecoveryField');
  if (!form || !email || !oldField || typeof window.cloudAuthSetMode !== 'function') return;

  const authBack = document.getElementById('authBack');
  const introCopy = document.querySelector('.auth-intro-copy');
  const password = document.getElementById('emailPassword');
  const confirm = document.getElementById('emailConfirm');
  const submit = document.getElementById('emailSubmit');
  const message = document.getElementById('emailAuthMessage');
  const emailField = email.closest('.field');
  const passwordField = password ? password.closest('.field') : null;
  const passwordLabel = passwordField ? passwordField.querySelector('label[for="emailPassword"]') : null;
  const confirmField = document.getElementById('emailConfirmField');
  const confirmLabel = confirmField ? confirmField.querySelector('label[for="emailConfirm"]') : null;
  const securityNote = document.getElementById('registerSecurityNote');

  // Upgrade password minLength from 12 to 8 across login and settings forms
  ['emailPassword', 'emailConfirm', 'cloudOldPassword', 'cloudNewPassword', 'cloudConfirmPassword'].forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.getAttribute('minlength') === '12') {
      el.setAttribute('minlength', '8');
    }
  });
  const newPwLabel = document.querySelector('label[for="cloudNewPassword"]');
  if (newPwLabel && newPwLabel.textContent.includes('12')) {
    newPwLabel.textContent = newPwLabel.textContent.replace('12', '8');
  }
  if (securityNote) {
    securityNote.textContent =
      'Gunakan kata sandi minimal 8 karakter. Jika lupa kata sandi, kamu bisa mengatur ulang sandi kapan saja melalui tautan email resmi.';
  }

  // Extract either a branded Sidaps ?token= or a Firebase ?oobCode= from any pasted URL or raw string
  function extractResetCredential(rawInput) {
    const trimmed = String(rawInput || '').trim();
    if (!trimmed) return null;
    try {
      const parsed = new URL(trimmed);
      const token = parsed.searchParams.get('token');
      if (token) return { type: 'token', value: token.trim() };
      const oob = parsed.searchParams.get('oobCode');
      if (oob) return { type: 'oobCode', value: oob.trim() };
      const nestedLink = parsed.searchParams.get('link') || parsed.searchParams.get('continueUrl');
      if (nestedLink) {
        const inner = new URL(nestedLink);
        const innerToken = inner.searchParams.get('token');
        if (innerToken) return { type: 'token', value: innerToken.trim() };
        const innerCode = inner.searchParams.get('oobCode');
        if (innerCode) return { type: 'oobCode', value: innerCode.trim() };
      }
    } catch {
      const tokenMatch = trimmed.match(/[?&]token=([^&#\s]+)/i);
      if (tokenMatch && tokenMatch[1]) {
        try {
          return { type: 'token', value: decodeURIComponent(tokenMatch[1]) };
        } catch {
          return { type: 'token', value: tokenMatch[1] };
        }
      }
      const oobMatch = trimmed.match(/[?&]oobCode=([^&#\s]+)/i);
      if (oobMatch && oobMatch[1]) {
        try {
          return { type: 'oobCode', value: decodeURIComponent(oobMatch[1]) };
        } catch {
          return { type: 'oobCode', value: oobMatch[1] };
        }
      }
    }
    if (!trimmed.includes(' ') && !trimmed.includes('http') && trimmed.length >= 16) {
      if (/^[a-f0-9]{48,128}(\.[A-Za-z0-9_-]+)?$/i.test(trimmed)) {
        return { type: 'token', value: trimmed };
      }
      return { type: 'oobCode', value: trimmed };
    }
    return null;
  }

  // Subtle step icon badge at top of header
  const stepBadge = document.createElement('div');
  stepBadge.className = 'reset-step-badge';
  stepBadge.hidden = true;
  stepBadge.setAttribute('aria-hidden', 'true');
  if (introCopy) {
    introCopy.prepend(stepBadge);
  }

  // Subtle non-editable account chip under subtitle
  const accountChip = document.createElement('div');
  accountChip.className = 'reset-account-chip';
  accountChip.hidden = true;
  if (introCopy) {
    introCopy.appendChild(accountChip);
  }

  // Clean, concise instructions for the 'sent' stage (no manual copy-paste required)
  const sentGuide = document.createElement('div');
  sentGuide.className = 'reset-sent-guide';
  sentGuide.id = 'resetSentGuide';
  sentGuide.hidden = true;
  sentGuide.innerHTML =
    '<p class="reset-sent-title">Langkah selanjutnya</p>' +
    '<ul class="reset-sent-list">' +
    '<li>Buka email dari <strong>Sidaps Portfolio</strong> dan klik tombol <strong>Buat Kata Sandi Baru</strong>.</li>' +
    '<li>Periksa folder <strong>Spam</strong> atau <strong>Promosi</strong> bila email belum terlihat.</li>' +
    '<li>Tautan berlaku selama 15 menit dan hanya dapat dipakai satu kali.</li>' +
    '</ul>';
  submit.before(sentGuide);

  // Quiet footer navigation for reset mode
  const actions = document.createElement('div');
  actions.className = 'recovery-otp-actions';
  actions.hidden = true;
  actions.innerHTML =
    '<button type="button" class="btn soft" id="otpResend" hidden>Kirim ulang tautan</button>' +
    '<button type="button" id="otpBackToLogin">← Kembali ke halaman Masuk</button>';
  submit.after(actions);

  const resendBtn = document.getElementById('otpResend');
  const backBtn = document.getElementById('otpBackToLogin');
  const baseMode = window.cloudAuthSetMode;
  const baseSubmit = form.onsubmit;

  let activeCredential = extractResetCredential(window.location.href);
  let recovering = false;
  let stage = activeCredential ? 'oob-reset' : 'email'; // 'email' | 'sent' | 'oob-reset'
  let sentEmail = '';
  let verifiedEmail = '';
  let retryAt = 0;
  let timer = null;
  let busy = false;

  const ICON_KEY =
    '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  const ICON_MAIL =
    '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>';
  const ICON_SHIELD =
    '<svg viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10V7l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg>';
  const ICON_USER =
    '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.8-3.5 5-5 8-5s6.2 1.5 8 5"/></svg>';

  function notice(text, state) {
    if (!message) return;
    message.textContent = text;
    if (state) message.setAttribute('data-state', state);
    else message.removeAttribute('data-state');
  }

  function updateCountdown() {
    clearTimeout(timer);
    if (!recovering || stage !== 'sent') {
      if (resendBtn) resendBtn.hidden = true;
      return;
    }
    const seconds = Math.max(0, Math.ceil((retryAt - Date.now()) / 1000));
    if (resendBtn) {
      resendBtn.hidden = false;
      resendBtn.textContent = seconds
        ? 'Kirim ulang tautan (' + seconds + ' dtk)'
        : 'Kirim ulang tautan ke email';
      resendBtn.disabled = busy || seconds > 0;
    }
    if (seconds > 0) {
      timer = setTimeout(updateCountdown, 1000);
    }
  }

  function render() {
    oldField.hidden = true;
    const oldInput = document.getElementById('emailRecovery');
    if (oldInput) oldInput.required = false;

    if (!recovering) {
      if (authBack) authBack.removeAttribute('data-reset-stage');
      stepBadge.hidden = true;
      accountChip.hidden = true;
      actions.hidden = true;
      sentGuide.hidden = true;
      submit.hidden = false;
      if (emailField) emailField.hidden = false;
      email.required = true;
      email.readOnly = false;
      if (passwordLabel) passwordLabel.textContent = 'Kata sandi';
      if (confirmLabel) confirmLabel.textContent = 'Ulangi kata sandi';
      if (password) password.placeholder = '';
      if (confirm) confirm.placeholder = '';
      return;
    }

    if (authBack) authBack.setAttribute('data-reset-stage', stage);
    actions.hidden = false;

    const isOob = stage === 'oob-reset';
    const isSent = stage === 'sent';
    const isEmail = stage === 'email';

    stepBadge.hidden = false;
    stepBadge.innerHTML = isOob ? ICON_SHIELD : isSent ? ICON_MAIL : ICON_KEY;

    const targetDisplay = verifiedEmail || sentEmail || (isSent ? email.value.trim() : '');
    if ((isSent || isOob) && targetDisplay) {
      accountChip.hidden = false;
      accountChip.innerHTML = ICON_USER + '<span></span>';
      const span = accountChip.querySelector('span');
      if (span) span.textContent = targetDisplay;
    } else {
      accountChip.hidden = true;
    }

    sentGuide.hidden = !isSent;

    if (emailField) {
      emailField.hidden = !isEmail;
    }
    email.required = isEmail;
    email.readOnly = !isEmail;

    if (passwordField) {
      passwordField.hidden = !isOob;
      password.required = isOob;
      if (isOob) {
        password.minLength = 8;
        password.placeholder = 'Minimal 8 karakter';
      }
    }
    if (confirmField) {
      confirmField.hidden = !isOob;
      confirm.required = isOob;
      if (isOob) {
        confirm.minLength = 8;
        confirm.placeholder = 'Ketik ulang kata sandi baru';
      }
    }
    if (passwordLabel) {
      passwordLabel.textContent = isOob ? 'Kata sandi baru' : 'Kata sandi';
    }
    if (confirmLabel) {
      confirmLabel.textContent = isOob ? 'Konfirmasi kata sandi baru' : 'Ulangi kata sandi';
    }

    const titleEl = document.getElementById('authTitle');
    const subEl = document.getElementById('authSub');
    if (titleEl) {
      titleEl.textContent = isOob
        ? 'Kata sandi baru'
        : isSent
          ? 'Cek email kamu'
          : 'Lupa kata sandi';
    }
    if (subEl) {
      subEl.textContent = isOob
        ? 'Masukkan kata sandi baru minimal 8 karakter untuk mengamankan akunmu.'
        : isSent
          ? 'Tautan atur ulang kata sandi telah dikirim. Klik tautan di email tersebut untuk melanjutkan.'
          : 'Masukkan email akunmu untuk menerima tautan pembuatan kata sandi baru.';
    }

    submit.hidden = isSent;
    submit.textContent = isOob ? 'Simpan kata sandi baru' : 'Kirim tautan reset';
    updateCountdown();
  }

  async function verifyAndActivateReset(candidate) {
    const parsed = typeof candidate === 'string' ? extractResetCredential(candidate) : candidate;
    if (!parsed || !parsed.value) {
      notice('Tautan belum valid. Pastikan kamu menyalin tautan lengkap dari email.', 'error');
      return false;
    }
    busy = true;
    notice('', '');
    try {
      let emailFromCode = '';
      const payload = parsed.type === 'token' ? { token: parsed.value } : { oobCode: parsed.value };
      const res = await emailAuthRequest('verify-reset', payload);
      if (res && res.ok === false) {
        throw new Error(res.error || 'Tautan reset sandi tidak valid atau sudah kedaluwarsa.');
      }
      emailFromCode = res.email || '';

      activeCredential = parsed;
      if (emailFromCode) {
        verifiedEmail = emailFromCode;
        email.value = emailFromCode;
      }
      stage = 'oob-reset';
      render();
      notice('', '');
      if (password) password.focus();
      return true;
    } catch (error) {
      notice(error.message || 'Tautan reset tidak valid atau sudah kedaluwarsa.', 'error');
      return false;
    } finally {
      busy = false;
    }
  }

  function setMode(value) {
    if (busy) return;
    clearTimeout(timer);
    baseMode(value);
    recovering = value === 'recover';
    if (!recovering && password) {
      password.minLength = value === 'login' ? 1 : 8;
    }
    if (!recovering && confirm) {
      confirm.minLength = 8;
    }
    if (recovering) {
      stage = activeCredential ? 'oob-reset' : 'email';
    }
    if (passwordField && !recovering) {
      passwordField.hidden = false;
      password.required = true;
    }
    if (emailField && !recovering) {
      emailField.hidden = false;
      email.required = true;
    }
    notice('', '');
    render();
  }

  window.cloudAuthSetMode = setMode;

  if (backBtn) {
    backBtn.onclick = () => {
      if (busy) return;
      activeCredential = null;
      verifiedEmail = '';
      if (window.history && (window.location.search.includes('oobCode') || window.location.search.includes('token'))) {
        window.history.replaceState({}, '', '/?login=1');
      }
      setMode('login');
      if (sentEmail) email.value = sentEmail;
      notice('', '');
    };
  }

  if (resendBtn) {
    resendBtn.onclick = () => {
      if (busy || Date.now() < retryAt) return;
      stage = 'email';
      render();
      form.requestSubmit();
    };
  }

  form.onsubmit = async function (event) {
    if (!recovering) return baseSubmit.call(this, event);
    event.preventDefault();
    if (busy) return;
    busy = true;
    submit.disabled = true;
    if (backBtn) backBtn.disabled = true;
    if (resendBtn) resendBtn.disabled = true;

    try {
      if (stage === 'oob-reset') {
        const newPass = password.value;
        const confirmPass = confirm.value;
        if (newPass.length < 8) {
          throw new Error('Kata sandi baru minimal 8 karakter.');
        }
        if (newPass !== confirmPass) {
          throw new Error('Konfirmasi kata sandi baru belum sama.');
        }
        if (!activeCredential || !activeCredential.value) {
          throw new Error('Tautan reset tidak valid atau sudah kedaluwarsa.');
        }
        notice('Menyimpan kata sandi baru…', '');
        const resetPayload =
          activeCredential.type === 'token'
            ? { token: activeCredential.value, password: newPass, confirm: confirmPass }
            : { oobCode: activeCredential.value, password: newPass, confirm: confirmPass };
        await emailAuthRequest('confirm-reset', resetPayload);
        activeCredential = null;
        if (window.history && (window.location.search.includes('oobCode') || window.location.search.includes('token'))) {
          window.history.replaceState({}, '', '/');
        }
        notice('Kata sandi berhasil diperbarui. Membuka portofoliomu…', 'success');
        if (window.SidapsLoginExperience) {
          await window.SidapsLoginExperience.authenticated();
        } else {
          location.href = '/';
        }
      } else {
        const targetEmail = email.value.trim();
        notice('Mengirim tautan ke email…', '');
        const data = await emailAuthRequest('request-otp', { email: targetEmail });
        sentEmail = targetEmail;
        retryAt = Date.now() + (data.retryAfter || 60) * 1000;
        stage = 'sent';
        notice('', '');
        render();
      }
    } catch (error) {
      notice(error.message || 'Permintaan belum berhasil. Silakan coba lagi.', 'error');
    } finally {
      busy = false;
      submit.disabled = false;
      if (backBtn) backBtn.disabled = false;
      updateCountdown();
    }
  };

  window.addEventListener('pagehide', () => clearTimeout(timer));

  if (activeCredential) {
    setMode('recover');
    verifyAndActivateReset(activeCredential);
    setTimeout(() => {
      if (window.SidapsLoginExperience && typeof window.SidapsLoginExperience.skipIntro === 'function') {
        window.SidapsLoginExperience.skipIntro();
      }
    }, 0);
  } else {
    render();
  }
})();
