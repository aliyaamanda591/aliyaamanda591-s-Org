export const portfolioStylesComponentsHtml = `.profile-local-note{background:#faf0d7;color:#b29664}
.profile-local-note>span:first-child{color:#b99a55}
.profile-dialog .modalactions{border-top-color:#eddfc1}
.profile-message{color:#aa8143!important}
.authback{background:radial-gradient(ellipse at 8% 8%,#654c25 0,transparent 53%),radial-gradient(ellipse at 95% 90%,#684534 0,transparent 50%),#211c18}
.authback::before{background:#b6882d;opacity:.4}
.authback::after{background:#9c643d;opacity:.35}
.authglow{background:#e1c176;opacity:.2}
.ribbon-one{background:linear-gradient(100deg,#cba33d22,#d4b053 35%,#be9369 66%,#c4bb86)}
.ribbon-two{background:linear-gradient(110deg,#a9ab7a,#bb9a58 40%,#bf8d6a 72%,#f2d78c)}
.aurora-orbit{border-color:#f2d69616;box-shadow:0 0 0 35px #e8d39a04,0 0 0 75px #efd49505}
.aurora-orbit::before{background:#efcf80;box-shadow:0 0 20px #efcf80}
.orbit-two::before{background:#deb18c;box-shadow:0 0 20px #deb18c}
.auth-sparkles i{background:#ecd39a;color:#ecd39a}
.authcard{border-color:#e9d7ad;background:radial-gradient(ellipse at 0 0,#ffedb3 0,transparent 55%),radial-gradient(ellipse at 100% 100%,#f3e5c6 0,transparent 55%),linear-gradient(145deg,#fff9e9,#fff4d6);box-shadow:0 0 0 5px #e4c77e0d,0 25px 80px #1e140faa,0 0 65px #c4a04b22}
.auth-intro{border-bottom-color:#d0b77b40}
.auth-illustration::before{background:radial-gradient(circle,#e2c17444,transparent 70%)}
.auth-kicker{color:#a78a50}
.authcard .authlogo{background:linear-gradient(120deg,#d0ac5e,#b3904a);color:#fff4d3;box-shadow:0 3px 8px #a27d3120}
.authcard h2{color:#6e512c}
.auth-intro-copy #authSub{color:#a88b5a}
.auth-guide,.auth-guide span{color:#ae8845}
.authcard input{background:#fffdf4;border-color:#e4d2a7;color:#947447}
.authcard input:focus{background:#fffdf7;outline-color:#eddfb9}
.authcard .field label{color:#a48959}
.authcard .password-toggle:hover{background:#f9edcd}
.authcard #authBtn{background:linear-gradient(115deg,#e9cb75,#dfb95a);border-color:#cfaa50;color:#61481d;box-shadow:0 7px 18px #af883026}
.authcard .authalt{color:#a88442}
/* A richer overview using real portfolio values, with no invented price history. */
.investment-overview{position:relative;padding:27px;border:1px solid #e9d8a9;border-radius:23px;background:radial-gradient(ellipse at 100% 0,#ffe59955,transparent 55%),linear-gradient(145deg,#fffaf0,#fff5da);box-shadow:0 12px 32px #8c68200a;margin-bottom:24px;overflow:hidden}
.overview-heading{position:relative;z-index:1;margin-bottom:23px;gap:18px}
.overview-eyebrow{display:block;font-size:8px;font-weight:700;letter-spacing:1.8px;color:#b18a42;margin-bottom:7px}
.overview-heading h2{font-size:29px;color:#6d512d;letter-spacing:-.6px}
.overview-heading p{font-size:10px;color:#ae9367;max-width:600px}
.overview-heading .btn{min-height:37px;font-size:10px;padding:9px 13px}
.overview-heading .soft{background:#fffaf0;border-color:#e8d7af}
.overview-heading .primary{box-shadow:0 4px 10px #ab80241a}
.overview-grid{position:relative;z-index:1;gap:15px;margin:0;grid-template-columns:repeat(4,minmax(0,1fr))}
.overview-grid .overview-stat{position:relative;display:flex;flex-direction:column;min-height:191px;padding:20px!important;border-radius:15px;border:1px solid #eadbb7;background:#fffdf6;box-shadow:0 4px 15px #8c682005;overflow:hidden}
.overview-grid .overview-stat::before{display:none}
.overview-grid .overview-stat::after{display:none}
.overview-grid .overview-stat:hover{box-shadow:0 6px 18px #8c68200b;transform:none}
.overview-stat-top{display:flex;align-items:center;justify-content:space-between;gap:9px}
.overview-stat .label{color:#b09564;font-size:8px;letter-spacing:.65px;line-height:1.65}
.overview-icon{flex:0 0 29px;width:29px;height:29px;border-radius:9px;display:grid;place-items:center;background:#f7edd3;border:1px solid #f0e3c2;color:#c0a05f}
.overview-icon svg{width:16px;height:16px}
.overview-stat .metric{font-size:clamp(20px,2.05vw,28px);color:#73582e;font-weight:550;letter-spacing:-.65px;margin-top:16px;white-space:nowrap;line-height:1.3}
.overview-stat-caption{font-size:8px;color:#b3a080;line-height:1.8;margin-top:7px}
.overview-stat-bottom{display:flex;align-items:center;gap:5px;margin-top:auto;padding-top:14px;border-top:1px solid #eee4ce;font-size:8px;color:#b19a72;line-height:1.65}
.overview-mini-dot{width:4px;height:4px;border-radius:50%;background:#e5c47c}
.overview-currency{margin-left:auto;font-size:7px;letter-spacing:1px}
.overview-grid .capital-stat{background:radial-gradient(ellipse at 110% -20%,#c3994d44,transparent 65%),linear-gradient(130deg,#71532d,#4d3924);border-color:#775b34;box-shadow:0 8px 18px #6b502021}
.capital-stat .label{color:#e9d3a3}
.capital-stat .metric{color:#fff2cd}
.capital-stat .overview-stat-caption{color:#c6ac7e}
.capital-stat .overview-icon{background:#fff0c80b;border-color:#ecd09225;color:#e4c176}
.capital-stat .overview-stat-bottom{border-top-color:#d5bb8029;color:#c4a97a}
.overview-grid .value-stat{background:linear-gradient(145deg,#fffdf6,#fff4cf);border-color:#ebd7a1}
.value-stat .overview-icon{background:#f6e5b0;color:#bd9550;border-color:#edd7a1}
.profit-stat .metric.red{color:#b56a60}
.profit-stat .metric.green{color:#7b9161}
.profit-stat.overview-loss{background:linear-gradient(145deg,#fffdf6,#fdf3e5);border-color:#e9dac0}
.profit-stat.overview-loss .overview-icon{background:#f5e9db;color:#c19a7f;border-color:#ead9c4}
.profit-stat.overview-gain{background:linear-gradient(145deg,#fffdf6,#f4f3df)}
.profit-stat .metric-note{font-size:8px;line-height:1.85;white-space:pre-line;margin:7px 0 10px;color:#b29b77}
.profit-stat .overview-stat-bottom{font-size:7px}
.activity-stat #transactionCount{font-size:34px;font-weight:500;letter-spacing:-1px;margin-top:13px}
.overview-flow-counts{justify-content:space-between}
.overview-flow-counts span{display:inline-flex;align-items:center;gap:5px}
.overview-flow-counts span::before{content:'';width:4px;height:4px;background:#b6b185;border-radius:50%}
.overview-flow-counts span:last-child::before{background:#cbaa85}
.overview-composition{margin-top:21px;border-top:1px solid #eadbb777;padding-top:17px}
.overview-composition-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}
.overview-composition-heading>span{font-size:10px;color:#a1834f;font-weight:600}
.overview-composition-heading small{font-size:8px;color:#bda47a}
.overview-allocation-bar{display:flex;gap:3px;height:7px;border-radius:10px;overflow:hidden;background:#efe2c4}
.overview-allocation-segment{display:block;min-width:1px;border-radius:2px;opacity:.8}
.overview-no-allocation{width:100%;background:#eee0bf}
.overview-allocation-legend{display:flex;flex-wrap:wrap;gap:9px 17px;margin-top:11px}
.overview-allocation-legend>span{display:inline-flex;gap:5px;align-items:center;font-size:8px;color:#b09a73}
.overview-allocation-legend i{height:5px;width:5px;border-radius:50%;display:inline-block;opacity:.8}
.overview-allocation-legend b{font-size:8px;color:#997e4f;font-weight:600}
@media(max-width:1150px){.overview-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
.overview-stat .metric{font-size:30px}
.overview-grid .overview-stat{min-height:191px}
.investment-overview{padding:23px}
.overview-heading{align-items:flex-start}
.overview-heading .toolbar{padding-top:15px}
.overview-stat .label{font-size:9px}
.overview-stat-caption,.overview-stat-bottom,.profit-stat .metric-note{font-size:9px}
.overview-stat .overview-icon{width:32px;height:32px;flex-basis:32px}
}
@media(max-width:600px){.investment-overview{padding:17px;border-radius:18px;margin-bottom:22px}
.overview-heading{gap:12px;margin-bottom:18px}
.overview-heading h2{font-size:26px}
.overview-eyebrow{font-size:7px;letter-spacing:1.4px}
.overview-heading p{font-size:9px;line-height:1.8}
.overview-heading .toolbar{padding-top:0;width:100%;gap:8px}
.overview-heading .btn{font-size:9px;padding:9px 11px;min-height:35px;flex:1}
.overview-grid{gap:10px}
.overview-grid .overview-stat{padding:14px!important;border-radius:12px;min-height:183px}
.overview-stat .label{font-size:7px;letter-spacing:.25px}
.overview-stat .overview-icon{width:23px;height:23px;flex-basis:23px;border-radius:7px}
.overview-icon svg{width:13px;height:13px}
.overview-stat .metric{font-size:clamp(16px,4.2vw,22px);letter-spacing:-.35px;margin-top:17px}
.overview-stat-caption{font-size:7px;line-height:1.85}
.overview-stat-bottom,.profit-stat .metric-note{font-size:7px;line-height:1.8}
.profit-stat .overview-stat-bottom{font-size:6px}
.activity-stat #transactionCount{font-size:30px}
.overview-currency{font-size:6px}
.overview-composition{margin-top:17px;padding-top:14px}
.overview-composition-heading{align-items:flex-start;flex-direction:column;gap:4px}
.overview-composition-heading>span{font-size:9px}
.overview-composition-heading small{font-size:7px}
.overview-allocation-legend{gap:8px 11px}
.overview-allocation-legend>span,.overview-allocation-legend b{font-size:7px}
.overview-allocation-bar{height:6px}
.admin-hero{background:linear-gradient(110deg,#5a4229,#8a6b39)}
}
.ticker{background:#2a2118b3}
.ticker.top,.ticker.bot{border-color:#ead39a18}
.tkTrack span{color:#e5d6b5}
.overview-stat .label{font-size:9px}
.overview-stat-caption{font-size:9px}
.overview-stat-bottom{font-size:9px}
.profit-stat .metric-note{font-size:9px}
.profit-stat .overview-stat-bottom{font-size:8px}
.overview-composition-heading>span{font-size:11px}
.overview-composition-heading small{font-size:9px}
.overview-allocation-legend>span,.overview-allocation-legend b{font-size:9px}
.overview-allocation-legend>span{color:#9d845d}
.overview-composition-heading small{color:#a88d60}
.overview-grid .overview-stat{min-height:205px}
.overview-grid .overview-stat .metric{font-size:clamp(21px,2.1vw,29px)}
.activity-stat #transactionCount.metric{font-size:34px}
@media(max-width:1150px){.overview-grid .overview-stat .metric{font-size:30px}
}
@media(max-width:600px){.overview-stat .label{font-size:8px}
.overview-stat-caption,.overview-stat-bottom,.profit-stat .metric-note{font-size:8px}
.profit-stat .overview-stat-bottom{font-size:7px}
.overview-grid .overview-stat{min-height:199px}
.overview-grid .overview-stat .metric{font-size:clamp(16px,4.2vw,22px)}
.activity-stat #transactionCount.metric{font-size:30px}
.overview-allocation-legend>span,.overview-allocation-legend b{font-size:8px}
.overview-composition-heading>span{font-size:10px}
.overview-composition-heading small{font-size:8px}
}
/* Neutral surfaces, clear text, champagne accents only. */
:root{--bg:#f3f4f6;--ink:#293647;--muted:#75808e;--line:#e2e6ec;--navy:#283646;--blue:#ad8c42;--green:#408468;--red:#bd6368;--grad:linear-gradient(115deg,#e8cd90,#dec07c)}
body{background:#f3f4f6;color:#293647}
header{background:#273546;border-bottom:1px solid #344357}
header::before,header::after{display:none}
.brand h1{color:#f4f6f8}
.brand p{color:#aab5c4}
.brand .logo{color:#dcc48b;background:#ffffff09;border-color:#ffffff1c}
#userChip{background:#ffffff06;border-color:#ffffff17}
.header-profile{color:#f4f5f8}
.avatar{background:#ffffff0b;border-color:#ffffff1b;color:#dfc58b}
.header-profile:hover,.header-logout:hover{background:#ffffff0c}
#userChip .header-profile-copy small{color:#b6c1d0}
.profile-chevron{color:#aab6c7}
.header-logout{background:#ffffff08;border-color:#ffffff20;color:#d5dce6}
#dateNow{color:#bac5d3}
.tabs{background:#fff;border-color:#e0e5eb;box-shadow:none}
.tab{color:#758090}
.tab.active{background:#f5efdf;color:#8e743c}
.tab:hover{background:#f3f5f7;color:#596a80}
.primary{background:#e5c989;border-color:#d6b973;color:#514325;box-shadow:none}
.primary:hover{background:#dfbf78;box-shadow:none}
.soft{background:#f7f8fa;border-color:#e0e5eb;color:#69798b}
.soft:hover{background:#edf0f4}
.danger{background:#fbf3f2;border-color:#eddcda;color:#ae6762}
.sell-btn{background:#f0f6f3;border-color:#dfe9e3;color:#62846d}
.archive-btn{background:transparent;border-color:transparent;color:#8d96a2}
.archive-btn:hover{background:#f4f5f7}
.btn:focus-visible,.tab:focus-visible{outline-color:#bb9d5d}
.portfolio-banner{background:#e9edf2;border-color:#e0e5eb;color:#43546a;box-shadow:none}
.portfolio-banner h2{color:#35465b}
.portfolio-banner p{color:#778698}
.portfolio-banner::after{border-color:#ffffff44}
.eyebrow{color:#9a8556}
.market-art{opacity:.4}
.market-art i{background:#99a6b6}
.card{background:#fff;border-color:#e2e6ec;box-shadow:0 3px 12px #26374b03}
.card:hover{border-color:#d8dfe7}
.label{color:#7e8999}
.metric{color:#35465b}
.metric.green{color:#408468}
.metric.red{color:#bd6368}
.metric-note{color:#8992a0}
.notice{background:#f8f9fa;border-color:#e1e5ea;border-left-color:#c9b886;color:#7d8794}
.section h3{color:#3c4b60}
.section h3::before{background:#c7b27d}
.status{background:#fff;border-color:#e3e7ed}
.quote-status{color:#808c9d}
.dot{background:#aeb7c4}
.dot.live{background:#78a18a}
.idx-market-summary{background:#eef1f5;border-color:#e1e6ed;color:#7f8b9b}
.idx-market-summary.open{background:#f1f6f2;border-color:#dfe9e2;color:#6c8a73}
.asset::before{background:#c4b388!important;opacity:.5}
.assetgrid .asset:nth-child(3n+2)::before{background:#b0bdc8!important}
.assetgrid .asset:nth-child(3n)::before{background:#b5c1b5!important}
.asset:hover{box-shadow:0 5px 16px #26374b06}
.asset h3{color:#3c4b60}
.asset-logo{background:#f8f9fb;border-color:#edf0f4}
.asset .company{color:#8792a2}
.price{color:#35465b}
.assetrow{color:#7d899a;border-bottom-color:#edf0f4;font-size:12px}
.assetrow b{color:#576c86}
.assetrow b.green{color:#4a8b6c}
.assetrow b.red{color:#bc6d72}
.asset .quote-meta{color:#8a94a3;font-size:10px}
.tag{background:#f0f6f1;border-color:#e0e9df;color:#6f8d6f}
.tag.closed,.tag.manual{background:#f1f3f6;border-color:#e5e8ed;color:#8d98a7}
.tag.cached{background:#faf5e9;border-color:#ece2c9;color:#a18a54}
.tag.loading{background:#f6f2e8;border-color:#e6ddc6;color:#99875e}
.market-session{color:#8e99a7}
.market-session.open{color:#789173}
.market-session.break,.market-session.closing,.market-session.opening{color:#a18e60}
.market-session>span{background:#a8b1bd}
.tablewrap{background:#fff;border-color:#e1e6ed}
.tablewrap th{background:#f4f6f9;color:#8391a5;border-bottom-color:#e2e7ee}
td{color:#66788e;border-bottom-color:#edf0f5}
tbody tr:hover{background:#f7f9fc}
.portfolio-table td small{color:#949fae}
.pill{background:#eef5f0;color:#77957f}
.pill.out{background:#faf0ee;color:#b17e78}
.scroll-transactions,.log-viewport{scrollbar-color:#bdc7d3 #f2f4f7}
.scroll-hint{color:#939ead}
.field label{color:#8491a4}
input,select,textarea{background:#fdfefe;border-color:#dfe5ed;color:#5a6f89}
input:focus,select:focus,textarea:focus{background:#fff;outline-color:#f3eddf;border-color:#c4b07c}
input::placeholder,textarea::placeholder{color:#a7b1bf}
.muted{color:#8592a4}
.codebox{background:#f7f5ee;border-color:#cfc3a6;color:#8a7956}
pre{background:#293647;color:#c1cddd}
.modal{background:#fff;border-top-color:#cbbb92;box-shadow:0 30px 100px #15253933}
.modal h3{color:#495d75}
.modal p{color:#8a97a9}
.modalback{background:#1f2d4166}
.password-toggle{color:#8b99ac}
.password-toggle:hover,.password-toggle[aria-pressed="true"]{background:#f4f0e6;color:#a18d5e}
.password-toggle:focus-visible{outline-color:#baa574;background:#f5f1e7}
.asset-catalog{background:#f8fafc;border-color:#e2e7ef}
.catalog-option{color:#596c86}
.catalog-option:hover{background:#f1f4f9}
.catalog-option[aria-pressed="true"]{background:#f7f1e2;border-color:#d4bf8b}
.catalog-copy small{color:#8c9aaf}
.catalog-mark{color:#9f9479}
.asset-selection,.purchase-preview{background:#f7f3e8;color:#978660}
.asset-selection small{color:#9c937e}
.sale-preview{background:#f2f6f3;color:#77937d;border-color:#e0e9e1}
.sale-method,.sale-archive{color:#8b98aa}
.sell-all{color:#9a875d}
.sale-archive input{accent-color:#b49b62}
.archived-holdings summary{color:#8797ad}
.archived-asset-row{border-color:#e9eef4}
footer{color:#9aa6b6}
footer a{color:#9d916f}
.admin-hero{background:#35465c;border-color:#44576f}
.admin-eyebrow{color:#c2c6c9}
.admin-avatar{background:#ffffff0d;border-color:#ffffff24;color:#e3cf9b}
.admin-roles span{background:#ffffff09;border-color:#ffffff21;color:#d6dde7}
.admin-edit-profile{background:#ffffff0b;border-color:#ffffff2b;color:#dde4ed}
.admin-edit-profile:hover{background:#ffffff16}
.admin-account small{color:#b6c4d7}
.local-account-dot{background:#adb79c;box-shadow:0 0 0 4px #adb79c13}
.admin-meta{color:#8f9cb0}
.admin-stats .card{background:#fff;border-color:#e3e8ef}
.dev-sidebar{background:#fff;border-color:#e3e8ee}
.dev-nav-label{color:#9ca9bb}
.dev-nav-btn{color:#8c9bb1}
.dev-nav-btn.active{background:#f7f1e2;color:#a18b5b}
.dev-nav-btn:hover{background:#f4f6f9;color:#8193ad}
.dev-sidebar-note{color:#9caabd;border-color:#e5ebf3}
.dev-content{background:#fafbfd;border-color:#e3e9f1}
.dev-view-heading{border-bottom-color:#e2e9f2}
.dev-view-heading h3{color:#61758e}
.dev-view-heading p{color:#99a8bd}
.dev-content .card{background:#fff;border-color:#e4eaf3}
.dev-content .section h3{color:#7589a4}
.dev-technical summary{color:#9c8c69}
.backup-time{color:#9aaabd}
.dev-danger-area{border-top-color:#eddeda}
.dev-danger-area .card{background:#fdf8f6;border-color:#ebded9}
.log-count{background:#f7f1e2;color:#aa9464}
.log-event::before{background:#b6b6a8}
.log-event.success::before{background:#9aaf98}
.log-event.failed::before{background:#c7988f}
.log-viewport td:first-child{color:#9aa9bd}
.log-help,.log-pagination p{color:#9cabc1}
.log-page-info{color:#a59573}
.profile-dialog{background:#fff}
.profile-dialog-heading{border-bottom-color:#e7edf5}
.profile-eyebrow{color:#b7a57e}
.profile-photo-preview{background:#f6f1e6;border-color:#e4d9c1;color:#ac976b}
.profile-dialog-heading p,.profile-photo-controls p,.profile-login-note{color:#9cacbf!important}
.profile-local-note{background:#f4f7fb;color:#99abc2}
.profile-local-note>span:first-child{color:#b3a17a}
.profile-dialog .modalactions{border-top-color:#e8eef5}
.profile-message{color:#a89469!important}
.authback{background:radial-gradient(ellipse at 15% 10%,#3b4c65 0,transparent 55%),#202a38}
.authback::before{background:#8d9aab;opacity:.2}
.authback::after{background:#847766;opacity:.2}
.authglow{background:#b6aa8b;opacity:.12}
.ribbon-one{background:linear-gradient(100deg,#9ca6b022,#8e9eaf,#a49f90,#aaa184);opacity:.12}
.ribbon-two{background:linear-gradient(110deg,#9bafaa,#839ab4,#ae9a89,#c4b38a);opacity:.12}
.aurora-orbit{border-color:#ccd4e210;box-shadow:none}
.authcard{border-color:#dfe5ec;background:radial-gradient(ellipse at 0 0,#f8f1de 0,transparent 65%),#f9fafb;box-shadow:0 25px 80px #0e192f66}
.auth-intro{border-bottom-color:#d7dfe766}
.auth-kicker{color:#a7956f}
.authcard h2{color:#4d6079}
.auth-intro-copy #authSub{color:#98a7bc}
.auth-guide,.auth-guide span{color:#a18e66}
.authcard input{background:#fff;border-color:#dce4ed;color:#788ca7}
.authcard input:focus{background:#fff;outline-color:#eee8dc}
.authcard .field label{color:#97a8bf}
.authcard .password-toggle:hover{background:#f6f1e6}
.authcard #authBtn{background:#e3ca91;border-color:#d6ba7d;color:#76623b;box-shadow:none}
.authcard .authalt{color:#a9966e}
.ticker{background:#202b39b3}
.tkTrack span{color:#c3cede}
/* Preserve the overview layout while removing the all-yellow wash. */
.investment-overview{background:#fff;border-color:#dfe5ed;box-shadow:0 7px 24px #30456304}
.overview-heading h2{color:#42566f}
.overview-eyebrow{color:#a79365}
.overview-heading p{color:#8f9db0}
.overview-heading .soft{background:#fafbfd;border-color:#e1e7ef}
.overview-heading .primary{box-shadow:none}
.overview-grid .overview-stat{background:#fafbfd;border-color:#e2e8ef;box-shadow:none}
.overview-grid .overview-stat:hover{box-shadow:none}
.overview-stat .label{color:#8f9db1;font-size:10px}
.overview-stat .metric{color:#526984}
.overview-icon{background:#f1f3f6;border-color:#e7ebf1;color:#a59572}
.overview-stat-caption{color:#9aa8bc;font-size:10px}
.overview-stat-bottom{border-top-color:#e7edf5;color:#9aabbe;font-size:9px}
.overview-grid .capital-stat{background:#384b63;border-color:#41566f;box-shadow:none}
.capital-stat .label{color:#c5d1df}
.capital-stat .metric{color:#f1f5f9}
.capital-stat .overview-stat-caption{color:#a6b9d1}
.capital-stat .overview-icon{background:#ffffff08;border-color:#ffffff18;color:#d2bc85}
.capital-stat .overview-stat-bottom{border-top-color:#ffffff16;color:#b1c1d6}
.overview-mini-dot{background:#d1be8c}
.overview-grid .value-stat{background:#fafbfd;border-color:#e2e8ef}
.value-stat .overview-icon{background:#f5f1e7;border-color:#eae1cc;color:#b4a06f}
.overview-grid .profit-stat.overview-loss,.overview-grid .profit-stat.overview-gain{background:#fafbfd;border-color:#e2e8ef}
.profit-stat.overview-loss .overview-icon{background:#f6f1ed;border-color:#ece2db;color:#bda28a}
.profit-stat .metric.red{color:#b7757e}
.profit-stat .metric.green{color:#7c9b83}
.profit-stat .metric-note{color:#9daec4;font-size:9px}
.profit-stat .overview-stat-bottom{color:#9aaabc}
.overview-currency{color:#bdc9d9}
.overview-flow-counts span::before{background:#a9baa6}
.overview-flow-counts span:last-child::before{background:#c3b09b}
.overview-composition{border-top-color:#e7edf4}
.overview-composition-heading>span{color:#94a4bb}
.overview-composition-heading small{color:#a9b7c9}
.overview-allocation-bar{background:#eef1f5}
.overview-no-allocation{background:#edf1f5}
.overview-allocation-legend>span{color:#a1aec0}
.overview-allocation-legend b{color:#97a3b6}
/* Secondary information remains readable instead of fading into the background. */
.company,.asset .company,.quote-status,.quote-meta,.asset .quote-meta,.head p,.muted,.scroll-hint,.log-help,.profile-dialog-heading p,.dev-view-heading p{color:#768293}
.overview-stat .label{color:#788596}
.overview-stat-caption,.overview-stat-bottom,.profit-stat .metric-note,.profit-stat .overview-stat-bottom{color:#7d899a}
.capital-stat .label{color:#d3dbe6}
.capital-stat .overview-stat-caption,.capital-stat .overview-stat-bottom{color:#becbdc}
.overview-heading p,.overview-composition-heading>span,.overview-composition-heading small,.overview-allocation-legend>span,.overview-allocation-legend b{color:#7d899a}
.overview-stat .metric.green{color:#56876b}
.overview-stat .metric.red{color:#b66b72}
@media(max-width:600px){.admin-hero{background:#35465c}
.overview-stat .label{font-size:8px}
.overview-stat-caption,.overview-stat-bottom,.profit-stat .metric-note{font-size:8px}
.profit-stat .overview-stat-bottom{font-size:7px}
}
.directory-link{text-decoration:none;display:inline-flex;align-items:center}
.account-directory-toolbar{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-bottom:16px}
.account-directory-toolbar input{flex:1;min-width:180px;font-size:11px}
.account-directory-toolbar .btn{min-height:40px}
.account-directory-meta{font-size:10px;color:#8b98ab;margin:8px 0 14px}
.account-directory-table{max-height:480px;overflow:auto}
.account-directory-table table{min-width:720px}
.account-directory-table th{position:sticky;top:0;z-index:1}
.account-directory-table td{font-size:10px;vertical-align:top;padding:13px}
.account-directory-table td small{display:block;font-size:9px;color:#94a0b2;margin-top:4px;white-space:normal}
.account-directory-table .account-name{font-size:11px;color:#5d708b;font-weight:600}
.directory-role{display:inline-block;padding:3px 7px;background:#f5f0e5;border:1px solid #e6ddc7;color:#9b875e;border-radius:5px;font-size:8px;margin:2px 3px 2px 0;white-space:nowrap}
.directory-state{font-size:9px;color:#8d9aab}
.directory-state.open{color:#b18c58}
.directory-state.resolved{color:#7a987e}
.directory-actions{display:flex;gap:5px;flex-wrap:wrap}
.directory-actions .btn{font-size:9px;padding:6px 9px;min-height:29px}
.directory-pagination{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px}
.directory-pagination span{font-size:10px;color:#91a0b5}
.directory-pagination .btn{font-size:10px}
.directory-help{margin-top:20px;border:1px solid #e3e9f1;background:#f7f9fc;border-radius:12px;padding:17px;font-size:11px;line-height:1.9;color:#8695ab}
.directory-help h4{margin:0 0 7px;font:500 17px var(--font-display);color:#69809c}
.directory-help a{color:#9c8657}
.directory-help p{font-size:10px;line-height:1.9;margin:6px 0}
.account-support-dialog{width:min(520px,100%)}
.account-support-dialog textarea{min-height:110px;font-size:12px;font-family:var(--font-body);margin-top:5px}
.account-support-email{font-size:11px;color:#8a9ab2;margin-bottom:20px}
.account-support-hint{font-size:10px;color:#95a3b9;line-height:1.9;margin-top:12px}
.role-chip-caption{letter-spacing:.6px}
@media(max-width:850px){.dev-navigation{grid-template-columns:repeat(5,minmax(0,1fr))}
}
@media(max-width:600px){.dev-navigation .dev-nav-btn{font-size:8px;padding:8px 2px}
.account-directory-toolbar input{min-width:130px}
.directory-pagination{flex-wrap:wrap}
}
/* Single global balance visibility switch. */
.balance-visibility-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-width:42px;min-height:42px;padding:10px;border:1px solid #ffffff25;border-radius:11px;background:#ffffff08;color:#e2d2ac;cursor:pointer;font:600 9px var(--font-body);flex-shrink:0}
.balance-visibility-button:hover{background:#ffffff13}
.balance-visibility-button:focus-visible{outline:2px solid #d6bf87;outline-offset:3px}
.balance-visibility-button svg{width:19px;height:19px}
.balance-eye-slash{display:none}
.balance-visibility-button[aria-pressed="true"] .balance-eye-slash{display:block}
.balance-privacy-status{color:#8f825f;background:#f7f2e6;border:1px solid #e7ddc5;border-radius:9px;padding:9px 13px;font-size:10px;margin:0 0 16px;line-height:1.8}
.balance-privacy-status:empty{display:none}
.balance-input-shell{position:relative;display:block;width:100%}
.balance-input-mask{display:none;position:absolute;inset:0;align-items:center;pointer-events:none;padding:0 13px;color:#7d8ba0;letter-spacing:2px;font-size:14px}
.balance-values-hidden .balance-input-mask{display:flex}
.balance-values-hidden .balance-input-shell input{color:transparent!important;caret-color:transparent!important;pointer-events:none;user-select:none}
.balance-values-hidden .balance-input-shell input::placeholder{color:transparent!important}
.balance-values-hidden .balance-input-shell input::selection{color:transparent!important}
.balance-editor-note{display:none;color:#8c99ad;background:#f3f5f8;padding:16px;border-radius:10px;font-size:11px;line-height:1.8}
.balance-values-hidden .balance-sensitive-editor{display:none!important}
.balance-values-hidden .balance-editor-note{display:block}
.balance-values-hidden .green,.balance-values-hidden .red{color:#7b899c!important}
.balance-values-hidden .capital-stat .metric{color:#e3eaf2!important}
.balance-values-hidden .metric,.balance-values-hidden .price{letter-spacing:2px}
.balance-values-hidden .overview-loss,.balance-values-hidden .overview-gain{background:#fafbfd!important}
.balance-values-hidden .profit-stat .overview-icon{background:#f1f3f6!important;color:#a59572!important;border-color:#e7ebf1!important}
@media(max-width:600px){.top>div:last-child #userChip{width:auto;flex:1;min-width:0}
.balance-visibility-button{min-height:44px;min-width:40px;padding:9px}
.balance-eye-label{display:none}
.top>div:last-child #userChip .header-profile{max-width:calc(100% - 53px);padding-right:6px}
.header-profile-copy b{max-width:145px}
.balance-privacy-status{font-size:9px}
.brand h1{font-size:22px}
}
.platform-custom{margin-top:10px}
.platform-custom[hidden]{display:none}
.platform-custom label{display:block;margin-bottom:6px}
.platform-hint{display:block;color:var(--muted,#718096);font-size:11px;line-height:1.6;margin-top:7px}
.field select{max-width:100%;text-overflow:ellipsis}
.asset-search-tools{display:grid;grid-template-columns:minmax(0,1fr) 140px;gap:8px}
.catalog-count{font-size:10px;color:var(--muted);margin:9px 0}
.asset-logo{position:relative}
.coin-glyph{display:flex;width:100%;height:100%;align-items:center;justify-content:center;font-size:10px;background:#eef2f7;color:#536b83}
.asset-logo .coin-image{position:absolute;inset:0;background:#fff}
.catalog-empty{padding:18px;color:var(--muted);font-size:12px}
.catalog-crypto-badge{font-size:9px;color:#9b8556}
@media(max-width:540px){.asset-search-tools{grid-template-columns:1fr}
.asset-search-tools select{min-height:36px}
}

/* Realized sales stay in a separate, responsive panel. */
.sale-summary{display:grid;grid-template-columns:1.05fr 1fr 1fr;align-items:center;gap:24px;margin-top:18px;padding:23px;border:1px solid #dfe5ed;border-radius:15px;background:#fafbfd;color:#42566f}
.sale-summary-result .label{display:block;font-size:9px;color:#8392a7;letter-spacing:.65px;line-height:1.7}
.sale-summary-result .metric{font-size:clamp(22px,2.1vw,29px);font-weight:550;letter-spacing:-.6px;margin:12px 0 6px;line-height:1.3}
.sale-summary-result .metric.green{color:#548b70}
.sale-summary-result .metric.red{color:#bc6875}
.sale-summary-state{font-size:10px;line-height:1.8;color:#8392a7;margin:0}
.sale-summary-details{margin:0;padding:0 22px;border-left:1px solid #e2e8ef;border-right:1px solid #e2e8ef;display:grid;gap:14px}
.sale-summary-details div{display:grid;gap:4px}
.sale-summary-details dt{font-size:10px;line-height:1.7;color:#8392a7}
.sale-summary-details dd{font-size:14px;font-weight:600;margin:0;color:#506783;overflow-wrap:anywhere}
.sale-summary-help p{font-size:11px;line-height:1.8;margin:0 0 8px;color:#62758e}
.sale-summary-help small{display:block;font-size:10px;line-height:1.8;color:#8a98ad}
.sale-summary-help small+small{margin-top:8px}
@media(max-width:900px){.sale-summary{grid-template-columns:1fr 1fr;gap:20px}
.sale-summary-details{border-right:0;padding-right:0}
.sale-summary-help{grid-column:1/-1;border-top:1px solid #e2e8ef;padding-top:14px}
.sale-summary-help small+small{margin-top:4px}
}
@media(max-width:480px){.sale-summary{grid-template-columns:minmax(0,1fr);padding:18px;gap:16px}
.sale-summary-details{border-left:0;border-top:1px solid #e2e8ef;padding:14px 0 0;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
.sale-summary-details dd{font-size:12px}
.sale-summary-result .metric{font-size:25px}
.sale-summary-help{grid-column:auto}
}

/* Compact login reminder; neutral surfaces and restrained state accents. */
.login-market{--market-accent:#aa8a48;--market-tint:#f7f3e9;position:relative;margin:0 0 20px;padding:16px 17px 13px;border:1px solid #e3e6eb;border-left:3px solid var(--market-accent);border-radius:13px;background:linear-gradient(115deg,var(--market-tint),#fafbfd 70%);text-align:left;color:#50637d}
.login-market.open{--market-accent:#538b70;--market-tint:#edf5f0}
.login-market.break,.login-market.opening{--market-accent:#b39758;--market-tint:#faf5e8}
.login-market.closing{--market-accent:#778aa4;--market-tint:#eff2f7}
.login-market-top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px}
.login-market-badge{display:inline-flex;align-items:center;gap:6px;font-size:8px;font-weight:700;letter-spacing:.65px;color:var(--market-accent)}
.login-market-badge:before{content:'';height:6px;width:6px;flex-shrink:0;border-radius:50%;background:var(--market-accent)}
.login-market.open .login-market-badge:before{animation:market-reminder-pulse 2.5s ease-in-out infinite}
.login-market time{font-size:9px;font-variant-numeric:tabular-nums;color:#8a98aa;white-space:nowrap}
.authcard .login-market h3{font-size:14px;line-height:1.5;letter-spacing:-.15px;color:#42566f;margin:0 0 6px;font-weight:650}
.login-market-copy p{font-size:10px;line-height:1.8;margin:0 0 7px;color:#738399}
.login-market-copy small{display:block;font-size:9px;line-height:1.7;color:#8a98aa}
.login-market-footer{display:flex;gap:6px;align-items:flex-start;border-top:1px solid #dbe2e955;padding-top:9px;margin-top:10px;font-size:8px;line-height:1.8;color:#8a98aa}
.login-market-dot{display:inline-block;flex-shrink:0;width:4px;height:4px;border-radius:50%;margin-top:5px;background:#7da58d}
@keyframes market-reminder-pulse{50%{box-shadow:0 0 0 4px #538b7018}
}
@media(max-width:480px){.login-market{padding:13px 14px 11px;margin-bottom:16px}
.authcard .login-market h3{font-size:13px}
.login-market-copy p{font-size:10px}
}
@media(prefers-reduced-motion:reduce){.login-market.open .login-market-badge:before{animation:none}
}

`;
