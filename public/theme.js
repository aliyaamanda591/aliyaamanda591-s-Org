// Appearance only. Never reads account or portfolio storage.
(()=>{const key='sidaps_appearance_v1',root=document.documentElement;let preference='system';const media=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
try{const saved=window.localStorage.getItem(key);if(['system','light','dark'].includes(saved))preference=saved;}catch{}
function apply(){const resolved=preference==='system'?(media?.matches?'dark':'light'):preference;root.setAttribute('data-sidaps-theme',resolved);root.setAttribute('data-theme-preference',preference);document.querySelectorAll('[data-theme-option]').forEach(p=>p.setAttribute('aria-pressed',String(p.getAttribute('data-theme-option')===preference)));const color=document.querySelector('meta[name="theme-color"]');if(color)color.setAttribute('content',resolved==='dark'?'#071b16':'#f4f7f4');}
function bind(){document.querySelectorAll('[data-theme-option]').forEach(p=>{p.addEventListener('click',()=>{const value=p.getAttribute('data-theme-option');if(!['system','light','dark'].includes(value))return;preference=value;try{window.localStorage.setItem(key,preference);}catch{}apply();});});apply();}
apply();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
window.addEventListener('sidaps-appearance-change',()=>{try{const saved=window.localStorage.getItem(key);preference=['system','light','dark'].includes(saved)?saved:'system';apply();}catch{}});
if(media?.addEventListener)media.addEventListener('change',()=>{if(preference==='system')apply();});
window.addEventListener('storage',event=>{if(event.key===key){preference=['system','light','dark'].includes(event.newValue)?event.newValue:'system';apply();}});
})();
