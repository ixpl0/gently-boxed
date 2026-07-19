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
          <UiText>
            incredible
          </UiText>
        </slot>
      </div>

      <div class="side back">
        <SparklesSparkles type="cross" />
        <slot name="back">
          <UiText>
            unbelievable
          </UiText>
        </slot>
      </div>

      <div class="side left">
        <SparklesSparkles type="plus" />
        <slot name="left">
          <UiText>
            amazing
          </UiText>
        </slot>
      </div>

      <div class="side right">
        <SparklesSparkles type="asterisk" />
        <slot name="right">
          <UiText>
            fantastic
          </UiText>
        </slot>
      </div>

      <div class="side top">
        <SparklesSparkles type="diamond" />
        <slot name="top">
          <UiText>
            magnificent
          </UiText>
        </slot>
      </div>

      <div class="side bottom">
        <SparklesSparkles type="cross" />
        <slot name="bottom">
          <UiText>
            wonderful
          </UiText>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SideType } from '~/utils/sides';
import { SIDES } from '~/utils/sides';

const props = defineProps<{
  side: SideType;
}>();

const emit = defineEmits<{
  'update:side': [side: SideType];
}>();

const getRandomAvailableSideIndex = (currentIndex: number): number | undefined => {
  const availableIndices = SIDES
    .map((_, index) => index)
    .filter((index) => index !== currentIndex);

  const randomIndex = Math.floor(Math.random() * availableIndices.length);

  return availableIndices[randomIndex];
};

const spinCube = (): void => {
  const currentIndex = SIDES.indexOf(props.side);
  const nextIndex = getRandomAvailableSideIndex(currentIndex);

  if (nextIndex === undefined) {
    return;
  }

  const nextSide = SIDES[nextIndex];

  if (!nextSide) {
    return;
  }

  emit('update:side', nextSide);
};
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
    --surface-color: #3973cc;
    background: var(--surface-color);
    transform: translateZ(250px);
  }

  &.back {
    --surface-color: #e05a5a;
    background: var(--surface-color);
    transform: rotateY(180deg) rotateZ(90deg) translateZ(250px);
  }

  &.left {
    --surface-color: #e09c36;
    background: var(--surface-color);
    transform: rotateY(-90deg) rotateZ(180deg) translateZ(250px);
  }

  &.right {
    --surface-color: #36b374;
    background: var(--surface-color);
    transform: rotateY(90deg) rotateZ(-90deg) translateZ(250px);
  }

  &.top {
    --surface-color: #36b0c2;
    background: var(--surface-color);
    transform: rotateX(90deg) rotateZ(90deg) translateZ(250px);
  }

  &.bottom {
    --surface-color: #9b6bc2;
    background: var(--surface-color);
    transform: rotateX(-90deg) rotateZ(180deg) translateZ(250px);
  }
}
</style>
