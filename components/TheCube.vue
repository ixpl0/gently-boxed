<template>
  <div class="cube-wrapper">
    <div class="cube-pivot">
      <div
        class="cube"
        :data-side="side"
      >
        <div
          class="side front"
          :inert="side !== 'front'"
        >
          <!-- No face sparkles here: the front side's ambience is the page-level
               MeteorShower layers flying behind and in front of the cube -->
          <slot name="front" />
        </div>

        <div
          class="side back"
          :inert="side !== 'back'"
        >
          <!-- The face half of the back side's ambience: still print-sheet
               furniture on the calm paper (the water itself lives only in the
               page layer mounted by pages/[[side]].vue) -->
          <RippleField
            v-if="side === 'back'"
            layer="face"
          />
          <slot name="back" />
        </div>

        <div
          class="side left"
          :inert="side !== 'left'"
        >
          <SparklesSparkles
            v-if="side === 'left'"
            type="plus"
          />
          <slot name="left" />
        </div>

        <div
          class="side right"
          :inert="side !== 'right'"
        >
          <SparklesSparkles
            v-if="side === 'right'"
            type="star"
          />
          <slot name="right" />
        </div>

        <div
          class="side top"
          :inert="side !== 'top'"
        >
          <SparklesSparkles
            v-if="side === 'top'"
            type="diamond"
          />
          <slot name="top" />
        </div>

        <div
          class="side bottom"
          :inert="side !== 'bottom'"
        >
          <!-- No face sparkles here: the bottom side's ambience is the page-level
               GlitchField layers glitching behind and over the cube -->
          <slot name="bottom" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SideType } from '~/utils/sides';

defineProps<{
  side: SideType;
}>();
</script>

<style scoped>
.cube-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  perspective: 1000px;
}

/* Hosts the cube at a fixed depth */
.cube-pivot {
  position: relative;
  transform: translateZ(-250px);
  transform-style: preserve-3d;
}

.cube {
  position: relative;
  width: 500px;
  height: 500px;
  transition: transform 2.1s;
  user-select: none;
  transform-style: preserve-3d;

  /* A permanent compositor layer: promoting it mid-spin flashes garbage GPU tiles */
  will-change: transform;

  &[data-side="back"] {
    transform: rotateY(-180deg) rotateZ(90deg);
  }

  &[data-side="left"] {
    transform: rotateY(90deg) rotateX(180deg);
  }

  &[data-side="right"] {
    transform: rotateY(-90deg) rotateX(90deg);
  }

  &[data-side="top"] {
    transform: rotateX(-90deg) rotateY(90deg);
  }

  &[data-side="bottom"] {
    transform: rotateX(90deg) rotateY(180deg);
  }
}

.side {
  --elevation-step: 25px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;

  /* Faces are flat solid panels: no stroke, no gradient — the side accent survives
     only as the low-chroma surface tint, and edges read from contrast with the page */
  background-color: var(--surface-color);

  /* TEMPORARY diagnostic: flat collapses each face's subtree into a single
     texture, disabling all elevation — restore preserve-3d to bring it back */
  transform-style: flat;

  /* The cube is a closed convex solid, so hidden backfaces are always occluded anyway;
     skipping them halves the surfaces the compositor rasterizes during a spin */
  backface-visibility: hidden;

  /* Each side owns a calm accent; the face surface is its dark low-chroma derivative,
     so every panel/border/shadow derived from --surface-color stays in the same key.
     The front is the poster-style exception: a bright radial gradient surface (accent
     at the center, darkening to purple corners) with --side-ink typography on top.
     --surface-color mixes the headline's local tone out of the gradient endpoints,
     so UiText cast shadows still derive a plausible local color */
  &.front {
    --side-accent: var(--color-accent-front);
    --side-ink: var(--color-ink);
    --corner-color: #964e9b;
    --surface-color: color-mix(in srgb, var(--side-accent) 70%, var(--corner-color) 30%);
    background-image: radial-gradient(circle, var(--side-accent) 20%, var(--corner-color) 100%);
    transform: translateZ(250px);
  }

  /* The back is the wet-print exception: a uniform pale acid-yellow sheet (the
     paper the CMYK water washes over) carrying --side-ink typography; kept one
     flat solid so the text stays readable under the face's faint ripple */
  &.back {
    --side-accent: var(--color-accent-back);
    --side-ink: var(--color-ink);
    --surface-color: color-mix(in oklab, var(--color-back-yellow) 80%, #fff 20%);
    transform: rotateY(180deg) rotateZ(90deg) translateZ(250px);
  }

  &.left {
    --side-accent: var(--color-accent-left);
    --surface-color: oklch(from var(--side-accent) 30% calc(c * 0.35) h);
    transform: rotateY(-90deg) rotateZ(180deg) translateZ(250px);
  }

  &.right {
    --side-accent: var(--color-accent-right);
    --surface-color: oklch(from var(--side-accent) 30% calc(c * 0.35) h);
    transform: rotateY(90deg) rotateZ(-90deg) translateZ(250px);
  }

  &.top {
    --side-accent: var(--color-accent-top);
    --surface-color: oklch(from var(--side-accent) 30% calc(c * 0.35) h);
    transform: rotateX(90deg) rotateZ(90deg) translateZ(250px);
  }

  &.bottom {
    --side-accent: var(--color-accent-bottom);
    --surface-color: oklch(from var(--side-accent) 30% calc(c * 0.35) h);
    transform: rotateX(-90deg) rotateZ(180deg) translateZ(250px);
  }
}

</style>
