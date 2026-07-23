<template>
  <div class="meteor-shower">
    <div
      v-for="(meteor, index) in meteors"
      :key="`meteor-${index}`"
      class="meteor"
      :data-variant="meteor.variant"
      :style="{
        top: meteor.top,
        left: meteor.left,
        animationDelay: meteor.delay,
        animationDuration: meteor.duration,
        '--meteor-tilt': meteor.tilt,
        '--meteor-travel-x': meteor.travelX,
        '--meteor-travel-y': meteor.travelY,
        '--meteor-length': meteor.length,
        '--meteor-width': meteor.width,
        '--meteor-peak-opacity': meteor.peakOpacity,
        '--meteor-blur': meteor.blur
      }"
      @animationiteration="() => relaunchMeteor(index)"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

type MeteorLayerType = 'back' | 'front';

// A through meteor stays lit until it leaves the frame; a burnout one dies mid-sky
type MeteorVariantType = 'through' | 'burnout';

// Sampled by each meteor's random depth: 0 = far away, 1 = close up
interface DepthRange {
  far: number;
  near: number;
}

interface MeteorLayerConfig {
  count: number;
  length: DepthRange;
  width: DepthRange;
  peakOpacity: DepthRange;
  blur: DepthRange;
  travel: DepthRange;
  duration: DepthRange;
}

interface MeteorData {
  variant: MeteorVariantType;
  travelDistance: number;
  streakLength: number;
  left: string;
  top: string;
  tilt: string;
  travelX: string;
  travelY: string;
  length: string;
  width: string;
  peakOpacity: string;
  blur: string;
  duration: string;
  delay: string;
}

interface Props {
  layer: MeteorLayerType;
}

interface NumberRange {
  min: number;
  max: number;
}

// A spawn zone anchors the streak's head (its leading bottom tip):
// left is % of the viewport width, headTop is % of the viewport height
interface SpawnZone {
  left: NumberRange;
  headTop: NumberRange;
}

interface SpawnPoint {
  left: string;
  top: string;
}

const ANGLE_FROM_VERTICAL_DEG = 25;
const ANGLE_JITTER_DEG = 3;
const DURATION_JITTER_MIN = 0.85;
const DURATION_JITTER_MAX = 1.15;
const THROUGH_VARIANT_CHANCE = 0.65;

// Through meteors need enough travel to cross the bottom edge (or drift out the left
// side) even from the highest spawn lane, so their light never cuts out inside the frame
const THROUGH_EXIT_TARGET_VH = 108;

// Meteors fly down-left, so off-screen entries come from beyond the top or the right
// edge; the small remaining share ignites mid-frame like a meteor flaring up in the sky
const TOP_EDGE_SPAWN_CHANCE = 0.64;
const RIGHT_EDGE_SPAWN_CHANCE = 0.21;

// The top band stops where the right-edge band takes over: projected onto the axis
// perpendicular to the flight direction the two zones must not overlap, otherwise the
// diagonal corridor they both feed (through the bottom-right) gets double the flux
const TOP_EDGE_ZONE: SpawnZone = {
  left: {
    min: 0,
    max: 105,
  },
  headTop: {
    min: -28,
    max: -3,
  },
};

// Kept lean: burnout meteors entering here stay lit entirely inside the lower-right
// quarter, so this zone overfills that corner the moment it gets too much weight
const RIGHT_EDGE_ZONE: SpawnZone = {
  left: {
    min: 102,
    max: 128,
  },
  headTop: {
    min: -5,
    max: 28,
  },
};

// Leans slightly left to feed the lower-left reaches that no edge zone favors
const MID_FRAME_ZONE: SpawnZone = {
  left: {
    min: 5,
    max: 90,
  },
  headTop: {
    min: 2,
    max: 45,
  },
};

// Enough travel to cross the bottom edge even from the highest possible spawn lane
const THROUGH_EXIT_TRAVEL_VH = THROUGH_EXIT_TARGET_VH - TOP_EDGE_ZONE.headTop.min;

