import { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════
// UNIT DEFINITIONS — all units, locked ones require unlock
// ═══════════════════════════════════════════════════════════════════
const ALL_UNITS = {
  archer: {
    name: 'Archer',
    emoji: '🏹',
    cost: 2,
    hp: 8,
    atk: 5,
    def: 1,
    speed: 0.55,
    range: 175,
    strongVs: 'warrior',
    weakVs: 'cavalry',
    color: '#5a8a3a',
    enemyColor: '#8a3a3a',
    unlocked: true,
    unlockCost: 0,
    tier: 1,
    desc: 'Ranged. Shreds warriors, weak vs cavalry.',
  },
  warrior: {
    name: 'Warrior',
    emoji: '⚔️',
    cost: 3,
    hp: 16,
    atk: 4,
    def: 5,
    speed: 0.75,
    range: 30,
    strongVs: 'cavalry',
    weakVs: 'archer',
    color: '#3a5a8a',
    enemyColor: '#8a5a3a',
    unlocked: true,
    unlockCost: 0,
    tier: 1,
    desc: 'Steady melee. Holds cavalry, weak vs archers.',
  },
  cavalry: {
    name: 'Cavalry',
    emoji: '🐴',
    cost: 5,
    hp: 13,
    atk: 7,
    def: 2,
    speed: 1.9,
    range: 34,
    strongVs: 'archer',
    weakVs: 'warrior',
    color: '#7a3a8a',
    enemyColor: '#8a7a3a',
    unlocked: true,
    unlockCost: 0,
    tier: 1,
    desc: 'Fast charge. Destroys archers, weak vs warriors.',
  },
  spearman: {
    name: 'Spearman',
    emoji: '🪃',
    cost: 3,
    hp: 18,
    atk: 5,
    def: 4,
    speed: 0.7,
    range: 32,
    strongVs: 'cavalry',
    weakVs: 'archer',
    color: '#4a7a6a',
    enemyColor: '#7a4a3a',
    unlocked: false,
    unlockCost: 8,
    tier: 2,
    desc: 'Pikes shred cavalry even harder than warriors. Solid HP.',
  },
  crossbow: {
    name: 'Crossbow',
    emoji: '🎯',
    cost: 3,
    hp: 10,
    atk: 6,
    def: 2,
    speed: 0.5,
    range: 195,
    strongVs: 'warrior',
    weakVs: 'cavalry',
    color: '#6a7a2a',
    enemyColor: '#9a4a2a',
    unlocked: false,
    unlockCost: 8,
    tier: 2,
    desc: 'Upgraded archer. More range, more punch.',
  },
  knight: {
    name: 'Knight',
    emoji: '🛡',
    cost: 7,
    hp: 20,
    atk: 8,
    def: 6,
    speed: 1.6,
    range: 36,
    strongVs: 'archer',
    weakVs: 'spearman',
    color: '#8a6a1a',
    enemyColor: '#6a2a1a',
    unlocked: false,
    unlockCost: 12,
    tier: 3,
    desc: 'Elite heavy cavalry. Armoured & deadly, but costly.',
  },
  berserker: {
    name: 'Berserker',
    emoji: '🪓',
    cost: 4,
    hp: 14,
    atk: 9,
    def: 1,
    speed: 1.1,
    range: 28,
    strongVs: 'warrior',
    weakVs: 'spearman',
    color: '#9a3a1a',
    enemyColor: '#5a1a1a',
    unlocked: false,
    unlockCost: 10,
    tier: 2,
    desc: 'Glass cannon. Insane attack, almost no defense.',
  },
  monk: {
    name: 'Battle Monk',
    emoji: '🧘',
    cost: 4,
    hp: 12,
    atk: 4,
    def: 3,
    speed: 0.8,
    range: 80,
    strongVs: 'berserker',
    weakVs: 'knight',
    color: '#7a6a8a',
    enemyColor: '#5a4a6a',
    unlocked: false,
    unlockCost: 10,
    tier: 2,
    desc: 'Mid-range spiritual fighter. Calms berserkers, weak vs knights.',
  },
  catapult: {
    name: 'Catapult',
    emoji: '💣',
    cost: 6,
    hp: 10,
    atk: 10,
    def: 1,
    speed: 0.2,
    range: 220,
    strongVs: 'warrior',
    weakVs: 'cavalry',
    color: '#5a4a2a',
    enemyColor: '#6a3a1a',
    unlocked: false,
    unlockCost: 15,
    tier: 3,
    desc: 'Siege weapon. Devastating range damage, nearly immobile.',
  },
  champion: {
    name: 'Champion',
    emoji: '👑',
    cost: 8,
    hp: 24,
    atk: 7,
    def: 7,
    speed: 1.0,
    range: 34,
    strongVs: 'berserker',
    weakVs: 'catapult',
    color: '#aa8a1a',
    enemyColor: '#6a2a2a',
    unlocked: false,
    unlockCost: 20,
    tier: 4,
    desc: 'Hero unit. Towering stats. Inspires nearby allies.',
  },
};

// ═══════════════════════════════════════════════════════════════════
// UPGRADES
// ═══════════════════════════════════════════════════════════════════
const ALL_UPGRADES = {
  budget5: {
    name: '+5 Battle Points',
    emoji: '💰',
    cost: 6,
    desc: 'Increase your army budget by 5 points.',
    purchased: false,
    apply: (g) => {
      g.maxPoints += 5;
    },
  },
  budget10: {
    name: '+10 Battle Points',
    emoji: '💎',
    cost: 15,
    desc: 'Increase your army budget by 10 points.',
    purchased: false,
    apply: (g) => {
      g.maxPoints += 10;
    },
    requires: 'budget5',
  },
  ironWill: {
    name: 'Iron Will',
    emoji: '🧠',
    cost: 8,
    desc: 'All units start with +20 morale.',
    purchased: false,
    apply: (g) => {
      g.bonusMorale += 20;
    },
  },
  veteranArms: {
    name: 'Veteran Arms',
    emoji: '⚔️',
    cost: 10,
    desc: '+1 attack to all melee units.',
    purchased: false,
    apply: (g) => {
      g.meleeAtkBonus += 1;
    },
  },
  fortifiedLines: {
    name: 'Fortified Lines',
    emoji: '🛡',
    cost: 10,
    desc: '+1 defense to all units.',
    purchased: false,
    apply: (g) => {
      g.defBonus += 1;
    },
  },
  swiftMarsh: {
    name: 'Swift March',
    emoji: '💨',
    cost: 8,
    desc: '+20% movement speed to all units.',
    purchased: false,
    apply: (g) => {
      g.speedMult = 1.2;
    },
  },
  healingHerbs: {
    name: 'Healing Herbs',
    emoji: '🌿',
    cost: 12,
    desc: 'All units start with +3 bonus HP.',
    purchased: false,
    apply: (g) => {
      g.bonusHp += 3;
    },
  },
  fletchery: {
    name: 'Fletchery',
    emoji: '🏹',
    cost: 9,
    desc: '+20 range and +1 attack to ranged units.',
    purchased: false,
    apply: (g) => {
      g.rangedBonus = true;
    },
  },
  warcry: {
    name: 'Battle Warcry',
    emoji: '📯',
    cost: 12,
    desc: 'Start every battle with a free Volley event.',
    purchased: false,
    apply: (g) => {
      g.startEvent = 'volley';
    },
  },
};

// ═══════════════════════════════════════════════════════════════════
// CAMPAIGN LEVELS — escalating enemy armies
// ═══════════════════════════════════════════════════════════════════
const CAMPAIGN = [
  {
    level: 1,
    name: 'Border Skirmish',
    enemy: { archer: 2, warrior: 1 },
    reward: 6,
    xpReward: 10,
  },
  {
    level: 2,
    name: 'Forest Ambush',
    enemy: { archer: 3, warrior: 2 },
    reward: 7,
    xpReward: 12,
  },
  {
    level: 3,
    name: 'River Crossing',
    enemy: { archer: 2, warrior: 2, cavalry: 1 },
    reward: 8,
    xpReward: 15,
  },
  {
    level: 4,
    name: 'Hill Fort Assault',
    enemy: { warrior: 3, cavalry: 2 },
    reward: 9,
    xpReward: 18,
  },
  {
    level: 5,
    name: 'Plains of Carnage',
    enemy: { archer: 3, warrior: 2, cavalry: 2 },
    reward: 10,
    xpReward: 20,
  },
  {
    level: 6,
    name: 'The Iron March',
    enemy: { archer: 2, warrior: 3, cavalry: 2, spearman: 1 },
    reward: 12,
    xpReward: 25,
  },
  {
    level: 7,
    name: 'Siege of Valdrath',
    enemy: { crossbow: 3, warrior: 3, cavalry: 1 },
    reward: 13,
    xpReward: 28,
  },
  {
    level: 8,
    name: "Warlord's Guard",
    enemy: { warrior: 2, knight: 2, crossbow: 2 },
    reward: 14,
    xpReward: 32,
  },
  {
    level: 9,
    name: 'The Dark Crusade',
    enemy: { knight: 2, berserker: 2, crossbow: 3 },
    reward: 16,
    xpReward: 38,
  },
  {
    level: 10,
    name: 'Final Reckoning',
    enemy: { knight: 3, berserker: 2, catapult: 1, crossbow: 2 },
    reward: 20,
    xpReward: 50,
  },
];

const CANVAS_W = 760,
  CANVAS_H = 340,
  GROUND_Y = 255;
const ADV = 2.1,
  DIS = 0.42;
const ROUT_THRESHOLD = 20;

const BATTLE_EVENTS = [
  {
    id: 'volley',
    label: '📯 Volley Fire!',
    desc: 'Ranged units loose a coordinated volley!',
    trigger: 'ranged',
    minCount: 2,
  },
  {
    id: 'charge',
    label: '💨 Cavalry Charge!',
    desc: 'Cavalry surge forward with terrifying momentum!',
    trigger: 'cavalry',
    minCount: 1,
  },
  {
    id: 'shield',
    label: '🛡 Shield Wall!',
    desc: 'Warriors lock shields — defense doubled!',
    trigger: 'melee',
    minCount: 2,
  },
  {
    id: 'berserk',
    label: '🔥 Berserker Rage!',
    desc: 'A warrior goes berserk — triple attack!',
    trigger: 'any',
    minCount: 1,
  },
  {
    id: 'flank',
    label: '⚡ Flanking Maneuver!',
    desc: 'Cavalry sweep the flank — enemies lose morale!',
    trigger: 'cavalry',
    minCount: 1,
  },
  {
    id: 'rain',
    label: '🌧 Arrow Rain!',
    desc: 'Arrows blanket the entire field!',
    trigger: 'ranged',
    minCount: 3,
  },
  {
    id: 'rally',
    label: '🚩 Rally the Troops!',
    desc: 'A commander restores broken morale!',
    trigger: 'any',
    minCount: 1,
  },
  {
    id: 'duel',
    label: '⚔️ Champion Duel!',
    desc: 'Two champions step forward to settle this!',
    trigger: 'any',
    minCount: 1,
  },
  {
    id: 'inspire',
    label: '✨ Inspired Charge!',
    desc: 'Morale surges — all your units gain +30 morale!',
    trigger: 'any',
    minCount: 1,
  },
  {
    id: 'siege',
    label: '💣 Catapult Volley!',
    desc: 'Catapults fire on clustered enemies!',
    trigger: 'catapult',
    minCount: 1,
  },
];

// ═══════════════════════════════════════════════════════════════════
// INITIAL GAME STATE
// ═══════════════════════════════════════════════════════════════════
function initGameState() {
  return {
    level: 1,
    gold: 0,
    maxPoints: 20,
    bonusMorale: 0,
    meleeAtkBonus: 0,
    defBonus: 0,
    speedMult: 1.0,
    bonusHp: 0,
    rangedBonus: false,
    startEvent: null,
    unlockedUnits: ['archer', 'warrior', 'cavalry'],
    purchasedUpgrades: [],
  };
}

// ═══════════════════════════════════════════════════════════════════
// BUILD ARMY from setup + game bonuses
// ═══════════════════════════════════════════════════════════════════
function buildArmy(setup, side, gameState) {
  const units = [];
  const isPlayer = side === 'player';
  const MELEE = [
    'warrior',
    'spearman',
    'berserker',
    'knight',
    'champion',
    'monk',
  ];
  const RANGED = ['archer', 'crossbow', 'catapult'];
  let slot = 0;
  Object.entries(setup).forEach(([type, count]) => {
    for (let i = 0; i < count; i++) {
      const def = ALL_UNITS[type];
      if (!def) continue;
      const spread = count > 1 ? (i / (count - 1) - 0.5) * 70 : 0;
      const baseX = isPlayer ? 50 + slot * 10 : CANVAS_W - 50 - slot * 10;
      const isMelee = MELEE.includes(type);
      const isRanged = RANGED.includes(type);
      const bonusAtk = isPlayer && isMelee ? gameState?.meleeAtkBonus || 0 : 0;
      const bonusDef = isPlayer ? gameState?.defBonus || 0 : 0;
      const bonusHp = isPlayer ? gameState?.bonusHp || 0 : 0;
      const bonusRange =
        isPlayer && isRanged && gameState?.rangedBonus ? 20 : 0;
      const bonusRangeAtk =
        isPlayer && isRanged && gameState?.rangedBonus ? 1 : 0;
      const speedMult = isPlayer ? gameState?.speedMult || 1 : 1;
      const startMorale = 100 + (isPlayer ? gameState?.bonusMorale || 0 : 0);
      units.push({
        id: `${side}-${type}-${i}`,
        type,
        side,
        x: baseX,
        y: GROUND_Y - 8 + spread * 0.35,
        hp: def.hp + bonusHp,
        maxHp: def.hp + bonusHp,
        atk: def.atk + bonusAtk + bonusRangeAtk,
        def: def.def + bonusDef,
        speed: def.speed * speedMult,
        range: def.range + bonusRange,
        strongVs: def.strongVs,
        weakVs: def.weakVs,
        morale: Math.min(100, startMorale),
        target: null,
        attackCooldown: Math.random() * 60,
        state: 'advance',
        facing: isPlayer ? 1 : -1,
        wobble: Math.random() * Math.PI * 2,
        color: isPlayer ? def.color : def.enemyColor,
        shielded: false,
        berserk: false,
        inspired: false,
        isChampion: type === 'champion',
      });
      slot++;
    }
  });
  return units;
}

// ═══════════════════════════════════════════════════════════════════
// DRAWING
// ═══════════════════════════════════════════════════════════════════
function drawBg(ctx, w, h) {
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  sky.addColorStop(0, '#1e1206');
  sky.addColorStop(1, '#5a3e12');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.65);
  const gnd = ctx.createLinearGradient(0, h * 0.6, 0, h);
  gnd.addColorStop(0, '#3e2e0e');
  gnd.addColorStop(1, '#1e160a');
  ctx.fillStyle = gnd;
  ctx.fillRect(0, h * 0.6, w, h * 0.4);
  ctx.strokeStyle = '#7a5810';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 22);
  ctx.lineTo(w, GROUND_Y + 22);
  ctx.stroke();
  ctx.fillStyle = 'rgba(50,35,8,0.5)';
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y + 18);
  [0, 70, 150, 230, 310, 390, 470, 550, 630, 710, 760].forEach((x, i) => {
    ctx.lineTo(
      x,
      GROUND_Y + 18 - Math.sin(i * 0.85) * 16 - Math.sin(i * 1.6) * 7
    );
  });
  ctx.lineTo(w, GROUND_Y + 22);
  ctx.lineTo(0, GROUND_Y + 22);
  ctx.fill();
}

