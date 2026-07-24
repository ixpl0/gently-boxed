<template>
  <div
    ref="fieldElement"
    class="glitch-field"
    :data-layer="layer"
  >
    <!-- Painted before the bars so a bar flash corrupts the band too -->
    <div
      v-if="layer === 'front'"
      ref="bandElement"
      class="interference-band"
    >
      <div class="band-noise" />
    </div>

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

        <!-- Referenced by the page's .band-warp class: two chained displacement
             passes that both ride the rolling interference band; everywhere else the
             maps stay the neutral flood, so the rest of the frame passes through
             untouched. Pass one is the latex dent: a pre-baked vertical pull gradient
             (feImage, only G varies) drags the frame down along the band's travel —
             a long stretched wake above, a short compressed bow below — like a weight
             hauled across stretched latex. Pass two is the CRT tear: a live crossfade
             of two feTurbulence row-noise fields (x frequency 0, so every row shifts
             as a whole scanline) bends rows horizontally inside a stripe. Both maps
             are generated at a fixed origin and translated to the measured band
             position each frame (the tear via feOffset dy, the dent via its feImage
             y), so the deformation travels with the band instead of being revealed
             by it. The rAF loop slides the crossfade's arithmetic weights along a
             cosine, so the bend writhes smoothly from one profile into the next, and
             each field re-rolls its seed only at the moment its weight touches zero —
             never a visible cut. The feColorMatrix pins G to 0.5 (the tear never
             shifts rows vertically) and the static feImage gradient fades the
             stripe's alpha toward both ends before it lands over the flood.
             sRGB interpolation is load-bearing — in the default linearRGB the
             #808080 flood stops being 0.5 and the whole frame shifts sideways -->
        <filter
          id="interference-warp-filter"
          color-interpolation-filters="sRGB"
          x="-4%"
          y="-2%"
          width="108%"
          height="104%"
        >
          <feFlood
            flood-color="#808080"
            result="neutral-map"
          />
          <feTurbulence
            ref="tearNoiseElementA"
            type="fractalNoise"
            baseFrequency="0 0.05"
            numOctaves="4"
            seed="7"
            :y="-BAND_WARP_NOISE_BLEED"
            :height="BAND_WARP_STRIPE_HEIGHT + BAND_WARP_NOISE_BLEED * 2"
            result="tear-noise-a"
          />
          <feTurbulence
            ref="tearNoiseElementB"
            type="fractalNoise"
            baseFrequency="0 0.05"
            numOctaves="4"
            seed="211"
            :y="-BAND_WARP_NOISE_BLEED"
            :height="BAND_WARP_STRIPE_HEIGHT + BAND_WARP_NOISE_BLEED * 2"
            result="tear-noise-b"
          />
          <feComposite
            ref="tearBlendElement"
            in="tear-noise-a"
            in2="tear-noise-b"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="0"
            k4="0"
            result="blended-noise"
          />
          <feColorMatrix
            in="blended-noise"
            type="matrix"
            values="1.4 0 0 0 -0.2  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1"
            result="tear-noise"
          />
          <!-- The explicit subregion height (and the y the rAF loop writes) is
               load-bearing: unset, the subregion defaults to the union of the
               inputs' subregions — the fixed strip at the top — and hard-clips
               the translated noise right back where it came from -->
          <feOffset
            ref="tearOffsetElement"
            in="tear-noise"
            dx="0"
            dy="0"
            :height="BAND_WARP_STRIPE_HEIGHT + BAND_WARP_NOISE_BLEED * 2"
            result="tear-noise-placed"
          />
          <feImage
            ref="warpMaskImage"
            x="0"
            preserveAspectRatio="none"
            result="stripe-fade"
          />
          <feComposite
            in="tear-noise-placed"
            in2="stripe-fade"
            operator="in"
            result="stripe-noise"
          />
          <feComposite
            in="stripe-noise"
            in2="neutral-map"
            operator="over"
            result="warp-map"
          />
          <feImage
            ref="dentProfileImage"
            x="0"
            y="0"
            width="0"
            height="0"
            preserveAspectRatio="none"
            :href="DENT_PROFILE_URI"
            result="dent-profile"
          />
          <feComposite
            in="dent-profile"
            in2="neutral-map"
            operator="over"
            result="dent-map"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="dent-map"
            scale="56"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dented-frame"
          />
          <feDisplacementMap
            in="dented-frame"
            in2="warp-map"
            scale="44"
            xChannelSelector="R"
            yChannelSelector="G"
            result="torn-frame"
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