// The back layer is a sparse distant drizzle behind the cube; the front layer is a few
// long bright streaks crossing over it — together they wrap the cube in parallax depth
const LAYER_CONFIGS: Record<MeteorLayerType, MeteorLayerConfig> = {
  back: {
    count: 9,
    length: {
      far: 60,
      near: 150,
    },
    width: {
      far: 1,
      near: 2,
    },
    peakOpacity: {
      far: 0.25,
      near: 0.7,
    },
    blur: {
      far: 1.6,
      near: 0.4,
    },
    travel: {
      far: 60,
      near: 85,
    },
    duration: {
      far: 2.5,
      near: 1.9,
    },
  },
  front: {
    count: 4,
    length: {
      far: 150,
      near: 340,
    },
    width: {
      far: 2,
      near: 3,
    },
    peakOpacity: {
      far: 0.85,
      near: 1,
    },
    blur: {
      far: 0,
      near: 0,
    },
    travel: {
      far: 90,
      near: 130,
    },
    duration: {
      far: 1.95,
      near: 0.85,
    },
  },
};

const props = defineProps<Props>();

const meteors = ref<MeteorData[]>([]);

const layerConfig = LAYER_CONFIGS[props.layer];

const randomBetween = (min: number, max: number): number => min + Math.random() * (max - min);

const sampleDepthRange = (range: DepthRange, depth: number): number => (
  range.far + (range.near - range.far) * depth
);

const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

// A positive clockwise tilt leans the streak left of vertical, so the matching
// horizontal drift is negative — the streak always flies along its own axis
const getHorizontalDrift = (angleDegrees: number, travelDistance: number): number => (
  -Math.tan(degreesToRadians(angleDegrees)) * travelDistance
);

const createTiltAngle = (): number => randomBetween(
  ANGLE_FROM_VERTICAL_DEG - ANGLE_JITTER_DEG,
  ANGLE_FROM_VERTICAL_DEG + ANGLE_JITTER_DEG,
);

const pickSpawnZone = (): SpawnZone => {
  const roll = Math.random();

  if (roll < TOP_EDGE_SPAWN_CHANCE) {
    return TOP_EDGE_ZONE;
  }

  if (roll < TOP_EDGE_SPAWN_CHANCE + RIGHT_EDGE_SPAWN_CHANCE) {
    return RIGHT_EDGE_ZONE;
  }

  return MID_FRAME_ZONE;
};

const createSpawnPoint = (streakLength: number): SpawnPoint => {
  const zone = pickSpawnZone();

  return {
    left: `${randomBetween(zone.left.min, zone.left.max)}%`,

    // The zone anchors the head, so the strip's top sits one streak length higher —
    // off-screen zones therefore hide the whole streak at spawn, head included
    top: `calc(${randomBetween(zone.headTop.min, zone.headTop.max)}% - ${streakLength}px)`,
  };
};

const createMeteor = (): MeteorData => {
  const depth = Math.random();
  const angleDegrees = createTiltAngle();
  const variant: MeteorVariantType = Math.random() < THROUGH_VARIANT_CHANCE ? 'through' : 'burnout';
  const baseTravel = sampleDepthRange(layerConfig.travel, depth);
  const travelDistance = variant === 'through' ? Math.max(baseTravel, THROUGH_EXIT_TRAVEL_VH) : baseTravel;
  const streakLength = sampleDepthRange(layerConfig.length, depth);

  // Stretching travel stretches duration by the same factor, keeping the visible speed
  const duration = sampleDepthRange(layerConfig.duration, depth)
    * randomBetween(DURATION_JITTER_MIN, DURATION_JITTER_MAX)
    * (travelDistance / baseTravel);
  const spawnPoint = createSpawnPoint(streakLength);

  return {
    variant,
    travelDistance,
    streakLength,
    left: spawnPoint.left,
    top: spawnPoint.top,
    tilt: `${angleDegrees}deg`,
    travelX: `${getHorizontalDrift(angleDegrees, travelDistance)}vh`,
    travelY: `${travelDistance}vh`,
    length: `${streakLength}px`,
    width: `${sampleDepthRange(layerConfig.width, depth)}px`,
    peakOpacity: `${sampleDepthRange(layerConfig.peakOpacity, depth)}`,
    blur: `${sampleDepthRange(layerConfig.blur, depth)}px`,
    duration: `${duration}s`,
    delay: `${Math.random() * duration}s`,
  };
};

