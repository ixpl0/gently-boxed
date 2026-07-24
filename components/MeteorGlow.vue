<template>
  <!-- The pools of light the nearest meteors cast while crossing over the face:
       one screen-blended patch per front-layer streak, positioned every frame -->
  <div
    ref="glowLayer"
    class="meteor-glow"
    aria-hidden="true"
  >
    <div
      v-for="(streakLength, index) in streakLengths"
      :key="`glow-light-${index}`"
      ref="lightElements"
      class="glow-light"
      :style="{ '--streak-length': `${streakLength}px` }"
    />
  </div>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount, onMounted, ref, watch,
} from 'vue';
import { useMeteorLightSources } from '~/composables/useMeteorLightSources';

interface HiddenLightFrame {
  isVisible: false;
}

interface VisibleLightFrame {
  isVisible: true;
  headX: number;
  headY: number;
  tiltDegrees: number;
  alpha: number;
}

type LightFrameType = HiddenLightFrame | VisibleLightFrame;

// This component only measures — where each streak's head is, how bright it burns
// and whether the face is even facing us. Everything about how the light *looks*
// (patch size, how far up the tail it sits, the intensity cap, the gradients)
// lives in the stylesheet below, so retuning the glow never means touching JS

// The screen-to-face mapping below is affine only while the face is screen-parallel:
// frames where the projected layer rect deviates from its layout size — i.e. mid-spin —
// hide the lights instead of smearing them across a rotating face
const FACE_PARALLEL_EPSILON_PX = 0.5;

// Lights ramp in over this window after the cube settles instead of popping; the ramp
// stays in JS because a CSS opacity fade on the layer would isolate the screen blending
const GLOW_FADE_IN_MS = 800;

const FALLBACK_STREAK_LENGTH_PX = 380;
const DEGREES_TO_RADIANS = Math.PI / 180;

const { sources } = useMeteorLightSources();

const glowLayer = ref<HTMLElement>();
const lightElements = ref<HTMLElement[]>([]);
const streakLengths = ref<number[]>([]);

let settledAtTimestamp: number | undefined;
let frameId: number | undefined;

const readStreakLength = (meteorElement: HTMLElement): number => {
  const parsedLength = Number.parseFloat(meteorElement.style.getPropertyValue('--meteor-length'));

  return Number.isFinite(parsedLength) ? parsedLength : FALLBACK_STREAK_LENGTH_PX;
};

// Each streak's length is static (respawns only re-randomise lane and tilt), so it is
// read once per publication and handed to CSS, which sizes the patch off it
watch(sources, (nextSources) => {
  streakLengths.value = nextSources.map((meteorElement) => readStreakLength(meteorElement));
}, { immediate: true });

const computeLightFrame = (
  meteorElement: HTMLElement,
  streakLength: number,
  layerRect: DOMRect,
  faceSize: number,
): LightFrameType => {
  const tiltDegrees = Number.parseFloat(meteorElement.style.getPropertyValue('--meteor-tilt'));
  const meteorOpacity = Number.parseFloat(window.getComputedStyle(meteorElement).opacity);

  if (!Number.isFinite(tiltDegrees) || !Number.isFinite(meteorOpacity) || meteorOpacity === 0) {
    return { isVisible: false };
  }

  const meteorRect = meteorElement.getBoundingClientRect();
  const tiltSin = Math.sin(tiltDegrees * DEGREES_TO_RADIANS);
  const tiltCos = Math.cos(tiltDegrees * DEGREES_TO_RADIANS);

  // The rect center is the streak's midpoint (it rotates about its own center), and
  // CSS clockwise rotation carries the head — the streak's bottom end — to
  // center + (length / 2) · (−sin θ, cos θ). The patch is anchored on that head;
  // backing it off up the tail is CSS's job, in the streak's own rotated axes
  const headOffset = streakLength / 2;
  const scaleToLocal = faceSize / layerRect.width;
  const headX = (meteorRect.left + meteorRect.width / 2 - tiltSin * headOffset - layerRect.left) * scaleToLocal;
  const headY = (meteorRect.top + meteorRect.height / 2 + tiltCos * headOffset - layerRect.top) * scaleToLocal;

  // One streak length of slack covers any patch the stylesheet can reasonably size:
  // its own backset plus half its height stay well inside that, so culling never
  // has to know the ratios CSS uses
  const isOnFace = headX > -streakLength && headX < faceSize + streakLength
    && headY > -streakLength && headY < faceSize + streakLength;

  if (!isOnFace) {
    return { isVisible: false };
  }

  return {
    isVisible: true,
    headX,
    headY,
    tiltDegrees,
    alpha: meteorOpacity,
  };
};

