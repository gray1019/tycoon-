'use strict';
const $ = s => document.querySelector(s), TW = 64, TH = 32, KEY = 'infinite-tycoon-v3', MAXL = 5;
const DIR = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const D = {
  dropper: { n: 'Spark Dropper', t: 'drop', p: 50, c: '#ff9a3c', rate: 1, val: 2, d: '1 part/sec worth $2' },
  rapid: { n: 'Rapid Dropper', t: 'drop', p: 300, c: '#3de0ff', rate: 2, val: 5, d: '2 parts/sec worth $5' },
  press: { n: 'Heavy Press', t: 'drop', p: 1400, c: '#ff4fa3', rate: .8, val: 30, d: '0.8 parts/sec worth $30' },
  polish: { n: 'Polisher', t: 'up', p: 120, c: '#b36bff', mul: 1.5, d: 'Parts passing through ×1.5' },
  coater: { n: 'Quantum Coater', t: 'up', p: 700, c: '#5af0b0', mul: 2.5, d: 'Parts passing through ×2.5' },
  belt: { n: 'Conveyor', t: 'belt', p: 10, c: '#7d8be8', spd: 1.5, d: 'Carries parts the way it points' },
  turbo: { n: 'Turbo Conveyor', t: 'belt', p: 60, c: '#27e0b0', spd: 3, d: 'Twice as fast' },
  sell: { n: 'Sell Pad', t: 'sell', p: 0, c: '#3d8bff', pay: 1, d: 'Sells parts at face value' },
  vault: { n: 'Gold Exchange', t: 'sell', p: 900, c: '#ffcf4a', pay: 1.6, d: 'Pays 1.6× per part' }
};
// Extra machines unlock at rebirth tiers. Their escalating prices slow early snowballing.
Object.assign(D, {
  rotor: { n: 'Rotor Dropper', t: 'drop', p: 6500, c: '#f3df4c', rate: 1.4, val: 95, d: '1.4 parts/sec worth $95' },
  magma: { n: 'Magma Foundry', t: 'drop', p: 28000, c: '#ff624f', rate: .7, val: 520, d: '0.7 parts/sec worth $520' },
  prism: { n: 'Prism Fabricator', t: 'drop', p: 140000, c: '#84a9ff', rate: 1.1, val: 2400, d: '1.1 parts/sec worth $2.4K', tier: 1 },
  starforge: { n: 'Starforge', t: 'drop', p: 900000, c: '#fb83ec', rate: .65, val: 18000, d: '0.65 parts/sec worth $18K', tier: 2 },
  ion: { n: 'Ion Accelerator', t: 'drop', p: 8500000, c: '#69f6ff', rate: 1.3, val: 125000, d: '1.3 parts/sec worth $125K', tier: 3 },
  flux: { n: 'Flux Array', t: 'up', p: 5200, c: '#ff6cbd', mul: 4, d: 'Parts passing through ×4' },
  nova: { n: 'Nova Crucible', t: 'up', p: 42000, c: '#ff885f', mul: 7, d: 'Parts passing through ×7' },
  singularity: { n: 'Singularity Gate', t: 'up', p: 360000, c: '#9b83ff', mul: 12, d: 'Parts passing through ×12', tier: 1 },
  fractal: { n: 'Fractal Engine', t: 'up', p: 3200000, c: '#7cffc6', mul: 20, d: 'Parts passing through ×20', tier: 2 },
  chronos: { n: 'Chronos Lens', t: 'up', p: 36000000, c: '#f5df72', mul: 35, d: 'Parts passing through ×35', tier: 3 },
  hyperbelt: { n: 'Hyper Belt', t: 'belt', p: 900, c: '#ff6a9d', spd: 4.5, d: 'Carries parts at 4.5 tiles/sec' },
  phasebelt: { n: 'Phase Conveyor', t: 'belt', p: 38000, c: '#9b83ff', spd: 7, d: 'Carries parts at 7 tiles/sec', tier: 1 },
  prismvault: { n: 'Prism Exchange', t: 'sell', p: 18000, c: '#89b8ff', pay: 2.4, d: 'Pays 2.4× per part' },
  voidsell: { n: 'Void Exchange', t: 'sell', p: 220000, c: '#bc78ff', pay: 4, d: 'Pays 4× per part', tier: 1 }
});
Object.assign(D, {
  ember: { n: 'Ember Dropper', t: 'drop', p: 160, c: '#ff7a45', rate: 1.5, val: 2.6 },
  bolt: { n: 'Bolt Coil', t: 'drop', p: 3200, c: '#ffe14a', rate: 1.8, val: 40 },
  nebula: { n: 'Nebula Forge', t: 'drop', p: 62000, c: '#c07bff', rate: .9, val: 1100 },
  quasar: { n: 'Quasar Core', t: 'drop', p: 75000000, c: '#7dfcff', rate: 1, val: 800000, tier: 4 },
  lens: { n: 'Focus Lens', t: 'up', p: 300, c: '#7fd0ff', mul: 1.8 },
  arc: { n: 'Arc Reactor', t: 'up', p: 14000, c: '#ffd45f', mul: 5.5 },
  mint: { n: 'Mint Exchange', t: 'sell', p: 4000, c: '#6fe3a0', pay: 1.9 },
  split: { n: 'Splitter', t: 'split', p: 40, c: '#f5f7ff', spd: 2.5, d: 'Sends parts forward, left, right in turn' }
});
Object.assign(D, {
  cinder: { n: 'Cinder Hopper', t: 'drop', p: 700, c: '#ff8f5c', rate: 1.2, val: 12 },
  tesla: { n: 'Tesla Spire', t: 'drop', p: 14000, c: '#7fe8ff', rate: 1.5, val: 150 },
  forge: { n: 'Titan Forge', t: 'drop', p: 200000, c: '#ffb347', rate: .6, val: 5500, tier: 1 },
  helix: { n: 'Helix Weaver', t: 'drop', p: 1200000, c: '#7bffa0', rate: 1.2, val: 12000, tier: 2 },
  pulsar: { n: 'Pulsar Engine', t: 'drop', p: 14000000, c: '#b6a0ff', rate: 1.4, val: 90000, tier: 3 },
  omega: { n: 'Omega Core', t: 'drop', p: 600000000, c: '#ff5fd2', rate: 1.1, val: 4000000, tier: 5 }
});
CS = '$';
const STY = { rapid: 1, rotor: 1, press: 2, magma: 2, bolt: 3, nebula: 4, prism: 4, starforge: 5, ion: 6, quasar: 7, tesla: 8, forge: 2, helix: 9, pulsar: 3, omega: 5 };
/* Difficulty pass: pricier droppers, weaker upgraders, pricier exchanges. */
for (const k in D) {
  const d = D[k]; d.s = STY[k] || 0;
  if (d.t === 'drop') { d.p = Math.round(d.p * 2.2); d.val *= .8; d.d = d.rate + ' parts/sec · ' + fmt(d.val) + ' each'; }
  if (d.t === 'up') { d.p = Math.round(d.p * 3.2); d.mul = 1 + (d.mul - 1) * .55; d.d = 'Parts passing through ×' + d.mul.toFixed(2); }
  if (d.t === 'sell') { d.p = Math.round(d.p * 2.2); d.d = 'Pays ' + d.pay + '× · floods if you feed it too fast'; }
  if (d.t === 'belt') d.d = 'Carries parts ' + d.spd + ' tiles/sec';
}
Object.assign(D, {
  beacon: { n: 'Value Beacon', t: 'misc', p: 1200, c: '#c8ff5a', fx: 'val', amt: .2 },
  trade: { n: 'Trade Post', t: 'misc', p: 1500, c: '#ffcf4a', fx: 'sell', amt: .2 },
  servo: { n: 'Servo Hub', t: 'misc', p: 1800, c: '#3de0ff', fx: 'rate', amt: .2 },
  magnet: { n: 'Magnet Coil', t: 'misc', p: 600, c: '#ff5f6d', fx: 'belt', amt: .3 },
  cloner: { n: 'Cloner', t: 'misc', p: 6000, c: '#ff6cbd', fx: 'dupe', amt: .15 },
  dice: { n: 'Lucky Dice', t: 'misc', p: 7000, c: '#b36bff', fx: 'luck', amt: .12 },
  coolant: { n: 'Coolant Tank', t: 'misc', p: 2500, c: '#7fd0ff', fx: 'cool', amt: 1 },
  bank: { n: 'Interest Bank', t: 'misc', p: 20000, c: '#6fe3a0', fx: 'bank', amt: 0 },
  reactor: { n: 'Alloy Reactor', t: 'misc', p: 90000, c: '#a5ff3d', fx: 'val', amt: .5, tier: 1 },
  auction: { n: 'Auction House', t: 'misc', p: 110000, c: '#ffb03a', fx: 'sell', amt: .5, tier: 1 },
  core: { n: 'Servo Core', t: 'misc', p: 100000, c: '#4ff0ff', fx: 'rate', amt: .5, tier: 1 }
});
const FXT = { val: 'part value', sell: 'sell payout', rate: 'dropper speed', belt: 'belt speed' };
for (const k in D) if (D[k].t === 'misc') { const d = D[k], a = Math.round(d.amt * 100); d.d = FXT[d.fx] ? 'Within 2 tiles: +' + a + '% ' + FXT[d.fx] : d.fx === 'dupe' ? 'Droppers within 2 tiles: ' + a + '% chance of a double part' : d.fx === 'luck' ? 'Sell pads within 2 tiles: ' + a + '% chance to pay ×3' : d.fx === 'cool' ? 'Droppers within 2 tiles never break down' : 'Pays 0.05% of your cash each second (max 25% of income)'; }
var CS = '$';
const WN = ['The Foundry', 'Crystal Reach', 'Void Station'], CUR = ['$', '◆', '◈'], CNAME = ['Cash', 'Gems', 'Void'], START = [150, 300, 1500], UNL = [0, 6e8, 1.5e8], UREB = [0, 2, 3], STARTER = ['dropper', 'shard', 'mote'];
const WD = ['Your original factory. Earns cash, and it is the only place to rebirth.', 'Earns gems. Everything you earn here boosts Foundry income. All new droppers.', 'Earns void energy. Boosts both the Foundry and Crystal Reach.'];
const WBG = [['#232a5c', '#12142a'], ['#1a4e5c', '#0b1e26'], ['#3a2370', '#100a22']];
['nova', 'singularity', 'fractal', 'chronos', 'vault', 'mint', 'prismvault', 'voidsell'].forEach(k => D[k].w = [0]);
for (const k in D) if (D[k].t === 'drop' && !D[k].w) D[k].w = [0];
Object.assign(D, {
  shard: { n: 'Shard Dropper', t: 'drop', p: 100, c: '#5af0ff', rate: 1.2, val: 3, s: 0, w: [1] },
  geode: { n: 'Geode Press', t: 'drop', p: 900, c: '#4fd6a0', rate: .8, val: 28, s: 2, w: [1] },
  lattice: { n: 'Lattice Spinner', t: 'drop', p: 8000, c: '#8fb4ff', rate: 1.5, val: 90, s: 1, w: [1] },
  gemreactor: { n: 'Gem Reactor', t: 'drop', p: 70000, c: '#ff7ad9', rate: 1, val: 800, s: 5, w: [1] },
  heart: { n: 'Heart Crystal', t: 'drop', p: 600000, c: '#ff5f8a', rate: .8, val: 8500, s: 4, w: [1] },
  facet: { n: 'Facet Cutter', t: 'up', p: 3000, c: '#9ff4ff', mul: 3, w: [1] },
  resonator: { n: 'Resonator', t: 'up', p: 60000, c: '#ffd0f5', mul: 8, w: [1] },
  gemmart: { n: 'Gem Market', t: 'sell', p: 5000, c: '#5af0ff', pay: 2, w: [1] },
  mote: { n: 'Mote Dropper', t: 'drop', p: 500, c: '#b890ff', rate: 1.3, val: 10, s: 0, w: [2] },
  rift: { n: 'Rift Emitter', t: 'drop', p: 6000, c: '#ff6adf', rate: 1, val: 110, s: 6, w: [2] },
  entropy: { n: 'Entropy Coil', t: 'drop', p: 60000, c: '#6affc8', rate: 1.6, val: 600, s: 3, w: [2] },
  darkforge: { n: 'Dark Matter Forge', t: 'drop', p: 600000, c: '#9a6bff', rate: .9, val: 7000, s: 2, w: [2] },
  horizon: { n: 'Event Horizon', t: 'drop', p: 8000000, c: '#ffffff', rate: 1, val: 90000, s: 7, w: [2] },
  warp: { n: 'Warp Gate', t: 'up', p: 12000, c: '#c49bff', mul: 4, w: [2] },
  hlens: { n: 'Horizon Lens', t: 'up', p: 500000, c: '#ffe27a', mul: 12, w: [2] },
  voidvault: { n: 'Void Vault', t: 'sell', p: 20000, c: '#b890ff', pay: 2.5, w: [2] },
  opal: { n: 'Opal Drill', t: 'drop', p: 250, c: '#ffd0e8', rate: 1, val: 7, s: 0, w: [1] },
  quartz: { n: 'Quartz Tower', t: 'drop', p: 3000, c: '#c9f3ff', rate: 1.3, val: 45, s: 8, w: [1] },
  amethyst: { n: 'Amethyst Loom', t: 'drop', p: 24000, c: '#b98cff', rate: 1.2, val: 280, s: 9, w: [1] },
  sapphire: { n: 'Sapphire Vault', t: 'drop', p: 200000, c: '#4f8cff', rate: .9, val: 2600, s: 4, w: [1] },
  diamond: { n: 'Diamond Core', t: 'drop', p: 3000000, c: '#e8fbff', rate: 1, val: 30000, s: 5, w: [1] },
  umbra: { n: 'Umbra Pump', t: 'drop', p: 1500, c: '#8a6bd6', rate: 1.2, val: 25, s: 0, w: [2] },
  tendril: { n: 'Tendril Reactor', t: 'drop', p: 22000, c: '#5af0a0', rate: 1.5, val: 200, s: 8, w: [2] },
  gravwell: { n: 'Gravity Well', t: 'drop', p: 250000, c: '#a6a0ff', rate: .9, val: 3600, s: 9, w: [2] },
  cosmos: { n: 'Cosmos Engine', t: 'drop', p: 3000000, c: '#ffb3f0', rate: 1, val: 40000, s: 7, w: [2] },
  aether: { n: 'Aether Heart', t: 'drop', p: 20000000, c: '#ffe9a8', rate: 1.3, val: 220000, s: 5, w: [2] }
});
// Crystal Reach and Void Station machines cost more and upgraders are weaker there too.
for (const k in D) { const d = D[k]; if (!d.w || !d.w[0]) continue; const wm = d.w[0] === 1 ? 3 : 4; d.p = Math.round(d.p * wm * (d.t === 'up' ? 1.5 : 1)); if (d.t === 'drop') d.val *= .8; if (d.t === 'up') d.mul = 1 + (d.mul - 1) * .55; }
for (const k in D) if (D[k].w && D[k].w[0] > 0) { const d = D[k]; CS = CUR[d.w[0]]; d.d = d.t === 'drop' ? d.rate + ' parts/sec · ' + fmt(d.val) + ' each' : d.t === 'up' ? 'Parts passing through ×' + d.mul.toFixed(2) : 'Pays ' + d.pay + '× per part'; }
CS = '$';
const GROUPS = [['Droppers', ['dropper', 'ember', 'rapid', 'press', 'bolt', 'rotor', 'magma', 'nebula', 'prism', 'starforge', 'ion', 'quasar']], ['Upgraders', ['polish', 'lens', 'coater', 'flux', 'arc', 'nova', 'singularity', 'fractal', 'chronos']], ['Boosters', ['beacon', 'trade', 'servo', 'magnet', 'cloner', 'dice', 'coolant', 'bank', 'reactor', 'auction', 'core']], ['Belts & selling', ['belt', 'turbo', 'split', 'hyperbelt', 'phasebelt', 'sell', 'vault', 'mint', 'prismvault', 'voidsell']]];
GROUPS[0][1].push('shard', 'geode', 'lattice', 'gemreactor', 'heart', 'mote', 'rift', 'entropy', 'darkforge', 'horizon', 'cinder', 'tesla', 'forge', 'helix', 'pulsar', 'omega', 'opal', 'quartz', 'amethyst', 'sapphire', 'diamond', 'umbra', 'tendril', 'gravwell', 'cosmos', 'aether'); GROUPS[1][1].push('facet', 'resonator', 'warp', 'hlens'); GROUPS[3][1].push('gemmart', 'voidvault');
const LAB = [
  { id: 'val', n: 'Better alloys', d: '+8% part value per level', b: 500, g: 2.65, max: 12, e: .08 },
  { id: 'rate', n: 'Overclock', d: '+6% dropper speed per level', b: 850, g: 2.7, max: 12, e: .06 },
  { id: 'belt', n: 'Magnetic rails', d: '+7% belt speed per level', b: 400, g: 2.45, max: 10, e: .07 },
  { id: 'sell', n: 'Haggling', d: '+8% sell payout per level', b: 1000, g: 2.75, max: 12, e: .08 },
  { id: 'durability', n: 'Precision tooling', d: '+10% machine upgrade strength per level', b: 1800, g: 2.9, max: 8, e: .10 },
  { id: 'starting', n: 'Seed capital', d: '+$250 starting cash per rebirth level', b: 2, g: 2.2, max: 10, e: 250, currency: 'rp' },
  { id: 'rebirthBoost', n: 'Core resonance', d: '+5% cash multiplier per level', b: 3, g: 2.4, max: 10, e: .05, currency: 'rp' }
];
const PAL = ['#ffe08a', '#ff9a3c', '#ff5f6d', '#ff4fa3', '#b36bff', '#3de0ff', '#b6f542'];