// Every cycle respawns the meteor on a fresh lane with a fresh tilt; duration and
// delay stay untouched because changing them mid-animation shifts the running phase
const relaunchMeteor = (index: number): void => {
  meteors.value = meteors.value.map((meteor, meteorIndex) => {
    if (meteorIndex !== index) {
      return meteor;
    }

    const angleDegrees = createTiltAngle();
    const spawnPoint = createSpawnPoint(meteor.streakLength);

    return {
      ...meteor,
      left: spawnPoint.left,
      top: spawnPoint.top,
      tilt: `${angleDegrees}deg`,
      travelX: `${getHorizontalDrift(angleDegrees, meteor.travelDistance)}vh`,
    };
  });
};

const initializeMeteors = (): void => {
  meteors.value = Array.from({ length: layerConfig.count }, () => createMeteor());
};

onMounted(initializeMeteors);
</script>

<style scoped>
.meteor-shower {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* The element itself is the tail: a thin rounded streak whose gradient fades upward
   away from the head; translate3d and rotate share the same per-meteor angle */
.meteor {
  position: absolute;
  width: var(--meteor-width);
  height: var(--meteor-length);
  background: linear-gradient(to top, #f2f7ff 0%, #b9cdec 12%, #5173ab99 34%, #5173ab26 62%, #5173ab00 100%);
  border-radius: calc(var(--meteor-width) / 2);
  opacity: 0;
  transform: translate3d(0, 0, 0) rotate(var(--meteor-tilt));
  filter: blur(var(--meteor-blur));
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* Most meteors stay lit until they leave the frame; the rest visibly burn out mid-sky */
.meteor[data-variant="through"] {
  animation-name: meteor-fall-through;
}

.meteor[data-variant="burnout"] {
  animation-name: meteor-fall-burnout;
}

/* The glowing head riding the leading tip of the streak */
.meteor::after {
  position: absolute;
  bottom: calc(var(--meteor-width) * -0.5);
  left: 50%;
  width: calc(var(--meteor-width) * 2);
  height: calc(var(--meteor-width) * 2);
  background: #f4f9ff;
  border-radius: 50%;
  box-shadow: 0 0 6px 1px #dcecffcc, 0 0 16px 5px #5173ab59;
  transform: translateX(-50%);
  content: "";
}

/* Both variants share the same movement window (0-78%, then rest unseen until the next
   cycle), so speed math is identical — they differ only in how long the light survives.
   A through meteor holds full brightness almost to the end of its travel, and its travel
   is sized to end past the screen edge, so it never fades in view */
@keyframes meteor-fall-through {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(var(--meteor-tilt));
  }

  8% {
    opacity: var(--meteor-peak-opacity);
  }

  74% {
    opacity: var(--meteor-peak-opacity);
  }

  78%,
  100% {
    opacity: 0;
    transform: translate3d(var(--meteor-travel-x), var(--meteor-travel-y), 0) rotate(var(--meteor-tilt));
  }
}

/* A burnout meteor dims over the last quarter of its flight and dies mid-sky */
@keyframes meteor-fall-burnout {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(var(--meteor-tilt));
  }

  10% {
    opacity: var(--meteor-peak-opacity);
  }

  60% {
    opacity: var(--meteor-peak-opacity);
  }

  78%,
  100% {
    opacity: 0;
    transform: translate3d(var(--meteor-travel-x), var(--meteor-travel-y), 0) rotate(var(--meteor-tilt));
  }
}
</style>
