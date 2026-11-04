const CACHE='offline-face-attendance-v1';
const PRECACHE=['./','./index.html','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 e.respondWith(caches.match(req).then(hit=>{
  if(hit)return hit;
  return fetch(req).then(res=>{
   if(res && (res.ok || res.type==='opaque')){
    const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});
   }
   return res;
  }).catch(()=>caches.match('./index.html'));
 }));
});