const cv = $('#board');
let cx = cv.getContext('2d'), S, grid = {}, parts = [], fl = [];
let V = { s: 1, tx: 0, ty: 0, ox: 0, cw: 1, ch: 1, dpr: 1 };
let sel = null, rot = 0, hov = null, insp = null, T = 0, last = performance.now(), inc = 0, acc = 0, incT = 0, uiT = 0, saveT = 0, lastPlaced = '', toastT;
/* Camera: yaw = turn around the factory, el = elevation (30deg is the classic isometric look), z = zoom, px/py = pan in screen px. */
const QT = Math.PI / 2, EL0 = Math.PI / 6, CAM = { yaw: 0, tyaw: 0, el: EL0, tel: EL0, z: 1, px: 0, py: 0 };
let K = { c: 1, s: 0, qc: 1, qs: 0, gk: 1, zk: 1, ox: 0, oy: 0 };

/* ---------- state ---------- */
function fresh() { return { cash: 150, cols: 6, rows: 6, m: [], id: 1, lab: {}, sold: 0, earned: 0, rebirths: 0, rp: 0, w: 0, W: [null, null, null], unl: [true, false, false], life: [0, 0, 0] }; }
function reindex() { grid = {}; S.m.forEach(m => grid[m.x + ',' + m.y] = m); }
function add(k, x, y, r) { const m = { id: S.id++, k, x, y, rot: r, l: 1 }; S.m.push(m); reindex(); return m; }
function starter() { add(STARTER[S.w || 0], 0, 2, 0); add('belt', 1, 2, 0); add('belt', 2, 2, 0); add('belt', 3, 2, 0); add('sell', 4, 2, 0); }
function load() {
  S = fresh();
  try {
    const j = JSON.parse(localStorage.getItem(KEY));
    if (j && Array.isArray(j.m) && j.cols) { S = Object.assign(fresh(), j); S.m = S.m.filter(m => D[m.k]); S.rp = S.rp || 0; S.rebirths = S.rebirths || 0; reindex(); return; }
  } catch (e) { }
  starter();
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
addEventListener('beforeunload', save);
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

/* ---------- economy ---------- */
const STK = .55, RB = 1.75; // STK: every upgrader a part passes after the first keeps only this share (squared, cubed...) of its bonus. RB: cash multiplier per rebirth.
const ELITE = ['prism', 'starforge', 'ion', 'quasar', 'forge', 'helix', 'pulsar', 'omega', 'gemreactor', 'heart', 'sapphire', 'diamond', 'darkforge', 'horizon', 'gravwell', 'cosmos', 'aether'];
const lm = m => 1 + .3 * (m.l - 1);
const G = id => { const l = LAB.find(x => x.id === id); return 1 + l.e * (S.lab[id] || 0); };
const cashMult = () => { const L = S.life || [0, 0, 0], lg = x => Math.log10(1 + x), lb = 1 + .05 * (S.lab.rebirthBoost || 0); return lb * (S.w === 0 ? Math.pow(RB, S.rebirths || 0) * (1 + .15 * lg(L[1]) + .25 * lg(L[2])) : S.w === 1 ? 1 + .2 * lg(L[2]) : 1); };
const rateOf = m => D[m.k].rate * (1 + (lm(m) - 1) * G('durability')) * G('rate') * (1 + au(m, 'rate'));
const valOf = m => D[m.k].val * (1 + (lm(m) - 1) * G('durability')) * G('val') * cashMult() * (1 + au(m, 'val'));
const mulOf = m => 1 + (D[m.k].mul - 1) * (1 + (lm(m) - 1) * G('durability'));
const payOf = m => D[m.k].pay * (1 + (lm(m) - 1) * G('durability')) * G('sell') * (1 + au(m, 'sell'));
const spd = m => (D[m.k].spd ? D[m.k].spd * lm(m) * G('belt') : 1.5 * G('belt')) * (1 + au(m, 'belt'));
const upCost = m => Math.ceil(Math.max(D[m.k].p, 100) * 1.6 * Math.pow(2.8, m.l - 1));
const refund = m => { let s = D[m.k].p; for (let i = 1; i < m.l; i++) s += Math.ceil(Math.max(D[m.k].p, 60) * .9 * Math.pow(2, i - 1)); return Math.floor(s * .5); };
const labCost = l => Math.ceil(l.b * (l.currency === 'rp' ? 1 : 1.6) * Math.pow(l.g, S.lab[l.id] || 0));
const expCost = () => Math.ceil(4000 * Math.pow(3, S.cols - 6));
const rebirthCost = () => Math.ceil(1500000 * Math.pow(9, S.rebirths || 0));
const inW = k => !D[k].w || D[k].w.includes(S.w || 0);
const available = k => CH.tiers || !D[k].tier || (S.rebirths || 0) >= D[k].tier;
function fmt(n) { const u = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi']; let i = 0; while (n >= 1000 && i < u.length - 1) { n /= 1000; i++; } return CS + (i ? n.toFixed(n < 10 ? 2 : n < 100 ? 1 : 0) : Math.floor(n)) + u[i]; }
function statTxt(m) {
  const t = D[m.k].t;
  if (t === 'drop') return rateOf(m).toFixed(2) + ' parts/sec · ' + fmt(valOf(m)) + ' each';
  if (t === 'up') return 'Multiplies parts ×' + mulOf(m).toFixed(2) + ' (weaker when it is not the first upgrader a part meets)';
  if (t === 'belt') return 'Moves ' + spd(m).toFixed(1) + ' tiles/sec';
  if (t === 'misc') return D[m.k].d;
  if (t === 'split') return 'Alternates: forward, left, right';
  return 'Pays ' + (payOf(m) * (1 - Math.min(.7, m.sat || 0))).toFixed(2) + '× right now (floods when busy)';
}

/* ---------- twists: upgrader cap, events, breakdowns, contracts ---------- */
const upCap = () => 3 + Math.floor((S.cols - 6) / 4) + Math.floor((S.rebirths || 0) / 2), upCount = () => S.m.filter(m => D[m.k].t === 'up').length;
const dropCap = () => 4 + Math.floor((S.cols - 6) / 2) + (S.rebirths || 0), dropCount = () => S.m.filter(m => D[m.k].t === 'drop').length;
let AU = {};
const au = (m, f) => (AU[m.x + ',' + m.y] || {})[f] || 0;
const AC = { val: 1, sell: 1, rate: 1, belt: 1.5, dupe: .5, luck: .4 };
function auraCalc() { auraRaw(); for (const key in AU) for (const f in AU[key]) if (AC[f] != null && AU[key][f] > AC[f]) AU[key][f] = AC[f]; }
function auraRaw() {
  AU = {};
  for (const m of S.m) {
    const d = D[m.k]; if (d.t !== 'misc' || d.fx === 'bank') continue;
    const a = d.amt * (1 + (lm(m) - 1) * G('durability'));
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { const o = AU[(m.x + i) + ',' + (m.y + j)] || (AU[(m.x + i) + ',' + (m.y + j)] = {}); o[d.fx] = (o[d.fx] || 0) + a; }
  }
}
const miscCap = () => 2 + Math.floor((S.cols - 6) / 3) + Math.floor((S.rebirths || 0) / 3), miscCount = () => S.m.filter(m => D[m.k].t === 'misc').length;
const kindMax = k => D[k].t === 'up' || D[k].t === 'misc' ? 2 : ELITE.includes(k) ? 2 : Infinity;
function capWhy(k) {
  if (CH.nocap) return ''; const d = D[k];
  if (d.t === 'drop' && dropCount() >= dropCap()) return 'Dropper limit reached (' + dropCap() + '). Expand the floor or rebirth for more room';
  if (d.t === 'up' && upCount() >= upCap()) return 'Upgrader limit reached (' + upCap() + '). Expand the floor or rebirth for more';
  if (d.t === 'misc' && miscCount() >= miscCap()) return 'Booster limit reached (' + miscCap() + '). Expand the floor or rebirth for more';
  const km = kindMax(k); if (km < Infinity && S.m.filter(m => m.k === k).length >= km) return 'You can only run ' + km + ' ' + d.n + ' at a time';
  return '';
}
const capHit = k => !!capWhy(k);
const rep = m => Math.ceil(valOf(m) * rateOf(m) * 10);
const EV = [{ n: 'Market boom · sales ×1.6', s: 1.6, t: 25 }, { n: 'Recession · sales ×0.6', s: .6, t: 25 }, { n: 'Power surge · droppers ×1.5', r: 1.5, t: 20 }, { n: 'Brownout · droppers ×0.6', r: .6, t: 20 }, { n: 'Breakdown', b: 1 }];
let ev = null, evT = 45, Q = null, qT = 20;
const evS = () => ev && ev.s || 1, evR = () => ev && ev.r || 1;
function tick(dt) {
  for (const m of S.m) if (D[m.k].fx === 'bank') { const g = Math.min(S.cash * .0005, inc * .25) * dt * lm(m); S.cash += g; S.earned += g; acc += g; }
  evT -= dt;
  if (evT <= 0) {
    if (ev) { ev = null; evT = 45 + Math.random() * 45; }
    else {
      const e = EV[Math.random() * EV.length | 0];
      if (e.b) { const ds = S.m.filter(m => D[m.k].t === 'drop' && !(m.off > 0) && !au(m, 'cool')); if (ds.length > 1) { const m = ds[Math.random() * ds.length | 0]; m.off = 25; toast(D[m.k].n + ' broke down! Select it to repair'); } evT = 45 + Math.random() * 45; }
      else { ev = e; evT = e.t; toast(e.n); }
    }
  }
  if (Q) { Q.t -= dt; if (Q.t <= 0) { Q = null; qT = 20; toast('Contract expired'); } }
  else if ((qT -= dt) <= 0) {
    const ds = S.m.filter(m => D[m.k].t === 'drop');
    if (ds.length) { const min = Math.max(...ds.map(valOf)) * 2, need = 8 + 2 * S.rebirths; Q = { need, got: 0, t: 100, min, reward: need * min * 3 }; toast('New contract!'); } else qT = 5;
  }
}
/* ---------- simulation ---------- */
function step(dt) {
  auraCalc(); tick(dt);
  for (const m of S.m) {
    if (D[m.k].t === 'sell') m.sat = Math.max(0, (m.sat || 0) - dt * .35);
    if (D[m.k].t !== 'drop') continue;
    if (m.off > 0) { m.off -= dt; continue; }
    m.a = (m.a || 0) + dt * rateOf(m) * evR();
    let n = 0;
    while (m.a >= 1 && n < 3) { m.a -= 1; n++; if (parts.length < 500) { const [dx, dy] = DIR[m.rot]; parts.push({ x: m.x + .5 + dx * .49, y: m.y + .5 + dy * .49, v: valOf(m), id: m.id }); m.fl = 1; if (Math.random() < au(m, 'dupe') && parts.length < 500) parts.push({ x: m.x + .5 + dx * .25, y: m.y + .5 + dy * .25, v: valOf(m), id: m.id }); } }
    if (m.a > 3) m.a = 3;
    m.fl = Math.max(0, (m.fl || 0) - dt * 4);
  }
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i], m0 = grid[Math.floor(p.x) + ',' + Math.floor(p.y)], m = m0 && D[m0.k].t !== 'misc' ? m0 : null;
    if (!m) { p.lost = (p.lost || 0) + dt; if (p.lost > .5) parts.splice(i, 1); continue; }
    const d = D[m.k];
    if (m.id !== p.id) {
      p.id = m.id;
      if (d.t === 'up') { p.v *= 1 + (mulOf(m) - 1) * Math.pow(STK, p.n || 0); p.n = (p.n || 0) + 1; }
      if (d.t === 'split') p.dr = (m.rot + [0, 3, 1][m.n = ((m.n || 0) + 1) % 3]) % 4;
      if (d.t === 'sell') {
        const g = p.v * payOf(m) * (1 - Math.min(.7, m.sat || 0)) * evS() * (Math.random() < au(m, 'luck') ? 3 : 1); m.sat = (m.sat || 0) + .05;
        if (Q && p.v >= Q.min && ++Q.got >= Q.need) { S.cash += Q.reward; S.earned += Q.reward; toast('Contract complete! +' + fmt(Q.reward)); Q = null; qT = 15; }
        S.cash += g; S.earned += g; S.life[S.w || 0] += g; S.sold++; acc += g;
        fl.push({ x: m.x + .5, y: m.y + .5, t: 0, s: '+' + fmt(g) });
        parts.splice(i, 1); continue;
      }
    }
    if (d.t === 'sell') continue;
    const [dx, dy] = DIR[d.t === 'split' ? p.dr : m.rot], s = spd(m) * dt;
    p.x += dx * s; p.y += dy * s;
    if (dx) p.y += (m.y + .5 - p.y) * Math.min(1, dt * 10); else p.x += (m.x + .5 - p.x) * Math.min(1, dt * 10);
  }
  fl.forEach(f => f.t += dt); fl = fl.filter(f => f.t < 1);
}

