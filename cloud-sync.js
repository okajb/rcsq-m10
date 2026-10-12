/* RCSQ M10 V6 — mode stats parent en direct.
   Le cloud ne reçoit que : identifiant local, prénom, composition terrain,
   plaquages, essais et score. Jamais photo, nom de famille, naissance,
   n° de licence FFR ni note éducateur. */
(() => {
  'use strict';
  const cfg = window.RCSQ_CLOUD_CONFIG || {};
  const TEAM = 'rcsq-m10';
  const BASE = ['teams', TEAM];
  let appMod, authMod, fsMod, auth, db;
  let user = null, role = null, ready = false, lastError = '';
  let changeCallback = () => {}, updateCallback = () => {};
  let unsubscribeAuth = null, unsubscribeMatches = null, unsubscribeInvites = null;
  let guestExpiryTimer = null, guestMatchId = null, guestLivePollTimer = null;
  let pendingToken = (location.hash.match(/^#invite=([a-f0-9]{48})$/) || [])[1] || null;
  const listeners = new Map();
  const matches = new Map();
  const events = new Map();
  const scores = new Map();
  const liveStates = new Map();
  const invites = new Map();
  const configurationValid = Boolean(cfg.enabled && cfg.apiKey && cfg.projectId && cfg.authDomain && cfg.appId);

  const asInt = v => Number.isFinite(Number(v)) ? Math.max(0, Math.min(100000, Math.floor(Number(v)))) : 0;
  const cleanStats = raw => {
    const out = {};
    for (const [pid, s] of Object.entries(raw || {})) {
      if (!/^[A-Za-z0-9_-]{1,180}$/.test(pid)) continue;
      out[pid] = {try: asInt(s?.try), tackle: asInt(s?.tackle)};
    }
    return out;
  };
  const notify = () => { try { changeCallback(); } catch (e) { console.warn(e); } };
  const fail = err => { lastError = (err && err.message) || String(err); notify(); };
  const matchRef = id => fsMod.doc(db, ...BASE, 'matches', id);
  const eventCol = id => fsMod.collection(db, ...BASE, 'matches', id, 'events');
  const liveRef = id => fsMod.doc(db, ...BASE, 'matches', id, 'live', 'state');

  function aggregate(match, list) {
    const result = {homeScore:asInt(match?.homeScore), awayScore:asInt(match?.awayScore), stats:cleanStats(match?.stats)};
    for (const ev of list || []) {
      if (!ev || ![-1,1].includes(ev.delta)) continue;
      if (ev.kind === 'score' && ['home','away'].includes(ev.side)) {
        if (ev.side === 'home') result.homeScore += ev.delta;
        else result.awayScore += ev.delta;
      }
      if (ev.kind === 'stat' && ['try','tackle'].includes(ev.stat)) {
        const pid = String(ev.playerId || '');
        if (!match?.roster?.some(p => p.id === pid)) continue;
        result.stats[pid] ||= {try:0,tackle:0};
        result.stats[pid][ev.stat] = asInt(result.stats[pid][ev.stat]) + ev.delta;
        if (ev.stat === 'try') result.homeScore += ev.delta;
      }
    }
    result.homeScore = Math.max(0,result.homeScore);
    result.awayScore = Math.max(0,result.awayScore);
    for (const s of Object.values(result.stats)) {
      s.try = Math.max(0,asInt(s.try)); s.tackle = Math.max(0,asInt(s.tackle));
    }
    return result;
  }

  function rebuild(id) {
    const m = matches.get(id);
    if (!m) return;
    const result = aggregate(m, events.get(id) || []);
    scores.set(id, result);
    try { updateCallback(id, {...result, live:liveStates.get(id) || null}); } catch (e) { console.warn(e); }
    notify();
  }

  function clearListeners() {
    if (guestExpiryTimer) { clearTimeout(guestExpiryTimer); guestExpiryTimer = null; }
    if (guestLivePollTimer) { clearInterval(guestLivePollTimer); guestLivePollTimer = null; }
    if (unsubscribeMatches) { unsubscribeMatches(); unsubscribeMatches = null; }
    if (unsubscribeInvites) { unsubscribeInvites(); unsubscribeInvites = null; }
    for (const off of listeners.values()) { try { off(); } catch {} }
    listeners.clear(); matches.clear(); events.clear(); scores.clear(); liveStates.clear(); invites.clear();
  }

  function watchMatch(id, prefix='m') {
    if (!listeners.has(`${prefix}:match:${id}`)) {
      listeners.set(`${prefix}:match:${id}`, fsMod.onSnapshot(matchRef(id), snap => {
        if (!snap.exists()) return fail(Error('Match en direct introuvable.'));
        matches.set(id, snap.data()); rebuild(id);
      }, fail));
    }
    if (!listeners.has(`${prefix}:events:${id}`)) {
      listeners.set(`${prefix}:events:${id}`, fsMod.onSnapshot(eventCol(id), snap => {
        events.set(id, snap.docs.map(d => d.data())); rebuild(id);
      }, fail));
    }
    if (!listeners.has(`${prefix}:live:${id}`)) {
      listeners.set(`${prefix}:live:${id}`, fsMod.onSnapshot(liveRef(id), snap => {
        if (snap.exists()) liveStates.set(id, snap.data());
        else liveStates.delete(id);
        rebuild(id);
      }, fail));
    }
  }

  function guestAccessStopped() {
    clearListeners(); guestMatchId = null; role = 'guest-expired';
    lastError = 'Invitation terminée ou expirée. Demande un nouveau QR code au coach.';
    notify();
  }
  function watchGuestInvite(token) {
    const ref = fsMod.doc(db, ...BASE, 'invites', token);
    listeners.set('guest:invite', fsMod.onSnapshot(ref, snap => {
      if (!snap.exists() || !snap.data().active) return guestAccessStopped();
      if (guestExpiryTimer) clearTimeout(guestExpiryTimer);
      const remaining = snap.data().expiresAt.toMillis() - Date.now();
      if (remaining <= 0) return guestAccessStopped();
      guestExpiryTimer = setTimeout(guestAccessStopped, remaining + 1000);
    }, guestAccessStopped));
  }
  function sameLiveState(a,b) {
    const aa = a || null, bb = b || null;
    if (!aa && !bb) return true;
    if (!aa || !bb) return false;
    return JSON.stringify({lineup:aa.lineup||[],phase:aa.phase||'',active:aa.active,running:aa.running}) ===
           JSON.stringify({lineup:bb.lineup||[],phase:bb.phase||'',active:bb.active,running:bb.running});
  }
  function startGuestLivePolling(matchId) {
    if (guestLivePollTimer) clearInterval(guestLivePollTimer);
    // Filet de sécurité iPhone/Safari : même si un listener temps réel tarde,
    // on relit la composition toutes les 2 s pour que les changements du coach apparaissent.
    guestLivePollTimer = setInterval(async () => {
      if (role !== 'guest' || guestMatchId !== matchId || document.visibilityState === 'hidden') return;
      try {
        const snap = await fsMod.getDoc(liveRef(matchId));
        const next = snap.exists() ? snap.data() : null;
        const prev = liveStates.get(matchId) || null;
        if (!sameLiveState(prev,next)) {
          if (next) liveStates.set(matchId,next); else liveStates.delete(matchId);
          rebuild(matchId);
        }
      } catch (e) { console.warn('RCSQ live poll', e); }
    }, 2000);
  }
  function observeGuest(matchId, token) {
    guestMatchId = matchId;
    watchGuestInvite(token);
    watchMatch(matchId, 'guest');
    startGuestLivePolling(matchId);
  }
  function observeAdmin() {
    unsubscribeMatches = fsMod.onSnapshot(fsMod.collection(db, ...BASE, 'matches'), snap => {
      for (const d of snap.docs) { matches.set(d.id, d.data()); watchMatch(d.id, 'admin'); }
      notify();
    }, fail);
    unsubscribeInvites = fsMod.onSnapshot(fsMod.collection(db, ...BASE, 'invites'), snap => {
      invites.clear(); for (const d of snap.docs) invites.set(d.id, d.data()); notify();
    }, fail);
  }

  async function acceptInvite(token) {
    const invRef = fsMod.doc(db, ...BASE, 'invites', token);
    const snap = await fsMod.getDoc(invRef);
    if (!snap.exists() || !snap.data().active || snap.data().expiresAt.toMillis() <= Date.now()) throw Error('Invitation expirée ou révoquée.');
    const matchId = snap.data().matchId;
    await fsMod.setDoc(fsMod.doc(db, ...BASE, 'guests', user.uid), {token, matchId, joinedAt:fsMod.serverTimestamp()});
    pendingToken = null;
    if (location.hash.startsWith('#invite=')) history.replaceState(null,'',location.pathname + location.search);
    role = 'guest'; observeGuest(matchId, token); notify();
  }

  async function start(onChange,onUpdate) {
    changeCallback = onChange || (()=>{}); updateCallback = onUpdate || (()=>{});
    if (!configurationValid) { fail(Error('Configuration Firebase absente.')); return; }
    try {
      const root='https://www.gstatic.com/firebasejs/11.10.0/';
      [appMod,authMod,fsMod] = await Promise.all(['firebase-app.js','firebase-auth.js','firebase-firestore.js'].map(x=>import(root+x)));
      const app = appMod.initializeApp({apiKey:cfg.apiKey,authDomain:cfg.authDomain,projectId:cfg.projectId,appId:cfg.appId});
      auth = authMod.getAuth(app); db = fsMod.getFirestore(app); ready = true;
      try { await authMod.setPersistence(auth, authMod.browserLocalPersistence); } catch {}
      unsubscribeAuth = authMod.onAuthStateChanged(auth, async u => {
        clearListeners(); user = u; role = null; guestMatchId = null; lastError='';
        if (!u) { notify(); return; }
        try {
          const profile = await fsMod.getDoc(fsMod.doc(db, ...BASE, 'members', u.uid));
          role = ['admin','assistant'].includes(profile.data()?.role) ? profile.data().role : null;
          if (role) observeAdmin();
          else if (pendingToken) await acceptInvite(pendingToken);
          else {
            const grant = await fsMod.getDoc(fsMod.doc(db, ...BASE, 'guests', u.uid));
            if (grant.exists()) {
              const gd = grant.data();
              const inv = await fsMod.getDoc(fsMod.doc(db, ...BASE, 'invites', gd.token));
              if (inv.exists() && inv.data().active && inv.data().expiresAt.toMillis() > Date.now()) {
                role='guest'; observeGuest(gd.matchId, gd.token);
              }
            }
          }
        } catch (e) { fail(e); }
        notify();
      }, fail);
      if (pendingToken && !auth.currentUser) {
        try { await authMod.signInAnonymously(auth); }
        catch (e) { fail(Error('Active la connexion « Anonyme » dans Firebase Authentication : ' + e.message)); }
      }
    } catch (e) { fail(e); }
  }

  async function login(email,password) {
    if (!ready) throw Error('Connexion Firebase indisponible.');
    await authMod.signInWithEmailAndPassword(auth, String(email).trim(), String(password));
  }
  async function logout(){ if (ready) await authMod.signOut(auth); }

  async function publish(match, players) {
    if (!ready || role !== 'admin') throw Error('Connecte-toi avec le compte coach administrateur.');
    const ref = matchRef(match.id);
    const existing = await fsMod.getDoc(ref);
    if (existing.exists()) { matches.set(match.id, existing.data()); return; }
    const roster = players.slice(0,30).map(p=>({id:String(p.id).slice(0,180),firstName:String(p.firstName||'?').slice(0,80)}));
    const stats = {};
    for (const p of roster) {
      const src = match.stats?.[p.id] || {};
      stats[p.id] = {try:asInt(src.try), tackle:asInt(src.tackle)};
    }
    await fsMod.setDoc(ref, {
      title:String(match.title||'Match').slice(0,120), opponent:String(match.opponent||'Adversaire').slice(0,120),
      date:String(match.date||'').slice(0,10), format:[5,7].includes(match.format)?match.format:5,
      roster, homeScore:asInt(match.homeScore), awayScore:asInt(match.awayScore), stats,
      createdBy:user.uid, createdAt:fsMod.serverTimestamp()
    });
  }

  async function setLiveState(matchId, live) {
    if (!ready || role !== 'admin') throw Error('Seul le coach peut modifier les joueurs sur le terrain.');
    const lineup = Array.isArray(live.lineup) ? live.lineup.slice(0,7).map(String) : [];
    await fsMod.setDoc(liveRef(matchId), {
      lineup, phase:String(live.phase||'Match').slice(0,40), active:Boolean(live.active), running:Boolean(live.running), updatedAt:fsMod.serverTimestamp()
    }, {merge:true});
  }

  async function createInvite(matchId) {
    if (!ready || role !== 'admin') throw Error('Connecte-toi avec le compte coach.');
    const match = await fsMod.getDoc(matchRef(matchId));
    if (!match.exists()) throw Error('Le match doit être partagé avant de créer le QR.');
    const random = new Uint8Array(24); crypto.getRandomValues(random);
    const token = Array.from(random,x=>x.toString(16).padStart(2,'0')).join('');
    const expiry = fsMod.Timestamp.fromMillis(Date.now() + 8*60*60*1000);
    await fsMod.setDoc(fsMod.doc(db, ...BASE, 'invites', token), {matchId,active:true,createdAt:fsMod.serverTimestamp(),createdBy:user.uid,expiresAt:expiry});
    return location.origin + location.pathname + '#invite=' + token;
  }
  async function revokeInvite(token) {
    if (!ready || role !== 'admin') return;
    if (!token) return;
    await fsMod.updateDoc(fsMod.doc(db, ...BASE, 'invites', token), {active:false});
  }

  async function record(matchId,event) {
    if (!ready || !role || !user) throw Error('Connexion en direct indisponible.');
    if (!navigator.onLine) throw Error('Internet est nécessaire pour les statistiques en direct.');
    const snap = matches.get(matchId) || (await fsMod.getDoc(matchRef(matchId))).data();
    if (!snap) throw Error('Match non partagé.');
    const ev = {actor:user.uid,createdAt:fsMod.serverTimestamp(),kind:event.kind,delta:event.delta===-1?-1:1};
    if (event.kind === 'score') {
      if (!['home','away'].includes(event.side)) throw Error('Équipe inconnue.');
      if (role === 'guest' && event.side !== 'away') throw Error('Le parent peut uniquement ajouter les essais adverses.');
      ev.side=event.side;
    } else if (event.kind === 'stat') {
      if (!['try','tackle'].includes(event.stat)) throw Error('Statistique inconnue.');
      const pid=String(event.playerId||'');
      if (!snap.roster?.some(p=>p.id===pid)) throw Error('Joueur inconnu.');
      ev.playerId=pid; ev.stat=event.stat;
    } else throw Error('Événement inconnu.');
    await fsMod.addDoc(eventCol(matchId), ev);
  }

  async function getSummary(matchId) {
    if (!ready) return null;
    const [mSnap,eSnap,lSnap] = await Promise.all([fsMod.getDoc(matchRef(matchId)),fsMod.getDocs(eventCol(matchId)),fsMod.getDoc(liveRef(matchId))]);
    if (!mSnap.exists()) return null;
    const result = aggregate(mSnap.data(), eSnap.docs.map(d=>d.data()));
    return {...result, live:lSnap.exists()?lSnap.data():null};
  }

  window.RCSQLive = {
    start, login, logout, publish, setLiveState, createInvite, revokeInvite, record, getSummary,
    get configured(){return configurationValid;}, get ready(){return ready;}, get role(){return role;}, get email(){return user?.email||'';},
    get signedIn(){return !!user;}, get error(){return lastError;}, get invitePending(){return !!pendingToken;}, get guestMatchId(){return guestMatchId;},
    get matches(){return [...matches.entries()].map(([id,m])=>({id,...m,score:scores.get(id)||aggregate(m,[]),live:liveStates.get(id)||null}));},
    get invites(){return [...invites.entries()].map(([id,data])=>({id,...data}));}, hasMatch(id){return matches.has(id);}
  };
})();
