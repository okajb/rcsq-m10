/* RCSQ M10 - statistiques en direct. Authentification obligatoire, Firestore protégé par règles.
   Le cloud ne reçoit NI portraits, NI noms de famille, NI dates de naissance, NI licences FFR. */
(() => {
 'use strict';
 const cfg = window.RCSQ_CLOUD_CONFIG || {};
 const TEAM = 'rcsq-m10';
 const BASE = ['teams',TEAM];
 let firebaseApp, authMod, fsMod, auth, database;
 let user = null, role = null, ready = false, lastError = '';
 let unsubscribeMatches = null, unsubscribeAuth = null;
 let changeCallback = () => {}, updateCallback = () => {};
 const listeners = new Map(), matches = new Map(), matchEvents = new Map(), scores = new Map();
 const configurationValid = Boolean(cfg.enabled && cfg.apiKey && cfg.projectId && cfg.authDomain && cfg.appId);
 const cleanStat = st => {
  const output = {};
  for(const [pid,s] of Object.entries(st || {})) {
   if(!/^[a-zA-Z0-9_-]{1,180}$/.test(pid)) continue;
   const item={};
   for (const key of ['try','tackle','assist','support','steal']) {
    const v = Number(s?.[key]);if(Number.isFinite(v) && v>=0) item[key]=Math.min(10000,Math.floor(v));
   }
   output[pid] = item;
  }
  return output;
 };
 const asInt = x => Number.isFinite(Number(x)) ? Math.max(0,Math.min(100000,Math.floor(Number(x)))) : 0;
 const notify = () => {try {changeCallback()}catch(e){console.warn('Cloud display',e)}};
 const fail = err => {lastError = (err && err.message) || String(err);notify();};
 function clearListeners() {
  if(unsubscribeMatches) {unsubscribeMatches();unsubscribeMatches=null;}
  for(const off of listeners.values())off();listeners.clear();
  matches.clear();matchEvents.clear();scores.clear();notify();
 }
 function docForMatch(id) {return fsMod.doc(database,...BASE,'matches',id)}
 function eventsForMatch(id){return fsMod.collection(database,...BASE,'matches',id,'events')}
 function aggregate(match,eventList) {
  const result={homeScore:asInt(match.homeScore),awayScore:asInt(match.awayScore),stats:cleanStat(match.stats)};
  for (const event of eventList) {
   if(!event || ![-1,1].includes(event.delta))continue;
   if(event.kind==='score' && ['home','away'].includes(event.side)) {
    const key=event.side==='home'?'homeScore':'awayScore';result[key]+=event.delta;
   } else if(event.kind==='stat' && ['try','tackle','assist','support','steal'].includes(event.stat)) {
    const id=String(event.playerId||'');if(!match.roster?.some(p=>p.id===id))continue;
    const stats=result.stats[id]||{};stats[event.stat]=(Number(stats[event.stat])||0)+event.delta;result.stats[id]=stats;
    if(event.stat==='try')result.homeScore+=event.delta;
   }
  }
  result.homeScore=Math.max(0,result.homeScore);result.awayScore=Math.max(0,result.awayScore);
  for(const entry of Object.values(result.stats))for(const key of Object.keys(entry))entry[key]=Math.max(0,entry[key]);
  return result;
 }
 function rebuildMatch(id) {
  const match=matches.get(id),eventList=matchEvents.get(id);
  if(!match||!eventList)return;
  const result=aggregate(match,eventList);scores.set(id,result);
  try{updateCallback(id,result)}catch(e){console.warn('Cloud update',e)}
  notify();
 }
 function observeMatches(){
  if(unsubscribeMatches){unsubscribeMatches();unsubscribeMatches=null}
  unsubscribeMatches=fsMod.onSnapshot(fsMod.collection(database,...BASE,'matches'),snapshot=>{
   const fresh=new Set();
   for(const doc of snapshot.docs){
    const id=doc.id;fresh.add(id);matches.set(id,doc.data());
    if(!listeners.has(id)){
     const unsub=fsMod.onSnapshot(eventsForMatch(id),events=>{
      matchEvents.set(id,events.docs.map(x=>x.data()));rebuildMatch(id);
     },fail);
     listeners.set(id,unsub);
    }else rebuildMatch(id);
   }
   for(const id of [...matches.keys()])if(!fresh.has(id)){
    matches.delete(id);matchEvents.delete(id);scores.delete(id);
    const unsub=listeners.get(id);if(unsub)unsub();listeners.delete(id);
   }
   notify();
  },fail);
 }
 async function start(onChange,onUpdate){
  changeCallback=onChange||(()=>{});updateCallback=onUpdate||(()=>{});
  if(!configurationValid){notify();return;}
  try{
   const root='https://www.gstatic.com/firebasejs/11.10.0/';
   const modules=await Promise.all(['firebase-app.js','firebase-auth.js','firebase-firestore.js'].map(x=>import(root+x)));
   firebaseApp=modules[0];authMod=modules[1];fsMod=modules[2];
   const app=firebaseApp.initializeApp({apiKey:cfg.apiKey,authDomain:cfg.authDomain,projectId:cfg.projectId,appId:cfg.appId});
   auth=authMod.getAuth(app);database=fsMod.getFirestore(app);ready=true;
   unsubscribeAuth=authMod.onAuthStateChanged(auth,async u=>{
    clearListeners();user=u;role=null;lastError='';
    if(u){
     try{
      const profile=await fsMod.getDoc(fsMod.doc(database,...BASE,'members',u.uid));
      role=['admin','assistant'].includes(profile.data()?.role)?profile.data().role:null;
      if(role)observeMatches();
     }catch(e){fail(e)}
    }
    notify();
   },fail);
  }catch(e){fail(e)}
 }
 async function login(email,password){
  if(!ready)throw Error('Connexion Firebase indisponible. Vérifie la configuration et le réseau.');
  await authMod.signInWithEmailAndPassword(auth,String(email).trim(),password);
 }
 async function logout(){if(!ready)return;await authMod.signOut(auth)}
 async function publish(match,players) {
  if(!ready||role!=='admin')throw Error('Seul un administrateur connecté peut partager un mini-match.');
  if(matches.has(match.id))throw Error('Ce mini-match est déjà partagé en direct.');
  // Only a first name + opaque local ID is shared for each player, never private profile fields.
  const roster=players.slice(0,30).map(p=>({id:String(p.id).slice(0,180),firstName:String(p.firstName||'?').slice(0,80)}));
  const payload={title:String(match.title||'Mini-match').slice(0,120),opponent:String(match.opponent||'Adversaire').slice(0,120),date:String(match.date||'').slice(0,10),format:[5,7].includes(match.format)?match.format:5,
   roster,homeScore:asInt(match.homeScore),awayScore:asInt(match.awayScore),stats:cleanStat(match.stats),createdBy:user.uid,createdAt:fsMod.serverTimestamp()};
  await fsMod.setDoc(docForMatch(match.id),payload);
 }
 async function record(matchId,event){
  if(!ready||!role||!user)throw Error('Connecte-toi avec ton compte autorisé pour saisir des statistiques en direct.');
  if(!navigator.onLine)throw Error('Connexion Internet nécessaire pour la saisie en direct.');
  if(!matches.has(matchId))throw Error('Mini-match non partagé : active d’abord le mode direct.');
  const eventData={actor:user.uid,createdAt:fsMod.serverTimestamp(),kind:event.kind,delta:event.delta===-1?-1:1};
  if(event.kind==='score'){
   if(!['home','away'].includes(event.side))throw Error('Équipe inconnue.');eventData.side=event.side;
  }else if(event.kind==='stat'){
   if(!['try','tackle','assist','support','steal'].includes(event.stat))throw Error('Statistique inconnue.');
   const playerId=String(event.playerId);
   if(!matches.get(matchId).roster?.some(p=>p.id===playerId))throw Error('Joueur inconnu pour ce match.');
   eventData.playerId=playerId;eventData.stat=event.stat;
  }else throw Error('Événement inconnu.');
  await fsMod.addDoc(eventsForMatch(matchId),eventData);
 }
 window.RCSQLive={start,login,logout,publish,record,
  get configured(){return configurationValid},get ready(){return ready},get role(){return role},get email(){return user?.email||''},get signedIn(){return !!user},get error(){return lastError},
  get matches(){return [...matches.entries()].map(([id,data])=>({id,...data,score:scores.get(id)||{homeScore:asInt(data.homeScore),awayScore:asInt(data.awayScore),stats:cleanStat(data.stats)}})).sort((a,b)=>b.date.localeCompare(a.date))},
  hasMatch(id){return matches.has(id)}
 };
})();