/* ---------- iso drawing helpers ---------- */
const CLEAN_MODELS = false; // true = shorter models + colored tops
let ZK = 1;
function camCalc() {
  const c = Math.cos(CAM.yaw), s = Math.sin(CAM.yaw), k = ((Math.round(CAM.yaw / QT) % 4) + 4) % 4;
  K = { c, s, qc: [1, 0, -1, 0][k], qs: [0, 1, 0, -1][k], gk: 2 * Math.sin(CAM.el), zk: Math.cos(CAM.el) / Math.cos(EL0), ox: S.cols / 2, oy: S.rows / 2 };
}
function camStep(dt) {
  const k = Math.min(1, dt * 12);
  CAM.yaw += (CAM.tyaw - CAM.yaw) * k; CAM.el += (CAM.tel - CAM.el) * k;
  if (Math.abs(CAM.tyaw - CAM.yaw) < 1e-4) CAM.yaw = CAM.tyaw; if (Math.abs(CAM.tel - CAM.el) < 1e-4) CAM.el = CAM.tel;
}
// World (tile units) -> screen, turned around the middle of the floor by the camera yaw.
const P = (x, y, z = 0) => { const a = x - K.ox, b = y - K.oy, rx = a * K.c - b * K.s, ry = a * K.s + b * K.c; return [(rx - ry) * TW / 2, (rx + ry) * TH / 2 * K.gk - z * K.zk]; };
// Depth of a world point: bigger = closer to the viewer (used for painter's-algorithm sorting).
const dep = (x, y) => { const a = x - K.ox, b = y - K.oy; return a * (K.c + K.s) + b * (K.c - K.s); };
function poly(pts, fill, stroke) {
  cx.beginPath(); pts.forEach((p, i) => i ? cx.lineTo(p[0], p[1]) : cx.moveTo(p[0], p[1])); cx.closePath();
  cx.fillStyle = fill; cx.fill();
  if (stroke) { cx.strokeStyle = stroke; cx.lineWidth = 1; cx.stroke(); }
}
function sh(h, f) {
  if (CLEAN_MODELS && h.length === 4) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  const n = CLEAN_MODELS && h[0] === 'r' ? h.match(/\d+/g).reduce((a, v) => a * 256 + +v, 0) : parseInt(h.slice(1), 16), m = v => Math.max(0, Math.min(255, Math.round(f > 1 ? v + (255 - v) * (f - 1) : v * f)));
  return `rgb(${m(n >> 16)},${m(n >> 8 & 255)},${m(n & 255)})`;
}
function box(x, y, w, h, z0, z1, c) {
  z0 *= ZK; z1 *= ZK; const x1 = x + w, y1 = y + h, vx = K.c + K.s, vy = K.c - K.s;
  const face = (nx, ny, pts) => { const rx = nx * K.c - ny * K.s, ry = nx * K.s + ny * K.c; poly(pts, sh(c, Math.max(.45, Math.min(.9, .665 + .115 * (ry - rx)))), '#0003'); };
  if (vy > 1e-6) face(0, 1, [P(x, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x, y1, z1)]);
  else if (vy < -1e-6) face(0, -1, [P(x, y, z0), P(x1, y, z0), P(x1, y, z1), P(x, y, z1)]);
  if (vx > 1e-6) face(1, 0, [P(x1, y, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y, z1)]);
  else if (vx < -1e-6) face(-1, 0, [P(x, y, z0), P(x, y1, z0), P(x, y1, z1), P(x, y, z1)]);
  poly([P(x, y, z1), P(x1, y, z1), P(x1, y1, z1), P(x, y1, z1)], sh(c, 1.18), '#0003');
}
// A box laid along the tile edge that currently faces the camera (u0/len along the edge, v = depth into the tile).
function ebox(x, y, u0, len, v, th, z0, z1, c) {
  const a0 = u0 - .5, a1 = a0 + len, b0 = v - .5, b1 = b0 + th, w = (a, b) => [a * K.qc + b * K.qs, -a * K.qs + b * K.qc], p = w(a0, b0), q = w(a1, b1);
  box(x + .5 + Math.min(p[0], q[0]), y + .5 + Math.min(p[1], q[1]), Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1]), z0, z1, c);
}
function chev(x, y, r, c, z, sp) {
  const [dx, dy] = DIR[r], nx = -dy, ny = dx;
  cx.strokeStyle = c; cx.lineWidth = 2.5; cx.lineCap = 'round'; cx.lineJoin = 'round';
  for (let k = 0; k < 3; k++) {
    const t = ((k / 3 + T * sp * .35) % 1) - .5, qx = x + .5 + dx * t * .8, qy = y + .5 + dy * t * .8;
    cx.globalAlpha = 1 - Math.abs(t) * 1.4;
    const a = P(qx - dx * .1 + nx * .2, qy - dy * .1 + ny * .2, z), b = P(qx + dx * .12, qy + dy * .12, z), e = P(qx - dx * .1 - nx * .2, qy - dy * .1 - ny * .2, z);
    cx.beginPath(); cx.moveTo(a[0], a[1]); cx.lineTo(b[0], b[1]); cx.lineTo(e[0], e[1]); cx.stroke();
  }
  cx.globalAlpha = 1;
}
function glow(c, b, fn) { cx.shadowColor = c; cx.shadowBlur = b; fn(); cx.shadowBlur = 0; }

