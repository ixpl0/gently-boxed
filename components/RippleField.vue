<template>
  <div
    class="ripple-field"
    :data-layer="layer"
  >
    <div class="ripple-scene">
      <template v-if="layer === 'page'">
        <div
          class="checker-sector"
          data-corner="top-right"
        />

        <div
          class="checker-sector"
          data-corner="bottom-left"
        />
      </template>

      <div
        v-else
        class="sheet-decor"
      >
        <div class="paper-grain" />

        <div class="trim-frame" />

        <div
          v-for="corner in SHEET_CORNERS"
          :key="corner"
          class="crop-mark"
          :data-corner="corner"
        />

        <div class="registration-mark" />

        <div class="color-bar">
          <span
            v-for="cell in COLOR_BAR_CELLS"
            :key="cell"
            class="color-cell"
            :data-cell="cell"
          />
        </div>
      </div>
    </div>

    <!-- The honest heavy part of the page water: a live displacement filter over
         the whole scene. SMIL morphs the turbulence continuously, so caustics and
         blooms sway like standing water — at the cost of re-rasterizing the layer
         every frame. Only the page carries it: the face stays perfectly still so
         the ink text reads undisturbed -->
    <svg
      v-if="layer === 'page'"
      class="warp-filter-defs"
      aria-hidden="true"
    >
      <filter
        id="ripple-warp-page"
        x="-10%"
        y="-10%"
        width="120%"
        height="120%"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.0055 0.009"
          numOctaves="2"
          seed="11"
          result="page-water"
        >
          <animate
            attributeName="baseFrequency"
            dur="24s"
            values="0.0055 0.009;0.0075 0.012;0.0055 0.009"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="page-water"
          scale="70"
          xChannelSelector="R"
          yChannelSelector="G"
        >
          <animate
            attributeName="scale"
            dur="17s"
            values="55;90;55"
            repeatCount="indefinite"
          />
        </feDisplacementMap>
      </filter>
    </svg>
  </div>
</template>

<script setup lang="ts">
type RippleLayerType = 'page' | 'face';

interface Props {
  layer: RippleLayerType;
}

const SHEET_CORNERS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

// The proof strip at the sheet's bottom edge: the three process inks, the key
// plate and their halftone tints, like the color bar on a real print sheet
const COLOR_BAR_CELLS = ['cyan', 'magenta', 'yellow', 'key', 'cyan-tint', 'magenta-tint', 'yellow-tint'] as const;

defineProps<Props>();
</script>

<style scoped>
.ripple-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* The page scene oversizes the frame so displacement never pulls a transparent
   edge into view (the bleed must stay above the warp's peak scale/2 shift);
   the fade-in covers the same 2s the page gives leaving layers */
.ripple-field[data-layer="page"] .ripple-scene {
  position: absolute;
  inset: -64px;
  filter: url("#ripple-warp-page");
  animation: ripple-fade-in 2s ease;
}

/* The face scene is deliberately still — no water, no filter: just the sheet
   furniture on the calm paper, so the type above stays perfectly readable */
.ripple-field[data-layer="face"] .ripple-scene {
  position: absolute;
  inset: 0;
  animation: ripple-fade-in 0.9s ease;
}

/* The ornament on the pool floor: the water itself is fully transparent — the
   warp shows only through what it bends, so two opposite quadrants of the pool
   carry a large checkerboard whose straight grid lines wobble. The ink is the
   side accent pinned to L 0.85 in oklch — it keeps only the accent's hue and
   chroma, so retuning the accent recolors the cells without darkening them into
   a hard graphic against the pale water. Each grid is anchored to the corner
   that touches the page center, so only whole cells grow outward from the
   center and cells get cut by the screen edge alone */
.checker-sector {
  position: absolute;
  background: repeating-conic-gradient(oklch(from var(--color-accent-back) 85% c h) 0% 25%, transparent 25% 50%);
  background-size: 170px 170px;
}

/* The 2px pull past the center-facing edges trims the anchored cells slightly:
   at fractional device pixel ratios the tiling can otherwise round a hair of
   the neighboring cell into view right on the center lines */
.checker-sector[data-corner="top-right"] {
  inset: 0 0 50% 50%;
  background-position: left -2px bottom -2px;
}

.checker-sector[data-corner="bottom-left"] {
  inset: 50% 50% 0 0;
  background-position: right -2px top -2px;
}

/* The print-sheet furniture in ink on the calm face */
.sheet-decor {
  position: absolute;
  inset: 0;
  color: var(--color-ink);
}

/* The same pre-baked noise tile the bottom side's glitch scene uses, kept
   whisper-faint as coated-paper texture */
.paper-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='a'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='260' height='260' filter='url(%23a)' opacity='0.5'/></svg>");
  opacity: 0.06;
}

.trim-frame {
  position: absolute;
  inset: 14px;
  border: 1px solid var(--color-ink);
  opacity: 0.16;
}

.crop-mark {
  position: absolute;
  width: 14px;
  height: 14px;
  opacity: 0.45;
}

.crop-mark[data-corner="top-left"] {
  top: 16px;
  left: 16px;
  border-top: 1px solid var(--color-ink);
  border-left: 1px solid var(--color-ink);
}

.crop-mark[data-corner="top-right"] {
  top: 16px;
  right: 16px;
  border-top: 1px solid var(--color-ink);
  border-right: 1px solid var(--color-ink);
}

.crop-mark[data-corner="bottom-left"] {
  bottom: 16px;
  left: 16px;
  border-bottom: 1px solid var(--color-ink);
  border-left: 1px solid var(--color-ink);
}

.crop-mark[data-corner="bottom-right"] {
  right: 16px;
  bottom: 16px;
  border-right: 1px solid var(--color-ink);
  border-bottom: 1px solid var(--color-ink);
}

/* The circle-and-cross registration target at the sheet's top edge */
.registration-mark {
  position: absolute;
  top: 12px;
  left: 50%;
  width: 12px;
  height: 12px;
  margin-left: -7px;
  border: 1px solid var(--color-ink);
  border-radius: 50%;
  opacity: 0.4;
}

.registration-mark::before {
  position: absolute;
  top: 50%;
  left: -6px;
  width: 24px;
  height: 1px;
  background: var(--color-ink);
  content: "";
}

.registration-mark::after {
  position: absolute;
  top: -6px;
  left: 50%;
  width: 1px;
  height: 24px;
  background: var(--color-ink);
  content: "";
}

.color-bar {
  position: absolute;
  bottom: 16px;
  left: 50%;
  display: flex;
  gap: 3px;
  opacity: 0.85;
  transform: translateX(-50%);
}

.color-cell {
  width: 9px;
  height: 9px;
}

.color-cell[data-cell="cyan"] {
  background: var(--color-back-plate);
}

.color-cell[data-cell="magenta"] {
  background: var(--color-accent-back);
}

.color-cell[data-cell="yellow"] {
  background: var(--color-back-paper);
}

.color-cell[data-cell="key"] {
  background: var(--color-ink);
}

.color-cell[data-cell="cyan-tint"] {
  background: rgb(from var(--color-back-plate) r g b / 45%);
}

.color-cell[data-cell="magenta-tint"] {
  background: rgb(from var(--color-accent-back) r g b / 45%);
}

.color-cell[data-cell="yellow-tint"] {
  background: rgb(from var(--color-back-paper) r g b / 45%);
}

.warp-filter-defs {
  position: absolute;
  width: 0;
  height: 0;
}

@keyframes ripple-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
</style>
