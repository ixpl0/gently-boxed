<template>
  <div
    class="glitch-field"
    :data-layer="layer"
  >
    <!-- Painted before the bars so a bar flash corrupts the band too -->
    <div
      v-if="layer === 'front'"
      class="interference-band"
    />

    <div
      v-for="(bar, index) in bars"
      :key="`bar-${index}`"
      class="glitch-bar"
      :style="{
        top: bar.top,
        height: bar.height,
        animationDelay: bar.delay,
        animationDuration: bar.duration,
        '--bar-shift-a': bar.shiftA,
        '--bar-shift-b': bar.shiftB,
        '--bar-peak-opacity': bar.peakOpacity
      }"
      @animationiteration="() => relaunchBar(index)"
    />

    <template v-if="layer === 'front'">
      <div class="static-noise" />
      <div class="scanlines" />

      <!-- Referenced by the page's .frame-glitch class: the whole rendered frame
           (background, cube, overlays) gets torn row-wise for one short burst -->
      <svg
        class="frame-filter-defs"
        aria-hidden="true"
      >
        <filter
          id="glitch-frame-filter"
          x="-2%"
          y="-2%"
          width="104%"
          height="104%"
        >
          <feTurbulence
            type="turbulence"
            baseFrequency="0.002 0.6"
            numOctaves="1"
            :seed="turbulenceSeed"
            result="row-noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="row-noise"
            scale="15"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount, onMounted, ref,
} from 'vue';

type GlitchLayerType = 'back' | 'front';

interface NumberRange {
  min: number;
  max: number;
}

interface GlitchLayerConfig {
  barCount: number;
  barHeight: NumberRange;
  barCycle: NumberRange;
  barShift: NumberRange;
  barPeakOpacity: NumberRange;
}

interface GlitchBarData {
  top: string;
  height: string;
  duration: string;
  delay: string;
  shiftA: string;
  shiftB: string;
  peakOpacity: string;
}

interface Props {
  layer: GlitchLayerType;
}

// Vertical band the bars can occupy; the edges are avoided so a flash never hugs the frame
const BAR_TOP_RANGE: NumberRange = {
  min: 4,
  max: 88,
};

// Occasionally a bar respawns as a thin sliver instead of its layer's normal height
const THIN_BAR_CHANCE = 0.18;

const THIN_BAR_HEIGHT: NumberRange = {
  min: 2,
  max: 5,
};

// Seconds of calm between frame displacement bursts, and how long a single burst lasts
const FRAME_GLITCH_PAUSE_SECONDS: NumberRange = {
  min: 2.1,
  max: 4.4,
};

const FRAME_GLITCH_BURST_SECONDS: NumberRange = {
  min: 0.06,
  max: 0.11,
};

// The cube's arrival spin lasts 2.1s (TheCube's transition), and the shortest random
// pause matches it — the first burst waits the spin out so the whole-frame filter never
// rasterizes the scene mid-rotation
const ARRIVAL_SPIN_GRACE_SECONDS = 2.1;

// The flash window inside glitch-bar-flash spans ~2.4% of the cycle, so these cycle
// lengths put every visible flash in the 75-150ms range — snappy, not lingering.
// The back layer is dim lit strips in the void around the cube; the front layer's bars
// corrupt whatever is painted beneath them (cube included) via backdrop-filter
const LAYER_CONFIGS: Record<GlitchLayerType, GlitchLayerConfig> = {
  back: {
    barCount: 4,
    barHeight: {
      min: 6,
      max: 20,
    },
    barCycle: {
      min: 3.9,
      max: 6.3,
    },
    barShift: {
      min: 4,
      max: 12,
    },
    barPeakOpacity: {
      min: 0.3,
      max: 0.6,
    },
  },
  front: {
    barCount: 3,
    barHeight: {
      min: 8,
      max: 16,
    },
    barCycle: {
      min: 3.1,
      max: 5.4,
    },
    barShift: {
      min: 4,
      max: 10,
    },
    barPeakOpacity: {
      min: 1,
      max: 1,
    },
  },
};

const props = defineProps<Props>();

const emit = defineEmits<{
  frameGlitch: [isActive: boolean];
}>();

const layerConfig = LAYER_CONFIGS[props.layer];

const bars = ref<GlitchBarData[]>([]);

// Re-randomised right before every burst so each displacement tears different rows
const turbulenceSeed = ref(7);

const randomBetween = (min: number, max: number): number => min + Math.random() * (max - min);

const randomFromRange = (range: NumberRange): number => randomBetween(range.min, range.max);

// The two in-flash positions snap to opposite vertical offsets, like a scanline row
// losing sync twice; a horizontal shift would be invisible on a full-width strip
const createShiftPair = (): Pick<GlitchBarData, 'shiftA' | 'shiftB'> => {
  const direction = Math.random() < 0.5 ? -1 : 1;

  return {
    shiftA: `${direction * randomFromRange(layerConfig.barShift)}px`,
    shiftB: `${-direction * randomFromRange(layerConfig.barShift)}px`,
  };
};

const createBarHeight = (): string => {
  const height = Math.random() < THIN_BAR_CHANCE
    ? randomFromRange(THIN_BAR_HEIGHT)
    : randomFromRange(layerConfig.barHeight);

  return `${height}px`;
};