/* ---------- machine models ---------- */
function drawM(k, x, y, r, l, flash, m, ph) {
  const d = D[k], c = d.c, t = d.t, [dx, dy] = DIR[r], ax = dx !== 0, fr = dx * (K.c + K.s) + dy * (K.c - K.s) > 1e-6;
  const rails = col => { const a = [x, y, ax ? 1 : .1, ax ? .1 : 1], b = ax ? [x, y + .9, 1, .1] : [x + .9, y, .1, 1]; ((ax ? K.c - K.s : K.c + K.s) > 0 ? [a, b] : [b, a]).forEach(q => box(q[0], q[1], q[2], q[3], 6, 9, col)); };
  if ((t === 'belt' || t === 'up' || t === 'split') && ph !== 1) {
    box(x, y, 1, 1, 0, 6, k === 'turbo' ? '#2c4a5e' : '#2b3166');
    if (t === 'split') {
      box(x + .3, y + .3, .4, .4, 6, 14, sh(c, .8));
      [r, (r + 3) % 4, (r + 1) % 4].forEach(q => chev(x, y, q, '#9aa1d4', 15, 1));
    } else { chev(x, y, r, c, 6.5, d.spd ? d.spd / 1.5 : 1); rails(sh(c, t === 'up' ? .55 : .8)); }
  }
  if (t === 'up') {
    ZK = CLEAN_MODELS ? .72 : 1; let p1 = ax ? [x + .4, y] : [x, y + .4], p2 = ax ? [x + .4, y + .8] : [x + .8, y + .4]; if (dep(p1[0], p1[1]) > dep(p2[0], p2[1])) [p1, p2] = [p2, p1];
    if (ph !== 1) box(p1[0], p1[1], .2, .2, 9, 38, sh(c, .7));
    if (ph !== 0) { box(p2[0], p2[1], .2, .2, 9, 38, sh(c, .7)); glow(c, 12 + 5 * Math.sin(T * 4), () => box(ax ? x + .4 : x, ax ? y : y + .4, ax ? .2 : 1, ax ? 1 : .2, 38, 45, c)); }
    ZK = 1;
  }
  const txt = (q, z, col) => { const [tx, ty] = P(x + .5, y + .5, z * ZK); cx.fillStyle = col; cx.font = '800 15px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(q, tx, ty); };
  if (t === 'drop') {
    const b = 9, s = d.s, noz = () => box(x + .38 + dx * .34, y + .38 + dy * .34, .24, .24, 10, 18, '#0b0d22');
    box(x, y, 1, 1, 0, 6, '#2b3166'); box(x + .06, y + .06, .88, .88, 6, b, '#1a1e45');
    ZK = CLEAN_MODELS ? .62 : 1;
    if (!fr) noz();
    if (s === 0) { box(x + .2, y + .2, .6, .6, b, 34, c); box(x + .17, y + .17, .66, .66, b + 6, b + 10, sh(c, .55)); box(x + .12, y + .12, .76, .76, 34, 42, sh(c, .65)); if (k === 'ember') glow(c, 14, () => box(x + .38, y + .38, .24, .24, 42, 50 + 4 * Math.sin(T * 9), '#ffd36b')); }
    else if (s === 1) { box(x + .12, y + .12, .34, .76, b, 30, c); box(x + .54, y + .12, .34, .76, b, 30, c); box(x + .1, y + .4, .8, .2, 30, 37, sh(c, .65)); if (k === 'rotor') { const w = Math.sin(T * 9) > 0; box(w ? x + .05 : x + .4, w ? y + .4 : y + .05, w ? .9 : .2, w ? .2 : .9, 38, 41, '#d8dcff'); } }
    else if (s === 2) { box(x + .1, y + .1, .8, .8, b, 24, c); box(x + .08, y + .08, .84, .84, 24, 28, sh(c, .6)); box(x + .36, y + .36, .28, .28, 28, 34 + 8 * (.5 + .5 * Math.sin(T * 4)), '#d8dcff'); if (k === 'magma') glow(c, 12, () => box(x + .2, y + .2, .6, .6, 28, 30, '#ffd36b')); }
    else if (s === 3) { for (let i = 0; i < 4; i++) { const q = .1 + .07 * i; box(x + q, y + q, 1 - 2 * q, 1 - 2 * q, b + i * 9, b + i * 9 + 9, sh(c, 1 - .1 * i)); } glow(c, 12, () => box(x + .4, y + .4, .2, .2, b + 36, b + 42 + 4 * Math.sin(T * 12), '#fff')); }
    else if (s === 4) { const z = 32 + 4 * Math.sin(T * 2 + x + y); box(x + .15, y + .15, .7, .7, b, b + 4, sh(c, .6)); box(x + .38, y + .38, .24, .24, b + 4, z, sh(c, .6)); glow(c, 16, () => box(x + .25, y + .25, .5, .5, z, z + 18, c)); }
    else if (s === 5) { box(x + .12, y + .12, .76, .76, b, 20, c); box(x + .22, y + .22, .56, .56, 20, 28, sh(c, 1.1)); box(x + .34, y + .34, .32, .32, 28, 34, sh(c, 1.3)); glow(c, 14, () => box(x + .06, y + .06, .88, .88, b + 7, b + 10, sh(c, 1.5))); }
    else if (s === 6) { box(x + .15, y + .15, .7, .7, b, 24, sh(c, .8)); box(x + .1, y + .1, .8, .8, 24, 28, c); box(x + .3 + dx * .28, y + .3 + dy * .28, .4, .4, 28, 36, sh(c, 1.3)); glow(c, 10, () => box(x + .42, y + .42, .16, .16, 36, 40, '#fff')); }
    else if (s === 8) { box(x + .15, y + .15, .7, .7, b, 16, sh(c, .6)); box(x + .28, y + .28, .44, .44, 16, 28, sh(c, .8)); box(x + .4, y + .4, .2, .2, 28, 40, c); glow(c, 14, () => box(x + .36, y + .36, .28, .28, 40, 44 + 3 * Math.sin(T * 10), '#fff')); }
    else if (s === 9) { [.12, .4, .68].map((o, i) => [x + o, y + .35, i]).sort((a, b) => dep(a[0], a[1]) - dep(b[0], b[1])).forEach(([px, py, i]) => box(px, py, .2, .3, b, 26 + (i % 2) * 10, sh(c, .8 + .15 * i))); box(x + .1, y + .3, .8, .4, 36, 40, sh(c, .6)); glow(c, 12, () => box(x + .3, y + .4, .4, .2, 40, 44, c)); }
    else { box(x + .36, y + .36, .28, .28, b, 40, sh(c, .6)); const a = T * 2; [0, 3.14].forEach(o => glow(c, 12, () => box(x + .4 + .34 * Math.cos(a + o), y + .4 + .34 * Math.sin(a + o), .2, .2, 28 + 3 * Math.sin(a * 2), 38, c))); glow(c, 18, () => box(x + .4, y + .4, .2, .2, 40, 48, '#fff')); }
    {
      const zt = [42, k === 'rotor' ? 42 : 38, 46, 51, 54, 35, 41, 50, 50, 48][s], f = m ? Math.min(1, m.a || 0) : .65;
      if (f > .02) { const lh = Math.max(.6, 14 * f + (f < 1 ? .5 * Math.sin(T * 6) : 0)); glow(c, 8, () => box(x + .36, y + .36, .28, .28, zt + 1, zt + 1 + lh, c)); }
      cx.globalAlpha = .28; box(x + .31, y + .31, .38, .38, zt, zt + 15, '#e6f6ff'); cx.globalAlpha = 1;
      box(x + .29, y + .29, .42, .42, zt + 15, zt + 17, '#2b3166');
      if (flash > 0) { const u = Math.min(1, (1 - flash) * 3), z = 13 + (zt + 2 - 13) * flash * flash; glow(c, 10, () => box(x + .4 + dx * .4 * u, y + .4 + dy * .4 * u, .2, .2, z, z + 8, c)); }
    }
    if (fr) noz();
    if (flash > 0) glow(c, 16, () => box(x + .4 + dx * .34, y + .4 + dy * .34, .2, .2, 12, 14 + flash * 6, '#fff'));
    if (m && m.off > 0) { const [bx, by] = P(x + .5, y + .5, CLEAN_MODELS ? 40 : 62); cx.fillStyle = '#ff5f6d'; cx.font = '800 18px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('⚠ ' + Math.ceil(m.off), bx, by); }
    ZK = 1;
  }
  if (t === 'misc') {
    const f = d.fx, pl = Math.sin(T * 3), big = !!d.tier;
    box(x, y, 1, 1, 0, 6, '#2b3166'); box(x + .06, y + .06, .88, .88, 6, 9, '#1a1e45'); ZK = CLEAN_MODELS ? .62 : 1;
    if (f === 'val') { box(x + .3, y + .3, .4, .4, 9, 16, sh(c, .6)); box(x + .4, y + .4, .2, .2, 16, 40, sh(c, .7)); if (big) box(x + .15, y + .15, .7, .7, 24, 27, sh(c, .9)); glow(c, 14 + 6 * pl, () => box(x + .3, y + .3, .4, .4, 40, 48, c)); }
    else if (f === 'sell') { box(x + .14, y + .14, .72, .72, 9, 18, sh(c, .6)); box(x + .06, y + .06, .88, .88, 18, 22, c); box(x + .12, y + .12, .76, .76, 22, 26, sh(c, 1.2)); if (big) box(x + .3, y + .3, .4, .4, 26, 36, sh(c, .8)); txt('$', big ? 37 : 27, '#10142e'); }
    else if (f === 'rate') { box(x + .2, y + .2, .6, .6, 9, 22, sh(c, .6)); const w = Math.sin(T * 8) > 0; box(w ? x + .05 : x + .4, w ? y + .4 : y + .05, w ? .9 : .2, w ? .2 : .9, 22, 26, c); if (big) glow(c, 12, () => box(x + .35, y + .35, .3, .3, 26, 34, '#fff')); }
    else if (f === 'belt') { box(x + .15, y + .3, .2, .4, 9, 26, '#ff5f6d'); box(x + .65, y + .3, .2, .4, 9, 26, '#4f8cff'); box(x + .15, y + .3, .7, .4, 26, 32, '#cfd3ff'); }
    else if (f === 'dupe') { const o = .06 * pl; box(x + .1 - o, y + .3, .34, .4, 9, 22, c); box(x + .56 + o, y + .3, .34, .4, 9, 22, sh(c, .8)); glow(c, 10, () => box(x + .44, y + .44, .12, .12, 14, 18, '#fff')); }
    else if (f === 'luck') { const z = 12 + 4 * Math.abs(pl); box(x + .25, y + .25, .5, .5, z, z + 22, '#f4f6ff'); txt('★', z + 24, c); }
    else if (f === 'cool') { box(x + .18, y + .18, .64, .64, 9, 34, sh(c, .8)); box(x + .14, y + .14, .72, .72, 16, 19, '#fff'); box(x + .14, y + .14, .72, .72, 26, 29, '#fff'); box(x + .3, y + .3, .4, .4, 34, 40, sh(c, 1.2)); }
    else { box(x + .12, y + .12, .76, .76, 9, 26, sh(c, .7)); glow(c, 8 + 5 * pl, () => box(x + .3, y + .3, .4, .4, 26, 30, c)); txt('$', 31, c); }
    ZK = 1;
  }
  if (t === 'sell') {
    box(x, y, 1, 1, 0, 6, '#2a3a6b');
    glow(c, 10 + 6 * Math.sin(T * 3), () => box(x + .08, y + .08, .84, .84, 6, 10, c));
    let zt = 11;
    if (d.pay > 1.2) { box(x + .22, y + .22, .56, .56, 10, 10 + d.pay * 5, c); zt = 11 + d.pay * 5; }
    if (m) { const f = 1 - Math.min(.7, m.sat || 0); ebox(x, y, .12, .76 * f, .84, .06, 6, 9, f > .65 ? '#7dff9a' : f > .45 ? '#ffcf4a' : '#ff5f6d'); }
    const [tx, ty] = P(x + .5, y + .5, zt);
    cx.fillStyle = '#10142e'; cx.font = '800 15px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('$', tx, ty + 1);
  }
  if (ph !== 0) for (let i = 0; i < l - 1; i++) { const a = -.35 + i * .17, b = .41; box(x + .5 + a * K.c + b * K.s - .05, y + .5 - a * K.s + b * K.c - .05, .1, .1, 7, 11, '#ffd34d'); }
}
function thumb(c, k) {
  const sv = cx, sk = K; cx = c; K = { c: 1, s: 0, qc: 1, qs: 0, gk: 1, zk: 1, ox: 0, oy: 0 };
  c.translate(32, 40); c.scale(.8, .8); drawM(k, 0, 0, 0, 1, 0);
  cx = sv; K = sk;
}

/* ---------- scene ---------- */
function layout() {
  const W = (S.cols + S.rows) * TW / 2, H = (S.cols + S.rows) * TH / 2;
  V.s = Math.min(V.cw / (W + 60), V.ch / (H + 130));
  V.tx = V.cw / 2; V.ty = V.ch / 2 + 35 * V.s;
}
function fit() {
  const r = cv.parentElement.getBoundingClientRect(); V.dpr = window.devicePixelRatio || 1;
  cv.width = r.width * V.dpr; cv.height = r.height * V.dpr; V.cw = r.width; V.ch = r.height; layout();
}
function inside(x, y) { return x >= 0 && y >= 0 && x < S.cols && y < S.rows; }
// Machines and parts share one depth-sorted pass (far to near for the current camera angle).
function drawItems() {
  const it = [];
  for (const m of S.m) { const k = dep(m.x + .5, m.y + .5); if (D[m.k].t === 'up') it.push({ k, m, ph: 0 }, { k: k + .25, m, ph: 1 }); else it.push({ k, m }); }
  for (const p of parts) it.push({ k: dep(Math.floor(p.x) + .5, Math.floor(p.y) + .5) + .1, p });
  return it.sort((a, b) => a.k - b.k);
}
function draw() {
  camCalc(); cx.setTransform(V.dpr, 0, 0, V.dpr, 0, 0); cx.clearRect(0, 0, V.cw, V.ch);
  cx.translate(V.tx + CAM.px, V.ty + CAM.py); cx.scale(V.s * CAM.z, V.s * CAM.z);
  const wi = S.w || 0, world = wi ? ['', '#1d4a55', '#2a1d55'][wi] : ['#23275a', '#27305f', '#38295e', '#203d55'][Math.min(3, S.rebirths || 0)];
  box(0, 0, S.cols, S.rows, -16, 0, world);
  const floors = wi ? [['#23596a', '#1f4e5e'], ['#3a2a78', '#30226a']][wi - 1] : [['#2d3270', '#282c64'], ['#344078', '#2d3769'], ['#443477', '#382c67'], ['#2b4b68', '#253e5e']][Math.min(3, S.rebirths || 0)];
  for (let y = 0; y < S.rows; y++) for (let x = 0; x < S.cols; x++)
    poly([P(x, y), P(x + 1, y), P(x + 1, y + 1), P(x, y + 1)], (x + y) % 2 ? floors[0] : floors[1], '#363c80');
  if (hov && inside(hov.x, hov.y)) {
    const ok = sel && !grid[hov.x + ',' + hov.y] && S.cash >= D[sel].p && !capHit(sel);
    poly([P(hov.x, hov.y), P(hov.x + 1, hov.y), P(hov.x + 1, hov.y + 1), P(hov.x, hov.y + 1)], !sel ? '#ffffff22' : ok ? '#7dff9a55' : '#ff5f6d55');
  }
  const rm = sel && D[sel].t === 'misc' && D[sel].fx !== 'bank' ? hov : S.m.find(q => q.id === insp && D[q.k].t === 'misc' && D[q.k].fx !== 'bank');
  if (rm && inside(rm.x, rm.y)) for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) { const a = rm.x + i, b = rm.y + j; if (inside(a, b)) poly([P(a, b), P(a + 1, b), P(a + 1, b + 1), P(a, b + 1)], '#c8ff5a22'); }
  // Parts and machines share one depth-sorted pass so belts never paint over parts.
  drawItems().forEach(({ m, p, ph }) => {
    if (p) {
      cx.globalAlpha = p.lost ? Math.max(0, 1 - p.lost * 2) : 1;
      const c = PAL[Math.max(0, Math.min(6, Math.floor(Math.log10(Math.max(1, p.v)) * 2)))];
      box(p.x - .12, p.y - .12, .24, .24, 8, 18, c); cx.globalAlpha = 1; return;
    }
    drawM(m.k, m.x, m.y, m.rot, m.l, m.fl, m, ph);
    if (m.id === insp && ph !== 0) { cx.strokeStyle = '#c8ff5a'; cx.lineWidth = 2; cx.beginPath(); [P(m.x, m.y), P(m.x + 1, m.y), P(m.x + 1, m.y + 1), P(m.x, m.y + 1)].forEach((q, i) => i ? cx.lineTo(...q) : cx.moveTo(...q)); cx.closePath(); cx.stroke(); }
  });
  if (sel && hov && inside(hov.x, hov.y) && !grid[hov.x + ',' + hov.y]) { cx.globalAlpha = .6; drawM(sel, hov.x, hov.y, rot, 1, 0); cx.globalAlpha = 1; }
  cx.font = '800 15px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
  fl.forEach(f => { const [fx, fy] = P(f.x, f.y, 26 + f.t * 34); cx.globalAlpha = 1 - f.t; cx.fillStyle = '#c8ff5a'; cx.fillText(f.s, fx, fy); });
  cx.globalAlpha = 1;
}

/* ---------- UI ---------- */
function toast(s) { const t = $('#toast'); t.textContent = s; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1600); }
function hint() { $('#hint').textContent = sel ? `Placing ${D[sel].n} · R rotates · Q cancels · drag to paint · right-drag orbits · Esc stops` : 'Pick a machine, then click a tile. R rotates · Q deletes. Drag to orbit · wheel zooms · Shift-drag pans · arrows turn the view.'; }
let cat = 0;
const CATN = ['Droppers', 'Upgraders', 'Boosters', 'Belts'];
function catNote() {
  const pc = Math.round(STK * 100), pc2 = Math.round(STK * STK * 100);
  return [
    `Placed ${dropCount()} of ${dropCap()}. Elite droppers are limited to 2 of each kind. A bigger floor and every rebirth raise the limit.`,
    `Placed ${upCount()} of ${upCap()}, max 2 of each kind. A part gets the full bonus from the first upgrader it meets, ${pc}% of the next one's bonus, then ${pc2}%… so put your best upgrader first.`,
    `Placed ${miscCount()} of ${miscCap()}, max 2 of each kind. Overlapping auras of the same type are capped.`,
    'Belts and sell pads have no limit. A sell pad floods if you feed it too fast, so spread your sales.'
  ][cat];
}
function buildUI() {
  const ids = GROUPS[cat][1].filter(inW); if (cat < 2) ids.sort((x, y) => D[x].p - D[y].p);
  $('#cats').innerHTML = CATN.map((n, i) => `<button data-cat="${i}" class="${i === cat ? 'on' : ''}">${n}<i></i></button>`).join('');
  $('#build').innerHTML = '<p class="note" id="catNote"></p>' + ids.map(k => `<button class="item ${available(k) ? '' : 'locked'} ${k === sel ? 'on' : ''}" data-k="${k}"><canvas width="64" height="72"></canvas><span><b>${available(k) ? D[k].n : 'Rebirth ' + D[k].tier + ' · ' + D[k].n}</b><small>${available(k) ? D[k].d : 'Unlocks after rebirth ' + D[k].tier}</small></span><em>${available(k) ? (D[k].p ? fmt(D[k].p) : 'Free') : 'Locked'}</em></button>`).join('');
  $('#catNote').textContent = catNote();
  document.querySelectorAll('.item').forEach(b => { if (available(b.dataset.k)) { thumb(b.querySelector('canvas').getContext('2d'), b.dataset.k); b.onclick = () => choose(b.dataset.k); } });
}
$('#cats').onclick = e => { const b = e.target.closest('button[data-cat]'); if (!b) return; cat = +b.dataset.cat; $('#build').scrollTop = 0; buildUI(); refreshUI(); };
function labUI() {
  $('#lab').innerHTML = `<div class="rebirth"><b>Rebirth ${S.rebirths + 1}</b><small>Reset your factory for a permanent cash multiplier and rebirth points. Requires ${fmt(rebirthCost())} lifetime earnings.</small><button id="rebirth">Rebirth · ${fmt(rebirthCost())}</button><small>Next reward: +${Math.max(1, Math.floor(Math.sqrt(S.rebirths + 1)))} rebirth point(s) · ×${(RB ** (S.rebirths + 1)).toFixed(2)} cash multiplier</small></div><h3>Rebirth lab · ${S.rp} points</h3>` + LAB.map(l => { const v = S.lab[l.id] || 0, rp = l.currency === 'rp'; return `<div class="row" data-id="${l.id}"><span><b>${l.n}</b><small>${l.d}</small><i>${'●'.repeat(v)}${'○'.repeat(l.max - v)}</i></span><button>${v >= l.max ? 'Max' : (rp ? labCost(l) + ' RP' : fmt(labCost(l)))}</button></div>`; }).join('');
  $('#rebirth').onclick = () => {
    if (S.w) return toast('Rebirth only works in the Foundry');
    if (S.earned < rebirthCost()) return toast('Earn more lifetime cash to rebirth');
    const reward = Math.max(1, Math.floor(Math.sqrt(S.rebirths + 1))); S.rebirths++; S.rp += reward;
    S.cash = 150 + 250 * (S.lab.starting || 0); S.cols = 6; S.rows = 6; S.m = []; S.id = 1; S.sold = 0; S.earned = 0; S.lab = Object.fromEntries(Object.entries(S.lab).filter(([id]) => id === 'starting' || id === 'rebirthBoost'));
    parts = []; fl = []; insp = null; sel = null; starter(); reindex(); buildUI(); labUI(); inspUI(); hint(); save(); toast(`Rebirth ${S.rebirths}! +${reward} rebirth points`);
  };
  document.querySelectorAll('.row').forEach(r => r.querySelector('button').onclick = () => {
    const l = LAB.find(x => x.id === r.dataset.id), v = S.lab[l.id] || 0;
    if (v >= l.max) return;
    if (l.currency === 'rp') { if (S.rp < labCost(l)) return toast('Not enough rebirth points'); S.rp -= labCost(l); }
    else { if (S.w) return toast('Buy lab upgrades in the Foundry'); if (S.cash < labCost(l)) return toast('Not enough cash'); S.cash -= labCost(l); }
    S.lab[l.id] = v + 1; labUI(); inspUI(); save();
  });
}
function inspUI() {
  const el = $('#insp'), m = S.m.find(x => x.id === insp);
  if (!m) { el.hidden = true; insp = null; return; }
  el.hidden = false;
  el.innerHTML = `<h3>${D[m.k].n} · level ${m.l}/${MAXL}</h3><p>${statTxt(m)}</p><div class="btns">${m.off > 0 ? `<button id="fx">Repair · ${fmt(rep(m))}</button>` : ''}<button id="up">${m.l >= MAXL ? 'Max level' : 'Upgrade · ' + fmt(upCost(m))}</button>${D[m.k].t === 'sell' || D[m.k].t === 'misc' ? '' : '<button id="rt">Rotate</button>'}<button id="sl">Sell · +${fmt(refund(m))}</button></div>`;
  $('#up').onclick = () => { if (m.l >= MAXL) return; if (S.cash < upCost(m)) return toast('Not enough cash'); S.cash -= upCost(m); m.l++; inspUI(); save(); };
  if ($('#fx')) $('#fx').onclick = () => { if (S.cash < rep(m)) return toast('Not enough cash'); S.cash -= rep(m); m.off = 0; inspUI(); };
  if ($('#rt')) $('#rt').onclick = () => { m.rot = (m.rot + 1) % 4; };
  $('#sl').onclick = () => { S.cash += refund(m); S.m = S.m.filter(x => x !== m); reindex(); insp = null; inspUI(); save(); };
}
function choose(k) {
  sel = sel === k ? null : k; rot = 0; insp = null; inspUI();
  document.querySelectorAll('.item').forEach(b => b.classList.toggle('on', b.dataset.k === sel)); hint();
}
function refreshUI() {
  document.querySelectorAll('#worlds [data-a=buy]').forEach(b => b.classList.toggle('poor', S.cash < UNL[+b.dataset.w]));
  const cn = [[dropCount(), dropCap()], [upCount(), upCap()], [miscCount(), miscCap()], null];
  document.querySelectorAll('#cats [data-cat]').forEach((b, i) => { const c = cn[i], t = b.querySelector('i'); t.textContent = c ? c[0] + '/' + c[1] : S.m.filter(m => ['belt', 'split', 'sell'].includes(D[m.k].t)).length + ' placed'; t.classList.toggle('maxed', !!c && c[0] >= c[1]); });
  if ($('#catNote')) $('#catNote').textContent = catNote();
  $('#quest').innerHTML = (ev ? `<b>${ev.n} · ${Math.ceil(evT)}s</b>` : '') + (Q ? `<span>Contract: ${Q.got}/${Q.need} parts worth ${fmt(Q.min)}+ · ${Math.ceil(Q.t)}s · pays ${fmt(Q.reward)}</span>` : '');
  $('#cash').textContent = fmt(S.cash); $('#inc').textContent = fmt(inc) + '/s'; $('#sold').textContent = S.sold.toLocaleString('en-US'); $('#rebirthStat').textContent = `${S.rebirths} · ${S.rp}`;
  document.querySelectorAll('.item:not(.locked)').forEach(b => b.classList.toggle('poor', S.cash < D[b.dataset.k].p));
  document.querySelectorAll('.row').forEach(r => { const l = LAB.find(x => x.id === r.dataset.id); r.querySelector('button').classList.toggle('poor', S.cash < labCost(l)); });
  const u = $('#up'), m = S.m.find(x => x.id === insp); if (u && m) u.classList.toggle('poor', S.cash < upCost(m));
  const e = $('#expand'), max = S.cols >= 18; e.textContent = max ? 'Floor at max size' : 'Expand floor · ' + fmt(expCost()); e.classList.toggle('poor', max || S.cash < expCost());
  const cb = $('#clear'); cb.disabled = !S.m.length; cb.textContent = S.m.length ? 'Remove all (' + S.m.length + ')' : 'Remove all';
  const full = document.body.classList.contains('full'); $('#hud').hidden = !full; if (full) $('#hud').textContent = fmt(S.cash) + '  ·  ' + fmt(inc) + '/s';
}

