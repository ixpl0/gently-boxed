<template>
  <div class="cube-wrapper">
    <div
      class="cube"
      :data-side="side"
      @click="spinCube"
    >
      <div class="side front">
        <SparklesSparkles type="star" />
        <slot name="front">
          incredible
        </slot>
      </div>

      <div class="side back">
        <SparklesSparkles type="cross" />
        <slot name="back">
          unbelievable
        </slot>
      </div>

      <div class="side left">
        <SparklesSparkles type="plus" />
        <slot name="left">
          amazing
        </slot>
      </div>

      <div class="side right">
        <SparklesSparkles type="asterisk" />
        <slot name="right">
          fantastic
        </slot>
      </div>

      <div class="side top">
        <SparklesSparkles type="diamond" />
        <slot name="top">
          magnificent
        </slot>
      </div>

      <div class="side bottom">
        <SparklesSparkles type="cross" />
        <slot name="bottom">
          wonderful
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type SideType = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

const SIDES: readonly SideType[] = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const;

const side = ref<SideType>('front');

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
}
</script>

<style scoped>
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

  /* TODO: временно замедлено в 3 раза для отладки, вернуть 0.7s */
  transition: transform 2.1s;
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
  --elevation-step: 25px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 45px;
  background-color: #000;
  transform-style: preserve-3d;

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
