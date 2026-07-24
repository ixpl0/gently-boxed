<template>
  <nav
    class="side-navigation"
    aria-label="Cube sides"
    :style="{ '--current-accent': SIDE_COLORS[currentSide] }"
  >
    <div class="dots">
      <NuxtLink
        v-for="side in SIDES"
        :key="side"
        class="dot"
        :class="{ active: side === currentSide }"
        :style="{ '--dot-color': SIDE_COLORS[side] }"
        :to="getRoutePathFromSide(side)"
        :aria-label="SIDE_LABELS[side]"
        :title="SIDE_LABELS[side]"
      />
    </div>

    <span class="current-label">{{ SIDE_LABELS[currentSide] }}</span>
  </nav>
</template>

<script setup lang="ts">
import type { SideType } from '~/utils/sides';
import {
  getRoutePathFromSide, SIDE_COLORS, SIDE_LABELS, SIDES,
} from '~/utils/sides';

defineProps<{
  currentSide: SideType;
}>();
</script>

<style scoped>
/* Lifted into its own layer: the left side's reflection is painted by a
   transformed subtree, which the paint order puts above plain in-flow content,
   and it was washing over the dots and the label */
.side-navigation {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
}

.dots {
  display: flex;
  gap: 12px;
}

.dot {
  display: block;
  width: 12px;
  height: 12px;
  background: var(--dot-color);
  border-radius: 50%;
  opacity: 0.45;
  transition: all 0.2s;
}

.dot:hover {
  opacity: 0.7;
  transform: scale(1.15);
}

.dot.active {
  box-shadow: 0 0 10px var(--dot-color);
  opacity: 1;
  transform: scale(1.25);
}

/* The label wears the side it names: a neutral grey was the one thing on screen
   that belonged to no side's palette, and it read as system chrome dropped over
   the scene. The tint crossfades over the spin, like the page background */
.current-label {
  color: oklch(from var(--current-accent) 74% max(c, 0.05) h);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 0 0 14px rgb(from var(--current-accent) r g b / 40%);
  transition: color 2.1s, text-shadow 2.1s;
}
</style>
