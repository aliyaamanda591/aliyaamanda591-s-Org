// Locally served images. Initials are an explicit fallback for unknown/custom platforms.
(()=>{
 function platform(value,label){
  if(!value||String(value).startsWith('__sidaps_'))return null;
  const key=String(value).trim().toUpperCase(),logos=window.SidapsBrandLogos?.platforms||{},src=Object.hasOwn(logos,key)?logos[key]:null;
  const short=String(label||value).split(/[—(]/)[0].trim(),words=short.split(/\s+/).filter(Boolean),initials=(words.length>1?words[0][0]+words[1][0]:short.slice(0,2)).toUpperCase();
  const icon=document.createElement('span');icon.className='platform-logo';icon.setAttribute('aria-hidden','true');icon.dataset.initials=initials;let hash=0;for(const c of key)hash=(hash*31+c.charCodeAt(0))>>>0;icon.style.setProperty('--logo-fallback-hue',String(hash%360));
  if(typeof src==='string'&&/^\/logos\//.test(src)){const img=document.createElement('img');img.src=src;img.alt='';img.width=28;img.height=28;img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>img.remove());icon.append(img);}
  return icon;
 }
 function asset(value){if(typeof assetLogoHtml!=='function'||typeof assets==='undefined')return null;const a=assets.find(a=>a.name===value);if(!a)return null;const holder=document.createElement('span');holder.innerHTML=assetLogoHtml(a,true);return holder.firstElementChild;}
 window.SidapsBrandUI={platform,asset};
 let pending=false;
 function scan(){pending=false;document.querySelectorAll('.platform-record:not([data-branded])').forEach(node=>{node.dataset.branded='true';const icon=platform(node.dataset.platform,node.textContent);if(icon)node.prepend(icon);});}
 scan();new MutationObserver(()=>{if(!pending){pending=true;requestAnimationFrame(scan);}}).observe(document.body,{subtree:true,childList:true});
})();
