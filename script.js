const worldCanvas = document.getElementById("worldCanvas");
const worldCtx = worldCanvas.getContext("2d");
const telemetryCanvas = document.getElementById("telemetryCanvas");
const telemetryCtx = telemetryCanvas.getContext("2d");
const networkCanvas = document.getElementById("networkCanvas");
const networkCtx = networkCanvas.getContext("2d");
const familyTreeCanvas = document.getElementById("familyTreeCanvas");
const familyTreeCtx = familyTreeCanvas.getContext("2d");

const populationStat = document.getElementById("populationStat");
const foodStat = document.getElementById("foodStat");
const birthStat = document.getElementById("birthStat");
const deathStat = document.getElementById("deathStat");
const oldestStat = document.getElementById("oldestStat");
const extinctionStat = document.getElementById("extinctionStat");
const runtimeStat = document.getElementById("runtimeStat");
const lineageStat = document.getElementById("lineageStat");
const creatureDetails = document.getElementById("creatureDetails");
const familyTreeScroll = document.getElementById("familyTreeScroll");
const familyTreeStatus = document.getElementById("familyTreeStatus");
const controlDeck = document.getElementById("controlDeck");
const collapsibleDataPanels = Array.from(document.querySelectorAll("[data-collapsible-panel]"));
const resetControlsButton = document.getElementById("resetControlsButton");
const sampleLongestButton = document.getElementById("sampleLongestButton");
const openHonoredWormsButton = document.getElementById("openHonoredWormsButton");
const openBrainBankButton = document.getElementById("openBrainBankButton");
const brainBankStatus = document.getElementById("brainBankStatus");
const brainBankModal = document.getElementById("brainBankModal");
const brainBankList = document.getElementById("brainBankList");
const honoredWormsModal = document.getElementById("honoredWormsModal");
const honoredWormsList = document.getElementById("honoredWormsList");
const closeHonoredWormsButton = document.getElementById("closeHonoredWormsButton");
const brainBankHabitatCanvas = document.getElementById("brainBankHabitatCanvas");
const brainBankHabitatCtx = brainBankHabitatCanvas.getContext("2d");
const brainBankHabitatPopulation = document.getElementById("brainBankHabitatPopulation");
const brainBankHabitatOldest = document.getElementById("brainBankHabitatOldest");
const brainBankHabitatStored = document.getElementById("brainBankHabitatStored");
const importBrainButton = document.getElementById("importBrainButton");
const closeBrainBankButton = document.getElementById("closeBrainBankButton");
const brainBankFileInput = document.getElementById("brainBankFileInput");

worldCtx.imageSmoothingEnabled = false;
telemetryCtx.imageSmoothingEnabled = false;
networkCtx.imageSmoothingEnabled = false;
familyTreeCtx.imageSmoothingEnabled = false;
brainBankHabitatCtx.imageSmoothingEnabled = false;

const WIDTH = worldCanvas.width;
const HEIGHT = worldCanvas.height;
const TAU = Math.PI * 2;
const CANVAS_FONTS = Object.freeze({
  hero: "20px Courier New",
  title: "18px Courier New",
  section: "14px Courier New",
  panelCopy: "13px Courier New",
  body: "12px Courier New",
  compact: "11px Courier New",
  small: "10px Courier New",
  tiny: "8px Courier New"
});

const DEFAULT_CONFIG = {
  initialCreatures: 18,
  maxCreatures: 36,
  initialFood: 6,
  maxFood: 100,
  creatureRadius: 12,
  foodRadius: 5,
  eyeRange: 150,
  eyeFov: 1.16,
  eyeOffset: 0.52,
  thrust: 0.26,
  sideThrust: 0.18,
  turnRate: 0.04,
  turnDrag: 0.76,
  maxTurnSpeed: 0.095,
  friction: 0.9,
  maxSpeed: 4,
  metabolism: 0.055,
  motionCost: 0.03,
  collisionCost: 0.25,
  energyFromFood: 30,
  startingEnergy: 68,
  maxEnergy: 145,
  mouthReach: 5,
  mouthArc: 0.9,
  minEatingForwardDrive: 0.15,
  minEatingForwardVelocity: 0.18,
  eggHatchFrames: 180,
  birthAnimationFrames: 32,
  juvenileGrowthFrames: 600,
  deathAnimationFrames: 40,
  memoryNeuronCount: 4,
  memoryWriteBlend: 0.22,
  segmentGeneMin: 3,
  segmentGeneMax: 8,
  segmentFollowStiffness: 0.045,
  segmentConstraintPull: 0.18,
  segmentVelocityDamping: 0.9,
  segmentAngleFollow: 0.08,
  segmentAngleCarry: 0.018,
  segmentAngularDamping: 0.62,
  segmentMaxAngularSpeed: 0.14,
  segmentMaxSpeed: 2.4,
  segmentCollisionTransfer: 0.1,
  segmentImpactSpread: 0.58,
  segmentWallBounce: 0.34,
  segmentTurnCurlStrength: 0.9,
  segmentWaveAmplitude: 0.16,
  segmentWaveFrequency: 0.34,
  segmentWaveLag: 0.82,
  segmentWaveVelocityCarry: 0.035,
  segmentWaveAngleInfluence: 0.2,
  slitherSideThrust: 0.045,
  slitherTurnAssist: 0.008,
  segmentSignalSmoothing: 0.14,
  reproduceThreshold: 112,
  reproduceCost: 42,
  maturityAge: 850,
  reproduceChance: 0.0055,
  foodSpawnChance: 0.06,
  mutationRate: 0.14,
  mutationScale: 0.28,
  hiddenLayerSizes: [8, 8, 8],
  wallPointGap: 28,
  foodLifetimeFrames: 1800,
  extinctionDelay: 450,
  maxSparks: 80,
  networkValueSmoothing: 0.2,
  connectionGlowAttack: 0.34,
  connectionGlowDecay: 0.1,
  startupIntroFrames: 210,
  soundVolume: 0.3
};

const CONFIG = {
  ...DEFAULT_CONFIG
};

const SENSOR_INPUT_LABELS = [
  "L Food D",
  "L Food A",
  "L Creature D",
  "L Creature A",
  "L Wall D",
  "L Wall A",
  "R Food D",
  "R Food A",
  "R Creature D",
  "R Creature A",
  "R Wall D",
  "R Wall A"
];

const SENSOR_INPUT_COLORS = [
  "#80ff88",
  "#9ee8ff",
  "#ffb447",
  "#ffd277",
  "#66dcff",
  "#8ed7ff",
  "#80ff88",
  "#9ee8ff",
  "#ffb447",
  "#ffd277",
  "#66dcff",
  "#8ed7ff"
];
const MEMORY_INPUT_LABELS = Array.from(
  { length: CONFIG.memoryNeuronCount },
  (_, index) => `MEM ${index + 1}`
);
const MEMORY_INPUT_COLORS = Array.from(
  { length: CONFIG.memoryNeuronCount },
  (_, index) => ["#fff17b", "#ffd277", "#ffb447", "#ff9a6e"][index % 4]
);
const INPUT_LABELS = [...SENSOR_INPUT_LABELS, ...MEMORY_INPUT_LABELS];
const INPUT_COLORS = [...SENSOR_INPUT_COLORS, ...MEMORY_INPUT_COLORS];
const MOVEMENT_OUTPUT_LABELS = ["FORWARD", "BACKWARD", "LEFT", "RIGHT"];
const MEMORY_OUTPUT_LABELS = Array.from(
  { length: CONFIG.memoryNeuronCount },
  (_, index) => `WRITE M${index + 1}`
);
const OUTPUT_LABELS = [...MOVEMENT_OUTPUT_LABELS, ...MEMORY_OUTPUT_LABELS];
const OUTPUT_COLORS = [
  "#4affd4",
  "#ff6db3",
  "#ffd277",
  "#fff17b",
  ...Array.from(
    { length: CONFIG.memoryNeuronCount },
    (_, index) => ["#8ed7ff", "#80ff88", "#ffb447", "#9ee8ff"][index % 4]
  )
];
const SENSOR_INPUT_COUNT = SENSOR_INPUT_LABELS.length;
const MOVEMENT_OUTPUT_COUNT = MOVEMENT_OUTPUT_LABELS.length;
const TELEMETRY_HISTORY_LIMIT = 220;
const TELEMETRY_SAMPLE_INTERVAL = 6;
const FAMILY_TREE_MIN_HEIGHT = 360;
const FAMILY_TREE_ROW_GAP = 64;
const FAMILY_TREE_MARGIN_X = 58;
const FAMILY_TREE_TOP_PADDING = 34;
const FAMILY_TREE_BOTTOM_PADDING = 30;
const APP_NAME = "NeuroWormSim";
const BRAIN_BANK_FILE_KIND = "neuro-worm-sim-brain-bank-specimen";
const LEGACY_BRAIN_BANK_FILE_KINDS = ["retro-neural-lab-brain-bank-specimen"];
const BRAIN_BANK_FILE_VERSION = 1;
const BRAIN_BANK_HABITAT_REFRESH_INTERVAL = 2;
const BRAIN_BANK_DB_NAME = "neuro-worm-sim";
const LEGACY_BRAIN_BANK_DB_NAMES = ["retro-neural-evolution-lab"];
const BRAIN_BANK_DB_VERSION = 1;
const BRAIN_BANK_DB_STORE = "brainBankSettings";
const BRAIN_BANK_DIR_HANDLE_KEY = "brainBankDirectoryHandle";
const BRAIN_BANK_FOLDER_NAME = "brain-bank";
const BRAIN_BANK_PICKER_ID = "neurowormsim-brain-bank-root";
const TROPHY_WORM_ASSET_FILE_NAME = "c-4555-g-188-age-07311f-20260330-015153.json";
const TROPHY_WORM_NAME = "Trophy Worm";
const TROPHY_WORM_BUNDLE_KEY = "BUNDLED_TROPHY_WORM_PAYLOAD";
const HONORED_WORM_BUNDLE_LIST_KEY = "BUNDLED_HONORED_WORM_PAYLOADS";
const HONORED_WORM_DESCRIPTORS = Object.freeze([
  {
    bundleKey: TROPHY_WORM_BUNDLE_KEY,
    fileName: TROPHY_WORM_ASSET_FILE_NAME,
    displayName: TROPHY_WORM_NAME,
    badgeLabel: "TROPHY",
    sparkColor: "#8ed7ff",
    recentAction: "HONOR",
    note: "Bundled trophy specimen included with the lab."
  },
  {
    fileName: "c-1400-g-77-age-14055f-20260330-160810.json",
    displayName: "Longest-Lived C-1400",
    badgeLabel: "HONORED 02",
    sparkColor: "#fff17b",
    recentAction: "HONOR",
    note: "Bundled honored specimen included with the lab."
  },
  {
    fileName: "c-3471-g-146-age-09281f-20260330-152456.json",
    displayName: "Longest-Lived C-3471",
    badgeLabel: "HONORED 03",
    sparkColor: "#ffb447",
    recentAction: "HONOR",
    note: "Bundled honored specimen included with the lab."
  }
]);
const HONORED_WORM_FILE_NAMES = new Set(
  HONORED_WORM_DESCRIPTORS.map((descriptor) => descriptor.fileName.toLowerCase())
);
const INFLUENCE_TOOL_DEFAULTS = Object.freeze({
  radius: 152,
  creatureImpulse: 0.78,
  creatureSnap: 0.04,
  foodPull: 0.28
});

const CONTROL_DEFS = [
  {
    key: "maxCreatures",
    label: "Max Population",
    min: 6,
    max: 80,
    step: 1,
    note: "Hard population cap. Lowering it trims the weakest creatures first."
  },
  {
    key: "maxFood",
    label: "Max Food",
    min: 12,
    max: 220,
    step: 1,
    note: "Upper limit for food pellets present in the habitat."
  },
  {
    key: "reproduceThreshold",
    label: "Repro Energy",
    min: 40,
    max: 180,
    step: 1,
    note: "Energy needed before a creature is allowed to reproduce."
  },
  {
    key: "energyFromFood",
    label: "Food Energy",
    min: 6,
    max: 70,
    step: 1,
    note: "How much energy each food pickup restores."
  },
  {
    key: "metabolism",
    label: "Metabolism",
    min: 0.01,
    max: 0.2,
    step: 0.005,
    note: "Passive energy drain every tick.",
    format: (value) => value.toFixed(3)
  },
  {
    key: "foodSpawnChance",
    label: "Food Spawn Rate",
    min: 0.01,
    max: 0.2,
    step: 0.01,
    note: "Chance each tick to spawn food while under the cap.",
    format: (value) => `${Math.round(value * 100)}%`
  },
  {
    key: "mutationRate",
    label: "Mutation Rate",
    min: 0,
    max: 0.5,
    step: 0.01,
    note: "How often child brains mutate during reproduction.",
    format: (value) => `${Math.round(value * 100)}%`
  },
  {
    key: "reproduceChance",
    label: "Repro Chance",
    min: 0.001,
    max: 0.03,
    step: 0.001,
    note: "Per-tick breeding chance once age and energy checks pass.",
    format: (value) => `${(value * 100).toFixed(1)}%`
  },
  {
    key: "eyeRange",
    label: "Vision Range",
    min: 70,
    max: 260,
    step: 2,
    note: "How far each eye can sense walls, food, and creatures."
  },
  {
    key: "maxSpeed",
    label: "Max Speed",
    min: 1,
    max: 5,
    step: 0.1,
    note: "Top movement speed after thrust and friction settle.",
    format: (value) => value.toFixed(1)
  },
  {
    key: "soundVolume",
    label: "Sound Volume",
    min: 0,
    max: 1,
    step: 0.01,
    note: "Master volume for creature arcade tones and extinction synth effects.",
    format: (value) => `${Math.round(value * 100)}%`
  }
];

const wallSensorPoints = buildWallSensorPoints();
const controlElements = {};

const state = {
  creatures: [],
  foods: [],
  sparks: [],
  births: 0,
  tick: 0,
  nextCreatureId: 1,
  featured: null,
  archiveBrain: null,
  archiveHue: 42,
  archiveSegmentGene: 5,
  bestEverAge: 0,
  extinctionCandidateBrain: null,
  extinctionCandidateHue: 42,
  extinctionCandidateAge: 0,
  extinctionCandidateGeneration: 1,
  extinctionCandidateSegmentGene: 5,
  recentExtinctionBrain: null,
  recentExtinctionHue: 42,
  recentExtinctionGeneration: 1,
  recentExtinctionSegmentGene: 5,
  extinctionFrames: 0,
  extinctionCount: 0,
  deaths: 0,
  lineageTick: 0,
  extinctionLogged: false,
  extinctionSpecimen: null,
  extinctionScene: null,
  brainBank: [],
  nextBrainBankId: 1,
  brainBankScene: null,
  brainBankModalOpen: false,
  brainBankFocusId: null,
  brainBankMessage: "No preserved specimens stored yet.",
  brainBankHabitatDrawTick: -1,
  honoredWormEntries: [],
  honoredWormLoadState: "idle",
  honoredWormsModalOpen: false,
  networkDisplay: null,
  startupScene: null,
  telemetryHistory: [],
  telemetrySampleClock: 0,
  lineageNodes: new Map(),
  lineageBirthOrder: 0,
  influenceTool: {
    pointerActive: false,
    pointerId: null,
    x: WIDTH * 0.5,
    y: HEIGHT * 0.5,
    radius: INFLUENCE_TOOL_DEFAULTS.radius
  }
};

let honoredWormLoadPromise = null;

const audioState = {
  context: null,
  masterGain: null,
  cooldowns: Object.create(null),
  activeExtinctionScene: null,
  lastExtinctionPhase: "",
  lastCapturePulseTick: -9999,
  lastScanPulseTick: -9999
};

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function damp(current, target, factor) {
  return current + (target - current) * factor;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function quadraticPoint(a, b, c, t) {
  const oneMinusT = 1 - t;
  return oneMinusT * oneMinusT * a + 2 * oneMinusT * t * b + t * t * c;
}

function quadraticDerivative(a, b, c, t) {
  return 2 * (1 - t) * (b - a) + 2 * t * (c - b);
}

function traceWigglyQuadraticPath(
  ctx,
  startX,
  startY,
  controlX,
  controlY,
  endX,
  endY,
  progress,
  amplitude,
  frequency,
  phase
) {
  const cappedProgress = clamp(progress, 0, 1);
  if (cappedProgress <= 0.001) {
    return { x: startX, y: startY };
  }

  const steps = Math.max(6, Math.ceil(24 * cappedProgress));
  let tipX = startX;
  let tipY = startY;

  ctx.beginPath();

  for (let step = 0; step <= steps; step += 1) {
    const localT = step / steps;
    const t = cappedProgress * localT;
    const baseX = quadraticPoint(startX, controlX, endX, t);
    const baseY = quadraticPoint(startY, controlY, endY, t);
    const tangentX = quadraticDerivative(startX, controlX, endX, t);
    const tangentY = quadraticDerivative(startY, controlY, endY, t);
    const tangentLength = Math.max(0.001, Math.hypot(tangentX, tangentY));
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;
    const envelope = Math.sin(localT * Math.PI) ** 0.9;
    const wiggle =
      Math.sin(phase + t * Math.PI * frequency) *
      amplitude *
      envelope *
      (0.38 + cappedProgress * 0.62);
    const px = baseX + normalX * wiggle;
    const py = baseY + normalY * wiggle;

    if (step === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }

    tipX = px;
    tipY = py;
  }

  return { x: tipX, y: tipY };
}

function smooth01(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function dampAngle(current, target, factor) {
  return current + normalizeAngle(target - current) * factor;
}

function normalizeHueValue(value) {
  return ((value % 360) + 360) % 360;
}

function normalizeAngle(angle) {
  let wrapped = angle;
  while (wrapped > Math.PI) {
    wrapped -= TAU;
  }
  while (wrapped < -Math.PI) {
    wrapped += TAU;
  }
  return wrapped;
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function clampSegmentGene(value) {
  return clamp(Math.round(value), CONFIG.segmentGeneMin, CONFIG.segmentGeneMax);
}

function randomSegmentGene() {
  return clampSegmentGene(rand(CONFIG.segmentGeneMin, CONFIG.segmentGeneMax + 0.999));
}

function mutateSegmentGene(parentGene) {
  let nextGene = clampSegmentGene(parentGene);
  if (Math.random() < Math.max(0.12, CONFIG.mutationRate * 1.35)) {
    nextGene = clampSegmentGene(nextGene + (Math.random() < 0.5 ? -1 : 1));
  }
  return nextGene;
}

function formatAge(age) {
  const seconds = age / 60;
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const rem = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${rem}`;
}

function formatRunTimer(frames) {
  const totalSeconds = Math.max(0, Math.floor(frames / 60));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

function formatSignedSignal(value) {
  const normalized = Math.abs(value) < 0.005 ? 0 : value;
  return `${normalized >= 0 ? "+" : "-"}${Math.abs(normalized).toFixed(2)}`;
}

const TELEMETRY_SERIES = [
  {
    key: "population",
    label: "POPULATION",
    color: "#fff17b",
    maxValue: (samples) => {
      let max = CONFIG.maxCreatures;
      for (let i = 0; i < samples.length; i += 1) {
        max = Math.max(max, samples[i].population);
      }
      return Math.max(1, max);
    },
    formatValue: (value) => String(Math.round(value)).padStart(2, "0"),
    formatScale: (value) => `CAP ${Math.round(value)}`
  },
  {
    key: "food",
    label: "FOOD FIELD",
    color: "#80ff88",
    maxValue: (samples) => {
      let max = CONFIG.maxFood;
      for (let i = 0; i < samples.length; i += 1) {
        max = Math.max(max, samples[i].food);
      }
      return Math.max(1, max);
    },
    formatValue: (value) => String(Math.round(value)).padStart(2, "0"),
    formatScale: (value) => `CAP ${Math.round(value)}`
  },
  {
    key: "avgEnergy",
    label: "AVG ENERGY",
    color: "#4affd4",
    maxValue: () => Math.max(1, CONFIG.maxEnergy),
    formatValue: (value) => `${Math.round(value)}`,
    formatScale: (value) => `CAP ${Math.round(value)}`
  },
  {
    key: "avgAge",
    label: "AVG AGE",
    color: "#ff6db3",
    maxValue: (samples) => {
      let maxAge = 900;
      for (let i = 0; i < samples.length; i += 1) {
        maxAge = Math.max(maxAge, samples[i].avgAge);
      }
      return Math.ceil(maxAge / 300) * 300;
    },
    formatValue: (value) => formatRunTimer(value),
    formatScale: (value) => `MAX ${formatRunTimer(value)}`
  }
];

function getStepPrecision(step) {
  const stepString = String(step);
  if (!stepString.includes(".")) {
    return 0;
  }
  return stepString.split(".")[1].length;
}

function formatControlValue(def, value) {
  if (def.format) {
    return def.format(value);
  }
  const precision = getStepPrecision(def.step);
  return precision > 0 ? value.toFixed(precision) : String(Math.round(value));
}

function getMasterVolumeLevel() {
  return Math.pow(CONFIG.soundVolume, 1.35) * 0.24;
}

function ensureAudioContext() {
  if (audioState.context) {
    return audioState.context;
  }

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return null;
  }

  const context = new AudioContextCtor();
  const masterGain = context.createGain();
  masterGain.gain.value = getMasterVolumeLevel();
  masterGain.connect(context.destination);

  audioState.context = context;
  audioState.masterGain = masterGain;
  return context;
}

function updateMasterVolume(immediate = false) {
  if (!audioState.context || !audioState.masterGain) {
    return;
  }

  const now = audioState.context.currentTime;
  const target = getMasterVolumeLevel();
  audioState.masterGain.gain.cancelScheduledValues(now);
  if (immediate) {
    audioState.masterGain.gain.setValueAtTime(target, now);
  } else {
    audioState.masterGain.gain.setTargetAtTime(target, now, 0.03);
  }
}

function unlockAudioContext() {
  const context = ensureAudioContext();
  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    context.resume().catch(() => {});
  }
  updateMasterVolume(true);
}

function panFromWorldX(x) {
  if (!Number.isFinite(x)) {
    return 0;
  }
  return clamp(((x / WIDTH) * 2 - 1) * 0.72, -0.72, 0.72);
}

function playThrottledSound(key, minGapFrames, callback) {
  if (state.tick - (audioState.cooldowns[key] ?? -9999) < minGapFrames) {
    return;
  }
  audioState.cooldowns[key] = state.tick;
  callback();
}

function playSynthTone(options = {}) {
  const context = ensureAudioContext();
  if (!context || context.state !== "running" || CONFIG.soundVolume <= 0.001 || !audioState.masterGain) {
    return;
  }

  const frequency = Math.max(30, options.frequency ?? 440);
  const frequencyEnd = Math.max(30, options.frequencyEnd ?? frequency);
  const duration = Math.max(0.02, options.duration ?? 0.1);
  const attack = Math.max(0.002, options.attack ?? 0.005);
  const release = Math.max(0.02, options.release ?? duration * 0.75);
  const delay = Math.max(0, options.delay ?? 0);
  const volume = Math.max(0.0001, options.volume ?? 0.05);
  const type = options.type || "square";
  const pan = clamp(options.pan ?? 0, -1, 1);
  const detune = options.detune ?? 0;
  const startTime = context.currentTime + delay;
  const stopTime = startTime + duration + release;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const usePanner = typeof context.createStereoPanner === "function";
  const panner = usePanner ? context.createStereoPanner() : null;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(frequencyEnd, startTime + duration);
  oscillator.detune.setValueAtTime(detune, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

  oscillator.connect(gain);
  if (panner) {
    panner.pan.setValueAtTime(pan, startTime);
    gain.connect(panner);
    panner.connect(audioState.masterGain);
  } else {
    gain.connect(audioState.masterGain);
  }

  oscillator.start(startTime);
  oscillator.stop(stopTime + 0.01);
}

function playEatSound(x) {
  playThrottledSound("eat", 3, () => {
    const pan = panFromWorldX(x);
    playSynthTone({ frequency: 960, frequencyEnd: 620, duration: 0.05, release: 0.04, volume: 0.055, type: "square", pan });
    playSynthTone({ frequency: 1280, frequencyEnd: 980, duration: 0.035, release: 0.03, volume: 0.024, type: "triangle", pan, delay: 0.018 });
  });
}

function playBirthSound(x) {
  playThrottledSound("birth", 8, () => {
    const pan = panFromWorldX(x);
    playSynthTone({ frequency: 330, frequencyEnd: 440, duration: 0.08, release: 0.06, volume: 0.045, type: "square", pan });
    playSynthTone({ frequency: 495, frequencyEnd: 660, duration: 0.07, release: 0.06, volume: 0.03, type: "triangle", pan, delay: 0.045 });
  });
}

function playHatchSound(x) {
  playThrottledSound("hatch", 8, () => {
    const pan = panFromWorldX(x);
    playSynthTone({ frequency: 420, frequencyEnd: 720, duration: 0.09, release: 0.07, volume: 0.042, type: "triangle", pan });
    playSynthTone({ frequency: 620, frequencyEnd: 980, duration: 0.08, release: 0.06, volume: 0.028, type: "square", pan, delay: 0.035 });
  });
}

function playDeathSound(x) {
  playThrottledSound("death", 5, () => {
    const pan = panFromWorldX(x);
    playSynthTone({ frequency: 280, frequencyEnd: 112, duration: 0.16, release: 0.08, volume: 0.05, type: "sawtooth", pan });
  });
}

function playCollisionSound(x, intensity = 1) {
  playThrottledSound("collision", 4, () => {
    const pan = panFromWorldX(x);
    const volume = 0.018 + clamp(intensity, 0, 1) * 0.02;
    const base = 170 + Math.random() * 90;
    playSynthTone({ frequency: base, frequencyEnd: base * 0.82, duration: 0.045, release: 0.035, volume, type: "square", pan });
  });
}

function playExtinctionPhaseTone(phase, inherited = false, slotIndex = 0) {
  const pan = clamp((slotIndex - 1.5) * 0.18, -0.45, 0.45);
  if (phase === "enter") {
    playSynthTone({ frequency: 180, frequencyEnd: 140, duration: 0.24, release: 0.12, volume: 0.05, type: "sawtooth", pan: 0 });
    playSynthTone({ frequency: 320, frequencyEnd: 240, duration: 0.18, release: 0.1, volume: 0.02, type: "triangle", pan: 0, delay: 0.04 });
    return;
  }
  if (phase === "capture") {
    playSynthTone({ frequency: 240, frequencyEnd: 180, duration: 0.08, release: 0.05, volume: 0.024, type: "square", pan: 0 });
    return;
  }
  if (phase === "scan") {
    playSynthTone({ frequency: 720, frequencyEnd: 520, duration: 0.06, release: 0.05, volume: 0.026, type: "triangle", pan: 0 });
    return;
  }
  if (phase === "scan-locked") {
    playSynthTone({ frequency: 560, frequencyEnd: 760, duration: 0.09, release: 0.06, volume: 0.035, type: "triangle", pan: 0 });
    playSynthTone({ frequency: 820, frequencyEnd: 980, duration: 0.06, release: 0.05, volume: 0.022, type: "square", pan: 0, delay: 0.04 });
    return;
  }
  if (phase === "build") {
    playSynthTone({ frequency: inherited ? 260 : 300, frequencyEnd: inherited ? 420 : 520, duration: 0.08, release: 0.06, volume: 0.03, type: inherited ? "triangle" : "square", pan });
    return;
  }
  if (phase === "mutate") {
    playSynthTone({ frequency: 460, frequencyEnd: 300, duration: 0.06, release: 0.05, volume: 0.028, type: "square", pan });
    playSynthTone({ frequency: 680, frequencyEnd: 880, duration: 0.04, release: 0.03, volume: 0.018, type: "triangle", pan, delay: 0.028 });
    return;
  }
  if (phase === "preview") {
    playSynthTone({ frequency: 380, frequencyEnd: 420, duration: 0.08, release: 0.06, volume: 0.024, type: "triangle", pan });
    return;
  }
  if (phase === "package") {
    playSynthTone({ frequency: 680, frequencyEnd: 520, duration: 0.05, release: 0.04, volume: 0.026, type: "square", pan });
    return;
  }
  if (phase === "transfer") {
    playSynthTone({ frequency: 520, frequencyEnd: 920, duration: 0.08, release: 0.06, volume: 0.032, type: "sawtooth", pan });
    return;
  }
  if (phase === "implant") {
    playSynthTone({ frequency: 440, frequencyEnd: 660, duration: 0.06, release: 0.05, volume: 0.03, type: "triangle", pan });
    playSynthTone({ frequency: 660, frequencyEnd: 880, duration: 0.05, release: 0.05, volume: 0.022, type: "square", pan, delay: 0.03 });
    return;
  }
  if (phase === "release") {
    playSynthTone({ frequency: 320, frequencyEnd: 480, duration: 0.12, release: 0.08, volume: 0.038, type: "triangle", pan: 0 });
    playSynthTone({ frequency: 480, frequencyEnd: 720, duration: 0.1, release: 0.07, volume: 0.025, type: "square", pan: 0, delay: 0.05 });
  }
}

function updateExtinctionAudio() {
  const scene = state.extinctionScene;
  if (!scene) {
    audioState.activeExtinctionScene = null;
    audioState.lastExtinctionPhase = "";
    return;
  }

  if (audioState.activeExtinctionScene !== scene) {
    audioState.activeExtinctionScene = scene;
    audioState.lastExtinctionPhase = "enter";
    audioState.lastCapturePulseTick = -9999;
    audioState.lastScanPulseTick = -9999;
    playExtinctionPhaseTone("enter");
  }

  const scanProgress = scene.sourceBrain ? smooth01(clamp(scene.frame / Math.max(1, scene.scanFrames), 0, 1)) : 1;
  const pullProgress = scene.sourceSpecimen
    ? smooth01(clamp((scanProgress - 0.06) / 0.46, 0, 1))
    : 1;
  const headScanProgress = scene.sourceBrain
    ? smooth01(clamp((scanProgress - 0.6) / 0.34, 0, 1))
    : 1;

  if (scene.frame < scene.scanFrames) {
    if (pullProgress < 0.995) {
      if (state.tick - audioState.lastCapturePulseTick >= 14) {
        audioState.lastCapturePulseTick = state.tick;
        playExtinctionPhaseTone("capture");
      }
    } else if (headScanProgress < 0.995) {
      if (state.tick - audioState.lastScanPulseTick >= 10) {
        audioState.lastScanPulseTick = state.tick;
        playExtinctionPhaseTone("scan");
      }
    } else if (audioState.lastExtinctionPhase !== "scan-locked") {
      audioState.lastExtinctionPhase = "scan-locked";
      playExtinctionPhaseTone("scan-locked");
    }
    return;
  }

  const generationFrame = Math.max(0, scene.frame - scene.scanFrames);
  let activeIndex = -1;
  for (let slotIndex = 0; slotIndex < scene.slotTimings.length; slotIndex += 1) {
    const slotTiming = scene.slotTimings[slotIndex];
    if (generationFrame >= slotTiming.startFrame && generationFrame < slotTiming.endFrame) {
      activeIndex = slotIndex;
      break;
    }
  }

  if (activeIndex < 0) {
    return;
  }

  const planIndex = scene.generationOrder[activeIndex];
  const plan = scene.plans[planIndex];
  const slotTiming = scene.slotTimings[activeIndex];
  const planState = getExtinctionPlanProgress(scene, slotTiming, plan);
  let phase = "build";

  if (planState.packageActive) {
    phase = "package";
  } else if (planState.cubeTravelActive) {
    phase = "transfer";
  } else if (planState.implantActive) {
    phase = "implant";
  } else if (planState.previewActive) {
    phase = "preview";
  } else if (planState.mutationProgress > 0.01 || planState.mutationPauseActive) {
    phase = "mutate";
  }

  const phaseKey = `${activeIndex}:${phase}:${plan.inherited ? "dna" : "rnd"}`;
  if (phaseKey !== audioState.lastExtinctionPhase) {
    audioState.lastExtinctionPhase = phaseKey;
    playExtinctionPhaseTone(phase, plan.inherited, activeIndex);
  }
}

function buildControlDeck() {
  controlDeck.innerHTML = CONTROL_DEFS.map((def) => `
    <div class="control-card">
      <div class="control-top">
        <label for="control-${def.key}">${def.label}</label>
        <strong class="control-value" id="value-${def.key}">${formatControlValue(def, CONFIG[def.key])}</strong>
      </div>
      <p class="control-meta">${def.note}</p>
      <input
        id="control-${def.key}"
        class="control-slider"
        type="range"
        min="${def.min}"
        max="${def.max}"
        step="${def.step}"
        value="${CONFIG[def.key]}"
        data-key="${def.key}"
      >
    </div>
  `).join("");

  for (let i = 0; i < CONTROL_DEFS.length; i += 1) {
    const def = CONTROL_DEFS[i];
    const input = document.getElementById(`control-${def.key}`);
    const value = document.getElementById(`value-${def.key}`);
    controlElements[def.key] = { input, value, def };
    input.addEventListener("input", () => {
      applyControlValue(def, Number(input.value));
    });
  }
}

function openBrainBankDb(dbName = BRAIN_BANK_DB_NAME) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, BRAIN_BANK_DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(BRAIN_BANK_DB_STORE)) {
        db.createObjectStore(BRAIN_BANK_DB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function readBrainBankDbValue(key, dbName = BRAIN_BANK_DB_NAME) {
  if (!window.indexedDB) {
    return null;
  }

  const db = await openBrainBankDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BRAIN_BANK_DB_STORE, "readonly");
    const store = tx.objectStore(BRAIN_BANK_DB_STORE);
    const request = store.get(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result ?? null);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
  });
}

async function writeBrainBankDbValue(key, value, dbName = BRAIN_BANK_DB_NAME) {
  if (!window.indexedDB) {
    return;
  }

  const db = await openBrainBankDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(BRAIN_BANK_DB_STORE, "readwrite");
    const store = tx.objectStore(BRAIN_BANK_DB_STORE);
    const request = store.put(value, key);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => reject(tx.error);
  });
}

function supportsBrainBankFolderAccess() {
  return typeof window.showDirectoryPicker === "function" && Boolean(window.indexedDB);
}

async function ensureDirectoryPermission(handle, writable = false) {
  if (!handle) {
    return false;
  }

  const options = writable ? { mode: "readwrite" } : {};
  if (typeof handle.queryPermission === "function") {
    const current = await handle.queryPermission(options);
    if (current === "granted") {
      return true;
    }
  }

  if (typeof handle.requestPermission === "function") {
    const requested = await handle.requestPermission(options);
    return requested === "granted";
  }

  return false;
}

async function getPersistedBrainBankRootHandle() {
  try {
    const currentHandle = await readBrainBankDbValue(BRAIN_BANK_DIR_HANDLE_KEY);
    if (currentHandle) {
      return currentHandle;
    }

    for (let i = 0; i < LEGACY_BRAIN_BANK_DB_NAMES.length; i += 1) {
      const legacyHandle = await readBrainBankDbValue(BRAIN_BANK_DIR_HANDLE_KEY, LEGACY_BRAIN_BANK_DB_NAMES[i]);
      if (legacyHandle) {
        await persistBrainBankRootHandle(legacyHandle);
        return legacyHandle;
      }
    }
  } catch (error) {
    // Ignore read failures and fall through to null below.
  }

  return null;
}

async function persistBrainBankRootHandle(handle) {
  try {
    await writeBrainBankDbValue(BRAIN_BANK_DIR_HANDLE_KEY, handle);
  } catch (error) {
    // Ignore persistence failures and continue with the live handle.
  }
}

async function chooseBrainBankRootHandle() {
  if (!supportsBrainBankFolderAccess()) {
    throw new Error("Folder access is not available in this browser.");
  }

  const rootHandle = await window.showDirectoryPicker({
    id: BRAIN_BANK_PICKER_ID,
    mode: "readwrite"
  });
  const granted = await ensureDirectoryPermission(rootHandle, true);
  if (!granted) {
    throw new Error("Folder permission was not granted.");
  }
  await persistBrainBankRootHandle(rootHandle);
  return rootHandle;
}

async function getBrainBankDirectory(options = {}) {
  const {
    create = false,
    writable = false,
    promptIfMissing = false
  } = options;

  if (!supportsBrainBankFolderAccess()) {
    return null;
  }

  let rootHandle = await getPersistedBrainBankRootHandle();
  if (!rootHandle && promptIfMissing) {
    rootHandle = await chooseBrainBankRootHandle();
  }
  if (!rootHandle) {
    return null;
  }

  const granted = await ensureDirectoryPermission(rootHandle, writable);
  if (!granted) {
    if (!promptIfMissing) {
      return null;
    }
    rootHandle = await chooseBrainBankRootHandle();
  }

  try {
    const folderHandle = await rootHandle.getDirectoryHandle(BRAIN_BANK_FOLDER_NAME, { create });
    return { rootHandle, folderHandle };
  } catch (error) {
    return null;
  }
}

function updateControlDisplay(key) {
  const control = controlElements[key];
  if (!control) {
    return;
  }
  control.input.value = String(CONFIG[key]);
  control.value.textContent = formatControlValue(control.def, CONFIG[key]);
}

function trimFoodToCap() {
  if (state.foods.length > CONFIG.maxFood) {
    state.foods.length = CONFIG.maxFood;
  }
}

function clampCreatureSpeeds() {
  for (let i = 0; i < state.creatures.length; i += 1) {
    const creature = state.creatures[i];
    const speed = Math.hypot(creature.vx, creature.vy);
    if (speed > CONFIG.maxSpeed) {
      const scale = CONFIG.maxSpeed / speed;
      creature.vx *= scale;
      creature.vy *= scale;
    }
  }
}

function enforcePopulationCap() {
  const overflow = state.creatures.length - CONFIG.maxCreatures;
  if (overflow <= 0) {
    return;
  }

  const ranked = state.creatures
    .map((creature, index) => ({ creature, index }))
    .sort((a, b) => {
      if (a.creature.energy !== b.creature.energy) {
        return a.creature.energy - b.creature.energy;
      }
      return a.creature.age - b.creature.age;
    });

  const removalIndices = ranked
    .slice(0, overflow)
    .map((entry) => entry.index)
    .sort((a, b) => b - a);

  for (let i = 0; i < removalIndices.length; i += 1) {
    const index = removalIndices[i];
    const creature = state.creatures[index];
    recordArchive(creature, false);
    spawnSpark(creature.x, creature.y, "#ff6db3", 6);
    state.creatures.splice(index, 1);
  }
}

function syncConfigToWorld(key) {
  if (key === "maxFood") {
    trimFoodToCap();
  }

  if (key === "maxCreatures") {
    enforcePopulationCap();
    chooseFeaturedCreature();
    state.networkDisplay = null;
  }

  if (key === "energyFromFood") {
    for (let i = 0; i < state.foods.length; i += 1) {
      state.foods[i].energy = CONFIG.energyFromFood;
    }
  }

  if (key === "maxSpeed") {
    clampCreatureSpeeds();
  }

  if (key === "soundVolume") {
    updateMasterVolume();
  }
}

function applyControlValue(def, rawValue) {
  const precision = getStepPrecision(def.step);
  const clampedValue = clamp(rawValue, def.min, def.max);
  const nextValue = Number(clampedValue.toFixed(precision));
  CONFIG[def.key] = nextValue;
  syncConfigToWorld(def.key);
  updateControlDisplay(def.key);
}

function resetControlDeck() {
  for (let i = 0; i < CONTROL_DEFS.length; i += 1) {
    const def = CONTROL_DEFS[i];
    applyControlValue(def, DEFAULT_CONFIG[def.key]);
  }
}

function randomWeight() {
  return rand(-1, 1);
}

function createBrain(parentBrain) {
  if (parentBrain) {
    return mutateBrain(parentBrain);
  }

  const layerSizes = [INPUT_LABELS.length, ...CONFIG.hiddenLayerSizes, OUTPUT_LABELS.length];
  const weights = [];
  const biases = [];

  for (let layerIndex = 0; layerIndex < layerSizes.length - 1; layerIndex += 1) {
    weights.push(
      Array.from({ length: layerSizes[layerIndex + 1] }, () =>
        Array.from({ length: layerSizes[layerIndex] }, randomWeight)
      )
    );
    biases.push(Array.from({ length: layerSizes[layerIndex + 1] }, randomWeight));
  }

  return { weights, biases };
}

function cloneBrain(brain) {
  return {
    weights: brain.weights.map((layer) => layer.map((row) => row.slice())),
    biases: brain.biases.map((layer) => layer.slice())
  };
}

function mutateValue(value) {
  if (Math.random() < CONFIG.mutationRate) {
    return clamp(value + rand(-CONFIG.mutationScale, CONFIG.mutationScale), -1.6, 1.6);
  }
  return value;
}

function mutateBrain(parentBrain) {
  const brain = cloneBrain(parentBrain);
  brain.weights = brain.weights.map((layer) => layer.map((row) => row.map(mutateValue)));
  brain.biases = brain.biases.map((layer) => layer.map(mutateValue));
  return brain;
}

function forwardBrain(brain, inputs) {
  const hiddenLayers = [];
  let activations = inputs.slice();

  for (let layerIndex = 0; layerIndex < brain.weights.length; layerIndex += 1) {
    const isOutputLayer = layerIndex === brain.weights.length - 1;
    const nextActivations = brain.weights[layerIndex].map((weights, nodeIndex) => {
      let sum = brain.biases[layerIndex][nodeIndex];
      for (let i = 0; i < weights.length; i += 1) {
        sum += weights[i] * activations[i];
      }
      return isOutputLayer ? sigmoid(sum) : Math.tanh(sum);
    });

    if (!isOutputLayer) {
      hiddenLayers.push(nextActivations);
    }
    activations = nextActivations;
  }

  return { hiddenLayers, outputs: activations };
}

function buildWallSensorPoints() {
  const points = [];
  for (let x = 0; x <= WIDTH; x += CONFIG.wallPointGap) {
    points.push({ x, y: 0, kind: "wall" });
    points.push({ x, y: HEIGHT, kind: "wall" });
  }
  for (let y = CONFIG.wallPointGap; y < HEIGHT; y += CONFIG.wallPointGap) {
    points.push({ x: 0, y, kind: "wall" });
    points.push({ x: WIDTH, y, kind: "wall" });
  }
  return points;
}

function randomInteriorPosition(radius) {
  return {
    x: rand(radius + 20, WIDTH - radius - 20),
    y: rand(radius + 20, HEIGHT - radius - 20)
  };
}

function getLivingCreaturesCount() {
  let count = 0;
  for (let i = 0; i < state.creatures.length; i += 1) {
    if (state.creatures[i].alive) {
      count += 1;
    }
  }
  return count;
}

function canUseInfluenceTool() {
  return !state.startupScene && !state.extinctionScene && !state.brainBankScene && !state.brainBankModalOpen;
}

function isInfluenceToolActive() {
  return state.influenceTool.pointerActive && canUseInfluenceTool();
}

function updateInfluenceToolUi() {
  if (!canUseInfluenceTool()) {
    clearInfluencePointer();
  }
  worldCanvas.classList.toggle("influence-tool-active", canUseInfluenceTool());
}

function clearInfluencePointer() {
  const activePointerId = state.influenceTool.pointerId;
  if (activePointerId !== null && worldCanvas.hasPointerCapture) {
    try {
      if (worldCanvas.hasPointerCapture(activePointerId)) {
        worldCanvas.releasePointerCapture(activePointerId);
      }
    } catch (error) {
      // Pointer capture may already be gone; ignore and just clear local state.
    }
  }
  state.influenceTool.pointerActive = false;
  state.influenceTool.pointerId = null;
}

function getWorldPointerPosition(event) {
  const rect = worldCanvas.getBoundingClientRect();
  const normalizedX = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0;
  const normalizedY = rect.height > 0 ? (event.clientY - rect.top) / rect.height : 0;
  return {
    x: clamp(normalizedX * WIDTH, 0, WIDTH),
    y: clamp(normalizedY * HEIGHT, 0, HEIGHT)
  };
}

function updateInfluencePointer(event) {
  const position = getWorldPointerPosition(event);
  state.influenceTool.x = position.x;
  state.influenceTool.y = position.y;
}

function handleInfluencePointerDown(event) {
  if (!canUseInfluenceTool()) {
    return;
  }

  if (event.button !== undefined && event.button !== 0) {
    return;
  }

  state.influenceTool.pointerActive = true;
  state.influenceTool.pointerId = event.pointerId ?? null;
  updateInfluencePointer(event);
  event.preventDefault();
  if (event.pointerId !== undefined && worldCanvas.setPointerCapture) {
    try {
      worldCanvas.setPointerCapture(event.pointerId);
    } catch (error) {
      // Some browsers can reject capture during rapid re-entry; keep the tool active anyway.
    }
  }
}

function handleInfluencePointerMove(event) {
  if (!state.influenceTool.pointerActive) {
    return;
  }

  if (state.influenceTool.pointerId !== null && event.pointerId !== state.influenceTool.pointerId) {
    return;
  }

  updateInfluencePointer(event);
  event.preventDefault();
}

function handleInfluencePointerEnd(event) {
  if (state.influenceTool.pointerId !== null && event.pointerId !== undefined && event.pointerId !== state.influenceTool.pointerId) {
    return;
  }

  if (state.influenceTool.pointerActive) {
    event.preventDefault();
  }
  clearInfluencePointer();
}

function getTelemetrySnapshot() {
  let population = 0;
  let totalEnergy = 0;
  let totalAge = 0;

  for (let i = 0; i < state.creatures.length; i += 1) {
    const creature = state.creatures[i];
    if (!creature.alive) {
      continue;
    }

    population += 1;
    totalEnergy += creature.energy;
    totalAge += creature.age;
  }

  return {
    population,
    food: state.foods.length,
    avgEnergy: population > 0 ? totalEnergy / population : 0,
    avgAge: population > 0 ? totalAge / population : 0
  };
}

function pushTelemetrySample(force = false) {
  if (!force) {
    state.telemetrySampleClock += 1;
    if (state.telemetrySampleClock < TELEMETRY_SAMPLE_INTERVAL) {
      return;
    }
  }

  state.telemetrySampleClock = 0;
  state.telemetryHistory.push(getTelemetrySnapshot());
  if (state.telemetryHistory.length > TELEMETRY_HISTORY_LIMIT) {
    state.telemetryHistory.splice(0, state.telemetryHistory.length - TELEMETRY_HISTORY_LIMIT);
  }
}

function resetTelemetryHistory() {
  state.telemetryHistory.length = 0;
  state.telemetrySampleClock = 0;
  pushTelemetrySample(true);
}

function resetLineageTree() {
  state.lineageNodes = new Map();
  state.lineageBirthOrder = 0;
}

function registerLineageCreature(creature, parentId = null) {
  if (!creature) {
    return;
  }

  const resolvedParentId = Number.isFinite(parentId) && state.lineageNodes.has(parentId)
    ? parentId
    : null;
  const parentNode = resolvedParentId !== null
    ? state.lineageNodes.get(resolvedParentId)
    : null;

  const node = {
    id: creature.id,
    parentId: resolvedParentId,
    birthOrder: state.lineageBirthOrder++,
    generation: Math.max(1, Math.round(creature.generation || 1)),
    hue: normalizeHueValue(creature.hue ?? 42),
    age: creature.age || 0,
    alive: creature.alive !== false,
    lifeStage: creature.lifeStage || "adult",
    recentAction: creature.recentAction || "IDLE",
    offspringCount: creature.children || 0,
    birthTick: state.tick,
    deathTick: null,
    childIds: []
  };

  state.lineageNodes.set(node.id, node);

  if (parentNode && !parentNode.childIds.includes(node.id)) {
    parentNode.childIds.push(node.id);
  }
}

function updateLineageCreatureNode(creature) {
  if (!creature) {
    return;
  }

  let node = state.lineageNodes.get(creature.id);
  if (!node) {
    registerLineageCreature(creature, creature.lineageParentId ?? null);
    node = state.lineageNodes.get(creature.id);
  }
  if (!node) {
    return;
  }

  node.generation = Math.max(1, Math.round(creature.generation || 1));
  node.hue = normalizeHueValue(creature.hue ?? node.hue);
  node.age = creature.age || 0;
  node.alive = creature.alive !== false;
  node.lifeStage = creature.lifeStage || node.lifeStage;
  node.recentAction = creature.recentAction || node.recentAction;
  node.offspringCount = creature.children || 0;
  if (node.alive) {
    node.deathTick = null;
  }
}

function syncLineageCreatures() {
  for (let i = 0; i < state.creatures.length; i += 1) {
    updateLineageCreatureNode(state.creatures[i]);
  }
}

function getLineageFocusId() {
  if (state.featured?.id && state.lineageNodes.has(state.featured.id)) {
    return state.featured.id;
  }
  if (state.extinctionSpecimen?.id && state.lineageNodes.has(state.extinctionSpecimen.id)) {
    return state.extinctionSpecimen.id;
  }
  return null;
}

function getLineageTrailSet(focusId = getLineageFocusId()) {
  const trail = new Set();
  let cursor = focusId;

  while (cursor !== null && cursor !== undefined) {
    const node = state.lineageNodes.get(cursor);
    if (!node || trail.has(node.id)) {
      break;
    }
    trail.add(node.id);
    cursor = node.parentId;
  }

  return trail;
}

function cloneExtinctionSpecimen(creature) {
  return {
    id: creature.id,
    x: creature.x,
    y: creature.y,
    heading: creature.heading,
    hue: creature.hue,
    energy: creature.energy,
    age: creature.age,
    generation: creature.generation,
    segmentGene: creature.segmentGene,
    lifeStage: creature.lifeStage === "juvenile" || creature.lifeStage === "egg"
      ? creature.lifeStage
      : "adult",
    brain: cloneBrain(creature.brain)
  };
}

function sanitizeFileToken(value) {
  const normalized = String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "specimen";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatBrainBankTimestamp(isoString) {
  const date = isoString ? new Date(isoString) : new Date();
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const year = safeDate.getFullYear();
  const month = String(safeDate.getMonth() + 1).padStart(2, "0");
  const day = String(safeDate.getDate()).padStart(2, "0");
  const hours = String(safeDate.getHours()).padStart(2, "0");
  const minutes = String(safeDate.getMinutes()).padStart(2, "0");
  const seconds = String(safeDate.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

function isBrainBankBusy() {
  return Boolean(state.startupScene || state.extinctionScene || state.brainBankScene);
}

function describeBrainBankOrigin(origin) {
  return origin === "imported" ? "IMPORTED FILE" : "LIVE SAMPLE";
}

function isBundledHonoredWormFileName(fileName) {
  return HONORED_WORM_FILE_NAMES.has(String(fileName || "").toLowerCase());
}

function getBundledTrophyWormPayload() {
  const payload = globalThis[TROPHY_WORM_BUNDLE_KEY];
  return payload && typeof payload === "object" ? payload : null;
}

function getBundledHonoredWormPayloadMap() {
  const payloadMap = new Map();
  const trophyPayload = getBundledTrophyWormPayload();
  if (trophyPayload) {
    payloadMap.set(TROPHY_WORM_ASSET_FILE_NAME, trophyPayload);
  }

  const honoredPayloads = globalThis[HONORED_WORM_BUNDLE_LIST_KEY];
  if (!Array.isArray(honoredPayloads)) {
    return payloadMap;
  }

  for (let i = 0; i < honoredPayloads.length; i += 1) {
    const entry = honoredPayloads[i];
    const fileName = String(entry?.key || entry?.payload?.metadata?.fileName || "").trim();
    const payload = entry?.payload;
    if (!fileName || !payload || typeof payload !== "object") {
      continue;
    }
    payloadMap.set(fileName, payload);
  }

  return payloadMap;
}

function cloneBrainBankSpecimen(specimen, brainOverride = null) {
  const brain = brainOverride || specimen?.brain;
  if (!brain) {
    throw new Error("Specimen brain data is missing.");
  }

  return {
    x: Number.isFinite(specimen?.x) ? specimen.x : WIDTH * 0.5,
    y: Number.isFinite(specimen?.y) ? specimen.y : HEIGHT * 0.5,
    heading: Number.isFinite(specimen?.heading) ? specimen.heading : -0.18,
    hue: normalizeHueValue(specimen?.hue ?? 42),
    energy: Number.isFinite(specimen?.energy) ? specimen.energy : CONFIG.startingEnergy,
    age: Math.max(0, Math.round(specimen?.age ?? 0)),
    generation: Math.max(1, Math.round(specimen?.generation ?? 1)),
    segmentGene: clampSegmentGene(specimen?.segmentGene ?? randomSegmentGene()),
    lifeStage: specimen?.lifeStage === "egg" || specimen?.lifeStage === "juvenile"
      ? specimen.lifeStage
      : "adult",
    brain: cloneBrain(brain)
  };
}

function isValidBrainShape(brain) {
  if (!brain || !Array.isArray(brain.weights) || !Array.isArray(brain.biases)) {
    return false;
  }

  const layerCounts = getBrainLayerCounts();
  if (brain.weights.length !== layerCounts.length - 1 || brain.biases.length !== layerCounts.length - 1) {
    return false;
  }

  for (let layerIndex = 0; layerIndex < brain.weights.length; layerIndex += 1) {
    const expectedRows = layerCounts[layerIndex + 1];
    const expectedCols = layerCounts[layerIndex];
    const weightLayer = brain.weights[layerIndex];
    const biasLayer = brain.biases[layerIndex];

    if (!Array.isArray(weightLayer) || !Array.isArray(biasLayer)) {
      return false;
    }
    if (weightLayer.length !== expectedRows || biasLayer.length !== expectedRows) {
      return false;
    }

    for (let rowIndex = 0; rowIndex < weightLayer.length; rowIndex += 1) {
      if (!Array.isArray(weightLayer[rowIndex]) || weightLayer[rowIndex].length !== expectedCols) {
        return false;
      }
      for (let colIndex = 0; colIndex < weightLayer[rowIndex].length; colIndex += 1) {
        if (!Number.isFinite(weightLayer[rowIndex][colIndex])) {
          return false;
        }
      }
    }

    for (let nodeIndex = 0; nodeIndex < biasLayer.length; nodeIndex += 1) {
      if (!Number.isFinite(biasLayer[nodeIndex])) {
        return false;
      }
    }
  }

  return true;
}

function buildBrainBankEntryFileName(entry) {
  const creatureToken = entry.creatureId
    ? `c-${String(entry.creatureId).padStart(3, "0")}`
    : sanitizeFileToken(entry.displayName);
  const generationToken = `g-${String(entry.generation).padStart(2, "0")}`;
  const ageToken = `age-${String(Math.round(entry.ageFrames)).padStart(5, "0")}f`;
  const stamp = formatBrainBankTimestamp(entry.sampledAtIso);
  return `${sanitizeFileToken(`${creatureToken}-${generationToken}-${ageToken}-${stamp}`)}.json`;
}

function createBrainBankEntry(source, options = {}) {
  const specimen = cloneBrainBankSpecimen(source.specimen || source, source.brain || source.specimen?.brain);
  const brain = cloneBrain(specimen.brain);
  const entry = {
    id: state.nextBrainBankId++,
    displayName: options.displayName || source.displayName || (source.creatureId
      ? `Specimen C-${String(source.creatureId).padStart(3, "0")}`
      : `Stored Specimen ${String(state.nextBrainBankId - 1).padStart(2, "0")}`),
    creatureId: source.creatureId ?? null,
    origin: options.origin || source.origin || "sampled",
    sampledAtIso: options.sampledAtIso || source.sampledAtIso || new Date().toISOString(),
    sampledTick: options.sampledTick ?? source.sampledTick ?? state.tick,
    note: options.note || source.note || "",
    brain,
    specimen,
    hue: specimen.hue,
    generation: specimen.generation,
    segmentGene: specimen.segmentGene,
    ageFrames: specimen.age
  };

  entry.fileName = options.fileName || source.fileName || buildBrainBankEntryFileName(entry);
  return entry;
}

function createBrainBankFilePayload(entry) {
  return {
    kind: BRAIN_BANK_FILE_KIND,
    version: BRAIN_BANK_FILE_VERSION,
    exportedAt: entry.sampledAtIso,
    metadata: {
      displayName: entry.displayName,
      origin: entry.origin,
      fileName: entry.fileName,
      sourceCreatureId: entry.creatureId,
      sampledTick: entry.sampledTick,
      ageFrames: entry.ageFrames,
      generation: entry.generation,
      hue: entry.hue,
      segmentGene: entry.segmentGene
    },
    specimen: cloneBrainBankSpecimen(entry.specimen, entry.brain),
    brain: cloneBrain(entry.brain)
  };
}

function sortBrainBankEntries() {
  state.brainBank.sort((a, b) => {
    const aTime = new Date(a.sampledAtIso).getTime();
    const bTime = new Date(b.sampledAtIso).getTime();
    return (Number.isFinite(bTime) ? bTime : 0) - (Number.isFinite(aTime) ? aTime : 0);
  });
}

function upsertBrainBankEntry(entry) {
  const existingIndex = state.brainBank.findIndex((item) => item.fileName === entry.fileName);
  if (existingIndex >= 0) {
    entry.id = state.brainBank[existingIndex].id;
    state.brainBank[existingIndex] = entry;
    sortBrainBankEntries();
    return { inserted: false, entry: state.brainBank[existingIndex] };
  }

  state.brainBank.push(entry);
  sortBrainBankEntries();
  return { inserted: true, entry };
}

function renderSimulationPanels() {
  updateStats();
  drawWorld();
  drawTelemetryPanel();
  drawNetworkPanel();
  drawFamilyTreePanel();
}

function setDataPanelCollapsed(panel, collapsed) {
  if (!panel) {
    return;
  }

  panel.classList.toggle("is-collapsed", collapsed);
  const toggleButton = panel.querySelector("[data-panel-toggle]");
  if (toggleButton) {
    toggleButton.textContent = collapsed ? "EXPAND" : "MINIMIZE";
    toggleButton.setAttribute("aria-expanded", collapsed ? "false" : "true");
    toggleButton.title = collapsed ? "Expand this data panel." : "Minimize this data panel.";
  }
}

function initializeDataPanelToggles() {
  for (let i = 0; i < collapsibleDataPanels.length; i += 1) {
    const panel = collapsibleDataPanels[i];
    setDataPanelCollapsed(panel, panel.classList.contains("is-collapsed"));
    const toggleButton = panel.querySelector("[data-panel-toggle]");
    if (!toggleButton) {
      continue;
    }

    toggleButton.addEventListener("click", () => {
      const nextCollapsed = !panel.classList.contains("is-collapsed");
      setDataPanelCollapsed(panel, nextCollapsed);
    });
  }
}

async function saveBrainBankEntryToDisk(entry, promptIfMissing = false) {
  const directory = await getBrainBankDirectory({
    create: true,
    writable: true,
    promptIfMissing
  });

  if (!directory) {
    return { saved: false, reason: "unavailable" };
  }

  const fileHandle = await directory.folderHandle.getFileHandle(entry.fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(createBrainBankFilePayload(entry), null, 2));
  await writable.close();
  return { saved: true, path: `${BRAIN_BANK_FOLDER_NAME}/${entry.fileName}` };
}

async function loadBrainBankEntriesFromDisk() {
  const directory = await getBrainBankDirectory({
    create: false,
    writable: false,
    promptIfMissing: false
  });

  if (!directory) {
    return { loaded: 0, skipped: 0, available: false };
  }

  let loaded = 0;
  let skipped = 0;

  for await (const [name, handle] of directory.folderHandle.entries()) {
    if (handle.kind !== "file" || !name.toLowerCase().endsWith(".json")) {
      continue;
    }
    if (isBundledHonoredWormFileName(name)) {
      continue;
    }

    try {
      const file = await handle.getFile();
      const payload = JSON.parse(await file.text());
      const entry = createBrainBankEntryFromFilePayload(payload, name);
      const result = upsertBrainBankEntry(entry);
      if (result.inserted) {
        loaded += 1;
      }
    } catch (error) {
      skipped += 1;
    }
  }

  return { loaded, skipped, available: true };
}

function getBrainBankEntryById(entryId) {
  for (let i = 0; i < state.brainBank.length; i += 1) {
    if (state.brainBank[i].id === entryId) {
      return state.brainBank[i];
    }
  }
  return null;
}

function setBrainBankMessage(message) {
  state.brainBankMessage = message;
  updateBrainBankUi();
}

function updateBrainBankHabitatStrip() {
  brainBankHabitatPopulation.textContent = `POP ${String(getLivingCreaturesCount()).padStart(2, "0")}`;
  brainBankHabitatOldest.textContent = `OLDEST ${state.featured ? formatAge(state.featured.age) : "--"}`;
  brainBankHabitatStored.textContent = `BANK ${String(state.brainBank.length).padStart(2, "0")}`;
}

function updateBrainBankUi() {
  const storedCount = state.brainBank.length;
  const countLabel = storedCount > 0 ? ` (${String(storedCount).padStart(2, "0")})` : "";
  openBrainBankButton.textContent = `OPEN BRAIN BANK${countLabel}`;
  sampleLongestButton.disabled = !state.featured || isBrainBankBusy();
  openHonoredWormsButton.disabled = state.honoredWormLoadState === "loading";
  openHonoredWormsButton.title = state.honoredWormLoadState === "loading"
    ? "Loading the built-in Honored Worms gallery."
    : state.honoredWormEntries.length > 0
      ? `Browse ${state.honoredWormEntries.length} built-in honored specimens.`
      : "Open the built-in honored specimen gallery.";

  let status = state.brainBankMessage;
  if (state.brainBankScene) {
    status = "Sampling the longest-lived brain and writing a fresh specimen file.";
  } else if (state.extinctionScene) {
    status = "Brain bank locked while the extinction foundry rebuilds the population.";
  } else if (state.startupScene) {
    status = "Brain sampling will unlock when the habitat boot sequence finishes.";
  } else if (!status) {
    status = storedCount > 0
      ? `${storedCount} stored specimen${storedCount === 1 ? "" : "s"} ready for export or release.`
      : "No preserved specimens stored yet.";
  } else if (storedCount > 0) {
    status = `${storedCount} stored specimen${storedCount === 1 ? "" : "s"}. ${status}`;
  }
  brainBankStatus.textContent = status;
  updateBrainBankHabitatStrip();
  updateHonoredWormsModalUi();
}

function setBrainBankModalOpen(open, focusId = state.brainBankFocusId) {
  state.brainBankModalOpen = open;
  brainBankModal.hidden = !open;
  if (!open) {
    return;
  }

  state.brainBankFocusId = focusId ?? state.brainBankFocusId;
  state.brainBankHabitatDrawTick = -1;
  renderBrainBankList();
  drawBrainBankHabitatView(true);
}

function setHonoredWormsModalOpen(open) {
  state.honoredWormsModalOpen = open;
  honoredWormsModal.hidden = !open;
  if (!open) {
    return;
  }

  renderHonoredWormsList();
  drawHonoredWormCanvases();
  if (state.honoredWormEntries.length === 0 && state.honoredWormLoadState !== "loading") {
    loadHonoredWorms().catch(() => {
      setBrainBankMessage("The built-in Honored Worms gallery could not be loaded from its bundled specimen files.");
      renderHonoredWormsList();
    });
  }
}

function renderHonoredWormsList() {
  if (!state.honoredWormsModalOpen) {
    return;
  }

  const spawnDisabled = isBrainBankBusy() || getLivingCreaturesCount() >= CONFIG.maxCreatures;

  if (state.honoredWormLoadState === "loading") {
    honoredWormsList.innerHTML = `
      <div class="brain-bank-empty">
        <p>Loading the honored specimen gallery.</p>
        <p>The built-in worms are being unpacked from their bundled files.</p>
      </div>
    `;
    return;
  }

  if (state.honoredWormEntries.length === 0) {
    honoredWormsList.innerHTML = `
      <div class="brain-bank-empty">
        <p>No honored worms are available right now.</p>
        <p>Reload the page to retry loading the built-in specimen gallery.</p>
      </div>
    `;
    return;
  }

  honoredWormsList.innerHTML = state.honoredWormEntries.map((entry) => `
    <article class="brain-bank-card" data-honored-entry-id="${escapeHtml(entry.fileName)}">
      <div class="brain-bank-card-head">
        <div>
          <h3 class="brain-bank-card-title">${escapeHtml(entry.displayName)}</h3>
          <p class="brain-bank-card-copy">BUILT-IN HONORED SPECIMEN // ${escapeHtml(entry.fileName)}</p>
        </div>
        <span class="brain-bank-chip">${escapeHtml(entry.badgeLabel || "HONORED")}</span>
      </div>
      <div class="brain-bank-preview-grid">
        <div class="brain-bank-preview">
          <span>Neural Map</span>
          <canvas width="260" height="164" data-honored-brain-preview="${escapeHtml(entry.fileName)}"></canvas>
        </div>
        <div class="brain-bank-preview">
          <span>Body Profile</span>
          <canvas width="220" height="164" data-honored-body-preview="${escapeHtml(entry.fileName)}"></canvas>
        </div>
      </div>
      <div class="brain-bank-meta">
        <div class="brain-bank-meta-item"><span>Age</span><strong>${formatAge(entry.ageFrames)}</strong></div>
        <div class="brain-bank-meta-item"><span>Generation</span><strong>${entry.generation}</strong></div>
        <div class="brain-bank-meta-item"><span>Segments</span><strong>${clampSegmentGene(entry.segmentGene)}</strong></div>
        <div class="brain-bank-meta-item"><span>Origin</span><strong>Built-In</strong></div>
      </div>
      <div class="brain-bank-card-actions">
        <button class="retro-button" type="button" data-honored-action="spawn" data-honored-entry-id="${escapeHtml(entry.fileName)}" ${spawnDisabled ? "disabled" : ""}>SPAWN INTO HABITAT</button>
      </div>
    </article>
  `).join("");

  drawHonoredWormCanvases();
}

function updateHonoredWormsModalUi() {
  if (!state.honoredWormsModalOpen) {
    return;
  }

  const spawnDisabled = isBrainBankBusy() || getLivingCreaturesCount() >= CONFIG.maxCreatures;
  const spawnButtons = honoredWormsList.querySelectorAll("button[data-honored-action='spawn']");
  for (let i = 0; i < spawnButtons.length; i += 1) {
    spawnButtons[i].disabled = spawnDisabled;
  }
}

function renderBrainBankList() {
  const releaseDisabled = isBrainBankBusy() || getLivingCreaturesCount() >= CONFIG.maxCreatures;

  if (state.brainBank.length === 0) {
    brainBankList.innerHTML = `
      <div class="brain-bank-empty">
        <p>No brain specimens are in the vault yet.</p>
        <p>Sample the current longest-lived creature to download a JSON brain file and add it to the archive.</p>
      </div>
    `;
    return;
  }

  brainBankList.innerHTML = state.brainBank.map((entry, index) => `
    <article class="brain-bank-card" data-entry-id="${entry.id}">
      <div class="brain-bank-card-head">
        <div>
          <h3 class="brain-bank-card-title">${escapeHtml(entry.displayName)}</h3>
          <p class="brain-bank-card-copy">${escapeHtml(describeBrainBankOrigin(entry.origin))} // ${escapeHtml(entry.fileName)}</p>
        </div>
        <span class="brain-bank-chip">${index === 0 ? "LATEST" : `BANK ${String(index + 1).padStart(2, "0")}`}</span>
      </div>
      <div class="brain-bank-preview-grid">
        <div class="brain-bank-preview">
          <span>Brain Sprite</span>
          <canvas data-brain-preview="${entry.id}" width="272" height="168" aria-label="Stored brain sprite preview"></canvas>
        </div>
        <div class="brain-bank-preview">
          <span>Body Preview</span>
          <canvas data-body-preview="${entry.id}" width="232" height="168" aria-label="Stored body preview"></canvas>
        </div>
      </div>
      <div class="brain-bank-meta">
        <div class="brain-bank-meta-item"><span>Age</span><strong>${formatAge(entry.ageFrames)}</strong></div>
        <div class="brain-bank-meta-item"><span>Generation</span><strong>${entry.generation}</strong></div>
        <div class="brain-bank-meta-item"><span>Segments</span><strong>${clampSegmentGene(entry.segmentGene)}</strong></div>
        <div class="brain-bank-meta-item"><span>Sampled</span><strong>${formatBrainBankTimestamp(entry.sampledAtIso)}</strong></div>
      </div>
      <div class="brain-bank-card-actions">
        <button class="retro-button" type="button" data-action="release" data-entry-id="${entry.id}" ${releaseDisabled ? "disabled" : ""}>RELEASE CLONE</button>
        <button class="retro-button retro-button-quiet" type="button" data-action="export" data-entry-id="${entry.id}">SAVE FILE</button>
      </div>
    </article>
  `).join("");

  drawBrainBankCanvases();
}

function drawBrainBankHabitatView(force = false) {
  if (!state.brainBankModalOpen && !force) {
    return;
  }

  const frameTicket = Math.floor(state.tick / BRAIN_BANK_HABITAT_REFRESH_INTERVAL);
  if (!force && state.brainBankHabitatDrawTick === frameTicket) {
    return;
  }
  state.brainBankHabitatDrawTick = frameTicket;

  const canvas = brainBankHabitatCanvas;
  const ctx = brainBankHabitatCtx;
  const inset = 10;
  const availableWidth = canvas.width - inset * 2;
  const availableHeight = canvas.height - inset * 2;
  const scale = Math.min(availableWidth / WIDTH, availableHeight / HEIGHT);
  const drawWidth = WIDTH * scale;
  const drawHeight = HEIGHT * scale;
  const drawX = Math.round((canvas.width - drawWidth) * 0.5);
  const drawY = Math.round((canvas.height - drawHeight) * 0.5);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#051019";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y += 12) {
    ctx.fillStyle = y % 24 === 0 ? "rgba(102, 220, 255, 0.04)" : "rgba(102, 220, 255, 0.014)";
    ctx.fillRect(0, y, canvas.width, 1);
  }

  ctx.fillStyle = "rgba(4, 10, 17, 0.84)";
  ctx.fillRect(drawX - 2, drawY - 2, drawWidth + 4, drawHeight + 4);
  ctx.drawImage(worldCanvas, 0, 0, WIDTH, HEIGHT, drawX, drawY, drawWidth, drawHeight);

  ctx.strokeStyle = "rgba(102, 220, 255, 0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(drawX - 1, drawY - 1, drawWidth + 2, drawHeight + 2);

  ctx.fillStyle = "rgba(4, 10, 17, 0.82)";
  ctx.fillRect(12, 12, 138, 44);
  ctx.strokeStyle = "rgba(102, 220, 255, 0.16)";
  ctx.lineWidth = 1;
  ctx.strokeRect(12.5, 12.5, 137, 43);
  ctx.fillStyle = "#ddfaff";
  ctx.font = CANVAS_FONTS.body;
  ctx.fillText("CLOSED HABITAT", 22, 28);
  ctx.fillStyle = "#8bbfca";
  ctx.fillText(`TICK ${String(state.tick).padStart(5, "0")}`, 22, 44);

  ctx.fillStyle = "rgba(4, 10, 17, 0.82)";
  ctx.fillRect(canvas.width - 132, canvas.height - 56, 120, 38);
  ctx.strokeStyle = "rgba(255, 241, 123, 0.18)";
  ctx.strokeRect(canvas.width - 131.5, canvas.height - 55.5, 119, 37);
  ctx.fillStyle = "#fff17b";
  ctx.fillText(`BEST ${formatAge(state.bestEverAge)}`, canvas.width - 122, canvas.height - 34);
  ctx.fillStyle = "#8bbfca";
  ctx.fillText(`BANK ${String(state.brainBank.length).padStart(2, "0")}`, canvas.width - 122, canvas.height - 20);
}

function drawHonoredWormCanvases() {
  if (!state.honoredWormsModalOpen) {
    return;
  }

  const brainCanvases = honoredWormsList.querySelectorAll("[data-honored-brain-preview]");
  for (let i = 0; i < brainCanvases.length; i += 1) {
    const canvas = brainCanvases[i];
    const entry = getHonoredWormEntryById(canvas.dataset.honoredBrainPreview);
    if (!entry) {
      continue;
    }

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#051019";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += 12) {
      ctx.fillStyle = y % 24 === 0 ? "rgba(102, 220, 255, 0.04)" : "rgba(102, 220, 255, 0.014)";
      ctx.fillRect(0, y, canvas.width, 1);
    }

    const pulse = 0.5 + Math.sin((state.tick + i * 17) * 0.05) * 0.5;
    drawBrainBlueprint(ctx, entry.brain, 12, 14, canvas.width - 24, canvas.height - 28, {
      alpha: 0.24 + pulse * 0.18,
      fluxAmount: 0.12 + pulse * 0.16,
      fluxPacketBudget: 5,
      nodePulseBudget: 3,
      fluxSpeedScale: 0.18,
      fluxSelectorSpeed: 0.11,
      nodePulseSpeed: 0.05,
      nodePulseSelectorSpeed: 0.12,
      fluxPhase: (i + 1) * 0.23,
      time: state.tick
    });
  }

  const bodyCanvases = honoredWormsList.querySelectorAll("[data-honored-body-preview]");
  for (let i = 0; i < bodyCanvases.length; i += 1) {
    const canvas = bodyCanvases[i];
    const entry = getHonoredWormEntryById(canvas.dataset.honoredBodyPreview);
    if (!entry) {
      continue;
    }

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#051019";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(102, 220, 255, 0.06)";
    ctx.fillRect(18, canvas.height - 34, canvas.width - 36, 8);
    ctx.fillStyle = "rgba(255, 241, 123, 0.08)";
    ctx.fillRect(30, canvas.height - 22, canvas.width - 60, 1);

    const pulse = 0.5 + Math.sin((state.tick + i * 23) * 0.04) * 0.5;
    drawExtinctionSpecimen(
      ctx,
      entry.specimen,
      canvas.width * 0.5,
      canvas.height * 0.52,
      1.22,
      -0.2 + Math.sin(state.tick * 0.03 + i * 0.5) * 0.06,
      0.98,
      0.46 + pulse * 0.22,
      0
    );
  }
}

function drawBrainBankCanvases() {
  if (!state.brainBankModalOpen) {
    return;
  }

  const brainCanvases = brainBankList.querySelectorAll("[data-brain-preview]");
  for (let i = 0; i < brainCanvases.length; i += 1) {
    const canvas = brainCanvases[i];
    const entry = getBrainBankEntryById(Number(canvas.dataset.brainPreview));
    if (!entry) {
      continue;
    }

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#051019";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += 12) {
      ctx.fillStyle = y % 24 === 0 ? "rgba(102, 220, 255, 0.04)" : "rgba(102, 220, 255, 0.014)";
      ctx.fillRect(0, y, canvas.width, 1);
    }

    const pulse = 0.5 + Math.sin(entry.id * 0.9) * 0.5;
    drawBrainBlueprint(ctx, entry.brain, 12, 14, canvas.width - 24, canvas.height - 28, {
      alpha: 0.24 + pulse * 0.18,
      fluxAmount: 0.12 + pulse * 0.16,
      fluxPacketBudget: 5,
      nodePulseBudget: 3,
      fluxSpeedScale: 0.18,
      fluxSelectorSpeed: 0.11,
      nodePulseSpeed: 0.05,
      nodePulseSelectorSpeed: 0.12,
      fluxPhase: entry.id * 0.13,
      time: state.tick
    });
  }

  const bodyCanvases = brainBankList.querySelectorAll("[data-body-preview]");
  for (let i = 0; i < bodyCanvases.length; i += 1) {
    const canvas = bodyCanvases[i];
    const entry = getBrainBankEntryById(Number(canvas.dataset.bodyPreview));
    if (!entry) {
      continue;
    }

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#051019";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(102, 220, 255, 0.06)";
    ctx.fillRect(18, canvas.height - 34, canvas.width - 36, 8);
    ctx.fillStyle = "rgba(255, 241, 123, 0.08)";
    ctx.fillRect(30, canvas.height - 22, canvas.width - 60, 1);

    const pulse = 0.5 + Math.sin(entry.id * 0.8) * 0.5;
    drawExtinctionSpecimen(
      ctx,
      entry.specimen,
      canvas.width * 0.5,
      canvas.height * 0.52,
      1.22,
      -0.2 + Math.sin(state.tick * 0.03 + entry.id * 0.4) * 0.06,
      0.98,
      0.46 + pulse * 0.22,
      0
    );
  }
}

async function exportBrainBankEntry(entryId) {
  const entry = getBrainBankEntryById(entryId);
  if (!entry) {
    return;
  }

  try {
    const result = await saveBrainBankEntryToDisk(entry, true);
    if (result.saved) {
      setBrainBankMessage(`Saved ${entry.fileName} into ${result.path}.`);
      return;
    }
  } catch (error) {
    // Fall through to message below.
  }

  setBrainBankMessage("Brain file save was cancelled or folder access is unavailable.");
}

function releaseBrainBankClone(entryId) {
  const entry = getBrainBankEntryById(entryId);
  if (!entry) {
    return;
  }

  spawnBrainBankCreature(entry, {
    recentAction: "BANK",
    sparkColor: "#fff17b",
    busyMessage: "Wait for the active lab animation to finish before releasing a stored clone.",
    populationMessage: "Population cap reached. Lower the count or wait for space before releasing a clone.",
    successMessage: (specimenEntry) => `Released a live clone from ${specimenEntry.displayName}.`
  });
}

function spawnBrainBankCreature(entry, options = {}) {
  if (isBrainBankBusy()) {
    setBrainBankMessage(options.busyMessage || "Wait for the active lab animation to finish before spawning a stored specimen.");
    return false;
  }

  if (getLivingCreaturesCount() >= CONFIG.maxCreatures) {
    setBrainBankMessage(options.populationMessage || "Population cap reached. Lower the count or wait for space before spawning a stored specimen.");
    return false;
  }

  const clone = createCreature(null, {
    brainOverride: entry.brain,
    hueOverride: entry.hue,
    segmentGeneOverride: entry.segmentGene,
    generationOverride: entry.generation,
    positionOverride: randomInteriorPosition(CONFIG.creatureRadius),
    headingOverride: rand(0, TAU),
    velocityOverride: { vx: rand(-0.45, 0.45), vy: rand(-0.45, 0.45) },
    energyOverride: CONFIG.startingEnergy
  });

  clone.recentAction = options.recentAction || "BANK";
  state.creatures.push(clone);
  spawnSpark(clone.x, clone.y, options.sparkColor || "#fff17b", options.sparkCount || 12);
  playBirthSound(clone.x);
  chooseFeaturedCreature();
  renderBrainBankList();
  renderSimulationPanels();
  drawBrainBankHabitatView(true);
  setBrainBankMessage(
    typeof options.successMessage === "function"
      ? options.successMessage(entry)
      : options.successMessage || `Released a live clone from ${entry.displayName}.`
  );
  return true;
}

function createBrainBankEntryFromFilePayload(payload, fileName) {
  const acceptedKinds = new Set([BRAIN_BANK_FILE_KIND, ...LEGACY_BRAIN_BANK_FILE_KINDS]);
  if (payload?.kind && !acceptedKinds.has(payload.kind)) {
    throw new Error("That file is not a brain-bank specimen export from this lab.");
  }

  const brain = payload?.brain || payload?.specimen?.brain;
  if (!isValidBrainShape(brain)) {
    throw new Error("That file does not contain a compatible brain layout.");
  }

  const metadata = payload?.metadata || {};
  const specimenSource = payload?.specimen || {
    hue: metadata.hue,
    energy: CONFIG.startingEnergy,
    age: metadata.ageFrames,
    generation: metadata.generation,
    segmentGene: metadata.segmentGene,
    lifeStage: "adult",
    heading: -0.18
  };

  return createBrainBankEntry(
    {
      creatureId: metadata.sourceCreatureId ?? null,
      brain,
      specimen: specimenSource,
      sampledAtIso: payload?.exportedAt,
      sampledTick: metadata.sampledTick,
      fileName,
      origin: "imported",
      note: "Imported from a saved specimen file."
    },
    {
      displayName: metadata.displayName || fileName.replace(/\.json$/i, ""),
      fileName,
      origin: "imported"
    }
  );
}

function createHonoredWormEntryFromFilePayload(payload, descriptor = {}) {
  const brain = payload?.brain || payload?.specimen?.brain;
  if (!isValidBrainShape(brain)) {
    throw new Error("A bundled honored worm brain file is not compatible with this lab.");
  }

  const metadata = payload?.metadata || {};
  const fileName = descriptor.fileName || metadata.fileName || "bundled-honored-worm.json";
  const specimenSource = payload?.specimen || {
    hue: metadata.hue,
    energy: CONFIG.startingEnergy,
    age: metadata.ageFrames,
    generation: metadata.generation,
    segmentGene: metadata.segmentGene,
    lifeStage: "adult",
    heading: -0.18
  };
  const specimen = cloneBrainBankSpecimen(specimenSource, brain);

  return {
    displayName: descriptor.displayName || metadata.displayName || fileName.replace(/\.json$/i, ""),
    creatureId: metadata.sourceCreatureId ?? null,
    origin: "honored",
    sampledAtIso: payload?.exportedAt || new Date().toISOString(),
    sampledTick: metadata.sampledTick ?? 0,
    note: descriptor.note || "Bundled honored specimen included with the lab.",
    fileName,
    brain: cloneBrain(brain),
    specimen,
    hue: specimen.hue,
    generation: specimen.generation,
    segmentGene: specimen.segmentGene,
    ageFrames: specimen.age,
    badgeLabel: descriptor.badgeLabel || "HONORED",
    sparkColor: descriptor.sparkColor || "#fff17b",
    recentAction: descriptor.recentAction || "HONOR"
  };
}

function getHonoredWormEntryById(entryId) {
  for (let i = 0; i < state.honoredWormEntries.length; i += 1) {
    if (state.honoredWormEntries[i].fileName === entryId) {
      return state.honoredWormEntries[i];
    }
  }
  return null;
}

async function loadHonoredWorms(force = false) {
  if (honoredWormLoadPromise) {
    return honoredWormLoadPromise;
  }

  if (!force && state.honoredWormEntries.length === HONORED_WORM_DESCRIPTORS.length) {
    return true;
  }

  state.honoredWormLoadState = "loading";
  updateBrainBankUi();

  honoredWormLoadPromise = (async () => {
    try {
      const payloadMap = getBundledHonoredWormPayloadMap();
      const entries = [];

      for (let i = 0; i < HONORED_WORM_DESCRIPTORS.length; i += 1) {
        const descriptor = HONORED_WORM_DESCRIPTORS[i];
        const payload = payloadMap.get(descriptor.fileName);
        if (!payload) {
          throw new Error(`Missing bundled payload for ${descriptor.fileName}`);
        }
        entries.push(createHonoredWormEntryFromFilePayload(payload, descriptor));
      }

      state.honoredWormEntries = entries;
      state.honoredWormLoadState = "ready";
      renderHonoredWormsList();
      return true;
    } catch (error) {
      state.honoredWormEntries = [];
      state.honoredWormLoadState = "error";
      renderHonoredWormsList();
      return false;
    } finally {
      honoredWormLoadPromise = null;
      updateBrainBankUi();
    }
  })();

  return honoredWormLoadPromise;
}

async function spawnHonoredWorm(entryId) {
  if (state.honoredWormEntries.length === 0) {
    setBrainBankMessage("Loading the built-in Honored Worms gallery.");
    const loaded = await loadHonoredWorms(true);
    if (!loaded || state.honoredWormEntries.length === 0) {
      setBrainBankMessage("The built-in Honored Worms gallery could not be loaded from its bundled specimen files.");
      return;
    }
  }

  const entry = getHonoredWormEntryById(entryId);
  if (!entry) {
    setBrainBankMessage("That honored specimen is not available right now.");
    return;
  }

  spawnBrainBankCreature(entry, {
    recentAction: entry.recentAction,
    sparkColor: entry.sparkColor,
    busyMessage: `Wait for the active lab animation to finish before spawning ${entry.displayName}.`,
    populationMessage: `Population cap reached. Lower the count or wait for space before spawning ${entry.displayName}.`,
    successMessage: (entry) => `Spawned ${entry.displayName} into the habitat.`
  });
}

async function importBrainBankFiles(fileList) {
  const files = Array.from(fileList || []);
  if (files.length === 0) {
    return;
  }

  let imported = 0;
  let failed = 0;
  let reserved = 0;
  let newestEntryId = null;

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (isBundledHonoredWormFileName(file.name)) {
      reserved += 1;
      continue;
    }
    try {
      const payload = JSON.parse(await file.text());
      const entry = createBrainBankEntryFromFilePayload(payload, file.name);
      const result = upsertBrainBankEntry(entry);
      newestEntryId = result.entry.id;
      if (result.inserted) {
        imported += 1;
      }
    } catch (error) {
      failed += 1;
    }
  }

  if (newestEntryId !== null) {
    state.brainBankFocusId = newestEntryId;
  }
  renderBrainBankList();
  setBrainBankModalOpen(true, newestEntryId);
  if (imported > 0 && failed === 0 && reserved === 0) {
    setBrainBankMessage(`Imported ${imported} brain specimen file${imported === 1 ? "" : "s"} into the vault.`);
  } else if (imported > 0) {
    const reservedCopy = reserved > 0
      ? reserved === 1
        ? " The built-in Honored Worm stays separate and was not imported."
        : " The built-in Honored Worms stay separate and were not imported."
      : "";
    if (failed === 0) {
      setBrainBankMessage(`Imported ${imported} brain file${imported === 1 ? "" : "s"} into the vault.${reservedCopy}`);
      return;
    }
    setBrainBankMessage(`Imported ${imported} brain file${imported === 1 ? "" : "s"} and skipped ${failed} incompatible file${failed === 1 ? "" : "s"}.`);
  } else if (reserved > 0 && failed === 0) {
    setBrainBankMessage("The built-in Honored Worms are already available from their own gallery, so they were not imported into the vault.");
  } else {
    setBrainBankMessage("No compatible brain specimen files were imported.");
  }
}

async function restoreBrainBankFromDiskOnStartup() {
  if (!supportsBrainBankFolderAccess()) {
    setBrainBankMessage(`This browser cannot link the ${APP_NAME} folder. Brain files will stay session-only here.`);
    return;
  }

  const result = await loadBrainBankEntriesFromDisk();
  renderBrainBankList();
  updateBrainBankUi();

  if (!result.available) {
    setBrainBankMessage(`Choose the ${APP_NAME} folder the first time you sample a brain. Files will be saved in ${BRAIN_BANK_FOLDER_NAME}.`);
    return;
  }

  if (result.loaded > 0 && result.skipped === 0) {
    setBrainBankMessage(`Auto-loaded ${result.loaded} stored brain file${result.loaded === 1 ? "" : "s"} from ${BRAIN_BANK_FOLDER_NAME}.`);
    return;
  }

  if (result.loaded > 0) {
    setBrainBankMessage(`Auto-loaded ${result.loaded} brain file${result.loaded === 1 ? "" : "s"} from ${BRAIN_BANK_FOLDER_NAME} and skipped ${result.skipped} incompatible file${result.skipped === 1 ? "" : "s"}.`);
    return;
  }

  setBrainBankMessage(`Brain bank folder linked. New specimen files will be saved in ${BRAIN_BANK_FOLDER_NAME}.`);
}

function createCreature(parent = null, options = {}) {
  const radius = CONFIG.creatureRadius;
  const lineageParentId = options.lineageParentIdOverride ?? (parent ? parent.id : null);
  const position = options.positionOverride
    ? {
        x: clamp(options.positionOverride.x, radius + 2, WIDTH - radius - 2),
        y: clamp(options.positionOverride.y, radius + 2, HEIGHT - radius - 2)
      }
    : parent
      ? {
          x: clamp(parent.x + rand(-18, 18), radius + 2, WIDTH - radius - 2),
          y: clamp(parent.y + rand(-18, 18), radius + 2, HEIGHT - radius - 2)
        }
      : randomInteriorPosition(radius);

  const hue = options.hueOverride !== undefined
    ? normalizeHueValue(options.hueOverride)
    : normalizeHueValue(parent ? parent.hue + rand(-12, 12) : rand(20, 65));
  const brain = options.brainOverride
    ? cloneBrain(options.brainOverride)
    : parent
      ? createBrain(parent.brain)
      : createBrain();
  const lifeStage = options.lifeStage || "adult";
  const generation = options.generationOverride ?? (parent ? parent.generation + 1 : 1);
  const velocity = options.velocityOverride || { vx: rand(-0.6, 0.6), vy: rand(-0.6, 0.6) };
  const energy = options.energyOverride ?? (parent ? CONFIG.startingEnergy * 0.82 : CONFIG.startingEnergy);
  const heading = options.headingOverride ?? rand(0, TAU);
  const segmentGene = options.segmentGeneOverride !== undefined
    ? clampSegmentGene(options.segmentGeneOverride)
    : parent
      ? mutateSegmentGene(parent.segmentGene)
      : randomSegmentGene();

  const creature = {
    id: state.nextCreatureId++,
    x: position.x,
    y: position.y,
    vx: velocity.vx,
    vy: velocity.vy,
    heading,
    radius,
    energy,
    age: 0,
    generation,
    children: 0,
    hue,
    segmentGene,
    brain,
    senses: null,
    hiddenLayers: CONFIG.hiddenLayerSizes.map((size) => Array(size).fill(0)),
    outputs: Array(OUTPUT_LABELS.length).fill(0),
    memoryState: Array(CONFIG.memoryNeuronCount).fill(0),
    memoryWrite: Array(CONFIG.memoryNeuronCount).fill(0),
    forwardDrive: 0,
    sideDrive: 0,
    displayForwardDrive: 0,
    displaySideDrive: 0,
    turnVelocity: 0,
    displayTurnVelocity: 0,
    movePhase: rand(0, TAU),
    segmentBodies: [],
    recentAction: lifeStage === "egg" ? "EGG" : "FORWARD",
    lifeStage,
    eggTimer: lifeStage === "egg" ? CONFIG.eggHatchFrames : 0,
    birthingTimer: 0,
    growthTimer: lifeStage === "juvenile" ? CONFIG.juvenileGrowthFrames : 0,
    deathTimer: 0,
    deathSpin: rand(-0.18, 0.18),
    lineageParentId,
    alive: true
  };

  registerLineageCreature(creature, lineageParentId);
  return creature;
}

function createFood() {
  const radius = CONFIG.foodRadius;
  const position = randomInteriorPosition(radius);
  return {
    x: position.x,
    y: position.y,
    radius,
    energy: CONFIG.energyFromFood,
    age: 0,
    pulse: rand(0, TAU)
  };
}

function getCreatureGrowthScale(creature) {
  if (creature.lifeStage === "egg") {
    return 0.66;
  }

  if (creature.lifeStage === "juvenile") {
    const growth = 1 - clamp(creature.growthTimer / CONFIG.juvenileGrowthFrames, 0, 1);
    return 0.58 + growth * 0.42;
  }

  if (!creature.alive) {
    const deathProgress = 1 - clamp(creature.deathTimer / CONFIG.deathAnimationFrames, 0, 1);
    return 1 - deathProgress * 0.28;
  }

  return 1;
}

function getCreatureBodyMetrics(creature) {
  const lifeScale = getCreatureGrowthScale(creature);
  const energyRatio = clamp(creature.energy / CONFIG.maxEnergy, 0.08, 1);
  const radiusScale = (creature.radius || CONFIG.creatureRadius) / 10;
  const headLength = Math.round((14 + energyRatio * 5) * lifeScale * radiusScale);
  const headHeight = Math.round((6 + energyRatio * 8) * lifeScale * radiusScale);
  const headOuterWidth = Math.max(10, Math.round(headLength * 1.02));
  const headOuterHeight = Math.max(7, Math.round(headHeight * 1.02));
  const headInnerWidth = Math.max(8, Math.round(headOuterWidth * 0.9));
  const headInnerHeight = Math.max(6, Math.round(headOuterHeight * 0.88));
  const headFillWidth = Math.max(7, Math.round(headOuterWidth * 0.8));
  const headFillHeight = Math.max(5, Math.round(headOuterHeight * 0.78));
  const tailAnchorLocal = {
    x: -Math.round(headLength * 0.46),
    y: 0
  };
  const segmentLayout = buildSegmentedBodyLayout(creature, headLength, headHeight, lifeScale, tailAnchorLocal);

  return {
    lifeScale,
    energyRatio,
    headLength,
    headHeight,
    headOuterWidth,
    headOuterHeight,
    headInnerWidth,
    headInnerHeight,
    headFillWidth,
    headFillHeight,
    headRadius: Math.max(headOuterWidth, headOuterHeight) * 0.46,
    leftEyeLocal: {
      x: Math.round(headLength * 0.16),
      y: -Math.max(3, Math.round(headHeight * 0.3)) + 1
    },
    rightEyeLocal: {
      x: Math.round(headLength * 0.16),
      y: Math.max(1, Math.round(headHeight * 0.12)) + 1
    },
    mouthLocal: {
      x: Math.round(headLength * 0.46),
      y: 0
    },
    tailAnchorLocal,
    segmentLayout
  };
}

function bodyLocalToWorld(creature, metrics, localX, localY) {
  const cos = Math.cos(creature.heading);
  const sin = Math.sin(creature.heading);

  return {
    x: creature.x + localX * cos - localY * sin,
    y: creature.y + localX * sin + localY * cos
  };
}

function getEggSpawnPose(parent, bodyMetrics = null) {
  const metrics = bodyMetrics || getCreatureBodyMetrics(parent);
  ensureCreatureSegmentBodies(parent, metrics);
  const adultCount = getAdultSegmentCount(parent);
  const eggRadius = Math.max(5, Math.round(CONFIG.creatureRadius * 0.62));

  if (adultCount > 0) {
    const tailIndex = adultCount - 1;
    const tailSegment = parent.segmentBodies[tailIndex];
    const tailLayout = metrics.segmentLayout.segments[tailIndex];
    if (tailSegment && tailLayout) {
      const spawnDistance = tailLayout.length * 0.52 + eggRadius + 2;
      return {
        x: clamp(
          tailSegment.x - Math.cos(tailSegment.angle) * spawnDistance,
          eggRadius + 2,
          WIDTH - eggRadius - 2
        ),
        y: clamp(
          tailSegment.y - Math.sin(tailSegment.angle) * spawnDistance,
          eggRadius + 2,
          HEIGHT - eggRadius - 2
        ),
        angle: tailSegment.angle
      };
    }
  }

  const tailAnchor = bodyLocalToWorld(
    parent,
    metrics,
    metrics.tailAnchorLocal.x,
    metrics.tailAnchorLocal.y
  );
  const fallbackDistance = metrics.headLength * 0.7 + eggRadius + 3;
  return {
    x: clamp(
      tailAnchor.x - Math.cos(parent.heading) * fallbackDistance,
      eggRadius + 2,
      WIDTH - eggRadius - 2
    ),
    y: clamp(
      tailAnchor.y - Math.sin(parent.heading) * fallbackDistance,
      eggRadius + 2,
      HEIGHT - eggRadius - 2
    ),
    angle: parent.heading
  };
}

function getEggSpawnPosition(parent) {
  const bodyMetrics = getCreatureBodyMetrics(parent);
  const pose = getEggSpawnPose(parent, bodyMetrics);
  return {
    x: pose.x,
    y: pose.y
  };
}

function getBirthingTravelProgress(creature, nodeCount) {
  if (creature.birthingTimer <= 0 || nodeCount <= 1) {
    return null;
  }

  const progress = smooth01(clamp(1 - creature.birthingTimer / CONFIG.birthAnimationFrames, 0, 1));
  return {
    progress,
    travel: progress * (nodeCount - 1)
  };
}

function getBirthingSegmentBulge(creature, segmentIndex, segmentCount) {
  const birthingState = getBirthingTravelProgress(creature, segmentCount + 2);
  if (!birthingState) {
    return 0;
  }

  const bulgeCenter = segmentIndex + 1;
  const distance = Math.abs(birthingState.travel - bulgeCenter);
  return smooth01(clamp(1 - distance / 0.92, 0, 1));
}

function beginCreatureBirth(creature) {
  creature.birthingTimer = CONFIG.birthAnimationFrames;
  creature.forwardDrive = 0;
  creature.sideDrive = 0;
  creature.displayForwardDrive = damp(creature.displayForwardDrive, 0, 0.65);
  creature.displaySideDrive = damp(creature.displaySideDrive, 0, 0.65);
  creature.turnVelocity *= 0.18;
  creature.displayTurnVelocity = damp(creature.displayTurnVelocity, 0, 0.6);
  creature.vx *= 0.22;
  creature.vy *= 0.22;
  creature.recentAction = "BIRTH";
}

function releaseCreatureEgg(parent) {
  const spawnPose = getEggSpawnPose(parent);
  const child = createCreature(parent, {
    lifeStage: "egg",
    positionOverride: spawnPose
  });
  child.heading = spawnPose.angle + rand(-0.18, 0.18);
  child.vx = parent.vx * 0.18 - Math.cos(spawnPose.angle) * rand(0.12, 0.22) + rand(-0.08, 0.08);
  child.vy = parent.vy * 0.18 - Math.sin(spawnPose.angle) * rand(0.12, 0.22) + rand(-0.08, 0.08);
  state.creatures.push(child);
  state.births += 1;
  parent.children += 1;
  parent.recentAction = "LAID";
  spawnSpark(child.x, child.y, "#fff17b", 8);
  playBirthSound(child.x);
}

function getAdultSegmentCount(creature) {
  return clampSegmentGene(creature.segmentGene);
}

function getSegmentSpacing(headLength, lifeScale, progress) {
  const baseSpacing = headLength * (0.44 - progress * 0.06) + 2;
  return Math.max(6, Math.round(baseSpacing * lifeScale));
}

function ensureCreatureSegmentBodies(creature, bodyMetrics) {
  if (creature.lifeStage === "egg") {
    creature.segmentBodies.length = 0;
    return;
  }

  const adultCount = getAdultSegmentCount(creature);
  if (creature.segmentBodies.length > adultCount) {
    creature.segmentBodies.length = adultCount;
  }

  const anchor = bodyLocalToWorld(
    creature,
    bodyMetrics,
    bodyMetrics.tailAnchorLocal.x,
    bodyMetrics.tailAnchorLocal.y
  );
  let parentX = anchor.x;
  let parentY = anchor.y;
  let parentAngle = creature.heading;

  for (let i = 0; i < adultCount; i += 1) {
    const progress = adultCount <= 1 ? 0 : i / (adultCount - 1);
    const spacing = getSegmentSpacing(bodyMetrics.headLength, bodyMetrics.lifeScale, progress);
    let segment = creature.segmentBodies[i];

    if (!segment) {
      segment = {
        x: parentX - Math.cos(parentAngle) * spacing,
        y: parentY - Math.sin(parentAngle) * spacing,
        vx: 0,
        vy: 0,
        angle: parentAngle,
        angularVelocity: 0
      };
      creature.segmentBodies.push(segment);
    } else if (
      !Number.isFinite(segment.x) ||
      !Number.isFinite(segment.y) ||
      !Number.isFinite(segment.angle)
    ) {
      segment.x = parentX - Math.cos(parentAngle) * spacing;
      segment.y = parentY - Math.sin(parentAngle) * spacing;
      segment.vx = 0;
      segment.vy = 0;
      segment.angle = parentAngle;
      segment.angularVelocity = 0;
    } else if (!Number.isFinite(segment.angularVelocity)) {
      segment.angularVelocity = 0;
    }

    parentX = segment.x;
    parentY = segment.y;
    parentAngle = segment.angle;
  }
}

function solveSegmentConstraint(parent, child, spacing, stiffness, parentShare = 0.35) {
  let dx = child.x - parent.x;
  let dy = child.y - parent.y;
  let distance = Math.hypot(dx, dy);

  if (!Number.isFinite(distance) || distance < 0.0001) {
    const fallbackAngle = Number.isFinite(child.angle)
      ? child.angle
      : Number.isFinite(parent.angle)
        ? parent.angle
        : 0;
    dx = Math.cos(fallbackAngle) * spacing;
    dy = Math.sin(fallbackAngle) * spacing;
    distance = spacing || 0.0001;
  }

  const correctionScale = ((distance - spacing) / distance) * stiffness;
  const correctionX = dx * correctionScale;
  const correctionY = dy * correctionScale;
  const childShare = parent.movable ? 1 - parentShare : 1;

  if (parent.movable) {
    parent.x += correctionX * parentShare;
    parent.y += correctionY * parentShare;
    if (Number.isFinite(parent.vx)) {
      parent.vx += correctionX * parentShare * 0.16;
    }
    if (Number.isFinite(parent.vy)) {
      parent.vy += correctionY * parentShare * 0.16;
    }
  }

  child.x -= correctionX * childShare;
  child.y -= correctionY * childShare;
  if (Number.isFinite(child.vx)) {
    child.vx -= correctionX * childShare * 0.16;
  }
  if (Number.isFinite(child.vy)) {
    child.vy -= correctionY * childShare * 0.16;
  }
}

function spreadSegmentImpulse(creature, sourceIndex, dx, dy, velocityScale = 0.16) {
  if (!creature.segmentBodies.length || sourceIndex < 0) {
    return;
  }

  for (let offset = 1; offset <= 2; offset += 1) {
    const influence = Math.pow(CONFIG.segmentImpactSpread, offset) * 0.34;
    if (influence < 0.04) {
      continue;
    }

    const leftIndex = sourceIndex - offset;
    const rightIndex = sourceIndex + offset;

    if (leftIndex >= 0) {
      const segment = creature.segmentBodies[leftIndex];
      segment.x += dx * influence;
      segment.y += dy * influence;
      segment.vx += dx * velocityScale * influence;
      segment.vy += dy * velocityScale * influence;
    }

    if (rightIndex < creature.segmentBodies.length) {
      const segment = creature.segmentBodies[rightIndex];
      segment.x += dx * influence;
      segment.y += dy * influence;
      segment.vx += dx * velocityScale * influence;
      segment.vy += dy * velocityScale * influence;
    }
  }
}

function relaxCreatureSegments(creature, iterations = 1) {
  if (creature.lifeStage === "egg") {
    creature.segmentBodies.length = 0;
    return;
  }

  const bodyMetrics = getCreatureBodyMetrics(creature);
  ensureCreatureSegmentBodies(creature, bodyMetrics);
  const adultCount = getAdultSegmentCount(creature);
  if (adultCount <= 0) {
    return;
  }

  const normalizedTurn = CONFIG.maxTurnSpeed > 0
    ? clamp(creature.displayTurnVelocity / CONFIG.maxTurnSpeed, -1, 1)
    : 0;
  const locomotionDrive = clamp(
    Math.abs(creature.displayForwardDrive) * 0.82 + Math.abs(normalizedTurn) * 0.38,
    0,
    1
  );

  const anchor = bodyLocalToWorld(
    creature,
    bodyMetrics,
    bodyMetrics.tailAnchorLocal.x,
    bodyMetrics.tailAnchorLocal.y
  );

  let parentX = anchor.x;
  let parentY = anchor.y;
  let parentAngle = creature.heading;
  let parentVX = creature.vx;
  let parentVY = creature.vy;

  for (let i = 0; i < adultCount; i += 1) {
    const segment = creature.segmentBodies[i];
    const progress = adultCount <= 1 ? 0 : i / (adultCount - 1);
    const spacing = getSegmentSpacing(bodyMetrics.headLength, bodyMetrics.lifeScale, progress);
    const wavePhase = creature.movePhase * CONFIG.segmentWaveFrequency - i * CONFIG.segmentWaveLag;
    const waveStrength = locomotionDrive * (0.24 + progress * 0.92);
    const waveOffset =
      Math.sin(wavePhase) *
      bodyMetrics.headLength *
      CONFIG.segmentWaveAmplitude *
      waveStrength;
    const waveVelocity =
      Math.cos(wavePhase) *
      bodyMetrics.headLength *
      CONFIG.segmentWaveVelocityCarry *
      waveStrength;
    const anchorX = parentX - Math.cos(parentAngle) * spacing - Math.sin(parentAngle) * waveOffset;
    const anchorY = parentY - Math.sin(parentAngle) * spacing + Math.cos(parentAngle) * waveOffset;
    const leaderPull = CONFIG.segmentFollowStiffness * (0.92 - progress * 0.18);
    const inheritedVelocity = 0.08 + (1 - progress) * 0.06;
    const turnBias = normalizedTurn * CONFIG.segmentTurnCurlStrength * (0.08 + progress * 0.12);

    segment.vx =
      segment.vx * CONFIG.segmentVelocityDamping +
      (anchorX - segment.x) * leaderPull +
      parentVX * inheritedVelocity +
      -Math.sin(parentAngle) * (turnBias * 0.12 + waveVelocity);
    segment.vy =
      segment.vy * CONFIG.segmentVelocityDamping +
      (anchorY - segment.y) * leaderPull +
      parentVY * inheritedVelocity +
      Math.cos(parentAngle) * (turnBias * 0.12 + waveVelocity);

    const segmentSpeed = Math.hypot(segment.vx, segment.vy);
    if (segmentSpeed > CONFIG.segmentMaxSpeed) {
      const scale = CONFIG.segmentMaxSpeed / segmentSpeed;
      segment.vx *= scale;
      segment.vy *= scale;
    }

    segment.x += segment.vx;
    segment.y += segment.vy;

    parentX = segment.x;
    parentY = segment.y;
    parentAngle = segment.angle;
    parentVX = segment.vx;
    parentVY = segment.vy;
  }

  const passes = Math.max(2, iterations * 2 + 1);
  for (let pass = 0; pass < passes; pass += 1) {
    let leader = {
      x: anchor.x,
      y: anchor.y,
      vx: creature.vx,
      vy: creature.vy,
      angle: creature.heading,
      movable: false
    };

    for (let i = 0; i < adultCount; i += 1) {
      const progress = adultCount <= 1 ? 0 : i / (adultCount - 1);
      const spacing = getSegmentSpacing(bodyMetrics.headLength, bodyMetrics.lifeScale, progress);
      const stiffness = CONFIG.segmentConstraintPull * (0.92 - progress * 0.18);
      const segment = creature.segmentBodies[i];
      segment.movable = true;
      solveSegmentConstraint(leader, segment, spacing, stiffness, i === 0 ? 0 : 0.4);
      leader = segment;
    }

    for (let i = adultCount - 1; i >= 1; i -= 1) {
      const progress = adultCount <= 1 ? 0 : i / (adultCount - 1);
      const spacing = getSegmentSpacing(bodyMetrics.headLength, bodyMetrics.lifeScale, progress);
      solveSegmentConstraint(
        creature.segmentBodies[i - 1],
        creature.segmentBodies[i],
        spacing,
        CONFIG.segmentConstraintPull * 0.56 * (0.96 - progress * 0.12),
        0.5
      );
    }
  }

  parentX = anchor.x;
  parentY = anchor.y;
  parentAngle = creature.heading;

  for (let i = 0; i < adultCount; i += 1) {
    const segment = creature.segmentBodies[i];
    const progress = adultCount <= 1 ? 0 : i / (adultCount - 1);
    const wavePhase = creature.movePhase * CONFIG.segmentWaveFrequency - i * CONFIG.segmentWaveLag;
    const waveAngle =
      Math.cos(wavePhase) *
      CONFIG.segmentWaveAngleInfluence *
      locomotionDrive *
      (0.3 + progress * 0.9);
    const chainAngle = Math.atan2(parentY - segment.y, parentX - segment.x) + waveAngle;
    const anglePull =
      normalizeAngle(chainAngle - segment.angle) * (CONFIG.segmentAngleFollow * (1 - progress * 0.18));
    const carryPull =
      normalizeAngle(parentAngle - segment.angle) * (CONFIG.segmentAngleCarry * (0.9 - progress * 0.18));
    const turnImpulse = normalizedTurn * CONFIG.segmentTurnCurlStrength * (0.02 + progress * 0.045);

    segment.angularVelocity =
      (segment.angularVelocity + anglePull + carryPull + turnImpulse) * CONFIG.segmentAngularDamping;
    segment.angularVelocity = clamp(
      segment.angularVelocity,
      -CONFIG.segmentMaxAngularSpeed,
      CONFIG.segmentMaxAngularSpeed
    );
    segment.angle = normalizeAngle(segment.angle + segment.angularVelocity);
    segment.angle = dampAngle(segment.angle, chainAngle, 0.22 + progress * 0.05);

    const maxBend = 1.15 + progress * 0.35;
    segment.angle = parentAngle + clamp(
      normalizeAngle(segment.angle - parentAngle),
      -maxBend,
      maxBend
    );

    parentX = segment.x;
    parentY = segment.y;
    parentAngle = segment.angle;
    delete segment.movable;
  }
}

function buildCreatureCollisionBodies(creature, bodyMetrics) {
  const bodies = [
    {
      type: "head",
      creature,
      x: creature.x,
      y: creature.y,
      radius: bodyMetrics.headRadius
    }
  ];

  for (let i = 0; i < bodyMetrics.segmentLayout.segments.length; i += 1) {
    const segment = bodyMetrics.segmentLayout.segments[i];
    bodies.push({
      type: "segment",
      creature,
      segmentIndex: i,
      segment,
      segmentState: creature.segmentBodies[i],
      x: segment.x,
      y: segment.y,
      radius: segment.radius
    });
  }

  return bodies;
}

function applyCollisionDisplacement(body, dx, dy, velocityScale = 0.16) {
  body.x += dx;
  body.y += dy;

  if (body.type === "head") {
    body.creature.x += dx;
    body.creature.y += dy;
    body.creature.vx += dx * velocityScale;
    body.creature.vy += dy * velocityScale;
    return;
  }

  if (!body.segmentState) {
    return;
  }

  body.segmentState.x += dx;
  body.segmentState.y += dy;
  body.segmentState.vx += dx * velocityScale;
  body.segmentState.vy += dy * velocityScale;
  spreadSegmentImpulse(body.creature, body.segmentIndex, dx, dy, velocityScale * 1.15);
  body.creature.vx += dx * CONFIG.segmentCollisionTransfer;
  body.creature.vy += dy * CONFIG.segmentCollisionTransfer;
}

function resolveCreatureWallCollisions(creature) {
  if (creature.lifeStage === "egg") {
    return;
  }

  const bodyMetrics = getCreatureBodyMetrics(creature);
  const bodies = buildCreatureCollisionBodies(creature, bodyMetrics);
  let bounced = false;
  let sparkX = creature.x;
  let sparkY = creature.y;

  for (let i = 0; i < bodies.length; i += 1) {
    const body = bodies[i];
    const minX = body.radius;
    const maxX = WIDTH - body.radius;
    const minY = body.radius;
    const maxY = HEIGHT - body.radius;
    let pushX = 0;
    let pushY = 0;

    if (body.x < minX) {
      pushX = minX - body.x;
    } else if (body.x > maxX) {
      pushX = maxX - body.x;
    }

    if (body.y < minY) {
      pushY = minY - body.y;
    } else if (body.y > maxY) {
      pushY = maxY - body.y;
    }

    if (pushX === 0 && pushY === 0) {
      continue;
    }

    bounced = true;
    sparkX = body.x + pushX;
    sparkY = body.y + pushY;

    if (body.type === "head") {
      body.x += pushX;
      body.y += pushY;
      creature.x += pushX;
      creature.y += pushY;
      if (pushX !== 0) {
        creature.vx = -creature.vx * 0.7;
      }
      if (pushY !== 0) {
        creature.vy = -creature.vy * 0.7;
      }
    } else if (body.segmentState) {
      body.x += pushX;
      body.y += pushY;
      body.segmentState.x += pushX;
      body.segmentState.y += pushY;
      if (pushX !== 0) {
        body.segmentState.vx = -body.segmentState.vx * CONFIG.segmentWallBounce;
      }
      if (pushY !== 0) {
        body.segmentState.vy = -body.segmentState.vy * CONFIG.segmentWallBounce;
      }
      spreadSegmentImpulse(creature, body.segmentIndex, pushX * 0.75, pushY * 0.75, 0.12);
    }
  }

  if (bounced) {
    creature.energy -= CONFIG.collisionCost * 0.6;
    spawnSpark(sparkX, sparkY, "#66dcff", 5);
    relaxCreatureSegments(creature, 2);
  }
}

function killCreature(creature) {
  if (!creature.alive) {
    return;
  }

  const wasLastLiving = getLivingCreaturesCount() <= 1;
  creature.alive = false;
  creature.lifeStage = "dying";
  creature.deathTimer = CONFIG.deathAnimationFrames;
  creature.vx *= 0.35;
  creature.vy *= 0.35;
  creature.forwardDrive = 0;
  creature.sideDrive = 0;
  creature.displayForwardDrive = 0;
  creature.displaySideDrive = 0;
  creature.turnVelocity = 0;
  creature.displayTurnVelocity = 0;
  creature.outputs = Array(OUTPUT_LABELS.length).fill(0);
  creature.memoryWrite = Array(CONFIG.memoryNeuronCount).fill(0);
  creature.recentAction = "DEAD";
  state.deaths += 1;
  updateLineageCreatureNode(creature);
  const lineageNode = state.lineageNodes.get(creature.id);
  if (lineageNode) {
    lineageNode.alive = false;
    lineageNode.deathTick = state.tick;
    lineageNode.age = creature.age;
    lineageNode.recentAction = creature.recentAction;
  }
  recordArchive(creature);
  if (wasLastLiving) {
    state.extinctionSpecimen = cloneExtinctionSpecimen(creature);
  }
  spawnSpark(creature.x, creature.y, "#ff6db3", 10);
  playDeathSound(creature.x);
}

function updateEgg(creature) {
  creature.eggTimer -= 1;
  creature.movePhase += 0.08;
  creature.turnVelocity *= 0.65;
  creature.displayTurnVelocity = damp(creature.displayTurnVelocity, 0, 0.18);
  creature.vx *= 0.7;
  creature.vy *= 0.7;
  creature.x = clamp(creature.x + creature.vx * 0.18, creature.radius, WIDTH - creature.radius);
  creature.y = clamp(creature.y + creature.vy * 0.18, creature.radius, HEIGHT - creature.radius);
  creature.recentAction = "EGG";

  if (creature.eggTimer <= 0) {
    creature.lifeStage = "juvenile";
    creature.growthTimer = CONFIG.juvenileGrowthFrames;
    relaxCreatureSegments(creature, 2);
    creature.recentAction = "HATCH";
    spawnSpark(creature.x, creature.y, "#dffcff", 12);
    playHatchSound(creature.x);
  }
}

function updateDyingCreature(creature) {
  creature.deathTimer -= 1;
  creature.movePhase += 0.12;
  creature.heading += creature.deathSpin;
  creature.displayTurnVelocity = damp(creature.displayTurnVelocity, creature.deathSpin, 0.12);
  creature.vx *= 0.92;
  creature.vy *= 0.92;
  creature.x += creature.vx * 0.3;
  creature.y += creature.vy * 0.3;
  resolveCreatureWallCollisions(creature);
  relaxCreatureSegments(creature, 2);
}

function updateBirthingCreature(creature) {
  creature.birthingTimer = Math.max(0, creature.birthingTimer - 1);
  creature.forwardDrive = 0;
  creature.sideDrive = 0;
  creature.displayForwardDrive = damp(creature.displayForwardDrive, 0, 0.28);
  creature.displaySideDrive = damp(creature.displaySideDrive, 0, 0.28);
  creature.turnVelocity *= 0.28;
  creature.displayTurnVelocity = damp(creature.displayTurnVelocity, 0, 0.3);
  creature.vx *= 0.16;
  creature.vy *= 0.16;
  creature.recentAction = "BIRTH";
  creature.movePhase += 0.08;
  relaxCreatureSegments(creature, 2);

  if (creature.birthingTimer <= 0) {
    releaseCreatureEgg(creature);
  }
}

function buildIncubationPositions(count) {
  const positions = [];
  const columns = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(count))));
  const rows = Math.ceil(count / columns);
  const startX = WIDTH * 0.24;
  const endX = WIDTH * 0.76;
  const startY = HEIGHT * 0.6;
  const endY = HEIGHT * 0.82;

  for (let i = 0; i < count; i += 1) {
    const column = i % columns;
    const row = Math.floor(i / columns);
    const xBase = columns === 1 ? WIDTH * 0.5 : lerp(startX, endX, column / (columns - 1));
    const yBase = rows === 1 ? HEIGHT * 0.72 : lerp(startY, endY, row / Math.max(1, rows - 1));
    positions.push({
      x: xBase + rand(-22, 22),
      y: yBase + rand(-16, 16)
    });
  }

  return positions;
}

function summarizeBrainMutation(baseBrain, mutatedBrain) {
  if (!baseBrain || !mutatedBrain) {
    return null;
  }

  let changedWeights = 0;
  let changedBiases = 0;
  let maxDelta = 0;
  const allWeightHighlights = [];
  const allBiasHighlights = [];

  for (let layerIndex = 0; layerIndex < mutatedBrain.weights.length; layerIndex += 1) {
    for (let rowIndex = 0; rowIndex < mutatedBrain.weights[layerIndex].length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < mutatedBrain.weights[layerIndex][rowIndex].length; colIndex += 1) {
        const delta =
          mutatedBrain.weights[layerIndex][rowIndex][colIndex] -
          baseBrain.weights[layerIndex][rowIndex][colIndex];

        if (Math.abs(delta) > 0.0001) {
          changedWeights += 1;
          maxDelta = Math.max(maxDelta, Math.abs(delta));
          allWeightHighlights.push({ layerIndex, rowIndex, colIndex, delta });
        }
      }
    }

    for (let nodeIndex = 0; nodeIndex < mutatedBrain.biases[layerIndex].length; nodeIndex += 1) {
      const delta =
        mutatedBrain.biases[layerIndex][nodeIndex] -
        baseBrain.biases[layerIndex][nodeIndex];

      if (Math.abs(delta) > 0.0001) {
        changedBiases += 1;
        maxDelta = Math.max(maxDelta, Math.abs(delta));
        allBiasHighlights.push({ layerIndex, nodeIndex, delta });
      }
    }
  }

  allWeightHighlights.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  allBiasHighlights.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const orderedMutations = allWeightHighlights
    .map((highlight) => ({ ...highlight, type: "weight" }))
    .concat(allBiasHighlights.map((highlight) => ({ ...highlight, type: "bias" })))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .map((highlight, orderIndex) => ({ ...highlight, orderIndex }));

  return {
    changedWeights,
    changedBiases,
    maxDelta,
    orderedMutations,
    weightHighlights: allWeightHighlights.slice(0, 6),
    biasHighlights: allBiasHighlights.slice(0, 3)
  };
}

function getMutationEntryKey(type, layerIndex, rowOrNodeIndex, colIndex = 0) {
  return type === "weight"
    ? `w:${layerIndex}:${rowOrNodeIndex}:${colIndex}`
    : `b:${layerIndex}:${rowOrNodeIndex}`;
}

function getOrderedMutationEntries(summary) {
  if (!summary) {
    return [];
  }
  if (Array.isArray(summary.visibleOrderedMutations) && summary.visibleOrderedMutations.length > 0) {
    return summary.visibleOrderedMutations;
  }

  const weightHighlights = Array.isArray(summary.weightHighlights) ? summary.weightHighlights : [];
  const biasHighlights = Array.isArray(summary.biasHighlights) ? summary.biasHighlights : [];
  const ordered = weightHighlights
    .map((highlight) => ({ ...highlight, type: "weight" }))
    .concat(biasHighlights.map((highlight) => ({ ...highlight, type: "bias" })))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .map((highlight, orderIndex) => ({ ...highlight, orderIndex }));

  summary.visibleOrderedMutations = ordered;
  return ordered;
}

function getMutationSequenceState(summary, progress) {
  if (!summary) {
    return null;
  }

  const entries = getOrderedMutationEntries(summary);
  if (entries.length === 0) {
    return {
      entries: [],
      activeIndex: -1,
      activeEntry: null,
      completedCount: 0,
      visibleCount: 0,
      totalCount: 0,
      lookup: new Map()
    };
  }

  const normalizedProgress = clamp(progress, 0, 1);
  const entryDurations = entries.map((entry) => entry.type === "bias" ? 0.1 : 1);
  const totalDuration = entryDurations.reduce((sum, duration) => sum + duration, 0);
  const cursor = normalizedProgress * totalDuration;
  const entryStates = [];
  const lookup = new Map();
  let activeIndex = -1;
  let completedCount = 0;
  let visibleCount = 0;
  let elapsedDuration = 0;

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const biasEntry = entry.type === "bias";
    const entryDuration = entryDurations[index];
    const rawProgress = clamp((cursor - elapsedDuration) / entryDuration, 0, 1);
    const drawProgress = rawProgress;
    const burnProgress = rawProgress;
    const settleProgress = rawProgress;
    const complete = rawProgress >= 0.999;
    if (complete) {
      completedCount += 1;
    }
    if (rawProgress > 0.001) {
      visibleCount = index + 1;
    }
    if (activeIndex === -1 && rawProgress > 0.001 && rawProgress < 0.999) {
      activeIndex = index;
    }

    const state = {
      ...entry,
      entryDuration,
      rawProgress,
      drawProgress,
      burnProgress,
      settleProgress,
      complete
    };

    lookup.set(
      getMutationEntryKey(
        entry.type,
        entry.layerIndex,
        entry.type === "weight" ? entry.rowIndex : entry.nodeIndex,
        entry.type === "weight" ? entry.colIndex : 0
      ),
      state
    );
    entryStates.push(state);
    elapsedDuration += entryDuration;
  }

  if (normalizedProgress >= 1 && activeIndex === -1) {
    activeIndex = entryStates.length - 1;
  }

  return {
    entries: entryStates,
    activeIndex,
    activeEntry: activeIndex >= 0 ? entryStates[activeIndex] : null,
    completedCount,
    visibleCount,
    totalCount: entryStates.length,
    lookup
  };
}

function getMutationEntryState(sequenceState, type, layerIndex, rowOrNodeIndex, colIndex = 0) {
  if (!sequenceState) {
    return null;
  }
  return sequenceState.lookup.get(getMutationEntryKey(type, layerIndex, rowOrNodeIndex, colIndex)) || null;
}

function buildExtinctionScene() {
  const desiredSeeds = Math.max(8, Math.floor(CONFIG.initialCreatures * 0.7));
  const seeds = Math.min(desiredSeeds, CONFIG.maxCreatures);
  const hasSourceBrain = Boolean(state.extinctionCandidateBrain);
  const inheritedSeeds = hasSourceBrain ? Math.min(4, seeds) : 0;
  const scanLeadFrames = hasSourceBrain ? 196 : 72;
  const inheritedPlanFrames = hasSourceBrain ? 370 : 0;
  const randomPlanFrames = hasSourceBrain ? 48 : 72;
  const outroFrames = 96;
  const positions = buildIncubationPositions(seeds);
  const plans = [];

  for (let i = 0; i < seeds; i += 1) {
    const inherited = i < inheritedSeeds;
    const brain = inherited
      ? mutateBrain(state.extinctionCandidateBrain)
      : createBrain();
    const segmentGene = inherited
      ? mutateSegmentGene(state.extinctionCandidateSegmentGene)
      : randomSegmentGene();
    const hue = inherited
      ? normalizeHueValue(state.extinctionCandidateHue + rand(-12, 12))
      : normalizeHueValue(rand(20, 65));

    plans.push({
      inherited,
      brain,
      hue,
      segmentGene,
      generation: inherited ? state.extinctionCandidateGeneration + 1 : 1,
      position: positions[i],
      heading: rand(0, TAU),
      mutationSummary: inherited
        ? summarizeBrainMutation(state.extinctionCandidateBrain, brain)
        : null
    });
  }

  const generationOrder = plans
    .map((plan, index) => ({ plan, index }))
    .sort((a, b) => {
      if (a.plan.inherited !== b.plan.inherited) {
        return a.plan.inherited ? -1 : 1;
      }
      if (a.plan.position.x !== b.plan.position.x) {
        return a.plan.position.x - b.plan.position.x;
      }
      return a.plan.position.y - b.plan.position.y;
    })
    .map((entry) => entry.index);
  const generationSlotByPlanIndex = Array(plans.length).fill(0);

  for (let slotIndex = 0; slotIndex < generationOrder.length; slotIndex += 1) {
    generationSlotByPlanIndex[generationOrder[slotIndex]] = slotIndex;
  }

  const slotTimings = [];
  let generationFramesTotal = 0;

  for (let slotIndex = 0; slotIndex < generationOrder.length; slotIndex += 1) {
    const planIndex = generationOrder[slotIndex];
    const plan = plans[planIndex];
    const durationFrames = plan.inherited ? inheritedPlanFrames : randomPlanFrames;

    slotTimings.push({
      slotIndex,
      planIndex,
      startFrame: generationFramesTotal,
      durationFrames,
      endFrame: generationFramesTotal + durationFrames
    });

    generationFramesTotal += durationFrames;
  }

  const totalFrames = Math.max(
    CONFIG.extinctionDelay,
    scanLeadFrames + generationFramesTotal + outroFrames
  );

  return {
    frame: 0,
    totalFrames,
    scanFrames: scanLeadFrames,
    outroFrames,
    generationFramesTotal,
    sourceBrain: hasSourceBrain ? cloneBrain(state.extinctionCandidateBrain) : null,
    sourceHue: state.extinctionCandidateHue,
    sourceGeneration: state.extinctionCandidateGeneration,
    sourceSpecimen: state.extinctionSpecimen
      ? {
          ...state.extinctionSpecimen,
          brain: cloneBrain(state.extinctionSpecimen.brain)
        }
      : null,
    plans,
    generationOrder,
    generationSlotByPlanIndex,
    slotTimings,
    inheritedSeeds,
    randomSeeds: seeds - inheritedSeeds
  };
}

function buildBrainBankScene(entry) {
  return {
    frame: 0,
    totalFrames: 226,
    captureFrames: 42,
    scanFrames: 72,
    packageFrames: 44,
    transferFrames: 34,
    vaultFrames: 34,
    lastPhase: "",
    entryId: entry.id,
    entryLabel: entry.displayName,
    fileName: entry.fileName,
    specimen: cloneBrainBankSpecimen(entry.specimen, entry.brain),
    brain: cloneBrain(entry.brain),
    hue: entry.hue,
    generation: entry.generation
  };
}

function getBrainBankScenePhase(scene) {
  const captureEnd = scene.captureFrames;
  const scanEnd = captureEnd + scene.scanFrames;
  const packageEnd = scanEnd + scene.packageFrames;
  const transferEnd = packageEnd + scene.transferFrames;

  if (scene.frame < captureEnd) {
    return "capture";
  }
  if (scene.frame < scanEnd) {
    return scene.frame < captureEnd + scene.scanFrames * 0.82 ? "scan" : "scan-locked";
  }
  if (scene.frame < packageEnd) {
    return "package";
  }
  if (scene.frame < transferEnd) {
    return "transfer";
  }
  return "release";
}

function updateBrainBankScene() {
  if (!state.brainBankScene) {
    return;
  }

  const scene = state.brainBankScene;
  scene.frame += 1;
  const phase = getBrainBankScenePhase(scene);
  if (phase !== scene.lastPhase) {
    playExtinctionPhaseTone(phase);
    scene.lastPhase = phase;
  }

  if (scene.frame < scene.totalFrames) {
    return;
  }

  const entry = getBrainBankEntryById(scene.entryId);
  state.brainBankScene = null;
  setBrainBankMessage(entry
    ? `${entry.displayName} sampled successfully. File ${entry.fileName} is stored in ${BRAIN_BANK_FOLDER_NAME} and the vault is ready.`
    : "Brain sampling complete. The vault is ready.");
  setBrainBankModalOpen(true, scene.entryId);
}

async function sampleFeaturedCreatureToBank() {
  if (!state.featured) {
    setBrainBankMessage("No living creature is available to sample right now.");
    return;
  }

  if (isBrainBankBusy()) {
    setBrainBankMessage("Wait for the active lab sequence to finish before sampling another brain.");
    return;
  }

  const featured = state.featured;
  const specimen = cloneExtinctionSpecimen(featured);
  const entry = createBrainBankEntry(
    {
      creatureId: featured.id,
      specimen,
      brain: featured.brain,
      sampledTick: state.tick,
      origin: "sampled",
      note: "Sampled from the current longest-lived creature."
    },
    {
      displayName: `Longest-Lived C-${String(featured.id).padStart(3, "0")}`
    }
  );

  try {
    const saveResult = await saveBrainBankEntryToDisk(entry, true);
    if (!saveResult.saved) {
      setBrainBankMessage(`Pick the ${APP_NAME} folder to enable brain-bank file storage.`);
      return;
    }
  } catch (error) {
    setBrainBankMessage("Brain storage was cancelled before the specimen file could be written.");
    return;
  }

  const result = upsertBrainBankEntry(entry);
  state.brainBankFocusId = result.entry.id;
  renderBrainBankList();
  setBrainBankModalOpen(false);
  state.brainBankScene = buildBrainBankScene(result.entry);
  setBrainBankMessage(`${entry.displayName} captured. Writing ${entry.fileName}.`);
}

function seedWorld() {
  resetLineageTree();
  state.creatures.length = 0;
  state.foods.length = 0;
  state.sparks.length = 0;
  state.births = 0;
  state.deaths = 0;
  state.tick = 0;
  state.lineageTick = 0;
  state.featured = null;
  state.extinctionCount = 0;
  state.extinctionLogged = false;
  state.extinctionCandidateBrain = null;
  state.extinctionCandidateHue = 42;
  state.extinctionCandidateAge = 0;
  state.extinctionCandidateGeneration = 1;
  state.extinctionCandidateSegmentGene = 5;
  state.recentExtinctionBrain = null;
  state.recentExtinctionHue = 42;
  state.recentExtinctionGeneration = 1;
  state.recentExtinctionSegmentGene = 5;
  state.extinctionSpecimen = null;
  state.extinctionScene = null;

  const startingCreatures = Math.min(CONFIG.initialCreatures, CONFIG.maxCreatures);
  const startingFood = Math.min(CONFIG.initialFood, CONFIG.maxFood);

  for (let i = 0; i < startingCreatures; i += 1) {
    state.creatures.push(createCreature());
  }

  for (let i = 0; i < startingFood; i += 1) {
    state.foods.push(createFood());
  }

  resetTelemetryHistory();
}

function createStartupScene() {
  return {
    frame: 0,
    totalFrames: CONFIG.startupIntroFrames,
    creatureTarget: Math.min(CONFIG.initialCreatures, CONFIG.maxCreatures),
    foodTarget: Math.min(CONFIG.initialFood, CONFIG.maxFood)
  };
}

function updateStartupScene() {
  if (!state.startupScene) {
    return;
  }

  state.startupScene.frame += 1;
  if (state.startupScene.frame >= state.startupScene.totalFrames) {
    state.startupScene = null;
  }
}

function getSensorHit(origin, creature, eyeAngle, candidates, radiusOffset = 0) {
  const halfFov = CONFIG.eyeFov * 0.5;
  let best = null;

  for (let i = 0; i < candidates.length; i += 1) {
    const target = candidates[i];
    if (target === creature) {
      continue;
    }

    if ("alive" in target && !target.alive) {
      continue;
    }

    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    const centerDistance = Math.hypot(dx, dy);
    const distance = Math.max(0, centerDistance - radiusOffset - (target.radius || 0));

    if (distance > CONFIG.eyeRange) {
      continue;
    }

    const angle = normalizeAngle(Math.atan2(dy, dx) - eyeAngle);
    if (Math.abs(angle) > halfFov) {
      continue;
    }

    if (!best || distance < best.distance) {
      best = {
        point: { x: target.x, y: target.y },
        distance,
        angle
      };
    }
  }

  if (!best) {
    return {
      closeness: 0,
      angleNorm: 0,
      point: null,
      distance: CONFIG.eyeRange
    };
  }

  return {
    closeness: 1 - clamp(best.distance / CONFIG.eyeRange, 0, 1),
    angleNorm: clamp(best.angle / halfFov, -1, 1),
    point: best.point,
    distance: best.distance
  };
}

function senseCreature(creature) {
  const eyeOffsets = [-CONFIG.eyeOffset, CONFIG.eyeOffset];
  const bodyMetrics = getCreatureBodyMetrics(creature);
  const eyeOrigins = [bodyMetrics.leftEyeLocal, bodyMetrics.rightEyeLocal];
  const eyes = [];
  const inputs = [];

  for (let eyeIndex = 0; eyeIndex < eyeOffsets.length; eyeIndex += 1) {
    const angle = creature.heading + eyeOffsets[eyeIndex];
    const origin = bodyLocalToWorld(
      creature,
      bodyMetrics,
      eyeOrigins[eyeIndex].x,
      eyeOrigins[eyeIndex].y
    );
    const foodSense = getSensorHit(origin, creature, angle, state.foods, 0);
    const creatureSense = getSensorHit(origin, creature, angle, state.creatures, 0);
    const wallSense = getSensorHit(origin, creature, angle, wallSensorPoints, 0);

    eyes.push({
      origin,
      angle,
      food: foodSense,
      creature: creatureSense,
      wall: wallSense
    });

    inputs.push(
      foodSense.closeness,
      foodSense.angleNorm,
      creatureSense.closeness,
      creatureSense.angleNorm,
      wallSense.closeness,
      wallSense.angleNorm
    );
  }

  for (let memoryIndex = 0; memoryIndex < creature.memoryState.length; memoryIndex += 1) {
    inputs.push(creature.memoryState[memoryIndex] || 0);
  }

  return { eyes, inputs };
}

function applyBrain(creature) {
  const sensing = senseCreature(creature);
  const brainState = forwardBrain(creature.brain, sensing.inputs);

  creature.senses = sensing;
  creature.hiddenLayers = brainState.hiddenLayers;
  creature.outputs = brainState.outputs;

  const forward = creature.outputs[0];
  const backward = creature.outputs[1];
  const left = creature.outputs[2];
  const right = creature.outputs[3];

  creature.forwardDrive = forward - backward;
  creature.sideDrive = right - left;
  for (let memoryIndex = 0; memoryIndex < creature.memoryState.length; memoryIndex += 1) {
    const rawWrite = creature.outputs[MOVEMENT_OUTPUT_COUNT + memoryIndex] || 0;
    const targetMemory = rawWrite * 2 - 1;
    creature.memoryWrite[memoryIndex] = targetMemory;
    creature.memoryState[memoryIndex] = damp(
      creature.memoryState[memoryIndex],
      targetMemory,
      CONFIG.memoryWriteBlend
    );
  }

  const actions = [
    { label: MOVEMENT_OUTPUT_LABELS[0], value: forward },
    { label: MOVEMENT_OUTPUT_LABELS[1], value: backward },
    { label: MOVEMENT_OUTPUT_LABELS[2], value: left },
    { label: MOVEMENT_OUTPUT_LABELS[3], value: right }
  ];
  actions.sort((a, b) => b.value - a.value);
  creature.recentAction = actions[0].label;
}

function updateCreature(creature) {
  if (!creature.alive) {
    updateDyingCreature(creature);
    return;
  }

  creature.age += 1;

  if (creature.lifeStage === "egg") {
    updateEgg(creature);
    return;
  }

  if (creature.lifeStage === "juvenile") {
    creature.growthTimer = Math.max(0, creature.growthTimer - 1);
    if (creature.growthTimer === 0) {
      creature.lifeStage = "adult";
      creature.recentAction = "ADULT";
      spawnSpark(creature.x, creature.y, "#fff17b", 8);
    }
  }

  creature.energy -= creature.lifeStage === "juvenile" ? CONFIG.metabolism * 0.72 : CONFIG.metabolism;
  if (creature.energy <= 0) {
    killCreature(creature);
    return;
  }
  if (creature.birthingTimer > 0) {
    updateBirthingCreature(creature);
    return;
  }

  applyBrain(creature);
  creature.displayForwardDrive = damp(
    creature.displayForwardDrive,
    creature.forwardDrive,
    CONFIG.segmentSignalSmoothing
  );
  creature.displaySideDrive = damp(
    creature.displaySideDrive,
    creature.sideDrive,
    CONFIG.segmentSignalSmoothing
  );
  creature.turnVelocity += creature.sideDrive * CONFIG.turnRate;
  const locomotion = clamp(Math.max(0, creature.displayForwardDrive), 0, 1);
  const slitherPhase = creature.movePhase * CONFIG.segmentWaveFrequency;
  creature.turnVelocity += Math.cos(slitherPhase) * locomotion * CONFIG.slitherTurnAssist;
  creature.turnVelocity *= CONFIG.turnDrag;
  creature.turnVelocity = clamp(creature.turnVelocity, -CONFIG.maxTurnSpeed, CONFIG.maxTurnSpeed);
  creature.displayTurnVelocity = damp(
    creature.displayTurnVelocity,
    creature.turnVelocity,
    CONFIG.segmentSignalSmoothing
  );

  creature.heading += creature.turnVelocity;
  const headingX = Math.cos(creature.heading);
  const headingY = Math.sin(creature.heading);

  creature.vx += headingX * creature.forwardDrive * CONFIG.thrust;
  creature.vy += headingY * creature.forwardDrive * CONFIG.thrust;
  const slitherForce = Math.sin(slitherPhase) * locomotion * CONFIG.slitherSideThrust;
  creature.vx += -headingY * slitherForce;
  creature.vy += headingX * slitherForce;

  creature.vx *= CONFIG.friction;
  creature.vy *= CONFIG.friction;

  const speed = Math.hypot(creature.vx, creature.vy);
  if (speed > CONFIG.maxSpeed) {
    const scale = CONFIG.maxSpeed / speed;
    creature.vx *= scale;
    creature.vy *= scale;
  }

  creature.x += creature.vx;
  creature.y += creature.vy;
  creature.movePhase += 0.25 + Math.abs(creature.forwardDrive) * 0.3 + Math.abs(creature.sideDrive) * 0.2;
  relaxCreatureSegments(creature, 2);

  const activity =
    creature.outputs[0] +
    creature.outputs[1] +
    creature.outputs[2] +
    creature.outputs[3];

  creature.energy -= activity * CONFIG.motionCost;

  handleWallBounce(creature);
  attemptEat(creature);
  attemptReproduce(creature);

  if (creature.energy <= 0) {
    killCreature(creature);
  }
}

function handleWallBounce(creature) {
  resolveCreatureWallCollisions(creature);
}

function attemptEat(creature) {
  const headingX = Math.cos(creature.heading);
  const headingY = Math.sin(creature.heading);
  const forwardVelocity = creature.vx * headingX + creature.vy * headingY;
  const bodyMetrics = getCreatureBodyMetrics(creature);
  const growthScale = bodyMetrics.lifeScale;

  if (
    creature.forwardDrive <= CONFIG.minEatingForwardDrive ||
    forwardVelocity <= CONFIG.minEatingForwardVelocity
  ) {
    return;
  }

  const mouthPoint = bodyLocalToWorld(
    creature,
    bodyMetrics,
    bodyMetrics.mouthLocal.x,
    bodyMetrics.mouthLocal.y
  );
  const mouthX = mouthPoint.x;
  const mouthY = mouthPoint.y;
  const halfMouthArc = CONFIG.mouthArc * 0.5;

  for (let i = state.foods.length - 1; i >= 0; i -= 1) {
    const food = state.foods[i];
    const dx = food.x - mouthX;
    const dy = food.y - mouthY;
    const angleToFood = normalizeAngle(Math.atan2(dy, dx) - creature.heading);
    if (Math.abs(angleToFood) > halfMouthArc) {
      continue;
    }

    const mouthDistance = Math.hypot(food.x - mouthX, food.y - mouthY);
    if (mouthDistance < CONFIG.mouthReach * growthScale + food.radius) {
      creature.energy = clamp(creature.energy + food.energy, 0, CONFIG.maxEnergy);
      state.foods.splice(i, 1);
      spawnSpark(food.x, food.y, "#80ff88", 6);
      playEatSound(food.x);
    }
  }
}

function attemptReproduce(creature) {
  if (getLivingCreaturesCount() >= CONFIG.maxCreatures) {
    return;
  }

  if (creature.lifeStage !== "adult" || creature.birthingTimer > 0) {
    return;
  }

  if (creature.age < CONFIG.maturityAge || creature.energy < CONFIG.reproduceThreshold) {
    return;
  }

  if (Math.random() > CONFIG.reproduceChance) {
    return;
  }

  creature.energy -= CONFIG.reproduceCost;
  if (creature.energy <= 0) {
    killCreature(creature);
    return;
  }

  beginCreatureBirth(creature);
}

function recordArchive(creature, includeForExtinction = true) {
  if (creature.age > state.bestEverAge) {
    state.bestEverAge = creature.age;
    state.archiveBrain = cloneBrain(creature.brain);
    state.archiveHue = creature.hue;
    state.archiveSegmentGene = creature.segmentGene;
  }

  if (includeForExtinction && creature.age > state.extinctionCandidateAge) {
    state.extinctionCandidateAge = creature.age;
    state.extinctionCandidateBrain = cloneBrain(creature.brain);
    state.extinctionCandidateHue = creature.hue;
    state.extinctionCandidateGeneration = creature.generation;
    state.extinctionCandidateSegmentGene = creature.segmentGene;
  }
}

function resolveCreatureCollisions() {
  for (let i = 0; i < state.creatures.length; i += 1) {
    for (let j = i + 1; j < state.creatures.length; j += 1) {
      const a = state.creatures[i];
      const b = state.creatures[j];
      if (!a.alive || !b.alive) {
        continue;
      }

      const aBodies = buildCreatureCollisionBodies(a, getCreatureBodyMetrics(a));
      const bBodies = buildCreatureCollisionBodies(b, getCreatureBodyMetrics(b));
      let collided = false;
      let sparkX = (a.x + b.x) * 0.5;
      let sparkY = (a.y + b.y) * 0.5;

      for (let bodyAIndex = 0; bodyAIndex < aBodies.length; bodyAIndex += 1) {
        const bodyA = aBodies[bodyAIndex];
        for (let bodyBIndex = 0; bodyBIndex < bBodies.length; bodyBIndex += 1) {
          const bodyB = bBodies[bodyBIndex];
          const dx = bodyB.x - bodyA.x;
          const dy = bodyB.y - bodyA.y;
          let distance = Math.hypot(dx, dy);
          const minDistance = bodyA.radius + bodyB.radius;

          if (distance === 0) {
            distance = 0.0001;
          }

          if (distance >= minDistance) {
            continue;
          }

          const overlap = minDistance - distance;
          const nx = dx / distance;
          const ny = dy / distance;

          applyCollisionDisplacement(bodyA, -nx * overlap * 0.5, -ny * overlap * 0.5);
          applyCollisionDisplacement(bodyB, nx * overlap * 0.5, ny * overlap * 0.5);

          sparkX = (bodyA.x + bodyB.x) * 0.5;
          sparkY = (bodyA.y + bodyB.y) * 0.5;
          collided = true;
        }
      }

      if (!collided) {
        continue;
      }

      a.energy -= CONFIG.collisionCost;
      b.energy -= CONFIG.collisionCost;
      relaxCreatureSegments(a, 2);
      relaxCreatureSegments(b, 2);
      resolveCreatureWallCollisions(a);
      resolveCreatureWallCollisions(b);
      playCollisionSound(sparkX, clamp((a.energy + b.energy) / (CONFIG.maxEnergy * 2), 0.15, 1));

      if (Math.random() < 0.24) {
        spawnSpark(sparkX, sparkY, "#ffb447", 4);
      }
    }
  }
}

function spawnSpark(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    if (state.sparks.length >= CONFIG.maxSparks) {
      state.sparks.shift();
    }
    state.sparks.push({
      x,
      y,
      vx: rand(-1.8, 1.8),
      vy: rand(-1.8, 1.8),
      life: rand(8, 18),
      maxLife: rand(8, 18),
      color
    });
  }
}

function updateSparks() {
  for (let i = state.sparks.length - 1; i >= 0; i -= 1) {
    const spark = state.sparks[i];
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= 0.93;
    spark.vy *= 0.93;
    spark.life -= 1;
    if (spark.life <= 0) {
      state.sparks.splice(i, 1);
    }
  }
}

function maintainFood() {
  if (state.foods.length < CONFIG.maxFood && Math.random() < CONFIG.foodSpawnChance) {
    state.foods.push(createFood());
  }
}

function updateFood() {
  for (let i = state.foods.length - 1; i >= 0; i -= 1) {
    const food = state.foods[i];
    food.age += 1;
    if (food.age >= CONFIG.foodLifetimeFrames) {
      state.foods.splice(i, 1);
    }
  }
}

function applyInfluenceField() {
  if (!isInfluenceToolActive()) {
    return;
  }

  const { x: centerX, y: centerY, radius } = state.influenceTool;
  const radiusSq = radius * radius;

  for (let i = 0; i < state.foods.length; i += 1) {
    const food = state.foods[i];
    const dx = centerX - food.x;
    const dy = centerY - food.y;
    const distSq = dx * dx + dy * dy;
    if (distSq > radiusSq) {
      continue;
    }

    const distance = Math.max(0.001, Math.sqrt(distSq));
    const strength = smooth01(1 - distance / radius);
    const pull = 0.06 + strength * INFLUENCE_TOOL_DEFAULTS.foodPull;
    food.x = clamp(lerp(food.x, centerX, pull), food.radius, WIDTH - food.radius);
    food.y = clamp(lerp(food.y, centerY, pull), food.radius, HEIGHT - food.radius);
  }

  for (let i = 0; i < state.creatures.length; i += 1) {
    const creature = state.creatures[i];
    if (!creature.alive) {
      continue;
    }

    const dx = centerX - creature.x;
    const dy = centerY - creature.y;
    const distSq = dx * dx + dy * dy;
    if (distSq > radiusSq) {
      continue;
    }

    const distance = Math.max(0.001, Math.sqrt(distSq));
    const angleToCenter = Math.atan2(dy, dx);
    const strength = smooth01(1 - distance / radius);
    const nx = dx / distance;
    const ny = dy / distance;
    const impulse = (0.08 + strength * INFLUENCE_TOOL_DEFAULTS.creatureImpulse) * (creature.lifeStage === "egg" ? 0.8 : 1);
    const previousX = creature.x;
    const previousY = creature.y;

    creature.vx += nx * impulse;
    creature.vy += ny * impulse;
    creature.x = clamp(
      creature.x + dx * (0.01 + strength * INFLUENCE_TOOL_DEFAULTS.creatureSnap),
      creature.radius,
      WIDTH - creature.radius
    );
    creature.y = clamp(
      creature.y + dy * (0.01 + strength * INFLUENCE_TOOL_DEFAULTS.creatureSnap),
      creature.radius,
      HEIGHT - creature.radius
    );
    creature.heading = dampAngle(creature.heading, angleToCenter, 0.04 + strength * 0.12);
    creature.turnVelocity *= 0.74;

    const shiftX = creature.x - previousX;
    const shiftY = creature.y - previousY;
    if (shiftX !== 0 || shiftY !== 0) {
      for (let segmentIndex = 0; segmentIndex < creature.segmentBodies.length; segmentIndex += 1) {
        const segment = creature.segmentBodies[segmentIndex];
        segment.x += shiftX * 0.92;
        segment.y += shiftY * 0.92;
        segment.vx += shiftX * 0.18;
        segment.vy += shiftY * 0.18;
      }
    }

    const speed = Math.hypot(creature.vx, creature.vy);
    const maxInfluenceSpeed = CONFIG.maxSpeed * 1.6;
    if (speed > maxInfluenceSpeed) {
      const scale = maxInfluenceSpeed / speed;
      creature.vx *= scale;
      creature.vy *= scale;
    }

    if (creature.lifeStage !== "egg") {
      relaxCreatureSegments(creature, 1);
      resolveCreatureWallCollisions(creature);
    } else {
      creature.x = clamp(creature.x, creature.radius, WIDTH - creature.radius);
      creature.y = clamp(creature.y, creature.radius, HEIGHT - creature.radius);
    }
  }
}

function cullDeadCreatures() {
  for (let i = state.creatures.length - 1; i >= 0; i -= 1) {
    if (!state.creatures[i].alive && state.creatures[i].deathTimer <= 0) {
      state.creatures.splice(i, 1);
    }
  }
}

function chooseFeaturedCreature() {
  let oldest = null;
  for (let i = 0; i < state.creatures.length; i += 1) {
    if (!state.creatures[i].alive) {
      continue;
    }
    if (!oldest || state.creatures[i].age > oldest.age) {
      oldest = state.creatures[i];
    }
  }
  state.featured = oldest;
}

function reseedIfNeeded() {
  if (getLivingCreaturesCount() > 0) {
    state.extinctionFrames = 0;
    state.extinctionLogged = false;
    return;
  }

  if (!state.extinctionLogged) {
    state.extinctionCount += 1;
    state.extinctionLogged = true;
  }

  if (!state.extinctionScene) {
    if (state.extinctionSpecimen) {
      state.extinctionCandidateAge = state.extinctionSpecimen.age;
      state.extinctionCandidateBrain = cloneBrain(state.extinctionSpecimen.brain);
      state.extinctionCandidateHue = state.extinctionSpecimen.hue;
      state.extinctionCandidateGeneration = state.extinctionSpecimen.generation;
      state.extinctionCandidateSegmentGene = state.extinctionSpecimen.segmentGene;
    }
    state.extinctionScene = buildExtinctionScene();
    state.creatures.length = 0;
    state.sparks.length = 0;
  }

  state.extinctionFrames += 1;
  state.extinctionScene.frame = Math.min(
    state.extinctionFrames,
    state.extinctionScene.totalFrames
  );
  if (state.extinctionFrames < state.extinctionScene.totalFrames) {
    return;
  }

  if (state.extinctionScene.sourceBrain) {
    state.recentExtinctionBrain = cloneBrain(state.extinctionScene.sourceBrain);
    state.recentExtinctionHue = state.extinctionCandidateHue;
    state.recentExtinctionGeneration = state.extinctionCandidateGeneration;
    state.recentExtinctionSegmentGene = state.extinctionCandidateSegmentGene;
  }

  const targetFood = Math.min(CONFIG.initialFood, CONFIG.maxFood);
  while (state.foods.length < targetFood) {
    state.foods.push(createFood());
  }

  for (let i = 0; i < state.extinctionScene.plans.length; i += 1) {
    const plan = state.extinctionScene.plans[i];
    state.creatures.push(
      createCreature(null, {
        lifeStage: "egg",
        brainOverride: plan.brain,
        hueOverride: plan.hue,
        segmentGeneOverride: plan.segmentGene,
        generationOverride: plan.generation,
        lineageParentIdOverride: plan.inherited ? state.extinctionSpecimen?.id ?? null : null,
        positionOverride: plan.position,
        headingOverride: plan.heading,
        velocityOverride: { vx: rand(-0.08, 0.08), vy: rand(-0.08, 0.08) },
        energyOverride: CONFIG.startingEnergy * 0.82
      })
    );
  }

  playExtinctionPhaseTone("release");
  state.extinctionFrames = 0;
  state.lineageTick = 0;
  state.extinctionCandidateBrain = null;
  state.extinctionCandidateHue = 42;
  state.extinctionCandidateAge = 0;
  state.extinctionCandidateGeneration = 1;
  state.extinctionCandidateSegmentGene = 5;
  state.extinctionSpecimen = null;
  state.extinctionScene = null;
}

function updateSimulation() {
  state.tick += 1;
  if (state.brainBankScene) {
    updateBrainBankScene();
    chooseFeaturedCreature();
    pushTelemetrySample();
    return;
  }
  if (state.extinctionScene) {
    reseedIfNeeded();
    chooseFeaturedCreature();
    pushTelemetrySample();
    return;
  }
  if (getLivingCreaturesCount() > 0) {
    state.lineageTick += 1;
  }
  maintainFood();
  updateFood();

  for (let i = 0; i < state.creatures.length; i += 1) {
    updateCreature(state.creatures[i]);
  }

  applyInfluenceField();
  resolveCreatureCollisions();
  updateSparks();
  syncLineageCreatures();
  cullDeadCreatures();
  reseedIfNeeded();
  chooseFeaturedCreature();
  pushTelemetrySample();
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getBrainLayerCounts() {
  return [INPUT_LABELS.length, ...CONFIG.hiddenLayerSizes, OUTPUT_LABELS.length];
}

const brainBlueprintLayoutCache = new Map();

function getBrainBlueprintLayout(x, y, width, height) {
  const layerCounts = getBrainLayerCounts();
  const key = `${layerCounts.join(",")}|${x}|${y}|${width}|${height}`;
  const cached = brainBlueprintLayoutCache.get(key);
  if (cached) {
    return cached;
  }

  const layerXs = layerCounts.map((_, index) =>
    x + 8 + ((width - 16) * index) / Math.max(1, layerCounts.length - 1)
  );
  const layers = layerCounts.map((count, layerIndex) =>
    buildLayerNodes(layerXs[layerIndex], y + 6, y + height - 6, count)
  );
  const flatNodes = [];

  for (let layerIndex = 0; layerIndex < layers.length; layerIndex += 1) {
    for (let nodeIndex = 0; nodeIndex < layers[layerIndex].length; nodeIndex += 1) {
      flatNodes.push({ layerIndex, nodeIndex });
    }
  }

  const layout = { layers, flatNodes };
  brainBlueprintLayoutCache.set(key, layout);
  if (brainBlueprintLayoutCache.size > 40) {
    brainBlueprintLayoutCache.clear();
    brainBlueprintLayoutCache.set(key, layout);
  }
  return layout;
}

function buildBrainBlueprintNodes(x, y, width, height) {
  return getBrainBlueprintLayout(x, y, width, height).layers;
}

function getBrainBlueprintConnectionRefs(brain) {
  if (!brain) {
    return [];
  }
  if (brain._blueprintConnectionRefs) {
    return brain._blueprintConnectionRefs;
  }

  const refs = [];
  for (let layerIndex = 0; layerIndex < brain.weights.length; layerIndex += 1) {
    for (let rowIndex = 0; rowIndex < brain.weights[layerIndex].length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < brain.weights[layerIndex][rowIndex].length; colIndex += 1) {
        refs.push({ layerIndex, rowIndex, colIndex });
      }
    }
  }
  brain._blueprintConnectionRefs = refs;
  return refs;
}

function drawBrainBlueprint(ctx, brain, x, y, width, height, options = {}) {
  if (!brain) {
    return;
  }

  const alpha = options.alpha ?? 1;
  const baseBrain = options.baseBrain || null;
  const mix = options.mix ?? 1;
  const mutationSummary = options.mutationSummary || null;
  const mutationGlow = options.mutationGlow ?? 0;
  const fluxAmount = options.fluxAmount ?? 0;
  const fluxPhase = options.fluxPhase ?? 0;
  const fluxPacketBudget = options.fluxPacketBudget ?? 0;
  const nodePulseBudget = options.nodePulseBudget ?? 0;
  const fluxSpeedScale = options.fluxSpeedScale ?? 1;
  const fluxSelectorSpeed = options.fluxSelectorSpeed ?? 0.55;
  const nodePulseSpeed = options.nodePulseSpeed ?? 0.2;
  const nodePulseSelectorSpeed = options.nodePulseSelectorSpeed ?? 0.42;
  const mutationSequenceState = options.mutationSequenceState || null;
  const time = options.time ?? state.tick;
  const blueprintLayout = getBrainBlueprintLayout(x, y, width, height);
  const nodeLayers = blueprintLayout.layers;

  ctx.save();
  ctx.shadowBlur = 0;

  for (let layerIndex = 0; layerIndex < brain.weights.length; layerIndex += 1) {
    for (let rowIndex = 0; rowIndex < brain.weights[layerIndex].length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < brain.weights[layerIndex][rowIndex].length; colIndex += 1) {
        const targetWeight = brain.weights[layerIndex][rowIndex][colIndex];
        const baseWeight = baseBrain
          ? baseBrain.weights[layerIndex][rowIndex][colIndex]
          : targetWeight;
        let weightMix = mix;
        if (baseBrain && mutationSequenceState) {
          const mutationState = getMutationEntryState(
            mutationSequenceState,
            "weight",
            layerIndex,
            rowIndex,
            colIndex
          );
          weightMix = mutationState ? mutationState.drawProgress : 1;
        }
        const weight = lerp(baseWeight, targetWeight, weightMix);
        const strength = clamp(Math.abs(weight) * 0.24 + 0.02, 0.02, 0.42) * alpha;
        ctx.strokeStyle = weight >= 0
          ? `rgba(74, 255, 212, ${strength})`
          : `rgba(255, 109, 179, ${strength})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodeLayers[layerIndex][colIndex].x, nodeLayers[layerIndex][colIndex].y);
        ctx.lineTo(nodeLayers[layerIndex + 1][rowIndex].x, nodeLayers[layerIndex + 1][rowIndex].y);
        ctx.stroke();
      }
    }
  }

  if (fluxAmount > 0.01 && fluxPacketBudget > 0) {
    const fluxRate = (0.012 + fluxAmount * 0.02) * fluxSpeedScale;
    const flatConnections = getBrainBlueprintConnectionRefs(brain);
    const selectorStep = Math.max(1, Math.round(0.45 / Math.max(0.01, fluxSelectorSpeed)));

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 0;

    for (let packetIndex = 0; packetIndex < fluxPacketBudget; packetIndex += 1) {
      const packetCycle = time * fluxRate + fluxPhase + packetIndex * 0.19;
      const selectorCycle = Math.floor(packetCycle + fluxPhase * 3 + packetIndex * 0.61);
      const selector =
        (Math.floor(selectorCycle / selectorStep) + Math.floor(fluxPhase * 29) + packetIndex * 11) %
        Math.max(1, flatConnections.length);
      const connection = flatConnections[selector];
      if (!connection) {
        continue;
      }

      const weight =
        brain.weights[connection.layerIndex][connection.rowIndex][connection.colIndex];
      const positive = weight >= 0;
      const packetT = packetCycle % 1;
      const fromNode = nodeLayers[connection.layerIndex][connection.colIndex];
      const toNode = nodeLayers[connection.layerIndex + 1][connection.rowIndex];
      const packetX = lerp(fromNode.x, toNode.x, packetT);
      const packetY = lerp(fromNode.y, toNode.y, packetT);
      const trailT = Math.max(0, packetT - 0.08);
      const trailX = lerp(fromNode.x, toNode.x, trailT);
      const trailY = lerp(fromNode.y, toNode.y, trailT);
      const packetRadius = packetIndex % 3 === 0 ? 1.7 : 1.25;
      const packetAlpha = (0.18 + Math.abs(weight) * 0.14 + fluxAmount * 0.24) * alpha;

      ctx.fillStyle = positive
        ? `rgba(74, 255, 212, ${packetAlpha * 0.42})`
        : `rgba(255, 109, 179, ${packetAlpha * 0.42})`;
      ctx.beginPath();
      ctx.arc(trailX, trailY, packetRadius * 0.72, 0, TAU);
      ctx.fill();

      ctx.fillStyle = positive
        ? `rgba(74, 255, 212, ${packetAlpha})`
        : `rgba(255, 109, 179, ${packetAlpha})`;
      ctx.beginPath();
      ctx.arc(packetX, packetY, packetRadius, 0, TAU);
      ctx.fill();
      if (packetIndex % 2 === 0) {
        ctx.fillStyle = `rgba(255, 241, 123, ${packetAlpha * 0.55})`;
        ctx.beginPath();
        ctx.arc(packetX, packetY, packetRadius * 0.4, 0, TAU);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  if (mutationSummary && mutationGlow > 0.01) {
    const mutationPulse = 0.68 + Math.sin(time * 0.22 + x * 0.03 + y * 0.02) * 0.22;
    const maxMutation = Math.max(0.001, mutationSummary.maxDelta);

    for (let i = 0; i < mutationSummary.weightHighlights.length; i += 1) {
      const highlight = mutationSummary.weightHighlights[i];
      const mutationState = mutationSequenceState
        ? getMutationEntryState(
          mutationSequenceState,
          "weight",
          highlight.layerIndex,
          highlight.rowIndex,
          highlight.colIndex
        )
        : null;
      const reveal = mutationState ? mutationState.drawProgress : 1;
      const burnProgress = mutationState ? mutationState.burnProgress : 1;
      if (reveal <= 0.01) {
        continue;
      }
      const fromNode = nodeLayers[highlight.layerIndex][highlight.colIndex];
      const toNode = nodeLayers[highlight.layerIndex + 1][highlight.rowIndex];
      const normalized = clamp(Math.abs(highlight.delta) / maxMutation, 0, 1);
      const settledGlow = mutationState?.complete ? 0.22 + mutationState.settleProgress * 0.28 : 0;
      const signal = normalized * mutationGlow * mutationPulse * (0.14 + reveal * 0.7 + settledGlow);
      const positive = highlight.delta >= 0;
      const lineEndX = lerp(fromNode.x, toNode.x, Math.max(0.06, burnProgress));
      const lineEndY = lerp(fromNode.y, toNode.y, Math.max(0.06, burnProgress));

      ctx.shadowBlur = 4 + signal * 8;
      ctx.shadowColor = positive
        ? `rgba(74, 255, 212, ${0.24 + signal * 0.44})`
        : `rgba(255, 109, 179, ${0.24 + signal * 0.44})`;
      ctx.strokeStyle = `rgba(255, 241, 123, ${0.16 + signal * 0.34})`;
      ctx.lineWidth = 1.2 + normalized * 1.8 + signal * 1.1;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.stroke();

      ctx.strokeStyle = positive
        ? `rgba(74, 255, 212, ${0.32 + signal * 0.52})`
        : `rgba(255, 109, 179, ${0.32 + signal * 0.52})`;
      ctx.lineWidth = 0.9 + normalized * 1.1 + signal * 0.9;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(lineEndX, lineEndY);
      ctx.stroke();
    }
  }

  for (let layerIndex = 0; layerIndex < nodeLayers.length; layerIndex += 1) {
    for (let nodeIndex = 0; nodeIndex < nodeLayers[layerIndex].length; nodeIndex += 1) {
      const node = nodeLayers[layerIndex][nodeIndex];
      ctx.fillStyle = `rgba(3, 11, 17, ${0.8 * alpha})`;
      ctx.fillRect(node.x - 2, node.y - 2, 4, 4);
      ctx.fillStyle = `rgba(157, 231, 255, ${0.78 * alpha})`;
      ctx.fillRect(node.x - 1, node.y - 1, 2, 2);
    }
  }

  if (fluxAmount > 0.01 && nodePulseBudget > 0) {
    const flatNodes = blueprintLayout.flatNodes;
    const selectorStep = Math.max(1, Math.round(0.45 / Math.max(0.01, nodePulseSelectorSpeed)));

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.shadowBlur = 0;

    for (let pulseIndex = 0; pulseIndex < nodePulseBudget; pulseIndex += 1) {
      const selectorCycle = time * nodePulseSelectorSpeed + fluxPhase * 2.6 + pulseIndex * 0.73;
      const selector =
        (Math.floor(selectorCycle / selectorStep) + Math.floor(fluxPhase * 23) + pulseIndex * 7) %
        Math.max(1, flatNodes.length);
      const nodeRef = flatNodes[selector];
      if (!nodeRef) {
        continue;
      }

      const node = nodeLayers[nodeRef.layerIndex][nodeRef.nodeIndex];
      const fadeT = (selectorCycle / selectorStep) % 1;
      const fade = Math.sin(fadeT * Math.PI) ** 2;
      const shimmer =
        0.5 + Math.sin(time * nodePulseSpeed + fluxPhase * 6 + pulseIndex * 0.8 + selector * 0.09) * 0.5;
      const pulseAlpha = (0.08 + shimmer * 0.14 + fluxAmount * 0.1) * fade * alpha;
      ctx.fillStyle = pulseIndex % 2 === 0
        ? `rgba(255, 241, 123, ${pulseAlpha * 0.5})`
        : `rgba(157, 231, 255, ${pulseAlpha * 0.46})`;
      ctx.fillRect(node.x - 3, node.y - 3, 6, 6);
      ctx.fillStyle = pulseIndex % 2 === 0
        ? `rgba(255, 241, 123, ${pulseAlpha})`
        : `rgba(157, 231, 255, ${pulseAlpha * 0.92})`;
      ctx.fillRect(node.x - 2, node.y - 2, 4, 4);
    }
    ctx.restore();
  }

  if (mutationSummary && mutationGlow > 0.01) {
    const nodePulse = 0.7 + Math.sin(time * 0.28 + x * 0.02 + y * 0.02) * 0.2;
    const maxMutation = Math.max(0.001, mutationSummary.maxDelta);

    for (let i = 0; i < mutationSummary.biasHighlights.length; i += 1) {
      const highlight = mutationSummary.biasHighlights[i];
      const mutationState = mutationSequenceState
        ? getMutationEntryState(
          mutationSequenceState,
          "bias",
          highlight.layerIndex,
          highlight.nodeIndex
        )
        : null;
      const reveal = mutationState ? mutationState.drawProgress : 1;
      if (reveal <= 0.01) {
        continue;
      }
      const node = nodeLayers[highlight.layerIndex + 1]?.[highlight.nodeIndex];
      if (!node) {
        continue;
      }

      const normalized = clamp(Math.abs(highlight.delta) / maxMutation, 0, 1);
      const settledGlow = mutationState?.complete ? 0.24 + mutationState.settleProgress * 0.22 : 0;
      const signal = normalized * mutationGlow * nodePulse * (0.16 + reveal * 0.68 + settledGlow);
      const positive = highlight.delta >= 0;
      const boxSize = 6 + reveal * 3 + normalized * 2;
      const fillSize = 3 + reveal * 2;

      ctx.shadowBlur = 4 + signal * 8;
      ctx.shadowColor = positive
        ? `rgba(74, 255, 212, ${0.22 + signal * 0.42})`
        : `rgba(255, 109, 179, ${0.22 + signal * 0.42})`;
      ctx.fillStyle = `rgba(255, 241, 123, ${0.15 + signal * 0.28})`;
      ctx.fillRect(node.x - boxSize * 0.5, node.y - boxSize * 0.5, boxSize, boxSize);
      ctx.strokeStyle = positive
        ? `rgba(74, 255, 212, ${0.35 + signal * 0.48})`
        : `rgba(255, 109, 179, ${0.35 + signal * 0.48})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(node.x - (boxSize - 1) * 0.5, node.y - (boxSize - 1) * 0.5, boxSize - 1, boxSize - 1);
      ctx.fillStyle = `rgba(223, 252, 255, ${0.42 + signal * 0.36})`;
      ctx.fillRect(node.x - fillSize * 0.5, node.y - fillSize * 0.5, fillSize, fillSize);
    }
  }

  ctx.restore();
}

function drawMutationTelemetry(ctx, summary, x, bottomY, intensity) {
  if (!summary || intensity <= 0.02) {
    return;
  }

  const boxWidth = 124;
  const boxHeight = 36;
  const boxX = x - boxWidth * 0.5;
  const boxY = bottomY - boxHeight;
  const alpha = clamp(0.22 + intensity * 0.72, 0.22, 0.94);

  ctx.save();
  ctx.fillStyle = `rgba(5, 15, 24, ${0.76 * alpha})`;
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  ctx.strokeStyle = `rgba(255, 241, 123, ${0.18 + intensity * 0.46})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
  ctx.fillStyle = `rgba(255, 241, 123, ${0.46 + intensity * 0.36})`;
  ctx.fillRect(boxX + 2, boxY + 2, boxWidth - 4, 1);
  ctx.textAlign = "center";
  ctx.font = CANVAS_FONTS.body;
  ctx.fillStyle = `rgba(255, 241, 123, ${0.7 + intensity * 0.22})`;
  ctx.fillText(`DW ${summary.changedWeights}  DB ${summary.changedBiases}`, x, boxY + 14);
  ctx.fillStyle = `rgba(255, 164, 208, ${0.62 + intensity * 0.28})`;
  ctx.fillText(`MAX ${summary.maxDelta.toFixed(2)}`, x, boxY + 28);
  ctx.restore();
}

function formatBrainNodeRef(layerIndex, nodeIndex) {
  return `L${layerIndex + 1}N${String(nodeIndex + 1).padStart(2, "0")}`;
}

function drawBrainStitchLedger(ctx, summary, centerX, topY, width, intensity, mutationSequenceState = null) {
  if (!summary || intensity <= 0.02) {
    return;
  }

  const lines = [];
  const weightHighlights = summary.weightHighlights.slice(0, 3);
  const biasHighlights = summary.biasHighlights.slice(0, 2);

  for (let i = 0; i < weightHighlights.length; i += 1) {
    const highlight = weightHighlights[i];
    lines.push({
      type: "weight",
      layerIndex: highlight.layerIndex,
      rowIndex: highlight.rowIndex,
      colIndex: highlight.colIndex,
      color: highlight.delta >= 0 ? "74, 255, 212" : "255, 109, 179",
      text: `${String(i + 1).padStart(2, "0")} ${formatBrainNodeRef(highlight.layerIndex, highlight.colIndex)}>${formatBrainNodeRef(highlight.layerIndex + 1, highlight.rowIndex)} ${highlight.delta >= 0 ? "+" : ""}${highlight.delta.toFixed(2)}`
    });
  }

  for (let i = 0; i < biasHighlights.length; i += 1) {
    const highlight = biasHighlights[i];
    lines.push({
      type: "bias",
      layerIndex: highlight.layerIndex,
      nodeIndex: highlight.nodeIndex,
      color: highlight.delta >= 0 ? "74, 255, 212" : "255, 109, 179",
      text: `B${i + 1} ${formatBrainNodeRef(highlight.layerIndex + 1, highlight.nodeIndex)} BIAS ${highlight.delta >= 0 ? "+" : ""}${highlight.delta.toFixed(2)}`
    });
  }

  const lineHeight = 12;
  const boxHeight = 18 + lines.length * lineHeight;
  const boxX = centerX - width * 0.5;

  ctx.save();
  ctx.fillStyle = `rgba(5, 15, 24, ${0.78 + intensity * 0.08})`;
  ctx.fillRect(boxX, topY, width, boxHeight);
  ctx.strokeStyle = `rgba(255, 241, 123, ${0.16 + intensity * 0.34})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX, topY, width, boxHeight);
  ctx.fillStyle = `rgba(255, 241, 123, ${0.54 + intensity * 0.22})`;
  ctx.fillRect(boxX + 2, topY + 2, width - 4, 1);

  ctx.font = CANVAS_FONTS.body;
  ctx.textAlign = "left";
  ctx.fillStyle = `rgba(221, 250, 255, ${0.72 + intensity * 0.18})`;
  ctx.fillText("STITCH MAP // PASSED NEURONS + LIVE MUTATIONS", boxX + 8, topY + 13);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const lineY = topY + 28 + i * lineHeight;
    const mutationState = mutationSequenceState
      ? getMutationEntryState(
        mutationSequenceState,
        line.type,
        line.layerIndex,
        line.type === "weight" ? line.rowIndex : line.nodeIndex,
        line.type === "weight" ? line.colIndex : 0
      )
      : null;
    const lineReveal = mutationState
      ? clamp(mutationState.drawProgress * 0.7 + mutationState.settleProgress * 0.3, 0, 1)
      : 1;

    if (mutationSequenceState && lineReveal <= 0.01) {
      ctx.fillStyle = `rgba(102, 220, 255, ${0.04 + intensity * 0.04})`;
      ctx.fillRect(boxX + 8, lineY - 3, Math.max(24, Math.round(width * 0.22)), 1);
      continue;
    }

    ctx.fillStyle = `rgba(${line.color}, ${(0.18 + intensity * 0.34) * lineReveal})`;
    ctx.fillRect(boxX + 8, lineY - 5, 5, 5);
    ctx.fillStyle = `rgba(221, 250, 255, ${(0.34 + intensity * 0.48) * lineReveal})`;
    ctx.fillText(line.text, boxX + 18, lineY);
  }

  ctx.restore();
}

function drawBrainStitching(
  ctx,
  summary,
  sourceX,
  sourceY,
  sourceW,
  sourceH,
  targetX,
  targetY,
  targetW,
  targetH,
  intensity,
  time,
  mutationSequenceState = null
) {
  if (!summary || intensity <= 0.02) {
    return;
  }

  const sourceLayers = getBrainBlueprintLayout(sourceX, sourceY, sourceW, sourceH).layers;
  const targetLayers = getBrainBlueprintLayout(targetX, targetY, targetW, targetH).layers;
  const stitchHighlights = summary.weightHighlights.slice(0, 6);
  const biasHighlights = summary.biasHighlights.slice(0, 3);
  const maxMutation = Math.max(0.001, summary.maxDelta);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < stitchHighlights.length; i += 1) {
    const highlight = stitchHighlights[i];
    const mutationState = mutationSequenceState
      ? getMutationEntryState(
        mutationSequenceState,
        "weight",
        highlight.layerIndex,
        highlight.rowIndex,
        highlight.colIndex
      )
      : null;
    const reveal = mutationState ? mutationState.drawProgress : 1;
    const burnProgress = mutationState ? mutationState.burnProgress : 1;
    const settled = mutationState ? mutationState.settleProgress : 1;
    if (mutationState && reveal <= 0.01) {
      continue;
    }

    const sourceFrom = sourceLayers[highlight.layerIndex][highlight.colIndex];
    const sourceTo = sourceLayers[highlight.layerIndex + 1][highlight.rowIndex];
    const targetFrom = targetLayers[highlight.layerIndex][highlight.colIndex];
    const targetTo = targetLayers[highlight.layerIndex + 1][highlight.rowIndex];
    const sourceMid = {
      x: lerp(sourceFrom.x, sourceTo.x, 0.5),
      y: lerp(sourceFrom.y, sourceTo.y, 0.5)
    };
    const positive = highlight.delta >= 0;
    const normalized = clamp(Math.abs(highlight.delta) / maxMutation, 0, 1);
    const revealAlpha = 0.16 + reveal * 0.66 + settled * 0.18;
    const threadAlpha = (0.08 + intensity * 0.18 + normalized * 0.12) * revealAlpha;
    const bridgeWarp = Math.sin(time * 0.018 + i * 0.48) * (3 + intensity * 4);
    const targetMidX = lerp(targetFrom.x, targetTo.x, 0.5);
    const bridgeControlX = lerp(sourceMid.x, targetMidX, 0.5);
    const targetMidY = lerp(targetFrom.y, targetTo.y, 0.5);
    const bridgeControlY = lerp(sourceMid.y, targetMidY, 0.5) + bridgeWarp;
    const activeBurning = mutationState ? !mutationState.complete && burnProgress > 0.02 : burnProgress < 0.999;
    const targetDx = targetTo.x - targetFrom.x;
    const targetDy = targetTo.y - targetFrom.y;
    const targetLength = Math.max(0.001, Math.hypot(targetDx, targetDy));
    const targetNormalX = -targetDy / targetLength;
    const targetNormalY = targetDx / targetLength;
    const burnCurve = (positive ? 1 : -1) * (2.4 + normalized * 2.2);
    const targetControlX = lerp(targetFrom.x, targetTo.x, 0.5) + targetNormalX * burnCurve;
    const targetControlY = lerp(targetFrom.y, targetTo.y, 0.5) + targetNormalY * burnCurve;
    const targetBurnProgress = burnProgress;
    const targetTipOuter = activeBurning && targetBurnProgress > 0.01
      ? traceWigglyQuadraticPath(
        ctx,
        targetFrom.x,
        targetFrom.y,
        targetControlX,
        targetControlY,
        targetTo.x,
        targetTo.y,
        targetBurnProgress,
        1 + normalized * 1.1 + intensity * 0.6,
        4,
        time * 0.042 + i * 0.42 + 0.7
      )
      : null;
    const targetLineEndX = lerp(targetFrom.x, targetTo.x, targetBurnProgress);
    const targetLineEndY = lerp(targetFrom.y, targetTo.y, targetBurnProgress);

    ctx.fillStyle = `rgba(255, 241, 123, ${(0.1 + intensity * 0.12) * revealAlpha})`;
    ctx.fillRect(sourceFrom.x - 2, sourceFrom.y - 2, 4, 4);
    ctx.fillRect(sourceTo.x - 2, sourceTo.y - 2, 4, 4);
    ctx.fillStyle = positive
      ? `rgba(74, 255, 212, ${(0.14 + intensity * 0.18 + normalized * 0.14) * revealAlpha})`
      : `rgba(255, 109, 179, ${(0.14 + intensity * 0.18 + normalized * 0.14) * revealAlpha})`;
    ctx.fillRect(targetFrom.x - 2, targetFrom.y - 2, 4, 4);
    ctx.fillRect(targetTo.x - 2, targetTo.y - 2, 4, 4);

    if (targetBurnProgress > 0.01) {
      ctx.strokeStyle = `rgba(255, 241, 123, ${(0.08 + intensity * 0.12 + normalized * 0.08) * revealAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(targetFrom.x, targetFrom.y);
      ctx.lineTo(targetLineEndX, targetLineEndY);
      ctx.stroke();

      ctx.strokeStyle = positive
        ? `rgba(74, 255, 212, ${(0.16 + intensity * 0.18 + normalized * 0.16) * revealAlpha})`
        : `rgba(255, 109, 179, ${(0.16 + intensity * 0.18 + normalized * 0.16) * revealAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(targetFrom.x, targetFrom.y);
      ctx.lineTo(targetLineEndX, targetLineEndY);
      ctx.stroke();
    }

    if (activeBurning) {
      ctx.strokeStyle = `rgba(255, 241, 123, ${(0.08 + intensity * 0.1) * revealAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sourceMid.x, sourceMid.y);
      ctx.quadraticCurveTo(bridgeControlX, bridgeControlY, targetFrom.x, targetFrom.y);
      ctx.stroke();

      ctx.strokeStyle = positive
        ? `rgba(74, 255, 212, ${threadAlpha})`
        : `rgba(255, 109, 179, ${threadAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sourceMid.x, sourceMid.y);
      ctx.quadraticCurveTo(bridgeControlX, bridgeControlY, targetFrom.x, targetFrom.y);
      ctx.stroke();
    }

    if (activeBurning && targetBurnProgress > 0.01) {
      ctx.strokeStyle = `rgba(255, 241, 123, ${(0.12 + intensity * 0.18 + normalized * 0.12) * revealAlpha})`;
      ctx.lineWidth = 2;
      traceWigglyQuadraticPath(
        ctx,
        targetFrom.x,
        targetFrom.y,
        targetControlX,
        targetControlY,
        targetTo.x,
        targetTo.y,
        targetBurnProgress,
        1 + normalized * 1.1 + intensity * 0.6,
        4,
        time * 0.042 + i * 0.42 + 0.7
      );
      ctx.stroke();

      ctx.strokeStyle = positive
        ? `rgba(74, 255, 212, ${(0.16 + intensity * 0.2 + normalized * 0.18) * revealAlpha})`
        : `rgba(255, 109, 179, ${(0.16 + intensity * 0.2 + normalized * 0.18) * revealAlpha})`;
      ctx.lineWidth = 2;
      traceWigglyQuadraticPath(
        ctx,
        targetFrom.x,
        targetFrom.y,
        targetControlX,
        targetControlY,
        targetTo.x,
        targetTo.y,
        targetBurnProgress,
        0.7 + normalized * 0.7 + intensity * 0.45,
        4,
        time * 0.042 + i * 0.42 + 1.05
      );
      ctx.stroke();
    }

    if (activeBurning) {
      const bridgeTipT = clamp((burnProgress - 0.02) / 0.22, 0, 1);
      const bridgeTipX = quadraticPoint(sourceMid.x, bridgeControlX, targetFrom.x, bridgeTipT);
      const bridgeTipY = quadraticPoint(sourceMid.y, bridgeControlY, targetFrom.y, bridgeTipT);
      ctx.fillStyle = `rgba(255, 241, 123, ${(0.18 + intensity * 0.22) * revealAlpha})`;
      ctx.fillRect(Math.round(bridgeTipX) - 1.5, Math.round(bridgeTipY) - 1.5, 3, 3);
    }
    if (activeBurning && targetTipOuter) {
      ctx.fillStyle = positive
        ? `rgba(74, 255, 212, ${(0.2 + intensity * 0.22 + normalized * 0.18) * revealAlpha})`
        : `rgba(255, 109, 179, ${(0.2 + intensity * 0.22 + normalized * 0.18) * revealAlpha})`;
      ctx.fillRect(Math.round(targetTipOuter.x) - 2, Math.round(targetTipOuter.y) - 2, 4, 4);
    }
  }

  for (let i = 0; i < biasHighlights.length; i += 1) {
    const highlight = biasHighlights[i];
    const sourceNode = sourceLayers[highlight.layerIndex + 1]?.[highlight.nodeIndex];
    const targetNode = targetLayers[highlight.layerIndex + 1]?.[highlight.nodeIndex];
    if (!sourceNode || !targetNode) {
      continue;
    }

    const mutationState = mutationSequenceState
      ? getMutationEntryState(
        mutationSequenceState,
        "bias",
        highlight.layerIndex,
        highlight.nodeIndex
      )
      : null;
    const reveal = mutationState ? mutationState.drawProgress : 1;
    const burnProgress = mutationState ? mutationState.burnProgress : 1;
    const settled = mutationState ? mutationState.settleProgress : 1;
    if (mutationState && reveal <= 0.01) {
      continue;
    }

    const normalized = clamp(Math.abs(highlight.delta) / maxMutation, 0, 1);
    const positive = highlight.delta >= 0;
    const pulse = 0.5 + Math.sin(time * 0.08 + i * 0.9) * 0.5;
    const revealAlpha = 0.18 + reveal * 0.62 + settled * 0.2;
    const activeBurning = mutationState ? !mutationState.complete && burnProgress > 0.02 : burnProgress < 0.999;
    const biasDx = targetNode.x - sourceNode.x;
    const biasDy = targetNode.y - sourceNode.y;
    const biasLength = Math.max(0.001, Math.hypot(biasDx, biasDy));
    const biasNormalX = -biasDy / biasLength;
    const biasNormalY = biasDx / biasLength;
    const biasControlX = lerp(sourceNode.x, targetNode.x, 0.5) + biasNormalX * (positive ? 5 : -5);
    const biasControlY = lerp(sourceNode.y, targetNode.y, 0.5) + biasNormalY * (positive ? 5 : -5);
    const biasBurnProgress = burnProgress;
    const biasDrawActive = activeBurning && biasBurnProgress > 0.01 && biasBurnProgress < 0.995;
    const biasTip = biasDrawActive
      ? traceWigglyQuadraticPath(
        ctx,
        sourceNode.x,
        sourceNode.y,
        biasControlX,
        biasControlY,
        targetNode.x,
        targetNode.y,
        biasBurnProgress,
        0.8 + normalized * 0.8 + intensity * 0.4,
        4,
        time * 0.04 + i * 0.4
      )
      : null;
    const nodeBoxProgress = clamp((biasBurnProgress - 0.72) / 0.12, 0, 1);
    const nodeBoxSize = 4 + nodeBoxProgress * (4 + normalized * 2);

    ctx.fillStyle = `rgba(255, 241, 123, ${(0.1 + intensity * 0.12) * revealAlpha})`;
    ctx.fillRect(sourceNode.x - 2, sourceNode.y - 2, 4, 4);

    if (nodeBoxProgress > 0.01) {
      ctx.strokeStyle = positive
        ? `rgba(74, 255, 212, ${(0.16 + intensity * 0.16 + normalized * 0.16) * revealAlpha})`
        : `rgba(255, 109, 179, ${(0.16 + intensity * 0.16 + normalized * 0.16) * revealAlpha})`;
      ctx.strokeRect(
        targetNode.x - nodeBoxSize * 0.5,
        targetNode.y - nodeBoxSize * 0.5,
        nodeBoxSize,
        nodeBoxSize
      );
    }

    if (biasDrawActive) {
      ctx.strokeStyle = `rgba(255, 241, 123, ${(0.12 + intensity * 0.18 + pulse * 0.07) * revealAlpha})`;
      ctx.lineWidth = 1;
      traceWigglyQuadraticPath(
        ctx,
        sourceNode.x,
        sourceNode.y,
        biasControlX,
        biasControlY,
        targetNode.x,
        targetNode.y,
        biasBurnProgress,
        0.8 + normalized * 0.8 + intensity * 0.4,
        4,
        time * 0.04 + i * 0.4
      );
      ctx.stroke();

      ctx.strokeStyle = positive
        ? `rgba(74, 255, 212, ${(0.16 + intensity * 0.16 + normalized * 0.16) * revealAlpha})`
        : `rgba(255, 109, 179, ${(0.16 + intensity * 0.16 + normalized * 0.16) * revealAlpha})`;
      ctx.lineWidth = 1;
      traceWigglyQuadraticPath(
        ctx,
        sourceNode.x,
        sourceNode.y,
        biasControlX,
        biasControlY,
        targetNode.x,
        targetNode.y,
        biasBurnProgress,
        0.55 + normalized * 0.55 + intensity * 0.28,
        4,
        time * 0.04 + i * 0.4 + 0.7
      );
      ctx.stroke();

    }

    if (biasTip) {
      ctx.fillStyle = `rgba(255, 241, 123, ${(0.18 + intensity * 0.22 + pulse * 0.08) * revealAlpha})`;
      ctx.fillRect(Math.round(biasTip.x) - 2, Math.round(biasTip.y) - 2, 4, 4);
    }

    ctx.fillStyle = positive
      ? `rgba(74, 255, 212, ${(0.14 + intensity * 0.16 + normalized * 0.14) * revealAlpha})`
      : `rgba(255, 109, 179, ${(0.14 + intensity * 0.16 + normalized * 0.14) * revealAlpha})`;
    ctx.fillRect(targetNode.x - 2, targetNode.y - 2, 4, 4);
  }

  ctx.restore();
}

function getExtinctionPlanProgress(scene, slotTiming, plan) {
  const relativeFrame = scene.frame - scene.scanFrames - slotTiming.startFrame;
  const durationFrames = slotTiming.durationFrames;
  const normalizedProgress = clamp(relativeFrame / Math.max(1, durationFrames), 0, 1);
  const phaseFrames = plan.inherited
    ? {
      build: 8,
      buildPause: 0,
      mutate: 200,
      mutatePause: 0,
      preview: 0,
      pack: 120,
      travel: 24,
      implant: 18
    }
    : {
      build: 10,
      buildPause: 0,
      mutate: 8,
      mutatePause: 0,
      preview: 0,
      pack: 6,
      travel: 10,
      implant: 8
    };

  const buildEndFrame = phaseFrames.build;
  const buildPauseEndFrame = buildEndFrame + phaseFrames.buildPause;
  const mutationEndFrame = buildPauseEndFrame + phaseFrames.mutate;
  const mutationPauseEndFrame = mutationEndFrame + phaseFrames.mutatePause;
  const previewEndFrame = mutationPauseEndFrame + phaseFrames.preview;
  const packEndFrame = previewEndFrame + phaseFrames.pack;
  const cubeGrowthFrames = plan.inherited ? phaseFrames.pack : Math.min(120, phaseFrames.mutate);
  const cubeGrowthStartFrame = plan.inherited ? previewEndFrame : mutationEndFrame - cubeGrowthFrames;
  const transferEndFrame = packEndFrame + phaseFrames.travel;
  const implantEndFrame = transferEndFrame + phaseFrames.implant;

  return {
    progress: normalizedProgress,
    started: relativeFrame >= 0,
    active: relativeFrame >= 0 && relativeFrame < durationFrames,
    complete: relativeFrame >= durationFrames,
    buildProgress: smooth01(clamp(relativeFrame / Math.max(1, phaseFrames.build), 0, 1)),
    buildHoldActive: relativeFrame >= buildEndFrame && relativeFrame < buildPauseEndFrame,
    mutationProgress: clamp(
      (relativeFrame - buildPauseEndFrame) / Math.max(1, phaseFrames.mutate),
      0,
      1
    ),
    cubeGrowthProgress: clamp(
      (relativeFrame - cubeGrowthStartFrame) / Math.max(1, cubeGrowthFrames),
      0,
      1
    ),
    mutationPauseActive: relativeFrame >= mutationEndFrame && relativeFrame < mutationPauseEndFrame,
    previewProgress: smooth01(clamp(
      (relativeFrame - mutationPauseEndFrame) / Math.max(1, phaseFrames.preview),
      0,
      1
    )),
    previewActive: phaseFrames.preview > 0 && relativeFrame >= mutationPauseEndFrame && relativeFrame < previewEndFrame,
    packageProgress: smooth01(clamp(
      (relativeFrame - previewEndFrame) / Math.max(1, phaseFrames.pack),
      0,
      1
    )),
    packageActive: relativeFrame >= previewEndFrame && relativeFrame < packEndFrame,
    cubeTravelProgress: smooth01(clamp(
      (relativeFrame - packEndFrame) / Math.max(1, phaseFrames.travel),
      0,
      1
    )),
    cubeTravelActive: relativeFrame >= packEndFrame && relativeFrame < transferEndFrame,
    transferProgress: smooth01(clamp(
      (relativeFrame - previewEndFrame) / Math.max(1, phaseFrames.pack + phaseFrames.travel),
      0,
      1
    )),
    implantProgress: smooth01(clamp(
      (relativeFrame - transferEndFrame) / Math.max(1, phaseFrames.implant),
      0,
      1
    )),
    implantActive: relativeFrame >= transferEndFrame && relativeFrame < implantEndFrame
  };
}

function drawIncubationEgg(ctx, plan, planState, x, y, isActive, flashPulse, label) {
  const accent = plan.inherited ? "255, 241, 123" : "102, 220, 255";
  const preHeat = planState.started ? planState.buildProgress * 0.18 : 0;
  const shellCharge = clamp(
    (planState.complete ? 1 : 0) + planState.implantProgress * 0.8 + planState.transferProgress * 0.18,
    0,
    1
  );
  const pulse = isActive ? 0.62 + flashPulse * 0.38 : 0.46 + flashPulse * 0.14;

  ctx.save();
  ctx.fillStyle = `rgba(6, 18, 28, ${0.72 + preHeat * 0.08})`;
  ctx.fillRect(x - 16, y + 12, 32, 18);
  ctx.fillStyle = `rgba(${accent}, ${0.04 + preHeat * 0.1 + shellCharge * 0.12})`;
  ctx.fillRect(x - 12, y + 18, 24, 12);
  ctx.shadowBlur = isActive ? 8 + shellCharge * 14 : shellCharge > 0.92 ? 5 : 0;
  ctx.shadowColor = `rgba(${accent}, ${0.12 + shellCharge * 0.18 + (isActive ? 0.06 : 0)})`;
  ctx.fillStyle = `rgba(243, 251, 255, ${0.16 + preHeat * 0.08 + shellCharge * 0.42 + pulse * 0.06})`;
  ctx.fillRect(x - 8, y + 16, 16, 10);
  ctx.fillRect(x - 5, y + 10, 10, 18);
  ctx.strokeStyle = `rgba(${accent}, ${0.14 + shellCharge * 0.5 + (isActive ? 0.18 : 0.04)})`;
  ctx.strokeRect(x - 8, y + 16, 16, 10);
  ctx.strokeRect(x - 5, y + 10, 10, 18);

  if (shellCharge > 0.04) {
    ctx.fillStyle = `rgba(${accent}, ${0.08 + shellCharge * 0.4})`;
    ctx.fillRect(x - 3, y + 15, 6, 6);
  }

  if (planState.complete) {
    ctx.fillStyle = `rgba(${accent}, ${0.18 + flashPulse * 0.12})`;
    ctx.fillRect(x - 1, y + 7, 2, 2);
  }

  ctx.shadowBlur = 0;
  ctx.textAlign = "center";
  ctx.font = CANVAS_FONTS.body;
  ctx.fillStyle = `rgba(${accent}, ${0.44 + (isActive ? 0.28 : 0.12)})`;
  ctx.fillText(plan.inherited ? "DNA" : "RND", x, y + 5);
  ctx.fillStyle = `rgba(221, 250, 255, ${0.56 + (isActive ? 0.24 : 0.1)})`;
  ctx.fillText(label, x, y + 41);
  ctx.restore();
}

function drawBrainDataCube(ctx, x, y, accent, intensity, scale, pulse, options = {}) {
  const time = options.time ?? state.tick;
  const halo = clamp(options.halo ?? 0, 0, 1.8);
  const shell = clamp(options.shell ?? 0, 0, 1.6);
  const orbit = clamp(options.orbit ?? 0, 0, 1.4);
  const cubeSize = Math.max(8, Math.round((9 + intensity * 4 + halo * 2) * scale));
  const depth = Math.max(2, Math.round(2 + intensity * 2 + shell * 1.4));
  const halfSize = cubeSize * 0.5;
  const coreHeight = Math.max(3, Math.round((cubeSize - 6) * clamp(0.34 + pulse * 0.26, 0.28, 0.82)));
  const shellGrow = 4 + halo * 8;
  const orbitRadius = halfSize + 5 + orbit * 7;
  const shimmer = 0.5 + Math.sin(time * 0.18 + pulse * TAU) * 0.5;

  ctx.save();
  ctx.translate(x, y);

  if (halo > 0.01) {
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(${accent}, ${0.08 + halo * 0.12})`;
    ctx.fillRect(-halfSize - shellGrow, -halfSize - shellGrow, cubeSize + shellGrow * 2, cubeSize + shellGrow * 2);
    ctx.strokeStyle = `rgba(255, 241, 123, ${0.14 + halo * 0.22})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(
      -halfSize - shellGrow * 0.6,
      -halfSize - shellGrow * 0.6,
      cubeSize + shellGrow * 1.2,
      cubeSize + shellGrow * 1.2
    );
  }

  if (shell > 0.01) {
    const shellOffset = 3 + shell * 5;
    ctx.strokeStyle = `rgba(${accent}, ${0.18 + shell * 0.26})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(
      -halfSize - shellOffset,
      -halfSize - shellOffset,
      cubeSize + shellOffset * 2,
      cubeSize + shellOffset * 2
    );
    ctx.strokeStyle = `rgba(255, 241, 123, ${0.12 + shell * 0.22})`;
    ctx.strokeRect(
      -halfSize - shellOffset - 3,
      -halfSize - shellOffset - 3,
      cubeSize + (shellOffset + 3) * 2,
      cubeSize + (shellOffset + 3) * 2
    );
  }

  if (orbit > 0.01) {
    ctx.globalCompositeOperation = "lighter";
    for (let orbitIndex = 0; orbitIndex < 4; orbitIndex += 1) {
      const angle = time * 0.11 + orbitIndex * (TAU / 4) + pulse * 0.6;
      const orbitX = Math.cos(angle) * orbitRadius;
      const orbitY = Math.sin(angle) * orbitRadius * 0.74;
      const packetSize = 2 + Math.round(orbit * 1.6);
      ctx.fillStyle = orbitIndex % 2 === 0
        ? `rgba(255, 241, 123, ${0.18 + orbit * 0.24})`
        : `rgba(${accent}, ${0.16 + orbit * 0.24})`;
      ctx.fillRect(Math.round(orbitX) - packetSize, Math.round(orbitY) - packetSize, packetSize * 2, packetSize * 2);
    }
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = `rgba(4, 12, 20, ${0.72 + intensity * 0.12})`;
  ctx.fillRect(-halfSize, -halfSize, cubeSize, cubeSize);
  ctx.strokeStyle = `rgba(${accent}, ${0.32 + intensity * 0.4})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(-halfSize, -halfSize, cubeSize, cubeSize);

  ctx.beginPath();
  ctx.moveTo(-halfSize, -halfSize);
  ctx.lineTo(-halfSize + depth, -halfSize - depth);
  ctx.lineTo(halfSize + depth, -halfSize - depth);
  ctx.lineTo(halfSize, -halfSize);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(halfSize, -halfSize);
  ctx.lineTo(halfSize + depth, -halfSize - depth);
  ctx.lineTo(halfSize + depth, halfSize - depth);
  ctx.lineTo(halfSize, halfSize);
  ctx.stroke();

  ctx.fillStyle = `rgba(${accent}, ${0.18 + intensity * 0.22})`;
  ctx.fillRect(-halfSize + 2, -halfSize + 2, cubeSize - 4, cubeSize - 4);
  ctx.fillStyle = `rgba(255, 241, 123, ${0.08 + halo * 0.12})`;
  ctx.fillRect(-halfSize + 3, -halfSize + 3, cubeSize - 6, cubeSize - 6);
  for (let barIndex = 0; barIndex < 3; barIndex += 1) {
    const barX = -halfSize + 4 + barIndex * Math.max(3, Math.round(cubeSize * 0.22));
    const barHeight = Math.max(3, Math.round((cubeSize - 8) * (0.34 + shimmer * 0.24 + barIndex * 0.08)));
    ctx.fillStyle = barIndex === 1
      ? `rgba(255, 241, 123, ${0.18 + intensity * 0.22 + halo * 0.12})`
      : `rgba(${accent}, ${0.18 + intensity * 0.18 + halo * 0.1})`;
    ctx.fillRect(barX, halfSize - 4 - barHeight, 2, barHeight);
  }
  ctx.fillStyle = `rgba(255, 241, 123, ${0.28 + intensity * 0.24})`;
  ctx.fillRect(-1, halfSize - 3 - coreHeight, 2, coreHeight);
  ctx.fillStyle = `rgba(221, 250, 255, ${0.22 + intensity * 0.16})`;
  ctx.fillRect(-halfSize + 3, -halfSize + 3, cubeSize - 6, 2);

  ctx.fillStyle = `rgba(255, 255, 255, ${0.38 + intensity * 0.22})`;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
}

function drawCubeSynthesisBox(ctx, x, y, width, height, accent, charge, pulse, time) {
  const shimmer = 0.5 + Math.sin(time * 0.16 + pulse * TAU) * 0.5;
  const innerGlow = 0.08 + charge * 0.14 + shimmer * 0.04;

  ctx.save();
  ctx.fillStyle = `rgba(5, 14, 23, ${0.82 + charge * 0.08})`;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = `rgba(${accent}, ${0.18 + charge * 0.3})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
  ctx.strokeStyle = `rgba(255, 241, 123, ${0.12 + charge * 0.22})`;
  ctx.strokeRect(x + 4, y + 4, width - 8, height - 8);

  ctx.fillStyle = `rgba(${accent}, ${innerGlow})`;
  ctx.fillRect(x + 6, y + 6, width - 12, height - 12);
  ctx.fillStyle = `rgba(255, 241, 123, ${0.16 + charge * 0.18})`;
  ctx.fillRect(x + 8, y + height * 0.5 - 1, width - 16, 2);
  ctx.fillRect(x + width * 0.5 - 1, y + 8, 2, height - 16);

  ctx.fillStyle = `rgba(221, 250, 255, ${0.24 + charge * 0.18})`;
  ctx.fillRect(x + 8, y + 8, width - 16, 2);
  ctx.fillStyle = `rgba(${accent}, ${0.14 + charge * 0.16})`;
  ctx.fillRect(x - 6, y + height - 8, 6, 2);
  ctx.fillRect(x + width, y + height - 8, 6, 2);
  ctx.restore();
}

function drawExtinctionSpecimen(ctx, specimen, x, y, scale, heading, alpha, curlAmount, coilProgress = 0) {
  if (!specimen || alpha <= 0.01) {
    return;
  }

  const coil = clamp(coilProgress, 0, 1);
  const lifeScale = specimen.lifeStage === "juvenile"
    ? 0.78
    : specimen.lifeStage === "egg"
      ? 0.66
      : 1;
  const energyRatio = clamp(specimen.energy / CONFIG.maxEnergy, 0.08, 1);
  const headLength = Math.max(10, Math.round((14 + energyRatio * 5) * lifeScale * scale));
  const headHeight = Math.max(6, Math.round((6 + energyRatio * 8) * lifeScale * scale));
  const segmentCount = specimen.lifeStage === "egg"
    ? 0
    : Math.max(1, Math.round(clampSegmentGene(specimen.segmentGene) * lifeScale));
  const spacing = Math.max(6, Math.round((headLength * 0.4 + 2) * Math.max(0.82, lifeScale) * scale));
  const headingX = Math.cos(heading);
  const headingY = Math.sin(heading);
  const normalX = -headingY;
  const normalY = headingX;
  const bodyColor = `hsla(${specimen.hue} 92% 62% / ${alpha})`;
  const bodyShadow = `hsla(${specimen.hue} 95% 72% / ${0.28 * alpha})`;

  ctx.save();
  ctx.globalAlpha = alpha;

  for (let i = segmentCount - 1; i >= 0; i -= 1) {
    const progress = segmentCount <= 1 ? 0 : i / (segmentCount - 1);
    const segLength = Math.max(8, Math.round(headLength * (0.82 - progress * 0.16)));
    const segHeight = Math.max(5, Math.round(headHeight * (0.88 - progress * 0.2)));
    const localX = -(headLength * 0.42 + spacing * (i + 1));
    const lateral = curlAmount * (4 + i * 1.8) * (0.22 + progress * 0.4);
    const normalSegmentX = x + headingX * localX + normalX * lateral;
    const normalSegmentY = y + headingY * localX + normalY * lateral;
    const normalSegmentAngle = heading + curlAmount * (0.03 + progress * 0.08);
    const spiralRadius =
      headLength * (0.18 + progress * 0.16) +
      (i + 1) * Math.max(1.5, spacing * 0.11) * (0.9 - coil * 0.18);
    const spiralAngle =
      heading +
      Math.PI * 0.54 +
      (i + 1) * (0.62 + coil * 0.44) +
      curlAmount * 0.06;
    const spiralSegmentX = x + Math.cos(spiralAngle) * spiralRadius;
    const spiralSegmentY = y + Math.sin(spiralAngle) * spiralRadius * 0.92;
    const spiralSegmentAngle = spiralAngle + Math.PI * 0.5;
    const segmentX = lerp(normalSegmentX, spiralSegmentX, coil);
    const segmentY = lerp(normalSegmentY, spiralSegmentY, coil);
    const segmentAngle = lerp(normalSegmentAngle, spiralSegmentAngle, coil);

    ctx.save();
    ctx.translate(segmentX, segmentY);
    ctx.rotate(segmentAngle);
    ctx.fillStyle = bodyShadow;
    ctx.fillRect(-Math.round(segLength * 0.5) - 1, -Math.round(segHeight * 0.5), segLength + 2, segHeight);
    ctx.fillStyle = "#14283b";
    ctx.fillRect(-Math.round(segLength * 0.46), -Math.round(segHeight * 0.42), Math.round(segLength * 0.92), Math.round(segHeight * 0.84));
    ctx.fillStyle = `hsla(${specimen.hue} 92% ${Math.round(62 - progress * 10)}% / ${alpha})`;
    ctx.fillRect(-Math.round(segLength * 0.4), -Math.round(segHeight * 0.38), Math.round(segLength * 0.8), Math.round(segHeight * 0.76));
    ctx.restore();
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading);
  ctx.fillStyle = bodyShadow;
  ctx.fillRect(-Math.round(headLength * 0.52), -Math.round(headHeight * 0.52), Math.round(headLength * 1.04), Math.round(headHeight * 1.04));
  ctx.fillStyle = "#14283b";
  ctx.fillRect(-Math.round(headLength * 0.46), -Math.round(headHeight * 0.44), Math.round(headLength * 0.92), Math.round(headHeight * 0.88));
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-Math.round(headLength * 0.4), -Math.round(headHeight * 0.38), Math.round(headLength * 0.8), Math.round(headHeight * 0.76));
  ctx.fillStyle = `hsla(${specimen.hue} 100% 82% / ${0.24 * alpha})`;
  ctx.fillRect(Math.round(headLength * 0.06), -Math.max(2, Math.round(headHeight * 0.28)), Math.max(3, Math.round(headLength * 0.22)), Math.max(3, Math.round(headHeight * 0.54)));

  const eyeOffsetX = Math.round(headLength * 0.16);
  const eyeTopY = -Math.max(3, Math.round(headHeight * 0.3)) + 1;
  const eyeBottomY = Math.max(1, Math.round(headHeight * 0.12)) + 1;
  ctx.fillStyle = "#031117";
  ctx.fillRect(eyeOffsetX, eyeTopY, 3, 3);
  ctx.fillRect(eyeOffsetX, eyeBottomY, 3, 3);
  ctx.fillStyle = "#dffcff";
  ctx.fillRect(eyeOffsetX + 1, eyeTopY + 1, 1, 1);
  ctx.fillRect(eyeOffsetX + 1, eyeBottomY + 1, 1, 1);
  ctx.fillStyle = "#1c394f";
  ctx.fillRect(Math.round(headLength * 0.46), -1, 3, 2);
  ctx.restore();
  ctx.restore();
}

function drawContainmentCell(ctx, x, y, width, height, lockProgress, pulse) {
  const depth = 7;
  const glow = 0.18 + lockProgress * 0.24 + pulse * 0.08;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = `rgba(102, 220, 255, ${glow})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
  ctx.strokeRect(x + depth, y - depth, width, height);

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + depth, y - depth);
  ctx.moveTo(x + width, y);
  ctx.lineTo(x + width + depth, y - depth);
  ctx.moveTo(x, y + height);
  ctx.lineTo(x + depth, y + height - depth);
  ctx.moveTo(x + width, y + height);
  ctx.lineTo(x + width + depth, y + height - depth);
  ctx.stroke();

  const bracket = 12;
  ctx.fillStyle = `rgba(255, 241, 123, ${0.12 + lockProgress * 0.14 + pulse * 0.06})`;
  ctx.fillRect(x - 1, y - 1, bracket, 1);
  ctx.fillRect(x - 1, y - 1, 1, bracket);
  ctx.fillRect(x + width - bracket + 1, y - 1, bracket, 1);
  ctx.fillRect(x + width, y - 1, 1, bracket);
  ctx.fillRect(x - 1, y + height, bracket, 1);
  ctx.fillRect(x - 1, y + height - bracket + 1, 1, bracket);
  ctx.fillRect(x + width - bracket + 1, y + height, bracket, 1);
  ctx.fillRect(x + width, y + height - bracket + 1, 1, bracket);

  for (let rail = 0; rail < 4; rail += 1) {
    const railY = y + 8 + rail * ((height - 16) / 3);
    ctx.fillStyle = rail % 2 === 0
      ? `rgba(102, 220, 255, ${0.06 + lockProgress * 0.06})`
      : `rgba(255, 109, 179, ${0.04 + lockProgress * 0.05})`;
    ctx.fillRect(x + 6, railY, width - 12, 1);
  }

  ctx.fillStyle = `rgba(221, 250, 255, ${0.16 + lockProgress * 0.12})`;
  ctx.fillRect(x + 4, y + 4, width - 8, 1);
  ctx.restore();
}

function drawSpecimenHeadScanPanel(ctx, specimen, brain, x, y, width, height, scanProgress, time, headAnchorX, headAnchorY) {
  if (!specimen) {
    return;
  }

  const scanActive = scanProgress > 0.01;
  const pulse = 0.5 + Math.sin(time * 0.12 + 1.2) * 0.5;
  const insetX = x + 14;
  const insetY = y + 18;
  const insetW = width - 28;
  const insetH = Math.min(108, Math.round(height * 0.48));
  const headWidth = Math.max(82, Math.round(insetW * 0.72));
  const headHeight = Math.max(46, Math.round(insetH * 0.62));
  const headCenterX = insetX + insetW * 0.48;
  const headCenterY = insetY + insetH * 0.58;
  const headOuterW = Math.round(headWidth * 0.92);
  const headOuterH = Math.round(headHeight * 0.94);
  const headInnerW = Math.round(headWidth * 0.82);
  const headInnerH = Math.round(headHeight * 0.84);
  const headFillW = Math.round(headWidth * 0.72);
  const headFillH = Math.round(headHeight * 0.74);
  const brainX = Math.round(headCenterX - headWidth * 0.34);
  const brainY = Math.round(headCenterY - headHeight * 0.3);
  const brainW = Math.round(headWidth * 0.42);
  const brainH = Math.round(headHeight * 0.6);
  const scanLineX = insetX + 8 + (insetW - 16) * scanProgress;
  const bodyColor = `hsla(${specimen.hue} 92% 62% / 0.96)`;
  const bodyShadow = `hsla(${specimen.hue} 95% 72% / 0.34)`;

  ctx.save();
  ctx.fillStyle = "rgba(5, 15, 24, 0.86)";
  ctx.fillRect(insetX, insetY, insetW, insetH);
  ctx.strokeStyle = `rgba(102, 220, 255, ${0.22 + scanProgress * 0.18})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(insetX, insetY, insetW, insetH);
  ctx.fillStyle = `rgba(102, 220, 255, ${0.1 + pulse * 0.06})`;
  ctx.fillRect(insetX + 2, insetY + 2, insetW - 4, 1);
  ctx.fillStyle = `rgba(221, 250, 255, ${0.72 + pulse * 0.12})`;
  ctx.font = CANVAS_FONTS.small;
  ctx.textAlign = "center";
  ctx.fillText(
    !scanActive
      ? "HEAD ZOOM // STANDBY"
      : scanProgress < 0.995
        ? "HEAD ZOOM // ACTIVE SCAN"
        : "HEAD ZOOM // SCAN LOCKED",
    x + width * 0.5,
    insetY + insetH + 12
  );

  if (scanActive && Number.isFinite(headAnchorX) && Number.isFinite(headAnchorY)) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(102, 220, 255, ${0.12 + scanProgress * 0.24})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(headAnchorX, headAnchorY);
    ctx.lineTo(x + width * 0.24, y + height * 0.58);
    ctx.lineTo(insetX + 12, insetY + insetH - 8);
    ctx.stroke();
    ctx.restore();
  }

  ctx.fillStyle = bodyShadow;
  ctx.fillRect(
    Math.round(headCenterX - headOuterW * 0.5) - 2,
    Math.round(headCenterY - headOuterH * 0.5) - 1,
    headOuterW + 4,
    headOuterH + 2
  );
  ctx.fillStyle = "#14283b";
  ctx.fillRect(
    Math.round(headCenterX - headInnerW * 0.5),
    Math.round(headCenterY - headInnerH * 0.5),
    headInnerW,
    headInnerH
  );
  ctx.fillStyle = bodyColor;
  ctx.fillRect(
    Math.round(headCenterX - headFillW * 0.5),
    Math.round(headCenterY - headFillH * 0.5),
    headFillW,
    headFillH
  );
  ctx.fillStyle = `rgba(255, 255, 255, ${0.12 + pulse * 0.08})`;
  ctx.fillRect(
    Math.round(headCenterX + headFillW * 0.04),
    Math.round(headCenterY - headFillH * 0.28),
    Math.max(6, Math.round(headFillW * 0.2)),
    Math.max(6, Math.round(headFillH * 0.56))
  );

  if (brain && scanActive) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(brainX, brainY, brainW, brainH);
    ctx.clip();
    drawBrainBlueprint(ctx, brain, brainX, brainY, brainW, brainH, {
      alpha: 0.16 + scanProgress * 0.48,
      fluxAmount: 0.08 + scanProgress * 0.28 + pulse * 0.04,
      fluxPacketBudget: 4,
      nodePulseBudget: 2,
      fluxSpeedScale: 0.18,
      fluxSelectorSpeed: 0.1,
      nodePulseSpeed: 0.05,
      nodePulseSelectorSpeed: 0.12,
      fluxPhase: 0.19,
      time
    });
    ctx.restore();
  }

  const eyeX = Math.round(headCenterX + headFillW * 0.14);
  const eyeTopY = Math.round(headCenterY - headFillH * 0.26);
  const eyeBottomY = Math.round(headCenterY + headFillH * 0.06);
  ctx.fillStyle = "#031117";
  ctx.fillRect(eyeX, eyeTopY, 5, 5);
  ctx.fillRect(eyeX, eyeBottomY, 5, 5);
  ctx.fillStyle = "#dffcff";
  ctx.fillRect(eyeX + 2, eyeTopY + 2, 1, 1);
  ctx.fillRect(eyeX + 2, eyeBottomY + 2, 1, 1);
  ctx.fillStyle = "#1c394f";
  ctx.fillRect(Math.round(headCenterX + headFillW * 0.38), Math.round(headCenterY - 1), 6, 3);

  if (scanActive) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = `rgba(102, 220, 255, ${0.08 + scanProgress * 0.08})`;
    ctx.fillRect(scanLineX - 10, insetY - 2, 20, insetH + 4);
    ctx.fillStyle = `rgba(255, 241, 123, ${0.14 + pulse * 0.12})`;
    ctx.fillRect(scanLineX - 1, insetY - 4, 2, insetH + 8);
    for (let sample = 0; sample < 4; sample += 1) {
      const sampleY = insetY + 12 + sample * 16 + Math.sin(time * 0.17 + sample * 0.8) * 2;
      ctx.fillStyle = sample % 2 === 0
        ? `rgba(102, 220, 255, ${0.18 + scanProgress * 0.2})`
        : `rgba(255, 109, 179, ${0.18 + scanProgress * 0.18})`;
      ctx.fillRect(scanLineX + 8 + sample * 4, sampleY, 3, 2);
    }
    ctx.restore();
  } else {
    ctx.fillStyle = "rgba(221, 250, 255, 0.44)";
    ctx.font = CANVAS_FONTS.small;
    ctx.fillText("WAITING FOR CONTAINMENT LOCK", x + width * 0.5, insetY + insetH * 0.54);
  }

  ctx.textAlign = "left";
  ctx.restore();
}

function drawRandomBrainGenesis(ctx, brain, x, y, width, height, buildProgress, packageProgress, time) {
  if (!brain || buildProgress <= 0.01) {
    return;
  }

  const blueprintLayout = getBrainBlueprintLayout(x, y, width, height);
  const nodes = blueprintLayout.layers;
  const centerX = x + width * 0.5;
  const centerY = y + height * 0.5;
  const flatNodes = [];

  for (let i = 0; i < blueprintLayout.flatNodes.length; i += 1) {
    const ref = blueprintLayout.flatNodes[i];
    flatNodes.push(nodes[ref.layerIndex][ref.nodeIndex]);
  }

  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  const corePulse = 0.5 + Math.sin(time * 0.12) * 0.5;
  const shellSize = 12 + buildProgress * 18;
  ctx.strokeStyle = `rgba(102, 220, 255, ${0.16 + buildProgress * 0.26})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(centerX - shellSize * 0.5, centerY - shellSize * 0.5, shellSize, shellSize);
  ctx.strokeStyle = `rgba(255, 109, 179, ${0.12 + buildProgress * 0.2})`;
  ctx.strokeRect(centerX - shellSize * 0.34, centerY - shellSize * 0.34, shellSize * 0.68, shellSize * 0.68);
  ctx.fillStyle = `rgba(255, 241, 123, ${0.18 + buildProgress * 0.26 + corePulse * 0.08})`;
  ctx.fillRect(centerX - 2, centerY - 2, 4, 4);

  const layerRevealStep = 1 / Math.max(1, nodes.length);
  for (let layerIndex = 0; layerIndex < nodes.length; layerIndex += 1) {
    const reveal = smooth01(clamp((buildProgress - layerIndex * layerRevealStep * 0.55) / 0.45, 0, 1));
    if (reveal <= 0.01) {
      continue;
    }
    const layerX = nodes[layerIndex][0].x;
    const barHeight = height - 16;
    ctx.fillStyle = `rgba(102, 220, 255, ${0.03 + reveal * 0.06})`;
    ctx.fillRect(layerX - 1, y + 8, 2, barHeight);
    ctx.fillStyle = `rgba(255, 241, 123, ${0.05 + reveal * 0.08})`;
    ctx.fillRect(layerX - 6, centerY - (barHeight * reveal) * 0.5, 12, barHeight * reveal);
  }

  const packetBudget = Math.min(10, flatNodes.length);
  for (let packetIndex = 0; packetIndex < packetBudget; packetIndex += 1) {
    const node = flatNodes[(Math.floor(time * 0.18) + packetIndex * 7) % flatNodes.length];
    const reveal = clamp(buildProgress * 1.28 - packetIndex * 0.06, 0, 1);
    if (reveal <= 0.02) {
      continue;
    }

    const orbitRadius = 16 + (packetIndex % 4) * 7;
    const startAngle = time * 0.06 + packetIndex * 0.9;
    const startX = centerX + Math.cos(startAngle) * orbitRadius;
    const startY = centerY + Math.sin(startAngle) * orbitRadius * 0.7;
    const packetT = smooth01(reveal);
    const packetX = lerp(startX, node.x, packetT);
    const packetY = lerp(startY, node.y, packetT);

    ctx.strokeStyle = packetIndex % 2 === 0
      ? `rgba(102, 220, 255, ${0.08 + reveal * 0.12})`
      : `rgba(255, 109, 179, ${0.06 + reveal * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(packetX, packetY);
    ctx.stroke();

    ctx.fillStyle = packetIndex % 2 === 0
      ? `rgba(102, 220, 255, ${0.22 + reveal * 0.24})`
      : `rgba(255, 109, 179, ${0.18 + reveal * 0.22})`;
    ctx.fillRect(Math.round(packetX) - 1, Math.round(packetY) - 1, 3, 3);
  }

  if (packageProgress > 0.01) {
    const braceInset = packageProgress * 18;
    ctx.strokeStyle = `rgba(255, 241, 123, ${0.16 + packageProgress * 0.26})`;
    ctx.strokeRect(x + braceInset, y + braceInset, width - braceInset * 2, height - braceInset * 2);
  }

  ctx.restore();
}

function drawExtinctionScene() {
  const scene = state.extinctionScene;
  if (!scene) {
    return;
  }

  const progress = clamp(scene.frame / scene.totalFrames, 0, 1);
  const sceneProgress = smooth01(progress);
  const overlayX = WIDTH * 0.045;
  const overlayY = HEIGHT * 0.04;
  const overlayW = WIDTH * 0.91;
  const overlayH = HEIGHT * 0.9;
  const chamberTop = overlayY + 108;
  const forgeW = 504;
  const forgeH = 236;
  const forgeX = overlayX + overlayW - forgeW - 28;
  const leftClusterX = overlayX + 28;
  const leftClusterW = forgeX - leftClusterX - 24;
  const specimenW = Math.max(220, Math.round(leftClusterW * 0.38));
  const specimenH = 208;
  const winnerW = Math.max(118, Math.round((leftClusterW - specimenW - 18) * 0.5));
  const winnerH = 93;
  const specimenX = leftClusterX;
  const specimenY = chamberTop + 4;
  const winnerX = specimenX + specimenW + 18;
  const winnerY = chamberTop + 20;
  const forgeY = chamberTop - 2;
  const specimenCenterX = specimenX + specimenW * 0.5;
  const winnerCenterX = winnerX + winnerW * 0.5;
  const forgeCenterX = forgeX + forgeW * 0.5;
  const cubeForgeBoxW = 96;
  const cubeForgeBoxH = 40;
  const cubeForgeBoxX = forgeCenterX - cubeForgeBoxW * 0.5;
  const cubeForgeBoxY = forgeY + forgeH - cubeForgeBoxH - 64;
  const cubeForgeBoxCenterX = cubeForgeBoxX + cubeForgeBoxW * 0.5;
  const cubeForgeBoxCenterY = cubeForgeBoxY + cubeForgeBoxH * 0.56;
  const scanFrames = scene.scanFrames;
  const outroFrames = scene.outroFrames;
  const generationFrame = Math.max(0, scene.frame - scanFrames);
  const generationFramesTotal = scene.generationFramesTotal;
  let activeIndex = -1;

  if (scene.plans.length > 0 && scene.frame >= scanFrames && generationFrame < generationFramesTotal) {
    for (let slotIndex = 0; slotIndex < scene.slotTimings.length; slotIndex += 1) {
      const slotTiming = scene.slotTimings[slotIndex];
      if (generationFrame >= slotTiming.startFrame && generationFrame < slotTiming.endFrame) {
        activeIndex = slotIndex;
        break;
      }
    }
  }

  const activePlanIndex = activeIndex >= 0 ? scene.generationOrder[activeIndex] : -1;
  const activePlan = activePlanIndex >= 0 ? scene.plans[activePlanIndex] : null;
  const activeSlotTiming = activeIndex >= 0 ? scene.slotTimings[activeIndex] : null;
  const activePlanState = activePlan
    ? getExtinctionPlanProgress(scene, activeSlotTiming, activePlan)
    : null;
  const mutationSequenceState = activePlan?.inherited
    ? getMutationSequenceState(activePlan.mutationSummary, activePlanState.mutationProgress)
    : null;
  const scanProgress = scene.sourceBrain ? smooth01(clamp(scene.frame / Math.max(1, scanFrames), 0, 1)) : 1;
  const sourceSpecimenPullProgress = scene.sourceSpecimen
    ? smooth01(clamp((scanProgress - 0.06) / 0.46, 0, 1))
    : 1;
  const sourceSpecimenCoilProgress = scene.sourceSpecimen
    ? smooth01(clamp((scanProgress - 0.14) / 0.36, 0, 1))
    : 1;
  const sourceSpecimenSettleProgress = scene.sourceSpecimen
    ? smooth01(clamp((scanProgress - 0.42) / 0.18, 0, 1))
    : 1;
  const specimenHeadScanProgress = scene.sourceBrain
    ? smooth01(clamp((scanProgress - 0.6) / 0.34, 0, 1))
    : 1;
  const winnerBrainActivation = scene.sourceBrain
    ? smooth01(clamp((scene.frame - scanFrames) / 28, 0, 1))
    : 1;
  const forgePulse = 0.5 + Math.sin(scene.frame * 0.065) * 0.5;
  const flashPulse = 0.5 + Math.sin(scene.frame * 0.11 + 1.4) * 0.5;
  const chamberFlux = activePlanState
    ? 0.44 +
      activePlanState.buildProgress * 0.26 +
      activePlanState.mutationProgress * 0.24 +
      activePlanState.transferProgress * 0.18 +
      activePlanState.implantProgress * 0.14
    : 0.16 + forgePulse * 0.12;
  const sweepX = overlayX + 54 + (overlayW - 108) * (0.5 + Math.sin(scene.frame * 0.018 - 1.2) * 0.5);
  const sweepY = overlayY + 48 + (overlayH - 96) * (0.5 + Math.sin(scene.frame * 0.015 + 0.9) * 0.5);
  const containmentBoxW = Math.min(104, specimenW - 72);
  const containmentBoxH = 62;
  const containmentBoxX = specimenCenterX - containmentBoxW * 0.5;
  const containmentBoxY = specimenY + specimenH - containmentBoxH - 28;
  const sourceSpecimenTargetX = containmentBoxX + containmentBoxW * 0.5;
  const sourceSpecimenTargetY = containmentBoxY + containmentBoxH * 0.5 + 2;
  const sourceSpecimenX = scene.sourceSpecimen
    ? lerp(scene.sourceSpecimen.x, sourceSpecimenTargetX, sourceSpecimenPullProgress)
    : sourceSpecimenTargetX;
  const sourceSpecimenY = scene.sourceSpecimen
    ? lerp(scene.sourceSpecimen.y, sourceSpecimenTargetY, sourceSpecimenPullProgress)
    : sourceSpecimenTargetY;
  const sourceSpecimenHeading = scene.sourceSpecimen
    ? scene.sourceSpecimen.heading
    : -0.18;
  const sourceSpecimenScale = lerp(1, 0.72, sourceSpecimenPullProgress) * (1 - sourceSpecimenSettleProgress * 0.03);
  const sourceSpecimenAlpha = 0.92 - sourceSpecimenSettleProgress * 0.24;
  const sourceSpecimenCurl =
    (0.22 + sourceSpecimenPullProgress * 0.82) +
    sourceSpecimenCoilProgress * 4.2 +
    (0.14 + flashPulse * 0.12) * sourceSpecimenSettleProgress;
  const sourceSpecimenHeadX = sourceSpecimenX + Math.cos(sourceSpecimenHeading) * 6 * sourceSpecimenScale;
  const sourceSpecimenHeadY = sourceSpecimenY + Math.sin(sourceSpecimenHeading) * 6 * sourceSpecimenScale;
  const phaseLabel = scene.sourceBrain && scene.frame < scanFrames
    ? sourceSpecimenPullProgress < 0.995
      ? "CAPTURING LONGEST-LIVED SPECIMEN"
      : "SCANNING LONGEST-LIVED BRAIN"
    : activePlan
      ? `FORGING BRAIN ${String(activeIndex + 1).padStart(2, "0")} / ${String(scene.plans.length).padStart(2, "0")}`
      : "NEXT LINEAGE READY";
  let detailLabel = "ALL EGGS IMPRINTED";
  if (scene.sourceBrain && scene.frame < scanFrames) {
    detailLabel = sourceSpecimenPullProgress < 0.995
      ? "SPECIMEN TRANSFER // CONTAINMENT LOCK"
      : specimenHeadScanProgress < 0.995
        ? "SPECIMEN HEAD SCAN // WINNER MATRIX LOCKED"
        : "SCAN LOCKED // WINNER MATRIX READY";
  } else if (activePlan) {
    if (activePlanState?.packageActive) {
      detailLabel = activePlan.inherited
        ? "GROWING DATA CUBE FOR HANDOFF"
        : "PACKAGING BRAIN INTO DATA CUBE";
    } else if (activePlanState?.cubeTravelActive) {
      detailLabel = "DATA CUBE TRANSFER TO EGG";
    } else if (activePlanState?.buildHoldActive || activePlanState?.mutationPauseActive) {
      detailLabel = activePlan.inherited
        ? "LEGACY STITCH MAP HOLD // PHASE LOCK"
        : "FAST SYNTHESIS STABILIZING";
    } else if (activePlanState?.previewActive) {
      detailLabel = activePlan.inherited
        ? "DESCENDANT NEURAL MAP LOCKED // PRE-IMPLANT HOLD"
        : "SYNTHESIS PATTERN LOCKED // PRE-IMPLANT HOLD";
    } else {
      detailLabel = activePlan.inherited
        ? "LEGACY STITCH MAP // SEQUENTIAL MUTATION DRAW"
        : "RANDOM BRAIN SYNTHESIS";
    }
  }

  worldCtx.save();
  const overlayGradient = worldCtx.createLinearGradient(overlayX, overlayY, overlayX, overlayY + overlayH);
  overlayGradient.addColorStop(0, "rgba(2, 11, 22, 0.92)");
  overlayGradient.addColorStop(0.45, "rgba(3, 13, 25, 0.86)");
  overlayGradient.addColorStop(1, "rgba(2, 8, 16, 0.92)");
  worldCtx.fillStyle = overlayGradient;
  worldCtx.fillRect(overlayX, overlayY, overlayW, overlayH);
  worldCtx.globalCompositeOperation = "lighter";
  const verticalSweep = worldCtx.createLinearGradient(sweepX - 34, overlayY, sweepX + 34, overlayY);
  verticalSweep.addColorStop(0, "rgba(0, 0, 0, 0)");
  verticalSweep.addColorStop(0.45, `rgba(102, 220, 255, ${0.022 + forgePulse * 0.026})`);
  verticalSweep.addColorStop(0.5, `rgba(255, 241, 123, ${0.036 + flashPulse * 0.03})`);
  verticalSweep.addColorStop(0.55, `rgba(102, 220, 255, ${0.022 + forgePulse * 0.026})`);
  verticalSweep.addColorStop(1, "rgba(0, 0, 0, 0)");
  worldCtx.fillStyle = verticalSweep;
  worldCtx.fillRect(sweepX - 34, overlayY + 8, 68, overlayH - 16);
  const horizontalSweep = worldCtx.createLinearGradient(overlayX, sweepY - 44, overlayX, sweepY + 44);
  horizontalSweep.addColorStop(0, "rgba(0, 0, 0, 0)");
  horizontalSweep.addColorStop(0.45, `rgba(74, 255, 212, ${0.026 + forgePulse * 0.026})`);
  horizontalSweep.addColorStop(0.5, `rgba(255, 109, 179, ${0.026 + flashPulse * 0.03})`);
  horizontalSweep.addColorStop(0.55, `rgba(74, 255, 212, ${0.026 + forgePulse * 0.026})`);
  horizontalSweep.addColorStop(1, "rgba(0, 0, 0, 0)");
  worldCtx.fillStyle = horizontalSweep;
  worldCtx.fillRect(overlayX + 8, sweepY - 44, overlayW - 16, 88);
  worldCtx.globalCompositeOperation = "source-over";
  worldCtx.shadowBlur = 10 + forgePulse * 8;
  worldCtx.shadowColor = `rgba(102, 220, 255, ${0.14 + forgePulse * 0.16})`;
  worldCtx.strokeStyle = "rgba(102, 220, 255, 0.28)";
  worldCtx.lineWidth = 2;
  worldCtx.strokeRect(overlayX, overlayY, overlayW, overlayH);
  worldCtx.shadowBlur = 0;

  const bracketSize = 18;
  worldCtx.fillStyle = `rgba(102, 220, 255, ${0.26 + forgePulse * 0.12})`;
  worldCtx.fillRect(overlayX + 8, overlayY + 8, bracketSize, 2);
  worldCtx.fillRect(overlayX + 8, overlayY + 8, 2, bracketSize);
  worldCtx.fillRect(overlayX + overlayW - bracketSize - 8, overlayY + 8, bracketSize, 2);
  worldCtx.fillRect(overlayX + overlayW - 10, overlayY + 8, 2, bracketSize);
  worldCtx.fillRect(overlayX + 8, overlayY + overlayH - 10, bracketSize, 2);
  worldCtx.fillRect(overlayX + 8, overlayY + overlayH - bracketSize - 8, 2, bracketSize);
  worldCtx.fillRect(overlayX + overlayW - bracketSize - 8, overlayY + overlayH - 10, bracketSize, 2);
  worldCtx.fillRect(overlayX + overlayW - 10, overlayY + overlayH - bracketSize - 8, 2, bracketSize);

  for (let y = overlayY + 8; y < overlayY + overlayH; y += 14) {
    worldCtx.fillStyle = y % 28 === 0 ? "rgba(102, 220, 255, 0.03)" : "rgba(102, 220, 255, 0.014)";
    worldCtx.fillRect(overlayX + 4, y, overlayW - 8, 1);
  }

  worldCtx.fillStyle = `rgba(74, 255, 212, ${0.08 + sceneProgress * 0.1})`;
  worldCtx.fillRect(overlayX + 22, overlayY + 74, (overlayW - 44) * sceneProgress, 3);
  worldCtx.fillStyle = "#ddfaff";
  worldCtx.font = CANVAS_FONTS.title;
  worldCtx.shadowBlur = 5 + forgePulse * 6;
  worldCtx.shadowColor = `rgba(102, 220, 255, ${0.14 + forgePulse * 0.18})`;
  worldCtx.fillText("EXTINCTION GENE FOUNDRY", overlayX + 22, overlayY + 28);
  worldCtx.shadowBlur = 0;
  worldCtx.font = CANVAS_FONTS.section;
  worldCtx.fillStyle = `rgba(139, 191, 202, ${0.82 + forgePulse * 0.16})`;
  worldCtx.fillText(phaseLabel, overlayX + 22, overlayY + 48);
  worldCtx.fillText(detailLabel, overlayX + 22, overlayY + 64);
  worldCtx.fillText(
    `INHERITED ${String(scene.inheritedSeeds).padStart(2, "0")} // RANDOM ${String(scene.randomSeeds).padStart(2, "0")}`,
    overlayX + 22,
    overlayY + 82
  );

  if (scene.sourceBrain) {
    const specimenGradient = worldCtx.createLinearGradient(
      specimenX,
      specimenY - 16,
      specimenX,
      specimenY + specimenH + 16
    );
    specimenGradient.addColorStop(0, `rgba(12, 24, 36, ${0.9 + forgePulse * 0.02})`);
    specimenGradient.addColorStop(1, `rgba(6, 14, 22, ${0.9 + forgePulse * 0.02})`);
    worldCtx.fillStyle = specimenGradient;
    worldCtx.fillRect(specimenX - 14, specimenY - 16, specimenW + 28, specimenH + 32);
    worldCtx.fillStyle = `rgba(102, 220, 255, ${0.04 + scanProgress * 0.06 + forgePulse * 0.03})`;
    worldCtx.fillRect(specimenX - 14, specimenY - 16, specimenW + 28, specimenH + 32);
    worldCtx.shadowBlur = 5 + scanProgress * 4;
    worldCtx.shadowColor = `rgba(102, 220, 255, ${0.16 + scanProgress * 0.18})`;
    worldCtx.strokeStyle = "rgba(102, 220, 255, 0.3)";
    worldCtx.strokeRect(specimenX - 10, specimenY - 12, specimenW + 20, specimenH + 24);
    worldCtx.shadowBlur = 0;
    worldCtx.fillStyle = "#8ed7ff";
    worldCtx.font = CANVAS_FONTS.section;
    worldCtx.textAlign = "center";
    worldCtx.fillText("SPECIMEN LOCK", specimenCenterX, specimenY - 18);
    worldCtx.textAlign = "left";

    const winnerGradient = worldCtx.createLinearGradient(
      winnerX,
      winnerY - 16,
      winnerX,
      winnerY + winnerH + 16
    );
    winnerGradient.addColorStop(0, `rgba(14, 24, 34, ${0.88 + winnerBrainActivation * 0.03})`);
    winnerGradient.addColorStop(1, `rgba(7, 15, 23, ${0.88 + winnerBrainActivation * 0.03})`);
    worldCtx.fillStyle = winnerGradient;
    worldCtx.fillRect(winnerX - 14, winnerY - 16, winnerW + 28, winnerH + 32);
    worldCtx.fillStyle = `rgba(255, 241, 123, ${0.02 + winnerBrainActivation * 0.08 + forgePulse * 0.02})`;
    worldCtx.fillRect(winnerX - 14, winnerY - 16, winnerW + 28, winnerH + 32);
    worldCtx.shadowBlur = 4 + winnerBrainActivation * 5;
    worldCtx.shadowColor = `rgba(255, 241, 123, ${0.08 + winnerBrainActivation * 0.2})`;
    worldCtx.strokeStyle = `rgba(255, 241, 123, ${0.12 + winnerBrainActivation * 0.28})`;
    worldCtx.strokeRect(winnerX - 10, winnerY - 12, winnerW + 20, winnerH + 24);
    worldCtx.shadowBlur = 0;
    worldCtx.fillStyle = "#fff17b";
    worldCtx.font = CANVAS_FONTS.section;
    worldCtx.textAlign = "center";
    worldCtx.fillText(`WINNER BRAIN G${scene.sourceGeneration}`, winnerCenterX, winnerY - 18);
    worldCtx.fillStyle = winnerBrainActivation > 0.98
      ? "rgba(255, 241, 123, 0.78)"
      : "rgba(139, 191, 202, 0.76)";
    worldCtx.fillText(
      winnerBrainActivation > 0.98 ? "SCAN LOCKED // BRAIN ACTIVE" : "AWAITING SPECIMEN SCAN",
      winnerCenterX,
      winnerY + winnerH + 18
    );
    worldCtx.textAlign = "left";

    if (scene.sourceSpecimen) {
      const beamAlpha = 0.08 + sourceSpecimenPullProgress * 0.24;
      const beamStartX = containmentBoxX + containmentBoxW * 0.5;
      const beamStartY = containmentBoxY + containmentBoxH * 0.5;

      worldCtx.save();
      worldCtx.globalCompositeOperation = "lighter";
      worldCtx.strokeStyle = `rgba(255, 241, 123, ${beamAlpha})`;
      worldCtx.lineWidth = 1.1 + sourceSpecimenPullProgress * 1.1;
      worldCtx.beginPath();
      worldCtx.moveTo(beamStartX, beamStartY);
      worldCtx.lineTo(sourceSpecimenX, sourceSpecimenY);
      worldCtx.stroke();

      if (sourceSpecimenPullProgress < 0.12) {
        const lockSize = 18 + flashPulse * 2;
        worldCtx.strokeStyle = `rgba(102, 220, 255, ${0.18 + (1 - sourceSpecimenPullProgress) * 0.24})`;
        worldCtx.strokeRect(
          Math.round(scene.sourceSpecimen.x - lockSize * 0.5),
          Math.round(scene.sourceSpecimen.y - lockSize * 0.5),
          Math.round(lockSize),
          Math.round(lockSize)
        );
      }

      for (let packet = 0; packet < 2; packet += 1) {
        const packetT = clamp(sourceSpecimenPullProgress - packet * 0.18, 0, 1);
        const packetX = lerp(scene.sourceSpecimen.x, beamStartX, packetT);
        const packetY = lerp(scene.sourceSpecimen.y, beamStartY, packetT);
        worldCtx.fillStyle = `rgba(255, 241, 123, ${0.16 + sourceSpecimenPullProgress * 0.2})`;
        worldCtx.fillRect(Math.round(packetX) - 1, Math.round(packetY) - 1, 3, 3);
      }
      worldCtx.restore();
    }

    drawContainmentCell(
      worldCtx,
      containmentBoxX,
      containmentBoxY,
      containmentBoxW,
      containmentBoxH,
      sourceSpecimenPullProgress,
      flashPulse
    );

    worldCtx.font = CANVAS_FONTS.small;
    worldCtx.fillStyle = `rgba(221, 250, 255, ${0.6 + sourceSpecimenPullProgress * 0.16})`;
    worldCtx.textAlign = "center";
    worldCtx.fillText("HOLLOW CONTAINMENT CELL", specimenCenterX, containmentBoxY - 8);
    worldCtx.textAlign = "left";

    worldCtx.fillStyle = `rgba(102, 220, 255, ${0.08 + scanProgress * 0.08})`;
    worldCtx.fillRect(containmentBoxX - 8, containmentBoxY + containmentBoxH + 8, containmentBoxW + 16, 6);
    worldCtx.fillStyle = `rgba(255, 241, 123, ${0.05 + sourceSpecimenSettleProgress * 0.08})`;
    worldCtx.fillRect(containmentBoxX, containmentBoxY + containmentBoxH + 11, containmentBoxW, 1);

    if (scene.sourceSpecimen) {
      drawExtinctionSpecimen(
        worldCtx,
        scene.sourceSpecimen,
        sourceSpecimenX,
        sourceSpecimenY,
        sourceSpecimenScale,
        sourceSpecimenHeading,
        sourceSpecimenAlpha,
        sourceSpecimenCurl,
        sourceSpecimenCoilProgress
      );
    }

    drawSpecimenHeadScanPanel(
      worldCtx,
      scene.sourceSpecimen,
      scene.sourceBrain,
      specimenX,
      specimenY,
      specimenW,
      specimenH,
      specimenHeadScanProgress,
      scene.frame,
      sourceSpecimenHeadX,
      sourceSpecimenHeadY
    );

    drawBrainBlueprint(worldCtx, scene.sourceBrain, winnerX, winnerY, winnerW, winnerH, {
      alpha: 0.18 + winnerBrainActivation * 0.5,
      fluxAmount: winnerBrainActivation * (0.12 + flashPulse * 0.05),
      fluxPacketBudget: Math.round(8 * winnerBrainActivation),
      nodePulseBudget: Math.round(4 * winnerBrainActivation),
      fluxSpeedScale: 0.22,
      fluxSelectorSpeed: 0.12,
      nodePulseSpeed: 0.06,
      nodePulseSelectorSpeed: 0.14,
      fluxPhase: 0.07,
      time: scene.frame
    });

    if (winnerBrainActivation < 0.99) {
      worldCtx.fillStyle = "rgba(4, 12, 20, 0.44)";
      worldCtx.fillRect(winnerX, winnerY, winnerW, winnerH);
      worldCtx.font = CANVAS_FONTS.body;
      worldCtx.fillStyle = "rgba(221, 250, 255, 0.68)";
      worldCtx.textAlign = "center";
      worldCtx.fillText("NEURAL MAP HELD STATIC", winnerCenterX, winnerY + winnerH * 0.48);
      worldCtx.textAlign = "left";
    }
  }

  const forgeGradient = worldCtx.createLinearGradient(forgeX, forgeY - 18, forgeX, forgeY + forgeH + 18);
  forgeGradient.addColorStop(0, "rgba(10, 20, 32, 0.92)");
  forgeGradient.addColorStop(1, "rgba(6, 14, 24, 0.9)");
  worldCtx.fillStyle = forgeGradient;
  worldCtx.fillRect(forgeX - 14, forgeY - 18, forgeW + 28, forgeH + 36);
  worldCtx.shadowBlur = 5 + (activePlan ? activePlanState.buildProgress * 5 : forgePulse * 3);
  worldCtx.shadowColor = activePlan
    ? activePlan.inherited
      ? `rgba(255, 241, 123, ${0.14 + activePlanState.buildProgress * 0.22})`
      : `rgba(102, 220, 255, ${0.12 + activePlanState.buildProgress * 0.22})`
    : `rgba(102, 220, 255, ${0.08 + forgePulse * 0.1})`;
  worldCtx.strokeStyle = activePlan
    ? activePlan.inherited
      ? `rgba(255, 241, 123, ${0.18 + activePlanState.buildProgress * 0.36})`
      : `rgba(102, 220, 255, ${0.18 + activePlanState.buildProgress * 0.3})`
    : "rgba(102, 220, 255, 0.18)";
  worldCtx.lineWidth = 2;
  worldCtx.strokeRect(forgeX - 10, forgeY - 14, forgeW + 20, forgeH + 28);
  worldCtx.shadowBlur = 0;
  worldCtx.fillStyle = `rgba(102, 220, 255, ${0.08 + forgePulse * 0.08})`;
  worldCtx.fillRect(forgeX - 8, forgeY - 12, forgeW + 16, 4);
  worldCtx.font = CANVAS_FONTS.section;
  worldCtx.fillStyle = activePlan
    ? activePlan.inherited
      ? "#fff17b"
      : "#8ed7ff"
    : "#8bbfca";
  worldCtx.textAlign = "center";
  worldCtx.fillText(
    activePlan ? "SYNTHESIS CHAMBER ACTIVE" : "SYNTHESIS CHAMBER STANDBY",
    forgeCenterX,
    forgeY - 24
  );
  worldCtx.textAlign = "left";

  if (activePlan) {
    const forgeBoxAccent = activePlan.inherited ? "255, 241, 123" : "102, 220, 255";
    const forgeBoxCharge = clamp(
      activePlanState.buildProgress * 0.22 +
      activePlanState.packageProgress * 0.76 +
      activePlanState.transferProgress * 0.56 +
      activePlanState.implantProgress * 0.28,
      0,
      1
    );
    drawCubeSynthesisBox(
      worldCtx,
      cubeForgeBoxX,
      cubeForgeBoxY,
      cubeForgeBoxW,
      cubeForgeBoxH,
      forgeBoxAccent,
      forgeBoxCharge,
      flashPulse,
      scene.frame
    );

    const mutationCubeGrowth = activePlanState.cubeGrowthProgress;
    if (
      mutationCubeGrowth > 0.01 &&
      activePlanState.packageProgress <= 0.01 &&
      activePlanState.cubeTravelProgress <= 0.01 &&
      activePlanState.implantProgress <= 0.01
    ) {
      const cubeLift = (1 - mutationCubeGrowth) * 4 + Math.sin(scene.frame * 0.14 + activePlanIndex * 0.8) * 1.4;
      const cubePulse = 0.5 + Math.sin(scene.frame * 0.16 + mutationCubeGrowth * 2.2) * 0.5;
      drawBrainDataCube(
        worldCtx,
        cubeForgeBoxCenterX,
        cubeForgeBoxCenterY - cubeLift,
        forgeBoxAccent,
        0.2 + mutationCubeGrowth * 0.42,
        0.22 + mutationCubeGrowth * 0.74,
        cubePulse,
        {
          time: scene.frame,
          halo: 0.04 + mutationCubeGrowth * 0.26,
          shell: 0.04 + mutationCubeGrowth * 0.24,
          orbit: mutationCubeGrowth * 0.08
        }
      );
    }

    if (activePlan.inherited && scene.sourceBrain && activePlanState.buildProgress > 0) {
      const linkStartX = winnerX + winnerW + 14;
      const linkStartY = winnerY + winnerH * 0.48;
      const linkEndX = forgeX - 18;
      const linkEndY = forgeY + forgeH * 0.34;
      const linkControlX = lerp(linkStartX, linkEndX, 0.54);
      const linkControlY = Math.min(linkStartY, linkEndY) - 28;

      worldCtx.save();
      worldCtx.globalCompositeOperation = "lighter";
      worldCtx.strokeStyle = `rgba(255, 241, 123, ${0.12 + activePlanState.buildProgress * 0.34})`;
      worldCtx.lineWidth = 1 + activePlanState.buildProgress * 1.4;
      worldCtx.setLineDash([5, 4]);
      worldCtx.beginPath();
      worldCtx.moveTo(linkStartX, linkStartY);
      worldCtx.quadraticCurveTo(linkControlX, linkControlY, linkEndX, linkEndY);
      worldCtx.stroke();
      worldCtx.setLineDash([]);

      for (let packet = 0; packet < 4; packet += 1) {
        const packetT = clamp(activePlanState.buildProgress * 1.12 - packet * 0.17, 0, 1);
        const packetX =
          (1 - packetT) * (1 - packetT) * linkStartX +
          2 * (1 - packetT) * packetT * linkControlX +
          packetT * packetT * linkEndX;
        const packetY =
          (1 - packetT) * (1 - packetT) * linkStartY +
          2 * (1 - packetT) * packetT * linkControlY +
          packetT * packetT * linkEndY;
        worldCtx.fillStyle = `rgba(255, 241, 123, ${0.22 + activePlanState.buildProgress * 0.32})`;
        worldCtx.fillRect(Math.round(packetX) - 2, Math.round(packetY) - 2, 4, 4);
      }
      worldCtx.restore();
    }

    worldCtx.save();
    worldCtx.globalCompositeOperation = "lighter";
    const laneCount = 5;
    for (let lane = 0; lane < laneCount; lane += 1) {
      const laneT = laneCount === 1 ? 0.5 : lane / (laneCount - 1);
      const laneX = forgeX + 40 + (forgeW - 80) * laneT + Math.sin(scene.frame * 0.03 + lane * 0.8) * 1.4;
      const streamY = forgeY + 18 + ((scene.frame * (0.48 + lane * 0.025) + lane * 20) % (forgeH - 34));
      worldCtx.fillStyle = lane % 2 === 0
        ? `rgba(74, 255, 212, ${0.04 + chamberFlux * 0.08})`
        : `rgba(255, 109, 179, ${0.04 + chamberFlux * 0.07})`;
      worldCtx.fillRect(Math.round(laneX), Math.round(streamY), 2, 6);
      worldCtx.fillRect(Math.round(laneX) - 1, Math.round(streamY) + 2, 4, 1);
    }
    worldCtx.restore();

    if (activePlan.inherited && scene.sourceBrain) {
      const stitchSourceW = 144;
      const stitchTargetW = 188;
      const stitchH = 106;
      const stitchSourceX = forgeX + 26;
      const stitchTargetX = forgeX + forgeW - stitchTargetW - 26;
      const stitchY = forgeY + 34;
      const ledgerTop = forgeY + forgeH - 64;

      worldCtx.font = CANVAS_FONTS.body;
      worldCtx.textAlign = "center";
      worldCtx.fillStyle = "rgba(255, 241, 123, 0.84)";
      worldCtx.fillText("SOURCE", stitchSourceX + stitchSourceW * 0.5, stitchY - 8);
      worldCtx.fillStyle = "rgba(157, 231, 255, 0.86)";
      worldCtx.fillText("DESCENDANT", stitchTargetX + stitchTargetW * 0.5, stitchY - 8);
      worldCtx.textAlign = "left";

      drawBrainBlueprint(worldCtx, scene.sourceBrain, stitchSourceX, stitchY, stitchSourceW, stitchH, {
        alpha: 0.44 + activePlanState.mutationProgress * 0.24,
        fluxAmount: 0.1 + chamberFlux * 0.12,
        fluxPacketBudget: 5,
        nodePulseBudget: 3,
        fluxSpeedScale: 0.24,
        fluxSelectorSpeed: 0.13,
        nodePulseSpeed: 0.06,
        nodePulseSelectorSpeed: 0.15,
        fluxPhase: 0.04,
        time: scene.frame
      });

      drawBrainBlueprint(worldCtx, activePlan.brain, stitchTargetX, stitchY, stitchTargetW, stitchH, {
        alpha: 0.28 + activePlanState.buildProgress * 0.72,
        baseBrain: scene.sourceBrain,
        mix: 1,
        mutationSummary: activePlan.mutationSummary,
        mutationGlow: 0,
        mutationSequenceState,
        fluxAmount: chamberFlux * 0.52,
        fluxPacketBudget: 7,
        nodePulseBudget: 4,
        fluxSpeedScale: 0.26,
        fluxSelectorSpeed: 0.14,
        nodePulseSpeed: 0.07,
        nodePulseSelectorSpeed: 0.16,
        fluxPhase: activePlanIndex * 0.17,
        time: scene.frame
      });

      drawBrainStitching(
        worldCtx,
        activePlan.mutationSummary,
        stitchSourceX,
        stitchY,
        stitchSourceW,
        stitchH,
        stitchTargetX,
        stitchY,
        stitchTargetW,
        stitchH,
        activePlanState.mutationProgress * (0.7 + flashPulse * 0.3),
        scene.frame,
        mutationSequenceState
      );

      drawMutationTelemetry(
        worldCtx,
        activePlan.mutationSummary,
        forgeCenterX,
        forgeY - 38,
        activePlanState.mutationProgress * (0.74 + flashPulse * 0.26)
      );

      drawBrainStitchLedger(
        worldCtx,
        activePlan.mutationSummary,
        forgeCenterX,
        ledgerTop,
        forgeW - 20,
        activePlanState.mutationProgress * (0.76 + flashPulse * 0.24),
        mutationSequenceState
      );
    } else {
      drawRandomBrainGenesis(
        worldCtx,
        activePlan.brain,
        forgeX + 18,
        forgeY + 14,
        forgeW - 36,
        forgeH - 28,
        activePlanState.buildProgress,
        activePlanState.packageProgress,
        scene.frame
      );

      drawBrainBlueprint(worldCtx, activePlan.brain, forgeX + 18, forgeY + 14, forgeW - 36, forgeH - 28, {
        alpha: 0.1 + activePlanState.buildProgress * 0.76,
        baseBrain: null,
        mix: clamp(activePlanState.buildProgress * 1.16, 0, 1),
        mutationSummary: null,
        mutationGlow: 0,
        fluxAmount: chamberFlux * 0.5,
        fluxPacketBudget: 8,
        nodePulseBudget: 5,
        fluxSpeedScale: 0.3,
        fluxSelectorSpeed: 0.16,
        nodePulseSpeed: 0.08,
        nodePulseSelectorSpeed: 0.18,
        fluxPhase: activePlanIndex * 0.17 + 0.33,
        time: scene.frame
      });
    }

    worldCtx.save();
    worldCtx.globalCompositeOperation = "lighter";
    for (let spark = 0; spark < 5; spark += 1) {
      const angle = scene.frame * 0.045 + spark * (TAU / 5);
      const radius = 26 + activePlanState.buildProgress * 10 + (spark % 3) * 4;
      const sparkX = forgeCenterX + Math.cos(angle) * radius;
      const sparkY = forgeY + forgeH * 0.45 + Math.sin(angle) * (12 + activePlanState.buildProgress * 6);
      worldCtx.fillStyle = spark % 2 === 0
        ? `rgba(255, 109, 179, ${0.08 + activePlanState.buildProgress * 0.1 + flashPulse * 0.03})`
        : `rgba(74, 255, 212, ${0.08 + activePlanState.buildProgress * 0.1 + forgePulse * 0.03})`;
      worldCtx.fillRect(Math.round(sparkX) - 1, Math.round(sparkY) - 1, 2, 2);
    }
    worldCtx.restore();
  } else {
    worldCtx.font = CANVAS_FONTS.section;
    worldCtx.fillStyle = "#8bbfca";
    worldCtx.textAlign = "center";
    worldCtx.fillText(
      scene.frame < scanFrames ? "SCAN LOCK IN PROGRESS" : "NEXT LINEAGE BUFFERED",
      forgeCenterX,
      forgeY + forgeH * 0.5
    );
    worldCtx.textAlign = "left";
  }

  for (let i = 0; i < scene.plans.length; i += 1) {
    const plan = scene.plans[i];
    const position = plan.position;
    const generationSlot = scene.generationSlotByPlanIndex[i];
    const slotTiming = scene.slotTimings[generationSlot];
    const planState = getExtinctionPlanProgress(scene, slotTiming, plan);
    const isActive = generationSlot === activeIndex;
    drawIncubationEgg(
      worldCtx,
      plan,
      planState,
      position.x,
      position.y,
      isActive,
      flashPulse,
      String(generationSlot + 1).padStart(2, "0")
    );

    if (isActive && (planState.packageProgress > 0 || planState.cubeTravelProgress > 0 || planState.implantProgress > 0)) {
      const beamStartX = cubeForgeBoxCenterX;
      const beamStartY = cubeForgeBoxCenterY;
      const beamTargetX = position.x;
      const beamTargetY = position.y + 16;
      const accent = plan.inherited ? "255, 241, 123" : "102, 220, 255";
      const packagePulse = 0.5 + Math.sin(scene.frame * 0.14 + generationSlot * 0.8) * 0.5;
      const beamDx = beamTargetX - beamStartX;
      const beamDy = beamTargetY - beamStartY;
      const beamDistance = Math.max(1, Math.hypot(beamDx, beamDy));
      const beamNormalX = -beamDy / beamDistance;
      const beamNormalY = beamDx / beamDistance;
      const beamArc = (plan.inherited ? 1 : -1) * (10 + planState.transferProgress * 22 + flashPulse * 8);
      const beamControlX = lerp(beamStartX, beamTargetX, 0.5) + beamNormalX * beamArc;
      const beamControlY = lerp(beamStartY, beamTargetY, 0.5) + beamNormalY * beamArc;
      const cubeX = planState.cubeTravelProgress > 0
        ? quadraticPoint(beamStartX, beamControlX, beamTargetX, planState.cubeTravelProgress)
        : beamStartX;
      const cubeY = planState.cubeTravelProgress > 0
        ? quadraticPoint(beamStartY, beamControlY, beamTargetY, planState.cubeTravelProgress)
        : beamStartY;

      worldCtx.save();
      worldCtx.globalCompositeOperation = "lighter";
      if (planState.cubeTravelProgress > 0 || planState.implantProgress > 0) {
        worldCtx.strokeStyle = `rgba(${accent}, ${0.12 + planState.transferProgress * 0.14})`;
        worldCtx.lineWidth = 3 + planState.transferProgress * 4;
        worldCtx.shadowBlur = 14 + planState.transferProgress * 18;
        worldCtx.shadowColor = `rgba(${accent}, ${0.18 + planState.transferProgress * 0.32})`;
        worldCtx.beginPath();
        worldCtx.moveTo(beamStartX, beamStartY);
        worldCtx.quadraticCurveTo(beamControlX, beamControlY, beamTargetX, beamTargetY);
        worldCtx.stroke();
        worldCtx.shadowBlur = 0;

        worldCtx.strokeStyle = `rgba(255, 241, 123, ${0.18 + planState.transferProgress * 0.28})`;
        worldCtx.lineWidth = 1.1 + planState.transferProgress * 1.2;
        worldCtx.beginPath();
        worldCtx.moveTo(beamStartX, beamStartY);
        worldCtx.quadraticCurveTo(beamControlX, beamControlY, beamTargetX, beamTargetY);
        worldCtx.stroke();

        for (let tailIndex = 0; tailIndex < 4; tailIndex += 1) {
          const packetT = clamp(planState.cubeTravelProgress - tailIndex * 0.1, 0, 1);
          if (packetT <= 0) {
            continue;
          }
          const packetX = quadraticPoint(beamStartX, beamControlX, beamTargetX, packetT);
          const packetY = quadraticPoint(beamStartY, beamControlY, beamTargetY, packetT);
          const packetSize = Math.max(2, 5 - tailIndex);
          worldCtx.fillStyle = tailIndex === 0
            ? `rgba(255, 241, 123, ${0.26 + planState.transferProgress * 0.3})`
            : `rgba(${accent}, ${0.12 + planState.transferProgress * (0.22 - tailIndex * 0.03)})`;
          worldCtx.fillRect(
            Math.round(packetX) - packetSize * 0.5,
            Math.round(packetY) - packetSize * 0.5,
            packetSize,
            packetSize
          );
        }
      }

      if (planState.packageProgress > 0 && planState.cubeTravelProgress <= 0.01) {
        const braceSize = plan.inherited
          ? 34 - planState.packageProgress * 16
          : 28 - planState.packageProgress * 10;
        const cubeIntensity = plan.inherited
          ? 0.24 + planState.packageProgress * 0.78
          : 0.54 + planState.packageProgress * 0.48;
        const cubeScale = plan.inherited
          ? 0.42 + planState.packageProgress * 1.26
          : 1.02 + planState.packageProgress * 0.82;
        worldCtx.strokeStyle = `rgba(${accent}, ${0.16 + planState.packageProgress * 0.26})`;
        worldCtx.lineWidth = 1;
        worldCtx.strokeRect(
          beamStartX - braceSize * 0.5,
          beamStartY - braceSize * 0.5,
          braceSize,
          braceSize
        );
        worldCtx.strokeStyle = `rgba(255, 241, 123, ${0.16 + planState.packageProgress * 0.26})`;
        worldCtx.strokeRect(
          beamStartX - braceSize * 0.5 - 6,
          beamStartY - braceSize * 0.5 - 6,
          braceSize + 12,
          braceSize + 12
        );
        drawBrainDataCube(
          worldCtx,
          beamStartX,
          beamStartY,
          accent,
          cubeIntensity,
          cubeScale,
          packagePulse,
          {
            time: scene.frame,
            halo: plan.inherited
              ? 0.08 + planState.packageProgress * 0.92
              : 0.28 + planState.packageProgress * 0.72,
            shell: plan.inherited
              ? 0.1 + planState.packageProgress * 0.9
              : 0.22 + planState.packageProgress * 0.78,
            orbit: plan.inherited
              ? 0.06 + planState.packageProgress * 0.64
              : 0.16 + planState.packageProgress * 0.54
          }
        );
      }

      if (planState.cubeTravelProgress > 0) {
        for (let echoIndex = 2; echoIndex >= 1; echoIndex -= 1) {
          const echoT = clamp(planState.cubeTravelProgress - echoIndex * 0.08, 0, 1);
          if (echoT <= 0) {
            continue;
          }
          const echoX = quadraticPoint(beamStartX, beamControlX, beamTargetX, echoT);
          const echoY = quadraticPoint(beamStartY, beamControlY, beamTargetY, echoT);
          worldCtx.save();
          worldCtx.globalAlpha = 0.18 + planState.transferProgress * 0.08 - echoIndex * 0.04;
          drawBrainDataCube(
            worldCtx,
            echoX,
            echoY,
            accent,
            0.28 + planState.transferProgress * 0.16,
            0.96 + planState.transferProgress * 0.26 - echoIndex * 0.08,
            packagePulse,
            {
              time: scene.frame,
              halo: 0.08 + planState.transferProgress * 0.18,
              shell: 0.04 + planState.transferProgress * 0.14,
              orbit: 0
            }
          );
          worldCtx.restore();
        }
        drawBrainDataCube(
          worldCtx,
          cubeX,
          cubeY,
          accent,
          0.72 + planState.transferProgress * 0.46,
          1.42 + planState.transferProgress * 0.88,
          packagePulse,
          {
            time: scene.frame,
            halo: 0.54 + planState.transferProgress * 0.68,
            shell: 0.48 + planState.transferProgress * 0.58,
            orbit: 0.38 + planState.transferProgress * 0.56
          }
        );
      }

      if (planState.implantProgress > 0) {
        const implantPulse = 1 - planState.implantProgress;
        worldCtx.strokeStyle = `rgba(255, 241, 123, ${0.18 + implantPulse * 0.28})`;
        worldCtx.lineWidth = 1.6;
        worldCtx.strokeRect(
          beamTargetX - 18 - implantPulse * 10,
          beamTargetY - 18 - implantPulse * 10,
          36 + implantPulse * 20,
          36 + implantPulse * 20
        );
        drawBrainDataCube(
          worldCtx,
          beamTargetX,
          beamTargetY,
          accent,
          0.54 + implantPulse * 0.34,
          1.22 - planState.implantProgress * 0.32,
          packagePulse,
          {
            time: scene.frame,
            halo: 0.28 + implantPulse * 0.54,
            shell: 0.22 + implantPulse * 0.42,
            orbit: implantPulse * 0.24
          }
        );
      }
      worldCtx.restore();
    }
  }

  worldCtx.restore();
}

function drawBackground() {
  worldCtx.fillStyle = "#041018";
  worldCtx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let y = 0; y < HEIGHT; y += 16) {
    worldCtx.fillStyle = y % 32 === 0 ? "rgba(102, 220, 255, 0.045)" : "rgba(102, 220, 255, 0.018)";
    worldCtx.fillRect(0, y, WIDTH, 1);
  }

  for (let x = 0; x < WIDTH; x += 16) {
    worldCtx.fillStyle = x % 32 === 0 ? "rgba(102, 220, 255, 0.04)" : "rgba(102, 220, 255, 0.015)";
    worldCtx.fillRect(x, 0, 1, HEIGHT);
  }

  worldCtx.strokeStyle = "rgba(102, 220, 255, 0.35)";
  worldCtx.lineWidth = 4;
  worldCtx.strokeRect(2, 2, WIDTH - 4, HEIGHT - 4);

  worldCtx.strokeStyle = "rgba(102, 220, 255, 0.12)";
  worldCtx.lineWidth = 1;
  worldCtx.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20);
}

function drawFood() {
  for (let i = 0; i < state.foods.length; i += 1) {
    const food = state.foods[i];
    const pulse = 1 + Math.sin(state.tick * 0.08 + food.pulse) * 0.18;
    const size = Math.max(3, Math.round(food.radius * pulse));
    const x = Math.round(food.x);
    const y = Math.round(food.y);

    worldCtx.fillStyle = "#183826";
    worldCtx.fillRect(x - size - 1, y - 1, size * 2 + 2, 2);
    worldCtx.fillRect(x - 1, y - size - 1, 2, size * 2 + 2);

    worldCtx.fillStyle = "#80ff88";
    worldCtx.fillRect(x - size, y - 1, size * 2, 2);
    worldCtx.fillRect(x - 1, y - size, 2, size * 2);
    worldCtx.fillRect(x - 1, y - 1, 2, 2);
  }
}

function drawEyeCone(creature, eye, color) {
  const halfFov = CONFIG.eyeFov * 0.5;
  const originX = eye.origin?.x ?? creature.x;
  const originY = eye.origin?.y ?? creature.y;

  worldCtx.beginPath();
  worldCtx.moveTo(originX, originY);
  worldCtx.arc(originX, originY, CONFIG.eyeRange, eye.angle - halfFov, eye.angle + halfFov);
  worldCtx.closePath();
  worldCtx.fillStyle = color;
  worldCtx.fill();

  const segments = [
    { signal: eye.food, color: "rgba(128, 255, 136, 0.75)" },
    { signal: eye.creature, color: "rgba(255, 180, 71, 0.72)" },
    { signal: eye.wall, color: "rgba(102, 220, 255, 0.75)" }
  ];

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i];
    if (!segment.signal.point) {
      continue;
    }
    worldCtx.strokeStyle = segment.color;
    worldCtx.lineWidth = 1;
    worldCtx.beginPath();
    worldCtx.moveTo(originX, originY);
    worldCtx.lineTo(segment.signal.point.x, segment.signal.point.y);
    worldCtx.stroke();
  }
}

function getCreatureSegmentCount(creature) {
  if (creature.lifeStage === "egg") {
    return 0;
  }

  const adultCount = getAdultSegmentCount(creature);
  if (creature.lifeStage === "juvenile") {
    const growth = 1 - clamp(creature.growthTimer / CONFIG.juvenileGrowthFrames, 0, 1);
    return clamp(
      1 + Math.floor(growth * adultCount),
      1,
      Math.max(1, adultCount - 1)
    );
  }

  return adultCount;
}

function buildSegmentedBodyLayout(creature, headLength, headHeight, lifeScale, tailAnchorLocal) {
  ensureCreatureSegmentBodies(creature, { headLength, lifeScale, tailAnchorLocal });
  const adultCount = getAdultSegmentCount(creature);
  const segmentCount = getCreatureSegmentCount(creature);
  const segments = [];
  const bounds = {
    minX: creature.x - Math.max(headLength, headHeight) * 0.6,
    maxX: creature.x + Math.max(headLength, headHeight) * 0.6,
    minY: creature.y - Math.max(headLength, headHeight) * 0.6,
    maxY: creature.y + Math.max(headLength, headHeight) * 0.6
  };

  for (let i = 0; i < segmentCount; i += 1) {
    const segmentState = creature.segmentBodies[i];
    if (!segmentState) {
      continue;
    }

    const progress = adultCount <= 1 ? 0 : i / (adultCount - 1);
    const segmentScale = 1 - progress * 0.22;
    const birthBulge = getBirthingSegmentBulge(creature, i, segmentCount);
    const segmentLength = Math.max(6, Math.round(headLength * segmentScale * (1 - birthBulge * 0.08)));
    const segmentHeight = Math.max(
      5,
      Math.round(headHeight * (1 - progress * 0.18) * (1 + birthBulge * 0.5))
    );
    const radius = Math.max(4, segmentHeight * 0.44);

    const segment = {
      progress,
      birthBulge,
      x: segmentState.x,
      y: segmentState.y,
      angle: segmentState.angle,
      length: segmentLength,
      height: segmentHeight,
      radius
    };
    segments.push(segment);

    const halfWidth = segment.length * 0.5;
    const halfHeight = segment.height * 0.5;
    const rotatedHalfWidth =
      Math.abs(Math.cos(segment.angle)) * halfWidth +
      Math.abs(Math.sin(segment.angle)) * halfHeight;
    const rotatedHalfHeight =
      Math.abs(Math.sin(segment.angle)) * halfWidth +
      Math.abs(Math.cos(segment.angle)) * halfHeight;
    bounds.minX = Math.min(bounds.minX, segment.x - rotatedHalfWidth - 1);
    bounds.maxX = Math.max(bounds.maxX, segment.x + rotatedHalfWidth + 1);
    bounds.minY = Math.min(bounds.minY, segment.y - rotatedHalfHeight - 1);
    bounds.maxY = Math.max(bounds.maxY, segment.y + rotatedHalfHeight + 1);
  }

  return {
    segmentCount,
    segments,
    bounds
  };
}

function drawSegmentedBody(layout, creature, bodyColor, bodyShadow) {
  for (let i = layout.segments.length - 1; i >= 0; i -= 1) {
    const segment = layout.segments[i];
    const innerWidth = Math.round(segment.length * 0.94);
    const innerHeight = Math.round(segment.height * 0.88);
    const fillWidth = Math.round(segment.length * 0.84);
    const fillHeight = Math.round(segment.height * 0.84);
    const segmentColor = creature.alive
      ? `hsl(${creature.hue} 92% ${Math.round(62 - segment.progress * 10)}%)`
      : bodyColor;

    worldCtx.save();
    worldCtx.translate(segment.x, segment.y);
    worldCtx.rotate(segment.angle);

    worldCtx.fillStyle = bodyShadow;
    worldCtx.fillRect(
      -Math.round(segment.length * 0.5) - 1,
      -Math.round(segment.height * 0.5),
      segment.length + 2,
      segment.height
    );

    worldCtx.fillStyle = "#14283b";
    worldCtx.fillRect(
      -Math.round(innerWidth * 0.5),
      -Math.round(innerHeight * 0.5),
      innerWidth,
      innerHeight
    );

    worldCtx.fillStyle = segmentColor;
    worldCtx.fillRect(
      -Math.round(fillWidth * 0.5),
      -Math.round(fillHeight * 0.5),
      fillWidth,
      fillHeight
    );
    worldCtx.restore();
  }
}

function drawEggSprite(width, height, hue, crackProgress = 0, alpha = 1) {
  const shellColor = `hsl(${hue} 48% 84%)`;
  const shellShadow = `hsla(${hue} 60% 72% / 0.35)`;
  const coreWidth = Math.max(4, Math.round(width));
  const coreHeight = Math.max(6, Math.round(height));
  const shineWidth = Math.max(2, Math.round(coreWidth * 0.18));

  worldCtx.save();
  worldCtx.globalAlpha *= alpha;
  worldCtx.fillStyle = shellShadow;
  worldCtx.fillRect(-Math.round(coreWidth * 0.5) - 1, -Math.round(coreHeight * 0.5), coreWidth + 2, coreHeight);
  worldCtx.fillRect(
    -Math.round(coreWidth * 0.28),
    -Math.round(coreHeight * 0.58),
    Math.max(3, Math.round(coreWidth * 0.56)),
    Math.max(6, Math.round(coreHeight * 1.16))
  );

  worldCtx.fillStyle = shellColor;
  worldCtx.fillRect(-Math.round(coreWidth * 0.5), -Math.round(coreHeight * 0.5), coreWidth, coreHeight);
  worldCtx.fillRect(
    -Math.round(coreWidth * 0.28),
    -Math.round(coreHeight * 0.64),
    Math.max(3, Math.round(coreWidth * 0.56)),
    Math.max(6, Math.round(coreHeight * 1.28))
  );

  worldCtx.fillStyle = "#f9ffff";
  worldCtx.fillRect(
    -Math.round(shineWidth * 0.5),
    -Math.round(coreHeight * 0.3),
    shineWidth,
    Math.max(2, Math.round(coreHeight * 0.16))
  );

  if (crackProgress > 0.5) {
    worldCtx.fillStyle = "#183147";
    worldCtx.fillRect(-1, -Math.max(3, Math.round(coreHeight * 0.22)), 2, 3);
    worldCtx.fillRect(-3, -1, 2, 2);
    worldCtx.fillRect(1, 1, 2, 2);
  }
  worldCtx.restore();
}

function drawBirthingEggOverlay(layout, creature, bodyMetrics) {
  const birthingState = getBirthingTravelProgress(creature, layout.segments.length + 2);
  if (!birthingState) {
    return;
  }

  const spawnPose = getEggSpawnPose(creature, bodyMetrics);
  const pathNodes = [{ x: creature.x, y: creature.y, angle: creature.heading }]
    .concat(layout.segments.map((segment) => ({ x: segment.x, y: segment.y, angle: segment.angle })))
    .concat([spawnPose]);

  if (pathNodes.length < 2) {
    return;
  }

  const { progress, travel } = birthingState;
  const index = Math.min(pathNodes.length - 2, Math.floor(travel));
  const t = travel - index;
  const fromNode = pathNodes[index];
  const toNode = pathNodes[index + 1];
  const x = lerp(fromNode.x, toNode.x, t);
  const y = lerp(fromNode.y, toNode.y, t);
  const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
  const pulse = 1 + Math.sin(creature.movePhase * 0.9 + progress * TAU) * 0.04;
  const eggWidth = Math.max(5, Math.round(bodyMetrics.headHeight * 0.52 * pulse));
  const eggHeight = Math.max(7, Math.round(bodyMetrics.headLength * 0.38 * pulse));

  worldCtx.save();
  worldCtx.translate(x, y);
  worldCtx.rotate(angle);
  drawEggSprite(eggWidth, eggHeight, creature.hue, 0, 0.84);
  worldCtx.restore();
}

function drawEggCreature(creature, isFeatured) {
  const pulse = 1 + Math.sin(creature.movePhase * 0.6) * 0.05;
  const radiusScale = (creature.radius || CONFIG.creatureRadius) / 10;
  const eggWidth = Math.round(10 * radiusScale * pulse);
  const eggHeight = Math.round(14 * radiusScale * pulse);
  const crackProgress = 1 - clamp(creature.eggTimer / CONFIG.eggHatchFrames, 0, 1);
  drawEggSprite(eggWidth, eggHeight, creature.hue, crackProgress);
}

function drawCreature(creature, isFeatured) {
  if (creature.lifeStage === "egg") {
    worldCtx.save();
    worldCtx.translate(creature.x, creature.y);
    worldCtx.rotate(creature.heading);
    drawEggCreature(creature, isFeatured);
    worldCtx.restore();
    return;
  }

  const bodyMetrics = getCreatureBodyMetrics(creature);
  const deathProgress = creature.alive
    ? 0
    : 1 - clamp(creature.deathTimer / CONFIG.deathAnimationFrames, 0, 1);
  const headLength = bodyMetrics.headLength;
  const headHeight = bodyMetrics.headHeight;
  const bodyColor = creature.alive
    ? `hsl(${creature.hue} 92% 62%)`
    : `hsla(${creature.hue} 28% 34% / ${0.9 - deathProgress * 0.45})`;
  const bodyShadow = creature.alive
    ? `hsla(${creature.hue} 95% 72% / 0.3)`
    : `rgba(10, 18, 28, ${0.36 - deathProgress * 0.18})`;

  drawBirthingEggOverlay(bodyMetrics.segmentLayout, creature, bodyMetrics);
  drawSegmentedBody(bodyMetrics.segmentLayout, creature, bodyColor, bodyShadow);

  worldCtx.save();
  worldCtx.translate(creature.x, creature.y);
  worldCtx.rotate(creature.heading);
  if (!creature.alive) {
    worldCtx.rotate(creature.deathSpin * deathProgress * 3.2);
    worldCtx.globalAlpha = 1 - deathProgress * 0.45;
  }

  worldCtx.fillStyle = bodyShadow;
  worldCtx.fillRect(
    -Math.round(bodyMetrics.headOuterWidth * 0.5) - 1,
    -Math.round(bodyMetrics.headOuterHeight * 0.5),
    bodyMetrics.headOuterWidth + 2,
    bodyMetrics.headOuterHeight
  );

  worldCtx.fillStyle = "#14283b";
  worldCtx.fillRect(
    -Math.round(bodyMetrics.headInnerWidth * 0.5),
    -Math.round(bodyMetrics.headInnerHeight * 0.5),
    bodyMetrics.headInnerWidth,
    bodyMetrics.headInnerHeight
  );

  worldCtx.fillStyle = bodyColor;
  worldCtx.fillRect(
    -Math.round(bodyMetrics.headFillWidth * 0.5),
    -Math.round(bodyMetrics.headFillHeight * 0.5),
    bodyMetrics.headFillWidth,
    bodyMetrics.headFillHeight
  );

  worldCtx.fillStyle = creature.alive
    ? `hsla(${creature.hue} 100% 82% / 0.28)`
    : `rgba(255, 170, 196, ${0.16 - deathProgress * 0.08})`;
  worldCtx.fillRect(
    Math.round(headLength * 0.06),
    -Math.max(2, Math.round(headHeight * 0.28)),
    Math.max(3, Math.round(headLength * 0.2)),
    Math.max(3, Math.round(headHeight * 0.52))
  );

  worldCtx.fillStyle = "#031117";
  worldCtx.fillRect(bodyMetrics.leftEyeLocal.x, bodyMetrics.leftEyeLocal.y, 3, 3);
  worldCtx.fillRect(bodyMetrics.rightEyeLocal.x, bodyMetrics.rightEyeLocal.y, 3, 3);
  worldCtx.fillStyle = "#dffcff";
  worldCtx.fillRect(bodyMetrics.leftEyeLocal.x + 1, bodyMetrics.leftEyeLocal.y + 1, 1, 1);
  worldCtx.fillRect(bodyMetrics.rightEyeLocal.x + 1, bodyMetrics.rightEyeLocal.y + 1, 1, 1);

  worldCtx.fillStyle = creature.alive ? "#1c394f" : "#4b2838";
  worldCtx.fillRect(bodyMetrics.mouthLocal.x, -1, 3, 2);
  worldCtx.restore();

  if (!creature.alive) {
    const headExtent = Math.max(bodyMetrics.headOuterWidth, bodyMetrics.headOuterHeight) * 0.65;
    const minX = Math.min(bodyMetrics.segmentLayout.bounds.minX, creature.x - headExtent);
    const maxX = Math.max(bodyMetrics.segmentLayout.bounds.maxX, creature.x + headExtent);
    const minY = Math.min(bodyMetrics.segmentLayout.bounds.minY, creature.y - headExtent);
    const maxY = Math.max(bodyMetrics.segmentLayout.bounds.maxY, creature.y + headExtent);

    worldCtx.strokeStyle = `rgba(255, 109, 179, ${0.45 - deathProgress * 0.2})`;
    worldCtx.lineWidth = 1;
    worldCtx.strokeRect(
      Math.floor(minX) - 4,
      Math.floor(minY) - 3,
      Math.ceil(maxX - minX) + 8,
      Math.ceil(maxY - minY) + 6
    );
    for (let i = 0; i < 4; i += 1) {
      const shardX = creature.x - 6 + i * 4;
      const shardY = creature.y - 8 + deathProgress * 12 + Math.sin(creature.movePhase + i) * 2;
      worldCtx.fillStyle = `rgba(255, 109, 179, ${0.6 - deathProgress * 0.35})`;
      worldCtx.fillRect(Math.round(shardX), Math.round(shardY), 2, 2);
    }
  }
}

function drawCreatures() {
  if (state.featured && state.featured.senses) {
    drawEyeCone(state.featured, state.featured.senses.eyes[0], "rgba(102, 220, 255, 0.05)");
    drawEyeCone(state.featured, state.featured.senses.eyes[1], "rgba(102, 220, 255, 0.05)");
  }

  for (let i = 0; i < state.creatures.length; i += 1) {
    drawCreature(state.creatures[i], state.creatures[i] === state.featured);
  }
}

function drawSparks() {
  for (let i = 0; i < state.sparks.length; i += 1) {
    const spark = state.sparks[i];
    const alpha = spark.life / spark.maxLife;
    worldCtx.fillStyle = hexToRgba(spark.color, alpha);
    worldCtx.fillRect(Math.round(spark.x), Math.round(spark.y), 2, 2);
  }
}

function drawInfluenceField() {
  if (!isInfluenceToolActive()) {
    return;
  }

  const { x, y, radius } = state.influenceTool;
  worldCtx.save();
  const aura = worldCtx.createRadialGradient(x, y, 6, x, y, radius);
  aura.addColorStop(0, "rgba(255, 241, 123, 0.18)");
  aura.addColorStop(0.38, "rgba(255, 241, 123, 0.08)");
  aura.addColorStop(0.72, "rgba(74, 255, 212, 0.05)");
  aura.addColorStop(1, "rgba(74, 255, 212, 0)");
  worldCtx.fillStyle = aura;
  worldCtx.beginPath();
  worldCtx.arc(x, y, radius, 0, TAU);
  worldCtx.fill();

  worldCtx.strokeStyle = "rgba(255, 241, 123, 0.62)";
  worldCtx.lineWidth = 2;
  worldCtx.setLineDash([12, 8]);
  worldCtx.beginPath();
  worldCtx.arc(x, y, radius, 0, TAU);
  worldCtx.stroke();
  worldCtx.setLineDash([]);

  worldCtx.strokeStyle = "rgba(74, 255, 212, 0.72)";
  worldCtx.lineWidth = 1;
  worldCtx.beginPath();
  worldCtx.moveTo(x - 14, y);
  worldCtx.lineTo(x + 14, y);
  worldCtx.moveTo(x, y - 14);
  worldCtx.lineTo(x, y + 14);
  worldCtx.stroke();

  worldCtx.fillStyle = "#fff17b";
  worldCtx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
  worldCtx.restore();
}

function drawStartupScene() {
  const scene = state.startupScene;
  if (!scene) {
    return;
  }

  const progress = clamp(scene.frame / Math.max(1, scene.totalFrames), 0, 1);
  const fadeIn = clamp(progress / 0.08, 0, 1);
  const fadeOut = 1 - clamp((progress - 0.9) / 0.1, 0, 1);
  const overlayStrength = fadeIn * fadeOut;
  const habitatScanProgress = clamp((progress - 0.1) / 0.26, 0, 1);
  const populationLockProgress = clamp((progress - 0.36) / 0.22, 0, 1);
  const foodLockProgress = clamp((progress - 0.52) / 0.18, 0, 1);
  const releaseProgress = clamp((progress - 0.74) / 0.18, 0, 1);
  const readyProgress = clamp((progress - 0.9) / 0.1, 0, 1);
  const chamberX = WIDTH * 0.08;
  const chamberY = HEIGHT * 0.09;
  const chamberW = WIDTH * 0.84;
  const chamberH = HEIGHT * 0.78;
  const scanX = chamberX + 20 + (chamberW - 40) * habitatScanProgress;
  const pulse = 0.5 + Math.sin(scene.frame * 0.11) * 0.5;
  const stageLabel = readyProgress > 0
    ? "LINEAGE RELEASE READY"
    : releaseProgress > 0
      ? "UNSEALING HABITAT GATE"
      : foodLockProgress > 0
        ? "LOCKING FOOD PATCHES"
        : populationLockProgress > 0
          ? "INDEXING BIOSIGNATURES"
          : "POWERING RETRO HABITAT";

  worldCtx.save();
  const overlayGradient = worldCtx.createLinearGradient(0, 0, 0, HEIGHT);
  overlayGradient.addColorStop(0, `rgba(1, 7, 12, ${0.82 * overlayStrength})`);
  overlayGradient.addColorStop(0.55, `rgba(2, 10, 18, ${0.72 * overlayStrength})`);
  overlayGradient.addColorStop(1, `rgba(0, 5, 8, ${0.88 * overlayStrength})`);
  worldCtx.fillStyle = overlayGradient;
  worldCtx.fillRect(0, 0, WIDTH, HEIGHT);

  worldCtx.globalCompositeOperation = "lighter";
  const sweepGradient = worldCtx.createLinearGradient(scanX - 44, chamberY, scanX + 44, chamberY);
  sweepGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  sweepGradient.addColorStop(0.48, `rgba(102, 220, 255, ${0.04 + overlayStrength * 0.08})`);
  sweepGradient.addColorStop(0.5, `rgba(255, 241, 123, ${0.08 + overlayStrength * 0.08})`);
  sweepGradient.addColorStop(0.52, `rgba(102, 220, 255, ${0.04 + overlayStrength * 0.08})`);
  sweepGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  worldCtx.fillStyle = sweepGradient;
  worldCtx.fillRect(scanX - 44, chamberY + 12, 88, chamberH - 24);
  worldCtx.globalCompositeOperation = "source-over";

  worldCtx.fillStyle = `rgba(3, 12, 18, ${0.82 * overlayStrength})`;
  worldCtx.fillRect(chamberX, chamberY, chamberW, chamberH);
  worldCtx.strokeStyle = `rgba(102, 220, 255, ${0.2 + overlayStrength * 0.26})`;
  worldCtx.lineWidth = 2;
  worldCtx.strokeRect(chamberX, chamberY, chamberW, chamberH);

  for (let y = chamberY + 8; y < chamberY + chamberH - 8; y += 14) {
    worldCtx.fillStyle = y % 28 === 0
      ? `rgba(102, 220, 255, ${0.02 + overlayStrength * 0.03})`
      : `rgba(102, 220, 255, ${0.008 + overlayStrength * 0.016})`;
    worldCtx.fillRect(chamberX + 4, y, chamberW - 8, 1);
  }

  worldCtx.fillStyle = "#ddfaff";
  worldCtx.font = CANVAS_FONTS.hero;
  worldCtx.fillText("HABITAT BOOT SEQUENCE", chamberX + 20, chamberY + 28);
  worldCtx.font = CANVAS_FONTS.section;
  worldCtx.fillStyle = `rgba(157, 231, 255, ${0.7 + overlayStrength * 0.18})`;
  worldCtx.fillText(stageLabel, chamberX + 20, chamberY + 48);
  worldCtx.fillText("GENE LAB // CLOSED ECOSYSTEM // PIXEL BIOSPHERE", chamberX + 20, chamberY + 64);

  worldCtx.fillStyle = `rgba(74, 255, 212, ${0.16 + overlayStrength * 0.22})`;
  worldCtx.fillRect(chamberX + 20, chamberY + 78, chamberW - 40, 3);
  worldCtx.fillStyle = `rgba(255, 241, 123, ${0.42 + overlayStrength * 0.28})`;
  worldCtx.fillRect(chamberX + 20, chamberY + 78, (chamberW - 40) * progress, 3);

  const leftPanelX = chamberX + 20;
  const rightPanelX = chamberX + chamberW - 186;
  const panelY = chamberY + 98;
  const panelW = 166;
  const panelH = 84;

  worldCtx.fillStyle = `rgba(5, 15, 24, ${0.78 * overlayStrength})`;
  worldCtx.fillRect(leftPanelX, panelY, panelW, panelH);
  worldCtx.fillRect(rightPanelX, panelY, panelW, panelH);
  worldCtx.strokeStyle = `rgba(102, 220, 255, ${0.14 + overlayStrength * 0.18})`;
  worldCtx.strokeRect(leftPanelX, panelY, panelW, panelH);
  worldCtx.strokeRect(rightPanelX, panelY, panelW, panelH);

  worldCtx.font = CANVAS_FONTS.body;
  worldCtx.fillStyle = "#fff17b";
  worldCtx.fillText("BOOT READOUT", leftPanelX + 10, panelY + 16);
  worldCtx.fillText("SEED TARGETS", rightPanelX + 10, panelY + 16);
  worldCtx.fillStyle = "#ddfaff";
  worldCtx.fillText(`POWER ${Math.round((0.2 + habitatScanProgress * 0.8) * 100)}%`, leftPanelX + 10, panelY + 34);
  worldCtx.fillText(`GRID ${Math.round(habitatScanProgress * 100)}%`, leftPanelX + 10, panelY + 50);
  worldCtx.fillText(`BIOSCAN ${Math.round(populationLockProgress * 100)}%`, leftPanelX + 10, panelY + 66);
  worldCtx.fillText(`RELEASE ${Math.round(releaseProgress * 100)}%`, leftPanelX + 10, panelY + 82);
  worldCtx.fillText(`CREATURES ${String(scene.creatureTarget).padStart(2, "0")}`, rightPanelX + 10, panelY + 34);
  worldCtx.fillText(`FOOD ${String(scene.foodTarget).padStart(2, "0")}`, rightPanelX + 10, panelY + 50);
  worldCtx.fillText(`MEMORY NODES ${String(CONFIG.memoryNeuronCount).padStart(2, "0")}`, rightPanelX + 10, panelY + 66);
  worldCtx.fillText("STATUS READY TO UNSEAL", rightPanelX + 10, panelY + 82);

  const centerY = chamberY + chamberH * 0.58;
  worldCtx.strokeStyle = `rgba(102, 220, 255, ${0.08 + overlayStrength * 0.2})`;
  worldCtx.strokeRect(WIDTH * 0.5 - 68, centerY - 48, 136, 96);
  worldCtx.beginPath();
  worldCtx.moveTo(WIDTH * 0.5 - 82, centerY);
  worldCtx.lineTo(WIDTH * 0.5 + 82, centerY);
  worldCtx.moveTo(WIDTH * 0.5, centerY - 62);
  worldCtx.lineTo(WIDTH * 0.5, centerY + 62);
  worldCtx.stroke();

  const lockedCreatures = Math.floor(state.creatures.length * populationLockProgress);
  for (let i = 0; i < lockedCreatures; i += 1) {
    const creature = state.creatures[i];
    const size = 12 + Math.sin(scene.frame * 0.16 + i * 0.9) * 2;
    worldCtx.strokeStyle = `rgba(102, 220, 255, ${0.12 + overlayStrength * 0.2 + pulse * 0.08})`;
    worldCtx.strokeRect(
      Math.round(creature.x - size * 0.5),
      Math.round(creature.y - size * 0.5),
      Math.round(size),
      Math.round(size)
    );
    worldCtx.fillStyle = `rgba(255, 241, 123, ${0.18 + overlayStrength * 0.24})`;
    worldCtx.fillRect(Math.round(creature.x) - 1, Math.round(creature.y) - 1, 3, 3);
  }

  const lockedFood = Math.floor(state.foods.length * foodLockProgress);
  for (let i = 0; i < lockedFood; i += 1) {
    const food = state.foods[i];
    worldCtx.strokeStyle = `rgba(128, 255, 136, ${0.18 + overlayStrength * 0.22})`;
    worldCtx.strokeRect(Math.round(food.x) - 5, Math.round(food.y) - 5, 10, 10);
    worldCtx.fillStyle = `rgba(128, 255, 136, ${0.24 + overlayStrength * 0.24})`;
    worldCtx.fillRect(Math.round(food.x) - 1, Math.round(food.y) - 1, 3, 3);
  }

  if (releaseProgress > 0.02) {
    const gateWidth = Math.max(0, (1 - releaseProgress) * 86);
    worldCtx.fillStyle = `rgba(255, 241, 123, ${0.1 + releaseProgress * 0.16})`;
    worldCtx.fillRect(WIDTH * 0.5 - gateWidth - 6, chamberY + 200, gateWidth, chamberH - 220);
    worldCtx.fillRect(WIDTH * 0.5 + 6, chamberY + 200, gateWidth, chamberH - 220);
  }

  if (readyProgress > 0) {
    worldCtx.globalCompositeOperation = "lighter";
    worldCtx.fillStyle = `rgba(74, 255, 212, ${0.08 + readyProgress * 0.16})`;
    worldCtx.fillRect(chamberX + 10, chamberY + 10, chamberW - 20, chamberH - 20);
    worldCtx.globalCompositeOperation = "source-over";
  }

  worldCtx.restore();
}

function drawBrainBankScene() {
  const scene = state.brainBankScene;
  if (!scene) {
    return;
  }

  const captureEnd = scene.captureFrames;
  const scanEnd = captureEnd + scene.scanFrames;
  const packageEnd = scanEnd + scene.packageFrames;
  const transferEnd = packageEnd + scene.transferFrames;
  const progress = clamp(scene.frame / scene.totalFrames, 0, 1);
  const sceneProgress = smooth01(progress);
  const captureProgress = smooth01(clamp(scene.frame / Math.max(1, scene.captureFrames), 0, 1));
  const scanProgress = smooth01(clamp((scene.frame - captureEnd) / Math.max(1, scene.scanFrames), 0, 1));
  const packageProgress = smooth01(clamp((scene.frame - scanEnd) / Math.max(1, scene.packageFrames), 0, 1));
  const transferProgress = smooth01(clamp((scene.frame - packageEnd) / Math.max(1, scene.transferFrames), 0, 1));
  const vaultProgress = smooth01(clamp((scene.frame - transferEnd) / Math.max(1, scene.vaultFrames), 0, 1));
  const pulse = 0.5 + Math.sin(scene.frame * 0.085) * 0.5;
  const sweepX = WIDTH * 0.12 + (WIDTH * 0.76) * (0.5 + Math.sin(scene.frame * 0.014) * 0.5);
  const overlayX = WIDTH * 0.06;
  const overlayY = HEIGHT * 0.08;
  const overlayW = WIDTH * 0.88;
  const overlayH = HEIGHT * 0.8;
  const leftX = overlayX + 22;
  const leftY = overlayY + 86;
  const leftW = Math.max(264, overlayW * 0.27);
  const leftH = overlayH - 122;
  const middleX = leftX + leftW + 18;
  const middleY = leftY;
  const middleW = Math.max(332, overlayW * 0.34);
  const middleH = leftH;
  const rightX = middleX + middleW + 18;
  const rightY = leftY;
  const rightW = overlayX + overlayW - rightX - 22;
  const rightH = leftH;
  const specimenCellW = Math.min(122, leftW - 54);
  const specimenCellH = 84;
  const specimenCellX = leftX + leftW * 0.5 - specimenCellW * 0.5;
  const specimenCellY = leftY + leftH - specimenCellH - 42;
  const specimenX = specimenCellX + specimenCellW * 0.5;
  const specimenY = specimenCellY + specimenCellH * 0.56;
  const specimenCurl = 0.38 + captureProgress * 0.42 + pulse * 0.16;
  const brainX = middleX + 18;
  const brainY = middleY + 24;
  const brainW = middleW - 36;
  const brainH = middleH - 48;
  const vaultSlotX = rightX + 26;
  const vaultSlotY = rightY + 74;
  const vaultSlotW = rightW - 52;
  const vaultSlotH = 124;
  const cubeOriginX = middleX + middleW * 0.5;
  const cubeOriginY = middleY + middleH * 0.52;
  const cubeTargetX = vaultSlotX + vaultSlotW * 0.5;
  const cubeTargetY = vaultSlotY + vaultSlotH * 0.38;
  const cubeVisible = packageProgress > 0.03 || transferProgress > 0.01 || vaultProgress > 0.01;
  const cubeTravel = clamp(transferProgress, 0, 1);
  const cubeX = lerp(cubeOriginX, cubeTargetX, cubeTravel);
  const cubeY = lerp(cubeOriginY, cubeTargetY, cubeTravel);

  let phaseLabel = "LOCKING LONGEST-LIVED SPECIMEN";
  let detailLabel = "CONTAINMENT FIELD STABILIZING";
  if (scene.frame >= captureEnd && scene.frame < scanEnd) {
    phaseLabel = "SCANNING LONGEVITY BRAIN";
    detailLabel = scanProgress < 0.82 ? "HEAD ZOOM // NEURAL SIGNAL EXTRACTION" : "SCAN LOCKED // BRAIN BLUEPRINT RESOLVED";
  } else if (scene.frame >= scanEnd && scene.frame < packageEnd) {
    phaseLabel = "PACKAGING ARCHIVE CUBE";
    detailLabel = "NEURAL MAP COMPRESSED INTO RETRO STORAGE MEDIA";
  } else if (scene.frame >= packageEnd && scene.frame < transferEnd) {
    phaseLabel = "TRANSFERRING TO VAULT";
    detailLabel = "DATA CUBE RIDING THE BRAIN BANK TRANSFER RAIL";
  } else if (scene.frame >= transferEnd) {
    phaseLabel = "BRAIN BANK WRITE COMPLETE";
    detailLabel = "VAULT SLOT SEALED // CLONE FILE READY TO REDEPLOY";
  }

  worldCtx.save();
  const overlayGradient = worldCtx.createLinearGradient(overlayX, overlayY, overlayX, overlayY + overlayH);
  overlayGradient.addColorStop(0, "rgba(2, 10, 19, 0.93)");
  overlayGradient.addColorStop(0.42, "rgba(3, 12, 23, 0.88)");
  overlayGradient.addColorStop(1, "rgba(1, 6, 12, 0.94)");
  worldCtx.fillStyle = overlayGradient;
  worldCtx.fillRect(overlayX, overlayY, overlayW, overlayH);

  worldCtx.globalCompositeOperation = "lighter";
  const sweepGradient = worldCtx.createLinearGradient(sweepX - 34, overlayY, sweepX + 34, overlayY);
  sweepGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
  sweepGradient.addColorStop(0.48, `rgba(102, 220, 255, ${0.03 + pulse * 0.04})`);
  sweepGradient.addColorStop(0.5, `rgba(255, 241, 123, ${0.05 + pulse * 0.06})`);
  sweepGradient.addColorStop(0.52, `rgba(102, 220, 255, ${0.03 + pulse * 0.04})`);
  sweepGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  worldCtx.fillStyle = sweepGradient;
  worldCtx.fillRect(sweepX - 34, overlayY + 8, 68, overlayH - 16);
  worldCtx.globalCompositeOperation = "source-over";

  worldCtx.strokeStyle = "rgba(102, 220, 255, 0.28)";
  worldCtx.lineWidth = 2;
  worldCtx.strokeRect(overlayX, overlayY, overlayW, overlayH);
  worldCtx.fillStyle = `rgba(74, 255, 212, ${0.1 + sceneProgress * 0.1})`;
  worldCtx.fillRect(overlayX + 22, overlayY + 74, (overlayW - 44) * sceneProgress, 3);

  for (let y = overlayY + 8; y < overlayY + overlayH; y += 14) {
    worldCtx.fillStyle = y % 28 === 0 ? "rgba(102, 220, 255, 0.03)" : "rgba(102, 220, 255, 0.014)";
    worldCtx.fillRect(overlayX + 4, y, overlayW - 8, 1);
  }

  worldCtx.fillStyle = "#ddfaff";
  worldCtx.font = CANVAS_FONTS.title;
  worldCtx.fillText("LONGEVITY BRAIN BANK", overlayX + 22, overlayY + 28);
  worldCtx.font = CANVAS_FONTS.section;
  worldCtx.fillStyle = `rgba(139, 191, 202, ${0.8 + pulse * 0.16})`;
  worldCtx.fillText(phaseLabel, overlayX + 22, overlayY + 48);
  worldCtx.fillText(detailLabel, overlayX + 22, overlayY + 64);
  worldCtx.fillText(`FILE ${scene.fileName}`, overlayX + 22, overlayY + 82);

  const panelBoxes = [
    { x: leftX, y: leftY, w: leftW, h: leftH, title: "SPECIMEN LOCK" },
    { x: middleX, y: middleY, w: middleW, h: middleH, title: `BRAIN BLUEPRINT G${scene.generation}` },
    { x: rightX, y: rightY, w: rightW, h: rightH, title: "BRAIN BANK VAULT" }
  ];

  for (let i = 0; i < panelBoxes.length; i += 1) {
    const panel = panelBoxes[i];
    worldCtx.fillStyle = "rgba(6, 16, 26, 0.84)";
    worldCtx.fillRect(panel.x, panel.y, panel.w, panel.h);
    worldCtx.strokeStyle = "rgba(102, 220, 255, 0.18)";
    worldCtx.lineWidth = 1;
    worldCtx.strokeRect(panel.x, panel.y, panel.w, panel.h);
    worldCtx.fillStyle = "rgba(255, 241, 123, 0.72)";
    worldCtx.font = CANVAS_FONTS.body;
    worldCtx.fillText(panel.title, panel.x + 10, panel.y + 16);
  }

  drawContainmentCell(
    worldCtx,
    specimenCellX,
    specimenCellY,
    specimenCellW,
    specimenCellH,
    captureProgress,
    pulse
  );

  drawExtinctionSpecimen(
    worldCtx,
    scene.specimen,
    specimenX,
    specimenY,
    0.9 + captureProgress * 0.18,
    scene.specimen.heading,
    0.96,
    specimenCurl,
    captureProgress * 0.18
  );

  drawSpecimenHeadScanPanel(
    worldCtx,
    scene.specimen,
    scene.brain,
    leftX + 10,
    leftY + 16,
    leftW - 20,
    leftH - 128,
    scanProgress,
    scene.frame,
    specimenX + Math.cos(scene.specimen.heading) * 7,
    specimenY + Math.sin(scene.specimen.heading) * 7
  );

  worldCtx.fillStyle = `rgba(221, 250, 255, ${0.66 + captureProgress * 0.2})`;
  worldCtx.font = CANVAS_FONTS.body;
  worldCtx.fillText(`AGE ${formatAge(scene.specimen.age)}`, leftX + 12, leftY + leftH - 20);
  worldCtx.fillText(`SEGMENTS ${clampSegmentGene(scene.specimen.segmentGene)}`, leftX + leftW - 112, leftY + leftH - 20);

  drawBrainBlueprint(worldCtx, scene.brain, brainX, brainY, brainW, brainH, {
    alpha: 0.18 + scanProgress * 0.42 + packageProgress * 0.12,
    fluxAmount: 0.1 + scanProgress * 0.16 + packageProgress * 0.12 + pulse * 0.04,
    fluxPacketBudget: 8,
    nodePulseBudget: 5,
    fluxSpeedScale: 0.2,
    fluxSelectorSpeed: 0.12,
    nodePulseSpeed: 0.06,
    nodePulseSelectorSpeed: 0.14,
    fluxPhase: 0.21,
    time: scene.frame
  });

  if (packageProgress < 0.98) {
    worldCtx.fillStyle = `rgba(4, 12, 20, ${0.52 - scanProgress * 0.22})`;
    worldCtx.fillRect(brainX, brainY, brainW, brainH);
  }

  worldCtx.fillStyle = `rgba(102, 220, 255, ${0.08 + packageProgress * 0.18})`;
  worldCtx.fillRect(middleX + 12, middleY + middleH - 36, middleW - 24, 8);
  worldCtx.fillStyle = `rgba(255, 241, 123, ${0.18 + packageProgress * 0.32})`;
  worldCtx.fillRect(middleX + 12, middleY + middleH - 36, (middleW - 24) * Math.max(scanProgress, packageProgress), 8);
  worldCtx.fillStyle = `rgba(221, 250, 255, ${0.68 + packageProgress * 0.18})`;
  worldCtx.font = CANVAS_FONTS.small;
  worldCtx.fillText("VAULT COMPRESSION", middleX + 12, middleY + middleH - 44);

  for (let slot = 0; slot < 3; slot += 1) {
    const slotY = vaultSlotY + slot * 92;
    worldCtx.fillStyle = "rgba(5, 15, 24, 0.88)";
    worldCtx.fillRect(vaultSlotX, slotY, vaultSlotW, 68);
    worldCtx.strokeStyle = slot === 0
      ? `rgba(255, 241, 123, ${0.18 + vaultProgress * 0.3})`
      : "rgba(102, 220, 255, 0.12)";
    worldCtx.strokeRect(vaultSlotX, slotY, vaultSlotW, 68);
    worldCtx.fillStyle = slot === 0
      ? `rgba(255, 241, 123, ${0.64 + vaultProgress * 0.22})`
      : "rgba(139, 191, 202, 0.54)";
    worldCtx.fillText(slot === 0 ? "ACTIVE SLOT // LONGEVITY LEADER" : `EMPTY SLOT ${slot + 1}`, vaultSlotX + 10, slotY + 14);
  }

  if (cubeVisible) {
    drawBrainDataCube(
      worldCtx,
      cubeX,
      cubeY,
      "255, 241, 123",
      0.46 + packageProgress * 0.34 + vaultProgress * 0.18,
      1.24,
      pulse
    );
  }

  if (transferProgress > 0.01) {
    worldCtx.save();
    worldCtx.globalCompositeOperation = "lighter";
    worldCtx.strokeStyle = `rgba(255, 241, 123, ${0.12 + transferProgress * 0.2})`;
    worldCtx.lineWidth = 1.2;
    worldCtx.setLineDash([5, 4]);
    worldCtx.beginPath();
    worldCtx.moveTo(cubeOriginX, cubeOriginY);
    worldCtx.lineTo(cubeTargetX, cubeTargetY);
    worldCtx.stroke();
    worldCtx.setLineDash([]);
    worldCtx.restore();
  }

  if (vaultProgress > 0.01) {
    const storedBrainX = vaultSlotX + 10;
    const storedBrainY = vaultSlotY + 22;
    const storedBrainW = vaultSlotW * 0.58;
    const storedBrainH = 36;
    drawBrainBlueprint(worldCtx, scene.brain, storedBrainX, storedBrainY, storedBrainW, storedBrainH, {
      alpha: 0.12 + vaultProgress * 0.36,
      fluxAmount: 0.08 + vaultProgress * 0.18,
      fluxPacketBudget: 3,
      nodePulseBudget: 2,
      fluxSpeedScale: 0.14,
      fluxSelectorSpeed: 0.1,
      nodePulseSpeed: 0.05,
      nodePulseSelectorSpeed: 0.12,
      fluxPhase: 0.07,
      time: scene.frame
    });
    drawExtinctionSpecimen(
      worldCtx,
      scene.specimen,
      vaultSlotX + vaultSlotW * 0.82,
      vaultSlotY + 40,
      0.44,
      -0.16,
      0.98,
      0.18 + pulse * 0.08,
      0
    );
    worldCtx.fillStyle = `rgba(74, 255, 212, ${0.18 + vaultProgress * 0.24})`;
    worldCtx.fillRect(vaultSlotX + 10, vaultSlotY + 58, vaultSlotW - 20, 3);
    worldCtx.fillStyle = `rgba(255, 241, 123, ${0.28 + vaultProgress * 0.34})`;
    worldCtx.fillRect(vaultSlotX + 10, vaultSlotY + 58, (vaultSlotW - 20) * vaultProgress, 3);
  }

  worldCtx.fillStyle = `rgba(221, 250, 255, ${0.64 + vaultProgress * 0.2})`;
  worldCtx.font = CANVAS_FONTS.body;
  worldCtx.fillText(`WRITE ${Math.round((0.08 + packageProgress * 0.26 + transferProgress * 0.3 + vaultProgress * 0.36) * 100)}%`, rightX + 12, rightY + rightH - 26);
  worldCtx.fillText(`CLONE FILE READY ${vaultProgress > 0.96 ? "YES" : "SYNC"}`, rightX + rightW - 150, rightY + rightH - 26);
  worldCtx.restore();
}

function drawWorld() {
  drawBackground();
  drawFood();
  drawExtinctionScene();
  drawCreatures();
  drawInfluenceField();
  drawSparks();
  drawBrainBankScene();
  drawStartupScene();
}

function drawTelemetryBackground() {
  telemetryCtx.clearRect(0, 0, telemetryCanvas.width, telemetryCanvas.height);
  telemetryCtx.fillStyle = "#051019";
  telemetryCtx.fillRect(0, 0, telemetryCanvas.width, telemetryCanvas.height);

  for (let y = 0; y < telemetryCanvas.height; y += 14) {
    telemetryCtx.fillStyle = y % 28 === 0 ? "rgba(102, 220, 255, 0.04)" : "rgba(102, 220, 255, 0.015)";
    telemetryCtx.fillRect(0, y, telemetryCanvas.width, 1);
  }

  for (let x = 0; x < telemetryCanvas.width; x += 18) {
    telemetryCtx.fillStyle = x % 36 === 0 ? "rgba(102, 220, 255, 0.028)" : "rgba(102, 220, 255, 0.012)";
    telemetryCtx.fillRect(x, 0, 1, telemetryCanvas.height);
  }

  const sweepX = (state.tick * 1.6) % (telemetryCanvas.width + 64) - 32;
  telemetryCtx.save();
  telemetryCtx.globalCompositeOperation = "lighter";
  const sweep = telemetryCtx.createLinearGradient(sweepX - 24, 0, sweepX + 24, 0);
  sweep.addColorStop(0, "rgba(0, 0, 0, 0)");
  sweep.addColorStop(0.5, "rgba(102, 220, 255, 0.045)");
  sweep.addColorStop(1, "rgba(0, 0, 0, 0)");
  telemetryCtx.fillStyle = sweep;
  telemetryCtx.fillRect(sweepX - 24, 0, 48, telemetryCanvas.height);
  telemetryCtx.restore();
}

function drawTelemetrySeries(metric, samples, x, y, width, height, index) {
  const latest = samples.length > 0 ? samples[samples.length - 1][metric.key] : 0;
  const maxValue = Math.max(1, metric.maxValue(samples));
  const graphX = x + 12;
  const graphY = y + 40;
  const graphW = width - 24;
  const graphH = height - 58;
  const tint = hexToRgba(metric.color, 0.08);
  const lineColor = metric.color;

  telemetryCtx.fillStyle = index % 2 === 0 ? "rgba(8, 18, 29, 0.84)" : "rgba(6, 14, 23, 0.82)";
  telemetryCtx.fillRect(x, y, width, height);
  telemetryCtx.fillStyle = tint;
  telemetryCtx.fillRect(x + 1, y + 1, width - 2, height - 2);
  telemetryCtx.strokeStyle = "rgba(102, 220, 255, 0.16)";
  telemetryCtx.lineWidth = 1;
  telemetryCtx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

  telemetryCtx.fillStyle = lineColor;
  telemetryCtx.fillRect(x + 1, y + 1, 4, height - 2);

  telemetryCtx.font = CANVAS_FONTS.title;
  telemetryCtx.textAlign = "left";
  telemetryCtx.fillStyle = "#ddfaff";
  telemetryCtx.fillText(metric.label, x + 14, y + 20);
  telemetryCtx.textAlign = "right";
  telemetryCtx.fillStyle = lineColor;
  telemetryCtx.fillText(metric.formatValue(latest), x + width - 14, y + 20);
  telemetryCtx.font = CANVAS_FONTS.body;
  telemetryCtx.fillStyle = "rgba(221, 250, 255, 0.6)";
  telemetryCtx.fillText(metric.formatScale(maxValue), x + width - 14, y + 34);
  telemetryCtx.textAlign = "left";

  for (let guide = 0; guide <= 3; guide += 1) {
    const guideY = graphY + (graphH * guide) / 3;
    telemetryCtx.fillStyle = guide === 3 ? "rgba(102, 220, 255, 0.08)" : "rgba(102, 220, 255, 0.04)";
    telemetryCtx.fillRect(graphX, guideY, graphW, 1);
  }

  if (samples.length === 0) {
    return;
  }

  const points = [];
  const denom = Math.max(1, samples.length - 1);
  for (let i = 0; i < samples.length; i += 1) {
    const value = clamp(samples[i][metric.key] || 0, 0, maxValue);
    points.push({
      x: graphX + (graphW * i) / denom,
      y: graphY + graphH - (value / maxValue) * graphH
    });
  }

  telemetryCtx.beginPath();
  telemetryCtx.moveTo(points[0].x, graphY + graphH);
  for (let i = 0; i < points.length; i += 1) {
    telemetryCtx.lineTo(points[i].x, points[i].y);
  }
  telemetryCtx.lineTo(points[points.length - 1].x, graphY + graphH);
  telemetryCtx.closePath();
  const fill = telemetryCtx.createLinearGradient(0, graphY, 0, graphY + graphH);
  fill.addColorStop(0, hexToRgba(lineColor, 0.3));
  fill.addColorStop(1, hexToRgba(lineColor, 0.02));
  telemetryCtx.fillStyle = fill;
  telemetryCtx.fill();

  telemetryCtx.strokeStyle = hexToRgba(lineColor, 0.18);
  telemetryCtx.lineWidth = 4;
  telemetryCtx.beginPath();
  telemetryCtx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    telemetryCtx.lineTo(points[i].x, points[i].y);
  }
  telemetryCtx.stroke();

  telemetryCtx.save();
  telemetryCtx.strokeStyle = hexToRgba(lineColor, 0.98);
  telemetryCtx.lineWidth = 1.8;
  telemetryCtx.shadowBlur = 10;
  telemetryCtx.shadowColor = hexToRgba(lineColor, 0.58);
  telemetryCtx.beginPath();
  telemetryCtx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    telemetryCtx.lineTo(points[i].x, points[i].y);
  }
  telemetryCtx.stroke();
  telemetryCtx.restore();

  const lastPoint = points[points.length - 1];
  telemetryCtx.fillStyle = "#051019";
  telemetryCtx.fillRect(lastPoint.x - 4, lastPoint.y - 4, 8, 8);
  telemetryCtx.fillStyle = lineColor;
  telemetryCtx.fillRect(lastPoint.x - 2, lastPoint.y - 2, 4, 4);
}

function drawTelemetryPanel() {
  drawTelemetryBackground();

  const samples = state.telemetryHistory;
  if (samples.length === 0) {
    telemetryCtx.fillStyle = "#8bbfca";
    telemetryCtx.font = CANVAS_FONTS.hero;
    telemetryCtx.fillText("NO TELEMETRY", 88, 180);
    return;
  }

  const marginX = 14;
  const marginTop = 16;
  const marginBottom = 24;
  const gap = 12;
  const sectionHeight =
    (telemetryCanvas.height - marginTop - marginBottom - gap * (TELEMETRY_SERIES.length - 1)) /
    TELEMETRY_SERIES.length;

  for (let i = 0; i < TELEMETRY_SERIES.length; i += 1) {
    drawTelemetrySeries(
      TELEMETRY_SERIES[i],
      samples,
      marginX,
      marginTop + i * (sectionHeight + gap),
      telemetryCanvas.width - marginX * 2,
      sectionHeight,
      i
    );
  }

  telemetryCtx.fillStyle = "rgba(221, 250, 255, 0.62)";
  telemetryCtx.font = CANVAS_FONTS.body;
  telemetryCtx.textAlign = "center";
  telemetryCtx.fillText(
    `ROLLING ${Math.round((TELEMETRY_HISTORY_LIMIT * TELEMETRY_SAMPLE_INTERVAL) / 60)}S WINDOW`,
    telemetryCanvas.width * 0.5,
    telemetryCanvas.height - 6
  );
  telemetryCtx.textAlign = "left";
}

function drawNetworkBackground() {
  networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
  networkCtx.fillStyle = "#051019";
  networkCtx.fillRect(0, 0, networkCanvas.width, networkCanvas.height);

  for (let y = 0; y < networkCanvas.height; y += 14) {
    networkCtx.fillStyle = y % 28 === 0 ? "rgba(102, 220, 255, 0.04)" : "rgba(102, 220, 255, 0.015)";
    networkCtx.fillRect(0, y, networkCanvas.width, 1);
  }
}

function createNetworkDisplayState(featured) {
  return {
    featuredId: featured.id,
    smoothedLayers: [
      Array(INPUT_LABELS.length).fill(0),
      ...CONFIG.hiddenLayerSizes.map((size) => Array(size).fill(0)),
      Array(OUTPUT_LABELS.length).fill(0)
    ],
    connectionGlows: featured.brain.weights.map((layer) =>
      layer.map((row) => row.map(() => 0))
    )
  };
}

function updateNetworkDisplayState(featured) {
  if (!featured || !featured.senses) {
    state.networkDisplay = null;
    return null;
  }

  const rawLayers = [
    featured.senses.inputs || [],
    ...(featured.hiddenLayers || []),
    featured.outputs || []
  ];

  const needsReset =
    !state.networkDisplay ||
    state.networkDisplay.featuredId !== featured.id ||
    state.networkDisplay.connectionGlows.length !== featured.brain.weights.length;

  if (needsReset) {
    state.networkDisplay = createNetworkDisplayState(featured);
  }

  for (let layerIndex = 0; layerIndex < rawLayers.length; layerIndex += 1) {
    const smoothedLayer = state.networkDisplay.smoothedLayers[layerIndex];
    const rawLayer = rawLayers[layerIndex];
    for (let nodeIndex = 0; nodeIndex < smoothedLayer.length; nodeIndex += 1) {
      smoothedLayer[nodeIndex] = damp(
        smoothedLayer[nodeIndex],
        rawLayer[nodeIndex] || 0,
        CONFIG.networkValueSmoothing
      );
    }
  }

  for (let layerIndex = 0; layerIndex < featured.brain.weights.length; layerIndex += 1) {
    const weightLayer = featured.brain.weights[layerIndex];
    const glowLayer = state.networkDisplay.connectionGlows[layerIndex];
    const rawSourceLayer = rawLayers[layerIndex];
    const rawTargetLayer = rawLayers[layerIndex + 1];

    for (let rowIndex = 0; rowIndex < weightLayer.length; rowIndex += 1) {
      for (let colIndex = 0; colIndex < weightLayer[rowIndex].length; colIndex += 1) {
        const weight = weightLayer[rowIndex][colIndex];
        const targetGlow = clamp(
          Math.abs((rawSourceLayer[colIndex] || 0) * weight * (rawTargetLayer[rowIndex] || 0)) * 1.4,
          0,
          1
        );
        const currentGlow = glowLayer[rowIndex][colIndex];
        const factor =
          targetGlow > currentGlow
            ? CONFIG.connectionGlowAttack
            : CONFIG.connectionGlowDecay;
        glowLayer[rowIndex][colIndex] = damp(currentGlow, targetGlow, factor);
      }
    }
  }

  return {
    layers: state.networkDisplay.smoothedLayers,
    connections: state.networkDisplay.connectionGlows
  };
}

function buildLayerNodes(x, top, bottom, count) {
  const nodes = [];
  const gap = count === 1 ? 0 : (bottom - top) / (count - 1);
  for (let i = 0; i < count; i += 1) {
    nodes.push({ x, y: top + gap * i });
  }
  return nodes;
}

function drawConnections(fromNodes, toNodes, weights, glows) {
  for (let j = 0; j < toNodes.length; j += 1) {
    for (let i = 0; i < fromNodes.length; i += 1) {
      const weight = weights[j][i];
      const positive = weight >= 0;
      const glow = glows[j][i];

      networkCtx.shadowBlur = 0;
      networkCtx.strokeStyle = positive
        ? "rgba(74, 255, 212, 0.08)"
        : "rgba(255, 109, 179, 0.08)";
      networkCtx.lineWidth = 0.85 + Math.abs(weight) * 0.65;
      networkCtx.beginPath();
      networkCtx.moveTo(fromNodes[i].x, fromNodes[i].y);
      networkCtx.lineTo(toNodes[j].x, toNodes[j].y);
      networkCtx.stroke();

      if (glow < 0.01) {
        continue;
      }

      const alpha = clamp(glow * 0.92 + 0.03, 0.03, 0.95);
      networkCtx.strokeStyle = positive
        ? `rgba(74, 255, 212, ${alpha})`
        : `rgba(255, 109, 179, ${alpha})`;
      networkCtx.lineWidth = 1 + Math.abs(weight) * 1.35 + glow * 0.9;
      networkCtx.shadowBlur = 6 + glow * 20;
      networkCtx.shadowColor = positive
        ? `rgba(74, 255, 212, ${0.18 + glow * 0.55})`
        : `rgba(255, 109, 179, ${0.18 + glow * 0.55})`;
      networkCtx.beginPath();
      networkCtx.moveTo(fromNodes[i].x, fromNodes[i].y);
      networkCtx.lineTo(toNodes[j].x, toNodes[j].y);
      networkCtx.stroke();
    }
  }
  networkCtx.shadowBlur = 0;
}

function drawLayerNodes(nodes, values, labels, colors, labelAlign) {
  const nodeRadius = 9;
  const labelOffset = labelAlign === "outside-right" || labelAlign === "outside-left" ? 24 : 18;
  const labelFont = labelAlign === "center" ? CANVAS_FONTS.small : CANVAS_FONTS.body;

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const value = values[i] || 0;
    const strength = clamp(Math.abs(value), 0, 1);
    const color = colors[i] || "#9de7ff";

    networkCtx.beginPath();
    networkCtx.fillStyle = "rgba(3, 11, 17, 0.96)";
    networkCtx.arc(node.x, node.y, nodeRadius, 0, TAU);
    networkCtx.fill();

    networkCtx.beginPath();
    networkCtx.fillStyle = color;
    networkCtx.shadowBlur = 16;
    networkCtx.shadowColor = color;
    networkCtx.arc(node.x, node.y, 3 + strength * 5.4, 0, TAU);
    networkCtx.fill();
    networkCtx.shadowBlur = 0;

    networkCtx.beginPath();
    networkCtx.strokeStyle = hexToRgba(color, 0.4 + strength * 0.6);
    networkCtx.lineWidth = 2;
    networkCtx.arc(node.x, node.y, nodeRadius, 0, TAU);
    networkCtx.stroke();

    networkCtx.font = labelFont;
    networkCtx.fillStyle = "#ddfaff";
    const label = labels[i];
    if (label) {
      if (labelAlign === "outside-right") {
        networkCtx.textAlign = "left";
        networkCtx.fillText(label, node.x + labelOffset, node.y + 4);
      } else if (labelAlign === "outside-left") {
        networkCtx.textAlign = "right";
        networkCtx.fillText(label, node.x - labelOffset, node.y + 4);
      } else {
        networkCtx.textAlign = "center";
        networkCtx.fillText(label, node.x, node.y - 18);
      }
    }
  }
  networkCtx.textAlign = "left";
}

function renderDetails(featured, displayLayers) {
  const smoothedInputs = displayLayers[0] || [];
  const smoothedOutputs = displayLayers[displayLayers.length - 1] || [];
  const outputMarkup = MOVEMENT_OUTPUT_LABELS.map((label, index) => {
    const value = smoothedOutputs[index] || 0;
    return `
      <div class="signal-line">
        <span>${label}</span>
        <div class="signal-bar"><i style="width:${Math.round(value * 100)}%"></i></div>
        <b>${value.toFixed(2)}</b>
      </div>
    `;
  }).join("");
  const memoryMarkup = Array.from({ length: CONFIG.memoryNeuronCount }, (_, index) => {
    const readValue = smoothedInputs[SENSOR_INPUT_COUNT + index] || 0;
    const writeValue = (smoothedOutputs[MOVEMENT_OUTPUT_COUNT + index] || 0) * 2 - 1;
    return `
      <div class="signal-line memory-signal-line">
        <span>MEM ${index + 1}</span>
        <div class="signal-bar"><i style="width:${Math.round(((readValue + 1) * 0.5) * 100)}%"></i></div>
        <b class="memory-values">R ${formatSignedSignal(readValue)} W ${formatSignedSignal(writeValue)}</b>
      </div>
    `;
  }).join("");

  creatureDetails.innerHTML = `
    <div class="detail-grid">
      <div class="detail-box"><span>CREATURE</span><strong>C-${String(featured.id).padStart(3, "0")}</strong></div>
      <div class="detail-box"><span>AGE</span><strong>${formatAge(featured.age)}</strong></div>
      <div class="detail-box"><span>ENERGY</span><strong>${featured.energy.toFixed(1)}</strong></div>
      <div class="detail-box"><span>GENERATION</span><strong>${featured.generation}</strong></div>
      <div class="detail-box"><span>SEGMENTS</span><strong>${getAdultSegmentCount(featured)}</strong></div>
      <div class="detail-box"><span>OFFSPRING</span><strong>${featured.children}</strong></div>
      <div class="detail-box"><span>STATE</span><strong>${featured.recentAction}</strong></div>
    </div>
    <div class="signal-readout">
      ${outputMarkup}
      <div class="signal-line">
        <span>L EYE FOOD</span>
        <div class="signal-bar sensor-signal-bar"><i style="width:${Math.round((smoothedInputs[0] || 0) * 100)}%"></i></div>
        <b>${(smoothedInputs[1] || 0).toFixed(2)}</b>
      </div>
      <div class="signal-line">
        <span>L EYE BODY</span>
        <div class="signal-bar sensor-signal-bar"><i style="width:${Math.round((smoothedInputs[2] || 0) * 100)}%"></i></div>
        <b>${(smoothedInputs[3] || 0).toFixed(2)}</b>
      </div>
      <div class="signal-line">
        <span>L EYE WALL</span>
        <div class="signal-bar sensor-signal-bar"><i style="width:${Math.round((smoothedInputs[4] || 0) * 100)}%"></i></div>
        <b>${(smoothedInputs[5] || 0).toFixed(2)}</b>
      </div>
      <div class="signal-line">
        <span>R EYE FOOD</span>
        <div class="signal-bar sensor-signal-bar"><i style="width:${Math.round((smoothedInputs[6] || 0) * 100)}%"></i></div>
        <b>${(smoothedInputs[7] || 0).toFixed(2)}</b>
      </div>
      <div class="signal-line">
        <span>R EYE BODY</span>
        <div class="signal-bar sensor-signal-bar"><i style="width:${Math.round((smoothedInputs[8] || 0) * 100)}%"></i></div>
        <b>${(smoothedInputs[9] || 0).toFixed(2)}</b>
      </div>
      <div class="signal-line">
        <span>R EYE WALL</span>
        <div class="signal-bar sensor-signal-bar"><i style="width:${Math.round((smoothedInputs[10] || 0) * 100)}%"></i></div>
        <b>${(smoothedInputs[11] || 0).toFixed(2)}</b>
      </div>
      ${memoryMarkup}
    </div>
  `;
}

function drawNetworkPanel() {
  drawNetworkBackground();

  if (state.startupScene) {
    const progress = clamp(state.startupScene.frame / Math.max(1, state.startupScene.totalFrames), 0, 1);
    networkCtx.fillStyle = "#ddfaff";
    networkCtx.font = CANVAS_FONTS.title;
    networkCtx.fillText("GENE LAB BOOTING", 112, 188);
    networkCtx.font = CANVAS_FONTS.section;
    networkCtx.fillStyle = "#8bbfca";
    networkCtx.fillText("NEURAL LINK WAITING", 114, 214);
    networkCtx.fillStyle = "rgba(74, 255, 212, 0.18)";
    networkCtx.fillRect(86, 236, networkCanvas.width - 172, 8);
    networkCtx.fillStyle = "rgba(255, 241, 123, 0.8)";
    networkCtx.fillRect(86, 236, (networkCanvas.width - 172) * progress, 8);
    creatureDetails.innerHTML = '<p class="placeholder">The habitat is running its boot sequence. Neural tracking will lock onto the longest-living creature when the ecosystem is released.</p>';
    return;
  }

  if (!state.featured || !state.featured.senses) {
    networkCtx.fillStyle = "#8bbfca";
    networkCtx.font = CANVAS_FONTS.title;
    networkCtx.fillText("NO ACTIVE CREATURE", 110, 190);
    networkCtx.font = CANVAS_FONTS.section;
    networkCtx.fillText("WAITING FOR BIOSIGNAL", 88, 216);
    creatureDetails.innerHTML = '<p class="placeholder">The habitat is between lineages. A new population will reseed after extinction.</p>';
    return;
  }

  const featured = state.featured;
  const displayState = updateNetworkDisplayState(featured);
  const layerValues = displayState.layers;
  const inputs = layerValues[0] || [];
  const outputs = layerValues[layerValues.length - 1] || [];
  const hiddenLayers = layerValues.slice(1, -1);
  const layerNodeCounts = [INPUT_LABELS.length, ...CONFIG.hiddenLayerSizes, OUTPUT_LABELS.length];
  const layerNames = [
    "INPUTS",
    ...CONFIG.hiddenLayerSizes.map((_, index) => `H${index + 1}`),
    "OUTPUTS"
  ];
  const xMargin = 128;
  const usableWidth = networkCanvas.width - xMargin * 2;
  const layerXs = layerNodeCounts.map((_, index) =>
    xMargin + (usableWidth * index) / (layerNodeCounts.length - 1)
  );
  const layerNodes = layerNodeCounts.map((count, index) => {
    if (index === 0) {
      return buildLayerNodes(layerXs[index], 34, networkCanvas.height - 34, count);
    }
    if (index === layerNodeCounts.length - 1) {
      return buildLayerNodes(layerXs[index], 118, networkCanvas.height - 118, count);
    }
    return buildLayerNodes(layerXs[index], 58, networkCanvas.height - 58, count);
  });

  for (let layerIndex = 0; layerIndex < featured.brain.weights.length; layerIndex += 1) {
    drawConnections(
      layerNodes[layerIndex],
      layerNodes[layerIndex + 1],
      featured.brain.weights[layerIndex],
      displayState.connections[layerIndex]
    );
  }

  drawLayerNodes(layerNodes[0], inputs, INPUT_LABELS, INPUT_COLORS, "outside-left");
  for (let hiddenIndex = 0; hiddenIndex < hiddenLayers.length; hiddenIndex += 1) {
    drawLayerNodes(
      layerNodes[hiddenIndex + 1],
      hiddenLayers[hiddenIndex],
      Array(CONFIG.hiddenLayerSizes[hiddenIndex]).fill(""),
      Array(CONFIG.hiddenLayerSizes[hiddenIndex]).fill("#9de7ff"),
      "center"
    );
  }
  drawLayerNodes(
    layerNodes[layerNodes.length - 1],
    outputs,
    OUTPUT_LABELS,
    OUTPUT_COLORS,
    "outside-right"
  );

  networkCtx.fillStyle = "#ddfaff";
  networkCtx.font = CANVAS_FONTS.section;
  networkCtx.textAlign = "center";
  for (let i = 0; i < layerNames.length; i += 1) {
    networkCtx.fillText(layerNames[i], layerXs[i], 20);
  }
  networkCtx.textAlign = "left";

  renderDetails(featured, layerValues);
}

function drawFamilyTreePanel() {
  const nodes = Array.from(state.lineageNodes.values());
  const width = familyTreeCanvas.width;
  let height = FAMILY_TREE_MIN_HEIGHT;
  const stickToBottom = familyTreeScroll
    ? familyTreeScroll.scrollTop + familyTreeScroll.clientHeight >= familyTreeScroll.scrollHeight - 28
    : false;

  if (nodes.length === 0) {
    if (familyTreeCanvas.height !== height) {
      familyTreeCanvas.height = height;
      familyTreeCtx.imageSmoothingEnabled = false;
    }
    familyTreeCtx.clearRect(0, 0, width, height);
    familyTreeCtx.fillStyle = "rgba(2, 8, 13, 0.98)";
    familyTreeCtx.fillRect(0, 0, width, height);
    familyTreeCtx.fillStyle = "#ddfaff";
    familyTreeCtx.font = CANVAS_FONTS.section;
    familyTreeCtx.textAlign = "center";
    familyTreeCtx.fillText("LINEAGE MAP WAITING", width * 0.5, height * 0.5 - 10);
    familyTreeCtx.fillStyle = "#8bbfca";
    familyTreeCtx.font = CANVAS_FONTS.body;
    familyTreeCtx.fillText("Founders and offspring will appear here as the habitat runs.", width * 0.5, height * 0.5 + 14);
    familyTreeCtx.textAlign = "left";
    familyTreeStatus.textContent = "Tracking will begin as soon as the first family line is active.";
    return;
  }

  const nodesByGeneration = new Map();
  let maxGeneration = 1;

  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    const generation = Math.max(1, Math.round(node.generation || 1));
    if (!nodesByGeneration.has(generation)) {
      nodesByGeneration.set(generation, []);
    }
    nodesByGeneration.get(generation).push(node);
    if (generation > maxGeneration) {
      maxGeneration = generation;
    }
  }

  for (const generationNodes of nodesByGeneration.values()) {
    generationNodes.sort((a, b) => a.birthOrder - b.birthOrder);
  }

  height = Math.max(
    FAMILY_TREE_MIN_HEIGHT,
    FAMILY_TREE_TOP_PADDING + maxGeneration * FAMILY_TREE_ROW_GAP + FAMILY_TREE_BOTTOM_PADDING
  );
  if (familyTreeCanvas.height !== height) {
    familyTreeCanvas.height = height;
    familyTreeCtx.imageSmoothingEnabled = false;
  }

  familyTreeCtx.clearRect(0, 0, width, height);
  familyTreeCtx.fillStyle = "rgba(2, 8, 13, 0.98)";
  familyTreeCtx.fillRect(0, 0, width, height);

  for (let y = 0; y < height; y += 18) {
    familyTreeCtx.fillStyle = "rgba(255, 255, 255, 0.02)";
    familyTreeCtx.fillRect(0, y, width, 1);
  }

  const positions = new Map();
  const usableWidth = width - FAMILY_TREE_MARGIN_X * 2;

  for (let generation = 1; generation <= maxGeneration; generation += 1) {
    const generationNodes = nodesByGeneration.get(generation) || [];
    const y = FAMILY_TREE_TOP_PADDING + (generation - 1) * FAMILY_TREE_ROW_GAP + 12;

    familyTreeCtx.fillStyle = "rgba(102, 220, 255, 0.08)";
    familyTreeCtx.fillRect(FAMILY_TREE_MARGIN_X - 12, y, width - (FAMILY_TREE_MARGIN_X - 12) * 2, 1);
    familyTreeCtx.fillStyle = generation % 2 === 0
      ? "rgba(255, 241, 123, 0.52)"
      : "rgba(157, 231, 255, 0.54)";
    familyTreeCtx.font = CANVAS_FONTS.compact;
    familyTreeCtx.textAlign = "left";
    familyTreeCtx.fillText(`GEN ${String(generation).padStart(2, "0")}`, 12, y + 4);

    if (generationNodes.length === 0) {
      continue;
    }

    const spacing = usableWidth / (generationNodes.length + 1);
    for (let index = 0; index < generationNodes.length; index += 1) {
      const node = generationNodes[index];
      positions.set(node.id, {
        x: FAMILY_TREE_MARGIN_X + spacing * (index + 1),
        y
      });
    }
  }

  const focusId = getLineageFocusId();
  const trail = getLineageTrailSet(focusId);
  const sortedNodes = nodes.slice().sort((a, b) =>
    a.generation - b.generation || a.birthOrder - b.birthOrder
  );

  familyTreeCtx.save();
  familyTreeCtx.globalCompositeOperation = "lighter";
  for (let i = 0; i < sortedNodes.length; i += 1) {
    const node = sortedNodes[i];
    if (node.parentId === null || node.parentId === undefined) {
      continue;
    }

    const parentPos = positions.get(node.parentId);
    const childPos = positions.get(node.id);
    if (!parentPos || !childPos) {
      continue;
    }

    const highlighted = trail.has(node.id) && trail.has(node.parentId);
    const controlY = (parentPos.y + childPos.y) * 0.5;
    familyTreeCtx.strokeStyle = highlighted
      ? "rgba(255, 241, 123, 0.84)"
      : "rgba(102, 220, 255, 0.18)";
    familyTreeCtx.lineWidth = highlighted ? 2.4 : 1;
    familyTreeCtx.beginPath();
    familyTreeCtx.moveTo(parentPos.x, parentPos.y + 6);
    familyTreeCtx.bezierCurveTo(parentPos.x, controlY, childPos.x, controlY, childPos.x, childPos.y - 6);
    familyTreeCtx.stroke();

    if (highlighted) {
      familyTreeCtx.strokeStyle = "rgba(74, 255, 212, 0.42)";
      familyTreeCtx.lineWidth = 1;
      familyTreeCtx.beginPath();
      familyTreeCtx.moveTo(parentPos.x, parentPos.y + 6);
      familyTreeCtx.bezierCurveTo(parentPos.x, controlY, childPos.x, controlY, childPos.x, childPos.y - 6);
      familyTreeCtx.stroke();
    }
  }
  familyTreeCtx.restore();

  for (let i = 0; i < sortedNodes.length; i += 1) {
    const node = sortedNodes[i];
    const position = positions.get(node.id);
    if (!position) {
      continue;
    }

    const generationNodes = nodesByGeneration.get(node.generation) || [];
    const highlighted = trail.has(node.id);
    const alive = node.alive;
    const labelVisible = highlighted || (alive && generationNodes.length <= 8);
    const nodeSize = highlighted
      ? 10 + Math.min(4, node.offspringCount * 0.6)
      : 6 + Math.min(3, node.offspringCount * 0.25);
    const fillColor = alive
      ? `hsla(${node.hue}, 84%, 64%, ${highlighted ? 0.98 : 0.82})`
      : highlighted
        ? "rgba(255, 241, 123, 0.64)"
        : "rgba(139, 191, 202, 0.34)";

    familyTreeCtx.save();
    familyTreeCtx.shadowBlur = highlighted ? 18 : alive ? 8 : 0;
    familyTreeCtx.shadowColor = highlighted ? "rgba(255, 241, 123, 0.72)" : fillColor;
    familyTreeCtx.fillStyle = fillColor;
    familyTreeCtx.fillRect(
      Math.round(position.x - nodeSize * 0.5),
      Math.round(position.y - nodeSize * 0.5),
      Math.round(nodeSize),
      Math.round(nodeSize)
    );
    familyTreeCtx.shadowBlur = 0;

    familyTreeCtx.strokeStyle = highlighted
      ? "rgba(255, 241, 123, 0.96)"
      : alive
        ? "rgba(221, 250, 255, 0.42)"
        : "rgba(102, 220, 255, 0.18)";
    familyTreeCtx.lineWidth = highlighted ? 2 : 1;
    familyTreeCtx.strokeRect(
      Math.round(position.x - nodeSize * 0.5) - 0.5,
      Math.round(position.y - nodeSize * 0.5) - 0.5,
      Math.round(nodeSize),
      Math.round(nodeSize)
    );

    if (!alive) {
      familyTreeCtx.strokeStyle = "rgba(255, 109, 179, 0.4)";
      familyTreeCtx.beginPath();
      familyTreeCtx.moveTo(position.x - nodeSize * 0.36, position.y - nodeSize * 0.36);
      familyTreeCtx.lineTo(position.x + nodeSize * 0.36, position.y + nodeSize * 0.36);
      familyTreeCtx.moveTo(position.x + nodeSize * 0.36, position.y - nodeSize * 0.36);
      familyTreeCtx.lineTo(position.x - nodeSize * 0.36, position.y + nodeSize * 0.36);
      familyTreeCtx.stroke();
    }

    if (labelVisible) {
      familyTreeCtx.font = highlighted ? CANVAS_FONTS.body : CANVAS_FONTS.tiny;
      familyTreeCtx.fillStyle = highlighted ? "#fff17b" : "rgba(221, 250, 255, 0.74)";
      familyTreeCtx.textAlign = "center";
      familyTreeCtx.fillText(
        `C${String(node.id).padStart(3, "0")}`,
        position.x,
        position.y - nodeSize * 0.7 - 4
      );
    }

    familyTreeCtx.restore();
  }

  familyTreeCtx.textAlign = "left";

  if (focusId && trail.size > 0) {
    const focusNode = state.lineageNodes.get(focusId);
    familyTreeStatus.textContent = focusNode
      ? `Highlight locked on C-${String(focusNode.id).padStart(3, "0")} // ${trail.size} ancestors in the inheritance trail. Scroll to inspect older branches.`
      : "Live ancestry map active. Scroll to inspect older branches.";
  } else {
    familyTreeStatus.textContent = "Live ancestry map active. Scroll to inspect older branches.";
  }

  if (familyTreeScroll && stickToBottom) {
    familyTreeScroll.scrollTop = familyTreeScroll.scrollHeight;
  }
}

function updateStats() {
  populationStat.textContent = String(getLivingCreaturesCount()).padStart(2, "0");
  foodStat.textContent = String(state.foods.length).padStart(2, "0");
  birthStat.textContent = String(state.births).padStart(2, "0");
  deathStat.textContent = String(state.deaths).padStart(2, "0");
  oldestStat.textContent = state.featured ? formatAge(state.featured.age) : "--";
  extinctionStat.textContent = String(state.extinctionCount).padStart(2, "0");
  runtimeStat.textContent = formatRunTimer(state.tick);
  lineageStat.textContent = formatRunTimer(state.lineageTick);
  updateBrainBankUi();
  updateInfluenceToolUi();
}

let lastTime = 0;
let accumulator = 0;
const step = 1000 / 60;

function frame(timestamp) {
  if (!lastTime) {
    lastTime = timestamp;
  }

  const delta = Math.min(40, timestamp - lastTime);
  lastTime = timestamp;

  if (state.brainBankModalOpen) {
    accumulator = 0;
    updateStats();
    drawBrainBankHabitatView();
    requestAnimationFrame(frame);
    return;
  }

  accumulator += delta;

  while (accumulator >= step) {
    if (state.startupScene) {
      updateStartupScene();
    } else {
      updateSimulation();
    }
    updateExtinctionAudio();
    accumulator -= step;
  }

  renderSimulationPanels();
  drawBrainBankHabitatView();
  drawHonoredWormCanvases();
  requestAnimationFrame(frame);
}

buildControlDeck();
initializeDataPanelToggles();
resetControlsButton.addEventListener("click", resetControlDeck);
sampleLongestButton.addEventListener("click", sampleFeaturedCreatureToBank);
openHonoredWormsButton.addEventListener("click", () => setHonoredWormsModalOpen(true));
openBrainBankButton.addEventListener("click", () => setBrainBankModalOpen(true));
importBrainButton.addEventListener("click", () => brainBankFileInput.click());
closeBrainBankButton.addEventListener("click", () => setBrainBankModalOpen(false));
closeHonoredWormsButton.addEventListener("click", () => setHonoredWormsModalOpen(false));
brainBankModal.addEventListener("click", (event) => {
  if (event.target === brainBankModal) {
    setBrainBankModalOpen(false);
  }
});
honoredWormsModal.addEventListener("click", (event) => {
  if (event.target === honoredWormsModal) {
    setHonoredWormsModalOpen(false);
  }
});
brainBankList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const entryId = Number(button.dataset.entryId);
  if (button.dataset.action === "release") {
    releaseBrainBankClone(entryId);
    return;
  }
  if (button.dataset.action === "export") {
    exportBrainBankEntry(entryId);
  }
});
honoredWormsList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-honored-action]");
  if (!button) {
    return;
  }

  const entryId = button.dataset.honoredEntryId;
  if (button.dataset.honoredAction === "spawn") {
    spawnHonoredWorm(entryId).catch(() => {
      setBrainBankMessage("The selected honored specimen could not be spawned into the habitat.");
    });
  }
});
brainBankFileInput.addEventListener("change", async () => {
  try {
    await importBrainBankFiles(brainBankFileInput.files);
  } catch (error) {
    setBrainBankMessage("The selected file could not be imported.");
  } finally {
    brainBankFileInput.value = "";
  }
});
worldCanvas.addEventListener("pointerdown", handleInfluencePointerDown);
worldCanvas.addEventListener("pointermove", handleInfluencePointerMove);
worldCanvas.addEventListener("pointerup", handleInfluencePointerEnd);
worldCanvas.addEventListener("pointercancel", handleInfluencePointerEnd);
worldCanvas.addEventListener("lostpointercapture", handleInfluencePointerEnd);
window.addEventListener("pointerdown", unlockAudioContext, { passive: true });
window.addEventListener("keydown", unlockAudioContext);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.brainBankModalOpen) {
    setBrainBankModalOpen(false);
  }
  if (event.key === "Escape" && state.honoredWormsModalOpen) {
    setHonoredWormsModalOpen(false);
  }
});
renderBrainBankList();
renderHonoredWormsList();
updateBrainBankUi();
seedWorld();
state.startupScene = createStartupScene();
chooseFeaturedCreature();
updateStats();
renderSimulationPanels();
requestAnimationFrame(frame);
loadHonoredWorms().catch(() => {
  state.honoredWormLoadState = "error";
  updateBrainBankUi();
});
restoreBrainBankFromDiskOnStartup().catch(() => {
  setBrainBankMessage("Brain bank startup import failed. You can still sample and save new brains manually.");
});
