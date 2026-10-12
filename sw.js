const CACHE='rcsq-m10-v6-3-20261012';
const ASSETS=['./','./index.html','./styles.css','./app.js','./cloud-config.js','./cloud-sync.js','./manifest.webmanifest','./assets/rcsq-logo.png','./assets/accueil-dessin-equipe.jpg','./assets/icon-192.png','./assets/icon-512.png','./assets/apple-touch-icon.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return res;}).catch(()=>caches.match('./index.html')));
    return;
  }
  if(new URL(req.url).origin!==self.location.origin){return;}
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{if(req.method==='GET'){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;})));
});