/* ---------- worlds ---------- */
const WF = ['cash', 'cols', 'rows', 'm', 'id', 'sold', 'earned'], fmtC = (n, c) => { const o = CS; CS = c; const r = fmt(n); CS = o; return r; };
function applyWorld() {
  const w = S.w || 0; CS = CUR[w];
  document.body.style.background = `radial-gradient(1200px 700px at 40% 30%,${WBG[w][0]},${WBG[w][1]})`;
  document.querySelector('h1 small').textContent = WN[w]; document.querySelector('.stat span').textContent = CNAME[w];
  buildUI(); worldsUI(); labUI(); inspUI(); hint();
}
function swapWorld(n) {
  if (n === S.w) return;
  S.W[S.w] = Object.fromEntries(WF.map(f => [f, S[f]]));
  const first = !S.W[n], o = S.W[n] || { cash: START[n], cols: 6, rows: 6, m: [], id: 1, sold: 0, earned: 0 };
  S.w = n; S.W[n] = null; WF.forEach(f => S[f] = o[f]); reindex();
  if (first) starter();
  parts = []; fl = []; insp = null; sel = null; Q = null; ev = null; evT = 45; qT = 20;
  layout(); applyWorld(); save();
}
function worldsUI() {
  const L = S.life, lg = x => Math.log10(1 + x);
  $('#worlds').innerHTML = WN.map((n, i) => {
    let b;
    if (S.w === i) b = '<button disabled>You are here</button>';
    else if (S.unl[i]) b = `<button data-w="${i}" data-a="go">Travel</button>`;
    else if (S.w === i - 1 && S.rebirths < UREB[i]) b = `<button disabled>Needs rebirth ${UREB[i]} (you have ${S.rebirths})</button>`;
    else if (S.w === i - 1) b = `<button data-w="${i}" data-a="buy">Open portal · ${fmtC(UNL[i], CUR[i - 1])}</button>`;
    else b = `<button disabled>Open the portal from ${WN[i - 1]}</button>`;
    const bonus = i === 0 ? `Foundry bonus from other worlds: ×${(1 + .15 * lg(L[1]) + .25 * lg(L[2])).toFixed(2)}` : i === 1 ? `Crystal Reach bonus from Void Station: ×${(1 + .2 * lg(L[2])).toFixed(2)}` : 'Its output boosts the worlds before it';
    return `<div class="rebirth"><b>${n} · ${CUR[i]}</b><small>${WD[i]}</small><small>Lifetime: ${fmtC(L[i], CUR[i])} · ${bonus}</small>${b}</div>`;
  }).join('');
}
$('#worlds').onclick = e => {
  const b = e.target.closest('button[data-w]'); if (!b) return; const i = +b.dataset.w;
  if (b.dataset.a === 'go') return swapWorld(i);
  if (S.rebirths < UREB[i]) return toast('Reach rebirth ' + UREB[i] + ' first');
  if (S.cash < UNL[i]) return toast('Not enough ' + CNAME[S.w].toLowerCase());
  S.cash -= UNL[i]; S.unl[i] = true; toast(WN[i] + ' portal opened!'); swapWorld(i);
};
/* ---------- secret cheat menu: type "cheat", press ` or click the title 5 times ---------- */
const CH = { free: 0, nocap: 0, tiers: 0, speed: 1 };
const cheat = document.createElement('div'); cheat.id = 'cheat'; cheat.hidden = true;
cheat.innerHTML = '<div class="cbox"><h2>Cheat menu <button data-c="close">✕</button></h2><div id="cheatBody"></div></div>'; document.body.appendChild(cheat);
function cheatUI() {
  const B = (c, t, x = '') => `<button data-c="${c}" ${x}>${t}</button>`, T_ = (c, t, v) => `<button data-c="${c}" class="${v ? 'on' : ''}">${t}: ${v ? 'ON' : 'off'}</button>`;
  $('#cheatBody').innerHTML = `<h3>Money (${CNAME[S.w || 0]})</h3><div class="cg">${B('add', '+1K', 'data-n="1000"')}${B('add', '+1M', 'data-n="1e6"')}${B('add', '+1B', 'data-n="1e9"')}${B('add', '+1T', 'data-n="1e12"')}${B('mul', '×100')}</div>
<h3>Worlds (unlocks and travels)</h3><div class="cg">${WN.map((n, i) => B('go', n + (S.w === i ? ' ✓' : ''), `data-w="${i}"`)).join('')}</div>
<h3>Progress</h3><div class="cg">${B('reb', '+1 Rebirth')}${B('rp', '+10 RP')}${B('lab', 'Max lab')}${B('floor', 'Max floor')}</div>
<h3>Rules</h3><div class="cg">${T_('free', 'Free building', CH.free)}${T_('nocap', 'No placement caps', CH.nocap)}${T_('tiers', 'Unlock all tiers', CH.tiers)}${B('speed', 'Speed ×' + CH.speed)}</div>
<h3>Events</h3><div class="cg">${B('fix', 'Repair all')}${B('event', 'Random event')}${B('quest', 'New contract')}${B('done', 'Finish contract')}</div>`;
}
cheat.onclick = e => {
  const b = e.target.closest('button[data-c]'); if (!b) return; const c = b.dataset.c, w = +b.dataset.w;
  if (c === 'close') { cheat.hidden = true; return; }
  if (c === 'add') { S.cash += +b.dataset.n; S.earned += +b.dataset.n; }
  else if (c === 'mul') S.cash *= 100;
  else if (c === 'go') { S.unl[w] = true; swapWorld(w); }
  else if (c === 'reb') { S.rebirths++; S.rp++; applyWorld(); }
  else if (c === 'rp') { S.rp += 10; labUI(); }
  else if (c === 'lab') { LAB.forEach(l => S.lab[l.id] = l.max); labUI(); inspUI(); }
  else if (c === 'floor') { S.cols = S.rows = 18; layout(); }
  else if (c === 'speed') CH.speed = CH.speed === 1 ? 5 : CH.speed === 5 ? 25 : 1;
  else if (c === 'fix') S.m.forEach(m => m.off = 0);
  else if (c === 'event') { if (!ev) evT = 0; }
  else if (c === 'quest') { Q = null; qT = 0; }
  else if (c === 'done') { if (Q) { S.cash += Q.reward; S.earned += Q.reward; Q = null; qT = 15; } }
  else { CH[c] = CH[c] ? 0 : 1; if (c === 'tiers') buildUI(); }
  cheatUI(); save();
};
const openCheat = () => { cheat.hidden = !cheat.hidden; if (!cheat.hidden) cheatUI(); };
let kbuf = '', tclicks = 0, tclr = 0;
addEventListener('keydown', e => { if (e.key === '`') return openCheat(); kbuf = (kbuf + e.key.toLowerCase()).slice(-5); if (kbuf === 'cheat') openCheat(); if (e.key === 'Escape') cheat.hidden = true; });
document.querySelector('h1').addEventListener('click', () => { clearTimeout(tclr); tclr = setTimeout(() => tclicks = 0, 2000); if (++tclicks >= 5) { tclicks = 0; openCheat(); } });
/* ---------- input ---------- */
function pick(e) {
  const r = cv.getBoundingClientRect(), sc = V.s * CAM.z, A = (e.clientX - r.left - V.tx - CAM.px) / sc / (TW / 2), B = (e.clientY - r.top - V.ty - CAM.py) / sc / (TH / 2 * K.gk);
  const rx = (A + B) / 2, ry = (B - A) / 2;
  return { x: Math.floor(rx * K.c + ry * K.s + K.ox), y: Math.floor(-rx * K.s + ry * K.c + K.oy) };
}
function inHull(pts, x, y) {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  const h = lo.slice(0, -1).concat(up.slice(0, -1));
  for (let i = 0; i < h.length; i++) if (cr(h[i], h[(i + 1) % h.length], [x, y]) < 0) return false;
  return true;
}
// The machine you are actually looking at under the cursor (so tall machines can be clicked on their body, from any angle).
function hitM(e) {
  const r = cv.getBoundingClientRect(), sc = V.s * CAM.z, px = (e.clientX - r.left - V.tx - CAM.px) / sc, py = (e.clientY - r.top - V.ty - CAM.py) / sc, hs = { drop: 55, up: 46, misc: 42, sell: 26 };
  for (const m of S.m.slice().sort((a, b) => dep(b.x + .5, b.y + .5) - dep(a.x + .5, a.y + .5))) {
    const h = hs[D[m.k].t] || 14, pts = [];
    for (const [i, j] of [[0, 0], [1, 0], [1, 1], [0, 1]]) pts.push(P(m.x + i, m.y + j, 0), P(m.x + i, m.y + j, h));
    if (inHull(pts, px, py)) return m;
  }
  return null;
}
function tryPlace(t, loud) {
  if (!inside(t.x, t.y)) return;
  if (grid[t.x + ',' + t.y]) { if (loud) toast('That tile is taken'); return; }
  { const why = capWhy(sel); if (why) { if (loud) toast(why); return; } }
  if (!CH.free && S.cash < D[sel].p) { if (loud) toast('Not enough cash'); return; }
  if (!CH.free) S.cash -= D[sel].p; add(sel, t.x, t.y, rot); save();
}
/* ---------- camera + pointer input ----------
   mouse : left click = place / select · drag (nothing selected) or right-drag = orbit · Shift/middle-drag = pan · wheel = zoom
   touch : tap = place / select · one-finger drag (nothing selected) = orbit · two fingers = pinch zoom, twist to turn, drag to pan
   keys  : arrows = turn / tilt · + - = zoom · 0 = reset view · F = full view */