// Mirrors where glitch-bar-flash opens its flash window: the visible part sits at the very
// tail of the cycle, so a freshly mounted bar would stay dark for a whole cycle first
const FLASH_WINDOW_START_RATIO = 0.97;

// The layer remounts on every arrival at the side, so a positive delay left the scene dead
// for seconds. Each bar instead starts with its cycle already in flight (a negative delay),
// seeded so the first flash lands between these two bounds — the second one scaled by the
// bar's own cycle, so the opening flurry has the layer's natural density and flows straight
// into the steady rhythm instead of firing all bars at once
const FIRST_FLASH_MIN_SECONDS = 0.15;

const FIRST_FLASH_MAX_CYCLE_RATIO = 0.55;

// Seconds of calm between frame displacement bursts, and how long a single burst lasts
const FRAME_GLITCH_PAUSE_SECONDS: NumberRange = {
  min: 2.1,
  max: 4.4,
};

const FRAME_GLITCH_BURST_SECONDS: NumberRange = {
  min: 0.06,
  max: 0.11,
};

// The cube's arrival spin lasts 2.1s (TheCube's transition), so the first burst waits it
// out — the whole-frame filter must never rasterize the scene mid-rotation. It fires right
// as the cube settles though: a full random pause on top used to leave the side untorn for
// up to 6.5s after arrival
const ARRIVAL_SPIN_GRACE_SECONDS = 2.1;

const FIRST_BURST_PAUSE_SECONDS: NumberRange = {
  min: 0.1,
  max: 0.5,
};

// The interference band's CRT tear: the page-level #interference-warp-filter shifts
// rows horizontally inside a noise stripe pinned to the band. The stripe is taller
// than the band's bright core and its alpha fades toward both ends, so the tear
// rolls in and out smoothly instead of starting on a hard line
const BAND_WARP_STRIPE_HEIGHT = 190;

// Pushes the stripe's center below the band's, so the tear trails the bright core
// slightly, like tracking error hanging off a roll bar
const BAND_WARP_STRIPE_DOWNSHIFT = 18;

// Fallback pace of the crossfade between the two noise fields (one full A→B→A lap);
// the live value is read off the --band-warp-morph-seconds custom property each
// frame, so the tuning panel and the stylesheet can retune it without touching JS
const BAND_WARP_MORPH_SECONDS = 2.7;

// rAF gaps (hidden tab, dropped frames) would otherwise teleport the crossfade
const BAND_WARP_MAX_FRAME_DELTA_SECONDS = 0.1;

// The live noise subregion extends past the fade mask on both ends, so the mask
// never samples the clamped edge of the turbulence strip
const BAND_WARP_NOISE_BLEED = 12;

// The latex dent the band drags along: the fallback height of the pull dome (the
// live value is read off --band-dent-height each frame, same contract as the morph
// pace) and where its peak sits inside the strip. The band travels down, so the
// strip's upper part is the wake it came from: the peak past the middle keeps the
// wake long and stretched while the bow ahead compresses short — that asymmetry is
// what reads as dragging, not just denting
const BAND_DENT_STRIPE_HEIGHT = 270;

const BAND_DENT_PEAK_RATIO = 0.62;

const BAND_DENT_PROFILE_STOPS = 13;

// The pull profile is baked once into a tiny vertical gradient the feImage stretches
// over the strip: only G varies (below 0.5 pulls the frame down, along the band's
// travel — the displacement scale flips it), R/B stay 0.5 so the pass never shifts
// rows sideways. A squared sine keeps the ends and the peak flat, so the piecewise
// stops never kink the stretch visibly
const createDentProfileUri = (): string => {
  const stops = Array.from({ length: BAND_DENT_PROFILE_STOPS }, (_, stopIndex) => {
    const offset = stopIndex / (BAND_DENT_PROFILE_STOPS - 1);
    const phase = offset < BAND_DENT_PEAK_RATIO
      ? (offset / BAND_DENT_PEAK_RATIO) * 0.5
      : 0.5 + ((offset - BAND_DENT_PEAK_RATIO) / (1 - BAND_DENT_PEAK_RATIO)) * 0.5;
    const pullDepth = Math.sin(Math.PI * phase) ** 2;
    const greenHex = Math.round(128 * (1 - pullDepth))
      .toString(16)
      .padStart(2, '0');

    return `<stop offset='${offset.toFixed(3)}' stop-color='#80${greenHex}80'/>`;
  })
    .join('');

  const svg = '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'520\'>'
    + `<linearGradient id='dent' x1='0' y1='0' x2='0' y2='1'>${stops}</linearGradient>`
    + '<rect width=\'100%\' height=\'100%\' fill=\'url(#dent)\'/>'
    + '</svg>';

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const DENT_PROFILE_URI = createDentProfileUri();

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
  bandWarp: [isActive: boolean];
}>();