const updateLights = (frameTimestamp: number): void => {
  frameId = window.requestAnimationFrame(updateLights);

  const layerElement = glowLayer.value;

  if (!layerElement || sources.value.length === 0) {
    return;
  }

  const layerRect = layerElement.getBoundingClientRect();

  if (layerRect.width === 0) {
    return;
  }

  const faceSize = layerElement.offsetWidth;

  // Mid-spin the face projects a distorted rect: hide the lights until it settles,
  // and let the settle moment re-anchor the fade-in ramp
  const isFaceParallel = Math.abs(layerRect.width - faceSize) < FACE_PARALLEL_EPSILON_PX
    && Math.abs(layerRect.height - layerElement.offsetHeight) < FACE_PARALLEL_EPSILON_PX;

  if (!isFaceParallel) {
    settledAtTimestamp = undefined;

    lightElements.value.forEach((lightElement) => {
      lightElement.style.setProperty('--glow-alpha', '0');
    });

    return;
  }

  if (settledAtTimestamp === undefined) {
    settledAtTimestamp = frameTimestamp;
  }

  const fadeInProgress = Math.min(1, (frameTimestamp - settledAtTimestamp) / GLOW_FADE_IN_MS);

  // All layout reads happen before any style write, so a frame never forces a
  // second style/layout pass
  const lightFrames = sources.value.map((meteorElement, index): LightFrameType => {
    const streakLength = streakLengths.value[index];

    return streakLength === undefined
      ? { isVisible: false }
      : computeLightFrame(meteorElement, streakLength, layerRect, faceSize);
  });

  // Writes are custom properties rather than finished transform/opacity strings: the
  // stylesheet composes them with its own ratios, so the shape of the light is CSS's
  // to change. Only transform and opacity are derived from them, so the per-frame
  // work still ends on the compositor
  lightFrames.forEach((lightFrame, index) => {
    const lightElement = lightElements.value[index];

    if (lightElement === undefined) {
      return;
    }

    if (!lightFrame.isVisible) {
      lightElement.style.setProperty('--glow-alpha', '0');

      return;
    }

    lightElement.style.setProperty('--glow-alpha', `${lightFrame.alpha * fadeInProgress}`);
    lightElement.style.setProperty('--glow-head-x', `${lightFrame.headX}px`);
    lightElement.style.setProperty('--glow-head-y', `${lightFrame.headY}px`);
    lightElement.style.setProperty('--glow-tilt', `${lightFrame.tiltDegrees}deg`);
  });
};

onMounted(() => {
  frameId = window.requestAnimationFrame(updateLights);
});

onBeforeUnmount(() => {
  if (frameId !== undefined) {
    window.cancelAnimationFrame(frameId);
  }
});
</script>

<style scoped>
/* Every dial of the cast light lives here — JS only reports where each streak's head
   is and how bright it burns (--glow-head-x/y, --glow-tilt, --glow-alpha) */
.meteor-glow {
  /* The lit patch relative to its meteor's streak length: an ellipse elongated along
     the flight axis, wide enough to read as a pool of light rather than a stripe */
  --glow-length-ratio: 1.2;
  --glow-width-ratio: 0.55;

  /* How far back up the tail the patch center sits from the head, as a share of
     streak length: the streak glows from the head through the lower tail, not at a point */
  --glow-backset-ratio: 0.18;

  /* Global intensity cap on every patch: the cast light should read as a soft
     passing wash over the poster, not a spotlight */
  --glow-strength: 0.4;
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* One soft patch per front meteor: a hot near-white core under the streak head inside
   a broader colored wash along the tail; screen-blended so it lightens the poster
   gradient and the ink typography the way real light would. The transform reads
   right to left: back off up the tail in the streak's own rotated axes, turn with the
   streak, center the patch on its anchor, then move that anchor to the head. Only
   transform and opacity are animated, so updates stay compositor-only */
.glow-light {
  --glow-core-color: color-mix(in srgb, var(--color-meteor) 45%, #fff 55%);

  /* Fallbacks for the frames before JS has measured anything: an unsized, dark patch */
  --streak-length: 0;
  --glow-head-x: 0;
  --glow-head-y: 0;
  --glow-tilt: 0deg;
  --glow-alpha: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--streak-length) * var(--glow-width-ratio));
  height: calc(var(--streak-length) * var(--glow-length-ratio));
  background: radial-gradient(40% 26% at 50% 66%, rgb(from var(--glow-core-color) r g b / 60%) 0%, rgb(from var(--glow-core-color) r g b / 0%) 100%), radial-gradient(50% 48% at 50% 52%, rgb(from var(--color-meteor) r g b / 28%) 0%, rgb(from var(--color-meteor) r g b / 0%) 78%);
  mix-blend-mode: screen;
  opacity: calc(var(--glow-alpha) * var(--glow-strength));
  transform: translate3d(var(--glow-head-x), var(--glow-head-y), 0) translate(-50%, -50%) rotate(var(--glow-tilt)) translateY(calc(var(--streak-length) * var(--glow-backset-ratio) * -1));
  will-change: transform, opacity;
  pointer-events: none;
}
</style>
