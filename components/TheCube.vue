<template>
  <div class="cube-wrapper">
    <div class="cube-pivot">
      <!-- The monolith standing in wet asphalt: pinned to the pivot rather than
           the page, so it needs no knowledge of where the cube landed, and lifted
           back to the face plane so it matches the face's projected width 1:1 -->
      <Transition name="reflection-fade">
        <div
          v-if="side === 'left'"
          class="monolith-ground"
        >
          <div class="monolith-reflection">
            <div class="reflection-ripples" />
          </div>

          <div class="contact-seam" />
        </div>
      </Transition>

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

          <!-- Painted over the face content: the nearest front-layer meteors cast
               a moving pool of colored light onto the poster as they cross the cube -->
          <MeteorGlow v-if="side === 'front'" />
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
          <!-- No face sparkles here: the left side's ambience is the page-level
               RetroDrive horizon rolling its grid behind the cube. What does reach
               the face is the light of the roadside pylons sweeping past it,
               alternating banks — painted under the slot so it lights the panel
               rather than washing over the type -->
          <div
            v-if="side === 'left'"
            class="pylon-wash"
          >
            <div
              class="wash-bank"
              data-bank="left"
            />
            <div
              class="wash-bank"
              data-bank="right"
            />
          </div>

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

  /* Flat on purpose: it collapses each face's subtree into a single texture, which
     is what stops Chromium from flashing garbage GPU tiles mid-spin. Elevation is
     the price — every translateZ inside a face is inert — and that is accepted, so
     face content expresses depth with light and weight instead of real offsets */
  transform-style: flat;

  /* The cube is a closed convex solid, so hidden backfaces are always occluded anyway;
     skipping them halves the surfaces the compositor rasterizes during a spin */
  backface-visibility: hidden;

  /* Each side owns a calm accent; the face surface is its dark low-chroma derivative,
     so every panel/border/shadow derived from --surface-color stays in the same key.
     The front is the poster-style exception: a bright radial gradient surface (accent
     at the center, darkening toward the corners) with --side-ink typography on top.
     --surface-color mixes the headline's local tone out of the gradient endpoints,
     so UiText cast shadows still derive a plausible local color */
  &.front {
    --side-accent: var(--color-accent-front);
    --side-ink: var(--color-ink);
    --corner-color: var(--color-front-corner);
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
    --surface-color: color-mix(in oklab, var(--color-back-paper) 80%, #fff 20%);
    transform: rotateY(180deg) rotateZ(90deg) translateZ(250px);
  }

  /* The left is the retrowave exception: a dusk gradient falling toward the
     neon horizon the page-level RetroDrive paints behind the cube; kept dark
     and calm so the chrome title and the neon links stay readable */
  &.left {
    --side-accent: var(--color-accent-left);
    --surface-color: color-mix(in oklab, var(--color-page-left) 72%, var(--color-accent-left) 28%);
    background-image: linear-gradient(180deg, color-mix(in oklab, var(--color-page-left) 84%, #000 16%) 0%, color-mix(in oklab, var(--color-page-left) 62%, var(--color-accent-left) 38%) 100%);

    /* The eclipse corona: the sun sits directly behind this face, so its light
       spills around the silhouette instead of stopping at the edge — and the
       inset pair is the rim it lights, hot along the top where the sun clears
       the monolith, falling off into a faint wash down the sides */
    box-shadow: 0 0 110px -16px rgb(from var(--color-drive-sun) r g b / 42%), 0 0 260px -30px rgb(from var(--color-accent-left) r g b / 55%), inset 0 1px 0 rgb(from var(--color-drive-sun) r g b / 45%), inset 0 0 60px rgb(from var(--color-accent-left) r g b / 16%);
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

/* The light of the passing pylons. The scene's posts travel six cells per cycle
   with three to a bank, so one sweeps by on a given side every two cells — that
   is the whole timing, and it is why this needs nothing but --drive-speed. The
   right bank is offset by a single cell, which is the stagger the pylon table
   itself uses, so the two sides alternate rather than flash together */
.pylon-wash {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.wash-bank {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 78%;
  opacity: 0;
  animation: pylon-wash calc(var(--drive-speed) * 2) linear infinite;

  /* Screen, so this adds light to the panel instead of laying a cyan film over
     it — the same reason MeteorGlow blends this way on the front face */
  mix-blend-mode: screen;
}

/* A pylon is a tall tube passing close by, so what it throws is a broad column
   of light down the whole side of the monolith — not a pool at its foot */
.wash-bank[data-bank="left"] {
  --wash-drift: -60px;
  left: 0;
  background: linear-gradient(to right, rgb(from var(--color-drive-cyan) r g b / 55%) 0%, transparent 14%), radial-gradient(ellipse 92% 112% at 0% 46%, rgb(from var(--color-drive-cyan) r g b / 78%) 0%, rgb(from var(--color-drive-cyan) r g b / 44%) 28%, rgb(from var(--color-drive-cyan) r g b / 17%) 58%, transparent 88%);
}

.wash-bank[data-bank="right"] {
  --wash-drift: 60px;
  right: 0;
  background: linear-gradient(to left, rgb(from var(--color-drive-cyan) r g b / 55%) 0%, transparent 14%), radial-gradient(ellipse 92% 112% at 100% 46%, rgb(from var(--color-drive-cyan) r g b / 78%) 0%, rgb(from var(--color-drive-cyan) r g b / 44%) 28%, rgb(from var(--color-drive-cyan) r g b / 17%) 58%, transparent 88%);
  animation-delay: calc(var(--drive-speed) * -1);
}

/* The cube standing in its own reflection. The reflection is the plain silhouette
   — the face gradient upside down, blurred and torn by ripples — because a
   mirrored copy of the type would read as a second, wrong headline rather than as
   wet ground. The seam is a sibling, not a child: the reflection's blur would
   dissolve the one hard line that puts the monolith on the ground */
.monolith-ground {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  height: 210px;
  transform: translateZ(250px);
}

.monolith-reflection {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(to bottom, color-mix(in oklab, var(--color-page-left) 44%, var(--color-accent-left) 56%) 0%, color-mix(in oklab, var(--color-page-left) 86%, #000 14%) 100%);
  opacity: 0.32;
  filter: blur(5px);

  /* An ellipse rather than a vertical fade: a fade only along one axis leaves the
     reflection's own side edges intact, and against a lit roadway those read as a
     step in the asphalt exactly as wide as the cube. This dissolves all four */
  mask-image: radial-gradient(ellipse 56% 116% at 50% 0%, rgb(0 0 0 / 92%) 0%, rgb(0 0 0 / 42%) 46%, transparent 82%);
}

/* Where the monolith meets the road it stops being a floating panel */
.contact-seam {
  position: absolute;
  top: -2px;
  right: 6%;
  left: 6%;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, rgb(from var(--color-accent-left) r g b / 85%) 22%, rgb(from var(--color-drive-cyan) r g b / 70%) 50%, rgb(from var(--color-accent-left) r g b / 85%) 78%, transparent 100%);
  box-shadow: 0 0 14px rgb(from var(--color-accent-left) r g b / 85%), 0 0 44px rgb(from var(--color-accent-left) r g b / 45%);
}

/* Still on purpose: these bands used to crawl, and against the lit roadway the
   moving stripes read as the reflection flickering rather than as water. A wet
   surface under a still object holds still — the motion in this scene belongs to
   the road rushing past, not to the patch of ground the cube is standing on */
.reflection-ripples {
  position: absolute;
  inset: -12%;
  background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 9px, rgb(from var(--color-page-left) r g b / 75%) 9px, rgb(from var(--color-page-left) r g b / 75%) 15px);
}

/* Enter and leave over the spin: the reflection has no business surviving a
   rotation that takes its object away */
.reflection-fade-enter-active,
.reflection-fade-leave-active {
  transition: opacity 2.1s;
}

.reflection-fade-enter-from,
.reflection-fade-leave-to {
  opacity: 0;
}

/* A post's light does not blink: it grows as the post closes, peaks as it draws
   level with the monolith, then leaves with it. The wash slides outward across
   the same pass, which is the direction the post itself is going */
@keyframes pylon-wash {
  0% {
    opacity: 0;
    transform: translateX(0);
  }

  62% {
    opacity: 0.15;
  }

  88% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(var(--wash-drift));
  }
}


</style>
