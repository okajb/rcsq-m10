(() => {
  const LS_KEY = 'rcsq-m10-coach-v2'; // même clé pour préserver les données existantes
  const APP_VERSION = '6.3';
  const BACKUP_KEY = LS_KEY + '-emergency';
  const BACKUP_DB = 'rcsq-m10-backup-v1';
  const names = Array.from({length:11},(_,i)=>`Joueur ${i+1}`);

  const FFR_SOURCE = 'FFR • Séance atelier n°1 • octobre 2026';
  const trainingLibrary = [
    {id:'ech1',category:'Échauffement',title:'Échauffement ballon',duration:10,players:'8-14',goal:'Mettre les enfants en route avec ballon, course, passes et appuis.',equipment:{Plots:6,Ballons:4},notes:['Courses variées avec ballon','Ballon en l’air puis réception','Passes simples en avançant']},
    {id:'pass1',category:'Passe / Réception',title:'Passe en mouvement',duration:15,players:'8-12',goal:'Améliorer la qualité de passe en avançant.',equipment:{Plots:6,Ballons:3},notes:['Courir droit avant la passe','Regarder la cible','Mains prêtes à recevoir']},
    {id:'sout1',category:'Soutien',title:'Le passeur devient premier soutien',duration:15,players:'8-12',goal:'Créer le réflexe de soutien immédiat après la passe.',equipment:{Plots:6,Ballons:3},notes:['Le passeur suit sa passe','Se rendre disponible près du porteur','Communiquer']},
    {id:'att1',category:'Attaque',title:'2 attaquants vs 1 défenseur',duration:15,players:'6-12',goal:'Fixer le défenseur et jouer le surnombre.',equipment:{Plots:8,Ballons:2},notes:['Porter droit','Fixer avant de passer','Soutien proche']},
    {id:'pla1',category:'Plaquage',title:'Parcours plaquage',duration:15,players:'8-12',goal:'Travailler progressivement la sécurité et la technique de plaquage.',equipment:{Plots:6,Boucliers:2,Matelas:1,Ballons:2},notes:['Tête placée en sécurité','Engagement des bras','Accompagner au sol sans se jeter']},
    {id:'ruck1',category:'Ruck / Libération',title:'Plaquage + ruck simple',duration:15,players:'8-12',goal:'Enchaîner plaquage, libération du ballon et arrivée du premier soutien.',equipment:{Plots:4,Boucliers:2,Matelas:1,Ballons:2,Piquets:2},notes:['Porteur présente le ballon','Soutien arrive vite','Entrée dans l’axe et sur les appuis']},
    {id:'def1',category:'Défense',title:'Défenseur sur ses appuis',duration:10,players:'6-10',goal:'Améliorer les appuis et la montée défensive.',equipment:{Plots:4},notes:['Petits pas rapides','Buste engagé','Ne pas croiser les pieds']},
    {id:'jeu1',category:'Jeu réduit',title:'Toucher + 2 secondes',duration:15,players:'8-14',goal:'Enchaîner rapidement après le toucher et jouer ensemble.',equipment:{Plots:8,Ballons:2,Chasubles:10},notes:['2 secondes maximum pour jouer','Soutien proche','Communication']},
    {id:'jeu2',category:'Jeu ludique',title:'Jeu du foulard',duration:10,players:'5-10',goal:'Travail d’esquive, d’appuis et de coopération.',equipment:{Foulards:4},notes:['Quatre joueurs en ronde','Un chasseur tente de saisir le foulard','Bouger ensemble sans se lâcher']},
    {id:'mot1',category:'Motricité / Appuis',title:'Relais 4 vs 4 autour des plots',duration:10,players:'8-12',goal:'Coordination collective et vitesse de réaction.',equipment:{Plots:8},notes:['Contourner le plot puis revenir','Rester unis','Le premier groupe arrivé au complet gagne']},
    {id:'pass2',category:'Passe / Réception',title:'Passes roulées à demi-genoux',duration:8,players:'4-10',goal:'Travail de précision sur la passe roulée.',equipment:{Ballons:2},notes:['Se mettre à demi-genoux','Commencer à 3 mètres','Augmenter progressivement la distance']},

    // Ajouts basés sur la proposition DTN/FFR d'octobre 2026
    {id:'ffr-freeze',category:'Manipulation / Course',title:'Mr Freeze',duration:15,players:'8-14',goal:'Courir avec le ballon, éviter, cibler et suivre un adversaire tout en améliorant posture et gainage.',equipment:{Plots:8,Ballons:4},notes:['Prise d’information avant d’accélérer','Varier les appuis','Conserver une posture stable'],source:FFR_SOURCE},
    {id:'ffr-vagues',category:'Manipulation / Passe',title:'Croix et vagues — 3 temps',duration:15,players:'8-14',goal:'Attraper, passer puis se replacer par rapport aux partenaires.',equipment:{Plots:8,Ballons:4},notes:['Placement des mains avant, pendant et après la passe','Regard vers la cible','Direction de course et timing'],source:FFR_SOURCE},
    {id:'ffr-t2s',category:'Jeu réduit',title:'5 contre 5 — Toucher +2 secondes',duration:15,players:'10',goal:'Jouer à effectif réduit avec contact réglementé et prise de décision rapide.',equipment:{Plots:8,Ballons:2,Chasubles:10},notes:['Avancer avant de passer','Se replacer rapidement','Faire vivre le ballon après le toucher'],source:FFR_SOURCE},
    {id:'ffr-lutte4',category:'Contact / Renforcement',title:'Lutte à 4 appuis',duration:15,players:'4-12',goal:'Améliorer le gainage, la posture et la capacité à s’opposer en sécurité.',equipment:{Matelas:2},notes:['Commencer par une phase d’échauffement','Dos gainé et tête relevée','Contrôler la chute'],source:FFR_SOURCE},
    {id:'ffr-1v1',category:'Contact',title:'1 contre 1 — s’orienter et marquer',duration:15,players:'6-12',goal:'S’opposer, lutter, s’orienter, éviter au contact et jouer avec les pressions.',equipment:{Plots:8,Ballons:2,Matelas:1},notes:['Regard sur l’adversaire','Posture stable','Placement de la tête et engagement des bras','Respecter les règles de sécurité'],source:FFR_SOURCE},
    {id:'ffr-2v2',category:'Contact / Coopération',title:'2 contre 2 — avancer en coopérant',duration:15,players:'8-12',goal:'Coopérer dans la lutte et avancer ensemble au contact.',equipment:{Plots:8,Ballons:2,Chasubles:8},notes:['S’orienter ensemble','Communiquer','Soutenir le partenaire dans l’avancée'],source:FFR_SOURCE},
    {id:'ffr-jco',category:'Jeu au contact',title:'5 contre 5 — jeu au contact',duration:15,players:'10',goal:'Réinvestir les apprentissages de contact dans une situation jouée.',equipment:{Plots:8,Ballons:2,Chasubles:10},notes:['Avancer en sécurité','Soutien proche','Se replacer vite après le contact'],source:FFR_SOURCE}
  ];

  const coachPhrases = {
    'Mi-temps':[
      'On repart simple : on avance, on soutient et on défend ensemble.',
      'Le passeur devient premier soutien : on ne regarde pas le copain jouer, on l’accompagne.',
      'En défense, on monte tous ensemble et on reste sur nos appuis.',
      'On lève la tête, on parle et on cherche les espaces.',
      'Gardez le plaisir, mais restez concentrés sur les petites choses simples.',
      'On plaque proprement, on se relève vite et on se replace.',
      'Très bien pour l’envie. Maintenant, encore plus de collectif et de communication.',
      'Le ballon va plus vite que nous : on fait vivre la passe quand l’espace est là.'
    ],
    'Fin de match':[
      'Bravo les enfants : ce qui compte, c’est l’envie, l’entraide et les progrès.',
      'Vous pouvez être fiers de vos efforts. On garde le positif et on travaillera le reste mercredi.',
      'Très bon état d’esprit : vous êtes restés ensemble jusqu’au bout.',
      'Aujourd’hui on a appris. Le prochain match, on essaie de faire encore un peu mieux.',
      'Bravo pour le courage. On se félicite, on respecte l’adversaire et on garde le sourire.',
      'Ce que j’ai aimé : vous avez essayé de jouer ensemble. C’est ça qu’on veut continuer.'
    ],
    'Motiver':[
      'On joue ensemble, on avance ensemble !',
      'On ne lâche rien, mais on garde la tête froide !',
      'Faites-vous confiance et aidez le copain !',
      'On garde l’envie et le sourire !',
      'Chaque ballon est une nouvelle action : on se reconcentre tout de suite.'
    ],
    'Règles / sécurité':[
      'On respecte l’arbitre, les copains et les adversaires.',
      'Plaquage en sécurité : on engage les bras et on garde la tête bien placée.',
      'Au sol, on libère le ballon et on se relève.',
      'Dans le ruck : on reste sur ses appuis et on entre par son camp.',
      'On ne se jette pas : on contrôle ses gestes.'
    ]
  };

  const defaultPlayer = (name, i) => ({
    id:'p'+(i+1), name, photo:null, qualificationNumber:null, birthDate:null, ffrClass:null, licenceType:null, totalSeconds:0,
    stats:{plaquages:0,essais:0,matches:0}, notes:''
  });

  const initialState = {
    version:APP_VERSION,
    route:'home',
    players:names.map(defaultPlayer),
    currentPlateau:null,
    currentMatch:null,
    history:[],
    selectedTraining:['ech1','sout1','pla1','jeu1'],
    ui:{matchTab:'terrain',pendingOutId:null,coachCategory:'Mi-temps'}
  };

  let primaryStorageOk = true;
  let state = loadAndMigrate();
  let tickTimer = null;
  let wakeLock = null;
  let pendingShareAfterLogin = false;
  const assistantActionLog = [];
  let backupTimer = null;
  let lastAssistantLineupKey = '';
  let lastAssistantMatchId = null;
  let assistantConfirmTimer = null;

  const content = document.getElementById('content');
  const title = document.getElementById('pageTitle');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const toast = document.getElementById('toast');
  const nav = [...document.querySelectorAll('.nav-item')];
  const topbar = document.querySelector('.topbar');
  const bottomNav = document.querySelector('.bottom-nav');

  function loadAndMigrate(){
    let raw=null;
    try{ raw=JSON.parse(localStorage.getItem(LS_KEY)); }catch{ primaryStorageOk=false; }
    if(!raw){
      primaryStorageOk=false;
      try{ const emergency=JSON.parse(localStorage.getItem(BACKUP_KEY)); raw=emergency?.state||null; }catch{}
    }
    if(!raw){ primaryStorageOk=false; return structuredClone(initialState); }
    const s = raw;
    s.version = APP_VERSION;
    s.route ||= 'home';
    s.players ||= names.map(defaultPlayer);
    s.players = s.players.map((p,i)=>({
      id:p.id || 'p'+(i+1), name:p.name || names[i] || 'Joueur',
      photo:(p.photo && !String(p.photo).startsWith('assets/players/')) ? p.photo : null,
      qualificationNumber:p.qualificationNumber||null, birthDate:p.birthDate||null, ffrClass:p.ffrClass||null, licenceType:p.licenceType||null,
      totalSeconds:Number(p.totalSeconds||0), notes:p.notes||'',
      stats:{plaquages:Number(p.stats?.plaquages||0),essais:Number(p.stats?.essais||0),matches:Number(p.stats?.matches||0)}
    }));
    s.currentPlateau ||= null;
    s.history ||= [];
    s.selectedTraining ||= ['ech1','sout1','pla1','jeu1'];
    s.ui = {...initialState.ui,...(s.ui||{})};
    // Ancienne version : on garde le match si possible, avec seulement les 2 stats utiles.
    if(s.currentMatch){
      s.currentMatch.matchStats ||= {};
      Object.keys(s.currentMatch.matchStats).forEach(pid=>{
        s.currentMatch.matchStats[pid] = {
          plaquages:Number(s.currentMatch.matchStats[pid]?.plaquages||0),
          essais:Number(s.currentMatch.matchStats[pid]?.essais||0)
        };
      });
      s.currentMatch.phase ||= '1re mi-temps';
      s.currentMatch.number ||= 1;
      s.currentMatch.actionLog ||= [];
      s.currentMatch.running = Boolean(s.currentMatch.running);
      s.currentMatch.cloudShared = Boolean(s.currentMatch.cloudShared);
      s.currentMatch.cloudInviteUrl ||= null;
    }
    return s;
  }
  function backupState(){
    const clone=structuredClone(state);
    // Le secours sert surtout aux stats/temps : on évite les grosses photos base64.
    (clone.players||[]).forEach(p=>{ if(p.photo && String(p.photo).startsWith('data:')) p.photo=null; });
    return clone;
  }
  function openBackupDB(){
    return new Promise((resolve,reject)=>{
      if(!('indexedDB' in window)) return reject(Error('IndexedDB indisponible'));
      const req=indexedDB.open(BACKUP_DB,1);
      req.onupgradeneeded=()=>{ const db=req.result; if(!db.objectStoreNames.contains('snapshots')) db.createObjectStore('snapshots'); };
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
    });
  }
  async function persistEmergencyBackupNow(){
    try{
      const db=await openBackupDB();
      const old=await new Promise(res=>{
        const tx=db.transaction('snapshots','readonly');
        const r=tx.objectStore('snapshots').get('latest');
        r.onsuccess=()=>res(r.result||null);r.onerror=()=>res(null);
      });
      const tx=db.transaction('snapshots','readwrite');
      const store=tx.objectStore('snapshots');
      const payload={savedAt:Date.now(),state:backupState()};
      if(old) store.put(old,'previous');
      store.put(payload,'latest');
      await new Promise((res,rej)=>{tx.oncomplete=res;tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error);});
      db.close();
      return true;
    }catch(e){ console.warn('Sauvegarde de secours impossible',e); return false; }
  }
  function queueEmergencyBackup(){
    clearTimeout(backupTimer);
    backupTimer=setTimeout(()=>persistEmergencyBackupNow(),450);
  }
  function save(){
    try{
      localStorage.setItem(LS_KEY,JSON.stringify(state));
      localStorage.setItem(BACKUP_KEY,JSON.stringify({savedAt:Date.now(),state:backupState()}));
      primaryStorageOk=true;
    }catch(e){
      primaryStorageOk=false;
      console.warn('Sauvegarde locale principale impossible',e);
      try{localStorage.setItem(BACKUP_KEY,JSON.stringify({savedAt:Date.now(),state:backupState()}));}catch{}
    }
    queueEmergencyBackup();
  }
  function showToast(msg){ toast.textContent=msg; toast.hidden=false; clearTimeout(showToast._t); showToast._t=setTimeout(()=>toast.hidden=true,1700); }
  function player(id){ return state.players.find(p=>p.id===id); }
  function fmt(sec){ sec=Math.max(0,Math.floor(sec||0)); return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`; }
  function avatarHTML(p, cls=''){ return `<div class="avatar ${cls}">${p.photo?`<img src="${p.photo}" alt="${p.name}">`:p.name.slice(0,1)}</div>`; }
  function routeTo(route){ state.route=route; save(); render(); }
  function pageTitle(){ return ({home:'Accueil',squad:'Effectif',match:'Match',training:'Entraînements',stats:'Statistiques'})[state.route]||'RCSQ M10'; }

  function matchElapsed(now=Date.now()){
    const m=state.currentMatch;if(!m)return 0;
    return Number(m.elapsedBefore||0)+(m.running&&m.startedAt?Math.max(0,(now-m.startedAt)/1000):0);
  }
  function playerMatchTime(pid, now=Date.now()){
    const m=state.currentMatch;if(!m)return 0;
    const r=m.playerTimes?.[pid];if(!r)return 0;
    return Number(r.acc||0)+(m.running&&r.onField&&r.lastStart?Math.max(0,(now-r.lastStart)/1000):0);
  }
  function plateauPlayerTime(pid, now=Date.now()){
    let total=0;
    for(const rec of state.currentPlateau?.matches||[]) total+=Number(rec.playerTimes?.[pid]||0);
    if(state.currentMatch && state.currentPlateau?.rosterIds?.includes(pid)) total+=playerMatchTime(pid,now);
    return total;
  }
  function fairPlayAlert(now=Date.now()){
    const m=state.currentMatch,p=state.currentPlateau;if(!m||!p?.rosterIds?.length)return null;
    const rows=p.rosterIds.map(pid=>({pid,time:plateauPlayerTime(pid,now)})).filter(x=>player(x.pid));
    if(rows.length<2)return null;
    const avg=rows.reduce((a,x)=>a+x.time,0)/rows.length;
    if(avg<100)return null; // pas d'alerte trop tôt dans le plateau
    rows.sort((a,b)=>a.time-b.time);
    const low=rows[0],high=rows[rows.length-1],gap=avg-low.time;
    if(gap<75 || low.time>=avg*.78)return null;
    const pl=player(low.pid),onField=m.lineup.includes(low.pid);
    return {pid:low.pid,name:pl.name,time:low.time,avg,gap,onField,highName:player(high.pid)?.name||'',highTime:high.time};
  }
  function fairPlayAlertHTML(now=Date.now()){
    const a=fairPlayAlert(now);if(!a)return '';
    const text=a.onField
      ? `⏱ <strong>${a.name}</strong> a moins joué que la moyenne (${fmt(a.time)} / moy. ${fmt(a.avg)}), mais il est actuellement sur le terrain.`
      : `⏱ <strong>${a.name}</strong> a joué ${fmt(a.gap)} de moins que la moyenne. Pense à le faire entrer bientôt.`;
    return `<div class="fair-play-alert">${text}</div>`;
  }
  function updateFairPlayAlert(now=Date.now()){
    const box=document.getElementById('fairPlayAlert');if(!box)return;
    box.innerHTML=fairPlayAlertHTML(now);
  }
  function parentPresenceHTML(m=state.currentMatch){
    if(!m?.cloudShared)return '';
    if(!navigator.onLine)return '<div class="parent-presence offline">🔴 DIRECT HORS LIGNE</div>';
    const n=Number(window.RCSQLive?.activeGuestCount?.(m.id)||0);
    if(n>0)return `<div class="parent-presence connected">🟢 PARENT CONNECTÉ${n>1?`S (${n})`:''}</div>`;
    return '<div class="parent-presence waiting">🟠 QR ACTIF • EN ATTENTE DU PARENT</div>';
  }
  function updateParentPresenceIndicator(){
    const box=document.getElementById('parentPresenceIndicator');if(box)box.innerHTML=parentPresenceHTML();
  }
  function settleRunning(now=Date.now()){
    const m=state.currentMatch;if(!m||!m.running)return;
    m.elapsedBefore=matchElapsed(now);
    m.startedAt=null;
    Object.values(m.playerTimes||{}).forEach(r=>{
      if(r.onField&&r.lastStart){r.acc=Number(r.acc||0)+Math.max(0,(now-r.lastStart)/1000);r.lastStart=null;}
    });
  }
  function pauseMatch(){ const m=state.currentMatch;if(!m||!m.running)return; settleRunning();m.running=false;save();releaseWakeLock();syncLiveState();render(); }
  function resumeMatch(){ const m=state.currentMatch;if(!m||m.running)return;const now=Date.now();m.running=true;m.startedAt=now;Object.values(m.playerTimes||{}).forEach(r=>{if(r.onField)r.lastStart=now;});save();requestWakeLock();syncLiveState();render(); }

  async function requestWakeLock(){ try{if('wakeLock'in navigator)wakeLock=await navigator.wakeLock.request('screen');}catch{} }
  async function releaseWakeLock(){ try{if(wakeLock){await wakeLock.release();wakeLock=null;}}catch{} }
  function updateLiveTimes(){
    const m=state.currentMatch;if(!m)return;
    const now=Date.now();
    const clock=document.querySelector('[data-live-match-clock]');
    if(clock)clock.textContent=fmt(matchElapsed(now));
    document.querySelectorAll('[data-player-time]').forEach(el=>{
      const pid=el.dataset.playerTime;if(pid)el.textContent=fmt(playerMatchTime(pid,now));
    });
    updateFairPlayAlert(now);
    updateParentPresenceIndicator();
  }
  function ensureTick(){
    clearInterval(tickTimer);
    if(state.currentMatch?.running && !isAssistantMode()){
      updateLiveTimes();
      tickTimer=setInterval(updateLiveTimes,1000);
    }
  }

  function isAssistantMode(){ return Boolean(window.RCSQLive && (window.RCSQLive.invitePending || String(window.RCSQLive.role||'').startsWith('guest'))); }
  function render(){
    if(isAssistantMode()){
      topbar.classList.add('hidden'); bottomNav.classList.add('hidden');
      content.classList.add('assistant-content');
      renderAssistant();
      clearInterval(tickTimer);
      return;
    }
    topbar.classList.remove('hidden'); bottomNav.classList.remove('hidden'); content.classList.remove('assistant-content');
    title.textContent=pageTitle();
    nav.forEach(n=>n.classList.toggle('active',n.dataset.route===state.route));
    if(state.route==='home')renderHome();
    else if(state.route==='squad')renderSquad();
    else if(state.route==='match')renderMatch();
    else if(state.route==='training')renderTraining();
    else renderStats();
    ensureTick();
  }

  function renderHome(){
    const p=state.currentPlateau;
    content.innerHTML=`
      <section class="card hero">
        <div class="hero-img" style="background-image:url('assets/accueil-dessin-equipe.jpg')">
          <img src="assets/rcsq-logo.png" class="hero-logo" alt="RCSQ">
          <div class="hero-info">
            <h2>RCSQ M10</h2><p>Matchs, temps de jeu, remplacements et entraînements.</p>
            <div class="hero-actions"><button class="btn primary" data-route-link="match">🏉 Match</button><button class="btn secondary" data-route-link="training">🚩 Entraînement</button></div>
          </div>
        </div>
      </section>
      ${p?`<section class="card"><div class="split"><div><strong>${p.name}</strong><div class="subtitle">${p.rosterIds.length} présents • ${p.format} contre ${p.format}</div></div><span class="badge green">Plateau en cours</span></div><div class="chips" style="margin-top:10px">${p.rosterIds.map(id=>`<span class="chip">${player(id)?.name||''}</span>`).join('')}</div><button class="btn blue full" style="margin-top:12px" data-route-link="match">Ouvrir le plateau</button></section>`:''}
      <section class="grid2">
        <button class="menu-tile" data-route-link="squad"><span>👥</span>Effectif</button>
        <button class="menu-tile" data-route-link="stats"><span>📊</span>Statistiques</button>
        <button class="menu-tile" data-action="open-coach"><span>🎤</span>Phrases coach</button>
        <button class="menu-tile" data-route-link="training"><span>📚</span>Ateliers</button>
      </section>
      <section class="card"><div class="split"><div><strong>Version terrain</strong><div class="subtitle">Les chronos sont calculés avec l’heure réelle : appel, SMS ou écran verrouillé ne bloquent pas le temps de jeu.</div></div><span class="badge">v${APP_VERSION}</span></div></section>
      <section class="card"><div class="split-wrap"><div><strong>Données joueurs privées</strong><div class="subtitle">Photos, dates de naissance et n° FFR restent uniquement sur cet appareil.</div></div><label class="tiny-btn green">Charger les fiches<input id="playerDataInput" class="hidden" type="file" accept="application/json"></label></div><div class="warning" style="margin-top:10px">⚠️ Le fichier de fiches joueurs ne doit jamais être envoyé sur GitHub Pages.</div></section>
      <section class="card"><div class="split-wrap"><div><strong>Sauvegarde renforcée</strong><div class="subtitle">Enregistrement automatique local + copie de secours. L’export manuel reste conseillé après un plateau.</div></div><span class="badge green">✓ AUTO</span></div><div class="chips" style="margin-top:10px"><button class="tiny-btn" data-action="export">Exporter</button><label class="tiny-btn">Restaurer<input id="importInput" class="hidden" type="file" accept="application/json"></label><button class="tiny-btn green" data-action="restore-emergency">Secours local</button></div><div class="subtitle" style="margin-top:8px">La copie de secours ne quitte jamais ton iPhone.</div></section>`;
  }

  function renderSquad(){
    const roster=new Set(state.currentPlateau?.rosterIds||[]);
    content.innerHTML=`<section class="card"><div class="split"><div><strong>Effectif M10 (${state.players.length})</strong><div class="subtitle">Les photos et infos FFR apparaissent après chargement du fichier privé sur ton iPhone.</div></div></div><div class="list" style="margin-top:12px">${state.players.map(p=>`<div class="player-row"><div class="row-left">${avatarHTML(p)}<div><strong>${p.name}</strong><small>${roster.has(p.id)?'Présent sur le plateau en cours':'Joueur M10'}</small></div></div><button class="tiny-btn" data-open-player="${p.id}">Fiche</button></div>`).join('')}</div></section>`;
  }

  function renderMatch(){
    if(state.currentMatch) return renderLiveMatch();
    if(!state.currentPlateau) return renderPlateauSetup();
    return renderPlateauHub();
  }

  function renderPlateauSetup(){
    content.innerHTML=`
      <section class="card">
        <div class="title-row"><div><strong>Présence plateau</strong><div class="subtitle">Tu choisis les présents une fois. Seuls eux seront proposés dans Match 1, Match 2, etc.</div></div><span class="badge">${state.players.length} joueurs</span></div>
        <div class="form-grid">
          <div><label>Nom du plateau</label><input id="plateauName" class="input" value="Plateau du samedi"></div>
          <div><label>Format</label><div class="seg"><button class="plateau-fmt active" data-fmt="5">5 contre 5</button><button class="plateau-fmt" data-fmt="7">7 contre 7</button></div></div>
          <div><label>Joueurs présents</label><div class="player-pick-grid" id="rosterPicker">${state.players.map(p=>`<button class="pick-btn active" data-roster-pick="${p.id}">${p.name}</button>`).join('')}</div></div>
          <button class="btn primary" data-action="create-plateau">Créer le plateau</button>
        </div>
      </section>`;
  }

  function renderPlateauHub(){
    const p=state.currentPlateau;
    const last=p.matches?.[0];
    content.innerHTML=`
      <section class="card"><div class="split"><div><strong>${p.name}</strong><div class="subtitle">${p.rosterIds.length} présents • format ${p.format}v${p.format}</div></div><span class="badge green">${p.matches?.length||0} match(s)</span></div><div class="chips" style="margin-top:10px">${p.rosterIds.map(id=>`<span class="chip">${player(id)?.name||''}</span>`).join('')}</div></section>
      ${last?`<section class="card"><strong>Dernier match</strong><div class="split" style="margin-top:8px"><span>${last.name}</span><strong>${last.score.us} - ${last.score.them}</strong></div></section>`:''}
      <section class="card"><div class="center"><strong style="font-size:22px">Match ${p.nextMatchNumber}</strong><div class="subtitle" style="margin-top:4px">Choisis la composition de départ parmi les présents du plateau.</div></div><div class="player-pick-grid" id="starterPicker" style="margin-top:12px">${p.rosterIds.map((id,i)=>{const pl=player(id);return `<button class="pick-btn ${i<p.format?'active':''}" data-starter-pick="${id}">${pl.name}</button>`}).join('')}</div><button class="btn primary full" style="margin-top:12px" data-action="start-next-match">Commencer Match ${p.nextMatchNumber}</button></section>
      <section class="card"><div class="split"><div><strong>Changer la présence</strong><div class="subtitle">Si un enfant arrive ou repart, tu peux modifier le plateau.</div></div><button class="tiny-btn" data-action="edit-roster">Modifier</button></div></section>
      <section class="card"><button class="btn ghost full" data-action="close-plateau">Terminer le plateau</button></section>`;
  }

  function renderLiveMatch(){
    const m=state.currentMatch, now=Date.now();
    const onField=m.lineup.map(player).filter(Boolean), bench=m.bench.map(player).filter(Boolean);
    const tab=state.ui.matchTab||'terrain';
    const cloudRole=window.RCSQLive?.role;
    const shareLabel=m.cloudInviteUrl?'📲 Afficher le QR parent':'📲 Partager stats avec un parent';
    const cloudOnline=navigator.onLine;
    const cloudBadge=m.cloudShared?(cloudOnline?'<span class="badge green">● Direct synchronisé</span>':'<span class="badge red">● Hors connexion</span>'):(cloudRole==='admin'?'<span class="badge">Coach connecté</span>':'<span class="badge yellow">Direct non connecté</span>');
    const parentPresence=parentPresenceHTML(m);
    content.innerHTML=`
      <section class="score-card">
        <div class="score-top">
          <div><div class="badge">RCSQ</div><div class="score-num" data-coach-home-score>${m.score.us}</div><div class="subtitle">essais saisis</div></div>
          <div><div class="phase">Match ${m.number} • ${m.phase}</div><div class="match-clock" data-live-match-clock>${fmt(matchElapsed(now))}</div></div>
          <div><div class="badge red">ADVERSAIRE</div><div class="score-num" style="color:var(--red)" data-coach-away-score>${m.score.them}</div><button class="tiny-btn red" data-score="them">+1 essai</button></div>
        </div>
        <div class="match-controls">
          <button class="btn ${m.running?'primary':'green'}" data-action="${m.running?'pause-match':'resume-match'}">${m.running?'⏸ Pause':'▶ Reprendre'}</button>
          <button class="btn blue" data-action="half-time">Mi-temps</button>
          <button class="btn danger" data-action="end-match">■ FIN MATCH</button>
        </div>
      </section>
      <section class="card live-share-card"><div id="parentPresenceIndicator">${parentPresence}</div><div class="split-wrap"><div><strong>Parent statisticien</strong><div class="subtitle">Le parent note seulement PLAQUAGE, ESSAI et les essais adverses. Tu gardes les changements : son écran suit automatiquement en direct.</div></div>${cloudBadge}</div>${m.cloudSyncError?'<div class="danger-note" style="margin-top:10px">⚠️ Dernière synchronisation parent non confirmée. Vérifie la connexion internet puis refais le changement si besoin.</div>':''}<button class="btn white full" style="margin-top:10px" data-action="share-assistant">${shareLabel}</button></section>
      <div id="fairPlayAlert">${fairPlayAlertHTML(now)}</div>
      <div class="tabs"><button class="tab-btn ${tab==='terrain'?'active':''}" data-match-tab="terrain">Terrain / remplacements</button><button class="tab-btn ${tab==='stats'?'active':''}" data-match-tab="stats">Stats express</button></div>
      ${tab==='terrain'?terrainHTML(m,onField,bench,now):statsExpressHTML(m,onField,now)}
      <section class="card"><div class="split"><div><strong>Phrases coach</strong><div class="subtitle">Accès rapide pendant une pause.</div></div><button class="tiny-btn yellow" data-action="open-coach">🎤 Ouvrir</button></div></section>`;
  }

  function terrainHTML(m,onField,bench,now){
    const pending=state.ui.pendingOutId;
    return `<section class="card" style="padding:10px">
      <div class="pitch">
        <div class="field-title">RCSQ • ${onField.length} joueurs sur le terrain</div>
        <div class="field-grid">${onField.map((p,i)=>`<button class="field-player pos-${m.format}-${i} ${pending===p.id?'selected-out':''}" data-field-player="${p.id}">${avatarHTML(p)}<div class="fname">${p.name}</div><div class="ftime" data-player-time="${p.id}">${fmt(playerMatchTime(p.id,now))}</div></button>`).join('')}</div>
        <div class="replacement-help">${pending?`✅ ${player(pending).name} sort : touche maintenant le remplaçant qui entre.`:'🔁 Pour changer : touche d’abord un joueur sur le terrain, puis un remplaçant.'}</div>
      </div>
      <div class="bench-section"><div class="split"><strong>Remplaçants (${bench.length})</strong>${pending?`<button class="tiny-btn red" data-action="cancel-replace">Annuler</button>`:''}</div><div class="bench-scroll" style="margin-top:9px">${bench.map(p=>`<button class="bench-player ${pending?'ready-in':''}" data-bench-player="${p.id}">${avatarHTML(p)}<div class="bname">${p.name}</div><div class="btime" data-player-time="${p.id}">${fmt(playerMatchTime(p.id,now))}</div></button>`).join('')||'<span class="subtitle">Aucun remplaçant</span>'}</div>${m.actionLog.some(a=>a.type==='replace')?`<button class="tiny-btn replacement-undo" data-action="undo-replacement">↶ Annuler le dernier changement</button>`:''}</div>
    </section>`;
  }

  function statsExpressHTML(m,onField,now){
    return `<section>${onField.map(p=>`<article class="stats-player-card"><div class="stats-player-head"><div class="row-left">${avatarHTML(p)}<div><strong>${p.name}</strong><div class="subtitle">Temps <span data-player-time="${p.id}">${fmt(playerMatchTime(p.id,now))}</span></div></div></div><span class="badge">sur le terrain</span></div><div class="two-actions"><button class="action-btn tackle" data-stat="plaquages" data-player="${p.id}">PLAQUAGE +1<small data-coach-stat-count="${p.id}:plaquages">${m.matchStats[p.id]?.plaquages||0}</small></button><button class="action-btn try" data-stat="essais" data-player="${p.id}">ESSAI +1<small data-coach-stat-count="${p.id}:essais">${m.matchStats[p.id]?.essais||0}</small></button></div></article>`).join('')}</section><section class="card"><div class="split"><span class="subtitle">Erreur de saisie ?</span><button class="tiny-btn red" data-action="undo">Annuler dernière stat</button></div></section>`;
  }

  function renderTraining(){
    const selected=state.selectedTraining.map(id=>trainingLibrary.find(x=>x.id===id)).filter(Boolean);
    content.innerHTML=`
      <section class="card"><div class="split"><div><strong>Ma séance</strong><div class="subtitle">${selected.reduce((a,x)=>a+x.duration,0)} min • ${selected.length} ateliers</div></div><button class="tiny-btn green" data-action="ffr-template">Séance FFR oct. 2026</button></div><div class="list" style="margin-top:12px">${selected.map(ex=>exerciseRow(ex,true)).join('')||'<div class="subtitle">Aucun atelier sélectionné.</div>'}</div><button class="btn blue full" style="margin-top:12px" data-action="open-library">+ Ajouter des ateliers</button></section>
      <section class="card"><div class="split"><div><strong>Matériel de la séance</strong><div class="subtitle">Calcul automatique</div></div></div><div style="margin-top:8px">${Object.entries(calcEquipment()).map(([k,v])=>`<div class="eq-row"><span>${k}</span><strong>${v}</strong></div>`).join('')||'<span class="subtitle">Aucun matériel calculé.</span>'}</div></section>
      <section class="card"><strong>Ajouts FFR 2026-2027</strong><div class="subtitle" style="margin-top:4px">Mr Freeze, croix/vagues, lutte à 4 appuis, 1v1, 2v2, toucher +2 s et jeu au contact sont intégrés dans la bibliothèque.</div></section>`;
  }
  function exerciseRow(ex,removable=false){return `<div class="exercise-row"><div><strong>${ex.title}</strong><div class="subtitle">${ex.duration} min • ${ex.category}</div>${ex.source?`<span class="source-tag">${ex.source}</span>`:''}</div><div class="chips"><button class="tiny-btn" data-open-ex="${ex.id}">Voir</button>${removable?`<button class="tiny-btn red" data-remove-ex="${ex.id}">Retirer</button>`:`<button class="tiny-btn green" data-add-ex="${ex.id}">Ajouter</button>`}</div></div>`}

  function renderStats(){
    const totals=state.players.reduce((a,p)=>{a.plaquages+=p.stats.plaquages;a.essais+=p.stats.essais;a.matches+=p.stats.matches;return a},{plaquages:0,essais:0,matches:0});
    content.innerHTML=`<section class="stats-grid"><div class="stat-tile"><b>${totals.plaquages}</b>Plaquages</div><div class="stat-tile"><b>${totals.essais}</b>Essais</div></section><section class="card"><strong>Par joueur</strong><div class="list" style="margin-top:12px">${state.players.map(p=>`<div class="stat-row"><div class="row-left">${avatarHTML(p)}<div><strong>${p.name}</strong><div class="subtitle">Temps cumulé ${fmt(p.totalSeconds)} • ${p.stats.matches} match(s)</div></div></div><div class="chips"><span class="chip">Plaq ${p.stats.plaquages}</span><span class="chip">Ess ${p.stats.essais}</span></div></div>`).join('')}</div></section><section class="card"><div class="split"><strong>Historique matchs</strong><span class="badge">${state.history.length}</span></div><div class="list" style="margin-top:10px">${state.history.map(h=>`<div class="exercise-row"><div><strong>${h.name}</strong><div class="subtitle">${h.date} • ${h.score.us}-${h.score.them} • ${fmt(h.duration)}</div></div></div>`).join('')||'<div class="subtitle">Aucun match terminé.</div>'}</div></section><section class="card"><div class="split-wrap"><div><strong>Remise à zéro</strong><div class="subtitle">Efface les matchs de test, les temps de jeu, les plaquages et les essais. Les photos, licences et notes joueurs sont conservées.</div></div><button class="btn danger" data-action="reset-stats">Remettre les stats à zéro</button></div></section>`;
  }

  function createPlateau(){
    const ids=[...document.querySelectorAll('[data-roster-pick].active')].map(b=>b.dataset.rosterPick);
    const fmtBtn=document.querySelector('.plateau-fmt.active');
    const format=Number(fmtBtn?.dataset.fmt||5);
    if(ids.length<format)return showToast(`Il faut au moins ${format} présents`);
    state.currentPlateau={id:'pl'+Date.now(),name:document.getElementById('plateauName').value.trim()||'Plateau',format,rosterIds:ids,nextMatchNumber:1,matches:[]};
    save();render();
  }

  function startNextMatch(){
    const p=state.currentPlateau;if(!p)return;
    const lineup=[...document.querySelectorAll('[data-starter-pick].active')].map(b=>b.dataset.starterPick);
    if(lineup.length!==p.format)return showToast(`Choisis exactement ${p.format} joueurs`);
    const bench=p.rosterIds.filter(id=>!lineup.includes(id));const now=Date.now();
    state.currentMatch={id:'m'+now,number:p.nextMatchNumber,name:`Match ${p.nextMatchNumber}`,format:p.format,phase:'1re mi-temps',running:true,startedAt:now,elapsedBefore:0,lineup,bench,score:{us:0,them:0},playerTimes:Object.fromEntries(p.rosterIds.map(id=>[id,{acc:0,onField:lineup.includes(id),lastStart:lineup.includes(id)?now:null}])),matchStats:Object.fromEntries(p.rosterIds.map(id=>[id,{plaquages:0,essais:0}])),actionLog:[],cloudShared:false,cloudInviteUrl:null,cloudSyncError:false};
    state.ui.matchTab='terrain';state.ui.pendingOutId=null;save();requestWakeLock();render();showToast(`Match ${p.nextMatchNumber} démarré`);
  }

  async function replacePlayer(outId,inId,logAction=true){
    const m=state.currentMatch;if(!m||!m.lineup.includes(outId)||!m.bench.includes(inId))return;
    const now=Date.now();
    const outR=m.playerTimes[outId],inR=m.playerTimes[inId];
    if(m.running&&outR.lastStart)outR.acc+=Math.max(0,(now-outR.lastStart)/1000);
    outR.onField=false;outR.lastStart=null;
    inR.onField=true;inR.lastStart=m.running?now:null;
    const pos=m.lineup.indexOf(outId);m.lineup[pos]=inId;m.bench=m.bench.filter(x=>x!==inId);m.bench.push(outId);
    if(logAction)m.actionLog.push({type:'replace',outId,inId});state.ui.pendingOutId=null;save();render();navigator.vibrate?.([20,30,20]);
    const synced=await syncLiveState();
    if(synced)showToast(`${player(inId).name} entre • écran parent mis à jour`);
  }

  async function undoLastReplacement(){
    const m=state.currentMatch;if(!m)return;
    let idx=-1;for(let i=m.actionLog.length-1;i>=0;i--){if(m.actionLog[i]?.type==='replace'){idx=i;break;}}
    if(idx<0)return showToast('Aucun changement à annuler');
    const last=m.actionLog[idx];
    if(!m.lineup.includes(last.inId)||!m.bench.includes(last.outId))return showToast('Ce changement ne peut plus être annulé');
    m.actionLog.splice(idx,1);save();
    await replacePlayer(last.inId,last.outId,false);
    showToast(`Changement annulé • ${player(last.outId).name} revient`);
  }

  async function addStat(pid,key){
    const m=state.currentMatch;if(!m||!m.matchStats[pid])return;
    if(m.cloudShared && window.RCSQLive?.role==='admin'){
      try{await window.RCSQLive.record(m.id,{kind:'stat',stat:key==='essais'?'try':'tackle',playerId:pid,delta:1});m.actionLog.push({type:'cloud-stat',pid,key,delta:1});save();navigator.vibrate?.(20);}catch(e){showToast(e.message||'Erreur direct');}
      return;
    }
    m.matchStats[pid][key]=(m.matchStats[pid][key]||0)+1;
    player(pid).stats[key]=(player(pid).stats[key]||0)+1;
    if(key==='essais')m.score.us+=1;
    m.actionLog.push({type:'stat',pid,key});save();render();navigator.vibrate?.(20);
  }
  async function undo(){
    const m=state.currentMatch;if(!m)return;
    const last=[...m.actionLog].reverse().find(x=>['stat','cloud-stat'].includes(x.type));
    if(!last)return showToast('Aucune stat à annuler');
    const idx=m.actionLog.lastIndexOf(last);m.actionLog.splice(idx,1);
    if(last.type==='cloud-stat' && m.cloudShared && window.RCSQLive?.role==='admin'){
      try{await window.RCSQLive.record(m.id,{kind:'stat',stat:last.key==='essais'?'try':'tackle',playerId:last.pid,delta:-1});save();}catch(e){showToast(e.message||'Erreur direct');}return;
    }
    m.matchStats[last.pid][last.key]=Math.max(0,m.matchStats[last.pid][last.key]-1);player(last.pid).stats[last.key]=Math.max(0,player(last.pid).stats[last.key]-1);if(last.key==='essais')m.score.us=Math.max(0,m.score.us-1);save();render();showToast('Stat annulée');
  }

  function doHalfTime(){
    const m=state.currentMatch;if(!m)return;
    if(m.running)pauseMatch();
    m.phase=m.phase==='1re mi-temps'?'2e mi-temps':m.phase;save();syncLiveState();
    openCoach('Mi-temps',true);
  }

  async function endMatch(){
    const m=state.currentMatch;if(!m)return;
    if(!confirm(`Terminer définitivement le Match ${m.number} ?`))return;
    if(m.cloudShared && window.RCSQLive?.ready){
      try{const fresh=await window.RCSQLive.getSummary(m.id);if(fresh)applyCloudAggregate(m.id,fresh);}catch{}
    }
    const now=Date.now();if(m.running){settleRunning(now);m.running=false;}
    const duration=m.elapsedBefore;
    Object.entries(m.playerTimes).forEach(([pid,r])=>{if(r.acc>0){player(pid).totalSeconds+=r.acc;player(pid).stats.matches+=1;}});
    const rec={name:`${state.currentPlateau?.name||'Plateau'} • Match ${m.number}`,matchNumber:m.number,date:new Date().toLocaleDateString('fr-FR'),score:{...m.score},duration,rosterIds:[...(state.currentPlateau?.rosterIds||Object.keys(m.playerTimes))],playerTimes:Object.fromEntries(Object.entries(m.playerTimes).map(([id,r])=>[id,r.acc])),stats:structuredClone(m.matchStats)};
    state.history.unshift(rec);
    if(state.currentPlateau){state.currentPlateau.matches.unshift(rec);state.currentPlateau.nextMatchNumber=m.number+1;}
    if(m.cloudShared && window.RCSQLive?.role==='admin'){
      try{await window.RCSQLive.setLiveState(m.id,{lineup:m.lineup,phase:'Terminé',active:false,running:false});}catch{}
      const token=inviteTokenFromUrl(m.cloudInviteUrl);if(token){try{await window.RCSQLive.revokeInvite(token);}catch{}}
    }
    state.currentMatch=null;state.ui.pendingOutId=null;save();await persistEmergencyBackupNow();releaseWakeLock();render();openMatchSummary(rec);
  }

  function openMatchSummary(rec){
    const ids=(rec.rosterIds||Object.keys(rec.playerTimes||{})).filter(id=>player(id));
    const times=ids.map(id=>({id,name:player(id).name,time:Number(rec.playerTimes?.[id]||0)})).sort((a,b)=>a.time-b.time);
    const avg=times.length?times.reduce((a,x)=>a+x.time,0)/times.length:0;
    const low=times[0]||null, high=times[times.length-1]||null;
    const totalPlaquages=ids.reduce((a,id)=>a+Number(rec.stats?.[id]?.plaquages||0),0);
    const totalEssais=ids.reduce((a,id)=>a+Number(rec.stats?.[id]?.essais||0),0);
    const bestTackle=ids.map(id=>({name:player(id).name,n:Number(rec.stats?.[id]?.plaquages||0)})).sort((a,b)=>b.n-a.n)[0];
    const gap=(low&&high)?high.time-low.time:0;
    const balance=gap>=120?`<div class="summary-alert">⏱ Écart de temps de jeu : <strong>${fmt(gap)}</strong>. ${low?`<strong>${low.name}</strong> a le moins joué (${fmt(low.time)}).`:''}</div>`:`<div class="success-note">✓ Temps de jeu assez équilibré sur ce match.</div>`;
    modal.hidden=false;
    modalContent.innerHTML=`<div class="title-row"><div><strong>Résumé automatique</strong><div class="subtitle">${rec.name}</div></div><button class="tiny-btn" data-close-modal>✕</button></div>
      <div class="match-summary-score"><div><span>RCSQ</span><b>${rec.score.us}</b></div><div><span>Durée</span><b>${fmt(rec.duration)}</b></div><div><span>Adversaire</span><b>${rec.score.them}</b></div></div>
      <div class="stats-grid" style="margin-top:10px"><div class="stat-tile"><b>${totalPlaquages}</b>Plaquages</div><div class="stat-tile"><b>${totalEssais}</b>Essais RCSQ</div><div class="stat-tile"><b>${fmt(avg)}</b>Temps moyen</div><div class="stat-tile"><b>${bestTackle?.n||0}</b>Meilleur total plaquages${bestTackle?.name?`<div class="small">${bestTackle.name}</div>`:''}</div></div>
      <div style="margin-top:12px">${balance}</div>
      <section class="card" style="margin-top:12px;margin-bottom:0"><strong>Temps de jeu du match</strong><div class="list" style="margin-top:9px">${times.map(x=>`<div class="stat-row"><span>${x.name}</span><strong>${fmt(x.time)}</strong></div>`).join('')}</div></section>
      <div class="grid2" style="margin-top:12px"><button class="btn blue" data-action="open-end-coach">🎤 Phrases fin de match</button><button class="btn green" data-action="back-to-plateau">Retour plateau</button></div>`;
  }

  function closePlateau(){
    if(!confirm('Terminer ce plateau ? Les matchs restent enregistrés dans les statistiques.'))return;
    state.currentPlateau=null;state.currentMatch=null;save();render();
  }

  function openCoach(category='Mi-temps',breakMode=false){
    const arr=coachPhrases[category]||coachPhrases['Motiver'];
    const highlight=arr[Math.floor(Math.random()*arr.length)];
    modal.hidden=false;
    modalContent.innerHTML=`<div class="title-row"><div><strong>${category}</strong><div class="subtitle">Phrases courtes à dire aux enfants</div></div><button class="tiny-btn" data-close-modal>✕</button></div><div class="coach-highlight">“${highlight}”</div><div class="seg">${Object.keys(coachPhrases).map(k=>`<button class="coachcat ${k===category?'active':''}" data-coach-cat="${k}">${k}</button>`).join('')}</div><div class="coach-list">${arr.map(x=>`<div class="coach-item">${x}</div>`).join('')}</div>${breakMode&&state.currentMatch?`<button class="btn green full" style="margin-top:12px" data-action="resume-from-coach">Reprendre le match</button>`:''}${breakMode&&!state.currentMatch?`<button class="btn blue full" style="margin-top:12px" data-action="back-to-plateau">Retour au plateau</button>`:''}`;
  }

  function openLibrary(){
    modal.hidden=false;modalContent.innerHTML=`<div class="title-row"><div><strong>Bibliothèque M10</strong><div class="subtitle">Tes ateliers + ajouts FFR</div></div><button class="tiny-btn" data-close-modal>✕</button></div><div class="list">${trainingLibrary.map(ex=>exerciseRow(ex,false)).join('')}</div>`;
  }
  function openExercise(id){
    const ex=trainingLibrary.find(x=>x.id===id);if(!ex)return;
    modal.hidden=false;modalContent.innerHTML=`<div class="title-row"><div><strong>${ex.title}</strong><div class="subtitle">${ex.category} • ${ex.duration} min • ${ex.players} joueurs</div>${ex.source?`<span class="source-tag">${ex.source}</span>`:''}</div><button class="tiny-btn" data-close-modal>✕</button></div><div class="success-note"><strong>Objectif :</strong> ${ex.goal}</div><section class="card" style="margin-top:12px"><strong>Matériel</strong>${Object.entries(ex.equipment).map(([k,v])=>`<div class="eq-row"><span>${k}</span><strong>${v}</strong></div>`).join('')}</section><section class="card"><strong>Consignes</strong><div class="coach-list" style="margin-top:9px">${ex.notes.map(n=>`<div class="coach-item">${n}</div>`).join('')}</div></section>`;
  }
  function openPlayer(id){
    const p=player(id);
    const admin=(p.qualificationNumber||p.birthDate||p.ffrClass)?`<section class="card" style="margin-top:12px"><strong>Informations FFR</strong><div class="eq-row"><span>N° licence / qualification</span><strong>${p.qualificationNumber||'—'}</strong></div><div class="eq-row"><span>Date de naissance</span><strong>${p.birthDate||'—'}</strong></div><div class="eq-row"><span>Classe d’âge FFR</span><strong>${p.ffrClass||'—'}</strong></div><div class="eq-row"><span>Licence</span><strong>${p.licenceType||'—'}</strong></div></section>`:`<div class="warning" style="margin-top:12px">Charge le fichier privé des fiches joueurs pour afficher le n° FFR et la date de naissance.</div>`;
    modal.hidden=false;modalContent.innerHTML=`<div class="title-row"><div class="row-left">${avatarHTML(p,'big')}<div><strong style="font-size:23px">${p.name}</strong><div class="subtitle">Fiche joueur</div></div></div><button class="tiny-btn" data-close-modal>✕</button></div><div class="stats-grid"><div class="stat-tile"><b>${fmt(p.totalSeconds)}</b>Temps total joué</div><div class="stat-tile"><b>${p.stats.plaquages}</b>Plaquages total</div><div class="stat-tile"><b>${p.stats.essais}</b>Essais total</div><div class="stat-tile"><b>${p.stats.matches}</b>Matchs joués</div></div>${admin}<section class="card" style="margin-top:12px;margin-bottom:0"><label>Notes éducateur</label><textarea id="notesField" class="input">${p.notes||''}</textarea><button class="btn blue full" style="margin-top:10px" data-save-notes="${p.id}">Enregistrer</button></section>`;
  }
  function editRoster(){
    const p=state.currentPlateau;modal.hidden=false;modalContent.innerHTML=`<div class="title-row"><div><strong>Présence plateau</strong><div class="subtitle">Seuls les joueurs cochés seront disponibles aux matchs suivants.</div></div><button class="tiny-btn" data-close-modal>✕</button></div><div class="player-pick-grid">${state.players.map(pl=>`<button class="pick-btn ${p.rosterIds.includes(pl.id)?'active':''}" data-edit-roster-pick="${pl.id}">${pl.name}</button>`).join('')}</div><button class="btn primary full" style="margin-top:12px" data-action="save-roster">Enregistrer</button>`;
  }

  function inviteTokenFromUrl(url){try{return (new URL(url||'',location.href).hash.match(/^#invite=([a-f0-9]{48})$/)||[])[1]||null}catch{return null}}
  async function syncLiveState(){
    const m=state.currentMatch;if(!m?.cloudShared||window.RCSQLive?.role!=='admin')return true;
    try{
      await window.RCSQLive.setLiveState(m.id,{lineup:[...m.lineup],phase:m.phase,active:true,running:m.running});
      m.cloudSyncError=false;save();
      return true;
    }catch(e){
      m.cloudSyncError=true;save();console.warn('Synchronisation parent impossible',e);
      showToast('⚠️ Changement fait, mais synchro parent à vérifier');
      return false;
    }
  }
  let cloudRenderRAF=0;
  function onCloudChange(){
    if(pendingShareAfterLogin && window.RCSQLive?.role==='admin'){pendingShareAfterLogin=false;modal.hidden=true;openShareAssistant();return;}
    if(cloudRenderRAF)return;
    cloudRenderRAF=requestAnimationFrame(()=>{
      cloudRenderRAF=0;
      if(isAssistantMode()){updateAssistantView();return;}
      if(state.route==='match'&&state.currentMatch){updateParentPresenceIndicator();return;}
      render();
    });
  }
  function applyCloudAggregate(matchId,result){
    const m=state.currentMatch;if(!m||m.id!==matchId)return;
    for(const [pid,st] of Object.entries(result.stats||{})){
      if(!m.matchStats[pid])continue;
      const newP=Number(st.tackle||0),newE=Number(st.try||0);
      const dP=newP-Number(m.matchStats[pid].plaquages||0),dE=newE-Number(m.matchStats[pid].essais||0);
      m.matchStats[pid].plaquages=newP;m.matchStats[pid].essais=newE;
      if(player(pid)){player(pid).stats.plaquages=Math.max(0,player(pid).stats.plaquages+dP);player(pid).stats.essais=Math.max(0,player(pid).stats.essais+dE);}
    }
    m.score.us=Number(result.homeScore||0);m.score.them=Number(result.awayScore||0);save();
    if(!isAssistantMode()&&state.route==='match')updateCoachCloudCounters(m);
  }
  function updateCoachCloudCounters(m=state.currentMatch){
    if(!m)return;
    const home=document.querySelector('[data-coach-home-score]'),away=document.querySelector('[data-coach-away-score]');
    if(home)home.textContent=m.score.us;if(away)away.textContent=m.score.them;
    for(const [pid,st] of Object.entries(m.matchStats||{})){
      const p=document.querySelector(`[data-coach-stat-count="${pid}:plaquages"]`),e=document.querySelector(`[data-coach-stat-count="${pid}:essais"]`);
      if(p)p.textContent=st.plaquages||0;if(e)e.textContent=st.essais||0;
    }
  }
  async function coachScore(side){
    const m=state.currentMatch;if(!m)return;
    if(m.cloudShared&&window.RCSQLive?.role==='admin'){
      try{await window.RCSQLive.record(m.id,{kind:'score',side:side==='them'?'away':'home',delta:1});m.actionLog.push({type:'cloud-score',side});save();}catch(e){showToast(e.message||'Erreur direct');}
    }else{m.score[side]+=1;m.actionLog.push({type:'score',side});save();render();}
  }
  function openCloudLogin(){
    modal.hidden=false;
    const email=localStorage.getItem('rcsq-cloud-email')||'';
    modalContent.innerHTML=`<div class="title-row"><div><strong>Connexion coach</strong><div class="subtitle">Une seule fois sur ton iPhone. Les parents n'ont aucun compte à créer.</div></div><button class="tiny-btn" data-close-modal>✕</button></div><div class="form-grid"><div><label>E-mail Firebase du coach</label><input id="cloudEmail" class="input" type="email" autocomplete="username" value="${email}"></div><div><label>Mot de passe</label><input id="cloudPassword" class="input" type="password" autocomplete="current-password"></div><button class="btn blue full" data-action="cloud-login">Se connecter et créer le QR</button></div>${window.RCSQLive?.error?`<div class="danger-note" style="margin-top:10px">${window.RCSQLive.error}</div>`:''}`;
  }
  async function doCloudLogin(){
    const email=document.getElementById('cloudEmail')?.value||'',password=document.getElementById('cloudPassword')?.value||'';
    if(!email||!password)return showToast('E-mail et mot de passe nécessaires');
    try{pendingShareAfterLogin=true;localStorage.setItem('rcsq-cloud-email',email);await window.RCSQLive.login(email,password);showToast('Connexion réussie');}catch(e){pendingShareAfterLogin=false;showToast(e.message||'Connexion impossible');}
  }
  async function openShareAssistant(){
    const m=state.currentMatch;if(!m)return showToast('Démarre un match d’abord');
    if(!window.RCSQLive?.configured)return showToast('Mode direct non configuré');
    if(!window.RCSQLive.ready)return showToast('Connexion au direct en cours…');
    if(window.RCSQLive.role!=='admin'){pendingShareAfterLogin=true;openCloudLogin();return;}
    try{
      if(!m.cloudShared){
        const roster=(state.currentPlateau?.rosterIds||Object.keys(m.matchStats)).map(id=>player(id)).filter(Boolean);
        await window.RCSQLive.publish({id:m.id,title:`${state.currentPlateau?.name||'Plateau'} • Match ${m.number}`,opponent:'Adversaire',date:new Date().toISOString().slice(0,10),format:m.format,homeScore:m.score.us,awayScore:m.score.them,stats:Object.fromEntries(roster.map(p=>[p.id,{try:m.matchStats[p.id]?.essais||0,tackle:m.matchStats[p.id]?.plaquages||0}]))},roster.map(p=>({id:p.id,firstName:p.name})));
        m.cloudShared=true;save();await syncLiveState();
      }
      if(!m.cloudInviteUrl){m.cloudInviteUrl=await window.RCSQLive.createInvite(m.id);save();}
      showInviteModal(m.cloudInviteUrl);
    }catch(e){showToast(e.message||'Impossible de créer le QR');}
  }
  function showInviteModal(url){
    modal.hidden=false;
    modalContent.innerHTML=`<div class="title-row"><div><strong>QR parent — statistiques</strong><div class="subtitle">Valable 8 heures. Le parent peut seulement noter plaquages, essais et essais adverses.</div></div><button class="tiny-btn" data-close-modal>✕</button></div><div id="qrBox" class="qr-box"></div><div class="success-note" style="margin-top:10px">Les changements, chronos, licences et photos restent uniquement chez toi.</div><div class="chips" style="margin-top:12px;justify-content:center"><button class="btn blue" data-action="native-share-invite" data-url="${url}">Partager le lien</button><button class="btn ghost" data-action="copy-invite" data-url="${url}">Copier</button></div><div class="invite-url">${url}</div>`;
    setTimeout(()=>{const box=document.getElementById('qrBox');if(!box)return;if(window.QRCode){box.innerHTML='';new QRCode(box,{text:url,width:220,height:220,colorDark:'#08285c',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});}else box.innerHTML='<div class="warning">QR indisponible : utilise le bouton Partager le lien.</div>';},50);
  }
  async function copyInviteLink(url){try{await navigator.clipboard.writeText(url);showToast('Lien copié');}catch{showToast('Copie impossible');}}
  async function shareInviteLink(url){try{if(navigator.share)await navigator.share({title:'RCSQ M10 — stats parent',text:'Scanne/ouvre ce lien pour noter les stats du match.',url});else await copyInviteLink(url);}catch{}}

  function assistantSyncLabel(live){
    if(!navigator.onLine)return {text:'● HORS LIGNE',cls:'offline'};
    const age=Date.now()-Number(live?.lastContactAt||0);
    if(age<5000)return {text:'● SYNCHRO OK',cls:'ok'};
    return {text:'◌ RECONNEXION…',cls:'wait'};
  }
  function currentAssistantMatch(){
    const live=window.RCSQLive,id=live?.guestMatchId;
    return id?live.matches.find(x=>x.id===id):null;
  }
  function assistantPlayerName(pid){
    const m=currentAssistantMatch();
    return m?.roster?.find(p=>p.id===pid)?.firstName||'Joueur';
  }
  function showAssistantConfirm(text,kind='ok'){
    let box=document.getElementById('assistantConfirm');
    if(!box){box=document.createElement('div');box.id='assistantConfirm';box.className='assistant-confirm';document.body.appendChild(box);}
    clearTimeout(assistantConfirmTimer);box.className=`assistant-confirm show ${kind}`;box.textContent=text;
    assistantConfirmTimer=setTimeout(()=>box.classList.remove('show'),720);
  }
  function renderAssistant(){
    const live=window.RCSQLive;
    if(!live){content.innerHTML='<section class="card">Mode parent indisponible.</section>';return;}
    if(live.invitePending || (live.ready&&!live.signedIn)){content.innerHTML=`<div class="assistant-head"><img src="assets/rcsq-logo.png" alt="RCSQ"><div><strong>RCSQ M10</strong><span>Connexion au match…</span></div></div><section class="card center"><div class="assistant-loader">🏉</div><strong>Ouverture du mode statistiques parent…</strong><div class="subtitle" style="margin-top:8px">Aucun compte à créer.</div></section>`;return;}
    if(live.error && live.role!=='guest'){content.innerHTML=`<div class="assistant-head"><img src="assets/rcsq-logo.png" alt="RCSQ"><div><strong>RCSQ M10</strong><span>Mode parent</span></div></div><section class="card"><div class="danger-note">${live.error}</div></section>`;return;}
    const id=live.guestMatchId,m=currentAssistantMatch();
    if(!m){content.innerHTML=`<div class="assistant-head"><img src="assets/rcsq-logo.png" alt="RCSQ"><div><strong>RCSQ M10</strong><span>Mode parent</span></div></div><section class="card center"><strong>Chargement du match…</strong></section>`;return;}
    const lineup=m.live?.lineup||[];
    const map=new Map((m.roster||[]).map(p=>[p.id,p]));
    const active=lineup.map(id=>map.get(id)).filter(Boolean);
    const sync=assistantSyncLabel(live);
    const enabled=m.live?.active!==false && navigator.onLine;
    lastAssistantLineupKey=lineup.join('|');lastAssistantMatchId=id;
    content.innerHTML=`
      <div class="assistant-head"><img src="assets/rcsq-logo.png" alt="RCSQ"><div><strong>RCSQ M10 — STATISTIQUES</strong><span data-assistant-phase>${m.title||'Match'} • ${m.live?.phase||'En direct'}</span></div><div class="assistant-sync ${sync.cls}" data-assistant-sync>${sync.text}</div></div>
      <section class="assistant-score"><div><span>RCSQ</span><b data-assistant-home-score>${m.score.homeScore}</b></div><div class="live-dot" data-assistant-live-dot>${m.live?.active===false?'■ TERMINÉ':'● MATCH EN COURS'}</div><div><span>ADVERSAIRE</span><b data-assistant-away-score>${m.score.awayScore}</b></div></section>
      <div data-assistant-offline-box>${!navigator.onLine?'<div class="assistant-offline">Connexion perdue : les boutons sont bloqués pour éviter de perdre une stat. Ils se réactivent automatiquement au retour du réseau.</div>':''}</div>
      <div class="assistant-rule">Tu notes uniquement <strong>PLAQUAGES + ESSAIS</strong>. Le coach gère les changements : les joueurs affichés ici se mettent à jour tout seuls.</div>
      <section class="assistant-pitch"><div class="assistant-field-title">Joueurs actuellement sur le terrain</div><div class="assistant-grid">${active.map(p=>{const st=m.score.stats?.[p.id]||{};return `<article class="assistant-player" data-assistant-card="${p.id}"><div class="assistant-ident"><div class="assistant-avatar">${String(p.firstName||'?').slice(0,1)}</div><strong>${p.firstName}</strong></div><div class="assistant-two"><button ${enabled?'':'disabled'} data-assistant-stat="tackle" data-player="${p.id}" class="assistant-stat tackle">PLAQUAGE +1<span data-assistant-count="${p.id}:tackle">${st.tackle||0}</span></button><button ${enabled?'':'disabled'} data-assistant-stat="try" data-player="${p.id}" class="assistant-stat try">ESSAI +1<span data-assistant-count="${p.id}:try">${st.try||0}</span></button></div></article>`}).join('')||'<div class="warning">La composition terrain va apparaître dès que le coach active le direct.</div>'}</div></section>
      <section class="assistant-bottom"><button class="assistant-away" ${enabled?'':'disabled'} data-action="assistant-away-try">ESSAI ÉQUIPE ADVERSE +1 <span data-assistant-away-score-bottom>${m.score.awayScore}</span></button><button class="assistant-undo" ${assistantActionLog.length?'':'disabled'} data-action="assistant-undo">↶ Annuler ma dernière saisie</button></section>`;
  }
  function updateAssistantView(){
    const live=window.RCSQLive,m=currentAssistantMatch();
    if(!live||!m||!document.querySelector('.assistant-head')){renderAssistant();return;}
    const id=live.guestMatchId,lineup=(m.live?.lineup||[]),key=lineup.join('|');
    if(id!==lastAssistantMatchId || key!==lastAssistantLineupKey){
      const y=window.scrollY,hadLineup=Boolean(lastAssistantLineupKey);
      renderAssistant();requestAnimationFrame(()=>window.scrollTo(0,y));
      if(hadLineup)showAssistantConfirm('↻ Composition mise à jour','info');
      return;
    }
    const sync=assistantSyncLabel(live),syncEl=document.querySelector('[data-assistant-sync]');
    if(syncEl){syncEl.textContent=sync.text;syncEl.className=`assistant-sync ${sync.cls}`;}
    const home=document.querySelector('[data-assistant-home-score]'),away=document.querySelector('[data-assistant-away-score]'),awayBottom=document.querySelector('[data-assistant-away-score-bottom]');
    if(home)home.textContent=m.score.homeScore;if(away)away.textContent=m.score.awayScore;if(awayBottom)awayBottom.textContent=m.score.awayScore;
    const phase=document.querySelector('[data-assistant-phase]');if(phase)phase.textContent=`${m.title||'Match'} • ${m.live?.phase||'En direct'}`;
    const dot=document.querySelector('[data-assistant-live-dot]');if(dot)dot.textContent=m.live?.active===false?'■ TERMINÉ':'● MATCH EN COURS';
    for(const [pid,st] of Object.entries(m.score.stats||{})){
      const ta=document.querySelector(`[data-assistant-count="${pid}:tackle"]`),tr=document.querySelector(`[data-assistant-count="${pid}:try"]`);
      if(ta)ta.textContent=st.tackle||0;if(tr)tr.textContent=st.try||0;
    }
    const enabled=m.live?.active!==false && navigator.onLine;
    document.querySelectorAll('[data-assistant-stat], [data-action="assistant-away-try"]').forEach(b=>b.disabled=!enabled);
    const off=document.querySelector('[data-assistant-offline-box]');if(off)off.innerHTML=!navigator.onLine?'<div class="assistant-offline">Connexion perdue : les boutons sont bloqués pour éviter de perdre une stat. Ils se réactivent automatiquement au retour du réseau.</div>':'';
    const undo=document.querySelector('[data-action="assistant-undo"]');if(undo)undo.disabled=!assistantActionLog.length;
  }
  function lockAssistantButton(btn){
    if(!btn||btn.dataset.busy==='1')return false;
    btn.dataset.busy='1';btn.classList.add('tap-pulse');
    navigator.vibrate?.(20);
    setTimeout(()=>{btn.dataset.busy='0';btn.classList.remove('tap-pulse');},550);
    return true;
  }

  async function assistantRecordStat(pid,stat,btn){
    const live=window.RCSQLive,id=live?.guestMatchId;if(!id||!lockAssistantButton(btn))return;
    try{
      await live.record(id,{kind:'stat',stat,playerId:pid,delta:1});
      assistantActionLog.push({kind:'stat',stat,playerId:pid});
      showAssistantConfirm(stat==='try'?`✓ ESSAI • ${assistantPlayerName(pid)}`:`✓ PLAQUAGE • ${assistantPlayerName(pid)}`,stat==='try'?'try':'tackle');
      updateAssistantView();
    }catch(e){showToast(e.message||'Saisie impossible');}
  }
  async function assistantAwayTry(btn){
    const live=window.RCSQLive,id=live?.guestMatchId;if(!id||!lockAssistantButton(btn))return;
    try{await live.record(id,{kind:'score',side:'away',delta:1});assistantActionLog.push({kind:'score',side:'away'});showAssistantConfirm('✓ ESSAI ADVERSAIRE','away');updateAssistantView();}catch(e){showToast(e.message||'Saisie impossible');}
  }
  async function assistantUndo(){
    const a=assistantActionLog.pop();if(!a)return showToast('Rien à annuler');
    try{await window.RCSQLive.record(window.RCSQLive.guestMatchId,{...a,delta:-1});showAssistantConfirm('↶ Dernière saisie annulée','info');updateAssistantView();}catch(e){assistantActionLog.push(a);showToast(e.message||'Annulation impossible');}
  }

  function calcEquipment(){const out={};state.selectedTraining.forEach(id=>{const ex=trainingLibrary.find(x=>x.id===id);if(!ex)return;Object.entries(ex.equipment).forEach(([k,v])=>out[k]=(out[k]||0)+v)});return out;}
  function loadFFRTemplate(){state.selectedTraining=['ffr-freeze','ffr-t2s','ffr-lutte4','ffr-jco'];save();render();showToast('Séance FFR chargée');}
  function resetStats(){
    if(!confirm('Remettre à zéro tous les temps de jeu, plaquages, essais et historiques de match ?\n\nLes photos, licences, dates de naissance et notes joueurs seront conservées.'))return;
    if(!confirm('Dernière confirmation : effacer toutes les statistiques de test ?'))return;
    state.players.forEach(p=>{
      p.totalSeconds=0;
      p.stats={plaquages:0,essais:0,matches:0};
    });
    state.history=[];
    state.currentMatch=null;
    state.currentPlateau=null;
    state.ui.pendingOutId=null;
    save();
    releaseWakeLock();
    render();
    showToast('Statistiques remises à zéro');
  }
  function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='RCSQ-M10-sauvegarde.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);}
  async function readEmergencyBackup(){
    try{
      const db=await openBackupDB();
      const tx=db.transaction('snapshots','readonly');
      const data=await new Promise(res=>{const r=tx.objectStore('snapshots').get('latest');r.onsuccess=()=>res(r.result||null);r.onerror=()=>res(null);});
      db.close(); return data;
    }catch{return null;}
  }
  async function restoreEmergencyBackup(manual=true){
    const data=await readEmergencyBackup();
    if(!data?.state){ if(manual)showToast('Aucune sauvegarde de secours disponible'); return false; }
    if(manual && !confirm(`Restaurer la sauvegarde automatique du ${new Date(data.savedAt).toLocaleString('fr-FR')} ?`))return false;
    state=data.state;localStorage.setItem(LS_KEY,JSON.stringify(state));primaryStorageOk=true;render();showToast('Sauvegarde de secours restaurée');return true;
  }
  async function autoRecoverIfNeeded(){
    if(primaryStorageOk)return;
    const data=await readEmergencyBackup();
    if(!data?.state)return;
    // récupération silencieuse seulement si aucune donnée de travail n'a été retrouvée
    const hasWork=Boolean(state.history?.length||state.currentMatch||state.currentPlateau||state.players?.some(p=>p.totalSeconds||p.stats?.plaquages||p.stats?.essais));
    if(!hasWork){state=data.state;localStorage.setItem(LS_KEY,JSON.stringify(state));primaryStorageOk=true;render();showToast('Données récupérées depuis la sauvegarde de secours');}
  }
  function importPrivatePlayers(file){const fr=new FileReader();fr.onload=()=>{try{const data=JSON.parse(fr.result);if(data.kind!=='rcsq-private-player-data'||!Array.isArray(data.players))throw new Error('bad file');data.players.forEach(priv=>{const cur=state.players.find(p=>p.id===priv.id);if(!cur)return;cur.name=priv.name||cur.name;cur.photo=priv.photo||cur.photo;cur.qualificationNumber=priv.qualificationNumber||null;cur.birthDate=priv.birthDate||null;cur.ffrClass=priv.ffrClass||null;cur.licenceType=priv.licenceType||null;});save();render();showToast('11 fiches joueurs chargées');}catch{showToast('Fichier joueurs invalide')}};fr.readAsText(file);}
  function importData(file){const fr=new FileReader();fr.onload=()=>{try{state=JSON.parse(fr.result);state=loadNormalize(state);save();render();showToast('Sauvegarde importée');}catch{showToast('Import impossible')}};fr.readAsText(file);}
  function loadNormalize(s){localStorage.setItem(LS_KEY,JSON.stringify(s));return loadAndMigrate();}

  document.body.addEventListener('click',e=>{
    const t=e.target.closest('button,[data-route-link],label.tiny-btn');if(!t)return;
    if(t.dataset.route)routeTo(t.dataset.route);
    if(t.dataset.routeLink)routeTo(t.dataset.routeLink);
    if(t.dataset.action==='open-coach')openCoach('Motiver');
    if(t.dataset.openPlayer)openPlayer(t.dataset.openPlayer);
    if(t.dataset.saveNotes){player(t.dataset.saveNotes).notes=document.getElementById('notesField').value;save();modal.hidden=true;showToast('Notes enregistrées');}
    if(t.hasAttribute('data-close-modal'))modal.hidden=true;
    if(t.dataset.coachCat)openCoach(t.dataset.coachCat,Boolean(state.currentMatch&&t.dataset.coachCat==='Mi-temps'));

    if(t.classList.contains('plateau-fmt')){document.querySelectorAll('.plateau-fmt').forEach(b=>b.classList.remove('active'));t.classList.add('active');}
    if(t.dataset.rosterPick)t.classList.toggle('active');
    if(t.dataset.action==='create-plateau')createPlateau();
    if(t.dataset.starterPick){const p=state.currentPlateau;const active=[...document.querySelectorAll('[data-starter-pick].active')];if(t.classList.contains('active'))t.classList.remove('active');else if(active.length<p.format)t.classList.add('active');else showToast(`Maximum ${p.format} titulaires`);}
    if(t.dataset.action==='start-next-match')startNextMatch();
    if(t.dataset.action==='edit-roster')editRoster();
    if(t.dataset.editRosterPick)t.classList.toggle('active');
    if(t.dataset.action==='save-roster'){const ids=[...document.querySelectorAll('[data-edit-roster-pick].active')].map(b=>b.dataset.editRosterPick);if(ids.length<state.currentPlateau.format)return showToast(`Il faut au moins ${state.currentPlateau.format} présents`);state.currentPlateau.rosterIds=ids;save();modal.hidden=true;render();}
    if(t.dataset.action==='close-plateau')closePlateau();

    if(t.dataset.action==='pause-match')pauseMatch();
    if(t.dataset.action==='resume-match')resumeMatch();
    if(t.dataset.action==='half-time')doHalfTime();
    if(t.dataset.action==='end-match')endMatch();
    if(t.dataset.action==='resume-from-coach'){modal.hidden=true;resumeMatch();}
    if(t.dataset.action==='back-to-plateau'){modal.hidden=true;render();}
    if(t.dataset.score)coachScore(t.dataset.score);
    if(t.dataset.matchTab){state.ui.matchTab=t.dataset.matchTab;state.ui.pendingOutId=null;save();render();}
    if(t.dataset.fieldPlayer){state.ui.pendingOutId=state.ui.pendingOutId===t.dataset.fieldPlayer?null:t.dataset.fieldPlayer;save();navigator.vibrate?.(15);render();if(state.ui.pendingOutId)setTimeout(()=>document.querySelector('.bench-section')?.scrollIntoView({behavior:'smooth',block:'nearest'}),60);}
    if(t.dataset.benchPlayer){if(!state.ui.pendingOutId)return showToast('Touche d’abord le joueur qui sort');replacePlayer(state.ui.pendingOutId,t.dataset.benchPlayer);}
    if(t.dataset.action==='cancel-replace'){state.ui.pendingOutId=null;save();render();}
    if(t.dataset.action==='undo-replacement')undoLastReplacement();
    if(t.dataset.stat&&t.dataset.player)addStat(t.dataset.player,t.dataset.stat);
    if(t.dataset.action==='undo')undo();
    if(t.dataset.action==='share-assistant')openShareAssistant();
    if(t.dataset.action==='cloud-login')doCloudLogin();
    if(t.dataset.action==='cloud-logout')window.RCSQLive?.logout();
    if(t.dataset.action==='copy-invite')copyInviteLink(t.dataset.url);
    if(t.dataset.action==='native-share-invite')shareInviteLink(t.dataset.url);
    if(t.dataset.assistantStat&&t.dataset.player)assistantRecordStat(t.dataset.player,t.dataset.assistantStat,t);
    if(t.dataset.action==='assistant-away-try')assistantAwayTry(t);
    if(t.dataset.action==='assistant-undo')assistantUndo();

    if(t.dataset.action==='open-library')openLibrary();
    if(t.dataset.openEx)openExercise(t.dataset.openEx);
    if(t.dataset.addEx){if(!state.selectedTraining.includes(t.dataset.addEx))state.selectedTraining.push(t.dataset.addEx);save();modal.hidden=true;render();showToast('Atelier ajouté');}
    if(t.dataset.removeEx){state.selectedTraining=state.selectedTraining.filter(id=>id!==t.dataset.removeEx);save();render();}
    if(t.dataset.action==='ffr-template')loadFFRTemplate();
    if(t.dataset.action==='reset-stats')resetStats();
    if(t.dataset.action==='export')exportData();
    if(t.dataset.action==='restore-emergency')restoreEmergencyBackup(true);
    if(t.dataset.action==='open-end-coach')openCoach('Fin de match',true);
  });
  document.body.addEventListener('change',e=>{if(e.target.id==='importInput'&&e.target.files?.[0])importData(e.target.files[0]);if(e.target.id==='playerDataInput'&&e.target.files?.[0])importPrivatePlayers(e.target.files[0]);});
  modal.addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop'))modal.hidden=true;});
  document.getElementById('quickCoachBtn').addEventListener('click',()=>openCoach(state.currentMatch?'Mi-temps':'Motiver'));

  // Important sur iPhone : le calcul repose sur les timestamps, pas sur setInterval.
  // L'OS peut suspendre la page pendant un appel/SMS ; au retour le temps est recalculé correctement.
  window.addEventListener('pagehide',save);
  document.addEventListener('visibilitychange',()=>{
    save();
    if(document.visibilityState==='visible'){
      if(isAssistantMode()){
        window.RCSQLive?.heartbeatGuestPresence?.();
        window.RCSQLive?.refreshGuestState?.().finally(()=>updateAssistantView());
      }else render();
      if(state.currentMatch?.running)requestWakeLock();
    }
  });
  window.addEventListener('online',()=>{
    if(isAssistantMode()){
      window.RCSQLive?.heartbeatGuestPresence?.();
      window.RCSQLive?.refreshGuestState?.().finally(()=>updateAssistantView());
    }else render();
    showToast('Connexion rétablie');
  });
  window.addEventListener('offline',()=>{if(isAssistantMode())updateAssistantView();else render();showToast('Connexion internet perdue');});

  if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
  render();
  autoRecoverIfNeeded();
  persistEmergencyBackupNow();
  if(window.RCSQLive){window.RCSQLive.start(onCloudChange,applyCloudAggregate).catch?.(()=>{});}
})();
