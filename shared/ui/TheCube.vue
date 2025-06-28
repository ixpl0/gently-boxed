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
import SparklesSparkles from '#shared/ui/SparklesSparkles.vue';

const SIDES = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;

type SideType = typeof SIDES[number]

const side = ref<SideType>('front');
const isBackgroundActive = ref(true);

function spinCube(): void {
  const currentIndex = SIDES.indexOf(side.value);
  const randomOffset = Math.floor(Math.random() * 5);
  const nextIndex = randomOffset === currentIndex ? 5 : randomOffset;
  const nextSide = SIDES[nextIndex];

  if (nextSide) {
    side.value = nextSide;
  }

  isBackgroundActive.value = !isBackgroundActive.value;
}
</script>

<style scoped>
.background {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  filter: invert(1);
}

.background-side {
  position: absolute;
  width: 16px;
  height: 20px;
  color: white;
  font-size: 26px;
  font-family: sans-serif;
  justify-content: center;
  align-items: center;
  transition: all 0.7s;
  mix-blend-mode: screen;
  background: #165d7987;
  transform: perspective(1px) rotate3d(1, 1.5, 0, 10deg);
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
  align-items: center;
  justify-content: center;
  height: 100%;
  perspective: 1000px;
}

.cube {
  position: relative;
  width: 500px;
  height: 500px;
  transform-style: preserve-3d;
  transition: transform 0.7s;
  transform: translateZ(-250px);
  cursor: pointer;
  user-select: none;

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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 45px;
  color: white;
  background-color: black;

  &.front {
    transform: translateZ(250px);
    background: #3973cc;
  }

  &.back {
    transform: rotateY(180deg) rotateZ(90deg) translateZ(250px);
    background: #e05a5a;
  }

  &.left {
    transform: rotateY(-90deg) rotateZ(180deg) translateZ(250px);
    background: #e09c36;
  }

  &.right {
    transform: rotateY(90deg) rotateZ(-90deg) translateZ(250px);
    background: #36b374;
  }

  &.top {
    transform: rotateX(90deg) rotateZ(90deg) translateZ(250px);
    background: #36b0c2;
  }

  &.bottom {
    transform: rotateX(-90deg) rotateZ(180deg) translateZ(250px);
    background: #9b6bc2;
  }
}
</style>
