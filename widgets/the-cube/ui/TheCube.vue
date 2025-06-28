<template>
  <div class="background">
    <div
      v-for="id in [0, 1, 2]"
      :key="id"
      class="background-side"
      :class="{ active: isBackgroundActive }"
      :data-id="id"
    />
  </div>

  <div class="cube-wrapper">
    <div
      class="cube"
      :data-side="side"
      @click="spinCube"
    >
      <div class="side front">
        <slot name="front">
          incredible
        </slot>
        <SparklesSparkles />
      </div>

      <div class="side back">
        <slot name="back">
          unbelievable
        </slot>
      </div>

      <div class="side left">
        <slot name="left">
          amazing
        </slot>
      </div>

      <div class="side right">
        <slot name="right">
          fantastic
        </slot>
      </div>

      <div class="side top">
        <slot name="top">
          magnificent
        </slot>
      </div>

      <div class="side bottom">
        <slot name="bottom">
          wonderful
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SparklesSparkles } from '#shared/ui';

const SIDES = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;

type SideType = typeof SIDES[number];

const side = ref<SideType>('front');
const isBackgroundActive = ref(true);

function getRandomAvailableSideIndex(currentIndex: number): number | undefined {
  const availableIndices = SIDES
    .map((_, index) => index)
    .filter((index) => index !== currentIndex);

  const randomIndex = Math.floor(Math.random() * availableIndices.length);

  return availableIndices[randomIndex];
}

function spinCube(): void {
  const currentIndex = SIDES.indexOf(side.value);
  const nextIndex = getRandomAvailableSideIndex(currentIndex);

  if (nextIndex === undefined) {
    return;
  }

  const nextSide = SIDES[nextIndex];

  if (!nextSide) {
    return;
  }

  side.value = nextSide;
  isBackgroundActive.value = !isBackgroundActive.value;
}
</script>

<style scoped>
.background {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  filter: invert(1);
}

.background-side {
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 20px;
  color: #fff;
  font-family: sans-serif;
  font-size: 26px;
  background: #165d7987;
  transform: perspective(1px) rotate3d(1, 1.5, 0, 10deg);
  transition: all 0.7s;
  mix-blend-mode: screen;
  filter: blur(2px);

  &.active {
    transform: rotate3d(1, -1.5, 0, 10deg);
  }

  &[data-id="1"] {
    background: #ea252587;
    transform: rotate3d(-4.1, 0.7, 0, 10deg);

    &.active {
      transform: perspective(1px) rotate3d(0.4, 0.8, 0, 10deg);
    }
  }

  &[data-id="2"] {
    background: #3ea65487;
    transform: perspective(1px) rotate3d(0.5, -1.1, 0, 10deg);

    &.active {
      transform: perspective(1px) rotate3d(-3.9, -0.7, 0, 10deg);
    }
  }
}

.cube-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  perspective: 1000px;
}

.cube {
  position: relative;
  width: 500px;
  height: 500px;
  transform: translateZ(-250px);
  transition: transform 0.7s;
  cursor: pointer;
  user-select: none;
  transform-style: preserve-3d;

  &[data-side="back"] {
    transform: translateZ(-250px) rotateY(-180deg) rotateZ(90deg);
  }

  &[data-side="left"] {
    transform: translateZ(-250px) rotateY(90deg) rotateX(180deg);
  }

  &[data-side="right"] {
    transform: translateZ(-250px) rotateY(-90deg) rotateX(90deg);
  }

  &[data-side="top"] {
    transform: translateZ(-250px) rotateX(-90deg) rotateY(90deg);
  }

  &[data-side="bottom"] {
    transform: translateZ(-250px) rotateX(90deg) rotateY(180deg);
  }
}

.side {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 45px;
  background-color: #000;

  &.front {
    background: #3973cc;
    transform: translateZ(250px);
  }

  &.back {
    background: #e05a5a;
    transform: rotateY(180deg) rotateZ(90deg) translateZ(250px);
  }

  &.left {
    background: #e09c36;
    transform: rotateY(-90deg) rotateZ(180deg) translateZ(250px);
  }

  &.right {
    background: #36b374;
    transform: rotateY(90deg) rotateZ(-90deg) translateZ(250px);
  }

  &.top {
    background: #36b0c2;
    transform: rotateX(90deg) rotateZ(90deg) translateZ(250px);
  }

  &.bottom {
    background: #9b6bc2;
    transform: rotateX(-90deg) rotateZ(180deg) translateZ(250px);
  }
}
</style>