function drawUnit(ctx, u, t) {
  if (u.state === 'dead') return;
  const routing = u.morale < ROUT_THRESHOLD;
  const wobble =
    Math.sin(t * 0.05 + u.wobble) *
    (routing ? 5 : u.state === 'attack' ? 3 : 1);
  const x = u.x,
    y = u.y + wobble;
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(x, GROUND_Y + 20, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  const size =
    u.type === 'knight'
      ? 24
      : u.type === 'champion'
      ? 26
      : u.type === 'cavalry'
      ? 22
      : u.type === 'catapult'
      ? 20
      : u.type === 'warrior' || u.type === 'spearman' || u.type === 'berserker'
      ? 18
      : 14;
  if (u.berserk) {
    ctx.shadowColor = '#ff4400';
    ctx.shadowBlur = 20;
  } else if (u.shielded) {
    ctx.shadowColor = '#4488ff';
    ctx.shadowBlur = 14;
  } else if (u.isChampion) {
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 18;
  } else if (u.state === 'attack') {
    ctx.shadowColor = u.color;
    ctx.shadowBlur = 10;
  }
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = routing ? '#555' : u.color;
  ctx.fill();
  ctx.strokeStyle = routing ? '#888' : 'rgba(255,220,100,0.7)';
  ctx.lineWidth = u.isChampion ? 2.5 : 1.5;
  ctx.stroke();
  ctx.shadowBlur = 0;
  const em = ALL_UNITS[u.type]?.emoji || '⚔️';
  ctx.font = `${size * 1.15}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(em, x, y - 1);
  if (routing) {
    ctx.font = '10px serif';
    ctx.fillText('💨', x + size * 0.8, y - size * 0.7);
  }
  const bw = size * 2.4,
    bh = 4,
    bx = x - bw / 2,
    by = y - size - 11;
  ctx.fillStyle = '#111';
  ctx.fillRect(bx, by, bw, bh);
  const hp = u.hp / u.maxHp;
  ctx.fillStyle = hp > 0.6 ? '#4aaa4a' : hp > 0.3 ? '#aaaa4a' : '#aa4a4a';
  ctx.fillRect(bx, by, bw * hp, bh);
  const mp = u.morale / 100;
  ctx.fillStyle = '#222';
  ctx.fillRect(bx, by + 5, bw, 3);
  ctx.fillStyle = mp > 0.5 ? '#4a8aff' : mp > 0.25 ? '#ffaa4a' : '#ff4a4a';
  ctx.fillRect(bx, by + 5, bw * mp, 3);
}

function drawArrow(ctx, a) {
  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(Math.atan2(a.vy, a.vx));
  ctx.strokeStyle = '#D4A850';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(8, 0);
  ctx.stroke();
  ctx.fillStyle = '#D4A850';
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(4, -3);
  ctx.lineTo(4, 3);
  ctx.fill();
  ctx.restore();
}
function drawFx(ctx, p) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, (p.life / p.maxLife) * 0.7);
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function drawSword(ctx, s) {
  ctx.save();
  ctx.globalAlpha = s.life / s.maxLife;
  ctx.translate(s.x, s.y);
  ctx.rotate(s.angle);
  ctx.strokeStyle = s.color || '#FFD700';
  ctx.lineWidth = 3;
  ctx.shadowColor = s.color || '#FFD700';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(-13, 0);
  ctx.lineTo(13, 0);
  ctx.stroke();
  ctx.restore();
}
function drawBanner(ctx, banner, w) {
  if (!banner || banner.life <= 0) return;
  const alpha =
    Math.min(1, banner.life / 20) *
    Math.min(1, (banner.maxLife - banner.life) / 15);
  ctx.save();
  ctx.globalAlpha = alpha;
  const bw = 420,
    bh = 44,
    bx = (w - bw) / 2,
    by = 8;
  ctx.fillStyle = 'rgba(20,10,2,0.88)';
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 6);
  ctx.fill();
  ctx.strokeStyle = '#D4A850';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 6);
  ctx.stroke();
  ctx.fillStyle = '#FFE87A';
  ctx.font = 'bold 15px Georgia,serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(banner.label, w / 2, by + 14);
  ctx.fillStyle = 'rgba(255,220,160,0.85)';
  ctx.font = '12px Georgia,serif';
  ctx.fillText(banner.desc, w / 2, by + 30);
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('campaign'); // campaign | setup | battle | result | upgrade
  const [gameState, setGameState] = useState(initGameState);
  const [army, setArmy] = useState({});
  const [battleResult, setBattleResult] = useState(null);
  const [chronicle, setChronicle] = useState([]);

  const canvasRef = useRef(null);
  const simRef = useRef(null);
  const rafRef = useRef(null);
  const liveLogRef = useRef([]);
  const chronicleRef = useRef([]);

  const currentLevel =
    CAMPAIGN[Math.min(gameState.level - 1, CAMPAIGN.length - 1)];
  const isMaxLevel = gameState.level > CAMPAIGN.length;

  function addLog(text, type = 'neutral') {
    const e = { text, type, time: chronicleRef.current.length };
    chronicleRef.current = [e, ...chronicleRef.current].slice(0, 150);
    liveLogRef.current = [text, ...liveLogRef.current].slice(0, 5);
  }

  function startSetup() {
    setArmy({});
    setScreen('setup');
  }

  function launchBattle() {
    if (!Object.values(army).some((c) => c > 0)) return;
    const lvl = currentLevel;
    chronicleRef.current = [];
    liveLogRef.current = [];
    addLog(`⚔️ Level ${lvl.level}: ${lvl.name}`, 'event');
    const pu = buildArmy(army, 'player', gameState);
    const eu = buildArmy(lvl.enemy, 'enemy', gameState);
    const pDesc = Object.entries(army)
      .filter(([, c]) => c > 0)
      .map(([t, c]) => `${c} ${ALL_UNITS[t]?.name}`)
      .join(', ');
    const eDesc = Object.entries(lvl.enemy)
      .filter(([, c]) => c > 0)
      .map(([t, c]) => `${c} ${ALL_UNITS[t]?.name}`)
      .join(', ');
    addLog(`📜 Your force: ${pDesc}.`, 'player');
    addLog(`📜 Enemy force: ${eDesc}.`, 'enemy');
    simRef.current = {
      playerUnits: pu,
      enemyUnits: eu,
      arrows: [],
      swords: [],
      fx: [],
      tick: 0,
      done: false,
      winner: null,
      eventCooldown: gameState.startEvent ? 0 : 260,
      pendingStartEvent: gameState.startEvent,
      banner: null,
      stats: { playerKills: 0, enemyKills: 0, events: 0 },
    };
    setScreen('battle');
  }

  // ── Battle loop ──────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'battle') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const MELEE = [
      'warrior',
      'spearman',
      'berserker',
      'knight',
      'champion',
      'monk',
    ];
    const RANGED = ['archer', 'crossbow', 'catapult'];
    const CAVELIKE = ['cavalry', 'knight'];

    function fireEvent(S) {
      const alive = (u) => u.hp > 0 && u.state !== 'dead';
      const pu = S.playerUnits.filter(alive),
        eu = S.enemyUnits.filter(alive);
      if (!pu.length || !eu.length) return;
      const hasRanged = (u) => RANGED.includes(u.type);
      const hasCav = (u) => CAVELIKE.includes(u.type);
      const hasMelee = (u) => MELEE.includes(u.type);
      const eligible = BATTLE_EVENTS.filter((ev) => {
        if (ev.trigger === 'any') return true;
        if (ev.trigger === 'ranged') return [...pu, ...eu].some(hasRanged);
        if (ev.trigger === 'cavalry') return [...pu, ...eu].some(hasCav);
        if (ev.trigger === 'melee')
          return (
            [...pu, ...eu].some(hasMelee) &&
            [...pu, ...eu].filter(hasMelee).length >= ev.minCount
          );
        if (ev.trigger === 'catapult')
          return [...pu, ...eu].some((u) => u.type === 'catapult');
        return false;
      });
      if (!eligible.length) return;
      const ev = eligible[Math.floor(Math.random() * eligible.length)];
      S.stats.events++;
      S.banner = { label: ev.label, desc: ev.desc, life: 160, maxLife: 160 };
      addLog(`${ev.label} — ${ev.desc}`, 'event');

      if (ev.id === 'volley') {
        [...pu, ...eu].filter(hasRanged).forEach((u) => (u.attackCooldown = 0));
      }
      if (ev.id === 'charge') {
        const cav = [...pu, ...eu].filter(hasCav);
        cav.forEach((u) => {
          const base = ALL_UNITS[u.type].speed;
          u.speed = base * 2.3;
          setTimeout(() => (u.speed = base), 2800);
        });
        for (let i = 0; i < 14; i++)
          S.fx.push({
            x: CANVAS_W / 2 + Math.random() * 120 - 60,
            y: GROUND_Y + Math.random() * 28,
            r: 7 + Math.random() * 7,
            color: '#7a5810',
            life: 38,
            maxLife: 38,
          });
      }
      if (ev.id === 'shield') {
        pu.filter(hasMelee).forEach((u) => {
          u.shielded = true;
          const bd = ALL_UNITS[u.type].def;
          u.def = bd * 2;
          setTimeout(() => {
            u.shielded = false;
            u.def = bd + (gameState?.defBonus || 0);
          }, 4200);
        });
        addLog('🛡 Your melee units form a shield wall!', 'player');
      }
      if (ev.id === 'berserk') {
        const pool = [...pu, ...eu].filter((u) => hasMelee(u) && alive(u));
        if (pool.length) {
          const u = pool[Math.floor(Math.random() * pool.length)];
          u.berserk = true;
          u.atk *= 3;
          u.def = Math.max(1, Math.floor(u.def * 0.4));
          setTimeout(() => {
            u.berserk = false;
            u.atk = ALL_UNITS[u.type].atk;
            u.def = ALL_UNITS[u.type].def;
          }, 5000);
          addLog(
            `🔥 ${u.side === 'player' ? 'One of your' : 'An enemy'} ${
              ALL_UNITS[u.type].name
            } goes BERSERK!`,
            u.side === 'player' ? 'player' : 'enemy'
          );
        }
      }
      if (ev.id === 'flank') {
        const tgt = Math.random() < 0.5 ? eu : pu;
        tgt.forEach((u) => (u.morale = Math.max(0, u.morale - 22)));
        addLog(
          `⚡ ${
            tgt === eu ? 'Enemy' : 'Your'
          } troops are flanked! Morale crumbles.`,
          tgt === eu ? 'player' : 'enemy'
        );
      }
      if (ev.id === 'rain') {
        const tgt = Math.random() < 0.5 ? eu : pu;
        tgt.forEach((u) => {
          if (alive(u)) {
            u.hp = Math.max(0, u.hp - Math.floor(2 + Math.random() * 3));
            u.morale = Math.max(0, u.morale - 10);
          }
        });
        for (let i = 0; i < 22; i++)
          S.arrows.push({
            x: Math.random() * CANVAS_W,
            y: 0,
            vx: (Math.random() - 0.5) * 1.5,
            vy: 3 + Math.random() * 2,
            life: 55,
          });
        addLog(
          `🌧 Arrow rain blankets ${tgt === eu ? 'enemy' : 'your'} lines!`,
          tgt === eu ? 'player' : 'enemy'
        );
      }
      if (ev.id === 'rally') {
        const side = Math.random() < 0.5 ? 'player' : 'enemy';
        const troops = side === 'player' ? pu : eu;
        troops.forEach((u) => {
          if (u.morale < 65) u.morale = 65;
        });
        addLog(
          `🚩 ${
            side === 'player' ? 'Your' : 'Enemy'
          } commander rallies the troops!`,
          side
        );
      }
      if (ev.id === 'inspire') {
        pu.forEach((u) => {
          u.morale = Math.min(100, u.morale + 30);
        });
        addLog('✨ Your troops are inspired! Morale surges!', 'player');
      }
      if (ev.id === 'duel') {
        const pc = [...pu].filter((u) => hasMelee(u) || u.type === 'champion');
        const ec = [...eu].filter((u) => hasMelee(u) || u.type === 'champion');
        if (pc.length && ec.length) {
          const p = pc[Math.floor(Math.random() * pc.length)];
          const e = ec[Math.floor(Math.random() * ec.length)];
          const pW =
            Math.random() < 0.5 + (p.hp / p.maxHp - e.hp / e.maxHp) * 0.35;
          if (pW) {
            e.hp = 0;
            e.state = 'dead';
            S.stats.playerKills++;
            addLog('⚔️ Your champion wins the duel!', 'player');
            pu.forEach((u) => (u.morale = Math.min(100, u.morale + 20)));
            eu.forEach((u) => (u.morale = Math.max(0, u.morale - 20)));
          } else {
            p.hp = 0;
            p.state = 'dead';
            S.stats.enemyKills++;
            addLog('⚔️ The enemy champion wins the duel!', 'enemy');
            eu.forEach((u) => (u.morale = Math.min(100, u.morale + 20)));
            pu.forEach((u) => (u.morale = Math.max(0, u.morale - 20)));
          }
        }
      }
      if (ev.id === 'siege') {
        const catapults = [...pu, ...eu].filter(
          (u) => u.type === 'catapult' && alive(u)
        );
        catapults.forEach((cat) => {
          const targets = cat.side === 'player' ? eu : pu;
          targets.filter(alive).forEach((u) => {
            u.hp = Math.max(0, u.hp - Math.floor(4 + Math.random() * 5));
            u.morale = Math.max(0, u.morale - 15);
          });
          addLog(
            `💣 Catapult barrage! ${
              cat.side === 'player' ? 'Enemy' : 'Your'
            } lines shaken!`,
            cat.side === 'player' ? 'player' : 'enemy'
          );
        });
        for (let i = 0; i < 10; i++)
          S.fx.push({
            x: CANVAS_W / 2 + Math.random() * 200 - 100,
            y: GROUND_Y + Math.random() * 20,
            r: 12 + Math.random() * 10,
            color: '#aa5020',
            life: 45,
            maxLife: 45,
          });
      }
    }

    function frame() {
      const S = simRef.current;
      if (!S) return;
      S.tick++;
      const t = S.tick;
      const alive = (u) => u.hp > 0 && u.state !== 'dead';

      // start event
      if (S.pendingStartEvent && t === 90) {
        const pe = BATTLE_EVENTS.find((e) => e.id === S.pendingStartEvent);
        if (pe) {
          S.banner = {
            label: pe.label,
            desc: pe.desc,
            life: 160,
            maxLife: 160,
          };
          addLog(`${pe.label} — ${pe.desc}`, 'event');
          fireEvent(S);
        }
        S.pendingStartEvent = null;
      }

      // random events
      S.eventCooldown--;
      if (S.eventCooldown <= 0 && !S.done) {
        S.eventCooldown = 260 + Math.floor(Math.random() * 160);
        if (Math.random() < 0.75) fireEvent(S);
      }
      if (S.banner) {
        S.banner.life--;
        if (S.banner.life <= 0) S.banner = null;
      }

      const allUnits = [...S.playerUnits, ...S.enemyUnits];

      if (!S.done) {
        allUnits.filter(alive).forEach((u) => {
          const enemies = (
            u.side === 'player' ? S.enemyUnits : S.playerUnits
          ).filter(alive);
          const friends = (
            u.side === 'player' ? S.playerUnits : S.enemyUnits
          ).filter(alive);
          if (!enemies.length) return;

          // Champion aura
          if (u.isChampion && u.state !== 'dead')
            friends.filter(alive).forEach((f) => {
              if (Math.hypot(f.x - u.x, f.y - u.y) < 80)
                f.morale = Math.min(100, f.morale + 0.02);
            });

          if (u.morale < ROUT_THRESHOLD) {
            u.state = 'rout';
            u.x += u.side === 'player' ? -2 : 2;
            u.morale = Math.max(0, u.morale - 0.3);
            if (
              friends.filter((f) => f.morale > 70).length > 0 &&
              Math.random() < 0.004
            ) {
              u.morale = 50;
              u.state = 'advance';
              addLog(
                `🚩 A ${ALL_UNITS[u.type].name} rallies!`,
                u.side === 'player' ? 'player' : 'enemy'
              );
            }
            return;
          }

          const preferred = enemies.filter((e) => e.type === u.strongVs);
          const pool = preferred.length ? preferred : enemies;
          let tgt = pool[0],
            minD = Infinity;
          pool.forEach((e) => {
            const d = Math.hypot(e.x - u.x, e.y - u.y);
            if (d < minD) {
              minD = d;
              tgt = e;
            }
          });
          u.target = tgt;
          const dist = Math.hypot(tgt.x - u.x, tgt.y - u.y);

          if (dist > u.range) {
            u.state = 'advance';
            const dx = tgt.x - u.x,
              dy = tgt.y - u.y,
              len = Math.hypot(dx, dy);
            u.x += (dx / len) * u.speed;
            u.y += (dy / len) * u.speed * 0.28;
            u.y = Math.max(195, Math.min(GROUND_Y + 12, u.y));
            if (CAVELIKE.includes(u.type) && t % 4 === 0)
              S.fx.push({
                x: u.x - u.facing * 12,
                y: u.y + 16,
                r: 5 + Math.random() * 5,
                color: '#7a5810',
                life: 28,
                maxLife: 28,
              });
          } else {
            u.state = 'attack';
            if (u.attackCooldown <= 0) {
              let mult = 1;
              if (u.strongVs === tgt.type) mult = ADV;
              if (u.weakVs === tgt.type) mult = DIS;
              // catapult has AoE
              const dmg = Math.max(
                1,
                Math.round(
                  u.atk * mult * (0.8 + Math.random() * 0.4) - tgt.def * 0.5
                )
              );
              tgt.hp = Math.max(0, tgt.hp - dmg);
              tgt.morale = Math.max(0, tgt.morale - dmg * 2.2);

              if (RANGED.includes(u.type)) {
                const spd = u.type === 'catapult' ? 3 : 4.5;
                const dx = tgt.x - u.x,
                  dy = tgt.y - u.y,
                  len = Math.hypot(dx, dy);
                S.arrows.push({
                  x: u.x,
                  y: u.y,
                  vx: (dx / len) * spd,
                  vy: (dy / len) * spd,
                  life: 55,
                });
              } else {
                S.swords.push({
                  x: (u.x + tgt.x) / 2,
                  y: (u.y + tgt.y) / 2,
                  angle: Math.random() * Math.PI,
                  life: 18,
                  maxLife: 18,
                  color: u.berserk
                    ? '#ff4400'
                    : u.type === 'knight'
                    ? '#aaddff'
                    : '#FFD700',
                });
                S.fx.push({
                  x: tgt.x + Math.random() * 10 - 5,
                  y: tgt.y + Math.random() * 10 - 5,
                  r: 5 + Math.random() * 4,
                  color: '#aa2020',
                  life: 20,
                  maxLife: 20,
                });
              }

              if (tgt.hp <= 0) {
                tgt.state = 'dead';
                const mine = u.side === 'player';
                mine ? S.stats.playerKills++ : S.stats.enemyKills++;
                const adv = mult >= ADV,
                  dis = mult <= DIS;
                let msg = adv
                  ? `${mine ? 'Your' : 'Enemy'} ${
                      ALL_UNITS[u.type].name
                    } devastates ${mine ? 'enemy' : 'your'} ${
                      ALL_UNITS[tgt.type].name
                    }! 💥`
                  : dis
                  ? `${mine ? 'Your' : 'Enemy'} ${
                      ALL_UNITS[u.type].name
                    } somehow overcomes ${mine ? 'enemy' : 'your'} ${
                      ALL_UNITS[tgt.type].name
                    }! 😮`
                  : `${mine ? 'Your' : 'Enemy'} ${
                      ALL_UNITS[u.type].name
                    } slays ${mine ? 'enemy' : 'your'} ${
                      ALL_UNITS[tgt.type].name
                    }.`;
                addLog(msg, mine ? 'player' : 'enemy');
                const nearby = (
                  u.side === 'player' ? S.enemyUnits : S.playerUnits
                ).filter(
                  (e) => alive(e) && Math.hypot(e.x - tgt.x, e.y - tgt.y) < 85
                );
                nearby.forEach((e) => (e.morale = Math.max(0, e.morale - 12)));
                u.morale = Math.min(100, u.morale + 8);
                friends.forEach((f) => {
                  if (alive(f)) f.morale = Math.min(100, f.morale + 3);
                });
                for (let i = 0; i < 7; i++)
                  S.fx.push({
                    x: tgt.x + Math.random() * 20 - 10,
                    y: tgt.y + Math.random() * 20 - 10,
                    r: 7 + Math.random() * 6,
                    color: i % 2 ? '#aa2020' : '#555',
                    life: 28,
                    maxLife: 28,
                  });
              }

              const cds = {
                archer: 52,
                crossbow: 62,
                warrior: 38,
                spearman: 40,
                cavalry: 28,
                knight: 32,
                berserker: 22,
                monk: 45,
                catapult: 90,
                champion: 35,
              };
              u.attackCooldown = cds[u.type] || 40;
            } else u.attackCooldown--;
          }
        });

        // Narrative beats
        if (t === 180)
          addLog('⚔️ The lines clash! Steel rings across the field.', 'event');
        if (t === 420) {
          const pa = S.playerUnits.filter(alive).length,
            ea = S.enemyUnits.filter(alive).length;
          const pl = S.playerUnits.length - pa,
            el = S.enemyUnits.length - ea;
          if (pl > el)
            addLog('📉 Your forces are taking heavy losses!', 'enemy');
          else if (el > pl) addLog('📈 The enemy is crumbling!', 'player');
          else addLog('⚖️ Both sides grind each other down.', 'event');
        }

        const pA = S.playerUnits.filter(alive).length,
          eA = S.enemyUnits.filter(alive).length;
        if (!pA || !eA) {
          S.done = true;
          S.winner = !pA && !eA ? 'draw' : pA ? 'player' : 'enemy';
          const won = S.winner === 'player',
            draw = S.winner === 'draw';
          const lvl =
            CAMPAIGN[Math.min(gameState.level - 1, CAMPAIGN.length - 1)];
          const goldEarned = won ? lvl.reward : Math.floor(lvl.reward * 0.4);
          if (draw) addLog('💀 Mutual annihilation. No victor.', 'event');
          else if (won) {
            addLog(
              `🏆 VICTORY! ${pA} survivors. +${goldEarned} gold.`,
              'player'
            );
          } else {
            addLog(
              `💀 DEFEAT. ${eA} enemies remain. +${goldEarned} gold.`,
              'enemy'
            );
          }
          setTimeout(() => {
            setGameState((g) => {
              const ng = { ...g, gold: g.gold + goldEarned };
              if (won) ng.level = g.level + 1;
              return ng;
            });
            setBattleResult({
              winner: S.winner,
              pLeft: pA,
              eLeft: eA,
              stats: S.stats,
              goldEarned,
              won,
            });
            setChronicle([...chronicleRef.current].reverse());
            setScreen('result');
          }, 2000);
        }
      }

      S.arrows.forEach((a) => {
        a.x += a.vx;
        a.y += a.vy;
        a.vy += 0.15;
        a.life--;
      });
      S.arrows = S.arrows.filter((a) => a.life > 0);
      S.swords.forEach((s) => {
        s.life--;
        s.angle += 0.18;
      });
      S.swords = S.swords.filter((s) => s.life > 0);
      S.fx.forEach((p) => {
        p.r += 0.2;
        p.life--;
      });
      S.fx = S.fx.filter((p) => p.life > 0);

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawBg(ctx, CANVAS_W, CANVAS_H);
      S.fx.forEach((p) => drawFx(ctx, p));
      const allU = [...S.playerUnits, ...S.enemyUnits];
      allU
        .filter((u) => u.state === 'dead')
        .forEach((u) => {
          ctx.save();
          ctx.globalAlpha = 0.18;
          drawUnit(ctx, { ...u, state: 'advance' }, t);
          ctx.restore();
        });
      allU
        .filter((u) => u.state !== 'dead')
        .forEach((u) => drawUnit(ctx, u, t));
      S.arrows.forEach((a) => drawArrow(ctx, a));
      S.swords.forEach((s) => drawSword(ctx, s));
      drawBanner(ctx, S.banner, CANVAS_W);
      ctx.font = 'bold 11px Georgia,serif';
      ctx.fillStyle = 'rgba(255,220,100,0.6)';
      ctx.textAlign = 'left';
      ctx.fillText('◀ YOUR ARMY', 8, 18);
      ctx.textAlign = 'right';
      ctx.fillText('ENEMY ARMY ▶', CANVAS_W - 8, 18);

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [screen]);

  // ── Upgrade screen ───────────────────────────────────────────────
  function buyUpgrade(key) {
    const upg = ALL_UPGRADES[key];
    if (!upg || upg.purchased) return;
    if (upg.requires && !gameState.purchasedUpgrades.includes(upg.requires))
      return;
    if (gameState.gold < upg.cost) return;
    setGameState((g) => {
      const ng = {
        ...g,
        gold: g.gold - upg.cost,
        purchasedUpgrades: [...g.purchasedUpgrades, key],
      };
      upg.apply(ng);
      upg.purchased = true;
      return ng;
    });
  }
  function unlockUnit(type) {
    const def = ALL_UNITS[type];
    if (!def || def.unlocked) return;
    if (gameState.gold < def.unlockCost) return;
    setGameState((g) => ({
      ...g,
      gold: g.gold - def.unlockCost,
      unlockedUnits: [...g.unlockedUnits, type],
    }));
    def.unlocked = true;
  }

  // ── Render screens ───────────────────────────────────────────────
  return (
    <div style={C.root}>
      <div style={C.parchment}>
        <div style={C.header}>
          <div style={C.hline} />
          <h1 style={C.title}>⚔ FIELD OF BATTLE ⚔</h1>
          <p style={C.sub}>A Medieval Campaign</p>
          <div style={C.hline} />
        </div>

        {/* Gold bar always visible */}
        {screen !== 'campaign' && (
          <div style={C.goldBar}>
            <span style={C.goldLabel}>💰 Gold: {gameState.gold}</span>
            <span style={C.levelLabel}>
              ⚔ Level {gameState.level} —{' '}
              {isMaxLevel ? 'CAMPAIGN COMPLETE' : currentLevel.name}
            </span>
            <span style={C.pointsLabel}>
              🪙 Budget: {gameState.maxPoints}pt
            </span>
          </div>
        )}

        {screen === 'campaign' && (
          <CampaignScreen
            gameState={gameState}
            currentLevel={currentLevel}
            isMaxLevel={isMaxLevel}
            onSetup={startSetup}
            onUpgrade={() => setScreen('upgrade')}
          />
        )}
        {screen === 'setup' && (
          <SetupScreen
            army={army}
            setArmy={setArmy}
            gameState={gameState}
            onBattle={launchBattle}
            onBack={() => setScreen('campaign')}
          />
        )}
        {(screen === 'battle' || screen === 'result') && (
          <div style={C.battleWrap}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              style={C.canvas}
            />
            {screen === 'battle' && <LiveFeed liveLogRef={liveLogRef} />}
            {screen === 'result' && battleResult && (
              <ResultScreen
                result={battleResult}
                army={army}
                enemySetup={currentLevel?.enemy || {}}
                chronicle={chronicle}
                onUpgrade={() => setScreen('upgrade')}
                onContinue={() => setScreen('campaign')}
                gameState={gameState}
              />
            )}
          </div>
        )}
        {screen === 'upgrade' && (
          <UpgradeScreen
            gameState={gameState}
            onBuy={buyUpgrade}
            onUnlock={unlockUnit}
            onBack={() => setScreen('campaign')}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CAMPAIGN SCREEN
// ═══════════════════════════════════════════════════════════════════
function CampaignScreen({
  gameState,
  currentLevel,
  isMaxLevel,
  onSetup,
  onUpgrade,
}) {
  return (
    <div style={C.section}>
      <div style={C.campaignHeader}>
        <div style={C.levelBadge}>LEVEL {gameState.level}</div>
        <div style={C.campaignTitle}>
          {isMaxLevel ? '🏆 Campaign Complete!' : currentLevel.name}
        </div>
        <div style={C.campaignSub}>
          {isMaxLevel
            ? 'You have conquered all enemies!'
            : ` Defeat the enemy to earn ${currentLevel.reward} gold`}
        </div>
      </div>
      <div style={C.statsRow}>
        <StatPill icon="💰" label="Gold" val={gameState.gold} />
        <StatPill icon="🪙" label="Budget" val={`${gameState.maxPoints}pt`} />
        <StatPill
          icon="🔓"
          label="Units"
          val={gameState.unlockedUnits.length}
        />
        <StatPill
          icon="📜"
          label="Upgrades"
          val={gameState.purchasedUpgrades.length}
        />
      </div>
      <div style={C.progressBar}>
        {CAMPAIGN.map((l, i) => (
          <div
            key={i}
            style={{
              ...C.progressStep,
              background:
                i + 1 < gameState.level
                  ? '#8B6914'
                  : i + 1 === gameState.level
                  ? '#D4A850'
                  : 'rgba(139,105,20,.2)',
              borderColor:
                i + 1 === gameState.level ? '#FFD700' : 'transparent',
            }}
          >
            <span
              style={{
                fontSize: '.7rem',
                color: i + 1 <= gameState.level ? '#FFF8E7' : '#8B6914',
              }}
            >
              {i + 1}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {!isMaxLevel && (
          <button style={C.btn} onClick={onSetup}>
            ⚔ Deploy Army
          </button>
        )}
        <button
          style={{
            ...C.btn,
            background: 'linear-gradient(135deg,#2a3a5a,#3a5a8a)',
          }}
          onClick={onUpgrade}
        >
          🔬 Upgrades & Recruits
        </button>
      </div>
      {gameState.level > 1 && (
        <div style={C.loreBox}>
          <div style={C.loreTitle}>— Campaign Progress —</div>
          {CAMPAIGN.map((l, i) => (
            <div
              key={i}
              style={{
                ...C.loreRow,
                color:
                  i + 1 < gameState.level
                    ? '#6aaa4a'
                    : i + 1 === gameState.level
                    ? '#FFD070'
                    : '#5C3A1E',
              }}
            >
              {i + 1 < gameState.level
                ? '✅'
                : i + 1 === gameState.level
                ? '⚔️'
                : '🔒'}{' '}
              Level {l.level}: {l.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function StatPill({ icon, label, val }) {
  return (
    <div style={C.statPill}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span>
      <div style={{ fontSize: '.7rem', color: '#6B4C2A' }}>{label}</div>
      <div style={{ fontWeight: 'bold', color: '#3B2008' }}>{val}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SETUP SCREEN
// ═══════════════════════════════════════════════════════════════════
function SetupScreen({ army, setArmy, gameState, onBattle, onBack }) {
  const used = Object.entries(army).reduce(
    (s, [t, c]) => s + (ALL_UNITS[t]?.cost || 0) * c,
    0
  );
  const left = gameState.maxPoints - used;
  const total = Object.values(army).reduce((s, c) => s + c, 0);
  function adj(type, d) {
    const nc = (army[type] || 0) + d;
    if (nc < 0) return;
    if (d > 0 && left < (ALL_UNITS[type]?.cost || 99)) return;
    setArmy((a) => ({ ...a, [type]: nc }));
  }
  const available = gameState.unlockedUnits;
  return (
    <div style={C.section}>
      <div style={C.triangleHint}>
        🏹▶⚔️▶🐴▶🏹 &nbsp;|&nbsp; 🪃 Spearman crushes cavalry &nbsp;|&nbsp; 🎯
        Crossbow outranges archers
      </div>
      <div style={C.budgetRow}>
        <span style={C.budLabel}>BUDGET</span>
        <div style={C.budTrack}>
          {Array.from({ length: gameState.maxPoints }).map((_, i) => (
            <div
              key={i}
              style={{
                ...C.pip,
                background:
                  i < gameState.maxPoints - left ? '#8B6914' : '#D4B896',
              }}
            />
          ))}
        </div>
        <span style={C.budNum}>
          {left}/{gameState.maxPoints}
        </span>
      </div>
      <div style={C.unitGrid}>
        {available.map((type) => {
          const u = ALL_UNITS[type];
          if (!u) return null;
          return (
            <div key={type} style={C.unitCard}>
              <div style={C.uEmoji}>{u.emoji}</div>
              <div style={C.uName}>{u.name}</div>
              <div style={C.uDesc}>{u.desc}</div>
              <div style={C.uStats}>
                <span>❤️{u.hp}</span>
                <span>⚔{u.atk}</span>
                <span>🛡{u.def}</span>
                <span>💰{u.cost}pt</span>
              </div>
              <div style={C.uStrong}>
                ✅ vs {ALL_UNITS[u.strongVs]?.name || u.strongVs}
              </div>
              <div style={C.uWeak}>
                ❌ vs {ALL_UNITS[u.weakVs]?.name || u.weakVs}
              </div>
              <div style={C.counter}>
                <button style={C.cBtn} onClick={() => adj(type, -1)}>
                  −
                </button>
                <span style={C.cNum}>{army[type] || 0}</span>
                <button
                  style={{ ...C.cBtn, opacity: left < u.cost ? 0.3 : 1 }}
                  onClick={() => adj(type, 1)}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div style={C.summaryRow}>
        {Object.entries(army)
          .filter(([, c]) => c > 0)
          .map(([t, c]) => (
            <span key={t} style={C.pill}>
              {ALL_UNITS[t].emoji}
              {c}×{ALL_UNITS[t].name}
            </span>
          ))}
        {total === 0 && <span style={C.emptyTxt}>No troops yet…</span>}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          style={{ ...C.btn, background: 'rgba(60,40,15,.5)', flex: 0.4 }}
          onClick={onBack}
        >
          ← Back
        </button>
        <button
          style={{ ...C.btn, opacity: total ? 1 : 0.4, flex: 1 }}
          onClick={onBattle}
          disabled={!total}
        >
          ⚔ MARCH TO BATTLE ⚔
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LIVE FEED
// ═══════════════════════════════════════════════════════════════════
function LiveFeed({ liveLogRef }) {
  const [lines, setLines] = useState([]);
  useEffect(() => {
    const id = setInterval(() => setLines([...liveLogRef.current]), 180);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={C.liveLog}>
      {!lines.length && (
        <span
          style={{ color: '#9B7A3A', fontStyle: 'italic', fontSize: '.82rem' }}
        >
          Armies advancing…
        </span>
      )}
      {lines.map((l, i) => (
        <div
          key={i}
          style={{
            color: l.includes('Your')
              ? '#6aaa4a'
              : l.includes('event') || l.startsWith('⚔')
              ? '#FFD070'
              : '#dd6666',
            fontSize: '.82rem',
            lineHeight: 1.5,
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// RESULT SCREEN
// ═══════════════════════════════════════════════════════════════════
function ResultScreen({
  result,
  army,
  enemySetup,
  chronicle,
  onUpgrade,
  onContinue,
  gameState,
}) {
  const { winner, pLeft, eLeft, stats, goldEarned, won } = result;
  const draw = winner === 'draw';
  const [tab, setTab] = useState('summary');
  return (
    <div style={C.resultBox}>
      <div
        style={{
          ...C.resultBanner,
          background: draw ? '#3B2F0A' : won ? '#1a3a1a' : '#3a1a1a',
        }}
      >
        <span style={{ fontSize: '2.5rem' }}>
          {draw ? '⚔️' : won ? '🏆' : '💀'}
        </span>
        <span
          style={{
            fontSize: '1.7rem',
            color: '#FFF8E7',
            letterSpacing: '.18em',
            fontWeight: 'bold',
            textShadow: '2px 2px 0 rgba(0,0,0,.5)',
          }}
        >
          {draw ? 'MUTUAL ANNIHILATION' : won ? 'VICTORY!' : 'DEFEAT!'}
        </span>
        <span
          style={{
            color: 'rgba(255,248,231,.8)',
            fontStyle: 'italic',
            fontSize: '.9rem',
          }}
        >
          {draw
            ? 'Both armies destroyed each other.'
            : won
            ? `${pLeft} survivor${pLeft !== 1 ? 's' : ''} — campaign advances!`
            : `${eLeft} enemies remain. Regroup and try again.`}
        </span>
        <span
          style={{ color: '#FFD070', fontWeight: 'bold', fontSize: '1rem' }}
        >
          +{goldEarned} 💰 gold earned
        </span>
      </div>
      <div style={C.tabs}>
        {['summary', 'chronicle'].map((t) => (
          <button
            key={t}
            style={{
              ...C.tab,
              background: tab === t ? '#8B6914' : 'rgba(139,105,20,.15)',
              color: tab === t ? '#FFF8E7' : '#5C3A1E',
            }}
            onClick={() => setTab(t)}
          >
            {t === 'summary' ? '📊 Summary' : '📜 Chronicle'}
          </button>
        ))}
      </div>
      {tab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <StatBox2
              label="Enemy Slain"
              val={stats.playerKills}
              color="#4aaa4a"
            />
            <StatBox2
              label="Your Losses"
              val={stats.enemyKills}
              color="#dd6666"
            />
            <StatBox2 label="Survivors" val={pLeft} color="#4a8aff" />
            <StatBox2 label="Events" val={stats.events} color="#FFD070" />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={C.compareCol}>
              <div style={C.colLabel}>Your Army</div>
              {Object.entries(army)
                .filter(([, c]) => c > 0)
                .map(([t, c]) => (
                  <div
                    key={t}
                    style={{
                      color: '#5C3A1E',
                      fontSize: '.86rem',
                      marginBottom: '3px',
                    }}
                  >
                    {ALL_UNITS[t]?.emoji} {c}× {ALL_UNITS[t]?.name}
                  </div>
                ))}
            </div>
            <div style={C.compareCol}>
              <div style={C.colLabel}>Enemy Army</div>
              {Object.entries(enemySetup)
                .filter(([, c]) => c > 0)
                .map(([t, c]) => (
                  <div
                    key={t}
                    style={{
                      color: '#5C3A1E',
                      fontSize: '.86rem',
                      marginBottom: '3px',
                    }}
                  >
                    {ALL_UNITS[t]?.emoji} {c}× {ALL_UNITS[t]?.name}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      {tab === 'chronicle' && (
        <div style={C.chronicleBox}>
          <div style={C.chronicleTitle}>— Battle Chronicle —</div>
          <div style={C.chronicleScroll}>
            {chronicle.map((e, i) => (
              <div
                key={i}
                style={{
                  fontSize: '.82rem',
                  lineHeight: 1.6,
                  color:
                    e.type === 'player'
                      ? '#6aaa4a'
                      : e.type === 'enemy'
                      ? '#dd6666'
                      : e.type === 'event'
                      ? '#FFD070'
                      : '#c8b070',
                }}
              >
                {e.text}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          style={{
            ...C.btn,
            background: 'linear-gradient(135deg,#2a3a5a,#3a5a8a)',
          }}
          onClick={onUpgrade}
        >
          🔬 Spend Gold
        </button>
        <button style={C.btn} onClick={onContinue}>
          {won ? '▶ Next Level' : '🔄 Try Again'}
        </button>
      </div>
    </div>
  );
}
function StatBox2({ label, val, color }) {
  return (
    <div style={{ ...C.statBox, borderColor: color, flex: 1 }}>
      <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color }}>{val}</div>
      <div
        style={{ fontSize: '.73rem', color: '#5C3A1E', letterSpacing: '.08em' }}
      >
        {label}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// UPGRADE SCREEN
// ═══════════════════════════════════════════════════════════════════
function UpgradeScreen({ gameState, onBuy, onUnlock, onBack }) {
  const [tab, setTab] = useState('units');
  const locked = Object.entries(ALL_UNITS).filter(
    ([, u]) =>
      !gameState.unlockedUnits.includes(u.name.toLowerCase()) && !u.unlocked
  );
  const lockedUnits = Object.entries(ALL_UNITS).filter(
    ([k]) => !gameState.unlockedUnits.includes(k)
  );
  return (
    <div style={C.section}>
      <div style={C.upgradeHeader}>
        <span
          style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3B2008' }}
        >
          🔬 Command Tent
        </span>
        <span style={{ color: '#8B6914', fontWeight: 'bold' }}>
          💰 {gameState.gold} gold available
        </span>
      </div>
      <div style={C.tabs}>
        {['units', 'upgrades'].map((t) => (
          <button
            key={t}
            style={{
              ...C.tab,
              background: tab === t ? '#8B6914' : 'rgba(139,105,20,.15)',
              color: tab === t ? '#FFF8E7' : '#5C3A1E',
            }}
            onClick={() => setTab(t)}
          >
            {t === 'units' ? '⚔️ Recruit Units' : '🔬 Army Upgrades'}
          </button>
        ))}
      </div>

      {tab === 'units' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {lockedUnits.length === 0 && (
            <div
              style={{
                color: '#5C3A1E',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '16px',
              }}
            >
              All units unlocked!
            </div>
          )}
          {lockedUnits.map(([key, u]) => {
            const canAfford = gameState.gold >= u.unlockCost;
            return (
              <div
                key={key}
                style={{ ...C.upgradeCard, opacity: canAfford ? 1 : 0.65 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: '1.8rem' }}>{u.emoji}</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        color: '#3B2008',
                        fontSize: '.95rem',
                      }}
                    >
                      {u.name}{' '}
                      <span
                        style={{
                          fontSize: '.72rem',
                          color: '#8B6914',
                          background: 'rgba(139,105,20,.15)',
                          padding: '1px 6px',
                          borderRadius: '3px',
                        }}
                      >
                        Tier {u.tier}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '.78rem',
                        color: '#6B4C2A',
                        marginTop: '2px',
                      }}
                    >
                      {u.desc}
                    </div>
                    <div
                      style={{
                        fontSize: '.72rem',
                        color: '#5C3A1E',
                        marginTop: '3px',
                      }}
                    >
                      ❤️{u.hp} ⚔{u.atk} 🛡{u.def} 💰{u.cost}pt each
                    </div>
                  </div>
                </div>
                <button
                  style={{ ...C.unlockBtn, opacity: canAfford ? 1 : 0.4 }}
                  onClick={() => onUnlock(key)}
                  disabled={!canAfford}
                >
                  {u.unlockCost}💰 Recruit
                </button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'upgrades' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(ALL_UPGRADES).map(([key, upg]) => {
            const bought = gameState.purchasedUpgrades.includes(key);
            const reqOk =
              !upg.requires ||
              gameState.purchasedUpgrades.includes(upg.requires);
            const canAfford = gameState.gold >= upg.cost && !bought && reqOk;
            return (
              <div
                key={key}
                style={{
                  ...C.upgradeCard,
                  opacity: bought ? 0.5 : canAfford ? 1 : 0.65,
                  background: bought
                    ? 'rgba(100,150,100,.15)'
                    : 'rgba(255,245,220,.6)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>{upg.emoji}</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 'bold',
                        color: '#3B2008',
                        fontSize: '.92rem',
                      }}
                    >
                      {upg.name} {bought && '✅'}
                    </div>
                    <div
                      style={{
                        fontSize: '.78rem',
                        color: '#6B4C2A',
                        marginTop: '2px',
                      }}
                    >
                      {upg.desc}
                    </div>
                    {upg.requires &&
                      !gameState.purchasedUpgrades.includes(upg.requires) && (
                        <div
                          style={{
                            fontSize: '.72rem',
                            color: '#8B1A1A',
                            marginTop: '2px',
                          }}
                        >
                          Requires: {ALL_UPGRADES[upg.requires]?.name}
                        </div>
                      )}
                  </div>
                </div>
                {!bought && (
                  <button
                    style={{ ...C.unlockBtn, opacity: canAfford ? 1 : 0.4 }}
                    onClick={() => onBuy(key)}
                    disabled={!canAfford}
                  >
                    {upg.cost}💰
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <button
        style={{ ...C.btn, background: 'rgba(60,40,15,.5)' }}
        onClick={onBack}
      >
        ← Back to Campaign
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════
const C = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#1a1208,#0d0a04)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '20px 14px',
    fontFamily: "Georgia,'Times New Roman',serif",
  },
  parchment: {
    background: 'linear-gradient(160deg,#f5e6c8,#e8d5a3 40%,#dfc990)',
    borderRadius: '4px',
    maxWidth: '840px',
    width: '100%',
    boxShadow: '0 0 0 3px #8B6914,0 0 0 6px #5C3A1E,0 20px 60px rgba(0,0,0,.8)',
    padding: '24px 22px',
  },
  header: { textAlign: 'center', marginBottom: '16px' },
  hline: {
    height: '2px',
    background: 'linear-gradient(to right,transparent,#8B6914,transparent)',
    margin: '5px 0',
  },
  title: {
    fontSize: '1.85rem',
    color: '#3B2008',
    letterSpacing: '.15em',
    margin: '5px 0 2px',
    textShadow: '1px 1px 0 #D4A853',
  },
  sub: { color: '#6B4C2A', fontSize: '.85rem', fontStyle: 'italic', margin: 0 },
  goldBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(139,105,20,.12)',
    border: '1px solid #C4A050',
    borderRadius: '4px',
    padding: '6px 14px',
    marginBottom: '14px',
    fontSize: '.82rem',
  },
  goldLabel: { color: '#5C3A1E', fontWeight: 'bold' },
  levelLabel: { color: '#3B2008', fontWeight: 'bold', letterSpacing: '.05em' },
  pointsLabel: { color: '#5C3A1E', fontWeight: 'bold' },
  section: { display: 'flex', flexDirection: 'column', gap: '14px' },
  campaignHeader: {
    textAlign: 'center',
    padding: '14px',
    background: 'rgba(139,105,20,.1)',
    border: '2px solid #C4A050',
    borderRadius: '4px',
  },
  levelBadge: {
    display: 'inline-block',
    background: '#8B6914',
    color: '#FFF8E7',
    borderRadius: '3px',
    padding: '2px 10px',
    fontSize: '.72rem',
    letterSpacing: '.1em',
    marginBottom: '6px',
  },
  campaignTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#3B2008',
    letterSpacing: '.08em',
  },
  campaignSub: {
    color: '#6B4C2A',
    fontSize: '.84rem',
    fontStyle: 'italic',
    marginTop: '4px',
  },
  statsRow: { display: 'flex', gap: '8px' },
  statPill: {
    flex: 1,
    background: 'rgba(255,245,220,.7)',
    border: '1px solid #C4A050',
    borderRadius: '4px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  progressBar: { display: 'flex', gap: '4px' },
  progressStep: {
    flex: 1,
    height: '22px',
    borderRadius: '3px',
    border: '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .2s',
  },
  loreBox: {
    background: 'rgba(10,8,4,.05)',
    border: '1px solid #C4A050',
    borderRadius: '4px',
    padding: '12px',
  },
  loreTitle: {
    fontWeight: 'bold',
    color: '#5C3A1E',
    fontSize: '.78rem',
    letterSpacing: '.1em',
    marginBottom: '8px',
    textAlign: 'center',
  },
  loreRow: { fontSize: '.82rem', marginBottom: '3px', lineHeight: 1.5 },
  triangleHint: {
    textAlign: 'center',
    background: 'rgba(139,105,20,.1)',
    border: '1px solid #C4A050',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '.78rem',
    color: '#5C3A1E',
  },
  budgetRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(139,105,20,.1)',
    border: '1px solid #8B6914',
    borderRadius: '4px',
    padding: '8px 12px',
  },
  budLabel: {
    color: '#5C3A1E',
    fontWeight: 'bold',
    fontSize: '.72rem',
    letterSpacing: '.1em',
    whiteSpace: 'nowrap',
  },
  budTrack: { display: 'flex', gap: '2px', flex: 1 },
  pip: {
    height: '10px',
    flex: 1,
    borderRadius: '2px',
    transition: 'background .2s',
  },
  budNum: {
    color: '#3B2008',
    fontWeight: 'bold',
    fontSize: '.8rem',
    whiteSpace: 'nowrap',
  },
  unitGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(185px,1fr))',
    gap: '10px',
  },
  unitCard: {
    background: 'rgba(255,245,220,.6)',
    border: '2px solid #8B6914',
    borderRadius: '4px',
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  uEmoji: { fontSize: '1.6rem', textAlign: 'center' },
  uName: {
    fontWeight: 'bold',
    color: '#3B2008',
    fontSize: '.95rem',
    textAlign: 'center',
  },
  uDesc: {
    color: '#6B4C2A',
    fontSize: '.72rem',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 1.35,
  },
  uStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '.72rem',
    color: '#5C3A1E',
    padding: '3px 0',
    borderTop: '1px solid #C4A050',
    borderBottom: '1px solid #C4A050',
  },
  uStrong: { fontSize: '.7rem', color: '#2C5A1E' },
  uWeak: { fontSize: '.7rem', color: '#8B1A1A' },
  counter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '2px',
  },
  cBtn: {
    width: '26px',
    height: '26px',
    background: '#8B6914',
    color: '#FFF8E7',
    border: 'none',
    borderRadius: '3px',
    fontSize: '1rem',
    cursor: 'pointer',
    lineHeight: 1,
  },
  cNum: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#3B2008',
    minWidth: '22px',
    textAlign: 'center',
  },
  summaryRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    padding: '9px',
    background: 'rgba(139,105,20,.08)',
    border: '1px dashed #8B6914',
    borderRadius: '4px',
    minHeight: '36px',
    alignItems: 'center',
  },
  pill: {
    background: '#8B6914',
    color: '#FFF8E7',
    borderRadius: '3px',
    padding: '3px 8px',
    fontSize: '.78rem',
  },
  emptyTxt: { color: '#8B6914', fontStyle: 'italic', fontSize: '.78rem' },
  btn: {
    background: 'linear-gradient(135deg,#5C3A1E,#8B6914)',
    color: '#FFF8E7',
    border: '2px solid #3B2008',
    padding: '12px 0',
    fontSize: '.92rem',
    letterSpacing: '.12em',
    cursor: 'pointer',
    borderRadius: '3px',
    fontWeight: 'bold',
    boxShadow: '0 4px 12px rgba(0,0,0,.3)',
    width: '100%',
    fontFamily: 'Georgia,serif',
  },
  battleWrap: { display: 'flex', flexDirection: 'column', gap: '10px' },
  canvas: {
    width: '100%',
    height: 'auto',
    borderRadius: '4px',
    border: '2px solid #5C3A1E',
    boxShadow: '0 4px 20px rgba(0,0,0,.5)',
    display: 'block',
  },
  liveLog: {
    background: 'rgba(10,8,4,.78)',
    border: '1px solid #5C3A1E',
    borderRadius: '4px',
    padding: '9px 13px',
    minHeight: '54px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  resultBox: { display: 'flex', flexDirection: 'column', gap: '12px' },
  resultBanner: {
    borderRadius: '4px',
    padding: '16px 20px',
    border: '2px solid #3B2008',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  tabs: { display: 'flex', gap: '8px' },
  tab: {
    flex: 1,
    padding: '8px 0',
    border: '2px solid #8B6914',
    borderRadius: '4px',
    cursor: 'pointer',
    fontFamily: 'Georgia,serif',
    fontWeight: 'bold',
    fontSize: '.82rem',
    letterSpacing: '.04em',
  },
  statBox: {
    background: 'rgba(255,245,220,.6)',
    border: '2px solid',
    borderRadius: '4px',
    padding: '10px',
    textAlign: 'center',
  },
  compareCol: {
    flex: 1,
    background: 'rgba(255,245,220,.6)',
    border: '1px solid #C4A050',
    borderRadius: '4px',
    padding: '10px',
  },
  colLabel: {
    fontWeight: 'bold',
    color: '#3B2008',
    fontSize: '.76rem',
    letterSpacing: '.08em',
    marginBottom: '6px',
    textAlign: 'center',
  },
  chronicleBox: {
    background: 'rgba(10,8,4,.82)',
    border: '1px solid #8B6914',
    borderRadius: '4px',
    padding: '12px',
  },
  chronicleTitle: {
    color: '#D4A850',
    fontWeight: 'bold',
    fontSize: '.82rem',
    textAlign: 'center',
    letterSpacing: '.1em',
    marginBottom: '8px',
  },
  chronicleScroll: {
    maxHeight: '240px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  upgradeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: 'rgba(139,105,20,.1)',
    border: '1px solid #C4A050',
    borderRadius: '4px',
  },
  upgradeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,245,220,.6)',
    border: '2px solid #C4A050',
    borderRadius: '4px',
    padding: '10px 12px',
  },
  unlockBtn: {
    background: 'linear-gradient(135deg,#5C3A1E,#8B6914)',
    color: '#FFF8E7',
    border: '1px solid #3B2008',
    padding: '7px 12px',
    borderRadius: '3px',
    cursor: 'pointer',
    fontFamily: 'Georgia,serif',
    fontWeight: 'bold',
    fontSize: '.8rem',
    whiteSpace: 'nowrap',
  },
};