const ptrs = new Map(), clampEl = v => Math.max(.18, Math.min(1.4, v)), clampZ = v => Math.max(.3, Math.min(4, v));
let drag = null, pin = null, fsReq = false;
function zoomAt(f, mx, my) {
  const z1 = clampZ(CAM.z * f), s0 = V.s * CAM.z, s1 = V.s * z1, gx = (mx - V.tx - CAM.px) / s0, gy = (my - V.ty - CAM.py) / s0;
  CAM.px = mx - V.tx - gx * s1; CAM.py = my - V.ty - gy * s1; CAM.z = z1;
}
const spin = n => { CAM.tyaw = (Math.round(CAM.tyaw / QT) + n) * QT; }, tilt = d => { CAM.tel = clampEl(CAM.tel + d); };
function resetView() {
  const TP = Math.PI * 2; CAM.yaw = ((CAM.yaw % TP) + TP) % TP; if (CAM.yaw > Math.PI) CAM.yaw -= TP; CAM.tyaw = 0; CAM.tel = EL0; CAM.z = 1; CAM.px = 0; CAM.py = 0;
}
function setFull(on) {
  document.body.classList.toggle('full', on); $('#fullBtn').textContent = on ? 'Exit full view' : 'Full view';
  if (on) { const el = document.documentElement; if (el.requestFullscreen && !document.fullscreenElement) { fsReq = true; el.requestFullscreen().catch(() => { fsReq = false; }); } }
  else if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
  fit();
}
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && fsReq) { fsReq = false; setFull(false); } else fit(); });
const pinState = () => { const [a, b] = [...ptrs.values()]; return { d: Math.hypot(b.x - a.x, b.y - a.y) || 1, a: Math.atan2(b.y - a.y, b.x - a.x), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 }; };
cv.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });
cv.addEventListener('pointerdown', e => {
  try { cv.setPointerCapture(e.pointerId); } catch (_) { }
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 2) { drag = null; pin = pinState(); return; }
  if (ptrs.size > 2) return;
  const touch = e.pointerType === 'touch', t = pick(e), mode = e.button === 2 ? 'orbit' : e.button === 1 || (e.button === 0 && e.shiftKey) ? 'pan' : e.button === 0 ? 'act' : null;
  if (!mode) return;
  hov = t; lastPlaced = t.x + ',' + t.y; drag = { mode, moved: 0, touch, t, placed: false };
  if (mode === 'act' && sel && !touch) { tryPlace(t, true); drag.placed = true; }
});
cv.addEventListener('pointermove', e => {
  if (e.pointerType !== 'touch') hov = pick(e);
  const p = ptrs.get(e.pointerId); if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
  if (pin && ptrs.size === 2) {
    const n = pinState(), r = cv.getBoundingClientRect();
    zoomAt(n.d / pin.d, n.cx - r.left, n.cy - r.top); CAM.px += n.cx - pin.cx; CAM.py += n.cy - pin.cy;
    CAM.tyaw += n.a - pin.a; CAM.yaw += n.a - pin.a; pin = n; return;
  }
  if (!drag) return;
  drag.moved += Math.abs(dx) + Math.abs(dy);
  if (drag.mode === 'act') {
    if (sel) {
      if (drag.touch && !drag.placed && drag.moved > 0) { tryPlace(drag.t, true); drag.placed = true; }
      const t = pick(e), k = t.x + ',' + t.y; hov = t;
      if (k !== lastPlaced) { lastPlaced = k; if (e.buttons & 1 || drag.touch) tryPlace(t, false); }
    } else if (drag.moved > 6) { drag.mode = 'orbit'; cv.classList.add('grab'); }
  } else if (drag.mode === 'orbit') {
    CAM.tyaw -= dx * .008; CAM.yaw = CAM.tyaw; CAM.tel = clampEl(CAM.tel + dy * .005); CAM.el = CAM.tel; cv.classList.add('grab');
  } else if (drag.mode === 'pan') { CAM.px += dx; CAM.py += dy; cv.classList.add('grab'); }
});
function endPtr(e) {
  ptrs.delete(e.pointerId); cv.classList.remove('grab');
  if (pin) { if (ptrs.size < 2) pin = null; drag = null; return; }
  if (drag && e.type === 'pointerup') {
    if (drag.mode === 'act' && drag.moved < 8 && !drag.placed) {
      if (sel) tryPlace(drag.t, true);
      else { const m = hitM(e) || (inside(drag.t.x, drag.t.y) ? grid[drag.t.x + ',' + drag.t.y] : null); insp = m ? m.id : null; inspUI(); }
    } else if (drag.mode === 'orbit' && drag.moved < 6 && e.button === 2 && sel) choose(sel);
  }
  drag = null;
}
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);
cv.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch' && !drag) hov = null; });
cv.addEventListener('wheel', e => { e.preventDefault(); const r = cv.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * (e.deltaMode === 1 ? .05 : .0015) * (e.ctrlKey ? 5 : 1)), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
cv.addEventListener('contextmenu', e => e.preventDefault());
$('#cam').onclick = e => {
  const b = e.target.closest('button[data-cam]'); if (!b) return; const a = b.dataset.cam;
  if (a === 'left') spin(-1); else if (a === 'right') spin(1); else if (a === 'up') tilt(.12); else if (a === 'down') tilt(-.12);
  else if (a === 'in') zoomAt(1.25, V.cw / 2, V.ch / 2); else if (a === 'out') zoomAt(.8, V.cw / 2, V.ch / 2);
  else if (a === 'reset') resetView(); else if (a === 'full') setFull(!document.body.classList.contains('full'));
};
addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return; const k = e.key;
  if (k === 'ArrowLeft') spin(-1); else if (k === 'ArrowRight') spin(1); else if (k === 'ArrowUp') tilt(.12); else if (k === 'ArrowDown') tilt(-.12);
  else if (k === '+' || k === '=') zoomAt(1.25, V.cw / 2, V.ch / 2); else if (k === '-' || k === '_') zoomAt(.8, V.cw / 2, V.ch / 2);
  else if (k === '0') resetView(); else if (k.toLowerCase() === 'f' && !e.repeat) setFull(!document.body.classList.contains('full'));
  else if (k === 'Escape' && document.body.classList.contains('full')) setFull(false); else return;
  if (k.startsWith('Arrow')) e.preventDefault();
});
addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (sel) choose(sel); insp = null; inspUI(); }
  if (e.key.toLowerCase() === 'r') { if (sel) rot = (rot + 1) % 4; else { const m = S.m.find(x => x.id === insp); if (m && D[m.k].t !== 'sell' && D[m.k].t !== 'misc') m.rot = (m.rot + 1) % 4; } }
  if (e.key.toLowerCase() === 'q' && !e.repeat) {
    if (sel) { choose(sel); return; }
    const m = S.m.find(x => x.id === insp); if (m) { S.cash += refund(m); S.m = S.m.filter(x => x !== m); reindex(); insp = null; inspUI(); save(); toast('Machine deleted · refund received'); }
  }
});
document.querySelectorAll('nav button').forEach(b => b.onclick = () => {
  document.querySelectorAll('nav button').forEach(x => x.classList.toggle('on', x === b));
  $('#build').hidden = b.dataset.tab !== 'build'; $('#cats').hidden = b.dataset.tab !== 'build'; $('#lab').hidden = b.dataset.tab !== 'lab'; $('#worlds').hidden = b.dataset.tab !== 'worlds'; if (b.dataset.tab === 'worlds') worldsUI();
});
$('#expand').onclick = () => {
  if (S.cols >= 18) return; if (S.cash < expCost()) return toast('Not enough cash');
  S.cash -= expCost(); S.cols++; S.rows++; layout(); save(); toast('Floor expanded');
};
$('#reset').onclick = () => { if (confirm('Reset your factory and start over?')) { localStorage.removeItem(KEY); S = fresh(); starter(); parts = []; fl = []; insp = null; sel = null; layout(); applyWorld(); inspUI(); hint(); } };
$('#clear').onclick = () => {
  const n = S.m.length; if (!n) return toast('Nothing to remove');
  const rf = CH.free ? 0 : S.m.reduce((a, m) => a + refund(m), 0);
  if (!confirm('Remove all ' + n + ' placed machine' + (n > 1 ? 's' : '') + '?' + (rf ? ' You get ' + fmt(rf) + ' back (the normal sell refund).' : ''))) return;
  S.cash += rf; S.m = []; reindex(); parts = []; fl = []; insp = null; inspUI(); save();
  toast('Removed ' + n + ' machine' + (n > 1 ? 's' : '') + (rf ? ' · +' + fmt(rf) : ''));
};
addEventListener('resize', fit);

/* ---------- loop ---------- */
function loop(now) {
  const dt = Math.min(.1, (now - last) / 1000); last = now; T += dt;
  for (let i = 0; i < CH.speed; i++) step(dt);
  incT += dt; if (incT >= 1) { incT = 0; inc = inc ? inc * .5 + acc * .5 : acc; acc = 0; }
  saveT += dt; if (saveT > 4) { saveT = 0; save(); }
  uiT += dt; if (uiT > .1) { uiT = 0; refreshUI(); }
  camStep(dt); draw(); requestAnimationFrame(loop);
}
load(); applyWorld(); fit(); requestAnimationFrame(loop);
