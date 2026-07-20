<template>
  <nav
    class="side-navigation"
    aria-label="Cube sides"
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
.side-navigation {
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
  border: 1px solid #fff3;
  border-radius: 50%;
  opacity: 0.35;
  transition: all 0.2s;
}

.dot:hover {
  opacity: 0.7;
  transform: scale(1.15);
}

.dot.active {
  border-color: #fff8;
  box-shadow: 0 0 10px var(--dot-color);
  opacity: 1;
  transform: scale(1.25);
}

.current-label {
  color: #777;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