const createBar = (): GlitchBarData => {
  const duration = randomFromRange(layerConfig.barCycle);

  return {
    ...createShiftPair(),
    top: `${randomFromRange(BAR_TOP_RANGE)}%`,
    height: createBarHeight(),
    duration: `${duration}s`,
    delay: `${Math.random() * duration}s`,
    peakOpacity: `${randomFromRange(layerConfig.barPeakOpacity)}`,
  };
};

// Every cycle the bar reappears on a fresh line with fresh jitter and height (safe to
// change while it is invisible); duration and delay stay untouched because changing
// them mid-animation shifts the running phase
const relaunchBar = (index: number): void => {
  bars.value = bars.value.map((bar, barIndex) => {
    if (barIndex !== index) {
      return bar;
    }

    return {
      ...bar,
      ...createShiftPair(),
      top: `${randomFromRange(BAR_TOP_RANGE)}%`,
      height: createBarHeight(),
    };
  });
};

let frameGlitchTimerId: number | undefined;

// One recursive timer alternates calm pauses with short displacement bursts; the page
// owns the element the filter applies to, so the emitted boolean is the whole contract
const scheduleFrameGlitchBurst = (extraPauseSeconds = 0): void => {
  frameGlitchTimerId = window.setTimeout(() => {
    turbulenceSeed.value = Math.floor(Math.random() * 1000);
    emit('frameGlitch', true);

    frameGlitchTimerId = window.setTimeout(() => {
      emit('frameGlitch', false);
      scheduleFrameGlitchBurst();
    }, randomFromRange(FRAME_GLITCH_BURST_SECONDS) * 1000);
  }, (randomFromRange(FRAME_GLITCH_PAUSE_SECONDS) + extraPauseSeconds) * 1000);
};

const initializeBars = (): void => {
  bars.value = Array.from({ length: layerConfig.barCount }, () => createBar());
};

onMounted(() => {
  initializeBars();

  if (props.layer === 'front') {
    scheduleFrameGlitchBurst(ARRIVAL_SPIN_GRACE_SECONDS);
  }
});

onBeforeUnmount(() => {
  if (frameGlitchTimerId !== undefined) {
    window.clearTimeout(frameGlitchTimerId);
  }

  if (props.layer === 'front') {
    emit('frameGlitch', false);
  }
});
</script>

<style scoped>
.glitch-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* Hidden between flashes: visibility (not just opacity) keeps the dormant bars out of
   the render tree, so the front layer's backdrop-filter surfaces only exist for the
   few frames a flash is actually visible */
.glitch-bar {
  position: absolute;
  left: 0;
  width: 100%;
  opacity: 0;
  visibility: hidden;
  transform: translate3d(0, 0, 0);
  animation-name: glitch-bar-flash;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.glitch-field[data-layer="front"] .glitch-bar {
  backdrop-filter: invert(0.85) hue-rotate(50deg) contrast(1.4);
}

.glitch-field[data-layer="back"] .glitch-bar {
  background: rgb(from var(--color-terminal) r g b / 40%);
}

/* A single slow interference wave rolling over the whole scene — cube included — at
   the constant pace of a real CRT roll bar; it starts above the frame, so it always
   slides in instead of popping */
.interference-band {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 140px;
  background: linear-gradient(180deg, rgb(from var(--color-accent-bottom) r g b / 0%) 0%, rgb(from var(--color-accent-bottom) r g b / 12%) 50%, rgb(from var(--color-accent-bottom) r g b / 0%) 100%);
  transform: translate3d(0, -140px, 0);
  animation: interference-roll 8.5s linear infinite;
}

/* The texture itself is static — a pre-baked feTurbulence tile; the motion is faked by
   opacity flickers and abrupt background-position jumps, so the filter never re-runs */
.static-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='280' height='280' filter='url(%23n)' opacity='0.5'/></svg>");
  opacity: 0;
  mix-blend-mode: screen;
  animation: static-noise-flash 5.7s linear infinite;
}

/* The only always-on element, so it fades in over the same 2s the page's cross-fade
   gives leaving layers — otherwise the pattern pops while the cube is still spinning in */
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, #c8beff0a 0, #c8beff0a 1px, #c8beff00 1px, #c8beff00 3px);
  animation: glitch-fade-in 2s ease;
}

.frame-filter-defs {
  position: absolute;
  width: 0;
  height: 0;
}

/* Flash windows sit at the cycle's tail so animationiteration respawns the bar right
   after it was last seen; duplicated tight percentages make every change a hard cut */
@keyframes glitch-bar-flash {
  0%,
  96.9% {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(0, 0, 0);
  }

  97%,
  98.1% {
    opacity: var(--bar-peak-opacity);
    visibility: visible;
    transform: translate3d(0, var(--bar-shift-a), 0);
  }

  98.2%,
  99.3% {
    opacity: var(--bar-peak-opacity);
    visibility: visible;
    transform: translate3d(0, var(--bar-shift-b), 0);
  }

  99.4%,
  100% {
    opacity: 0;
    visibility: hidden;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes glitch-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes static-noise-flash {
  0%,
  96.4% {
    opacity: 0;
  }

  96.5%,
  97.2% {
    background-position: 0 0;
    opacity: 0.4;
  }

  97.3%,
  98% {
    background-position: 70px 110px;
    opacity: 0.28;
  }

  98.1%,
  98.8% {
    background-position: -50px 40px;
    opacity: 0.4;
  }

  98.9%,
  100% {
    opacity: 0;
  }
}

@keyframes interference-roll {
  0% {
    transform: translate3d(0, -140px, 0);
  }

  100% {
    transform: translate3d(0, 100vh, 0);
  }
}
</style>
