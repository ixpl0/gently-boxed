<template>
  <!-- The pools of light the nearest meteors cast while crossing over the face:
       one screen-blended patch per front-layer streak, positioned every frame -->
  <div
    ref="glowLayer"
    class="meteor-glow"
    aria-hidden="true"
  >
    <div
      v-for="(lightSize, index) in lightSizes"
      :key="`glow-light-${index}`"
      ref="lightElements"
      class="glow-light"
      :style="{
        width: `${lightSize.width}px`,
        height: `${lightSize.height}px`
      }"
    />
  </div>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount, onMounted, ref, watch,
} from 'vue';
import { useMeteorLightSources } from '~/composables/useMeteorLightSources';

interface LightSize {
  width: number;
  height: number;
}

interface HiddenLightFrame {
  isVisible: false;
}

interface VisibleLightFrame {
  isVisible: true;
  x: number;
  y: number;
  tiltDegrees: number;
  opacity: number;
}

type LightFrameType = HiddenLightFrame | VisibleLightFrame;

// The screen-to-face mapping below is affine only while the face is screen-parallel:
// frames where the projected layer rect deviates from its layout size — i.e. mid-spin —
// hide the lights instead of smearing them across a rotating face
const FACE_PARALLEL_EPSILON_PX = 0.5;

// Lights ramp in over this window after the cube settles instead of popping; done in
// JS because a CSS opacity fade on the layer would isolate the screen blending
const GLOW_FADE_IN_MS = 800;

// The lit patch relative to its meteor's streak length: an ellipse elongated along
// the flight axis, wide enough to read as a pool of light rather than a stripe
const GLOW_LENGTH_RATIO = 1.2;
const GLOW_WIDTH_RATIO = 0.55;

// How far back up the tail (as a share of streak length) the patch center sits from
// the head: the streak glows from the head through the lower tail, not at a point
const GLOW_HEAD_BACKSET_RATIO = 0.18;

// Global intensity cap multiplied into every written opacity: the cast light should
// read as a soft passing wash over the poster, not a spotlight
const GLOW_PEAK_OPACITY = 0.4;

const FALLBACK_STREAK_LENGTH_PX = 380;
const DEGREES_TO_RADIANS = Math.PI / 180;

const { sources } = useMeteorLightSources();

const glowLayer = ref<HTMLElement>();
const lightElements = ref<HTMLElement[]>([]);
const lightSizes = ref<LightSize[]>([]);

let settledAtTimestamp: number | undefined;
let frameId: number | undefined;

const readStreakLength = (meteorElement: HTMLElement): number => {
  const parsedLength = Number.parseFloat(meteorElement.style.getPropertyValue('--meteor-length'));

  return Number.isFinite(parsedLength) ? parsedLength : FALLBACK_STREAK_LENGTH_PX;
};

// Patch sizes are static per meteor (respawns only re-randomise lane and tilt),
// so they are resolved once per publication instead of on every frame
watch(sources, (nextSources) => {
  lightSizes.value = nextSources.map((meteorElement) => {
    const streakLength = readStreakLength(meteorElement);

    return {
      width: streakLength * GLOW_WIDTH_RATIO,
      height: streakLength * GLOW_LENGTH_RATIO,
    };
  });
}, { immediate: true });

const computeLightFrame = (
  meteorElement: HTMLElement,
  lightSize: LightSize,
  layerRect: DOMRect,
  faceSize: number,
): LightFrameType => {
  const tiltDegrees = Number.parseFloat(meteorElement.style.getPropertyValue('--meteor-tilt'));
  const meteorOpacity = Number.parseFloat(window.getComputedStyle(meteorElement).opacity);

  if (!Number.isFinite(tiltDegrees) || !Number.isFinite(meteorOpacity) || meteorOpacity === 0) {
    return { isVisible: false };
  }

  const meteorRect = meteorElement.getBoundingClientRect();
  const streakLength = readStreakLength(meteorElement);
  const tiltSin = Math.sin(tiltDegrees * DEGREES_TO_RADIANS);
  const tiltCos = Math.cos(tiltDegrees * DEGREES_TO_RADIANS);

  // The rect center is the streak's midpoint (it rotates about its own center), and
  // CSS clockwise rotation carries the head — the streak's bottom end — to
  // center + (length / 2) · (−sin θ, cos θ); the patch then backs off up the tail
  const anchorOffset = streakLength * (0.5 - GLOW_HEAD_BACKSET_RATIO);
  const scaleToLocal = faceSize / layerRect.width;
  const anchorX = (meteorRect.left + meteorRect.width / 2 - tiltSin * anchorOffset - layerRect.left) * scaleToLocal;
  const anchorY = (meteorRect.top + meteorRect.height / 2 + tiltCos * anchorOffset - layerRect.top) * scaleToLocal;

  const cullMargin = lightSize.height / 2;
  const isOnFace = anchorX > -cullMargin && anchorX < faceSize + cullMargin
    && anchorY > -cullMargin && anchorY < faceSize + cullMargin;

  if (!isOnFace) {
    return { isVisible: false };
  }

  return {
    isVisible: true,
    x: anchorX - lightSize.width / 2,
    y: anchorY - lightSize.height / 2,
    tiltDegrees,
    opacity: meteorOpacity,
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
      lightElement.style.opacity = '0';
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
    const lightSize = lightSizes.value[index];

    return lightSize === undefined
      ? { isVisible: false }
      : computeLightFrame(meteorElement, lightSize, layerRect, faceSize);
  });

  lightFrames.forEach((lightFrame, index) => {
    const lightElement = lightElements.value[index];

    if (lightElement === undefined) {
      return;
    }

    if (!lightFrame.isVisible) {
      lightElement.style.opacity = '0';

      return;
    }

    lightElement.style.opacity = `${lightFrame.opacity * fadeInProgress * GLOW_PEAK_OPACITY}`;
    lightElement.style.transform = `translate3d(${lightFrame.x}px, ${lightFrame.y}px, 0) rotate(${lightFrame.tiltDegrees}deg)`;
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
.meteor-glow {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* One soft patch per front meteor: a hot near-white core under the streak head inside
   a broader colored wash along the tail; screen-blended so it lightens the poster
   gradient and the ink typography the way real light would. Only transform/opacity
   ever change per frame, so updates stay compositor-only */
.glow-light {
  --glow-core-color: color-mix(in srgb, var(--color-meteor) 45%, #fff 55%);
  position: absolute;
  top: 0;
  left: 0;
  background: radial-gradient(40% 26% at 50% 66%, rgb(from var(--glow-core-color) r g b / 60%) 0%, rgb(from var(--glow-core-color) r g b / 0%) 100%), radial-gradient(50% 48% at 50% 52%, rgb(from var(--color-meteor) r g b / 28%) 0%, rgb(from var(--color-meteor) r g b / 0%) 78%);
  mix-blend-mode: screen;
  opacity: 0;
  will-change: transform, opacity;
  pointer-events: none;
}
</style>
