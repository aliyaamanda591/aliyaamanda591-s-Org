export const portfolioStylesResponsiveHtml = `/* Mobile portfolio: calm surfaces, readable numbers and thumb-friendly navigation. */
.quote-details{margin:12px 0 14px;border-top:1px solid #e6eaf0;padding-top:9px}
.quote-details summary{font-size:10px;line-height:1.8;color:#6e8099;cursor:pointer;min-height:30px;padding:5px 0}
.quote-details .quote-meta{margin:6px 0 0;font-size:11px;line-height:1.8}
.quote-details summary:focus-visible,.tabs .tab:focus-visible{outline:2px solid #b79a5e;outline-offset:3px}
.overview-heading p{max-width:40rem}
.tag{white-space:normal;text-align:center;line-height:1.6}
.tablewrap{overscroll-behavior-x:contain}
html{scroll-padding-bottom:100px}
@media(max-width:760px){
body{background:#f3f5f8;padding-bottom:calc(80px + env(safe-area-inset-bottom,0px))}
main{width:100%;max-width:100%;padding:16px 14px 22px;box-sizing:border-box}
header .top{padding:13px 14px;gap:10px;flex-wrap:wrap}
.brand{gap:9px;min-width:0;flex:1}
.brand .logo{width:32px;height:32px;border-radius:10px}
.brand h1{font-size:17px;letter-spacing:-.3px;line-height:1.4}
.brand p,#dateNow{display:none}
.top>div:last-child{gap:6px!important;flex-wrap:nowrap!important}
.top #userChip{width:auto;flex:initial;padding:3px;gap:2px}
.top .header-profile{padding:3px;max-width:44px}
.header-profile-copy,.profile-chevron{display:none}
.header-profile .avatar{width:30px;height:30px}
.top .header-logout{min-height:38px;padding:7px;font-size:10px}
.balance-visibility-button{min-height:40px;min-width:40px;padding:9px}
.balance-eye-label{display:none}
.tabs{position:fixed;z-index:15;left:0;right:0;bottom:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;margin:0;padding:6px 8px calc(6px + env(safe-area-inset-bottom,0px));border:0;border-top:1px solid #dde4ec;border-radius:0;background:#fff;box-shadow:0 -4px 18px #26374b06;width:100%;box-sizing:border-box}
.tabs .tab{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:52px;padding:5px 2px;font-size:11px;line-height:1.4;border-radius:10px;white-space:nowrap;color:#7c899c}
.tabs .tab:before{font-size:21px;line-height:22px;font-weight:500}
.tabs .tab[data-tab="dashboard"]:before{content:'▦'}
.tabs .tab[data-tab="transactions"]:before{content:'⇄'}
.tabs .tab[data-tab="assets"]:before{content:'▤'}
.tabs #devTab{font-size:0}
.tabs #devTab:before{content:'⚙';font-size:21px}
.tabs #devTab:after{content:'Akun';font-size:11px}
.tabs .tab.active{background:#f6f1e5;color:#8b703c}
.locked .tabs{visibility:hidden}
.portfolio-banner{display:none}
.investment-overview{padding:18px 15px;border-radius:18px;margin-bottom:18px}
.overview-heading{margin-bottom:18px;gap:12px;align-items:flex-start;flex-wrap:wrap}
.overview-heading h2{font-size:23px}
.overview-heading p{font-size:11px;line-height:1.7;margin-top:6px}
.overview-heading .toolbar{padding:0;width:100%;gap:8px;display:flex}
.overview-heading .btn{flex:1;min-height:44px;font-size:11px;padding:10px 8px}
.overview-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.overview-grid .overview-stat{min-height:154px;padding:13px!important;border-radius:12px}
.overview-stat .label{font-size:8px;letter-spacing:.3px}
.overview-stat .overview-icon{width:24px;height:24px;flex-basis:24px}
.overview-grid .overview-stat .metric{font-size:clamp(14px,4.4vw,24px);letter-spacing:-.5px;line-height:1.4;margin-top:12px}
.overview-stat-caption,.profit-stat .metric-note{font-size:9px;line-height:1.7}
.overview-stat-bottom,.profit-stat .overview-stat-bottom{font-size:8px;padding-top:9px}
.activity-stat #transactionCount.metric{font-size:26px}
.sale-summary{padding:16px;gap:14px}
.sale-summary-result .label{font-size:9px}
.sale-summary-result .metric{font-size:24px}
.sale-summary-state,.sale-summary-help small,.sale-summary-details dt{font-size:10px}
.overview-composition{margin-top:17px}
.overview-allocation-legend{gap:8px 12px}
.overview-allocation-legend>span,.overview-allocation-legend b{font-size:9px}
.overview-allocation-legend>span{color:#7e8b9e}
.notice{font-size:11px;line-height:1.8;padding:13px}
.section{align-items:flex-start;gap:10px;flex-wrap:wrap}
.section h3{font-size:16px}
.section .status{width:100%;font-size:10px}
.quote-status{font-size:11px;line-height:1.7}
.idx-market-summary{font-size:11px;line-height:1.8}
.assetgrid{grid-template-columns:minmax(0,1fr);gap:14px}
.asset{padding:20px!important;border-radius:16px}
.asset h3{font-size:16px}
.asset .company{font-size:11px}
.asset .price{font-size:27px;margin:17px 0}
.assetrow{padding:9px 0;font-size:12px}
.asset .tag{font-size:9px}
.asset .actions{gap:7px;flex-wrap:wrap;margin-top:14px}
.asset .actions .btn{min-height:44px;font-size:11px;flex:1;padding:9px 7px}
.asset .actions .archive-btn{flex:0 0 auto}
.quote-details summary{min-height:36px;font-size:11px}
.quote-details .quote-meta{font-size:11px}
.btn,input,select{min-height:44px}
.formgrid{grid-template-columns:minmax(0,1fr)}
input,select,textarea{font-size:16px!important}
.modalback{padding:12px}
.modal{max-height:calc(100dvh - 24px);overflow-y:auto;width:min(100%,520px);padding:20px}
.modal h3{font-size:19px}
.tablewrap{overflow-x:auto;max-width:100%}
table{min-width:600px}
.scroll-tools{flex-wrap:wrap}
.scroll-tools .btn{font-size:10px}
.admin-hero{padding:20px;gap:14px;flex-wrap:wrap}
.admin-hero h2{font-size:23px}
.admin-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
.dev-layout{grid-template-columns:minmax(0,1fr)}
footer{font-size:10px;line-height:1.8;margin-top:20px}
.authback{padding:12px;background:linear-gradient(145deg,#283a50,#192331);overflow:hidden}
.authback:before,.authback:after,.authglow,.auth-aurora,.auth-sparkles,#authCoins,#authCanvas,.authback .ticker{display:none!important}
.authback .authcard{max-height:calc(100dvh - 24px);width:min(440px,100%);padding:20px;border-radius:20px;box-sizing:border-box;backdrop-filter:none;animation:none;box-shadow:0 12px 36px #07101e40;overscroll-behavior:contain}
.auth-intro{gap:13px;padding-bottom:16px;margin-bottom:16px}
.auth-illustration{width:78px;height:88px;flex-basis:78px}
.auth-illustration img{width:78px;height:78px}
.authcard h2{font-size:24px}
.auth-intro-copy #authSub{font-size:11px;color:#74849a}
.auth-guide{font-size:9px}
.cloud-signin #emailAuthForm{gap:13px}
.authcard input{min-height:48px;color:#43566f}
.authcard #emailSubmit,.authcard .google-signin-button{min-height:48px;font-size:13px}
.password-toggle{min-width:44px;min-height:44px}
.email-auth-links button{min-height:40px;font-size:11px}
.signup-privacy{font-size:10px!important}
.login-market{padding:13px 14px;margin-bottom:14px}
.login-market-copy p{font-size:11px}
.login-market-copy small{font-size:10px}
.login-market-footer{font-size:9px}
}
@media(prefers-reduced-motion:reduce){.authback *{animation:none!important;scroll-behavior:auto!important}
}

.dashboard-market-notice{padding:17px 20px;margin-bottom:18px;background:#f8fafc;border:1px solid #dfe6ee;border-left:3px solid #9b8a64;border-radius:14px;color:#5e7089}
.dashboard-market-notice.open{border-left-color:#60967a}
.dashboard-market-notice.break,.dashboard-market-notice.opening{background:#fcfaf4;border-left-color:#b79958}
.dashboard-market-notice.closing{border-left-color:#8294ad}
.dashboard-market-badge{font-size:9px;letter-spacing:.7px;font-weight:700;color:#9d8551}
.dashboard-market-notice h3{font-size:16px;line-height:1.5;margin:5px 0;color:#43566f}
.dashboard-market-notice p{font-size:12px;line-height:1.8;margin:0 0 5px;max-width:850px}
.dashboard-market-notice small{font-size:10px;color:#8b98a9}
.portfolio-table .market-session,td .market-session{font-size:9px;line-height:1.65;white-space:normal;max-width:245px;margin-top:6px}
.market-session.break{color:#9a7938;background:#faf5e9;border-radius:6px;padding:6px 8px}
.market-session.closed{color:#7a879b}
@media(max-width:760px){.dashboard-market-notice{padding:14px 15px;margin-bottom:15px}
.dashboard-market-notice h3{font-size:14px}
.dashboard-market-notice p{font-size:11px;line-height:1.8}
.dashboard-market-notice small{font-size:9px}
.asset .market-session{font-size:11px;line-height:1.8;white-space:normal}
}
.brand .sidaps-logo{padding:0;background:none;border:0;box-shadow:none;flex-shrink:0;overflow:visible}
.sidaps-logo svg{display:block;width:100%;height:100%}
.auth-kicker .sidaps-logo{width:28px;height:28px;padding:0;background:none;border:0;box-shadow:none;animation:none;flex-shrink:0}
/* A compact status strip for login; full notices remain on the dashboard. */
#loginMarket.login-market{margin:0 0 16px;padding:10px 12px;min-height:40px;box-sizing:border-box;background:#f8fafb;border:1px solid #e1e6ec;border-radius:10px;box-shadow:none}
#loginMarket .login-market-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0}
#loginMarket .login-market-badge{font-size:10px;font-weight:600;letter-spacing:0;line-height:1.6;min-width:0;color:#65758a}
#loginMarket .login-market-badge:before{width:5px;height:5px;animation:none!important}
#loginMarket.open .login-market-badge{color:#54866b}
#loginMarket.break .login-market-badge,#loginMarket.closed .login-market-badge{color:#9a824e}
#loginMarket time{font-size:9px;line-height:1.6;flex-shrink:0;color:#91a0b1}
#loginMarket .login-market-copy,#loginMarket .login-market-footer{display:none!important}

/* Information belongs beside the form, not in top/bottom ticker bands. */
.authback{padding:24px}
.authback .ticker{display:none!important}
.auth-entry{position:relative;z-index:3;display:grid;grid-template-columns:260px minmax(0,440px);justify-content:center;align-items:center;gap:28px;width:min(760px,100%);max-height:calc(100dvh - 48px)}
.auth-entry .authcard{width:100%;min-width:0;box-sizing:border-box;max-height:calc(100dvh - 48px)}
#loginMarket.market-board{margin:0;padding:21px 20px;min-height:0;align-self:center;border:1px solid #ffffff26;border-radius:17px;background:#253447e8;box-shadow:0 12px 30px #07101e1a;backdrop-filter:none}
.market-board-eyebrow{display:block;font-size:9px;letter-spacing:1.4px;font-weight:700;color:#c9b27f;margin-bottom:15px}
#loginMarket.market-board .login-market-top{align-items:flex-start;gap:12px}
#loginMarket.market-board .login-market-badge{font-size:14px;line-height:1.7;letter-spacing:0;color:#e9edf4}
#loginMarket.market-board .login-market-badge:before{width:6px;height:6px;margin-top:8px;background:#d9bc7c}
#loginMarket.market-board.open .login-market-badge:before{background:#90b89f}
#loginMarket.market-board time{font-size:10px;color:#aebccc;padding-top:4px}
.market-board-date{font-size:11px;line-height:1.8;margin:14px 0 3px;color:#bdc9d7}
.market-board-note{display:block;font-size:9px;line-height:1.8;color:#92a3b7}
@media(max-width:900px){.authback{padding:12px}
.auth-entry{width:min(440px,100%);grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);gap:12px;max-height:calc(100dvh - 24px);min-height:0}
.auth-entry .authcard,.authback .auth-entry .authcard{max-height:calc(100dvh - 104px);min-height:0;width:100%;margin:0}
#loginMarket.market-board{padding:11px 15px;border-radius:12px;align-self:auto;box-shadow:none;background:#27384bea}
.market-board-eyebrow{font-size:8px;letter-spacing:1px;margin-bottom:4px}
#loginMarket.market-board .login-market-badge{font-size:11px;line-height:1.6}
#loginMarket.market-board .login-market-top{align-items:center}
#loginMarket.market-board .login-market-badge:before{margin-top:0;width:5px;height:5px}
#loginMarket.market-board time{padding:0;font-size:9px}
.market-board-date,.market-board-note{display:none}
}

/* Real market watch: public prices, separate from the login form. */
.auth-entry{width:min(900px,100%);grid-template-columns:minmax(0,380px) minmax(0,440px);gap:32px}
.market-watch{min-width:0;padding:25px;border:1px solid #ffffff20;border-radius:22px;background:#233345ed;color:#e9eef5;box-shadow:0 20px 60px #09152326}
.watch-heading{position:relative}
.watch-eyebrow{font-size:9px;letter-spacing:1.8px;color:#d4bc87;font-weight:700}
.watch-currency{float:right;border:1px solid #ffffff26;border-radius:6px;font-size:9px;padding:3px 6px;color:#a6b6c9}
.watch-heading h2{font-size:28px;letter-spacing:-1px;margin:9px 0 5px;color:#eff3f8}
.watch-heading p{font-size:11px;color:#a8b7c9;margin:0 0 17px}
#loginMarket.market-board{border:0;border-radius:0;background:none;box-shadow:none;padding:0 0 15px;margin:0;min-height:0}
#loginMarket.market-board .login-market-badge{font-size:10px;line-height:1.6}
#loginMarket.market-board .login-market-badge:before{margin-top:0;width:5px;height:5px}
#loginMarket.market-board .login-market-top{align-items:center}
#loginMarket.market-board time{font-size:9px;padding:0}
.watch-tabs{display:flex;gap:6px;border-bottom:1px solid #ffffff15;margin-bottom:4px;padding-bottom:12px}
.watch-tabs button{font:600 10px var(--font-body);border:1px solid transparent;border-radius:7px;padding:8px 12px;background:transparent;color:#aebed0;cursor:pointer}
.watch-tabs button[aria-pressed=true]{background:#d8bc7e19;border-color:#d8bc7e45;color:#e2c991}
.watch-tabs button:focus-visible{outline:2px solid #e2c991;outline-offset:2px}
.watch-list{max-height:350px;overflow:auto;scrollbar-width:thin;scrollbar-color:#66788c transparent}
.watch-quote{display:grid;grid-template-columns:1fr 100px;gap:7px 12px;position:relative;padding:16px 0;border-bottom:1px solid #ffffff10}
.watch-identity{display:flex;flex-direction:column;gap:3px}
.watch-symbol{font-size:13px;font-weight:700;letter-spacing:.4px}
.watch-name{font-size:9px;color:#94a7bd}
.watch-value{text-align:right;grid-column:1;grid-row:2;text-align:left}
.watch-value strong{font-size:15px;display:block;color:#edf2f8;letter-spacing:-.3px}
.watch-change{font-size:10px;display:block;margin-top:4px;color:#a6b6c9}
.watch-change small{font-size:8px;color:#94a7bd}
.watch-trend{grid-column:2;grid-row:1 / span 2;align-self:center;text-align:right;color:#a6b6c9}
.watch-chart{display:block;width:100px;height:34px;overflow:visible}
.watch-period{font-size:8px;color:#9cacc0}
.watch-no-chart{font-size:8px;color:#91a2b6}
.watch-quote.up .watch-change,.watch-quote.up .watch-chart{color:#8bd2b0}
.watch-quote.down .watch-change,.watch-quote.down .watch-chart{color:#ed9ca5}
.watch-source{grid-column:1 / -1;color:#8e9fb3;font-size:8px;line-height:1.6;margin:2px 0 0}
.watch-note{font-size:9px;line-height:1.7;color:#b0bdcd;margin:14px 0 4px}
.watch-attribution{font-size:8px;color:#9bacc0;text-decoration:none}
.watch-loading{font-size:11px;color:#a6b6c9}
@media(max-width:900px){.auth-entry{width:min(440px,100%);grid-template-columns:minmax(0,1fr);gap:12px}
.market-watch{padding:12px 14px;border-radius:15px}
.watch-heading h2,.watch-heading p,.watch-currency{display:none}
.watch-heading{margin-bottom:8px}
.watch-eyebrow{font-size:8px}
.market-watch #loginMarket.market-board{padding:0;margin:-20px 0 10px 107px}
.market-watch #loginMarket.market-board .login-market-badge{font-size:9px}
.market-watch #loginMarket.market-board time{display:none}
.watch-tabs{padding-bottom:5px;margin-bottom:2px;gap:3px}
.watch-tabs button{padding:5px 9px;font-size:9px;min-height:30px}
.watch-list{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;max-height:145px}
.watch-quote{flex:0 0 170px;padding:10px 0 5px;grid-template-columns:1fr 62px;gap:4px 6px;scroll-snap-align:start;border-bottom:0}
.watch-symbol{font-size:11px}
.watch-name{display:none}
.watch-value strong{font-size:12px}
.watch-trend{grid-row:1 / span 2}
.watch-chart{width:62px;height:30px}
.watch-source{font-size:7px;line-height:1.5}
.watch-change{font-size:9px;margin-top:3px}
.watch-period{font-size:7px}
.watch-note{font-size:8px;margin:7px 0 0}
.watch-attribution{display:none}
.auth-entry .authcard,.authback .auth-entry .authcard{max-height:calc(100dvh - 255px)}
}
@media(max-height:600px) and (max-width:900px){.authback{overflow-y:auto;align-items:flex-start}
.auth-entry{max-height:none;margin:auto}
.auth-entry .authcard,.authback .auth-entry .authcard{max-height:none}
}
.watch-search-label{display:block;font-size:9px;color:#acbbcc;margin:12px 0 6px}
.watch-search{box-sizing:border-box;width:100%;min-height:38px;padding:9px 12px;border:1px solid #ffffff26;border-radius:8px;background:#ffffff09;color:#edf2f8;font:11px var(--font-body)}
.watch-search::placeholder{color:#97a9bf}
.watch-search:focus{outline:2px solid #d6bc81;outline-offset:2px}
.watch-page{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0 0}
.watch-page span{font-size:9px;color:#afbdd0}
.watch-page button{min-width:36px;min-height:32px;border:1px solid #ffffff20;background:#ffffff08;color:#e3ca91;border-radius:7px;cursor:pointer}
.watch-page button:disabled{opacity:.35;cursor:default}
.watch-list{max-height:290px}
.watch-empty{font-size:11px;color:#afbdd0;padding:15px 0}
.watch-index-unit{font-size:9px;color:#9aadc3}
.watch-search[hidden],.watch-search-label[hidden],.watch-page[hidden]{display:none!important}
@media(max-width:900px){.watch-search-label{display:none}
.watch-search{min-height:38px;font-size:16px;margin-top:6px}
.watch-page{margin-top:5px}
.watch-page button{min-height:30px;min-width:36px}
.watch-page span{font-size:8px}
.watch-tabs{margin-bottom:0}
.watch-list{max-height:130px}
.auth-entry .authcard,.authback .auth-entry .authcard{max-height:calc(100dvh - 345px)}
.market-watch:has([data-watch-kind="index"][aria-pressed="true"]) .watch-quote{flex-basis:100%;grid-template-columns:1fr 100px}
.market-watch:has([data-watch-kind="index"][aria-pressed="true"]) .watch-chart{width:100px;height:40px}
}
@media(max-height:600px) and (max-width:900px){.auth-entry .authcard,.authback .auth-entry .authcard{max-height:none}
}
@media(max-width:900px){.auth-entry{display:flex;flex-direction:column;height:calc(100dvh - 24px);max-height:calc(100dvh - 24px);gap:12px}
.auth-entry .market-watch{flex:0 0 auto;box-sizing:border-box;width:100%}
.auth-entry .authcard,.authback .auth-entry .authcard{flex:1 1 auto;min-height:0;max-height:none!important;width:100%}
}
@media(max-height:600px) and (max-width:900px){.auth-entry{height:auto;max-height:none}
.auth-entry .authcard{flex:none}
}
/* Keep market search readable in normal, focused and autofilled states. */#marketWatch input.watch-search,#marketWatch input.watch-search:focus{background:#f8fafc;color:#243447;-webkit-text-fill-color:#243447;caret-color:#243447;border:1px solid #bac8d7;box-shadow:none}
#marketWatch input.watch-search::placeholder{color:#64748b;-webkit-text-fill-color:#64748b;opacity:1}
#marketWatch input.watch-search:focus{background:#fff;border-color:#cfb475;outline:2px solid #cfb475;outline-offset:2px}
#marketWatch input.watch-search::selection{background:#e8d6ad;color:#1f2e40;-webkit-text-fill-color:#1f2e40}
#marketWatch input.watch-search:-webkit-autofill{-webkit-text-fill-color:#243447;caret-color:#243447;-webkit-box-shadow:0 0 0 1000px #f8fafc inset}
.portfolio-empty{grid-column:1/-1;display:flex;align-items:center;gap:20px;padding:30px;border:1px dashed #cbd5df;border-radius:16px;background:#fff;color:#43566f}
.portfolio-empty-icon{display:grid;place-items:center;width:48px;height:48px;flex:0 0 48px;border-radius:14px;background:#f5eedf;color:#a18a55;font-size:25px}
.portfolio-empty h3{font-size:17px;line-height:1.5;margin:0 0 5px;color:#344860}
.portfolio-empty p{font-size:12px;line-height:1.8;margin:0;max-width:470px;color:#718197}
.portfolio-empty .btn{margin-left:auto;white-space:nowrap;min-height:44px}
.assetgrid{align-items:stretch}
.assetgrid>.asset{display:flex;flex-direction:column;min-width:0}
.assetgrid>.asset .actions{margin-top:auto;padding-top:18px}
.assetgrid>.asset .company{min-height:34px}
.portfolio-table-empty{padding:30px 20px;line-height:1.8}
@media(max-width:700px){.portfolio-empty{align-items:flex-start;flex-wrap:wrap;padding:22px;gap:14px}
.portfolio-empty>div{flex:1;min-width:150px}
.portfolio-empty .btn{margin:4px 0 0;width:100%;justify-content:center}
.portfolio-empty h3{font-size:16px}
.assetgrid>.asset .company{min-height:0}
}
.usage-guide{box-sizing:border-box;width:min(760px,calc(100% - 28px));max-height:88dvh;padding:0;border:1px solid #d7dfe8;border-radius:20px;background:#f8fafc;color:#43566f;box-shadow:0 24px 80px #101e3540;font-family:var(--font-body);overflow:auto}
.usage-guide::backdrop{background:#14233899}
.usage-guide-head{display:flex;align-items:flex-start;gap:16px;justify-content:space-between;padding:25px 28px 20px;border-bottom:1px solid #e1e7ee;background:#fff}
.usage-guide-head h2{font-size:23px;line-height:1.4;letter-spacing:-.5px;margin:7px 0;color:#2e435b}
.usage-guide-head p{font-size:12px;line-height:1.7;margin:0;color:#6d7f94}
.usage-guide-close{flex:0 0 44px;width:44px;height:44px;border:1px solid #dce3eb;background:#f5f7fa;color:#4a5d73;border-radius:10px;font-size:25px;cursor:pointer}
.usage-guide-body{padding:22px 28px}
.usage-guide-notice{font-size:12px;line-height:1.8;padding:14px 16px;background:#f5efdf;border:1px solid #e4d6b7;border-radius:10px;color:#76613b;margin-bottom:20px}
.usage-guide-steps{list-style:none;counter-reset:guide;display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0;margin:0}
.usage-guide-steps li{counter-increment:guide;border:1px solid #dce4ed;background:#fff;border-radius:13px;padding:19px}
.usage-guide-steps li:before{content:counter(guide);display:grid;place-items:center;width:29px;height:29px;border-radius:9px;background:#eaf0f6;color:#40566e;font-size:12px;font-weight:700;margin-bottom:12px}
.usage-guide-steps h3{font-size:14px;line-height:1.6;margin:0 0 8px;color:#344a63}
.usage-guide-steps p{font-size:12px;line-height:1.9;margin:0 0 10px;color:#50647d}
.usage-guide-steps small{display:block;font-size:11px;line-height:1.9;color:#6c7e92}
.usage-guide-example{padding:11px 12px;margin:10px 0;background:#f3f6fa;border-radius:8px;font-size:11px;line-height:1.9;color:#415a75}
.usage-guide-footer{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px;padding:18px 28px;border-top:1px solid #e1e7ee;background:#fff}
.usage-guide-footer .btn{min-height:44px}
.usage-guide-link{padding:8px 0;border:0;background:none;color:#806a3c;font:600 11px var(--font-body);cursor:pointer;text-align:left}
.usage-guide :focus-visible,.usage-guide-link:focus-visible{outline:2px solid #9e844c;outline-offset:3px}
@media(max-width:600px){.usage-guide{width:calc(100% - 20px);max-height:90dvh;border-radius:15px}
.usage-guide-head{padding:20px}
.usage-guide-head h2{font-size:20px}
.usage-guide-body{padding:18px}
.usage-guide-steps{grid-template-columns:1fr;gap:12px}
.usage-guide-footer{padding:16px 18px}
.usage-guide-footer .btn{flex:1;font-size:11px}
.usage-guide-button{white-space:normal}
}
.learn-banner{display:flex;align-items:center;gap:22px;margin:0 0 22px;padding:22px 25px;border:1px solid #d5dee8;border-radius:18px;background:linear-gradient(110deg,#eaf0f6,#faf7ee)}
.learn-preview{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;width:112px;height:90px;flex:0 0 112px;border:1px solid #52667e;border-radius:12px;background:#293d53;color:#e9d29b;cursor:pointer}
.learn-preview>span{font-size:25px}
.learn-preview small{font-size:8px;letter-spacing:1px}
.learn-copy{flex:1}
.learn-copy h2{font-size:21px;line-height:1.5;margin:5px 0;color:#354a63}
.learn-copy p{font-size:12px;line-height:1.8;color:#6a7e94;margin:0}
.learn-actions{display:flex;flex-direction:column;align-items:center;gap:5px}
.learn-actions .btn{min-height:44px;white-space:nowrap}
.usage-tour{padding:17px;border:1px solid #d9e2ed;border-radius:14px;background:#fff;margin-bottom:25px}
.tour-top{display:flex;justify-content:space-between;font-size:9px;letter-spacing:.7px;color:#6a7e95;gap:10px;margin-bottom:12px}
.tour-screen{min-height:200px;padding:22px;border-radius:12px;background:#edf2f7;color:#3c526d;display:flex;flex-direction:column;justify-content:center;gap:10px}
.tour-screen h4{font-size:16px;margin:0}
.tour-screen p{font-size:12px;margin:2px 0;line-height:1.7}
.tour-screen small{font-size:10px;line-height:1.7;display:block}
.tour-target{position:relative;padding:12px 35px 12px 13px;border:2px solid #ba9d5c;border-radius:8px;background:#f7efd9;color:#62502c;font-size:12px;font-weight:600}
.tour-target>span{position:absolute;right:10px;top:9px;font-size:22px;animation:tourPoint 1.2s ease-in-out infinite}
.tour-mock-input{padding:11px;background:#fff;border:1px solid #c7d5e4;border-radius:7px;font-size:12px}
.tour-mock-nav{display:flex;justify-content:space-between;font-size:10px;color:#7b8ca0;margin-bottom:8px}
.tour-mock-card{background:#fff;border:1px solid #d7e0ea;border-radius:10px;padding:17px}
.tour-mock-card .tour-target{margin-top:12px}
.tour-form-example{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:11px}
.tour-form-example>span{padding:9px;background:#fff;border-radius:7px}
.tour-success{color:#347756;font-size:12px;padding:10px;background:#e5f2eb;border-radius:8px}
.tour-caption h3{font-size:15px;margin:16px 0 5px;color:#344a63}
.tour-caption p{font-size:12px;line-height:1.8;color:#62758b;margin:0;min-height:44px}
.usage-tour progress{display:block;width:100%;height:5px;margin:16px 0;accent-color:#b69c61}
.tour-controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.tour-controls .btn{min-height:44px}
.tour-disclaimer{display:block;font-size:10px;color:#7c8b9d;line-height:1.7;margin-top:12px}
.guide-reading-title{font-size:16px;color:#3d526b;margin:0 0 15px}
@keyframes tourPoint{50%{transform:translate(-3px,3px)}
}
@media(prefers-reduced-motion:reduce){.tour-target>span{animation:none}
}
@media(max-width:650px){.learn-banner{gap:14px;padding:18px;flex-wrap:wrap}
.learn-preview{width:75px;height:78px;flex-basis:75px}
.learn-preview small{font-size:7px}
.learn-copy{min-width:160px}
.learn-copy h2{font-size:18px}
.learn-actions{width:100%;flex-direction:row;justify-content:space-between;gap:12px}
.learn-actions .btn{font-size:11px}
.learn-actions .usage-guide-link{font-size:10px}
.usage-tour{padding:12px}
.tour-screen{padding:15px;min-height:210px}
.tour-form-example{grid-template-columns:1fr}
.tour-controls{gap:6px}
.tour-controls .btn{font-size:11px;padding:9px}
.tour-caption p{min-height:0}
}
.header-help-button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;padding:9px 11px;border:1px solid #ffffff25;border-radius:10px;background:#ffffff08;color:#e3d6b5;font:600 10px var(--font-body);cursor:pointer;flex-shrink:0}
.header-help-button:hover{background:#ffffff14}
.header-help-button:focus-visible{outline:2px solid #d6bf87;outline-offset:3px}
.header-help-button>span{font-size:15px}
.tour-target>span{animation:none!important}
.cloud-sync{font-size:10px;color:#8b98aa;margin:0 0 15px}
.cloud-sync.ok{color:#7a947d}
.cloud-sync.error{background:#fff3ef;color:#ac7064;padding:12px 15px;border:1px solid #eed9d0;border-radius:10px;position:sticky;top:8px;z-index:5}
.cloud-signin a{display:flex;justify-content:center;text-decoration:none;margin:20px 0 12px}
.cloud-signin p{font-size:10px;line-height:1.8;color:#8c9caf}
.cloud-owner-note{margin-bottom:22px}
.cloud-owner-note p{font-size:10px;color:#8b9ab1}
.cloud-managed-login p{font-size:11px;line-height:1.8}
.cloud-owner-note[hidden],[data-owner-only][hidden]{display:none!important}
.google-divider{display:flex;align-items:center;gap:12px;color:#8995a5;font-size:11px;margin:14px 0}
.google-divider:before,.google-divider:after{content:"";height:1px;background:#e4e8ee;flex:1}
.google-signin-button{display:flex;align-items:center;justify-content:center;gap:12px;width:100%;min-height:44px;border:1px solid #d8dfe7;border-radius:10px;background:#fff;color:#40526a;font:600 12px var(--font-body);cursor:pointer}
.google-signin-button:hover{background:#f7f9fc;border-color:#acbacb}
.google-signin-button:disabled{opacity:.6;cursor:wait}
.google-signin-button svg{width:20px;height:20px}
.google-auth-message{font-size:10px;line-height:1.7;color:#8a7558;text-align:center;margin:7px 0 0}
.google-signin-button:focus-visible{outline:3px solid #afc6e3;outline-offset:3px}
.cloud-signin #emailAuthForm{display:flex;gap:12px;flex-direction:column;margin-top:18px}
.cloud-signin .field[hidden],#cloudOldPasswordField[hidden]{display:none!important}
.cloud-signin input{min-height:42px}
.cloud-signin #emailSubmit{width:100%;min-height:43px}
.email-auth-links{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin:14px 0}
.email-auth-links button{border:0;background:none;color:#9d875b;cursor:pointer;font:600 10px var(--font-body);padding:4px 0}
.legacy-account-link{font-size:9px;color:#8c99ad;margin-top:15px}
.legacy-account-link summary{cursor:pointer}
.cloud-signin .legacy-account-link a{font-size:10px;background:#f6f3eb;border:1px solid #e5ddc9;color:#9c875c;border-radius:8px;padding:9px}
.cloud-signin .legacy-account-link p,.signup-privacy{font-size:9px;line-height:1.85;color:#95a2b5}
.account-recovery-modal{z-index:40}
.account-recovery-modal .codebox{font-size:14px;line-height:1.9;letter-spacing:.5px;word-break:break-all}
.cloud-managed-login #cloudPasswordForm{margin-top:18px}
#emailAuthMessage,#cloudPasswordMessage{color:#ac776d!important}
 .saving-note{margin-top:17px;padding:15px 16px;border:1px solid #e8dfcc;border-left:3px solid #c5aa72;border-radius:12px;background:linear-gradient(120deg,#f8f3e7,#fafbfd);text-align:left}
.saving-note-eyebrow{font-size:8px;font-weight:700;letter-spacing:1.2px;color:#a18b5d}
.authcard .saving-note h3{font-size:13px;line-height:1.7;color:#53647b;margin:5px 0}
.cloud-signin .saving-note p{font-size:11px;line-height:1.9;margin:0;color:#7e8ca0}
.signup-privacy[hidden],.legacy-account-link[hidden]{display:none!important}
@media(max-width:760px){.saving-note{padding:14px}
.authcard .saving-note h3{font-size:13px}
.cloud-signin .saving-note p{font-size:11px}
}
/* Quiet, form-only authentication surface using Sidaps navy. */
#authBack{background:#101a28;padding:36px 16px;overflow-y:auto;overscroll-behavior:contain}
#authBack:before,#authBack:after,#authBack .authglow,#authBack .auth-aurora,#authBack .auth-sparkles,#authBack #authCanvas,#authBack #authCoins,#authBack .ticker{display:none!important}
#authBack .auth-entry{display:flex;flex-direction:column;gap:24px;width:min(420px,100%);height:auto;max-height:none;margin:auto}
#authBack .auth-brand{display:flex;align-items:center;justify-content:center;gap:12px;color:#edf2f8;font:700 13px var(--font-body);letter-spacing:1.1px;text-decoration:none;min-height:40px}
#authBack .auth-brand img{border-radius:8px}
#authBack .authcard{flex:none;width:100%;max-height:none!important;overflow:visible;padding:29px 28px;border:1px solid #314053;border-radius:22px;background:#192638;box-shadow:0 20px 65px #060c171f;animation:none;backdrop-filter:none;color:#dce5f0}
#authBack .auth-illustration,#authBack .auth-kicker,#authBack .auth-guide,#authBack .saving-note{display:none!important}
#authBack .auth-intro{display:block;padding:0;border:0;margin:0 0 24px;gap:0}
#authBack .auth-intro-copy{width:100%}
#authBack .auth-intro h2{font-size:25px;font-weight:650;letter-spacing:-.6px;line-height:1.4;margin:0 0 10px;color:#f2f5fa}
#authBack .auth-intro-copy #authSub{font-size:12px;line-height:1.8;color:#a0b2c8;margin:0}
#authBack .cloud-signin #emailAuthForm{gap:15px;margin:0}
#authBack .field label{font-size:11px;font-weight:550;color:#dce5ef;letter-spacing:.1px}
#authBack .cloud-signin input{background:#111e2e;color:#eef3fa;border:1px solid #344357;box-shadow:none;border-radius:10px;min-height:48px;font-size:14px;caret-color:#e4cf9f}
#authBack .cloud-signin input::placeholder{color:#8197b3;opacity:1}
#authBack .cloud-signin input:focus{border-color:#bca675;outline:2px solid #bca67555;outline-offset:1px;background:#142235}
#authBack .cloud-signin input:-webkit-autofill{-webkit-text-fill-color:#eef3fa;-webkit-box-shadow:0 0 0 1000px #111e2e inset}
#authBack .password-toggle{color:#9db0c9;min-width:44px;min-height:44px}
#authBack .password-toggle:hover{color:#ead3a1;background:#25364b}
#authBack #emailSubmit{background:#e3ca91;border-color:#e3ca91;color:#453c2d;font-size:13px;font-weight:650;min-height:48px;border-radius:10px;box-shadow:none}
#authBack .login-recovery-link{text-align:right;margin:0}
#authBack .login-recovery-link button{border:0;background:none;color:#d1b982;font:600 11px var(--font-body);min-height:32px;padding:0 0 0 10px;cursor:pointer}
#authBack #emailAuthMessage:empty{display:none}
#authBack .google-divider{margin:20px 0 15px;color:#8193aa;font-size:11px}
#authBack .google-divider:before,#authBack .google-divider:after{background:#344357}
#authBack .google-signin-button{background:#233347;border:1px solid #41536a;color:#f1f5fa;border-radius:10px;min-height:48px;font-size:12px}
#authBack .google-signin-button:hover{background:#2b3e56}
#authBack .google-auth-message{color:#b9c6d7;font-size:11px;margin:9px 0 0;line-height:1.7}
#authBack .google-auth-message:empty{display:none}
#authBack .email-auth-links{margin:22px 0 0;align-items:center;gap:9px;font-size:11px;color:#9eafc5}
#authBack .email-auth-links button{font-size:11px;color:#e4cea0;min-height:34px;padding:0 3px}
#authBack[data-auth-mode="login"] .email-auth-links button[onclick="cloudAuthSetMode('login')"]{display:none}
#authBack:not([data-auth-mode="login"]) .new-account-hint{display:none}
#authBack .legacy-account-link,#authBack .signup-privacy{color:#a6b6ca;font-size:10px}
#authBack .profile-message{color:#ffb7a4!important;line-height:1.7;font-size:11px}
#authBack .legacy-account-link a{background:#223347;color:#e0c793;border-color:#3b4f65}
#authBack .authcard .legacy-account-link p{color:#a6b6ca}
#authBack button:focus-visible,#authBack a:focus-visible{outline:2px solid #d6bf87;outline-offset:3px}
@media(max-width:600px){#authBack{padding:25px 16px}
#authBack .auth-entry{gap:20px}
#authBack .authcard{padding:25px 23px;border-radius:20px}
#authBack .cloud-signin input{font-size:16px}
#authBack .auth-brand{font-size:12px}
#authBack .auth-intro h2{font-size:24px}
}
`;
