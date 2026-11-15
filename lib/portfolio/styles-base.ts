export const portfolioStylesBaseHtml = `<!DOCTYPE html>
<html id="sidaps-portfolio" lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sidaps Portfolio</title>

<style>
:root{--navy:#102b55;--blue:#2463c7;--bg:#f3f6fb;--ink:#17243a;--muted:#6d7c91;--line:#dce5ef;--green:#07865d;--red:#d94343}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.5 Inter,system-ui,Segoe UI,Arial,sans-serif}
header{background:linear-gradient(115deg,#102b55,#245fa8);color:white;padding:20px max(18px,calc((100% - 1180px)/2))}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:12px}
.logo{width:42px;height:42px;border-radius:13px;background:#ffffff20;display:grid;place-items:center;font-size:22px}
.brand h1{margin:0;font-size:21px}
.brand p{margin:2px 0 0;color:#dceaff;font-size:12px}
#dateNow{text-align:right;font-size:12px;color:#e3edff}
main{max-width:1180px;margin:22px auto;padding:0 16px}
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
.tab,.btn{border:1px solid var(--line);border-radius:10px;padding:10px 15px;font:700 13px inherit;cursor:pointer;transition:.15s}
.tab{background:white;color:#40536d}
.tab.active{background:var(--navy);color:white;border-color:var(--navy)}
.btn:hover,.tab:hover{filter:brightness(.97);transform:translateY(-1px)}
.primary{background:var(--blue);border-color:var(--blue);color:white}
.soft{background:#edf3fb;color:#24466f}
.danger{background:#fff0f0;border-color:#ffe0e0;color:#b93434}
.panel{display:none}
.panel.active{display:block}
.head{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap;margin:0 0 15px}
.head h2{margin:0;font-size:19px}
.head p{margin:3px 0 0;color:var(--muted);font-size:12px}
.toolbar{display:flex;gap:8px;flex-wrap:wrap}
.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:15px}
.card{background:white;border:1px solid var(--line);border-radius:15px;padding:16px;box-shadow:0 4px 14px #17365d08}
.label{font-size:11px;color:var(--muted);font-weight:800;letter-spacing:.45px}
.metric{font-size:clamp(17px,2vw,23px);font-weight:850;margin-top:6px;overflow-wrap:anywhere}
.green{color:var(--green)}
.red{color:var(--red)}
.notice{background:#fff8e5;border:1px solid #f1dfa6;color:#705811;border-radius:11px;padding:11px 13px;margin:12px 0;font-size:12px}
.section{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:20px 0 10px}
.section h3{margin:0;font-size:16px}
.assetgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.asset h3{font-size:14px;margin:0}
.assetTop{display:flex;justify-content:space-between;gap:8px}
.tag{border-radius:20px;background:#e8f7f0;color:#08734d;font-size:10px;font-weight:800;padding:4px 8px;white-space:nowrap}
.tag.manual{background:#f0f2f6;color:#69788c}
.price{font-size:20px;font-weight:850;margin:10px 0}
.assetrow{display:flex;justify-content:space-between;gap:10px;font-size:12px;color:var(--muted);margin:5px 0}
.assetrow b{color:#34465f;text-align:right}
.assetrow b.green{color:var(--green)}
.assetrow b.red{color:var(--red)}
.actions{display:flex;gap:7px;margin-top:12px;flex-wrap:wrap}
.actions .btn{font-size:11px;padding:7px 10px}
.tablewrap{overflow:auto;background:white;border:1px solid var(--line);border-radius:13px}
table{border-collapse:collapse;width:100%;min-width:720px}
th,td{padding:11px 12px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}
th{background:#f8faff;color:var(--muted);font-size:10px;letter-spacing:.4px}
tbody tr:hover{background:#f8fbff}
.pill{display:inline-block;padding:3px 8px;border-radius:20px;background:#e8f7f0;color:#08734d;font-size:10px;font-weight:800}
.pill.out{background:#fff0f0;color:#b93434}
.formgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.field{display:flex;flex-direction:column;gap:5px}
.field label{font-size:11px;font-weight:800;color:var(--muted)}
input,select{width:100%;min-height:41px;padding:9px 11px;border:1px solid #ccd8e8;border-radius:9px;background:white;color:var(--ink);font:inherit}
input:focus,select:focus{outline:2px solid #c5d9fa;border-color:var(--blue)}
.formactions{grid-column:1/-1;display:flex;gap:8px;flex-wrap:wrap}
.muted{color:var(--muted);font-size:12px}
.status{display:flex;align-items:center;gap:7px;color:var(--muted);font-size:12px}
.dot{width:8px;height:8px;border-radius:50%;background:#aab5c4}
.dot.live{background:#0a9b69}
.empty{text-align:center;color:var(--muted);padding:25px}
.modalback{display:none;position:fixed;inset:0;background:#07172d80;z-index:4;align-items:center;justify-content:center;padding:15px}
.modalback.show{display:flex}
.modal{background:white;border-radius:16px;padding:20px;width:min(520px,100%)}
.modal h3{margin:0 0 4px}
.modal p{font-size:12px;color:var(--muted);margin:0 0 15px}
.modalactions{display:flex;justify-content:flex-end;gap:8px;margin-top:15px}
footer{text-align:center;color:#8290a4;font-size:11px;padding:24px}
@media(max-width:800px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.assetgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
.formgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:540px){header{padding:16px}
.brand h1{font-size:18px}
.grid{gap:8px}
.card{padding:12px}
.assetgrid,.formgrid{grid-template-columns:1fr}
.formactions{grid-column:1}
.assetgrid{gap:9px}
main{padding:0 10px;margin:14px auto}
.tab{padding:9px 11px;font-size:12px}
}

/* ===== TEMA PROFESIONAL ===== */
:root{--navy:#0b1f3f;--blue:#2f6bff;--violet:#6a4dff;--teal:#00b8a9;--amber:#f5a524;--pink:#ec4899;--bg:#eef2f9;--ink:#13203a;--muted:#66768c;--line:#e1e8f3;--green:#04a46a;--red:#e5484d;--grad:linear-gradient(135deg,#2f6bff,#6a4dff)}
body{font-family:Inter,"Segoe UI",system-ui,Arial,sans-serif;background:radial-gradient(900px 380px at 90% -60px,#d9e6ff 0,transparent 70%),radial-gradient(700px 360px at -10% 80px,#ece3ff 0,transparent 65%),var(--bg);background-attachment:fixed}
header{position:relative;overflow:hidden;background:linear-gradient(120deg,#0b1f3f 0%,#173a85 48%,#5a3fd4 100%);padding:28px max(18px,calc((100% - 1180px)/2));box-shadow:0 10px 30px #0b1f3f33}
header::before{content:"";position:absolute;right:-90px;top:-140px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,#ffffff2b,transparent 70%)}
header::after{content:"";position:absolute;left:30%;bottom:-170px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,#38d6c433,transparent 70%)}
.top{position:relative;z-index:1}
.logo{width:48px;height:48px;border-radius:15px;background:linear-gradient(135deg,#4f8bff,#a06bff);box-shadow:0 8px 20px #00000040,inset 0 1px 0 #ffffff55;font-weight:800}
.brand h1{font-size:23px;letter-spacing:-.3px}
.brand p{letter-spacing:.8px;font-size:11px;opacity:.85}
#dateNow{background:#ffffff1a;border:1px solid #ffffff30;padding:8px 14px;border-radius:12px;backdrop-filter:blur(6px);font-weight:600}
.tabs{display:inline-flex;background:white;padding:6px;border-radius:16px;border:1px solid var(--line);box-shadow:0 6px 20px #1b3a7012;margin-top:-4px}
.tab{border:0;background:transparent;border-radius:11px;color:#51627c;padding:10px 17px}
.tab:hover{background:#eef3ff;filter:none}
.tab.active{background:var(--grad);color:white;box-shadow:0 6px 16px #4a5df066}
.btn{border-radius:11px}
.primary{background:var(--grad);border:0;box-shadow:0 6px 16px #4a5df055}
.primary:hover{box-shadow:0 8px 22px #4a5df080}
.soft{background:#eaf0ff;border-color:#d8e3ff;color:#2d4fa8}
.danger{background:#fff1f2;border-color:#ffd9dc;color:#c0343a}
.head h2{font-size:22px;letter-spacing:-.3px}
.card{border-radius:18px;border-color:#e4ebf6;box-shadow:0 8px 26px #1b3a7012}
.grid .card{position:relative;overflow:hidden;padding:18px 18px 18px 22px;transition:.2s}
.grid .card:hover{transform:translateY(-3px);box-shadow:0 14px 32px #1b3a7022}
.grid .card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px}
.grid .card::after{content:"";position:absolute;right:-26px;top:-26px;width:90px;height:90px;border-radius:50%;opacity:.13}
.grid .card:nth-child(1)::before,.grid .card:nth-child(1)::after{background:linear-gradient(180deg,#2f6bff,#6a4dff)}
.grid .card:nth-child(2)::before,.grid .card:nth-child(2)::after{background:linear-gradient(180deg,#00b8a9,#06d6a0)}
.grid .card:nth-child(3)::before,.grid .card:nth-child(3)::after{background:linear-gradient(180deg,#f5a524,#ff7a45)}
.grid .card:nth-child(4)::before,.grid .card:nth-child(4)::after{background:linear-gradient(180deg,#ec4899,#8b5cf6)}
.label{letter-spacing:.9px;font-size:10.5px}
.metric{font-size:clamp(18px,2.1vw,26px);letter-spacing:-.4px}
.notice{background:linear-gradient(135deg,#fff9e8,#fff3d6);border:1px solid #f4dfa0;border-left:5px solid var(--amber);color:#6b520d;border-radius:13px}
.section h3{font-size:17px;display:flex;align-items:center;gap:9px}
.section h3::before{content:"";width:5px;height:18px;border-radius:4px;background:var(--grad)}
.status{background:white;border:1px solid var(--line);padding:5px 12px;border-radius:20px}
.asset{position:relative;overflow:hidden;padding-top:20px;transition:.2s}
.asset::before{content:"";position:absolute;left:0;right:0;top:0;height:5px;background:var(--grad)}
.asset:hover{transform:translateY(-4px);box-shadow:0 16px 34px #1b3a7024}
.assetgrid .asset:nth-child(6n+1)::before{background:linear-gradient(90deg,#2f6bff,#38b6ff)}
.assetgrid .asset:nth-child(6n+2)::before{background:linear-gradient(90deg,#8b5cf6,#c084fc)}
.assetgrid .asset:nth-child(6n+3)::before{background:linear-gradient(90deg,#f7931a,#ffc15e)}
.assetgrid .asset:nth-child(6n+4)::before{background:linear-gradient(90deg,#00b8a9,#34e0a1)}
.assetgrid .asset:nth-child(6n+5)::before{background:linear-gradient(90deg,#e0a800,#ffd95a)}
.assetgrid .asset:nth-child(6n)::before{background:linear-gradient(90deg,#ec4899,#ff8fb8)}
.asset h3{font-size:15px;font-weight:800;letter-spacing:.2px}
.price{font-size:23px;letter-spacing:-.5px;background:linear-gradient(135deg,#0b1f3f,#2f4ea8);-webkit-background-clip:text;background-clip:text;color:transparent}
.tag{background:linear-gradient(135deg,#d9f8ea,#c4f2de);color:#05734b;border:1px solid #b5ecd4}
.tag.manual{background:#f1f3f8;color:#66768c;border-color:#e3e8f1}
.assetrow{padding:4px 0;border-bottom:1px dashed #e8eef7}
.assetrow:last-of-type{border-bottom:0}
.assetrow b.green{background:#e6f8f0;padding:1px 8px;border-radius:8px}
.assetrow b.red{background:#fff0f1;padding:1px 8px;border-radius:8px}
.tablewrap{border-radius:16px;box-shadow:0 8px 24px #1b3a7010;border-color:#e4ebf6}
th{background:linear-gradient(180deg,#f4f7ff,#ebf0fb);color:#52627c;padding:13px 12px}
tbody tr{transition:.12s}
tbody tr:hover{background:#f3f7ff}
.pill{background:linear-gradient(135deg,#d9f8ea,#c4f2de);color:#05734b}
.pill.out{background:linear-gradient(135deg,#ffe3e5,#ffd3d6);color:#c0343a}
input,select{border-radius:11px;border-color:#d3dff0;background:#fbfcff}
input:focus,select:focus{outline:3px solid #cfdcff;border-color:var(--blue);background:white}
.modalback{backdrop-filter:blur(4px);background:#0b1f3f99}
.modal{border-radius:20px;box-shadow:0 30px 70px #0b1f3f66;border-top:5px solid var(--violet)}
footer{padding:30px;font-weight:500}
@media(max-width:540px){.tabs{display:flex;width:100%}
.tab{flex:1;padding:9px 6px}
}
/* ===== LOGIN & DEVELOPER ===== */
.authback{display:none;position:fixed;inset:0;z-index:20;align-items:center;justify-content:center;padding:18px;background:linear-gradient(120deg,#0b1f3f,#173a85 50%,#5a3fd4)}
.authback.show{display:flex}
.authcard{width:min(420px,100%);background:white;border-radius:22px;padding:28px;box-shadow:0 30px 80px #0008}
.authlogo{width:52px;height:52px;border-radius:16px;background:var(--grad);color:white;display:grid;place-items:center;font-size:26px;margin-bottom:12px}
.authcard h2{margin:0 0 4px;font-size:22px}
.authcard form{display:flex;flex-direction:column;gap:12px;margin-top:14px}
.authmsg{color:var(--red);font-size:12px;font-weight:700;min-height:16px}
.authalt{display:block;text-align:center;margin-top:14px;font-size:12px;color:var(--blue);cursor:pointer;font-weight:700}
.codebox{font:800 22px/1 ui-monospace,Consolas,monospace;letter-spacing:2px;text-align:center;background:#f3f6ff;border:2px dashed #9db5ff;border-radius:14px;padding:18px;margin:14px 0;user-select:all}
body.locked main,body.locked footer{display:none}
#userChip{display:none;align-items:center;gap:10px;background:#ffffff1a;border:1px solid #ffffff30;padding:6px 8px 6px 6px;border-radius:14px;color:white;font-size:12px;line-height:1.25}
.avatar{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#4f8bff,#a06bff);display:grid;place-items:center;font-weight:800}
#userChip small{display:block;font-size:9px;letter-spacing:.8px;opacity:.8}
textarea{width:100%;min-height:260px;border:1px solid #d3dff0;border-radius:11px;padding:12px;font:12px/1.5 ui-monospace,Consolas,monospace;background:#fbfcff}
pre{margin:0;overflow:auto;max-height:280px;font:12px/1.5 ui-monospace,Consolas,monospace;background:#0f1d36;color:#cfe0ff;padding:14px;border-radius:12px}
/* ===== ANIMASI LOGIN: SAHAM & CRYPTO ===== */
.authback{background:#060d22;overflow:hidden}
.authback::before,.authback::after,.authglow{content:"";position:absolute;border-radius:50%;filter:blur(80px);opacity:.55;animation:drift 14s ease-in-out infinite alternate;pointer-events:none}
.authback::before{width:560px;height:560px;left:-140px;top:-140px;background:#2f6bff}
.authback::after{width:520px;height:520px;right:-120px;bottom:-120px;background:#ec4899;animation-delay:-6s}
.authglow{width:420px;height:420px;left:45%;top:10%;background:#00d1b2;opacity:.35;animation-duration:18s;animation-delay:-3s}
@keyframes drift{0%{transform:translate(0,0) scale(1)}
100%{transform:translate(90px,60px) scale(1.25)}
}
#authCanvas{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.coins{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
.coin{position:absolute;left:var(--x);bottom:-90px;width:var(--s);height:var(--s);animation:rise var(--d) linear var(--dl) infinite;will-change:transform}
.coin i{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;font-style:normal;font-weight:800;font-size:calc(var(--s)*.42);line-height:1;color:#fff;text-shadow:0 2px 4px #0006;background:radial-gradient(circle at 30% 25%,var(--c2),var(--c1));box-shadow:0 0 26px var(--c1),inset 0 -5px 9px #0004,inset 0 3px 6px #fff7;animation:spin 5s linear infinite}
@keyframes rise{0%{transform:translate(0,0)}
50%{transform:translate(26px,-60vh)}
100%{transform:translate(-12px,-125vh)}
}
@keyframes spin{to{transform:rotateY(360deg)}
}
.ticker{position:absolute;left:0;right:0;z-index:2;overflow:hidden;background:#060d22a6;backdrop-filter:blur(6px);padding:9px 0;pointer-events:none}
.ticker.top{top:0;border-bottom:1px solid #ffffff1f}
.ticker.bot{bottom:0;border-top:1px solid #ffffff1f}
.tkTrack{display:flex;gap:38px;width:max-content;animation:tick 45s linear infinite}
.ticker.top .tkTrack{animation-direction:reverse}
.tkTrack span{display:flex;gap:8px;align-items:center;font:700 12px/1 Inter,system-ui,sans-serif;color:#dbe6ff;white-space:nowrap}
.tkTrack i{font-style:normal;padding:3px 8px;border-radius:20px;font-size:11px}
.tkTrack i.up{background:#10d98a26;color:#35f0a4}
.tkTrack i.dn{background:#ff4d6d26;color:#ff7b92}
@keyframes tick{to{transform:translateX(-50%)}
}
.authcard{position:relative;z-index:3;background:#ffffffF2;backdrop-filter:blur(10px);box-shadow:0 0 0 1px #ffffff55,0 30px 80px #000a,0 0 70px #7c5cff55;animation:cardIn .7s cubic-bezier(.2,.9,.3,1.2)}
.authlogo{animation:logoPulse 2.6s ease-in-out infinite}
@keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(.96)}
to{opacity:1;transform:none}
}
@keyframes logoPulse{0%,100%{box-shadow:0 0 0 0 #6a4dff66}
50%{box-shadow:0 0 0 12px #6a4dff00}
}
@media(prefers-reduced-motion:reduce){.coin,.coin i,.tkTrack,.authback::before,.authback::after,.authglow,.authlogo{animation:none}
}

/* Dashboard: movement is decorative; every number remains actual portfolio data. */
.portfolio-banner{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:18px;background:linear-gradient(115deg,#142e61,#473b9d);border:1px solid #ffffff33;border-radius:20px;padding:22px 25px;color:white;margin-bottom:20px;box-shadow:0 10px 25px #233f7620}
.portfolio-banner::after{content:'';position:absolute;width:220px;height:220px;right:8%;top:-150px;border:35px solid #ffffff0b;border-radius:50%;animation:bannerGlow 8s ease-in-out infinite alternate;pointer-events:none}
.portfolio-banner h2{font-size:22px;margin:5px 0}
.portfolio-banner p{margin:0;color:#d5e1ff;font-size:12px}
.eyebrow{font-size:10px;font-weight:800;letter-spacing:1.5px;color:#a6dfff}
.market-art{display:flex;align-items:flex-end;gap:7px;height:54px;padding-right:18px}
.market-art i{display:block;width:12px;border-radius:4px 4px 0 0;background:linear-gradient(#60e9c7,#5393ff);height:var(--h);animation:barFloat 3s ease-in-out var(--delay) infinite alternate;transform-origin:bottom}
@keyframes bannerGlow{to{transform:translate(80px,50px)}
}
@keyframes barFloat{to{transform:scaleY(.68);opacity:.7}
}
@keyframes assetEnter{from{opacity:0;transform:translateY(12px)}
to{opacity:1;transform:none}
}
.asset{animation:assetEnter .4s ease both}
.asset:nth-child(3n+2){animation-delay:.05s}
.asset:nth-child(3n){animation-delay:.1s}
.company{font-size:11px;color:var(--muted);margin:5px 0 0;min-height:17px}
.quote-meta{font-size:10px;color:#74829a;line-height:1.6;margin-top:9px;overflow-wrap:anywhere;min-height:32px}
.tag.cached{background:#fff6df;border-color:#f4dfa0;color:#8c6414}
.tag.loading{background:#eaf0ff;border-color:#d8e3ff;color:#3157ac}
.quote-status{font-size:11px;color:#789;white-space:normal;max-width:500px}
.status{align-items:flex-start}
.dot{flex-shrink:0;margin-top:5px}
.scroll-transactions{max-height:320px;overflow:auto;overscroll-behavior:contain;scrollbar-color:#8aa7e3 #edf2fb;scrollbar-width:thin}
.scroll-transactions th{position:sticky;top:0;z-index:1}
.scroll-hint{font-size:11px;color:var(--muted);margin:8px 0 0}
.scroll-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.scroll-tools .btn{padding:7px 10px;font-size:11px}
.portfolio-table td small{display:block;font-size:10px;color:var(--muted)}
.modal{max-height:92vh;overflow:auto}
.purchase-preview{padding:12px;background:#eef4ff;border-radius:11px;font-size:12px;color:#355482;margin-top:12px}
.asset-picker{margin-bottom:14px}
.price-updating{animation:statusPulse 1.2s ease-in-out infinite alternate}
@keyframes statusPulse{to{opacity:.45}
}
.modal .formgrid{grid-template-columns:1fr 1fr}
.full-field{grid-column:1/-1}
@media(max-width:540px){.portfolio-banner{padding:18px}
.portfolio-banner h2{font-size:19px}
.market-art{gap:4px;padding:0}
.market-art i{width:8px}
.section{align-items:flex-start;flex-wrap:wrap}
.status{max-width:100%}
.modal .formgrid{grid-template-columns:1fr}
.modal .full-field{grid-column:1}
.assetTop{flex-wrap:wrap}
}
@media(prefers-reduced-motion:reduce){.asset,.market-art i,.portfolio-banner::after,.price-updating{animation:none!important}
*{scroll-behavior:auto!important}
}
/* Embedded asset logos */
.asset-identity{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
.asset-logo{width:42px;height:42px;flex:0 0 42px;display:inline-flex;align-items:center;justify-content:center;overflow:hidden;border-radius:13px;background:#f5f8ff;border:1px solid #e4ebf6;color:#2f5eae;font-size:11px;font-weight:800;letter-spacing:.2px}
.asset-logo img,.asset-logo svg{display:block;width:100%;height:100%;object-fit:contain}
.asset-identity h3{margin:0;overflow-wrap:anywhere}
.assetTop{align-items:center;gap:9px}
.asset .company{margin-top:8px}
.asset-logo.small{width:34px;height:34px;flex-basis:34px;border-radius:10px}
.portfolio-identity{display:flex;align-items:center;gap:10px}
.portfolio-identity small{max-width:260px;white-space:normal}
.asset-catalog{max-height:255px;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:5px;background:#f8faff;scrollbar-width:thin;overscroll-behavior:contain}
.catalog-option{display:flex;align-items:center;gap:10px;width:100%;border:1px solid transparent;background:transparent;text-align:left;padding:9px;border-radius:10px;cursor:pointer;color:var(--ink);font:inherit}
.catalog-option:hover{background:#edf2ff}
.catalog-option[aria-pressed="true"]{background:#eaf0ff;border-color:#789bff}
.catalog-option:focus-visible{outline:2px solid var(--blue);outline-offset:-2px}
.catalog-option:disabled{cursor:default;opacity:.55}
.catalog-option .catalog-copy{flex:1;min-width:0}
.catalog-copy b{font-size:12px}
.catalog-copy small{display:block;color:var(--muted);font-size:10px;line-height:1.4}
.catalog-mark{font-size:10px;color:#596b90;font-weight:700;flex-shrink:0}
.asset-selection{display:flex;align-items:center;gap:10px;padding:12px;margin-top:10px;border-radius:12px;background:#eef4ff}
.asset-selection[hidden]{display:none}
.asset-selection small{display:block;color:var(--muted);font-size:11px}
.asset-selection b{font-size:13px}
@media(max-width:540px){.asset-logo{width:38px;height:38px;flex-basis:38px}
.asset-catalog{max-height:225px}
}
/* Password visibility controls */
.password-control{position:relative;display:flex;align-items:center;width:100%}
.password-control input{padding-right:50px;min-height:44px}
.password-toggle{position:absolute;right:2px;top:2px;bottom:2px;width:42px;display:grid;place-items:center;padding:9px;border:0;border-radius:8px;background:transparent;color:#536b95;cursor:pointer;touch-action:manipulation}
.password-toggle svg{width:21px;height:21px;pointer-events:none}
.password-toggle:hover{color:#2f6bff;background:#edf2ff}
.password-toggle:focus-visible{outline:2px solid #2f6bff;outline-offset:-2px;background:#edf2ff}
.password-toggle[aria-pressed="true"]{color:#2f6bff}
.password-toggle .eye-slash{display:none}
.password-toggle[aria-pressed="true"] .eye-slash{display:block}
/* Illustrated login card and colorful ambient background */
.authback{background:radial-gradient(ellipse at 12% 12%,#142b68 0,transparent 52%),radial-gradient(ellipse at 90% 85%,#371651 0,transparent 48%),#070f25;padding:50px 18px;isolation:isolate}
.authcard{width:min(440px,100%);padding:25px;border:1px solid #dce7ff;border-radius:26px;background:radial-gradient(ellipse at 0% 0%,#dbf6ff 0,transparent 55%),radial-gradient(ellipse at 100% 5%,#e7dcff 0,transparent 55%),radial-gradient(ellipse at 100% 100%,#e3eaff 0,transparent 60%),linear-gradient(145deg,#f0f5ff,#f7f2ff 60%,#eaf8fa);box-shadow:0 0 0 5px #9bafff12,0 25px 80px #030b22aa,0 0 65px #796aff32;max-height:calc(100dvh - 100px);overflow-y:auto;scrollbar-width:thin;scrollbar-color:#b1c3e8 transparent}
.auth-intro{display:grid;grid-template-columns:116px minmax(0,1fr);align-items:center;gap:12px;padding-bottom:17px;margin-bottom:4px;border-bottom:1px solid #93aee433;position:relative}
.auth-illustration{position:relative;align-self:center;width:116px;height:128px;display:grid;place-items:center;pointer-events:none}
.auth-illustration::before{content:'';position:absolute;width:110px;height:110px;border-radius:50%;background:radial-gradient(circle,#b9e0ff66,transparent 70%)}
.auth-illustration img{position:relative;width:128px;height:128px;max-width:none;object-fit:contain;mix-blend-mode:multiply;filter:drop-shadow(0 5px 5px #35558b0d)}
.auth-intro-copy{min-width:0}
.auth-kicker{display:flex;align-items:center;gap:6px;font-size:8px;font-weight:800;letter-spacing:1px;color:#586ba3;margin-bottom:9px}
.authcard .authlogo{display:grid;place-items:center;flex:0 0 23px;width:23px;height:23px;border-radius:7px;font-size:15px;margin:0;animation:none;box-shadow:0 3px 8px #6a4dff26}
.authcard h2{font-size:23px;line-height:1.25;margin-bottom:6px;letter-spacing:-.5px;color:#172c52}
.auth-intro-copy #authSub{font-size:11px;line-height:1.65;color:#526585}
.auth-guide{display:inline-flex;align-items:center;gap:5px;font-size:9px;color:#4e60a2;margin-top:9px;font-weight:600}
.auth-guide span{font-size:15px;color:#6552d8}
.authcard input{background:#ffffffc7;border-color:#c6d5ed;box-shadow:0 2px 5px #29456b04}
.authcard input:focus{background:#fff;outline:3px solid #b4ccff66}
.authcard .field label{color:#52658a;letter-spacing:.5px;font-size:10px}
.authcard .password-toggle:hover{background:#e5edff}
.authcard form{gap:13px;margin-top:17px}
.authcard #authBtn{min-height:44px;box-shadow:0 7px 18px #5c57df3d}
.authcard .authalt{margin-top:16px}
.authcard .authmsg:empty{display:none}
.authcard .authmsg{line-height:1.5}
.auth-aurora,.auth-sparkles{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.auth-aurora{z-index:0}
.aurora-ribbon{position:absolute;width:85vw;height:30vw;min-width:600px;min-height:200px;opacity:.3;filter:blur(48px);border-radius:50%;will-change:transform}
.ribbon-one{left:-25%;top:8%;background:linear-gradient(100deg,#2463ff22,#4c56ff 35%,#bb52e8 66%,#13d6d7);transform:rotate(-28deg);animation:auroraSweep 18s ease-in-out infinite alternate}
.ribbon-two{right:-35%;bottom:-8%;background:linear-gradient(110deg,#00dfb9,#2779ff 40%,#f258b8 72%,#ffa853);animation:auroraSweepTwo 22s ease-in-out -9s infinite alternate;opacity:.25}
.aurora-orbit{position:absolute;width:420px;height:420px;border-radius:50%;border:1px solid #87bbff18;box-shadow:0 0 0 35px #b487ff05,0 0 0 75px #87bbff05}
.aurora-orbit::before{content:'';position:absolute;top:39px;left:62px;width:8px;height:8px;border-radius:50%;background:#82f3ef;box-shadow:0 0 20px #82f3ef,0 0 45px #82f3ef88}
.orbit-one{top:-170px;right:-100px;animation:orbitTurn 35s linear infinite}
.orbit-two{width:320px;height:320px;left:-130px;bottom:-100px;animation:orbitTurn 42s linear infinite reverse}
.orbit-two::before{top:27px;left:50px;background:#ffb8df;box-shadow:0 0 20px #f888ce}
.auth-sparkles{z-index:1}
.auth-sparkles i{position:absolute;left:var(--spark-x);top:var(--spark-y);height:4px;width:4px;border-radius:50%;background:var(--spark-color);color:var(--spark-color);box-shadow:0 0 10px currentColor;opacity:.4;animation:sparkleDrift 7s ease-in-out var(--spark-delay) infinite}
.auth-sparkles i:nth-child(3n){width:3px;height:3px}
.auth-sparkles i:nth-child(4n)::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:1px solid currentColor;opacity:.35}
@keyframes auroraSweep{from{transform:translate(-4%,0) rotate(-28deg) scale(.9)}
to{transform:translate(17%,22%) rotate(-12deg) scale(1.15)}
}
@keyframes auroraSweepTwo{from{transform:translate(0,0) rotate(-25deg)}
to{transform:translate(-18%,-20%) rotate(8deg)}
}
@keyframes orbitTurn{to{transform:rotate(360deg)}
}
@keyframes sparkleDrift{0%,100%{transform:translateY(0) scale(.7);opacity:.15}
50%{transform:translateY(-22px) scale(1.2);opacity:.8}
}
.authback:not(.show) .aurora-ribbon,.authback:not(.show) .aurora-orbit,.authback:not(.show) .auth-sparkles i{animation-play-state:paused}
@media(max-width:400px){.authcard{padding:20px;border-radius:22px}
.auth-intro{grid-template-columns:92px minmax(0,1fr);gap:10px}
.auth-illustration{width:92px;height:108px}
.auth-illustration img{width:108px;height:108px}
.authcard h2{font-size:21px}
.auth-kicker{font-size:7px;letter-spacing:.6px}
.auth-guide{font-size:8px}
.aurora-ribbon{filter:blur(30px)}
}
@media(prefers-reduced-motion:reduce){.aurora-ribbon,.aurora-orbit,.auth-sparkles i,.authcard{animation:none!important}
.aurora-ribbon{will-change:auto}
}
/* PlusJakartaSans — SIL Open Font License 1.1. License bundled in HTML below. */
@font-face{font-family:"PlusJakartaSans";src:url("/shell-assets/89b3fb38aa0d275d.ttf") format("truetype");font-weight:100 900;font-style:normal;;font-display:swap;}
/* Outfit — SIL Open Font License 1.1. License bundled in HTML below. */
@font-face{font-family:"Outfit";src:url("/shell-assets/fc7287273e669297.ttf") format("truetype");font-weight:100 900;font-style:normal;;font-display:swap;}
/* JetBrainsMono — SIL Open Font License 1.1. License bundled in HTML below. */
@font-face{font-family:"JetBrainsMono";src:url("/shell-assets/48715a42ec242c21.ttf") format("truetype");font-weight:100 900;font-style:normal;;font-display:swap;}

/* Consistent typography across login, dashboard, forms, tables and developer tools. */
:root{--font-body:"PlusJakartaSans","Segoe UI",sans-serif;--font-display:"Outfit","PlusJakartaSans",sans-serif;--font-code:"JetBrainsMono",Consolas,monospace}
body{font-family:var(--font-body);font-weight:400;line-height:1.65;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
button,input,select,option,textarea{font-family:var(--font-body)}
.btn,.tab{font-family:var(--font-body);font-size:12px;font-weight:700;line-height:1.5}
.brand h1,.head h2,.section h3,.modal h3,.authcard h2,.portfolio-banner h2,.asset h3{font-family:var(--font-display);font-weight:600;letter-spacing:-.25px}
.brand h1{font-weight:600;letter-spacing:-.4px}
.asset h3{font-size:17px;font-weight:650}
.metric,.price{font-family:var(--font-display);font-weight:650;font-variant-numeric:tabular-nums lining-nums;letter-spacing:-.5px}
.metric{line-height:1.3}
.price{font-size:25px;line-height:1.35}
.label,.field label,th,.eyebrow,.auth-kicker{font-family:var(--font-body);font-weight:700;letter-spacing:.65px}
.label,th{font-size:10px}
td,.assetrow b,.quote-meta,#dateNow,.codebox{font-variant-numeric:tabular-nums lining-nums}
.company,.muted,.quote-meta,.auth-intro-copy #authSub{font-family:var(--font-body)}
.tkTrack span{font-family:var(--font-body);font-weight:600}
.codebox,textarea,pre{font-family:var(--font-code);font-variant-ligatures:none}
.avatar,.logo,.authlogo{font-family:var(--font-display)}
.log-count{display:inline-flex;padding:3px 9px;border-radius:20px;background:#e9edff;color:#5664b3;font:600 11px/1.5 var(--font-body)}
.log-help{margin:-2px 0 12px;font-size:11px;color:var(--muted)}
.log-viewport{max-height:330px;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#9cb0db #f0f4fb}
.log-viewport th{position:sticky;top:0;z-index:1}
.log-viewport td{font-size:12px;padding:11px 14px}
.log-viewport td:first-child{color:#718098;width:185px}
.log-event{display:inline-flex;align-items:center;gap:7px;font-weight:500;white-space:normal}
.log-event::before{content:'';flex:0 0 6px;width:6px;height:6px;border-radius:50%;background:#7185c4}
.log-event.success::before{background:#0ba876}
.log-event.failed::before{background:#e15b6d}
.log-pagination{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 2px 0}
.log-pagination p{margin:0;font-size:11px;color:var(--muted)}
.log-pagination .toolbar{gap:6px}
.log-pagination .btn{font-size:11px;padding:7px 10px}
.log-pagination .btn:disabled{cursor:default;opacity:.4;transform:none}
.log-page-info{min-width:85px;text-align:center;color:#506180;font-size:11px;align-self:center;font-weight:600}
@media(max-width:540px){.log-pagination{gap:10px}
.log-pagination .toolbar{width:100%;justify-content:space-between}
.log-viewport{max-height:290px}
.asset h3{font-size:16px}
}
.tag.closed{background:#edf1f8;color:#566783;border-color:#dce4f0}
.market-session{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:600;color:#6d7b91;margin:1px 0 9px;line-height:1.5}
.market-session>span{width:6px;height:6px;border-radius:50%;background:#93a0b7;flex:0 0 6px}
.market-session.open{color:#07815c}
.market-session.open>span{background:#0cae78}
.market-session.break,.market-session.closing,.market-session.opening{color:#a46f1f}
.market-session.break>span,.market-session.closing>span,.market-session.opening>span{background:#e9ae4a}
.idx-market-summary{margin:0 0 12px;padding:9px 12px;border-radius:10px;border:1px solid #dde5f3;background:#f6f8ff;font-size:11px;color:#66758c}
.idx-market-summary.open{color:#087454;background:#eefaf5;border-color:#cceee0}
.stock-formula-details{margin-top:10px;font-size:11px;color:var(--muted)}
.stock-formula-details summary{cursor:pointer;color:#4b62a8;font-weight:700;padding:5px 0}
.stock-formula-details textarea{min-height:150px;margin:8px 0;font-size:11px}
.stock-formula-details p{line-height:1.7}
.market-session.open>span{box-shadow:0 0 0 3px #0cae7818;animation:marketWorking 2s ease-in-out infinite}
.idx-market-summary.open::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:7px;background:#0cae78;box-shadow:0 0 0 3px #0cae7818}
@keyframes marketWorking{50%{box-shadow:0 0 0 5px #0cae7808}
}
@media(prefers-reduced-motion:reduce){.market-session.open>span{animation:none}
}
/* Sale, archive and spacious account workspace */
.sell-btn{background:#e7f8f2;border-color:#c3e9dd;color:#08745a}
.archive-btn{background:transparent;border-color:#e1e7f0;color:#74829a}
.actions .archive-btn{margin-left:auto}
.btn:disabled{opacity:.4;cursor:default;transform:none;box-shadow:none}
.portfolio-row-actions{display:flex;gap:6px}
.metric-note{font-size:10px;color:var(--muted);margin-top:7px;line-height:1.6}
.sale-preview{padding:13px 15px;background:#ecf9f4;color:#256852;border:1px solid #d1eddf;border-radius:12px;font-size:12px;margin-top:15px;line-height:1.8}
.sale-method{font-size:11px!important;line-height:1.7;margin-top:12px!important}
.sale-archive{display:flex;align-items:flex-start;gap:9px;font-size:12px;color:#4f637e;line-height:1.6;margin:14px 0}
.sale-archive input{width:16px;min-height:16px;height:16px;flex:0 0 16px;margin-top:2px;accent-color:#2f6bff}
.sell-all{background:none;border:0;color:#3271c2;font:600 10px var(--font-body);padding:3px 0;text-align:left;cursor:pointer}
.archived-holdings{margin:24px 0 16px}
.archived-holdings summary{font-weight:600;color:#677c9d;cursor:pointer;margin-bottom:12px}
.archived-asset-row{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:14px 0;border-bottom:1px solid #edf1f7}
.archived-asset-row:first-child{padding-top:0}
.archived-asset-row:last-child{border-bottom:0;padding-bottom:0}
.archived-empty{margin:0;padding:6px 0}
#developer{padding-bottom:24px}
.admin-hero{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:30px 32px;border-radius:22px;background:linear-gradient(120deg,#132a4c,#254a80 65%,#46539a);color:#fff;box-shadow:0 12px 32px #14294b1a}
.admin-hero::after{content:'';position:absolute;right:8%;top:-110px;width:300px;height:300px;border:45px solid #ffffff06;border-radius:50%;pointer-events:none}
.admin-profile{display:flex;align-items:center;gap:20px;position:relative;z-index:1}
.admin-avatar{width:76px;height:76px;flex:0 0 76px;display:grid;place-items:center;border:1px solid #ffffff45;border-radius:22px;background:linear-gradient(145deg,#ffffff29,#ffffff0d);font:500 28px var(--font-display);box-shadow:inset 0 1px 0 #ffffff24}
.admin-eyebrow{font-size:9px;font-weight:600;letter-spacing:1.8px;color:#c0d3f4}
.admin-profile h2{font:500 29px/1.2 var(--font-display);letter-spacing:-.4px;margin:6px 0 12px;overflow-wrap:anywhere}
.admin-roles{display:flex;gap:7px;flex-wrap:wrap}
.admin-roles span{font-size:10px;font-weight:600;letter-spacing:.2px;border:1px solid #ffffff2b;background:#ffffff11;padding:4px 10px;border-radius:7px}
.admin-account{display:flex;align-items:center;gap:10px;position:relative;z-index:1;font-size:12px}
.admin-account small{display:block;color:#b8cce9;font-size:10px;margin-top:3px}
.local-account-dot{height:8px;width:8px;background:#64ddb2;border-radius:50%;box-shadow:0 0 0 4px #64ddb21c}
.admin-meta{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:10px;color:#7a89a0;padding:13px 3px 22px}
.admin-stats{gap:16px;margin-bottom:27px}
.admin-stats .card{background:#ffffffd9;border-radius:14px;box-shadow:none;padding:18px!important}
.admin-stats .card::before,.admin-stats .card::after{display:none}
.admin-stats .metric{margin-top:8px;font-size:21px!important}
.admin-stats .card:hover{transform:none;box-shadow:none}
.dev-workspace{display:grid;grid-template-columns:205px minmax(0,1fr);gap:26px;align-items:start}
.dev-sidebar{position:sticky;top:20px;padding:19px 12px;background:#ffffffa8;border:1px solid #e2e8f3;border-radius:17px}
.dev-nav-label{font-size:9px;letter-spacing:1.3px;font-weight:700;color:#96a0b3;padding:0 10px 13px}
.dev-navigation{display:flex;flex-direction:column;gap:6px}
.dev-nav-btn{display:flex;align-items:center;gap:10px;min-height:44px;text-align:left;padding:10px;border:0;border-radius:10px;font:600 11px/1.5 var(--font-body);color:#738198;background:transparent;cursor:pointer}
.dev-nav-btn span{font-size:19px;font-weight:400;width:22px;text-align:center}
.dev-nav-btn:hover{background:#f0f4fb;color:#3e5f97}
.dev-nav-btn.active{background:#e8effc;color:#2c5baf}
.dev-nav-btn:focus-visible{outline:2px solid #769cff}
.dev-sidebar-note{font-size:10px;line-height:1.8;color:#8e9bb1;border-top:1px solid #e6ecf5;margin:21px 8px 0;padding-top:17px}
.dev-content{min-width:0;background:#ffffff88;border:1px solid #e2e8f3;border-radius:19px;padding:27px}
.dev-view{display:none}
.dev-view.active{display:block}
.dev-view-heading{padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #e2e8f3}
.dev-view-heading h3{font:500 23px var(--font-display);margin:0 0 6px;color:#263e62}
.dev-view-heading p{font-size:11px;color:#7e8da2;margin:0;line-height:1.8}
.dev-content .section{margin:25px 0 13px}
.dev-content .section h3{font-size:16px;font-weight:500}
.dev-content .card{padding:21px;border-radius:13px;box-shadow:none;border-color:#e4eaf3}
.dev-content .formgrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.dev-content .toolbar{gap:10px}
.dev-content .btn{font-size:11px;box-shadow:none}
.dev-content textarea{min-height:350px;font-size:11px;line-height:1.8}
.dev-content pre{font-size:10px;line-height:1.8;max-height:280px;margin-top:14px}
.dev-technical summary{cursor:pointer;font-size:11px;color:#607aab;margin-top:13px}
.backup-time{font-size:10px;color:#8c9ab0;margin:9px 3px 20px}
.source-health .muted{font-size:11px;line-height:1.9}
.dev-danger-area{border-top:1px solid #efdee1;margin-top:30px;padding-top:2px}
.dev-danger-area .card{background:#fffafa;border-color:#f0dfe2}
.dev-content .log-viewport table{min-width:360px}
.dev-content .log-viewport td{font-size:11px;white-space:normal}
.dev-content .log-viewport th:first-child{width:150px}
@media(max-width:850px){.dev-workspace{grid-template-columns:1fr;gap:17px}
.dev-sidebar{position:static;padding:9px}
.dev-nav-label,.dev-sidebar-note{display:none}
.dev-navigation{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}
.dev-nav-btn{flex-direction:column;gap:3px;text-align:center;padding:9px 4px;font-size:9px}
.dev-content{padding:22px}
.admin-account{display:none}
.admin-stats{gap:10px}
.admin-meta{padding-bottom:18px}
}
@media(max-width:540px){.admin-hero{padding:23px 20px;border-radius:18px}
.admin-profile{gap:14px}
.admin-avatar{width:58px;height:58px;flex-basis:58px;border-radius:17px;font-size:24px}
.admin-profile h2{font-size:24px}
.admin-eyebrow{font-size:7px;letter-spacing:1.1px}
.admin-meta{font-size:9px;gap:5px}
.dev-content{padding:16px}
.dev-content .card{padding:16px}
.dev-content .formgrid{grid-template-columns:1fr}
.dev-nav-btn{font-size:8px}
.admin-stats .card{padding:14px!important}
.admin-stats .metric{font-size:19px!important}
.archived-asset-row{align-items:flex-start;flex-wrap:wrap}
.actions .archive-btn{margin-left:0}
}
/* Refined visual system — spacious portfolio and personal profile */
:root{--navy:#162c4c;--blue:#3569d4;--bg:#f3f6fb;--ink:#203450;--muted:#8290a5;--line:#e6ebf3;--green:#148264;--red:#c95d6d;--grad:linear-gradient(120deg,#3569d4,#526dd3)}
body{background:radial-gradient(ellipse at 10% 0,#e9effb 0,transparent 40%),#f3f6fb;color:var(--ink);font-size:14px;line-height:1.65}
header{background:linear-gradient(115deg,#142b4b,#243e65 70%,#3a4b78);padding:25px max(24px,calc((100% - 1260px)/2));box-shadow:none}
header::before,header::after{opacity:.25}
.top{gap:20px}
.brand{gap:14px}
.brand .logo{width:44px;height:44px;border-radius:13px;background:#ffffff14;border:1px solid #ffffff22;box-shadow:none;font-size:22px}
.brand h1{font-size:23px;font-weight:500}
.brand p{font-size:9px;letter-spacing:1.6px;color:#a8bcd9;margin-top:5px}
main{max-width:1280px;margin:27px auto;padding:0 24px}
.tabs{display:flex;width:max-content;max-width:100%;gap:5px;padding:6px;margin:0 0 29px;background:#fff;border:1px solid #e1e7f1;border-radius:14px;box-shadow:0 3px 10px #213f6804}
.tab{padding:11px 18px;border-radius:9px;font-size:12px;line-height:1.5;font-weight:600;color:#7b8aa0}
.tab.active{background:#eaf0fc;color:#315fba;box-shadow:none}
.tab:hover{transform:none;background:#f1f5fc}
.head{margin-bottom:22px;align-items:center}
.head h2{font-size:26px;font-weight:500;letter-spacing:-.4px}
.head p{margin-top:6px;font-size:11px;line-height:1.8}
.toolbar{gap:10px}
.btn{border-radius:9px;min-height:38px;padding:10px 15px;font-size:11px;font-weight:600;line-height:1.5;box-shadow:none;transition:background .15s,border-color .15s,color .15s}
.btn:hover{transform:none;filter:brightness(.98)}
.primary{background:#386bd2;border:1px solid #386bd2;box-shadow:none}
.primary:hover{background:#2e5ebf;box-shadow:none}
.soft{background:#f0f4fb;border-color:#e0e7f3;color:#52709f}
.danger{background:#fff4f5;border-color:#f4dfe3;color:#b95b6c}
.portfolio-banner{padding:26px 29px;border:1px solid #dee6f2;border-radius:18px;background:linear-gradient(110deg,#e9f0ff,#eef0fb 65%,#e8f5f6);color:#2c4670;box-shadow:none;margin-bottom:26px;min-height:132px}
.portfolio-banner h2{font-size:27px;font-weight:500;letter-spacing:-.4px;margin:7px 0}
.portfolio-banner p{font-size:11px;color:#8291a9}
.eyebrow{font-size:9px;letter-spacing:1.7px;color:#7793bf}
.portfolio-banner::after{border-color:#8aa8dc09;animation:none}
.market-art{opacity:.65;height:62px;gap:9px}
.market-art i{width:12px;background:linear-gradient(#82b5d1,#8f9fd9);animation-duration:5s}
.grid{gap:17px;margin-bottom:22px}
.card{border-radius:16px;border:1px solid #e3e9f2;box-shadow:0 4px 15px #203e6504;background:#fff;padding:22px}
.grid .card{padding:21px 23px;box-shadow:none}
.grid .card::before{width:3px;top:22px;bottom:22px;border-radius:0 3px 3px 0;opacity:.65}
.grid .card::after{display:none}
.grid .card:hover{transform:none;box-shadow:none}
.label{font-size:9px;letter-spacing:1px;color:#8b99af}
.metric{margin-top:11px;font-size:clamp(20px,2.2vw,29px);font-weight:550;color:#223d65}
.metric.green{color:#24856c}
.metric.red{color:#c25d70}
.metric-note{font-size:9px;color:#97a2b3;line-height:1.9;margin-top:10px}
.notice{border:1px solid #e9e6db;border-left:3px solid #dbc98a;background:#fcfaf4;color:#8e8469;border-radius:12px;padding:13px 16px;font-size:11px;line-height:1.85;margin:17px 0}
.section{margin:29px 0 16px;gap:14px;align-items:center}
.section h3{font-size:19px;font-weight:500;letter-spacing:-.2px}
.section h3::before{height:15px;width:3px;background:#8ca5d1}
.status{box-shadow:none;border-color:#e5eaf3;padding:8px 12px;background:#ffffffcc}
.quote-status{font-size:10px;color:#8795aa;line-height:1.7}
.idx-market-summary{font-size:10px;background:#edf2f9;border-color:#e1e8f2;color:#8693a8;padding:9px 13px;margin-bottom:16px;border-radius:9px}
.assetgrid{gap:20px}
.asset{animation:none;padding:23px;overflow:hidden}
.asset::before{height:3px;opacity:.65}
.asset:hover{transform:none;box-shadow:0 7px 20px #25457208}
.asset-identity{gap:11px}
.asset-logo{width:39px;height:39px;flex-basis:39px;border-radius:12px;border-color:#e8edf4;background:#f7f9fc}
.asset h3{font-size:18px;font-weight:550}
.asset .company{font-size:10px;color:#8a98ac;margin:9px 0 0;line-height:1.7;min-height:19px}
.tag{font-size:8px;font-weight:700;letter-spacing:.15px;border-radius:6px;padding:5px 7px;background:#ecf7f2;border:1px solid #d9eee4;color:#468b70}
.tag.cached{background:#fcf7ea;border-color:#efe7d0;color:#a38b53}
.tag.manual,.tag.closed{background:#f0f3f8;border-color:#e3e8f0;color:#8b98ac}
.price{background:none;color:#263f66;font-size:28px;font-weight:550;letter-spacing:-.6px;margin:18px 0 15px}
.assetrow{font-size:11px;border-bottom:1px solid #f0f3f8;padding:7px 0;margin:0;color:#8b99ad;gap:12px}
.assetrow b{font-weight:600;color:#526a8b}
.assetrow b.green,.assetrow b.red{background:transparent;padding:0;border-radius:0}
.assetrow b.green{color:#299478}
.assetrow b.red{color:#c86e7c}
.asset .quote-meta{font-size:9px;line-height:1.9;color:#9ba6b7;margin:16px 0 0;min-height:36px}
.market-session{font-size:9px;color:#9aa5b5;margin-bottom:11px}
.asset .actions{gap:7px;margin-top:18px;align-items:center}
.actions .btn{font-size:10px;padding:8px 10px;min-height:33px}
.sell-btn{background:#edf7f3;border-color:#d9ece3;color:#5a8d79}
.archive-btn{border-color:transparent;color:#9aa6b7;background:transparent}
.archive-btn:hover{background:#f3f5f9}
.asset .actions .archive-btn{margin-left:0;flex-basis:100%;padding:3px 0;text-align:left;min-height:24px;font-size:9px}
.asset .actions .archive-btn:disabled{display:none}
.btn:disabled{filter:none;opacity:.4}
.tablewrap{border-radius:13px;border-color:#e2e9f2;box-shadow:none}
th{padding:14px 16px;background:#f5f8fc;font-size:9px;letter-spacing:.7px;font-weight:700;color:#91a0b6}
td{padding:14px 16px;font-size:11px;color:#5c708d;border-bottom-color:#edf1f7}
tbody tr:hover{background:#f8faff}
.pill{font-size:8px;border-radius:5px;padding:4px 7px;background:#ebf7f1;color:#5a967c}
.pill.out{background:#fcf0f2;color:#bd7b88}
.portfolio-table td small{color:#9ca7b8;font-size:9px;line-height:1.7;margin-top:3px}
.portfolio-row-actions .btn{padding:7px 9px;min-height:32px;font-size:10px}
.portfolio-identity{gap:11px}
.scroll-tools .btn{font-size:10px}
.scroll-hint{font-size:10px;color:#9aa7b9;margin-top:10px}
.formgrid{gap:19px}
.field{gap:7px}
.field label{font-size:9px;color:#8a9ab1;letter-spacing:.75px}
input,select{min-height:44px;padding:11px 13px;font-size:12px;border-radius:9px;border-color:#dfe6f1;background:#fcfdff;color:#435a7c}
input:focus,select:focus{background:#fff;outline:3px solid #e5edfc;border-color:#8aace9}
.formactions{margin-top:6px;gap:10px}
.modal{border-radius:20px;border-top:3px solid #9ab3e2;padding:27px;box-shadow:0 30px 100px #07192e38}
.modal h3{font-size:22px;font-weight:500}
.modal p{font-size:11px;line-height:1.85;color:#8b99ac}
.modalback{background:#1c304b66;backdrop-filter:blur(7px)}
footer{font-size:10px;color:#a4afbf;padding:35px 20px}
#userChip{background:#ffffff0a;border:1px solid #ffffff20;border-radius:13px;padding:5px;gap:0;box-shadow:0 3px 10px #00000003}
.header-profile{display:flex;align-items:center;gap:11px;padding:4px 12px 4px 4px;min-height:44px;max-width:265px;border:0;background:transparent;border-radius:9px;color:#f1f5ff;font-family:var(--font-body);cursor:pointer;text-align:left}
.header-profile:hover{background:#ffffff0a}
.header-profile:focus-visible{outline:2px solid #adcbff}
.avatar{display:grid;place-items:center;width:37px;height:37px;flex:0 0 37px;border-radius:10px;background:#ffffff16;border:1px solid #ffffff26;color:#e8efff;font:500 14px var(--font-display);overflow:hidden}
.avatar img,.admin-avatar img,.profile-photo-preview img{display:block;width:100%;height:100%;object-fit:cover}
.header-profile-copy{display:flex;flex-direction:column;gap:4px;min-width:0}
.header-profile-copy b{font-size:11px;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px}
#userChip .header-profile-copy small{font-size:7px;letter-spacing:.9px;color:#c2cee2;opacity:.85;line-height:1.3}
.profile-chevron{font-size:14px;color:#a5b7d2;margin-left:4px}
.header-logout{min-height:33px;font:600 9px var(--font-body);padding:8px 11px;background:#ffffff0c;border:1px solid #ffffff20;border-radius:8px;color:#c9d6ea;cursor:pointer;margin:0 2px 0 0}
.header-logout:hover{background:#ffffff1b}
#dateNow{font-size:10px;line-height:1.5;background:transparent;border:0;padding:8px 0;color:#b5c4db;border-radius:0;font-weight:500;backdrop-filter:none}
.admin-hero{background:linear-gradient(110deg,#1b3456,#334e77);padding:31px;border-radius:18px;box-shadow:none;gap:20px}
.admin-avatar{border-radius:20px;overflow:hidden}
.profile-edit-button{cursor:pointer;padding:0;color:inherit}
.profile-edit-button:hover{outline:3px solid #ffffff1a}
.admin-profile h2{font-size:30px}
.admin-roles span{font-size:9px;background:#ffffff09;border-color:#ffffff25}
.admin-edit-profile{position:relative;z-index:1;margin-left:auto;flex-shrink:0;border:1px solid #ffffff33;border-radius:8px;padding:9px 13px;background:#ffffff10;color:#dbe6f7;cursor:pointer;font:600 10px var(--font-body)}
.admin-edit-profile:hover{background:#ffffff20}
.admin-account{font-size:10px}
.admin-account small{font-size:9px}
.admin-stats{gap:17px;margin-bottom:27px}
.admin-stats .card{border-color:#e4eaf3}
.dev-workspace{gap:24px;grid-template-columns:210px minmax(0,1fr)}
.dev-sidebar{background:#ffffff99;border-color:#e2e9f2;padding:18px 12px}
.dev-nav-btn{font-size:11px;min-height:46px;font-weight:500}
.dev-nav-btn.active{background:#eaf0fb;color:#5076b7}
.dev-content{background:#ffffffa6;border-color:#e2e9f2;padding:29px}
.dev-view-heading{margin-bottom:24px;padding-bottom:24px}
.dev-view-heading h3{font-size:25px;color:#344d70}
.dev-content .section h3{font-size:18px}
.dev-content .card{padding:24px}
.dev-content .formgrid{gap:22px}
.dev-content .btn{min-height:40px}
.dev-sidebar-note{font-size:10px;line-height:1.9}
.dev-content .log-viewport td{padding:14px 16px}
.dev-danger-area .card{background:#fffafb}
.profile-dialog{width:min(500px,100%);border-top:0;padding:30px}
.profile-eyebrow{font-size:8px;letter-spacing:1.5px;color:#8da0be;font-weight:700}
.profile-dialog-heading{padding-bottom:20px;margin-bottom:24px;border-bottom:1px solid #edf1f7}
.profile-dialog-heading h3{margin:7px 0 8px;font-size:27px}
.profile-dialog-heading p{margin:0;font-size:11px;line-height:1.8}
.profile-photo-section{display:flex;gap:21px;align-items:center;margin-bottom:26px}
.profile-photo-preview{width:90px;height:90px;flex:0 0 90px;display:grid;place-items:center;border-radius:23px;border:1px solid #dce6f5;background:linear-gradient(130deg,#eaf1fd,#edf0f8);font:500 30px var(--font-display);color:#6e8ab8;overflow:hidden}
.profile-photo-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.profile-photo-controls .btn{font-size:10px;min-height:34px;padding:8px 11px}
.profile-upload{display:inline-flex;align-items:center;cursor:pointer}
.profile-photo-controls p{font-size:9px;line-height:1.8;flex-basis:100%;margin:2px 0 0;color:#99a6b9}
.profile-login-note{font-size:10px!important;margin:9px 0 20px!important;color:#94a1b5!important}
.profile-local-note{display:flex;gap:9px;align-items:flex-start;background:#f4f7fc;border-radius:10px;padding:13px;color:#899bb6;font-size:10px;line-height:1.8}
.profile-local-note>span:first-child{font-size:18px;color:#8ba7cf;line-height:1.2}
.profile-message{font-size:10px!important;line-height:1.7;margin:11px 0 0!important;min-height:0}
.profile-message:empty{display:none}
.profile-dialog .modalactions{padding-top:18px;margin-top:20px;border-top:1px solid #edf1f7;gap:9px}
.profile-dialog .modalactions .btn{min-width:100px;min-height:40px}
@media(max-width:1100px){.assetgrid{grid-template-columns:repeat(2,minmax(0,1fr))}
.admin-account{display:none}
.dev-workspace{grid-template-columns:185px minmax(0,1fr);gap:18px}
.dev-content{padding:23px}
.top{align-items:center}
.brand p{font-size:8px}
.header-profile{max-width:235px}
}
@media(max-width:850px){.dev-workspace{grid-template-columns:1fr}
.dev-navigation{grid-template-columns:repeat(4,minmax(0,1fr))}
.dev-sidebar{padding:9px}
.dev-nav-btn{font-size:9px;min-height:56px}
.admin-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
#dateNow{display:none}
.top{gap:16px}
.brand h1{font-size:21px}
}
@media(max-width:600px){header{padding:19px 17px}
.top{align-items:flex-start;flex-direction:column;gap:17px}
.top>div:last-child{width:100%;justify-content:space-between!important}
#userChip{max-width:100%;width:100%;justify-content:space-between}
#dateNow{display:none}
.header-profile{max-width:calc(100% - 70px);flex:1;gap:10px}
.header-profile-copy b{max-width:210px;font-size:12px}
.avatar{width:36px;height:36px;flex-basis:36px}
.header-logout{padding:9px 13px}
main{padding:0 15px;margin:20px auto}
.tabs{width:100%;gap:3px;padding:5px;margin-bottom:23px;flex-wrap:wrap}
.tab{flex:1;padding:10px 7px;font-size:10px}
.head h2{font-size:24px}
.head .toolbar{gap:7px}
.head .btn{padding:9px 11px;font-size:10px}
.portfolio-banner{padding:22px;min-height:124px}
.portfolio-banner h2{font-size:23px;line-height:1.25;max-width:240px}
.portfolio-banner p{font-size:10px;max-width:250px}
.market-art{height:50px;gap:5px;opacity:.45;padding:0}
.market-art i{width:7px}
.grid{gap:10px}
.grid .card{padding:17px 18px}
.metric{font-size:22px}
.label{font-size:8px;letter-spacing:.55px}
.metric-note{font-size:8px}
.assetgrid{grid-template-columns:1fr;gap:17px}
.asset{padding:23px}
.price{font-size:29px}
.asset h3{font-size:20px}
.assetrow{font-size:12px;padding:8px 0}
.asset .company{font-size:11px}
.asset .quote-meta{font-size:10px;min-height:0}
.section h3{font-size:18px}
.status{max-width:100%}
.section{align-items:flex-start}
.card{padding:19px}
.formgrid{grid-template-columns:1fr}
.formactions{grid-column:1}
.modal{padding:23px}
.admin-hero{padding:24px 20px;flex-wrap:wrap;gap:19px}
.admin-edit-profile{margin-left:0;font-size:10px}
.admin-profile{gap:14px}
.admin-profile h2{font-size:26px}
.admin-avatar{width:60px;height:60px;flex-basis:60px;border-radius:17px}
.admin-meta{font-size:9px;padding-bottom:17px}
.dev-content{padding:19px}
.dev-content .card{padding:19px}
.dev-view-heading h3{font-size:23px}
.dev-content .formgrid{grid-template-columns:1fr}
.dev-nav-btn{font-size:8px;gap:4px}
.profile-dialog{padding:25px}
.profile-photo-section{gap:16px}
.profile-photo-preview{width:76px;height:76px;flex-basis:76px;border-radius:20px}
.profile-photo-controls .btn{font-size:9px;padding:8px 9px}
.profile-photo-controls p{font-size:8px}
.profile-dialog .modalactions .btn{min-width:90px}
.admin-stats .metric{font-size:20px!important}
}
@media(prefers-reduced-motion:reduce){.asset,.portfolio-banner::after{animation:none}
}
/* Champagne and warm cream — selected accent #FFE599 */
:root{--navy:#493725;--blue:#ad7f2c;--violet:#b48a43;--teal:#8d9874;--amber:#d0ab58;--pink:#c58f78;--bg:#fbf7ec;--ink:#493c2c;--muted:#8e7e64;--line:#e9dfcb;--green:#507f64;--red:#b85c62;--grad:linear-gradient(115deg,#efd384,#e8c366);--cream-accent:#ffe599;--cream-soft:#fff7df;--gold-deep:#82602e}
body{background:radial-gradient(ellipse at 5% 0,#fff0c7 0,transparent 46%),radial-gradient(ellipse at 100% 25%,#f4ecd9 0,transparent 48%),#fbf8ef;color:var(--ink)}
header{background:linear-gradient(115deg,#463523,#5e4930 65%,#7a603a);border-bottom:1px solid #a88a5440}
.brand .logo{background:#ffe59917;border-color:#ffe59930;color:#ffe599}
.brand p{color:#d6c6a5}
.header-profile{color:#fff7e5}
.avatar{color:#fff0c2;background:#ffe59914;border-color:#ffe59930}
.profile-chevron{color:#cfbb92}
#userChip{background:#fff0c008;border-color:#fff0c026}
#userChip .header-profile-copy small{color:#e5d3ac}
.header-logout{color:#f4e6c7;background:#ffe5990b;border-color:#ffe59926}
.header-logout:hover,.header-profile:hover{background:#ffe59916}
#dateNow{color:#d5c39f}
.tabs{background:#fffdf7;border-color:#e7dcc7;box-shadow:0 3px 12px #705b2f04}
.tab{color:#9a886b}
.tab.active{background:#fff0bd;color:#78572a}
.tab:hover{background:#fcf3d9;color:#8d6c36}
.btn{border-color:#e5d9bf}
.primary{background:linear-gradient(115deg,#efd488,#e9c56b);border-color:#dfbb64;color:#503b1a;font-weight:700;box-shadow:0 3px 8px #a47a2310}
.primary:hover{background:linear-gradient(115deg,#f3d98e,#e6bc5b);box-shadow:0 4px 10px #a47a2318}
.soft{background:#fcf5e3;border-color:#ecdfbf;color:#8a7045}
.soft:hover{background:#f9edcb}
.danger{background:#fff2ed;border-color:#efd5ca;color:#a46554}
.sell-btn{background:#f1f3e7;border-color:#dce2c9;color:#6b7b50}
.archive-btn{color:#a49375;border-color:transparent;background:transparent}
.archive-btn:hover{background:#f8f1df}
.btn:focus-visible,.tab:focus-visible,.dev-nav-btn:focus-visible,.header-profile:focus-visible{outline:2px solid #c69e4c;outline-offset:3px}
.portfolio-banner{background:radial-gradient(ellipse at 90% 25%,#f5dfa9 0,transparent 60%),linear-gradient(110deg,#fff5d6,#f9efd7);border-color:#eadab1;color:#6b512f;box-shadow:0 5px 18px #9b773209}
.portfolio-banner h2{color:#62492b}
.portfolio-banner p{color:#a18a64}
.eyebrow{color:#b18a43}
.portfolio-banner::after{border-color:#c59b4d0b}
.market-art i{background:linear-gradient(#d5ba7d,#a99159)}
.card{background:#fffef9;border-color:#e9e0cd;box-shadow:0 4px 16px #6b522407}
.card:hover{border-color:#e0cfac}
.label{color:#9b896b}
.metric{color:#664e30}
.metric.green{color:#507f64}
.metric.red{color:#b85c62}
.metric-note{color:#a08e72}
.notice{background:#fff7df;border-color:#ecdfb9;border-left-color:#d4b768;color:#9a8050}
.section h3{color:#705737}
.section h3::before{background:#d4b76d}
.status{background:#fffcf2;border-color:#e9dec6}
.quote-status{color:#a18e6e}
.dot{background:#c5bba5}
.dot.live{background:#6f9774}
.idx-market-summary{background:#f8f1e0;border-color:#e9dec5;color:#9b8663}
.idx-market-summary.open{background:#f0f3e5;border-color:#dce4cd;color:#6f8658}
.idx-market-summary.open::before{background:#82936c;box-shadow:0 0 0 3px #82936c15}
.asset::before{background:#d4b368!important;opacity:.55}
.assetgrid .asset:nth-child(3n+2)::before{background:#b8b28c!important}
.assetgrid .asset:nth-child(3n)::before{background:#d5ae88!important}
.asset:hover{box-shadow:0 7px 20px #7b5c2710}
.asset-logo{background:#fcf8ed;border-color:#efe5d1}
.asset h3{color:#665034}
.asset .company{color:#a18f72}
.price{color:#614b2e}
.assetrow{color:#9c8b6f;border-bottom-color:#f0e9da}
.assetrow b{color:#816c4d}
.assetrow b.green{color:#598465}
.assetrow b.red{color:#b66c69}
.asset .quote-meta{color:#ab997d}
.tag{background:#f0f4e8;border-color:#dfe6ce;color:#7b8d64}
.tag.manual,.tag.closed{background:#f6f1e6;border-color:#e9e1ce;color:#a4916b}
.tag.cached{background:#fff2c9;border-color:#ecdbab;color:#ac8a44}
.tag.loading{background:#fcf0ce;border-color:#ead4a1;color:#a17e3d}
.market-session{color:#aa997b}
.market-session.open{color:#71865c}
.market-session.open>span{background:#879b70;box-shadow:0 0 0 3px #879b7018}
.market-session.break,.market-session.closing,.market-session.opening{color:#af8a48}
.market-session>span{background:#b7ab91}
.tablewrap{background:#fffef9;border-color:#e9dfc9}
.tablewrap th{background:linear-gradient(#fcf6e4,#f8f0dc);color:#a28b60;border-bottom-color:#e9dfc9}
td{color:#887252;border-bottom-color:#f0e9d9}
tbody tr:hover{background:#fff7df}
.portfolio-table td small{color:#ab9b7c}
.pill{background:#eef2e5;color:#7c8c62}
.pill.out{background:#f9eae3;color:#b0816b}
.scroll-transactions,.log-viewport{scrollbar-color:#d2b977 #f8f2e4}
.scroll-hint{color:#ac9a7a}
.field label{color:#a08b67}
input,select,textarea{background:#fffdf5;border-color:#e8ddc5;color:#796344}
input:focus,select:focus,textarea:focus{background:#fffef9;outline-color:#f3e7c1;border-color:#cfb474}
input::placeholder,textarea::placeholder{color:#b8a98d}
.muted{color:#a38f70}
.codebox{background:#fff5d6;border-color:#dfc17c;color:#9a7132}
pre{background:#3f3528;color:#e3d3af}
.modal{background:#fffdf6;border-top-color:#dcc282;box-shadow:0 30px 100px #3b281740}
.modal h3{color:#785a33}
.modal p{color:#a18b68}
.modalback{background:#3c2b1d70}
.password-toggle{color:#ad9569}
.password-toggle:hover,.password-toggle[aria-pressed="true"]{background:#faf0d2;color:#9c7430}
.password-toggle:focus-visible{outline-color:#c4a055;background:#faf0d2}
.asset-catalog{background:#fcf7e9;border-color:#ebdec2}
.catalog-option{color:#8c7049}
.catalog-option:hover{background:#fcf0c8}
.catalog-option[aria-pressed="true"]{background:#fff0bc;border-color:#d9bc70}
.catalog-option:focus-visible{outline-color:#c5a14f}
.catalog-copy small{color:#ae9671}
.catalog-mark{color:#ae925c}
.asset-selection{background:#fcf1d4}
.asset-selection small{color:#a3895d}
.purchase-preview{background:#fcf1d4;color:#a07c3e}
.sale-preview{background:#f3f1e0;color:#8b8153;border-color:#e5dfbf}
.sale-method,.sale-archive{color:#a18a61}
.sell-all{color:#aa8640}
.sale-archive input{accent-color:#b18d41}
.archived-holdings summary{color:#a48959}
.archived-asset-row{border-color:#eee3cc}
footer{color:#b4a17e}
footer a{color:#a88b4e}
.admin-hero{background:linear-gradient(110deg,#54402a,#7a6039);border:1px solid #b99a6433}
.admin-eyebrow{color:#d6bf90}
.admin-avatar{background:#ffe59915;border-color:#ffe59933;color:#fff0c5}
.admin-roles span{background:#ffe5990c;border-color:#ffe59926;color:#efddb5}
.admin-edit-profile{background:#ffe5990d;border-color:#ffe59930;color:#f1dfb5}
.admin-edit-profile:hover{background:#ffe59920}
.admin-account small{color:#d2bd93}
.local-account-dot{background:#d8ca8b;box-shadow:0 0 0 4px #d8ca8b16}
.admin-meta{color:#ac9672}
.admin-stats .card{background:#fffdf6;border-color:#eadfc8}
.dev-sidebar{background:#fffdf4;border-color:#e9ddc4}
.dev-nav-label{color:#b49c76}
.dev-nav-btn{color:#aa9069}
.dev-nav-btn.active{background:#faedc8;color:#a07d38}
.dev-nav-btn:hover{background:#fbf2dc;color:#9d793c}
.dev-sidebar-note{color:#b29b75;border-top-color:#ecdfc5}
.dev-content{background:#fffcf2dd;border-color:#eadfc6}
.dev-view-heading{border-bottom-color:#ecdfc6}
.dev-view-heading h3{color:#8c6e3d}
.dev-view-heading p{color:#ae9872}
.dev-content .card{background:#fffdf7;border-color:#ece0c8}
.dev-content .section h3{color:#987b47}
.dev-technical summary{color:#ad8c4d}
.backup-time{color:#b09a73}
.dev-danger-area{border-top-color:#eed7c3}
.dev-danger-area .card{background:#fff7ed;border-color:#ecd8bf}
.log-count{background:#faeac0;color:#aa8540}
.log-event::before{background:#c8ad73}
.log-event.success::before{background:#9aa87b}
.log-event.failed::before{background:#c98c73}
.log-viewport td:first-child{color:#ac9674}
.log-help,.log-pagination p{color:#b09c7b}
.log-page-info{color:#b29259}
.profile-dialog{background:#fffdf6}
.profile-dialog-heading{border-bottom-color:#eee0c2}
.profile-eyebrow{color:#bc9c60}
.profile-photo-preview{background:linear-gradient(140deg,#ffefb6,#f3e1b9);border-color:#e6ce93;color:#a77d37}
.profile-dialog-heading p,.profile-photo-controls p,.profile-login-note{color:#b39a71!important}`;
