export const loginHeadHtml = `<!doctype html><html id="sidaps-portfolio" lang="id" data-sidaps-theme="dark" data-login-experience="emerald">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#071b16">
<meta name="robots" content="noindex">
<title>Masuk · Sidaps Portfolio</title>
<link rel="icon" href="/favicon.svg">
<link rel="preconnect" href="https://www.gstatic.com" crossorigin>
<link rel="preconnect" href="https://identitytoolkit.googleapis.com" crossorigin>
<link rel="preconnect" href="https://sidaps-portfolio.firebaseapp.com" crossorigin>
<script>(()=>{try{const root=document.documentElement,reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!reduce){root.classList.add('login-intro-pending');window.sidapsIntroWatchdog=setTimeout(()=>{root.classList.remove('login-intro-pending');const intro=document.getElementById('sidapsIntro'),entry=document.getElementById('loginEntry');if(intro){intro.hidden=true;intro.setAttribute('aria-hidden','true');}if(entry){entry.inert=false;entry.removeAttribute('aria-hidden');}},3200);}}catch{}})();</script>
<link rel="preload" href="/sidaps-mark.svg" as="image" type="image/svg+xml">
<style>
*{box-sizing:border-box}
body{margin:0;background:#101a28;color:#dce5f0;font-family:Inter,"Segoe UI",Arial,sans-serif}
#authBack{min-height:100dvh;display:flex;align-items:center}
.auth-entry{width:100%}
.auth-intro-copy{min-width:0}
.field{display:flex;flex-direction:column;gap:7px}
.cloud-signin form{display:flex;flex-direction:column}
.cloud-signin p{margin:0}
.field[hidden],[hidden]{display:none!important}
input{width:100%;font:inherit;padding:11px 13px}
.password-control{position:relative;display:flex;width:100%;align-items:center}
.password-control input{padding-right:49px}
.password-toggle{position:absolute;right:2px;top:2px;bottom:2px;width:42px;display:grid;place-items:center;border:0;border-radius:8px;background:transparent;cursor:pointer}
.password-toggle svg{width:21px;height:21px;fill:none}
.eye-slash{display:none}
.password-toggle[aria-pressed=true] .eye-slash{display:block}
.btn{font:600 12px inherit;border:1px solid #41536a;border-radius:9px;padding:12px 16px;cursor:pointer;background:#233347;color:#f1f5fa;min-height:44px}
.btn:disabled,button:disabled{opacity:.6;cursor:wait}
.email-auth-links{display:flex;justify-content:center;flex-wrap:wrap}
.email-auth-links button{border:0;background:none;cursor:pointer;font-family:inherit}
.google-divider{display:flex;align-items:center;gap:12px}
.google-divider:before,.google-divider:after{content:'';flex:1;height:1px}
.google-signin-button{display:flex;align-items:center;justify-content:center;width:100%;gap:12px;cursor:pointer;font-family:inherit}
.google-signin-button svg{width:20px;height:20px}
.google-auth-message{text-align:center}
.signup-privacy{font-size:10px;line-height:1.85;margin-top:18px!important}
.modalback{display:none;position:fixed;inset:0;z-index:50;padding:20px;background:#080f1be6;align-items:center;justify-content:center;overflow:auto}
.modalback.show{display:flex}
.modal{max-width:480px;width:100%;padding:25px;border:1px solid #41536a;border-radius:16px;background:#192638}
.modal h3{font-size:20px;margin-top:0}
.modal p{font-size:12px;line-height:1.8;color:#b5c6da}
.codebox{padding:15px;border:1px solid #41536a;border-radius:10px;font-size:16px;line-height:1.9;word-break:break-all;color:#e9d19e;margin:18px 0}
.profile-message:empty{display:none}
</style>
<link rel="stylesheet" href="/theme.css?v=2">
<link rel="stylesheet" href="/readability.css?v=1">
<link rel="stylesheet" href="/aqua-theme.css?v=1">
<link rel="stylesheet" href="/responsive-system.css?v=1">
<link rel="stylesheet" href="/controls-polish.css?v=1">
<link rel="stylesheet" href="/login-refinement.css?v=1">
<link rel="stylesheet" href="/demo-mode.css?v=1">
<link rel="stylesheet" href="/emerald-gold.css?v=2">
<link rel="stylesheet" href="/login-experience.css?v=1">
<link rel="stylesheet" href="/recovery-otp.css?v=4">
</head>
<body class="login-page">`;