const layerConfig = LAYER_CONFIGS[props.layer];

const bars = ref<GlitchBarData[]>([]);

// Re-randomised right before every burst so each displacement tears different rows
const turbulenceSeed = ref(7);

const fieldElement = ref<HTMLElement | null>(null);

const bandElement = ref<HTMLElement | null>(null);

const warpMaskImage = ref<SVGFEImageElement | null>(null);

const tearNoiseElementA = ref<SVGFETurbulenceElement | null>(null);

const tearNoiseElementB = ref<SVGFETurbulenceElement | null>(null);

const tearBlendElement = ref<SVGFECompositeElement | null>(null);

const tearOffsetElement = ref<SVGFEOffsetElement | null>(null);

const dentProfileImage = ref<SVGFEImageElement | null>(null);

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
  const firstFlashSeconds = randomBetween(FIRST_FLASH_MIN_SECONDS, duration * FIRST_FLASH_MAX_CYCLE_RATIO);

  return {
    ...createShiftPair(),
    top: `${randomFromRange(BAR_TOP_RANGE)}%`,
    height: createBarHeight(),
    duration: `${duration}s`,

    // Negative by construction (the flash window sits past half the cycle): it rewinds the
    // bar to just before its flash, so the first one lands at firstFlashSeconds — while the
    // cube is still spinning in — instead of a full cycle after mount
    delay: `${firstFlashSeconds - FLASH_WINDOW_START_RATIO * duration}s`,
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
const scheduleFrameGlitchBurst = (pauseSeconds = randomFromRange(FRAME_GLITCH_PAUSE_SECONDS)): void => {
  frameGlitchTimerId = window.setTimeout(() => {
    turbulenceSeed.value = Math.floor(Math.random() * 1000);
    emit('frameGlitch', true);

    frameGlitchTimerId = window.setTimeout(() => {
      emit('frameGlitch', false);
      scheduleFrameGlitchBurst();
    }, randomFromRange(FRAME_GLITCH_BURST_SECONDS) * 1000);
  }, pauseSeconds * 1000);
};

let bandWarpFrameId: number | undefined;

let bandWarpDelayTimerId: number | undefined;

let bandWarpMaskWidth = 0;

let bandWarpDentHeight = 0;

let bandWarpMorphPhase = 0;

let bandWarpLastTimestamp: number | undefined;

// The static alpha gradient that fades the tear to neutral at the stripe's ends;
// only its alpha matters (the "in" composite ignores its colors). Regenerated only
// when the measured width changes, so there is no per-frame image churn
const createBandWarpMaskUri = (width: number): string => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${BAND_WARP_STRIPE_HEIGHT}'>`
    + '<linearGradient id=\'fade\' x1=\'0\' y1=\'0\' x2=\'0\' y2=\'1\'>'
    + '<stop offset=\'0\' stop-color=\'#fff\' stop-opacity=\'0\'/>'
    + '<stop offset=\'0.3\' stop-color=\'#fff\' stop-opacity=\'1\'/>'
    + '<stop offset=\'0.7\' stop-color=\'#fff\' stop-opacity=\'1\'/>'
    + '<stop offset=\'1\' stop-color=\'#fff\' stop-opacity=\'0\'/>'
    + '</linearGradient>'
    + '<rect width=\'100%\' height=\'100%\' fill=\'url(#fade)\'/>'
    + '</svg>';

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const rollNoiseSeed = (): number => Math.floor(Math.random() * 1000);

interface BandWarpTuning {
  morphSeconds: number;
  dentHeight: number;
}

// The morph pace and the dent dome's height are look-affecting numbers, so they
// live in CSS: the JS side only measures them (empty when nothing overrides the
// defaults)
const readBandWarpTuning = (field: HTMLElement): BandWarpTuning => {
  const style = getComputedStyle(field);
  const morphSeconds = Number.parseFloat(style.getPropertyValue('--band-warp-morph-seconds'));
  const dentHeight = Number.parseFloat(style.getPropertyValue('--band-dent-height'));

  return {
    morphSeconds: Number.isFinite(morphSeconds) && morphSeconds > 0 ? morphSeconds : BAND_WARP_MORPH_SECONDS,
    dentHeight: Number.isFinite(dentHeight) && dentHeight > 0 ? dentHeight : BAND_DENT_STRIPE_HEIGHT,
  };
};

// All reads first, then writes (MeteorGlow's discipline): the CSS roll animation
// stays the source of truth and the loop only reports where the band currently is,
// so the warp can never drift out of sync with the visible glow. Filter primitives
// cannot consume custom properties, hence direct attributes instead of the usual
// CSS-var handover. The turbulence strips render at a fixed origin and the loop
// translates the blended tear to the band through the feOffset's dy — the bend
// profile travels with the band instead of being a stationary field the stripe
// merely reveals; the dent dome rides along through its feImage's y. The mask and
// the dent image resize whenever the measured width changes, which also covers the
// very first frame and window resizes. The crossfade phase advances by wall-clock
// delta, so retuning the pace mid-flight never jumps the weights, and each noise
// field re-rolls its seed exactly when the cosine parks its weight at zero
const driveBandWarp = (timestamp: number): void => {
  const field = fieldElement.value;
  const band = bandElement.value;
  const mask = warpMaskImage.value;
  const noiseA = tearNoiseElementA.value;
  const noiseB = tearNoiseElementB.value;
  const blend = tearBlendElement.value;
  const tearOffset = tearOffsetElement.value;
  const dentImage = dentProfileImage.value;

  if (field && band && mask && noiseA && noiseB && blend && tearOffset && dentImage) {
    const fieldRect = field.getBoundingClientRect();
    const bandRect = band.getBoundingClientRect();
    const width = Math.round(fieldRect.width);
    const { morphSeconds, dentHeight } = readBandWarpTuning(field);

    if (width > 0 && width !== bandWarpMaskWidth) {
      bandWarpMaskWidth = width;
      mask.setAttribute('width', `${width}`);
      mask.setAttribute('height', `${BAND_WARP_STRIPE_HEIGHT}`);
      mask.setAttribute('href', createBandWarpMaskUri(width));
      dentImage.setAttribute('width', `${width}`);
    }

    if (dentHeight !== bandWarpDentHeight) {
      bandWarpDentHeight = dentHeight;
      dentImage.setAttribute('height', `${dentHeight}`);
    }

    const stripeTop = bandRect.top - fieldRect.top + (bandRect.height - BAND_WARP_STRIPE_HEIGHT) / 2 + BAND_WARP_STRIPE_DOWNSHIFT;
    const bandCenter = bandRect.top - fieldRect.top + bandRect.height / 2;
    const frameDelta = bandWarpLastTimestamp === undefined
      ? 0
      : Math.min((timestamp - bandWarpLastTimestamp) / 1000, BAND_WARP_MAX_FRAME_DELTA_SECONDS);
    const previousPhase = bandWarpMorphPhase;

    bandWarpLastTimestamp = timestamp;
    bandWarpMorphPhase = (bandWarpMorphPhase + frameDelta / morphSeconds) % 1;

    mask.setAttribute('y', stripeTop.toFixed(1));
    tearOffset.setAttribute('dy', stripeTop.toFixed(1));

    // The offset's own subregion chases the shifted noise: filter primitives clip
    // their output to it, and its default sits where the noise is generated, not
    // where it lands
    tearOffset.setAttribute('y', (stripeTop - BAND_WARP_NOISE_BLEED).toFixed(1));
    dentImage.setAttribute('y', (bandCenter - dentHeight * BAND_DENT_PEAK_RATIO).toFixed(1));

    // Field A rests at phase 0.5, field B at the wrap — swap seeds only there
    if (previousPhase < 0.5 && bandWarpMorphPhase >= 0.5) {
      noiseA.setAttribute('seed', `${rollNoiseSeed()}`);
    }

    if (bandWarpMorphPhase < previousPhase) {
      noiseB.setAttribute('seed', `${rollNoiseSeed()}`);
    }

    // L2-normalized weights keep the blended noise's spread constant through the
    // crossfade (plain linear weights would dip the tear ~30% at the midpoint);
    // k4 re-centers the mean on 0.5 so the band never gains a uniform side shift
    const weightA = 0.5 + 0.5 * Math.cos(2 * Math.PI * bandWarpMorphPhase);
    const weightNorm = Math.hypot(weightA, 1 - weightA);

    blend.setAttribute('k2', (weightA / weightNorm).toFixed(3));
    blend.setAttribute('k3', ((1 - weightA) / weightNorm).toFixed(3));
    blend.setAttribute('k4', (0.5 * (1 - 1 / weightNorm)).toFixed(3));
  }

  bandWarpFrameId = window.requestAnimationFrame(driveBandWarp);
};

const initializeBars = (): void => {
  bars.value = Array.from({ length: layerConfig.barCount }, () => createBar());
};

onMounted(() => {
  initializeBars();

  if (props.layer === 'front') {
    scheduleFrameGlitchBurst(ARRIVAL_SPIN_GRACE_SECONDS + randomFromRange(FIRST_BURST_PAUSE_SECONDS));

    // The warp waits out the same arrival spin the bursts do: the page-level filter
    // flattens the cube's 3D, so it must not engage until the scene has settled
    bandWarpDelayTimerId = window.setTimeout(() => {
      emit('bandWarp', true);
      driveBandWarp(performance.now());
    }, ARRIVAL_SPIN_GRACE_SECONDS * 1000);
  }
});

onBeforeUnmount(() => {
  if (frameGlitchTimerId !== undefined) {
    window.clearTimeout(frameGlitchTimerId);
  }

  if (bandWarpDelayTimerId !== undefined) {
    window.clearTimeout(bandWarpDelayTimerId);
  }

  if (bandWarpFrameId !== undefined) {
    window.cancelAnimationFrame(bandWarpFrameId);
  }

  if (props.layer === 'front') {
    emit('frameGlitch', false);
    emit('bandWarp', false);
  }
});
</script>

<style scoped>
/* The shared pre-baked feTurbulence tile: .static-noise flashes it over the whole
   frame, .band-noise drags a strip of it along the interference band */
.glitch-field {
  --noise-tile: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='280' height='280' filter='url(%23n)' opacity='0.5'/></svg>");
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
  background: linear-gradient(180deg, rgb(from var(--color-accent-bottom) r g b / 0%) 0%, rgb(from var(--color-accent-bottom) r g b / var(--band-glow-opacity, 19%)) 50%, rgb(from var(--color-accent-bottom) r g b / 0%) 100%);
  transform: translate3d(0, -140px, 0);
  animation: interference-roll 8.5s linear infinite;
}

/* The chromatic fringes flanking the band's bright core — the same split pair the
   terminal text flashes apart into, so the band speaks the face's broken-signal
   language; they ride the roll and the warp tears them along with the frame */
.interference-band::before,
.interference-band::after {
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  content: "";
}

.interference-band::before {
  top: 27%;
  background: var(--color-split-cold);
  opacity: var(--band-fringe-opacity, 0.04);
}

.interference-band::after {
  bottom: 27%;
  background: var(--color-split-warm);
  opacity: var(--band-fringe-opacity, 0.04);
}

/* The head-switching noise of a worn tape trailing the band's lower edge: the same
   pre-baked tile as .static-noise, crawling in hard steps so the filter behind the
   texture never re-runs */
.band-noise {
  position: absolute;
  bottom: 14%;
  left: 0;
  width: 100%;
  height: 18px;
  background-image: var(--noise-tile);
  opacity: var(--band-noise-opacity, 0.4);
  mix-blend-mode: screen;
  animation: band-noise-crawl 0.5s steps(4) infinite;
}

/* The texture itself is static — a pre-baked feTurbulence tile; the motion is faked by
   opacity flickers and abrupt background-position jumps, so the filter never re-runs.
   Its flash sits at 96.5% of the cycle, so the negative delay rewinds it to just short of
   that: the first burst of snow hits ~0.3s after the side arrives instead of at 5.5s */
.static-noise {
  position: absolute;
  inset: 0;
  background-image: var(--noise-tile);
  opacity: 0;
  mix-blend-mode: screen;
  animation: static-noise-flash 5.7s linear -5.2s infinite;
}

/* The only always-on element, so it fades in over the same 2s the page's cross-fade
   gives leaving layers — otherwise the pattern pops while the cube is still spinning in.
   Line strength and pitch are tunable custom properties (fallbacks inline, so the
   tuning panel's <html> overrides inherit through); the 1px line itself stays fixed */
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, rgb(from #c8beff r g b / var(--scanline-opacity, 10%)) 0, rgb(from #c8beff r g b / var(--scanline-opacity, 10%)) 1px, rgb(from #c8beff r g b / 0%) 1px, rgb(from #c8beff r g b / 0%) var(--scanline-step, 3px));
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

/* One full tile per cycle, so the wrap from 280px back to 0 is seamless */
@keyframes band-noise-crawl {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 280px 0;
  }
}
</style>
